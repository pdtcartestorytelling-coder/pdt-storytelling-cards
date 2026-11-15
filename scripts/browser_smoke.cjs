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
        for(let i=0;i<3;i++){
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
            hasForm:!!document.querySelector('form[data-interest-mailto] select[name="edition"]'),
            footer:!!footer,
            language:document.documentElement.lang
          };
        });
        console.log(lang,label,JSON.stringify(facts));
        assert(response.status()===200,lang+" "+label+": HTTP "+response.status());
        assert(facts.cardCount===3,lang+" "+label+": missing edition cards");
        const variants=await page.evaluate(()=>[...document.querySelectorAll(".pdt-edition-image")].map(x=>({
          webp:x.querySelector("img")?.getAttribute("src"),
          avif:x.querySelector("source")?.getAttribute("srcset"),
          href:x.querySelector("a")?.getAttribute("href")
        })));
        for(let i=0;i<3;i++){
          let tier=["essential","studio","signature"][i];
          assert(variants[i].webp==="images/pdt-"+tier+"-hq.webp",lang+" "+label+": wrong WebP for "+tier);
          assert(variants[i].avif==="images/pdt-"+tier+"-hq.avif",lang+" "+label+": wrong AVIF for "+tier);
          assert(variants[i].href===variants[i].webp,lang+" "+label+": full resolution preview broken for "+tier);
        }
        assert(facts.images.length===3&&facts.images.every(x=>x.loaded&&x.width===960&&x.height===720),lang+" "+label+": images failed to decode at 960x720");
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
        await page.click('a[data-edition-choice="mid"]');
        const edition=await page.$eval('select[name="edition"]',node=>node.value);
        assert(edition==="mid",lang+" "+label+": edition CTA did not update enquiry form");
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
          editionCount:document.querySelectorAll(".pdt-h-edition").length,
          progress:!!document.querySelector(".pdt-reading-progress"),
          overflow:document.documentElement.scrollWidth-window.innerWidth,
          preOrderLink:!!document.querySelector(".pdt-h-cta-actions a[href*='pre-order']"),
          logo:!!document.querySelector(".brand-logo")
        }));
        console.log("home",lang,label,JSON.stringify(facts));
        assert(response.status()===200,lang+" home "+label+": HTTP "+response.status());
        assert(facts.language===lang,lang+" home "+label+": wrong language");
        assert(facts.heroImage>0&&facts.title,lang+" home "+label+": hero missing");
        assert(facts.editionCount===3,lang+" home "+label+": missing product editions");
        // First-screen discovery must be keyboard/click accessible and reveal useful content.
        const firstActions=await page.$$eval(".pdt-first-action-option",nodes=>nodes.length);
        assert(firstActions===3,lang+" home "+label+": missing first-click choices");
        await page.click(".pdt-first-action-option:nth-child(1) summary");
        const firstOpened=await page.$eval(".pdt-first-action-option:nth-child(1)",el=>el.open);
        assert(firstOpened,lang+" home "+label+": first option failed to open");
        const firstDetail=await page.$eval(".pdt-first-action-option:nth-child(1) .pdt-first-action-answer",el=>({
          text:el.querySelector("p")?.textContent,
          href:el.querySelector("a")?.getAttribute("href")
        }));
        assert(firstDetail.text&&firstDetail.href,lang+" home "+label+": first choice does not reveal prompt/link");
        await page.click(".pdt-first-action-option:nth-child(2) summary");
        const secondOpened=await page.$eval(".pdt-first-action-option:nth-child(2)",el=>el.open);
        const firstClosed=await page.$eval(".pdt-first-action-option:nth-child(1)",el=>!el.open);
        console.log("home first-click state",lang,label,JSON.stringify({firstOpened,secondOpened,firstClosed}));
        assert(secondOpened,lang+" home "+label+": second interactive option does not open");
        assert(facts.progress&&facts.logo&&facts.preOrderLink,lang+" home "+label+": missing motion/brand/CTA");
        assert(facts.overflow<=5,lang+" home "+label+": horizontal overflow "+facts.overflow+"px");
        assert(!errors.length,lang+" home "+label+": JavaScript error "+errors.join("; "));
        await page.evaluate(()=>{
          document.documentElement.style.scrollBehavior="auto";
          document.querySelector(".pdt-h-edition").scrollIntoView({block:"center",behavior:"instant"});
        });
        await page.waitForFunction(()=>document.querySelector(".pdt-h-edition").classList.contains("pdt-is-visible"),{timeout:5000});
        await page.screenshot({path:path.join(screenshots,"home-"+lang+"-"+label+".png"),fullPage:false,timeout:12000});
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
  console.log("PASS: 18 browser renders including accessible first-click discovery across home and pre-order, product assets, motion, responsive overflow, JS and edition form selection");
}
run().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1;});
