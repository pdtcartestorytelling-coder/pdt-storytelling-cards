"use strict";
// Local synthetic lab only. No telemetry or live-site requests.
const puppeteer=require("puppeteer-core");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const {execSync}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const output=path.join(root,"browser-test-screenshots","performance-lab.json");
const mime={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".webp":"image/webp",".avif":"image/avif",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2",".ico":"image/x-icon"};
const server=http.createServer((req,res)=>{
  try{
    let f=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
    if(!f.startsWith(root+path.sep)||!fs.statSync(f).isFile())return res.writeHead(404).end();
    res.writeHead(200,{"Content-Type":mime[path.extname(f)]||"application/octet-stream"});
    fs.createReadStream(f).pipe(res);
  }catch(_){res.writeHead(404).end();}
});
const rows=[];
async function run(){
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  let browser;
  try{
    const chrome=process.env.CHROME_BIN||execSync("which google-chrome || which chromium || which chromium-browser").toString().trim();
    browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
    const origin="http://127.0.0.1:"+server.address().port+"/";
    const groups=[["it","index.html","prodotto.html","pre-order.html","risorse-pdt.html","galleria-pdt.html"],["en","home-en.html","product-en.html","pre-order-en.html","resources-en.html","gallery-en.html"],["es","home-es.html","product-es.html","pre-order-es.html","resources-es.html","gallery-es.html"]];
    for(const [lang,home,product,pre,resource,gallery] of groups){
      for(const file of [home,product,pre,resource,gallery]){
        const page=await browser.newPage();
        try{
          await page.setViewport({width:320,height:480,isMobile:true,hasTouch:true,deviceScaleFactor:1});
          await page.setCacheEnabled(false);
          const session=await page.createCDPSession();
          await session.send("Network.enable");
          await session.send("Network.emulateNetworkConditions",{offline:false,latency:80,downloadThroughput:200000,uploadThroughput:100000});
          await session.send("Emulation.setCPUThrottlingRate",{rate:4});
          await page.setRequestInterception(true);
          const external=[],errors=[];
          page.on("request",r=>{if(r.url().startsWith(origin)||r.url().startsWith("data:"))r.continue().catch(()=>{});else{external.push(r.url());r.abort().catch(()=>{});}});
          page.on("pageerror",e=>errors.push(e.message));
          await page.evaluateOnNewDocument(()=>{
            const data=window.__pdtLab={lcp:null,cls:0,firstShift:null,lastShift:null,sessionValue:0,longTasks:0};
            const observe=(type,fn)=>{try{new PerformanceObserver(list=>list.getEntries().forEach(fn)).observe({type,buffered:true});}catch(_){}};
            observe("largest-contentful-paint",e=>{data.lcp=e.startTime;});
            observe("layout-shift",e=>{if(e.hadRecentInput)return;if(data.firstShift===null||e.startTime-data.lastShift>1000||e.startTime-data.firstShift>5000){data.firstShift=e.startTime;data.sessionValue=0;}data.lastShift=e.startTime;data.sessionValue+=e.value;data.cls=Math.max(data.cls,data.sessionValue);});
            observe("longtask",e=>{data.longTasks+=Math.max(0,e.duration-50);});
          });
          const response=await page.goto(origin+file,{waitUntil:"load",timeout:20000});
          await new Promise(resolve=>setTimeout(resolve,750));
          const info=await page.evaluate(()=>{
            const footer=document.querySelector(".pdt-discovery-links a");
            const hero=document.querySelector(".pdt-h-hero-figure img,.preorder-hero-product img,.sig-hero img,.gallery-hero img");
            const entries=performance.getEntriesByType("resource");
            const nav=performance.getEntriesByType("navigation")[0];
            return {lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,coarse:matchMedia("(pointer:coarse)").matches,cinema:document.querySelectorAll(".pdt-cinema-sweep,.pdt-cinema-edge").length,footerHeight:footer?.getBoundingClientRect().height,footerColor:footer&&getComputedStyle(footer).color,hero:hero?{priority:hero.getAttribute("fetchpriority"),lazy:hero.loading==="lazy",dimensions:!!hero.getAttribute("width")&&!!hero.getAttribute("height")}:null,lab:window.__pdtLab,loadMs:nav?.loadEventEnd,resourceBytes:entries.reduce((a,e)=>a+e.transferSize,0),resourceCount:entries.length};
          });
          rows.push({file,lang,viewport:"320x480",...info,externalRequests:external.length,errors});
          assert.ok(response.status()===200&&info.lang===lang&&info.overflow<=5,file+" layout "+JSON.stringify(info));
          assert.ok(info.coarse&&info.cinema===0,file+" touch scroll-depth budget");
          assert.ok(info.footerHeight>=44&&info.footerColor==="rgb(245, 211, 140)",file+" footer contrast/target");
          assert.ok(!external.length&&!errors.length,file+" requests/errors "+JSON.stringify({external,errors}));
          if(info.hero)assert.ok(info.hero.priority==="high"&&!info.hero.lazy&&info.hero.dimensions,file+" hero loading");
          // Stop throttling before interaction checks.
          await session.send("Network.emulateNetworkConditions",{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
          await session.send("Emulation.setCPUThrottlingRate",{rate:1});
          await page.click(".menu-toggle");
          const menu=await page.evaluate(()=>{const p=document.querySelector(".nav-panel"),r=p.getBoundingClientRect(),a=p.querySelector(".nav-links a");return {open:p.classList.contains("open"),bottom:r.bottom,viewport:innerHeight,height:a.getBoundingClientRect().height,overflow:getComputedStyle(p).overflowY,scrollHeight:p.scrollHeight,clientHeight:p.clientHeight};});
          assert.ok(menu.open&&menu.bottom<=menu.viewport+5&&menu.height>=44&&menu.overflow==="auto",file+" short mobile menu "+JSON.stringify(menu));
          await page.keyboard.press("Escape");
          if(file===pre){
            await page.$eval('#interest input[name="name"]',e=>e.focus());
            assert.ok(await page.$eval(".preorder-mobile-action",e=>getComputedStyle(e).visibility==="hidden"),file+" CTA must not obscure focused form");
          }
        }finally{await page.close();}
      }
    }
  }finally{
    fs.mkdirSync(path.dirname(output),{recursive:true});
    fs.writeFileSync(output,JSON.stringify({scope:"synthetic local cold load; 320x480 touch; 80 ms latency, 1.6 Mbps download, 4x CPU; single sample per page; LCP/CLS through load + 750 ms; longTasks is blocking-time proxy, NOT INP or Lighthouse TBT; no field CWV claim",rows},null,2));
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
  console.log("PASS: UX lab",rows.length,"local runs; metrics saved, not field values.");
}
run().catch(e=>{console.error(e);process.exitCode=1;});
