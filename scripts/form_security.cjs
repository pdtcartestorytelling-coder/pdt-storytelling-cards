"use strict";
const puppeteer = require("puppeteer-core");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { execSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const requests = [];
const server = http.createServer((req, res) => {
  requests.push({method:req.method,url:req.url});
  try {
    const file = path.resolve(root, "." + decodeURIComponent(new URL(req.url,"http://localhost").pathname));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    const mime = {".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".webp":"image/webp",".png":"image/png"};
    res.writeHead(200, {"Content-Type":mime[path.extname(file)] || "application/octet-stream"});
    fs.createReadStream(file).on("error",()=>res.end()).pipe(res);
  } catch (_) {res.writeHead(404).end();}
});
const cases = [
  ["contatti.html","script.js"],["contact-en.html","script.js"],["contact-es.html","script.js"],
  ["pre-order.html","interest.js"],["pre-order-en.html","interest.js"],["pre-order-es.html","interest.js"]
];
async function run(){
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  let browser;
  try {
    const chrome=process.env.CHROME_BIN || execSync("which google-chrome || which chromium || which chromium-browser").toString().trim();
    browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
    for(const [file,script] of cases){
      const base="http://127.0.0.1:"+server.address().port+"/"+file;
      const selector="form[data-mailto-form], form[data-interest-mailto]";
      for(const mode of ["normal","no-js","blocked-script"]){
        const page=await browser.newPage();
        try {
          if(mode==="no-js") await page.setJavaScriptEnabled(false);
          if(mode==="blocked-script"){
            await page.setRequestInterception(true);
            page.on("request",req=>{
              if(new URL(req.url()).pathname.endsWith("/"+script)) req.abort();
              else req.continue();
            });
          }
          await page.goto(base,{waitUntil:"domcontentloaded",timeout:12000});
          const facts=await page.$eval(selector,form=>({
            method:form.method,
            csp:document.querySelector('meta[http-equiv="Content-Security-Policy"]').content,
            controls:[...form.querySelectorAll("input,select,textarea,button")].map(x=>({disabled:x.disabled,guard:x.hasAttribute("data-pdt-enable")})),
            fallback:form.querySelector("[data-pdt-form-fallback]").hidden,
            mail:form.querySelector("[data-pdt-form-fallback] a").getAttribute("href")
          }));
          assert.ok(await page.$eval(selector,form=>!form.querySelector('[name="updates_consent"],[data-marketing-consent-text]')),file+" marketing collection must remain suspended");
          assert.equal(facts.method,"post",file);
          assert.ok(facts.csp.includes("form-action 'none'"),file);
          assert.ok(facts.controls.length && facts.controls.every(x=>x.guard && x.disabled===(mode!=="normal")),file+" "+mode);
          assert.equal(facts.fallback,mode==="normal",file+" "+mode);
          assert.equal(facts.mail,"mailto:pdtstorytellingcards@gmail.com");
          if(mode==="normal"){
            // Synthetic empty form: handler must cancel even an invalid submit.
            // No external email app is opened and no real personal data is used.
            const cancelled=await page.$eval(selector,form=>{
              form.elements.namedItem("name").value="";
              return !form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
            });
            assert.ok(cancelled,file+" handler did not cancel submit");
            // Attempt native submission with dummy data. CSP must block it.
            const mark=requests.length;
            await page.$eval(selector,form=>{
              form.elements.namedItem("name").value="PDT_TEST_ONLY";
              HTMLFormElement.prototype.submit.call(form);
            });
            await new Promise(resolve=>setTimeout(resolve,200));
            assert.equal(page.url(),base,file+" native navigation");
            assert.ok(!requests.slice(mark).some(x=>x.method==="POST"||x.url.includes("PDT_TEST_ONLY")),file+" native request escaped");
          }
          console.log(file,mode,"OK");
        } finally {await page.close();}
      }
    }
  } finally {if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve));}
}
run().catch(error=>{console.error(error);process.exitCode=1;});
