const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+__dirname+'/vorlage.html');
await p.pdf({path:__dirname+'/Beiratsvorlage_Q3_2026.pdf',width:'1280px',height:'720px',printBackground:true});
await b.close();})();
