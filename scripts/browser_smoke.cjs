"use strict";
/**
 * Browser smoke: 3 languages × mobile/desktop.
 * Start a local server, render the actual HTML/CSS/JS with Chrome,
 * assert images decode and CTA edition selection works.
 */
const puppeteer = require("puppeteer-core");
const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const screenshots = path.join(root, "browser-test-screenshots");
fs.mkdirSync(screenshots, { recursive: true });
const mime = {".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".avif":"image/avif", ".webp":"image/webp", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".ico":"image/x-icon"};
const server = http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let full = path.resolve(root, "." + pathname);
    if (!full.startsWith(root + path.sep) && full !== root) {
      res.writeHead(403).end();
      return;
    }
    if (fs.statSync(full).isDirectory()) full = path.join(full, "index.html");
    res.writeHead(200, {"Content-Type":mime[path.extname(full)] || "application/octet-stream"});
    fs.createReadStream(full).pipe(res);
  } catch (_) {res.writeHead(404).end();}
});
function assert(ok, message) {if (!ok) throw new Error(message);}
async function verifyScrollingBackdrop(page,selector){
  return page.evaluate(async selector=>{
    const section=document.querySelector(selector);
    if(!section)return {missing:true};
    const initial=section.getBoundingClientRect();
    const midpoint=window.scrollY+initial.top+initial.height/2-window.innerHeight/2;
    window.scrollTo({top:Math.max(0,Math.round(midpoint)),behavior:"instant"});
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const first=section.style.getPropertyValue("--pdt-scene-y");
    const xFirst=section.style.getPropertyValue("--pdt-scene-x");
    const sweep=section.querySelector(".pdt-cinema-sweep");
    const edge=section.querySelector(".pdt-cinema-edge");
    const firstSweep=sweep?.style.transform;
    const firstEdge=edge?.style.transform;
    window.scrollTo({top:window.scrollY+150,behavior:"instant"});
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const second=section.style.getPropertyValue("--pdt-scene-y");
    const backdrop=getComputedStyle(section,"::before");
    return {
      enabled:section.classList.contains("pdt-scroll-scene"),
      first,second,xFirst,
      rendered:backdrop.backgroundImage.includes("radial-gradient"),
      transform:backdrop.transform,
      cinema:section.classList.contains("pdt-cinema-scene"),
      firstSweep,secondSweep:sweep?.style.transform,
      firstEdge,secondEdge:edge?.style.transform,
      edgeCount:document.querySelectorAll(".pdt-cinema-edge").length
    };
  },selector);
}
async function run() {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const chrome=process.env.CHROME_BIN || execSync("which google-chrome || which chromium || which chromium-browser").toString().trim();
  console.log("Using browser",chrome);
  const browser=await puppeteer.launch({executablePath:chrome,headless:true,timeout:20000,args:["--no-sandbox","--disable-dev-shm-usage"]});
  try {
    for(const [lang,filename] of [["it","pre-order.html"],["en","pre-order-en.html"],["es","pre-order-es.html"]]) {
      for(const [label,width,height] of [["small",320,720],["mobile",390,844],["desktop",1365,900]]) {
        const page=await browser.newPage();
        await page.setViewport({width,height,deviceScaleFactor:1});
        const errors=[];
        page.on("pageerror",error=>errors.push(error.message));
        const url="http://127.0.0.1:"+server.address().port+"/"+filename;
        const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:15000});
        // Lazy images must enter the viewport before Chrome begins downloading.
        // Scroll each card individually, including those below the fold on mobile.
        for(let i=0;i<1;i++){
          await page.evaluate(index=>{
            document.querySelectorAll(".pdt-edition-image img")[index].scrollIntoView({block:"center"});
          },i);
          await page.waitForFunction(index=>{
            const img=document.querySelectorAll(".pdt-edition-image img")[index];
            return img && img.complete && img.naturalWidth>0;
          },{timeout:12000},i);
        }
        const facts=await page.evaluate(()=>{
          const imgs=[...document.querySelectorAll(".pdt-edition-image img")];
          const footer=document.querySelector("footer");
          return {
            title:document.title,
            cardCount:document.querySelectorAll(".pdt-tier-card").length,
            images:imgs.map(x=>({loaded:x.complete,width:x.naturalWidth,height:x.naturalHeight})),
            overflow:document.documentElement.scrollWidth - window.innerWidth,
            hasForm:!!document.querySelector('form[data-interest-mailto] input[type="hidden"][name="edition"][value="top"]'),
            footer:!!footer,
            language:document.documentElement.lang
          };
        });
        console.log(lang,label,JSON.stringify(facts));
        assert(response.status()===200,lang+" "+label+": HTTP "+response.status());
        assert(facts.cardCount===1,lang+" "+label+": expected only Signature");
        const variants=await page.evaluate(()=>[...document.querySelectorAll(".pdt-edition-image")].map(x=>({
          webp:x.querySelector("img")?.getAttribute("src"),
          avif:x.querySelector("source")?.getAttribute("srcset"),
          href:x.querySelector("a")?.getAttribute("href")
        })));
        assert(variants[0].webp==="images/pdt-cofanetto-signature-2026.webp"&&variants[0].avif==null,
          lang+" "+label+": final Signature rendering is not in the card");

        assert(variants.every(x=>x.href==null),lang+" "+label+": image links must remain disabled");
        assert(facts.images.length===1&&facts.images[0].loaded&&
          facts.images[0].width===1448&&facts.images[0].height===1086,
          lang+" "+label+": definitive Signature image failed to decode");
        const imageControls=await page.evaluate(()=>({
          galleryImages:document.querySelectorAll(".preorder-gallery-card .preorder-gallery-image img").length,
          clickableImages:document.querySelectorAll('.pdt-edition-preview a, a.pdt-edition-preview, .preorder-gallery-image a, a.preorder-gallery-image, .preorder-gallery-caption a[href^="images/"]').length,
          enlargeButtons:document.querySelectorAll(".pdt-edition-open,.preorder-gallery-open").length
        }));
        assert(imageControls.galleryImages===4,lang+" "+label+": product gallery images missing");
        // Front/back artwork is lazy-loaded. Trigger it explicitly during QA;
        // keep native lazy-loading enabled for real visitors.
        await page.evaluate(()=>{
          [...document.querySelectorAll(".preorder-gallery-card .preorder-gallery-image img")]
            .slice(0,2).forEach(img=>{img.loading="eager"});
        });
        await page.waitForFunction(()=>{
          const imgs=[...document.querySelectorAll(".preorder-gallery-card .preorder-gallery-image img")];
          return imgs.length>=2&&imgs[0].complete&&imgs[0].naturalWidth>0&&
            imgs[1].complete&&imgs[1].naturalWidth>0;
        },{timeout:12000});
        const definitive=await page.evaluate(()=>{
          const hero=document.querySelector(".preorder-hero-product img");
          const gallery=[...document.querySelectorAll(".preorder-gallery-card .preorder-gallery-image img")];
          return {
            hero:hero?.getAttribute("src"),
            heroLoaded:hero?.complete&&hero?.naturalWidth===1448,
            gallerySources:gallery.map(img=>img.getAttribute("src")),
            frontLoaded:gallery[0]?.complete&&gallery[0]?.naturalWidth===1002,
            backLoaded:gallery[1]?.complete&&gallery[1]?.naturalWidth===1497,
            madeInItaly:!!document.querySelector(".pdt-origin--product"),
            imageFit:getComputedStyle(hero).objectFit
          };
        });
        assert(definitive.hero==="images/pdt-cofanetto-signature-2026.webp"&&definitive.heroLoaded,
          lang+" "+label+": final box render missing from product hero");
        assert(definitive.gallerySources[0]==="images/pdt-grafica-frontale-2026.webp"&&
          definitive.gallerySources[1]==="images/pdt-grafica-retro-2026.webp",
          lang+" "+label+": final packaging artwork missing from gallery");
        assert(definitive.frontLoaded&&definitive.backLoaded&&definitive.madeInItaly&&definitive.imageFit==="contain",
          lang+" "+label+": definitive gallery or Made in Italy module incomplete");
        assert(imageControls.clickableImages===0&&imageControls.enlargeButtons===0,lang+" "+label+": fullscreen image controls must be removed");
        assert(facts.overflow<=5,lang+" "+label+": horizontal overflow "+facts.overflow+"px");
        assert(facts.hasForm&&facts.footer,lang+" "+label+": missing form/footer");
        assert(facts.language===lang,lang+" "+label+": incorrect lang attribute");
        assert(!errors.length,lang+" "+label+": JavaScript error "+errors.join("; "));
        const noOverlay=await page.$(".privacy-notice");
        assert(!noOverlay,lang+" "+label+": old privacy overlay covers product");
        await page.evaluate(()=>{
          document.documentElement.style.scrollBehavior="auto";
          const section=document.querySelector("#editions");
          window.scrollTo({top:Math.max(0,section.getBoundingClientRect().top+window.scrollY-115),behavior:"instant"});
        });
        // Capture the completed visual state, not an intermediate fade-in frame.
        await new Promise(resolve=>setTimeout(resolve,1000));
        await page.screenshot({path:path.join(screenshots,lang+"-"+label+".png"),fullPage:false,timeout:12000});
        // Mobile menu should toggle reliably and remain keyboard accessible.
        if(width<=980){
          await page.click(".menu-toggle");
          const expanded=await page.$eval(".menu-toggle",el=>el.getAttribute("aria-expanded"));
          assert(expanded==="true",lang+" "+label+": mobile menu does not open");
          await page.click(".menu-toggle");
          await page.evaluate(()=>{
            document.documentElement.style.scrollBehavior="auto";
            document.querySelector("#interest").scrollIntoView({behavior:"instant",block:"center"});
          });
          await page.waitForFunction(()=>document.querySelector(".preorder-mobile-action")?.classList.contains("is-hidden"),{timeout:5000});
        }
        const commerce=await page.evaluate(()=>({
          cards:[...document.querySelectorAll(".pdt-tier-card")].map(x=>x.dataset.shopCard),
          prices:[...document.querySelectorAll(".pdt-shop-card-price strong")].map(x=>x.textContent.trim()),
          links:[...document.querySelectorAll("a[data-shop-edition]")].map(x=>({edition:x.dataset.shopEdition,href:x.getAttribute("href")})),
          inputFields:["name","email","edition","quantity","destination","message"].every(n=>!!document.querySelector('form[data-interest-mailto] [name="'+n+'"]')),
          privacy:!!document.querySelector('form[data-interest-mailto] input[name="privacy_acknowledged"][required]'),
          minimalForm:!document.querySelector('form[data-interest-mailto] [name="sector"],form[data-interest-mailto] [name="interest"]'),
          enquiryCTAs:[".preorder-actions .preorder-btn--primary",".pdt-tier-link",".preorder-mobile-action a"].every(sel=>document.querySelector(sel)?.getAttribute("href")==="#interest"),
          fallback:!!document.querySelector("[data-shop-copy]"),
          studioVisible:document.querySelector(".pdt-tier-grid")?.textContent.includes("PdT Studio"),
          imageMotion:[...document.querySelectorAll(".pdt-edition-preview picture")].every(x=>x.classList.contains("pdt-reveal-photo"))
          
        }));
        assert(commerce.cards.join(",")==="signature",lang+" "+label+": only Signature should remain");
        assert(commerce.prices.length===1&&commerce.prices[0]==="149 €",lang+" "+label+": Signature pre-order must cost 149 EUR");
        const referencePrice=await page.$eval(".pdt-shop-card-price .pdt-future-price",x=>x.textContent.trim());
        assert(referencePrice.includes("199"),lang+" "+label+": planned 199 EUR list reference missing");
        assert(commerce.links.some(x=>x.edition==="signature"&&x.href.startsWith("mailto:pdtstorytellingcards@gmail.com?subject=")&&x.href.includes("body=")),lang+" "+label+": Signature mailto not ready");
        assert(commerce.links.some(x=>x.href.includes("149")&&x.href.includes("199")),lang+" "+label+": email draft missing pre-order pricing");
        assert(commerce.links.every(x=>x.edition==="signature"),lang+" "+label+": retired edition still has email CTA");
        assert(commerce.inputFields&&commerce.privacy&&commerce.fallback&&!commerce.studioVisible,lang+" "+label+": commercial request flow incomplete");
        assert(commerce.minimalForm&&commerce.enquiryCTAs,lang+" "+label+": simplified enquiry path missing");
        assert(commerce.imageMotion,lang+" "+label+": product image reveal not initialised");
        if(label==="desktop"){
          const depth=await page.evaluate(async()=>{
            // Earlier screenshot setup temporarily forced immediate scrolling.
            // Restore the stylesheet's scroll behavior before testing it.
            document.documentElement.style.removeProperty("scroll-behavior");
            window.scrollTo({top:250,behavior:"instant"});
            await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
            const visual=document.querySelector(".preorder-hero-product");
            const shift=visual.style.getPropertyValue("--pdt-hero-shift");
            const smooth=getComputedStyle(document.documentElement).scrollBehavior;
            return {shift,smooth};
          });
          assert(depth.smooth==="smooth",lang+" pre-order: anchored scrolling is not smooth");
          assert(depth.shift&&Number.parseFloat(depth.shift)<0,lang+" pre-order: hero depth does not respond to scroll");
          const backdrop=await verifyScrollingBackdrop(page,".pdt-tier-section");
          assert(backdrop.enabled&&backdrop.rendered&&backdrop.transform!=="none",lang+" pre-order: decorative backdrop not rendered");
          assert(backdrop.first!==""&&backdrop.second!==""&&backdrop.first!==backdrop.second,
            lang+" pre-order: section background does not move during scroll");
          assert(backdrop.cinema&&backdrop.edgeCount>0&&backdrop.firstSweep&&backdrop.firstSweep!==backdrop.secondSweep,
            lang+" "+label+": cinematic sweep is not moving continuously");
          assert(backdrop.firstEdge&&backdrop.secondEdge,
            lang+" "+label+": chapter edge progress missing");
          const chapter=await page.evaluate(()=>{
            const section=document.querySelector(".pdt-tier-section");
            return {
              count:document.querySelectorAll(".pdt-scroll-scene").length,
              marker:section.dataset.pdtChapter,
              markerText:getComputedStyle(section,"::after").content,
              rail:!!document.querySelector(".pdt-journey"),
              railLabel:document.querySelector(".pdt-journey-count")?.textContent
            };
          });
          assert(chapter.count===6&&chapter.marker==="02"&&chapter.markerText.includes("02"),lang+" pre-order: visible story chapters missing");
          assert(chapter.rail&&chapter.railLabel,lang+" pre-order: scrolling chapter guide missing");
        }
        await page.close();
      }
    }
    // Home product-first motion smoke: check all languages and responsive widths.
    for (const [lang,filename] of [["it","index.html"],["en","home-en.html"],["es","home-es.html"]]) {
      for (const [label,width,height] of [["small",320,720],["mobile",390,844],["desktop",1365,900]]) {
        const page=await browser.newPage();
        await page.setViewport({width,height,deviceScaleFactor:1});
        const errors=[];
        page.on("pageerror",error=>errors.push(error.message));
        const response=await page.goto("http://127.0.0.1:"+server.address().port+"/"+filename,{waitUntil:"domcontentloaded",timeout:15000});
        await page.waitForFunction(()=>{
          const image=document.querySelector(".pdt-h-hero-figure img");
          return image && image.complete && image.naturalWidth>0;
        },{timeout:12000});
        const facts=await page.evaluate(()=>({
          language:document.documentElement.lang,
          title:document.querySelector(".pdt-h-hero h1")?.textContent,
          heroImage:document.querySelector(".pdt-h-hero-figure img")?.naturalWidth,
          heroImageHeight:document.querySelector(".pdt-h-hero-figure img")?.naturalHeight,
          heroImageSrc:document.querySelector(".pdt-h-hero-figure img")?.getAttribute("src"),
          heroImageFit:getComputedStyle(document.querySelector(".pdt-h-hero-figure img")).objectFit,
          heroGradient:getComputedStyle(document.querySelector(".pdt-h-hero")).backgroundImage,
          heroHeadingColor:getComputedStyle(document.querySelector(".pdt-h-hero h1")).color,
          headerColor:getComputedStyle(document.querySelector(".site-header")).backgroundColor,
          photoFrame:(()=>{
            const style=getComputedStyle(document.querySelector(".pdt-h-hero-figure"));
            return {padding:style.paddingLeft,borderWidth:style.borderLeftWidth,borderColor:style.borderLeftColor,backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage};
          })(),
          homeNavigation:(()=>{
            const link=document.querySelector(".nav-links li:first-child a");
            return {text:link?.textContent.trim(),href:link?.getAttribute("href"),active:link?.getAttribute("aria-current")};
          })(),
          heroImageRenderedRatio:(()=>{
            const rect=document.querySelector(".pdt-h-hero-figure img").getBoundingClientRect();
            return rect.width/rect.height;
          })(),
          editionCount:document.querySelectorAll(".pdt-h-edition").length,
          buyLabel:document.querySelector(".pdt-h-buy-btn")?.textContent.trim(),
          buyHref:document.querySelector(".pdt-h-buy-btn")?.getAttribute("href"),
          heroLaunch:document.querySelector(".pdt-h-purchase-cta p")?.textContent,
          heroValue:document.querySelector(".pdt-h-lead")?.textContent,
          heroSecondary:document.querySelector(".pdt-h-actions a")?.getAttribute("href"),
          heroPrimaryCount:document.querySelectorAll(".pdt-h-hero .pdt-h-btn-primary").length,
          signaturePrice:document.querySelector(".pdt-h-edition:first-child .pdt-shop-home-price")?.textContent,
          comparePrice:document.querySelector(".pdt-h-edition:first-child .pdt-future-price")?.textContent,
          revealImages:[...document.querySelectorAll(".pdt-h-edition picture")].every(x=>x.classList.contains("pdt-reveal-photo")),
          progress:!!document.querySelector(".pdt-reading-progress"),
          overflow:document.documentElement.scrollWidth-window.innerWidth,
          preOrderLink:!!document.querySelector('.pdt-h-cta-actions a[data-shop-edition="signature"][href^="mailto:"]'),
          logo:!!document.querySelector(".brand-logo")
        }));
        console.log("home",lang,label,JSON.stringify(facts));
        assert(response.status()===200,lang+" home "+label+": HTTP "+response.status());
        assert(facts.language===lang,lang+" home "+label+": wrong language");
        assert(facts.heroImage>0&&facts.title,lang+" home "+label+": hero missing");
        assert(facts.heroImageSrc==="images/pdt-cofanetto-signature-2026.webp",lang+" home "+label+": wrong closed-box image");
        assert(facts.heroImage===1448&&facts.heroImageHeight===1086,lang+" home "+label+": closed-box asset dimensions invalid");
        assert(facts.heroImageFit==="contain",lang+" home "+label+": hero image may be cropped");
        assert(facts.heroGradient.includes("rgb(23, 75, 127)")&&facts.heroGradient.includes("rgb(11, 47, 88)"),lang+" home "+label+": homepage lost brand blue gradient");
        assert(facts.heroHeadingColor==="rgb(255, 250, 243)",lang+" home "+label+": homepage heading color does not match interior pages");
        assert(facts.headerColor==="rgba(18, 63, 111, 0.97)",lang+" home "+label+": header differs from interior pages");
        assert(facts.photoFrame.padding==="0px"&&facts.photoFrame.borderWidth==="1px",lang+" home "+label+": box has a padded frame");
        assert(facts.photoFrame.backgroundColor==="rgba(0, 0, 0, 0)"&&facts.photoFrame.backgroundImage==="none",lang+" home "+label+": box still has a white backing");
        assert(facts.photoFrame.borderColor.includes("7, 12, 20"),lang+" home "+label+": missing dark border");
        assert(facts.homeNavigation.text==="Home"&&facts.homeNavigation.href===filename&&facts.homeNavigation.active==="page",lang+" home "+label+": inconsistent Home navigation");
        assert(Math.abs(facts.heroImageRenderedRatio-4/3)<0.02,lang+" home "+label+": distorted image aspect ratio");
        assert(facts.editionCount===1,lang+" home "+label+": expected one Signature card");
        assert(facts.buyLabel===({it:"Richiedi disponibilità",en:"Enquire about availability",es:"Consultar disponibilidad"})[lang],lang+" home "+label+": primary buy label not concise");
        assert(facts.buyHref===({it:"pre-order.html#editions",en:"pre-order-en.html#editions",es:"pre-order-es.html#editions"})[lang],lang+" home "+label+": primary buy link changed");
        assert(facts.signaturePrice.includes("149")&&facts.signaturePrice.includes("199"),lang+" home "+label+": wrong Signature pre-order/reference price");
        assert(facts.heroLaunch.includes("149")&&facts.heroLaunch.includes("50"),lang+" home "+label+": launch price/batch missing near main CTA");
        assert(["102","60","22"].every(n=>facts.heroValue.includes(n)),lang+" home "+label+": kit value missing from first section");
        assert(facts.heroSecondary==="#kit"&&facts.heroPrimaryCount===1,lang+" home "+label+": hero CTA hierarchy is unclear");
        assert(facts.comparePrice.includes("199"),lang+" home "+label+": planned future list reference missing");
        assert(!facts.signaturePrice.includes("189"),lang+" home "+label+": previous Signature offer remains");
        assert(facts.revealImages,lang+" home "+label+": photo reveal not initialised");
        // The below-the-fold Signature card uses native lazy-loading.
        // During QA, decode it before checking pixel dimensions.
        await page.evaluate(()=>{
          const photo=document.querySelector(".pdt-h-edition:first-child picture img");
          if(photo)photo.loading="eager";
        });
        await page.waitForFunction(()=>{
          const img=document.querySelector(".pdt-h-edition:first-child picture img");
          return !!img&&img.complete&&img.naturalWidth>0;
        },{timeout:12000});
        const newPackaging=await page.evaluate(()=>{
          const hero=document.querySelector(".pdt-h-hero-figure img");
          const signature=document.querySelector(".pdt-h-edition:first-child picture img");
          return {
            heroSrc:hero?.getAttribute("src"),heroLoaded:hero?.complete&&hero?.naturalWidth===1448,
            signatureSrc:signature?.getAttribute("src"),
            signatureLoaded:signature?.complete&&signature?.naturalWidth===1448,
            origin:!!document.querySelector(".pdt-origin--home"),
            imgFit:getComputedStyle(hero).objectFit
          };
        });
        assert(newPackaging.heroSrc==="images/pdt-cofanetto-signature-2026.webp"&&newPackaging.heroLoaded,
          lang+" home "+label+": new 3D rendering missing from hero");
        assert(newPackaging.signatureSrc===newPackaging.heroSrc&&newPackaging.signatureLoaded,
          lang+" home "+label+": Signature edition still displays old box");
        assert(newPackaging.origin&&newPackaging.imgFit==="contain",
          lang+" home "+label+": Italian provenance section or full box display missing");
        if(label==="desktop"){
          const depth=await page.evaluate(async()=>{
            window.scrollTo({top:260,behavior:"instant"});
            await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
            return {
              shift:document.querySelector(".pdt-h-hero-figure").style.getPropertyValue("--pdt-hero-shift"),
              smooth:getComputedStyle(document.documentElement).scrollBehavior,
              photoFit:getComputedStyle(document.querySelector(".pdt-h-hero-figure img")).objectFit
            };
          });
          assert(depth.smooth==="smooth",lang+" home: smooth anchor scrolling is not active");
          assert(depth.shift&&Number.parseFloat(depth.shift)<0,lang+" home: hero depth does not respond to scroll");
          assert(depth.photoFit==="contain",lang+" home: hero depth must not crop box image");
          const backdrop=await verifyScrollingBackdrop(page,".pdt-h-kit");
          assert(backdrop.enabled&&backdrop.rendered&&backdrop.transform!=="none",lang+" home: decorative backdrop not rendered");
          assert(backdrop.first!==""&&backdrop.second!==""&&backdrop.first!==backdrop.second,
            lang+" home: section background does not move during scroll");
          assert(backdrop.cinema&&backdrop.edgeCount>0&&backdrop.firstSweep&&backdrop.firstSweep!==backdrop.secondSweep,
            lang+" "+label+": cinematic sweep is not moving continuously");
          assert(backdrop.firstEdge&&backdrop.secondEdge,
            lang+" "+label+": chapter edge progress missing");
          const chapter=await page.evaluate(()=>{
            const section=document.querySelector(".pdt-h-kit");
            return {
              count:document.querySelectorAll(".pdt-scroll-scene").length,
              marker:section.dataset.pdtChapter,
              markerText:getComputedStyle(section,"::after").content,
              rail:!!document.querySelector(".pdt-journey"),
              railLabel:document.querySelector(".pdt-journey-count")?.textContent
            };
          });
          assert(chapter.count===4&&chapter.marker==="01"&&chapter.markerText.includes("01"),lang+" home: visible story chapters missing");
          assert(chapter.rail&&chapter.railLabel,lang+" home: scrolling chapter guide missing");
        }
        const shopLinks=await page.$$eval("a[data-shop-edition]",nodes=>nodes.map(n=>({name:n.dataset.shopEdition,href:n.getAttribute("href")})));
        assert(shopLinks.some(x=>x.name==="signature"&&x.href.startsWith("mailto:")),lang+" home "+label+": no email purchase CTA");
        assert(shopLinks.every(x=>x.name==="signature"),lang+" home "+label+": retired edition still has a CTA");
        // All three contexts now navigate directly with one accessible link.
        const useLinks=await page.$$eval(".pdt-first-action-link",nodes=>nodes.map(node=>({
          tag:node.tagName,
          title:node.querySelector(".pdt-first-action-choice")?.textContent.trim(),
          href:node.getAttribute("href"),
          lang:node.getAttribute("hreflang"),
          minHeight:getComputedStyle(node).minHeight
        })));
        const usePages=["utilizzo-individuale.html","setting-gruppo.html","risorse-umane.html"];
        assert(useLinks.length===3,lang+" home "+label+": three context links missing");
        assert(useLinks.every((x,i)=>x.tag==="A"&&x.title&&x.href===usePages[i]),
          lang+" home "+label+": context navigation is not direct");
        assert(useLinks.every(x=>Number.parseFloat(x.minHeight)>=48),
          lang+" home "+label+": context links are too small for touch");
        assert(useLinks.every(x=>lang==="it"?!x.lang:x.lang==="it"),
          lang+" home "+label+": untranslated destination should be marked IT");
        const legacyAccordion=await page.$$(".pdt-first-action-option, .pdt-first-action-answer");
        assert(legacyAccordion.length===0,lang+" home "+label+": obsolete accordions still present");
        assert(facts.progress&&facts.logo&&facts.preOrderLink,lang+" home "+label+": missing motion/brand/CTA");
        assert(facts.overflow<=5,lang+" home "+label+": horizontal overflow "+facts.overflow+"px");
        assert(!errors.length,lang+" home "+label+": JavaScript error "+errors.join("; "));
        await page.evaluate(()=>{
          document.documentElement.style.scrollBehavior="auto";
          document.querySelector(".pdt-h-edition").scrollIntoView({block:"center",behavior:"instant"});
        });
        await page.waitForFunction(()=>document.querySelector(".pdt-h-edition").classList.contains("pdt-is-visible"),{timeout:5000});
        await new Promise(resolve=>setTimeout(resolve,1000));
        await page.screenshot({path:path.join(screenshots,"home-"+lang+"-"+label+".png"),fullPage:false,timeout:12000});
        if(label==="desktop"){
          await Promise.all([
            page.waitForNavigation({waitUntil:"domcontentloaded",timeout:8000}),
            page.click(".pdt-first-action-link:first-child")
          ]);
          assert(new URL(page.url()).pathname.endsWith("/utilizzo-individuale.html"),
            lang+" home: context row did not navigate to individual-use page");
        }
        await page.close();
      }
    }
    // Signature product page: local images, responsive layout, direct enquiry (all languages).
    for(const [lang,file,preorder] of [["it","prodotto.html","pre-order.html"],["en","product-en.html","pre-order-en.html"],["es","product-es.html","pre-order-es.html"]]){
      for(const width of [320,1365]){
        const page=await browser.newPage();
        await page.setViewport({width,height:900,deviceScaleFactor:1});
        const errors=[];page.on("pageerror",error=>errors.push(error.message));
        const response=await page.goto("http://127.0.0.1:"+server.address().port+"/"+file,{waitUntil:"domcontentloaded",timeout:15000});
        await page.waitForFunction(()=>{const img=document.querySelector(".sig-hero-photo img");return img&&img.complete&&img.naturalWidth===1448;},{timeout:12000});
        const info=await page.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,cta:[...document.querySelectorAll(".sig-primary")].map(a=>a.getAttribute("href")),cards:document.querySelectorAll(".sig-card").length,contexts:document.querySelectorAll("#contexts .sig-context").length,specs:document.querySelectorAll("#specifications .sig-context").length,price:document.querySelector(".sig-price")?.textContent,style:getComputedStyle(document.querySelector(".sig-hero-grid")).display}));
        assert(response.status()===200&&info.lang===lang&&info.overflow<=5&&info.style==="grid",file+" "+width+": product page layout");
        assert(info.cta.length===2&&info.cta.every(x=>x===preorder+"#interest")&&info.cards===3&&info.contexts===3&&info.specs===3&&info.price.includes("149")&&info.price.includes("199")&&!errors.length,file+": product contents or enquiry missing");
        await page.screenshot({path:path.join(screenshots,"product-"+lang+"-"+width+".png"),fullPage:false,timeout:12000});
        await page.close();
      }
    }
    // Accessibility: visitors requesting less motion see fully readable content.
    const reducedPage=await browser.newPage();
    await reducedPage.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
    await reducedPage.goto("http://127.0.0.1:"+server.address().port+"/index.html",{waitUntil:"domcontentloaded"});
    const reduced=await reducedPage.evaluate(()=>({
      hidden:document.body.classList.contains("pdt-motion-enabled"),
      heroShift:document.querySelector(".pdt-h-hero-figure").style.getPropertyValue("--pdt-hero-shift"),
      scroll:getComputedStyle(document.documentElement).scrollBehavior,
      photos:getComputedStyle(document.querySelector(".pdt-h-edition picture img")).transform,
      editionVisible:getComputedStyle(document.querySelector(".pdt-h-edition")).opacity,
      sceneCount:document.querySelectorAll(".pdt-scroll-scene").length,
      cinemaCount:document.querySelectorAll(".pdt-cinema-sweep,.pdt-cinema-edge").length,
      cinemaEnabled:document.body.classList.contains("pdt-cinema-enabled"),
      heroBg:document.querySelector(".pdt-h-hero").style.getPropertyValue("--pdt-hero-bg-shift")
    }));
    assert(!reduced.hidden&&reduced.heroShift===""&&reduced.scroll==="auto", "Reduced motion: motion still enabled");
    assert(reduced.photos==="none"&&reduced.editionVisible==="1", "Reduced motion: photos or product cards not accessible");
    assert(reduced.sceneCount===0&&reduced.heroBg==="","Reduced motion: background animation should be disabled");
    assert(reduced.cinemaCount===0&&!reduced.cinemaEnabled,"Reduced motion: cinematic layers should not be created");
    const reducedRail=await reducedPage.$(".pdt-journey");
    assert(!reducedRail,"Reduced motion: journey marker must not appear");
    await reducedPage.close();
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
  console.log("PASS: 18 browser renders including scroll-linked image depth, reduced-motion accessibility, links, product images and responsive layouts");
}
run().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1;});
