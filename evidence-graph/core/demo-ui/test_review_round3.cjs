'use strict';
// Real-browser checks; start the two local viewers first. Artifacts stay outside Git.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.EG_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.EG_PREVIEW_URL,caseURL=process.env.EG_CASE_URL,output=process.env.EG_BROWSER_OUTPUT;
const documentaryChecks=process.env.EG_DOCUMENTARY_CHECKS!=='0';
assert(base&&caseURL&&output,'Set EG_PREVIEW_URL, EG_CASE_URL and EG_BROWSER_OUTPUT');
fs.mkdirSync(output,{recursive:false});
const record={started:new Date().toISOString(),base,caseURL,documentaryChecks,checks:[],pageErrors:[],failedRequests:[],sandboxRequested:true};
const save=()=>fs.writeFileSync(path.join(output,'RESULTADO.json'),JSON.stringify(record,null,2)+'\n');
async function open(page,url){assert.equal((await page.goto(url,{waitUntil:'networkidle'})).status(),200);await page.waitForFunction(()=>window.EG_READY&&window.EGNavigation);}
async function shot(page,name){await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});}
async function route(page,key){await page.waitForFunction(key=>location.search.includes(key),key);}
async function main(){
 const browser=await chromium.launch({headless:true,chromiumSandbox:true});record.browser=browser.version();
 async function context(name,viewport={width:1366,height:768}){
  const ctx=await browser.newContext({viewport,acceptDownloads:true});ctx.on('page',page=>{
   page.setDefaultTimeout(9000);page.on('pageerror',e=>record.pageErrors.push({name,message:e.message}));
   page.on('requestfailed',r=>record.failedRequests.push({name,url:r.url(),error:r.failure()}));
  });return ctx;
 }
 async function check(name,fn,url=base){
  const ctx=await context(name),page=await ctx.newPage();
  try{await open(page,url);await fn(page,ctx);record.checks.push({name,status:'PASS'});console.log('PASS '+name);}
  catch(e){record.checks.push({name,status:'FAIL',error:e.stack});await shot(page,'failure-'+record.checks.length).catch(()=>{});console.log('FAIL '+name+' '+e.message);}
  finally{await ctx.close();save();}
 }
 try{
  await check('narrow entry uses readable list and explicit graph survives reload',async()=>{
   for(const width of [390,320]){
    const ctx=await context('narrow-'+width,{width,height:900});try{
     const p=await ctx.newPage();await open(p,base);
     assert(await p.locator('#graphListPanel').isVisible());assert.equal(await p.locator('[data-explore-row]').count(),6);
     const dims=await p.evaluate(()=>({viewport:innerWidth,doc:document.documentElement.scrollWidth,list:document.querySelector('#graphListPanel').clientWidth,scroll:document.querySelector('#graphListPanel').scrollWidth}));
     assert(dims.doc<=dims.viewport+1);assert(dims.scroll<=dims.list+1,JSON.stringify(dims));
     await shot(p,'mobile-list-'+width);
     await p.locator('#graphAsGraph').click();await route(p,'eg_rep=graph');await p.reload({waitUntil:'networkidle'});
     assert(await p.locator('#graphViewport').isVisible());assert.equal(await p.locator('#graphZoomLabel').innerText(),'100%');
     assert.match(await p.locator('#graphViewportStatus').innerText(),/de 6 ativos/);await shot(p,'mobile-graph-'+width);
    }finally{await ctx.close();}
   }
  });
  await check('map exposes offscreen content and directional controls preserve readable scale',async page=>{
   await page.locator('#graphScope').selectOption('all');
   const transform=()=>page.locator('#graphScene').getAttribute('transform');
   const original=await transform();await page.locator('#graphPanControls [data-pan]:enabled').first().click();
   assert.notEqual(await transform(),original);assert.equal(await page.locator('#graphZoomLabel').innerText(),'100%');
   await page.locator('#graphFocusSelected').click();assert.equal(await transform(),original);
   await page.locator('#graphViewport').focus();await page.keyboard.press('ArrowDown');assert.notEqual(await transform(),original);
   await page.locator('#graphFit').click();assert.notEqual(await page.locator('#graphZoomLabel').innerText(),'100%');
   await page.locator('#graphReadable').click();assert.equal(await page.locator('#graphZoomLabel').innerText(),'100%');
   await shot(page,'map-orientation');
   await page.locator('#graphDomain').selectOption('financeiro');
   assert(!(await page.evaluate(()=>EGGraph.snapshot().ids.includes(EGGraph.snapshot().selected))));
   await page.locator('#graphFocusSelected').click();
   assert(await page.evaluate(()=>EGGraph.snapshot().ids.includes(EGGraph.snapshot().selected)));
  });
  await check('consumer evidence copied from modal opens exactly in a fresh context without notes',async(page,ctx)=>{
   await page.locator('#graphReview').click();await page.locator('[data-detail="svc-comercial-pedidos"]').click();
   const ev=page.locator('#detailBody [data-evidence-id]').first();const id=await ev.getAttribute('data-evidence-id');
   await ev.locator('summary').click();await page.locator('#reviewNote').fill('Nota privada de teste, não compartilhar');
   await route(page,'eg_evidence=');await ctx.grantPermissions(['clipboard-read','clipboard-write']);await page.locator('#copyDetailLink').click();
   await page.waitForFunction(()=>document.querySelector('#detailShareStatus').textContent.includes('Link copiado'));
   const url=await page.evaluate(()=>navigator.clipboard.readText());assert(!url.includes('privada'));
   const other=await context('shared-consumer');try{
    const p=await other.newPage();await open(p,url);assert(await p.locator('#detailDialog').isVisible());
    assert.equal(await p.locator('#detailTitle').innerText(),'Serviço de pedidos');assert.equal(await p.locator('#detailBody [data-evidence-id][open]').getAttribute('data-evidence-id'),id);
    assert.equal(await p.locator('#reviewNote').inputValue(),'');await shot(p,'shared-evidence');
    await p.keyboard.press('Escape');await p.waitForFunction(()=>!location.search.includes('eg_detail='));
    await p.goBack();await p.locator('#detailDialog').waitFor({state:'visible'});
    await p.goForward();await p.locator('#detailDialog').waitFor({state:'hidden'});
   }finally{await other.close();}
  });
  await check('relation detail reopens its evidence; invalid evidence and identifiers are discarded',async page=>{
   await page.locator('.inspector-connections summary').click();await page.locator('[data-relation]').first().click();
   const ev=page.locator('#detailBody [data-evidence-id]').first();const id=await ev.getAttribute('data-evidence-id');await ev.locator('summary').click();await route(page,'eg_evidence=');
   const url=page.url();await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('#detailKind').innerText(),'RELAÇÃO');
   assert.equal(await page.locator('[data-evidence-id][open]').getAttribute('data-evidence-id'),id);
   const invalid=new URL(url);invalid.searchParams.set('eg_evidence','__proto__');await open(page,invalid.href);
   assert.equal(await page.locator('[data-evidence-id][open]').count(),0);assert(!page.url().includes('eg_evidence='));
   invalid.searchParams.set('eg_detail','constructor');await open(page,invalid.href);assert(!(await page.locator('#detailDialog').isVisible()));
  });
  await check('back to pending change removes contradictory confirmation',async page=>{
   await page.locator('#graphReview').click();await route(page,'eg_view=analysis');
   await page.locator('#changeSelect').selectOption('CHG-003');await route(page,'eg_open=CHG-001');
   await page.locator('#openAnalysis').click();await page.waitForFunction(()=>!location.search.includes('eg_open='));
   assert.match(await page.locator('#toast').innerText(),/Análise aberta/);
   await page.goBack();await page.locator('#notAnalyzed').waitFor({state:'visible'});
   assert(!(await page.locator('#toast').isVisible()));assert.equal(await page.locator('#toast').textContent(),'');await shot(page,'history-confirmation');
  });
  if(documentaryChecks){
  await check('public case preserves contract versions without inventing consumers or calls',async page=>{
   assert.equal(await page.locator('[data-node]').count(),4);assert.equal(await page.locator('[data-edge]').count(),2);
   assert.match(await page.locator('#workspaceEnvironment').innerText(),/Caso público/);
   const facts=await page.evaluate(()=>({synthetic:data.synthetic,consumers:result.consumers,coverage:data.coverage,relationships:data.relations.map(r=>r.kind),caseFacts:data.provenance.facts}));
   assert.equal(facts.synthetic,false);assert.deepEqual(facts.consumers,[]);assert.deepEqual(facts.coverage,[]);assert.deepEqual(facts.relationships,['CONTAINS','CONTAINS']);
   assert.equal(facts.caseFacts.consumer_coverage,'UNKNOWN');assert.equal(facts.caseFacts.consumer_runtime_result,'NOT_VERIFIED');await shot(page,'stripe-graph');
   await page.locator('#graphToList').click();assert.equal(await page.locator('[data-explore-row]').count(),4);
   await page.locator('#reviewPublicCase').click();assert.match(await page.locator('#conclusionTitle').innerText(),/impacto ainda desconhecido/);
   assert.match(await page.locator('#contractComparison').innerText(),/parent.subscription_details.subscription/);
   assert(await page.locator('#metrics').isHidden());await shot(page,'stripe-analysis');
   const pending=page.waitForEvent('download');await page.locator('#exportBtn').click();const download=await pending;const file=path.join(output,'stripe-analysis.md');await download.saveAs(file);
   const text=fs.readFileSync(file,'utf8');assert.match(text,/UNKNOWN/);assert.match(text,/NOT_VERIFIED/);assert.match(text,/sha-256/i);assert(!text.includes('dados sintéticos'));assert(!text.includes('Grupo Aurora'));
   await page.locator('#analysisToGraph').click();assert.equal(await page.locator('[data-node]').count(),4);
   assert.equal(await page.locator('#graphFocusName').innerText(),'Contratos antes e depois');
   assert(await page.locator('.investigate-actions').isHidden());
   const rows=await page.locator('[data-node]').evaluateAll(nodes=>Object.fromEntries(nodes.map(n=>[n.dataset.node,Number(n.getAttribute('transform').split(',')[1].replace(')',''))])));
   assert.equal(rows['response-before'],rows['field-before']);assert.equal(rows['response-after'],rows['field-after']);
   const contextDownload=page.waitForEvent('download');await page.locator('#exportContext').click();const contextFile=await contextDownload;const contextPath=path.join(output,'stripe-context.md');await contextFile.saveAs(contextPath);
   assert.match(fs.readFileSync(contextPath,'utf8'),/UNKNOWN/);await shot(page,'stripe-graph-aligned');
  },caseURL);
  await check('case evidence links and preserved source bytes match the input hashes',async page=>{
   await page.locator('#reviewPublicCase').click();await page.locator('[data-contract-detail="response-before"]').click();
   const ev=page.locator('#detailBody [data-evidence-id]').first();await ev.locator('summary').click();await route(page,'eg_evidence=');const url=page.url();
   await page.reload({waitUntil:'networkidle'});assert(await page.locator('#detailDialog').isVisible());assert.equal(await page.locator('[data-evidence-id][open]').getAttribute('data-evidence-id'),'contract-before');
   const sources=await page.evaluate(()=>data.provenance.facts.sources);
   for(const source of sources){const response=await page.request.get(new URL(source.file,caseURL).href);assert.equal(response.status(),200);assert.equal(crypto.createHash('sha256').update(await response.body()).digest('hex'),source.sha256);}
   assert(url.includes('eg_detail=response-before'));await shot(page,'stripe-source');
  },caseURL);
  await check('switching sources preserves Aurora and keeps the public case separate',async page=>{
   await page.locator('#workspaceSource').selectOption('aurora');await page.waitForURL(/source=aurora/);await page.waitForFunction(()=>window.EG_WORKSPACE_READY);
   assert.match(await page.locator('#workspaceEnvironment').innerText(),/fictícios/);assert(await page.locator('#contractCaseNotice').isHidden());
   await page.locator('#graphScope').selectOption('all');assert.equal(await page.locator('[data-node]').count(),240);assert.equal(await page.locator('[data-edge]').count(),512);
   await page.locator('#workspaceSource').selectOption('case');await page.waitForURL(/source=case/);await page.waitForFunction(()=>window.EG_WORKSPACE_READY);
   assert.equal(await page.locator('[data-node]').count(),4);assert.equal(await page.locator('[data-edge]').count(),2);
   await page.setViewportSize({width:390,height:900});await page.locator('#reviewPublicCase').click();
   assert(await page.locator('#contractComparison').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await shot(page,'stripe-mobile');
  },caseURL);
  }
 }finally{await browser.close();record.finished=new Date().toISOString();save();}
 assert(record.checks.every(r=>r.status==='PASS'));assert.deepEqual(record.pageErrors,[]);assert.deepEqual(record.failedRequests,[]);
}
main().catch(e=>{record.error=e.stack;save();console.error(e.stack);process.exitCode=1;});
