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
  const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
  try {
    for(const [lang,filename] of [["it","pre-order.html"],["en","pre-order-en.html"],["es","pre-order-es.html"]]) {
      for(const [label,width,height] of [["mobile",390,844],["desktop",1365,900]]) {
        const page=await browser.newPage();
        await page.setViewport({width,height,deviceScaleFactor:1});
        const errors=[];
        page.on("pageerror",error=>errors.push(error.message));
        const url="http://127.0.0.1:"+server.address().port+"/"+filename;
        const response=await page.goto(url,{waitUntil:"networkidle0",timeout:25000});
        const facts=await page.evaluate(async()=>{
          const imgs=[...document.querySelectorAll(".pdt-edition-atlas img")];
          await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));
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
        assert(facts.images.length===3&&facts.images.every(x=>x.loaded&&x.width===2880&&x.height===720),lang+" "+label+": images failed to decode at 2880x720");
        assert(facts.overflow<=5,lang+" "+label+": horizontal overflow "+facts.overflow+"px");
        assert(facts.hasForm&&facts.footer,lang+" "+label+": missing form/footer");
        assert(facts.language===lang,lang+" "+label+": incorrect lang attribute");
        assert(!errors.length,lang+" "+label+": JavaScript error "+errors.join("; "));
        const section=await page.$("#editions");
        await section.screenshot({path:path.join(screenshots,lang+"-"+label+".png")});
        await page.click('a[data-edition-choice="mid"]');
        const edition=await page.$eval('select[name="edition"]',node=>node.value);
        assert(edition==="mid",lang+" "+label+": edition CTA did not update enquiry form");
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
  console.log("PASS: 6 browser renders, image decoding, responsive overflow, JS, edition form selection");
}
run().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1;});
