'use strict';
// Real-browser checks of a recorded local simulation. Never calls Stripe.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.EG_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.EG_CASE_URL,output=process.env.EG_BROWSER_OUTPUT;
assert(base&&output,'Set EG_CASE_URL and a new external EG_BROWSER_OUTPUT directory');
fs.mkdirSync(output,{recursive:false});
const record={started:new Date().toISOString(),base,checks:[],pageErrors:[],failedRequests:[],externalRequests:[],sandboxRequested:true};
const save=()=>fs.writeFileSync(path.join(output,'RESULTADO.json'),JSON.stringify(record,null,2)+'\n');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const analysis=new URL('?source=case&eg_view=analysis&eg_change=CASE-001&eg_scope=all&eg_technical=1',base).href;
async function open(page,url=analysis){assert.equal((await page.goto(url,{waitUntil:'networkidle'})).status(),200);await page.waitForFunction(()=>window.EG_WORKSPACE_READY);}
async function main(){
 const browser=await chromium.launch({headless:true,chromiumSandbox:true});record.browser=browser.version();
 async function context(viewport={width:1440,height:1000}){
  const ctx=await browser.newContext({viewport,acceptDownloads:true});ctx.on('page',p=>{
   p.setDefaultTimeout(9000);p.on('pageerror',e=>record.pageErrors.push(e.message));
   p.on('requestfailed',r=>record.failedRequests.push({url:r.url(),error:r.failure()}));
   p.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin)record.externalRequests.push(r.url());});
  });return ctx;
 }
 async function check(name,fn){
  const ctx=await context(),p=await ctx.newPage();
  try{await open(p);await fn(p,ctx);record.checks.push({name,status:'PASS'});console.log('PASS '+name);}
  catch(e){record.checks.push({name,status:'FAIL',error:e.stack});await p.screenshot({path:path.join(output,'failure-'+record.checks.length+'.png'),fullPage:true}).catch(()=>{});console.log('FAIL '+name+' '+e.message);}
  finally{await ctx.close();save();}
 }
 try{
  await check('mixed sources are explicit and no real consumer or API execution is invented',async p=>{
   assert.match(await p.locator('#workspaceEnvironment').innerText(),/Contratos públicos \+ consumidor simulado/);
   assert.match(await p.locator('#conclusionTitle').innerText(),/perde a associação no exemplo/);
   const state=await p.evaluate(()=>({real:data.provenance.facts,simulation:data.provenance.consumer_demo,consumers:result.consumers,coverage:data.coverage}));
   assert.equal(state.real.consumer_coverage,'UNKNOWN');assert.equal(state.real.consumer_runtime_result,'NOT_VERIFIED');
   assert.equal(state.simulation.synthetic,true);assert.equal(state.simulation.external_api_called,false);assert.equal(state.simulation.runs.length,23);
   assert.deepEqual(state.consumers,[]);assert.deepEqual(state.coverage,[]);
   const cards=p.locator('.demo-run');assert.equal(await cards.count(),3);assert.match(await cards.nth(0).innerText(),/Assinatura associada/);
   assert.match(await cards.nth(1).innerText(),/Sem assinatura/);assert.match(await cards.nth(1).innerText(),/Diverge/);assert.match(await cards.nth(1).innerText(),/sem exceção/);
   assert.match(await cards.nth(2).innerText(),/Assinatura associada/);
   await p.locator('#consumerDemo').screenshot({path:path.join(output,'comparacao-desktop.png')});
  });
  await check('all prepared examples render their recorded outcomes including review and old defects',async p=>{
   const cases=await p.locator('#demoCaseSelect option').evaluateAll(options=>options.map(o=>o.value));assert.equal(cases.length,9);
   for(const id of cases){
    await p.locator('#demoCaseSelect').selectOption(id);
    const expected=await p.evaluate(id=>data.provenance.consumer_demo.runs.filter(r=>r.case_id===id),id);
    assert.equal(await p.locator('.demo-run').count(),expected.length);
    for(let i=0;i<expected.length;i++){
     const card=p.locator('.demo-run').nth(i);assert.equal(await card.getAttribute('class'),`demo-run ${expected[i].matches_expectation?'matches':'differs'}`);
     await card.locator('summary').click();
     const rendered=JSON.parse(await card.locator('pre').innerText());assert.deepEqual(rendered.entrada,expected[i].input);assert.deepEqual(rendered.obtido,expected[i].actual);assert.deepEqual(rendered.esperado,expected[i].expected);
    }
   }
   await p.locator('#demoCaseSelect').selectOption('optional-omitted');assert.equal(await p.locator('.demo-run.differs').count(),2);assert.match(await p.locator('.demo-run.matches').innerText(),/Pedir revisão/);
   await p.locator('#demoCaseSelect').selectOption('explicit-null');assert.equal(await p.locator('.demo-run.differs').count(),0);assert.match(await p.locator('.demo-run').last().innerText(),/Sem assinatura/);
   await p.locator('#demoCaseSelect').selectOption('unknown-parent-type');assert.match(await p.locator('#demoCategory').innerText(),/robustez/);
   await p.locator('#consumerDemo').screenshot({path:path.join(output,'revisao-necessaria.png')});
  });
  await check('simulated consumer evidence link restores in a new context and closes before reload',async(p,ctx)=>{
   await p.locator('[data-demo-detail="demo-legacy"]').click();assert.match(await p.locator('#detailTitle').innerText(),/simulado/);
   const ev=p.locator('#detailBody [data-evidence-id="demo-evidence-legacy"]');await ev.locator('summary').click();
   await p.waitForFunction(()=>location.search.includes('eg_evidence=demo-evidence-legacy'));
   await ctx.grantPermissions(['clipboard-read','clipboard-write']);await p.locator('#copyDetailLink').click();
   await p.waitForFunction(()=>document.querySelector('#detailShareStatus').textContent.includes('Link copiado'));
   const url=await p.evaluate(()=>navigator.clipboard.readText());const other=await context();
   try{const fresh=await other.newPage();await open(fresh,url);assert(await fresh.locator('#detailDialog').isVisible());assert.equal(await fresh.locator('[data-evidence-id][open]').getAttribute('data-evidence-id'),'demo-evidence-legacy');
    assert.match(await fresh.locator('#detailBody').innerText(),/Não identifica uso real/);
    await fresh.keyboard.press('Escape');await fresh.reload({waitUntil:'networkidle'});assert(!(await fresh.locator('#detailDialog').isVisible()));
   }finally{await other.close();}
  });
  await check('export and downloadable execution evidence preserve observations, sources and limits',async p=>{
   await p.locator('.demo-evidence summary').click();const downloadWait=p.waitForEvent('download');await p.locator('.demo-evidence a[href="demo/result.json"]').click();
   const download=await downloadWait;const file=path.join(output,'resultado-baixado.json');await download.saveAs(file);const report=JSON.parse(fs.readFileSync(file));assert.equal(report.runs.length,23);
   for(const source of report.files){const response=await p.request.get(new URL(source.file,base).href);assert.equal(response.status(),200);assert.equal(hash(await response.body()),source.sha256);}
   const exported=p.waitForEvent('download');await p.locator('#exportBtn').click();const d=await exported;const f=path.join(output,'revisao-exportada.md');await d.saveAs(f);const md=fs.readFileSync(f,'utf8');
   assert.match(md,/Consumidor simulado: execução local registrada/);assert.match(md,/UNKNOWN/);assert.match(md,/NOT_VERIFIED/);assert.match(md,/Diverge/);assert.match(md,/Pedir revisão/);
   assert.match(md,/não é avaliação independente/);assert(!md.includes('Nenhum código de consumidor foi executado'));assert.equal((md.match(/^\| .* \| (?:Confere|Diverge) \|$/gm)||[]).length,23);
  });
  await check('graph and list show labeled illustrative reads; Aurora remains separate',async p=>{
   await p.locator('#analysisToGraph').click();assert.equal(await p.locator('[data-node]').count(),6);assert.equal(await p.locator('[data-edge]').count(),4);
   const rels=await p.evaluate(()=>data.relations.filter(r=>r.kind==='DEMO_READS'));assert.equal(rels.length,2);assert(rels.every(r=>r.environment==='simulation'));
   await p.locator('[data-node="demo-legacy"]').click();assert.match(await p.locator('.inspector-impact p').innerText(),/não representa uma integração real/);
   await p.locator('#graphFit').click();await p.locator('#graphViewport').screenshot({path:path.join(output,'grafo-com-exemplo.png')});
   await p.locator('#graphToList').click();assert.equal(await p.locator('[data-explore-row]').count(),6);
   await p.locator('#graphAsGraph').click();assert(await p.locator('#graphViewport').isVisible());
   await p.locator('#workspaceSource').selectOption('aurora');await p.waitForURL(/source=aurora/);await p.waitForFunction(()=>window.EG_WORKSPACE_READY);
   assert.equal(await p.locator('#consumerDemo').count(),0);assert.match(await p.locator('#workspaceEnvironment').innerText(),/fictícios/);
   await p.locator('#graphScope').selectOption('all');assert.equal(await p.locator('[data-node]').count(),240);assert.equal(await p.locator('[data-edge]').count(),512);
   await p.locator('#workspaceSource').selectOption('case');await p.waitForURL(/source=case/);await p.waitForFunction(()=>window.EG_WORKSPACE_READY);assert.equal(await p.locator('[data-node]').count(),6);
  });
  await check('320 and 390 pixel layouts keep examples and evidence usable',async()=>{
   for(const width of [320,390]){const ctx=await context({width,height:900});try{
    const p=await ctx.newPage();await open(p);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const rects=await p.locator('.demo-run').evaluateAll(nodes=>nodes.map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom})));
    assert(rects[1].top>=rects[0].bottom);assert(rects[2].top>=rects[1].bottom);
    await p.locator('.demo-run').nth(1).locator('summary').click();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await p.locator('#consumerDemo').screenshot({path:path.join(output,`comparacao-mobile-${width}.png`)});
   }finally{await ctx.close();}}
  });
 }finally{await browser.close();record.finished=new Date().toISOString();save();}
 assert(record.checks.every(c=>c.status==='PASS'));assert.deepEqual(record.pageErrors,[]);assert.deepEqual(record.failedRequests,[]);assert.deepEqual(record.externalRequests,[]);
}
main().catch(e=>{record.error=e.stack;save();console.error(e.stack);process.exitCode=1;});
