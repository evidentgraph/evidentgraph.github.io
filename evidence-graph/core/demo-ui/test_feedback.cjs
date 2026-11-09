'use strict';
// DOM interaction checks, not browser, layout, accessibility or deployment tests.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {setImmediate:tick}=require('node:timers/promises');
const {JSDOM,VirtualConsole}=require(process.env.EG_DOM_MODULE||'jsdom');
const preview=process.env.EG_PREVIEW_ROOT||path.resolve(__dirname,'../../preview-m2');

async function until(check){
  const end=Date.now()+2500;
  while(!check()){
    if(Date.now()>end)throw new Error('Preview did not reach the expected DOM state');
    await tick();
  }
}

function fixture(t,url='http://127.0.0.1/'){
  const errors=[];
  const console=new VirtualConsole();
  console.on('jsdomError',error=>errors.push(error.message));
  const dom=new JSDOM(fs.readFileSync(path.join(preview,'index.html'),'utf8'),{
    url,runScripts:'outside-only',virtualConsole:console,
  });
  const w=dom.window;
  // jsdom provides no layout engine, ResizeObserver or native dialog UI.
  w.ResizeObserver=class{observe(){} disconnect(){}};
  w.Blob=Blob;w.Response=Response;w.DecompressionStream=DecompressionStream;
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
  w.addEventListener('error',event=>errors.push(event.message));
  t.after(()=>{dom.window.close();assert.deepEqual(errors,[]);});
  const run=name=>new vm.Script(fs.readFileSync(path.join(preview,name),'utf8'),{filename:name}).runInContext(dom.getInternalVMContext());
  const evaluate=code=>vm.runInContext(code,dom.getInternalVMContext());
  const $=id=>w.document.getElementById(id);
  const select=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new w.Event('change',{bubbles:true}));};
  const search=value=>{$('search').value=value;$('search').dispatchEvent(new w.Event('input',{bubbles:true}));};
  const click=selector=>{const el=w.document.querySelector(selector);assert.ok(el,selector);if(typeof el.click==='function')el.click();else el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));};
  run('data.js');run('app.js');
  return {w,run,evaluate,$,select,search,click};
}

async function ready(t,url){
  const f=fixture(t,url);
  for(const name of ['lineage.js','exploration.js','investigation.js'])f.run(name);
  await until(()=>f.w.EG_READY);
  assert.notEqual(f.$('loadStatus').getAttribute('role'),'alert');
  return f;
}

test('late investigation still connects graph/list controls',async t=>{
  const f=fixture(t);f.run('lineage.js');f.run('exploration.js');
  await until(()=>f.evaluate('!!result && view==="lineage"'));
  f.run('investigation.js');
  f.$('graphToList').click();
  assert.equal(f.$('graphViewport').hidden,true);
  assert.equal(f.$('graphListPanel').hidden,false);
  assert.ok(f.w.document.querySelectorAll('[data-investigate]').length===3);
  f.$('graphAsGraph').click();
  assert.equal(f.$('graphViewport').hidden,false);
});

test('late graph and investigation initialize after the core is ready',async t=>{
  const f=fixture(t);await until(()=>f.evaluate('!!result'));
  for(const name of ['lineage.js','exploration.js','investigation.js'])f.run(name);
  assert.equal(f.w.document.querySelectorAll('[data-node]').length,6);
  assert.equal(f.w.document.querySelectorAll('[data-investigate]').length,3);
  f.$('graphReview').click();assert.equal(f.$('analysisView').hidden,false);
});

test('a repeated ready event does not duplicate actions or graph links',async t=>{
  const f=await ready(t);
  f.w.document.dispatchEvent(new f.w.CustomEvent('eg:ready'));
  assert.equal(f.w.document.querySelectorAll('[data-investigate]').length,3);
  assert.equal(f.w.document.querySelectorAll('[data-return-graph]').length,4);
});

test('analysis is explicitly open and repeated clicks preserve the filter',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.search('Serviço');
  assert.match(f.$('analysisState').textContent,/já aberta/);
  for(let i=0;i<3;i++)f.$('openAnalysis').click();
  assert.equal(f.$('search').value,'Serviço');
  assert.equal(f.$('consumerRows').children.length,1);
  assert.match(f.$('toast').textContent,/já está aberta/);
});

test('graph paths and return to the analysis preserve change and filter',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.search('Serviço');
  f.$('analysisToGraph').click();
  assert.equal(f.$('lineageView').hidden,false);
  assert.equal(f.$('graphScope').value,'impact');
  assert.equal(f.w.document.querySelectorAll('[data-node]').length,2);
  f.$('graphReview').click();
  assert.equal(f.$('analysisView').hidden,false);
  assert.equal(f.$('search').value,'Serviço');
  assert.equal(f.$('changeSelect').value,'CHG-001');
});

test('returning from exploration list to analysis then graph shows the graph',async t=>{
  const f=await ready(t);f.$('graphToList').click();f.$('graphReview').click();
  f.$('analysisToGraph').click();
  assert.equal(f.$('graphViewport').hidden,false);
  assert.equal(f.$('graphListPanel').hidden,true);
});

test('connection list preserves IDs and names the actual direct relation',async t=>{
  const f=await ready(t);
  const ids=Array.from(f.w.document.querySelectorAll('[data-node]'),n=>n.dataset.node).sort();
  f.$('graphToList').click();
  const listed=Array.from(f.w.document.querySelectorAll('[data-explore-row]'),n=>n.dataset.exploreRow).sort();
  assert.deepEqual(listed,ids);
  assert.match(f.w.document.querySelector('[data-explore-row="svc-comercial-pedidos"]').textContent,/Serviço de pedidos chama/);
  assert.match(f.w.document.querySelector('[data-explore-row="agent-atendimento"]').textContent,/Caminho registrado:.*Consultar cliente/);
  f.$('graphAsGraph').click();assert.equal(f.$('graphViewport').hidden,false);
});

test('pending selection hides old results and opens the selected scenario',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.select('changeSelect','CHG-002');
  assert.equal(f.$('analysisResult').hidden,true);
  assert.equal(f.$('analysisToGraph').disabled,true);
  assert.match(f.$('analysisState').textContent,/Nova mudança/);
  f.$('openAnalysis').click();
  assert.equal(f.$('analysisResult').hidden,false);
  assert.equal(f.$('consumerRows').children.length,2);
  assert.match(f.$('analysisState').textContent,/CHG-002/);
  assert.match(f.$('consumerRows').textContent,/quantidade_prevista/);
  assert.doesNotMatch(f.$('consumerRows').textContent,/cliente_id/);
});

test('consumer explanation ties the contract field to the change and owner',async t=>{
  const f=await ready(t);f.$('graphReview').click();
  f.click('[data-detail="svc-comercial-pedidos"]');
  const text=f.$('detailBody').textContent;
  assert.match(text,/contrato de Serviço de pedidos exige cliente_id/);
  assert.match(text,/mudança proposta remove esse campo/);
  assert.match(text,/Equipe Comercial/);
  assert.match(text,/Acesso efetivo ao campo: não avaliado/);
  assert.ok(f.$('detailBody').querySelector('.path'));
});

test('unknown remains inconclusive and notes do not approve the change',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.select('changeSelect','CHG-003');f.$('openAnalysis').click();
  assert.match(f.$('consumerRows').textContent,/Inconclusivo/);
  f.click('[data-detail="job-financeiro-cobranca"]');
  f.$('reviewNote').value='Verificar com a equipe.';
  f.$('reviewNote').dispatchEvent(new f.w.Event('input',{bubbles:true}));
  const report=f.evaluate('report()');
  assert.match(report,/Verificar com a equipe/);
  assert.match(report,/Inconclusivo/);
  assert.match(report,/Não representa aprovação/);
});

test('a contract without the field is explained without promising safety',async t=>{
  const f=await ready(t);f.$('graphReview').click();
  f.click('[data-detail="app-atendimento-portal"]');
  assert.match(f.$('detailBody').textContent,/contrato avaliado de Portal de acompanhamento não exige cliente_id/);
  assert.match(f.$('detailBody').textContent,/não garante ausência de outros impactos/);
});

test('full catalog stays intact and an unrelated asset gains no invented path',async t=>{
  const f=await ready(t);f.select('graphScope','all');
  assert.equal(f.w.document.querySelectorAll('[data-node]').length,240);
  assert.equal(f.w.document.querySelectorAll('[data-edge]').length,512);
  f.$('graphToList').click();
  assert.equal(f.w.document.querySelectorAll('[data-explore-row]').length,240);
  assert.match(f.w.document.querySelector('[data-explore-row="api-clientes-qa"]').textContent,/Sem vínculo direto/);
});

test('secondary filters remain visible as active and clear restores consumers',async t=>{
  const f=await ready(t);f.$('graphReview').click();
  f.select('ownerFilter','team-financeiro');
  assert.equal(f.$('consumerRows').children.length,1);
  assert.match(f.$('filterSummary').textContent,/1 em uso/);
  f.select('activityFilter','UNKNOWN');
  assert.match(f.$('filterSummary').textContent,/2 em uso/);
  f.$('clearFilters').click();
  assert.equal(f.$('consumerRows').children.length,4);
  assert.equal(f.$('filterSummary').textContent,'Mais filtros');
});


test('a shared analysis reopens its change and filters without local notes',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.select('changeSelect','CHG-003');f.$('openAnalysis').click();
  f.search('fechamento');f.click('[data-detail="job-financeiro-cobranca"]');
  f.$('reviewNote').value='Anotação particular que fica local';
  f.$('reviewNote').dispatchEvent(new f.w.Event('input',{bubbles:true}));
  await until(()=>f.w.location.search.includes('CHG-003')&&f.w.location.search.includes('fechamento'));
  assert.doesNotMatch(f.w.location.href,/particular|reviewNote|note=/);
  const shared=await ready(t,f.w.location.href);
  assert.equal(shared.$('analysisView').hidden,false);
  assert.equal(shared.$('changeSelect').value,'CHG-003');
  assert.equal(shared.$('search').value,'fechamento');
  assert.match(shared.$('consumerRows').textContent,/Inconclusivo/);
});

test('a shared pending selection does not silently open the new analysis',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.select('changeSelect','CHG-002');
  await until(()=>f.w.location.search.includes('eg_open=CHG-001'));
  const shared=await ready(t,f.w.location.href);
  assert.equal(shared.$('changeSelect').value,'CHG-002');
  assert.equal(shared.$('analysisResult').hidden,true);
  assert.equal(shared.$('analysisToGraph').disabled,true);
  assert.match(shared.$('analysisState').textContent,/Nova mudança/);
});

test('shared graph investigation preserves selected asset, reach and representation',async t=>{
  const f=await ready(t);
  f.click('[data-node="svc-comercial-pedidos"]');f.click('[data-investigate="upstream"]');
  f.select('investigationDepth','2');
  f.$('graphTechnical').checked=true;f.$('graphTechnical').dispatchEvent(new f.w.Event('change',{bubbles:true}));
  f.$('graphToList').click();
  await until(()=>f.w.location.search.includes('eg_rep=list'));
  const ids=f.evaluate('EGGraph.snapshot().ids.slice().sort()').join('|');
  const shared=await ready(t,f.w.location.href);
  assert.equal(shared.$('graphListPanel').hidden,false);
  assert.equal(shared.$('investigationDepth').value,'2');
  assert.equal(shared.evaluate('EGGraph.snapshot().selected'),'svc-comercial-pedidos');
  assert.equal(shared.evaluate('EGGraph.snapshot().ids.slice().sort()').join('|'),ids);
});

test('browser back and forward restore the previously visited sections',async t=>{
  const f=await ready(t);
  f.$('graphReview').click();await until(()=>f.w.location.search.includes('eg_view=analysis'));
  f.click('[data-view="inventory"]');await until(()=>f.w.location.search.includes('eg_view=inventory'));
  f.w.history.back();await until(()=>!f.$('analysisView').hidden);
  f.w.history.forward();await until(()=>!f.$('inventoryView').hidden);
});

test('unknown URL values fall back to available data instead of breaking the page',async t=>{
  const f=await ready(t,'http://127.0.0.1/?eg_view=nope&eg_change=unknown&eg_focus=__proto__&eg_asset=constructor&eg_mode=unknown&eg_depth=-99');
  assert.equal(f.$('lineageView').hidden,false);
  assert.equal(f.$('changeSelect').value,'CHG-001');
  assert.equal(f.evaluate('EGGraph.snapshot().root'),f.evaluate('result.change.target'));
  assert.equal(f.w.document.querySelectorAll('[data-node]').length,27);
});

test('raw and curated fields remain distinguishable across graph, list, detail and export',async t=>{
  const f=await ready(t);f.click('[data-node="svc-comercial-pedidos"]');f.click('[data-investigate="process"]');
  f.$('graphTechnical').checked=true;f.$('graphTechnical').dispatchEvent(new f.w.Event('change',{bubbles:true}));
  assert.match(f.w.document.querySelector('[data-node="tbl-comercial-pedidos-raw.id"]').getAttribute('aria-label'),/Bruto · Pedidos.id/);
  assert.match(f.w.document.querySelector('[data-node="tbl-comercial-pedidos-curated.id"]').getAttribute('aria-label'),/Tratado · Pedidos.id/);
  f.$('graphToList').click();
  assert.match(f.$('exploreRows').textContent,/Bruto · Pedidos.id/);
  assert.match(f.evaluate('EGInvestigation.report()'),/Tratado · Pedidos.id/);
  f.click('[data-explore-detail="tbl-comercial-pedidos-raw.id"]');
  assert.equal(f.$('detailTitle').textContent,'Bruto · Pedidos.id');
  assert.match(f.$('detailBody').textContent,/tbl-comercial-pedidos-raw.id/);
});

test('shared consumer evidence reopens the exact record without sharing the note',async t=>{
  const f=await ready(t);f.$('graphReview').click();f.click('[data-detail="svc-comercial-pedidos"]');
  const ev=f.$('detailBody').querySelector('[data-evidence-id]');ev.open=true;
  f.$('reviewNote').value='PRIVATE NOTE';f.$('reviewNote').dispatchEvent(new f.w.Event('input',{bubbles:true}));
  await until(()=>f.w.location.search.includes('eg_evidence='));
  const shared=await ready(t,f.w.location.href);
  assert.equal(shared.$('detailDialog').open,true);
  assert.equal(shared.$('detailTitle').textContent,'Serviço de pedidos');
  assert.equal(shared.$('detailBody').querySelector('[open]').dataset.evidenceId,ev.dataset.evidenceId);
  assert.equal(shared.$('reviewNote').value,'');
  shared.$('closeDetail').click();await until(()=>!shared.w.location.search.includes('eg_detail='));
});

test('relation evidence links cannot open unrelated records',async t=>{
  const f=await ready(t);f.click('[data-relation]');
  const ev=f.$('detailBody').querySelector('[data-evidence-id]');ev.open=true;
  await until(()=>f.w.location.search.includes('eg_evidence='));
  const shared=await ready(t,f.w.location.href);
  assert.equal(shared.$('detailKind').textContent,'RELAÇÃO');
  assert.equal(shared.$('detailBody').querySelector('[open]').dataset.evidenceId,ev.dataset.evidenceId);
  const url=new URL(f.w.location.href);url.searchParams.set('eg_evidence','__proto__');
  const invalid=await ready(t,url.href);
  assert.equal(invalid.$('detailBody').querySelectorAll('[open]').length,0);
  assert(!invalid.w.location.search.includes('eg_evidence='));
});

test('back to pending analysis dismisses the stale confirmation and closes detail',async t=>{
  const f=await ready(t);f.$('graphReview').click();await until(()=>f.w.location.search.includes('eg_view=analysis'));
  f.select('changeSelect','CHG-003');await until(()=>f.w.location.search.includes('eg_open=CHG-001'));
  f.$('openAnalysis').click();await until(()=>!f.w.location.search.includes('eg_open='));
  assert.match(f.$('toast').textContent,/Análise aberta/);
  f.w.history.back();await until(()=>!f.$('notAnalyzed').hidden);
  assert.equal(f.$('toast').hidden,true);assert.equal(f.$('toast').textContent,'');
  assert.equal(f.$('detailDialog').open,false);
});

test('return to selected asset reveals it even when a filter excluded it',async t=>{
  const f=await ready(t);f.w.EGGraph.select('svc-comercial-pedidos');f.select('graphDomain','financeiro');
  assert(!f.w.EGGraph.snapshot().ids.includes('svc-comercial-pedidos'));
  f.$('graphFocusSelected').click();
  assert.equal(f.w.EGGraph.snapshot().root,'svc-comercial-pedidos');
  assert(f.w.EGGraph.snapshot().ids.includes('svc-comercial-pedidos'));
});
