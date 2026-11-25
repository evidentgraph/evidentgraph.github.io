"""Render a bounded, documented response-field removal in the existing M3 UI.

No network, code execution, consumer discovery or compatibility prediction.
Inputs are hash-pinned OpenAPI 3 JSON and a local case description.
"""
from __future__ import annotations
import argparse
import base64
from datetime import datetime
import gzip
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / 'lab-runtime'))
from view_lifecycle import prepare
PREVIEW = HERE.parents[1] / 'preview-m2'
FILES = ['index.html', 'styles.css', 'lineage.css', 'investigation.css', 'data.js',
         'app.js', 'lineage.js', 'exploration.js', 'investigation.js', 'manifest.json']


def replace_once(text, old, new):
    if text.count(old) != 1:
        raise ValueError('M3 source changed; review the case adapter: ' + old[:60])
    return text.replace(old, new)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def unique(pairs):
    out = {}
    for key, value in pairs:
        if key in out:
            raise ValueError('Duplicate JSON key: ' + key)
        out[key] = value
    return out


def load_json(path, limit=10 * 1024 * 1024):
    if path.stat().st_size > limit:
        raise ValueError('JSON exceeds the input size limit')
    raw = path.read_bytes()
    def invalid(value):
        raise ValueError('Invalid JSON number: ' + value)
    return raw, json.loads(raw, object_pairs_hook=unique, parse_constant=invalid)


def https_url(value):
    parsed = urlsplit(value)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Source references must be HTTPS URLs without credentials')
    return value


def spec_input(recipe, key, folder):
    entry = recipe[key]
    raw, spec = load_json((folder / entry['file']).resolve())
    if sha(raw) != entry['sha256']:
        raise ValueError('Input hash mismatch: ' + key)
    if not isinstance(spec, dict) or not str(spec.get('openapi', '')).startswith('3.'):
        raise ValueError('Expected OpenAPI 3 JSON')
    if not isinstance(spec.get('info', {}).get('version'), str):
        raise ValueError('Missing contract version')
    queue = [spec]
    while queue:
        item = queue.pop()
        if isinstance(item, dict):
            if '$ref' in item and (not isinstance(item['$ref'], str) or not item['$ref'].startswith('#/')):
                raise ValueError('External references are outside this local adapter')
            queue.extend(item.values())
        elif isinstance(item, list):
            queue.extend(item)
    return raw, spec, {'id': key, 'url': https_url(entry['url']), 'sha256': sha(raw),
                       'version': spec['info']['version'], 'file': 'sources/' + key + '.json'}


def token(value):
    return value.replace('~', '~0').replace('/', '~1')


def dereference(spec, node, pointer):
    visited = set()
    for _ in range(64):
        if not isinstance(node, dict):
            raise ValueError('Unsupported response schema')
        if '$ref' in node:
            ref = node['$ref']
            if ref in visited:
                raise ValueError('Cyclic reference in the selected path')
            visited.add(ref)
            node = spec
            for part in ref[2:].split('/'):
                key = part.replace('~1', '/').replace('~0', '~')
                node = node[int(key)] if isinstance(node, list) else node[key]
            pointer = ref
        elif 'anyOf' in node and len(node['anyOf']) == 1:
            node = node['anyOf'][0]
            pointer += '/anyOf/0'
        elif any(key in node for key in ['allOf', 'oneOf', 'anyOf', 'not']):
            raise ValueError('Composite selected schemas require manual review')
        else:
            return node, pointer
    raise ValueError('Reference depth exceeds the supported scope')


def field_at(spec, recipe, fields):
    endpoint, method, status = recipe['endpoint'], recipe['method'].lower(), recipe['response_status']
    node = spec['paths'][endpoint][method]['responses'][status]['content']['application/json']['schema']
    pointer = '#/paths/' + token(endpoint) + '/' + method + '/responses/' + token(status) + '/content/application~1json/schema'
    for index, name in enumerate(fields):
        node, pointer = dereference(spec, node, pointer)
        props = node.get('properties')
        if not isinstance(props, dict):
            raise ValueError('Selected path must have explicit object properties')
        if name not in props:
            if index != len(fields) - 1:
                raise ValueError('Parent path is missing; absence of the field is not established')
            return {'present': False, 'pointer': pointer, 'required': False}
        required = name in node.get('required', [])
        node = props[name]
        pointer += '/properties/' + token(name)
    return {'present': True, 'pointer': pointer, 'required': required, 'schema': node}


def inspect_case(recipe_path):
    _, recipe = load_json(recipe_path, 64 * 1024)
    if recipe['schema_version'] != 'eg-contract-case/v1' or recipe['material_kind'] != 'public_contracts':
        raise ValueError('Expected a public-contract case description')
    for key in ['title', 'endpoint', 'method', 'response_status', 'captured_at']:
        if not isinstance(recipe[key], str) or not 1 <= len(recipe[key]) <= 240:
            raise ValueError('Invalid case field: ' + key)
    if datetime.fromisoformat(recipe['captured_at'].replace('Z', '+00:00')).tzinfo is None:
        raise ValueError('The preservation timestamp needs an explicit time zone')
    for key in ['field', 'replacement_field']:
        fields = recipe.get(key, [])
        if not isinstance(fields, list) or len(fields) > 16 or any(not isinstance(v, str) or not v or len(v) > 120 for v in fields):
            raise ValueError('Invalid property path')
    if not recipe['field']:
        raise ValueError('Select a response field')
    before_raw, before, bs = spec_input(recipe, 'before', recipe_path.parent)
    after_raw, after, rs = spec_input(recipe, 'after', recipe_path.parent)
    previous, current = field_at(before, recipe, recipe['field']), field_at(after, recipe, recipe['field'])
    if not previous['present'] or current['present']:
        raise ValueError('This adapter requires a field declared before and absent after')
    replacement = field_at(after, recipe, recipe['replacement_field']) if recipe.get('replacement_field') else None
    if replacement and not replacement['present']:
        raise ValueError('The declared replacement path is absent from the new contract')
    facts = {'title': recipe['title'], 'endpoint': recipe['endpoint'], 'method': recipe['method'].upper(),
             'response_status': recipe['response_status'], 'field': recipe['field'],
             'replacement_field': recipe.get('replacement_field', []), 'previous': previous,
             'current': current, 'replacement': replacement, 'sources': [bs, rs],
             'documentation_url': https_url(recipe['documentation_url']),
             'migration_note': str(recipe.get('migration_note', 'Caminho indicado para revisão; equivalência não inferida.'))[:1200],
             'captured_at': recipe['captured_at'], 'consumer_coverage': 'UNKNOWN',
             'consumer_runtime_result': 'NOT_VERIFIED', 'findings_scope': 'Presence in the selected JSON response schema only'}
    inputs = {'before.json': before_raw, 'after.json': after_raw}
    if recipe.get('license'):
        license_entry = recipe['license']
        license_path = (recipe_path.parent / license_entry['file']).resolve()
        if license_path.stat().st_size > 64 * 1024:
            raise ValueError('License file exceeds the supported size')
        license_raw = license_path.read_bytes()
        if sha(license_raw) != license_entry['sha256']:
            raise ValueError('License hash mismatch')
        inputs['CONTRACTS_LICENSE.txt'] = license_raw
        facts['license'] = {'file': 'sources/CONTRACTS_LICENSE.txt', 'sha256': sha(license_raw),
                            'url': https_url(license_entry['url'])}
    return facts, inputs


def make_bundle(facts):
    version = 'contract-case-v1-' + sha(json.dumps(facts, sort_keys=True).encode())[:16]
    env, owner, domain = 'documentation', 'unknown', 'documentos'
    assets, relations, evidence = [], [], []
    def asset(id, name, kind, source, evidence_ids):
        assets.append({'id': id, 'name': name, 'kind': kind, 'domain': domain, 'owner': owner,
                       'environment': env, 'version': source['version'], 'processes': [], 'evidence_ids': evidence_ids})
    for stage, source in zip(['before', 'after'], facts['sources']):
        ev_id = 'contract-' + stage
        finding = facts['previous'] if stage == 'before' else facts['current']
        evidence.append({'id': ev_id, 'family': 'code', 'claim': 'documented_response_field',
                         'reference': source['url'], 'local_copy': source['file'], 'sha256': source['sha256'],
                         'collected_at': facts['captured_at'], 'environment': env, 'version': source['version'],
                         'details': finding, 'limitation': 'Contrato documental; execução e consumidores não observados.'})
        api = 'response-' + stage
        asset(api, ('Antes · ' if stage == 'before' else 'Depois · ') + source['version'], 'api', source, [ev_id])
        field = facts['field'] if stage == 'before' else facts['replacement_field']
        if field:
            field_id = 'field-' + stage
            if stage == 'after':
                evidence[-1]['replacement'] = facts['replacement']
                evidence[-1]['replacement_note'] = facts['migration_note']
            asset(field_id, '.'.join(field), 'column', source, [ev_id])
            relations.append({'id': 'contains-' + stage, 'source': api, 'target': field_id,
                              'kind': 'CONTAINS', 'environment': env, 'evidence_ids': [ev_id]})
    change = {'id': 'CASE-001', 'target': 'response-before', 'operation': 'remove_field',
              'field': '.'.join(facts['field']), 'before_version': facts['sources'][0]['version'],
              'after_version': facts['sources'][1]['version'], 'environment': env,
              'window_start': None, 'window_end': None}
    return {'synthetic': False, 'dataset_version': version, 'clock': facts['captured_at'],
            'provenance': {'kind': 'public_contract_case', 'adapter_version': '1', 'facts': facts},
            'teams': [{'id': owner, 'name': 'Responsável não identificado'}],
            'domains': [{'id': domain, 'name': 'Contratos documentados'}], 'processes': [], 'sources': facts['sources'],
            'assets': assets, 'relations': relations, 'evidence': evidence, 'coverage': [],
            'results': [{'change': change, 'consumers': [], 'truncated': False,
                         'scope_note': 'Campo removido do contrato documentado. Consumidores e impacto operacional desconhecidos.'}]}


def build(recipe_path, out, preview=PREVIEW, with_consumer_demo=False):
    if out.exists():
        raise ValueError('Choose a new output directory; existing files are never overwritten')
    facts, inputs = inspect_case(recipe_path)
    bundle = make_bundle(facts)
    demo_files = {}
    if with_consumer_demo:
        from consumer_demo import run, attach
        demo_report, demo_files = run(facts, inputs)
        attach(bundle, demo_report, demo_files)
    texts = {name: (preview / name).read_text(encoding='utf-8') for name in FILES}
    source_hashes = {name: sha(text.encode()) for name, text in texts.items()}
    match = re.search(r'window.EG_PACKED\s*=\s*("[^"\n]+")\s*;', texts['data.js'])
    if not match:
        raise ValueError('Missing Aurora baseline')
    original = json.loads(match[1])
    aurora = json.loads(gzip.decompress(base64.b64decode(original)))
    if len(aurora['assets']) != 240 or len(aurora['relations']) != 512:
        raise ValueError('Unexpected Aurora catalog')
    packed = base64.b64encode(gzip.compress(json.dumps(bundle, ensure_ascii=False).encode(), mtime=0)).decode()
    texts['data.js'] = 'window.EG_PACKED = new URLSearchParams(location.search).get("source")==="aurora" ? ' + json.dumps(original) + ':' + json.dumps(packed) + ';\n'
    texts['app.js'] = replace_once(texts['app.js'], 'data.synthetic!==true||', "(data.synthetic!==true&&data.provenance?.kind!=='public_contract_case')||")
    texts['app.js'] = replace_once(texts['app.js'], 'const SCENARIOS = {', "const SCENARIOS = {'CASE-001':'Revisar campo removido do contrato',")
    texts['app.js'] = replace_once(texts['app.js'], 'const envLabel = value => ', "const envLabel = value => value==='documentation'?'Documentação pública':")
    texts['lineage.js'] = replace_once(texts['lineage.js'], 'const domainNames={', "const domainNames={documentos:'Contratos documentados',")
    texts['lineage.js'] = replace_once(texts['lineage.js'], 'const longest=Math.max(1,...buckets.map(b=>b.length));',
        "if(data.provenance?.kind==='public_contract_case')for(const bucket of buckets)bucket.sort((a,b)=>Number(a.id.endsWith('after')||a.id==='demo-migrated')-Number(b.id.endsWith('after')||b.id==='demo-migrated'));\n    const longest=Math.max(1,...buckets.map(b=>b.length));")
    texts['lineage.js'] = replace_once(texts['lineage.js'], "?'Visão corporativa':", "?(data.provenance?.kind==='public_contract_case'?'Contratos antes e depois':'Visão corporativa'):")
    texts['investigation.js'] = replace_once(texts['investigation.js'], 'function contextReport(){', "function contextReport(){if(data.provenance?.kind==='public_contract_case')return window.EGContractCase.report();")
    texts['investigation.js'] = replace_once(texts['investigation.js'], "data.provenance?'Fonte em revisão'", "data.provenance?.kind==='public_contract_case'?'Caso público · contratos documentados':data.provenance?'Fonte em revisão'")
    texts['investigation.js'] = replace_once(texts['investigation.js'], "p.has('eg_view')?'context':'impact'", "!p.has('eg_view')&&data.provenance?.kind==='public_contract_case'?'all':p.has('eg_view')?'context':'impact'")
    texts['investigation.js'] = replace_once(texts['investigation.js'], "technical:get('technical')==='1'", "technical:get('technical')==='1'||(!p.has('eg_view')&&data.provenance?.kind==='public_contract_case')")
    html = replace_once(texts['index.html'], '<div>Grupo Aurora <span class="slash">', '<div><span id="contextName">Grupo Aurora</span> <span class="slash">')
    html = replace_once(html, '<nav aria-label="Navegação principal">', '<label class="workspace-picker" for="workspaceSource">Fonte de evidências<select id="workspaceSource"><option value="case">Caso público</option><option value="aurora">Grupo Aurora</option></select></label><nav aria-label="Navegação principal">')
    html = replace_once(html, '<div id="loadStatus"', '<section id="contractCaseNotice" class="case-notice" hidden></section><div id="loadStatus"')
    html = replace_once(html, '</head>', '<script src="contract_case.js" defer></script><link rel="stylesheet" href="contract_case.css"></head>')
    texts['index.html'] = html
    for name in ['contract_case.js', 'contract_case.css']:
        texts[name] = (HERE / name).read_text(encoding='utf-8')
    if with_consumer_demo:
        texts['app.js'] = replace_once(texts['app.js'], "value==='documentation'?", "value==='simulation'?'Simulação local':value==='documentation'?")
        texts['app.js'] = replace_once(texts['app.js'], "ev.claim==='consumer_fields'?", "ev.claim==='local_simulation_result'?'Resultado de simulação local':ev.claim==='consumer_fields'?")
        texts['lineage.js'] = replace_once(texts['lineage.js'], 'const relNames={', "const relNames={DEMO_READS:'Lê no exemplo',")
        texts['lineage.js'] = replace_once(texts['lineage.js'], 'const domainNames={', "const domainNames={demonstracao:'Consumidor simulado',")
        texts['lineage.js'] = replace_once(texts['lineage.js'], 'for(const a of shown)buckets[cols[a.kind]??2].push(a);',
            "const columnFor=a=>data.provenance?.consumer_demo?({api:1,column:2,service:4}[a.kind]??cols[a.kind]??2):(cols[a.kind]??2);\n    for(const a of shown)buckets[columnFor(a)].push(a);")
        texts['lineage.js'] = replace_once(texts['lineage.js'], '(cols[assets[id].kind]??2)!==c', 'columnFor(assets[id])!==c')
        texts['lineage.js'] = replace_once(texts['lineage.js'], "column===4&&shown.some(a=>a.kind==='column')?'CAMPOS, MODELOS & PAINÉIS':headings[column]",
            "data.provenance?.consumer_demo?({1:'CONTRATOS PÚBLICOS',2:'CAMPOS DOCUMENTADOS',4:'LEITORES SIMULADOS'}[column]||headings[column]):column===4&&shown.some(a=>a.kind==='column')?'CAMPOS, MODELOS & PAINÉIS':headings[column]")
        texts['lineage.js'] = replace_once(texts['lineage.js'], "?'Contratos antes e depois':'Visão corporativa'", "?(data.provenance.consumer_demo?'Contratos e leitores simulados':'Contratos antes e depois'):'Visão corporativa'")
        texts['index.html'] = replace_once(texts['index.html'], '</head>', '<script src="consumer_demo.js" defer></script><link rel="stylesheet" href="consumer_demo.css"></head>')
        for name in ['consumer_demo.js', 'consumer_demo.css']:
            texts[name] = (HERE / name).read_text(encoding='utf-8')
    # Keep standalone generated views portable after the shared Fenda assets.
    brand_files = {}
    if '../brand/' in texts['index.html']:
        brand_root = preview.parent / 'brand'
        if not (brand_root / 'brand.css').is_file() or not (brand_root / 'favicon.svg').is_file():
            raise ValueError('Missing shared brand assets')
        brand_files = {p.relative_to(brand_root): p.read_bytes() for p in brand_root.rglob('*') if p.is_file()}
        texts['index.html'] = texts['index.html'].replace('../brand/', 'brand/')
    prepare(texts)
    out.mkdir(parents=True, exist_ok=False)
    for name, raw in brand_files.items():
        target = out / 'brand' / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
    (out / 'sources').mkdir()
    for name, raw in inputs.items():
        (out / 'sources' / name).write_bytes(raw)
    for name, raw in demo_files.items():
        target = out / name
        target.parent.mkdir(exist_ok=True, parents=True)
        target.write_bytes(raw)
    for name, text in texts.items():
        if name != 'manifest.json':
            (out / name).write_text(text, encoding='utf-8')
    (out / 'case-bundle.json').write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    manifest = {'adapter': 'eg-contract-case/v1', 'm3_sources_sha256': source_hashes,
                'inputs': facts['sources'], 'consumer_coverage': 'UNKNOWN', 'runtime': 'NOT_VERIFIED',
                'consumer_demo': {'included': with_consumer_demo,
                                  'scope': 'LOCAL_PYTHON_SYNTHETIC_EXCERPTS' if with_consumer_demo else None,
                                  'record': 'demo/result.json' if with_consumer_demo else None},
                'case_assets': len(bundle['assets']), 'case_relations': len(bundle['relations']),
                'aurora_assets': 240, 'aurora_relations': 512,
                'outputs_sha256': {p.relative_to(out).as_posix(): sha(p.read_bytes()) for p in out.rglob('*') if p.is_file()}}
    (out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--case', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--with-consumer-demo', action='store_true', help='Execute the owned simulated Stripe consumer locally; never calls Stripe')
    args = parser.parse_args()
    try:
        result = build(args.case.resolve(), args.out.resolve(), with_consumer_demo=args.with_consumer_demo)
    except (ValueError, KeyError, TypeError, OSError, RecursionError) as error:
        parser.exit(2, 'Case not built: ' + str(error) + '\n')
    print(json.dumps({'output': str(args.out.resolve()), 'assets': result['case_assets'], 'consumer_coverage': 'UNKNOWN'}))
