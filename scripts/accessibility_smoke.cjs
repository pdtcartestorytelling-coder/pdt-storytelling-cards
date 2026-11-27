"use strict";
const puppeteer=require("puppeteer-core");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const {execSync}=require("node:child_process");
const root = path.resolve(process.env.PDT_WEB_ROOT || path.resolve(__dirname, ".."));
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
        await page.$eval(".menu-toggle",e=>{
          e.focus();
          e.addEventListener("click",event=>{e.dataset.testClickDetail=String(event.detail);},{once:true});
        });
        assert.ok(await page.$eval(".menu-toggle",e=>document.activeElement===e),file+" toggle must receive focus before Enter");
        await page.keyboard.press("Enter");
        assert.equal(await page.$eval(".menu-toggle",e=>e.getAttribute("aria-expanded")),"true");
        const menuDiagnostics=await page.evaluate(()=>{
          const panel=document.querySelector(".nav-panel"), first=panel.querySelector("a[href]"), button=document.querySelector(".menu-toggle");
          const style=e=>({display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility,opacity:getComputedStyle(e).opacity,rect:e.getBoundingClientRect().toJSON()});
          return {active:document.activeElement?.outerHTML.slice(0,350),first:first.outerHTML,detail:button.dataset.testClickDetail,classes:panel.className,root:document.documentElement.className,panel:style(panel),firstStyle:style(first),width:innerWidth,media:matchMedia("(max-width:980px)").matches,focused:document.hasFocus()};
        });
        assert.ok(await page.$eval(".nav-panel a[href]",e=>document.activeElement===e),file+" opening menu must focus first link: "+JSON.stringify(menuDiagnostics));
        await page.keyboard.press("Tab");
        assert.ok(await page.evaluate(()=>document.activeElement===document.querySelectorAll(".nav-panel a[href]")[1]),file+" Tab must reach second menu link");
        await page.keyboard.down("Shift");
        try { await page.keyboard.press("Tab"); } finally { await page.keyboard.up("Shift"); }
        assert.ok(await page.$eval(".nav-panel a[href]",e=>document.activeElement===e),file+" Shift+Tab must return to first link");
        const linkCount=await page.evaluate(()=>document.querySelectorAll(".nav-panel a[href]").length);
        for(let index=1;index<linkCount;index++){
          await page.keyboard.press("Tab");
          assert.ok(await page.evaluate(i=>document.activeElement===document.querySelectorAll(".nav-panel a[href]")[i],index),file+" Tab must reach menu link "+(index+1));
        }
        await page.keyboard.press("Tab");
        assert.ok(await page.$eval(".nav-panel",e=>!e.contains(document.activeElement)),file+" Tab must leave menu after last link (no keyboard trap)");
        await page.keyboard.press("Escape");
        assert.ok(await page.$eval(".menu-toggle",e=>e.getAttribute("aria-expanded")==="false"&&document.activeElement===e),file+" Escape focus");
        await page.keyboard.press("Tab");
        assert.ok(await page.$eval(".nav-panel",e=>!e.contains(document.activeElement)),file+" closed menu links must not receive focus");
        await page.$eval(".menu-toggle",e=>e.focus());
        await page.keyboard.press("Space");
        assert.ok(await page.$eval(".nav-panel a[href]",e=>document.activeElement===e),file+" Space must open menu and focus first link");
        await page.keyboard.press("Escape");
        assert.ok(await page.$eval(".menu-toggle",e=>e.getAttribute("aria-expanded")==="false"&&document.activeElement===e),file+" Escape focus after Space");
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
        // Without JavaScript, DOMContentLoaded may precede stylesheet loading.
        // Wait for the complete page before testing the CSS-only fallback.
        await nojs.goto(url,{waitUntil:"load",timeout:20000});
        const facts=await nojs.evaluate(()=>({
          menu:getComputedStyle(document.querySelector(".nav-panel")).visibility,
          toggle:getComputedStyle(document.querySelector(".menu-toggle")).display,
          visible:[...document.querySelectorAll(".reveal")].every(e=>getComputedStyle(e).opacity==="1"),
          skip:!!document.querySelector(".pdt-skip-link"),
          styleLoaded:[...document.styleSheets].some(s=>s.href&&new URL(s.href).pathname.endsWith("/style.css")),
          root:document.documentElement.className,
          ready:document.readyState
        }));
        assert.ok(facts.styleLoaded,file+" no-JS shared stylesheet not loaded: "+JSON.stringify(facts));
        assert.ok(!facts.root.includes("pdt-menu-ready"),file+" no-JS unexpectedly initialised menu");
        assert.equal(facts.menu,"visible",file+" no-JS menu");
        assert.equal(facts.toggle,"none",file+" no-JS nonfunctional toggle: "+JSON.stringify(facts));
        assert.ok(facts.visible&&facts.skip,file+" no-JS content");
      }finally{await nojs.close();}
      console.log(file,"accessibility smoke OK");
    }
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(err=>{console.error(err);process.exitCode=1;});
