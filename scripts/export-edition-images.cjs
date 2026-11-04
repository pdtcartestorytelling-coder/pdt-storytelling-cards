"use strict";
// Temporary asset conversion: split the approved 2880x720 three-edition atlas.
const sharp = require("sharp");
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const source = path.resolve(__dirname,"../images/pdt-editions-hq.avif");
const editions = ["essential","studio","signature"];
(async()=>{
  const meta = await sharp(source).metadata();
  if(meta.width!==2880||meta.height!==720)throw Error("Unexpected HQ atlas dimensions: "+meta.width+"x"+meta.height);
  for(let i=0;i<editions.length;i++){
    for(const fmt of ["webp","avif"]){
      const pipeline=sharp(source).extract({left:i*960,top:0,width:960,height:720});
      const buf=fmt==="webp"?await pipeline.webp({quality:88,effort:5}).toBuffer():await pipeline.avif({quality:72,effort:5}).toBuffer();
      const filename="pdt-"+editions[i]+"-hq."+fmt;
      fs.writeFileSync(path.resolve(__dirname,"../images/"+filename),buf);
      const checksum=crypto.createHash("sha256").update(buf).digest("hex");
      console.log("PDT_ASSET_BEGIN "+filename+" "+buf.length+" "+checksum);
      console.log(buf.toString("base64"));
      console.log("PDT_ASSET_END "+filename);
    }
  }
  console.log("PDT_ASSETS_COMPLETE six image crops");
})().catch(e=>{console.error(e);process.exit(1)});
