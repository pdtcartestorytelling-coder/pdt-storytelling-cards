"use strict";
const puppeteer=require("puppeteer-core");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const {execSync}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const mime={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".webp":"image/webp",".png":"image/png",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
  try{
    const file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
    if(!file.startsWith(root+path.sep)||!fs.statSync(file).isFile())return res.writeHead(404).end();
    res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream"});
    fs.createReadStream(file).pipe(res);
  }catch(_){res.writeHead(404).end();}
});
const pages=["index.html","home-en.html","home-es.html","contatti.html","contact-en.html","contact-es.html","pre-order.html","pre-order-en.html","pre-order-es.html"];
async function run(){
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  let browser;
  try{
    const chrome=process.env.CHROME_BIN||execSync("which google-chrome || which chromium || which chromium-browser").toString().trim();
    browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
    for(const file of pages){
      const url="http://127.0.0.1:"+server.address().port+"/"+file;
      const page=await browser.newPage();
      try{
        await page.setViewport({width:390,height:844});
        await page.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
        await page.goto(url,{waitUntil:"domcontentloaded",timeout:12000});
        const info=await page.evaluate(()=>({
          lang:document.documentElement.lang,
          main:document.querySelector("main").id,
          skip:document.querySelector(".pdt-skip-link").getAttribute("href"),
          current:document.querySelector(".language-switcher a[aria-current=true]")?.getAttribute("lang"),
          images:[...document.images].every(x=>x.hasAttribute("alt")),
          reduced:getComputedStyle(document.documentElement).scrollBehavior
        }));
        assert.equal(info.skip,"#"+info.main,file);
        assert.equal(info.current,info.lang,file);
        assert.ok(info.images,file+" missing alt");
        assert.equal(info.reduced,"auto",file+" reduced motion");
        await page.keyboard.press("Tab");
        assert.ok(await page.$eval(".pdt-skip-link",e=>document.activeElement===e),file+" skip is not first tab");
        assert.notEqual(await page.$eval(".pdt-skip-link",e=>getComputedStyle(e).outlineStyle),"none");
        await page.keyboard.press("Enter");
        assert.ok(await page.$eval("main",e=>document.activeElement===e),file+" skip destination not focused");
        await page.$eval(".menu-toggle",e=>e.focus());
        await page.keyboard.press("Enter");
        assert.equal(await page.$eval(".menu-toggle",e=>e.getAttribute("aria-expanded")),"true");
        await page.keyboard.press("Tab");
        assert.ok(await page.$eval(".nav-panel",e=>e.contains(document.activeElement)),file+" menu keyboard navigation");
        await page.keyboard.press("Escape");
        assert.ok(await page.$eval(".menu-toggle",e=>e.getAttribute("aria-expanded")==="false"&&document.activeElement===e),file+" Escape focus");
        if(["index.html","home-en.html","home-es.html"].includes(file)){
          await page.$eval(".pdt-guide__toggle",e=>e.click());
          assert.ok(await page.$eval(".pdt-guide__answer",e=>!e.hidden&&e.getAttribute("aria-live")==="polite"));
          await page.keyboard.press("Escape");
          assert.ok(await page.$eval(".pdt-guide__toggle",e=>document.activeElement===e));
        }
      }finally{await page.close();}
      const nojs=await browser.newPage();
      try{
        await nojs.setViewport({width:390,height:844});
        await nojs.setJavaScriptEnabled(false);
        await nojs.goto(url,{waitUntil:"domcontentloaded",timeout:12000});
        const facts=await nojs.evaluate(()=>({
          menu:getComputedStyle(document.querySelector(".nav-panel")).visibility,
          toggle:getComputedStyle(document.querySelector(".menu-toggle")).display,
          visible:[...document.querySelectorAll(".reveal")].every(e=>getComputedStyle(e).opacity==="1"),
          skip:!!document.querySelector(".pdt-skip-link")
        }));
        assert.equal(facts.menu,"visible",file+" no-JS menu");
        assert.equal(facts.toggle,"none",file+" no-JS nonfunctional toggle");
        assert.ok(facts.visible&&facts.skip,file+" no-JS content");
      }finally{await nojs.close();}
      console.log(file,"accessibility smoke OK");
    }
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(err=>{console.error(err);process.exitCode=1;});
