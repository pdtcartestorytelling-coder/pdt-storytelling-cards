"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"interest.js"),"utf8");
for(const [lang,file] of [["it","pre-order.html"],["en","pre-order-en.html"],["es","pre-order-es.html"]]){
  const html=fs.readFileSync(path.join(root,file),"utf8");
  const checkbox=html.match(/<input\b[^>]*name="updates_consent"[^>]*>/)[0];
  const version=checkbox.match(/data-consent-version="([^"]+)"/)[1];
  const label=html.match(/<span data-marketing-consent-text>([^<]+)<\/span>/)[1];
  assert.ok(!/\b(?:checked|required)\b/.test(checkbox));
  for(const mode of ["unchecked","checked","missing-version","missing-text","invalid"]){
    let submit;
    const marketing={checked:mode!=="unchecked",dataset:{consentVersion:mode==="missing-version"?"":version}};
    const fields={name:{value:"PDT TEST"},email:{value:"test@example.invalid"},updates_consent:marketing,edition:{value:"top"}};
    const fallback={};
    const form={
      elements:{namedItem:n=>fields[n]||null},
      dataset:{subject:"PDT TEST",recipient:"pdtstorytellingcards@gmail.com"},
      addEventListener:(name,fn)=>{if(name==="submit")submit=fn;},
      reportValidity:()=>mode!=="invalid",
      querySelector:s=>s==="[data-marketing-consent-text]"?(mode==="missing-text"?null:{textContent:label}):s==="[data-interest-status]"?{}:fallback,
      querySelectorAll:()=>[]
    };
    const window={location:{href:""}};
    const document={documentElement:{lang},querySelector:()=>null,getElementById:()=>null,querySelectorAll:()=>[form]};
    vm.runInNewContext(source,{window,document});
    let cancelled=false;
    submit({preventDefault:()=>{cancelled=true;}});
    assert.ok(cancelled);
    if(mode==="invalid"){assert.equal(window.location.href,"");continue;}
    const body=new URL(window.location.href).searchParams.get("body");
    assert.ok(body);
    if(mode==="checked"){
      assert.ok(body.includes(": YES"));
      assert.ok(body.includes("Marketing consent version: "+version));
      assert.ok(body.includes("Marketing consent language: "+lang));
      assert.ok(body.includes("Marketing consent text: "+label));
      assert.ok(body.includes("Marketing consent status: REQUESTED"));
    }else{
      assert.ok(/(?:Consenso marketing email|Email marketing consent|Consentimiento marketing por correo): NO/.test(body));
      assert.ok(!body.includes("Marketing consent status:"));
    }
    console.log(lang,mode,"OK");
  }
}
