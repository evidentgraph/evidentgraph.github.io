'use strict';
// User-visible regression checks. Evidence stays outside the public repository.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.EG_PLAYWRIGHT_MODULE||'playwright');
const preview=process.env.EG_PREVIEW_URL,caseURL=process.env.EG_CASE_URL,documentary=process.env.EG_DOCUMENTARY_URL,out=process.env.EG_BROWSER_OUTPUT;
assert(preview&&caseURL&&out,'Set preview/case URLs and a new output directory');fs.mkdirSync(out,{recursive:false});
const caseAnalysis=new URL('?source=case&eg_view=analysis&eg_change=CASE-001&eg_scope=all&eg_technical=1',caseURL).href;
const analysis=new URL('?eg_view=analysis&eg_change=CHG-001',preview).href;
const record={started:new Date().toISOString(),preview,caseURL,documentary:documentary||null,sandboxRequested:true,checks:[],pageErrors:[],failedRequests:[],externalRequests:[]};
const save=()=>fs.writeFileSync(path.join(out,'RESULTADO.json'),JSON.stringify(record,null,2)+'\n');
async function open(p,url){assert.equal((await p.goto(url,{waitUntil:'networkidle'})).status(),200);await p.waitForFunction(()=>window.EG_READY&&window.EGNavigation&&(!document.querySelector('#workspaceSource')||window.EG_WORKSPACE_READY));}
async function example(p,id){await p.locator('#demoCaseSelect').selectOption(id);await p.waitForFunction(id=>new URL(location.href).searchParams.get('eg_example')===id,id);}
async function state(p){return {id:await p.locator('#demoCaseSelect').inputValue(),cards:await p.locator('.demo-run').allInnerTexts()};}
async function copy(p,ctx,button='copyContextLink'){await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:new URL(p.url()).origin});await p.locator('#'+button).click();return p.evaluate(()=>navigator.clipboard.readText());}
function contrast(a,b){const lum=s=>s.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
async function main(){
 const browser=await chromium.launch({headless:true,chromiumSandbox:true});record.browser=browser.version();
 async function context(viewport={width:1440,height:900}){
  const ctx=await browser.newContext({viewport,acceptDownloads:true});ctx.on('page',p=>{p.setDefaultTimeout(10000);p.on('pageerror',e=>record.pageErrors.push(e.message));p.on('requestfailed',r=>record.failedRequests.push({url:r.url(),error:r.failure()}));p.on('request',r=>{if(new URL(r.url()).origin!==new URL(preview).origin)record.externalRequests.push(r.url());});});return ctx;
 }
 async function check(name,fn,url=caseAnalysis){const ctx=await context(),p=await ctx.newPage();try{await open(p,url);await fn(p,ctx);record.checks.push({name,status:'PASS'});console.log('PASS '+name);}catch(e){record.checks.push({name,status:'FAIL',error:e.stack});await p.screenshot({path:path.join(out,'failure-'+record.checks.length+'.png'),fullPage:true}).catch(()=>{});console.log('FAIL '+name+' '+e.message);}finally{await ctx.close();save();}}
 try{
  await check('all nine examples keep selection and outcomes in a copied link opened in a fresh context',async(p,ctx)=>{
   const ids=await p.locator('#demoCaseSelect option').evaluateAll(options=>options.map(o=>o.value));assert.equal(ids.length,9);
   for(const id of ids){await example(p,id);const before=await state(p);assert.equal(before.id,id);const url=await copy(p,ctx);assert.equal(new URL(url).searchParams.get('eg_example'),id);
    const receiver=await context();try{const fresh=await receiver.newPage();await open(fresh,url);assert.deepEqual(await state(fresh),before);if(id==='optional-omitted')await fresh.locator('#consumerDemo').screenshot({path:path.join(out,'exemplo-compartilhado.png')});}finally{await receiver.close();}
   }
  });
  await check('example survives back forward reload and a shared simulated-reader evidence',async(p,ctx)=>{
   await example(p,'optional-omitted');await example(p,'explicit-null');await p.goBack();await p.waitForFunction(()=>document.querySelector('#demoCaseSelect').value==='optional-omitted');
   await p.goForward();await p.waitForFunction(()=>document.querySelector('#demoCaseSelect').value==='explicit-null');await p.reload({waitUntil:'networkidle'});assert.equal(await p.locator('#demoCaseSelect').inputValue(),'explicit-null');
   await p.locator('[data-demo-detail="demo-migrated"]').click();await p.locator('[data-evidence-id="demo-evidence-migrated"] summary').click();await p.waitForFunction(()=>location.search.includes('eg_evidence='));
   const url=await copy(p,ctx,'copyDetailLink'),receiver=await context();try{const fresh=await receiver.newPage();await open(fresh,url);assert.equal(await fresh.locator('#demoCaseSelect').inputValue(),'explicit-null');assert.equal(await fresh.locator('[data-evidence-id][open]').getAttribute('data-evidence-id'),'demo-evidence-migrated');await fresh.keyboard.press('Escape');await fresh.reload({waitUntil:'networkidle'});assert(!await fresh.locator('#detailDialog').isVisible());assert.equal(await fresh.locator('#demoCaseSelect').inputValue(),'explicit-null');}finally{await receiver.close();}
  });
  await check('unknown examples show a clear fallback and do not leak into Aurora',async p=>{
   await open(p,caseAnalysis+'&eg_example=unavailable-example');assert.equal(await p.locator('#demoCaseSelect').inputValue(),'subscription-id');assert.match(await p.locator('#demoLinkStatus').innerText(),/não foi encontrado/);assert.equal(new URL(p.url()).searchParams.get('eg_example'),'subscription-id');
   await example(p,'explicit-null');assert.equal(await p.locator('#demoLinkStatus').innerText(),'');await p.locator('#workspaceSource').selectOption('aurora');await p.waitForURL(/source=aurora/);await p.waitForFunction(()=>window.EG_WORKSPACE_READY);
   assert.equal(await p.locator('#demoCaseSelect').count(),0);assert.equal(new URL(p.url()).searchParams.get('eg_example'),null);assert.match(await p.locator('#workspaceEnvironment').innerText(),/fictícios/);
  });
  await check('320 and 390 pixel analysis keeps owner and actions beside each consumer',async()=>{
   for(const width of [320,390]){const ctx=await context({width,height:900});try{const p=await ctx.newPage();await open(p,analysis);const row=p.locator('#consumerRows tr').first();assert.match(await row.innerText(),/Serviço de pedidos/);assert.match(await row.innerText(),/Equipe Comercial/);
    const bounds=await row.evaluate(r=>({viewport:innerWidth,document:document.documentElement.scrollWidth,scroll:r.closest('.table-scroll').scrollWidth,client:r.closest('.table-scroll').clientWidth,parts:[r.children[2],r.querySelector('[data-detail]'),r.querySelector('[data-return-graph]')].map(e=>{const x=e.getBoundingClientRect();return {left:x.left,right:x.right};})}));
    assert(bounds.document<=width+1);assert(bounds.scroll<=bounds.client+1);assert(bounds.parts.every(x=>x.left>=0&&x.right<=width));
    assert.match(await p.locator('.consumer-table').ariaSnapshot(),/columnheader "Responsável"/);await row.screenshot({path:path.join(out,'consumidor-celular-'+width+'.png')});
    await row.locator('[data-check]').check();await row.locator('[data-detail]').click();assert.match(await p.locator('#detailBody').innerText(),/Equipe Comercial/);assert(await p.locator('#detailBody [data-check]').isChecked());await p.keyboard.press('Escape');
    await p.locator('#sortName').click();assert.equal(await p.locator('#sortName').evaluate(e=>e.closest('th').getAttribute('aria-sort')),'ascending');await p.locator('#search').fill('Serviço de pedidos');assert.equal(await p.locator('#consumerRows tr').count(),1);await p.locator('#consumerRows [data-return-graph]').click();assert(await p.locator('#graphViewport').isVisible());
   }finally{await ctx.close();}}
  },analysis);
  await check('comparison button moves focus and reading position from analysis and graph',async()=>{
   for(const width of [1440,390]){const ctx=await context({width,height:900});try{const p=await ctx.newPage();await open(p,caseAnalysis);
    for(const view of ['analysis','lineage']){if(view==='lineage')await p.locator('[data-view="lineage"]').click();await p.locator('#reviewPublicCase').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'consumerDemoTitle');const box=await p.locator('#consumerDemoTitle').boundingBox();assert(box.y>=0&&box.y<45);assert(await p.evaluate(()=>scrollY>0));}
    await p.screenshot({path:path.join(out,'comparacao-foco-'+width+'.png')});
   }finally{await ctx.close();}}
  });
  await check('posterior contract and adapted reader return to their comparison without inventing consumers',async p=>{
   for(const name of ['Examinar contrato posterior','Examinar leitor adaptado']){await p.getByRole('button',{name,exact:true}).click();assert(!/Não há revisão de mudança disponível/.test(await p.locator('#detailBody').innerText()));assert.match(await p.locator('[data-case-return]').innerText(),/CASE-001/);assert(!await p.locator('#detailSourceNote').isVisible());await p.locator('[data-case-return]').click();assert(!await p.locator('#detailDialog').isVisible());assert.equal(await p.evaluate(()=>document.activeElement.id),'consumerDemoTitle');}
   assert.deepEqual(await p.evaluate(()=>result.consumers),[]);assert.deepEqual(await p.evaluate(()=>data.coverage),[]);assert.equal(await p.evaluate(()=>data.provenance.facts.consumer_runtime_result),'NOT_VERIFIED');
  });
  await check('sidebar keyboard focus contrasts on its dark background and accessible names retain visible labels',async p=>{
   for(const width of [1440,390]){await p.setViewportSize({width,height:900});await open(p,preview);const measurements=[];
    for(let i=0;i<25;i++){await p.keyboard.press('Tab');const value=await p.evaluate(()=>{const e=document.activeElement;if(!e.matches('.sidebar .nav'))return null;const s=getComputedStyle(e);return {text:e.innerText,outline:s.outlineColor,background:getComputedStyle(document.querySelector('.sidebar')).backgroundColor,visible:e.matches(':focus-visible')};});if(value){value.ratio=contrast(value.outline,value.background);assert(value.visible);assert(value.ratio>=3);measurements.push(value);if(measurements.length===4)break;}}
    assert.equal(measurements.length,4);record['focus_'+width]=measurements;await p.screenshot({path:path.join(out,'foco-menu-'+width+'.png')});
   }
   assert(await p.getByRole('link',{name:'Caso Stripe — abrir caso público com consumidor simulado',exact:true}).isVisible());await p.locator('[data-view="analysis"]').click();assert(await p.getByRole('button',{name:'Consumidor — ordenar por nome',exact:true}).isVisible());
  },preview);
  await check('shared Aurora details identify fictional data locally without relabelling public contracts',async(p,ctx)=>{
   await p.locator('[data-detail="svc-comercial-pedidos"]').click();const ev=p.locator('[data-evidence-id="obs:rel-order-customer"]');assert.match(await ev.locator('summary').innerText(),/Uso observado neste cenário fictício/);await ev.locator('summary').click();await p.waitForFunction(()=>location.search.includes('eg_evidence='));
   const url=await copy(p,ctx,'copyDetailLink'),receiver=await context();try{const fresh=await receiver.newPage();await open(fresh,url);assert.equal(await fresh.locator('#detailTitle').innerText(),'Serviço de pedidos');assert(await fresh.locator('#detailSourceNote').isVisible());assert.equal(await fresh.locator('#detailSourceNote').innerText(),'Dados fictícios da demonstração');assert.equal(await fresh.locator('[data-evidence-id][open]').getAttribute('data-evidence-id'),'obs:rel-order-customer');await fresh.screenshot({path:path.join(out,'detalhe-ficticio-compartilhado.png')});}finally{await receiver.close();}
   await open(p,caseAnalysis);await p.getByRole('button',{name:'Examinar contrato posterior',exact:true}).click();assert(!await p.locator('#detailSourceNote').isVisible());assert.match(await p.locator('#detailBody').innerText(),/Documentação pública/);
  },analysis);
  if(documentary)await check('documentary-only mode supports comparison and return without a simulated example',async p=>{
   assert.equal(await p.locator('#consumerDemo').count(),0);assert.equal(new URL(p.url()).searchParams.get('eg_example'),null);await p.locator('#reviewPublicCase').focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>document.activeElement.id),'contractComparisonTitle');
   // A shorter page stops scrolling at its end; the focused title must still be fully visible.
   const destination=await p.locator('#contractComparisonTitle').evaluate(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,viewport:innerHeight,scroll:scrollY,maxScroll:document.documentElement.scrollHeight-innerHeight}));
   assert(destination.scroll>0);assert(destination.top>=0&&destination.bottom<=destination.viewport);assert(destination.top<45||Math.abs(destination.scroll-destination.maxScroll)<=1);record.documentaryDestination=destination;await p.screenshot({path:path.join(out,'comparacao-documental-foco.png')});
   await p.getByRole('button',{name:'Examinar contrato posterior',exact:true}).click();assert(!await p.locator('#detailSourceNote').isVisible());await p.locator('[data-case-return]').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'contractComparisonTitle');assert.deepEqual(await p.evaluate(()=>result.consumers),[]);
  },new URL('?source=case&eg_view=analysis&eg_change=CASE-001&eg_example=explicit-null',documentary).href);
 }finally{await browser.close();record.finished=new Date().toISOString();save();}
 assert(record.checks.every(c=>c.status==='PASS'));assert.deepEqual(record.pageErrors,[]);assert.deepEqual(record.failedRequests,[]);assert.deepEqual(record.externalRequests,[]);
}
main().catch(e=>{record.error=e.stack;save();console.error(e.message);process.exitCode=1;});
