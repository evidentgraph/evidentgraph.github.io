"""Checks for an owned simulation; no network and no real Stripe consumer."""
import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from build_case import build, inspect_case
from consumer_demo import AFTER, BEFORE, decision, execute_cases, legacy_invoice, migrated_invoice, run, summarize

HERE = Path(__file__).resolve().parent


class ConsumerDemoTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.cases = json.loads((HERE / 'consumer_demo_cases.json').read_text())['cases']

    def recipe(self):
        # Minimal synthetic schemas with the field shapes used by this demo.
        reference = {'anyOf': [{'type': 'string'}, {'$ref': '#/components/schemas/subscription'}]}
        shared = {'subscription': {'type': 'object', 'properties': {'id': {'type': 'string'}}}}
        before = {'openapi': '3.0.0', 'info': {'version': BEFORE}, 'components': {'schemas': copy.deepcopy(shared)},
                  'paths': {'/v1/invoices/{invoice}': {'get': {'responses': {'200': {'content': {
                      'application/json': {'schema': {'$ref': '#/components/schemas/invoice'}}}}}}}}}
        before['components']['schemas']['invoice'] = {'type': 'object', 'properties': {'subscription': {**reference, 'nullable': True}}}
        after = copy.deepcopy(before)
        after['info']['version'] = AFTER
        after['components']['schemas']['invoice'] = {'type': 'object', 'properties': {
            'parent': {'type': 'object', 'nullable': True, 'required': ['type'], 'properties': {
                'type': {'type': 'string', 'enum': ['quote_details', 'subscription_details']},
                'subscription_details': {'type': 'object', 'nullable': True, 'required': ['subscription'],
                                         'properties': {'subscription': reference}}}}}}
        recipe = {'schema_version': 'eg-contract-case/v1', 'material_kind': 'public_contracts',
                  'title': 'Synthetic test recipe; not a public source claim', 'captured_at': '2026-10-22T12:00:00Z',
                  'endpoint': '/v1/invoices/{invoice}', 'method': 'GET', 'response_status': '200',
                  'field': ['subscription'], 'replacement_field': ['parent', 'subscription_details', 'subscription'],
                  'documentation_url': 'https://example.org/synthetic'}
        for key, spec in [('before', before), ('after', after)]:
            raw = json.dumps(spec).encode()
            (self.root / (key + '.json')).write_bytes(raw)
            recipe[key] = {'file': key + '.json', 'sha256': hashlib.sha256(raw).hexdigest(), 'url': 'https://example.org/' + key}
        p = self.root / 'case.json'
        p.write_text(json.dumps(recipe))
        return p

    def test_successful_execution_can_lose_a_subscription_without_exception(self):
        rows = execute_cases([self.cases[0]])
        self.assertEqual([r['matches_expectation'] for r in rows], [True, False, True])
        self.assertTrue(all(r['exception'] is None for r in rows))
        self.assertEqual(rows[1]['actual'], decision('NO_SUBSCRIPTION'))
        self.assertEqual(rows[2]['actual'], decision('LINKED', 'sub_demo_001'))

    def test_missing_is_not_explicit_null_and_old_limitation_is_exposed(self):
        self.assertEqual(migrated_invoice({}, AFTER), decision('REVIEW'))
        self.assertEqual(migrated_invoice({'parent': None}, AFTER), decision('NO_SUBSCRIPTION'))
        omitted = next(c for c in self.cases if c['id'] == 'optional-omitted')
        self.assertEqual([r['matches_expectation'] for r in execute_cases([omitted])], [False, False, True])

    def test_expanded_ids_and_invalid_references(self):
        for value, expected in [({'id': 'sub_demo_123'}, decision('LINKED', 'sub_demo_123')),
                                ({}, decision('REVIEW')), (0, decision('REVIEW')),
                                ('', decision('REVIEW')), (None, decision('REVIEW'))]:
            with self.subTest(value=value):
                payload = {'parent': {'type': 'subscription_details', 'subscription_details': {'subscription': value}}}
                self.assertEqual(migrated_invoice(payload, AFTER), expected)

    def test_unsupported_version_and_unknown_parent_abstain(self):
        payload = self.cases[0]['after']['payload']
        for version in [BEFORE, 'future', '', None]:
            self.assertEqual(migrated_invoice(payload, version), decision('REVIEW'))
        for parent in [{'type': 'future'}, {}, [], 'subscription', {'type': 'subscription_details', 'subscription_details': None}]:
            self.assertEqual(migrated_invoice({'parent': parent}, AFTER), decision('REVIEW'))
        self.assertEqual(migrated_invoice(None, AFTER), decision('REVIEW'))

    def test_input_change_changes_observed_result_without_changing_expectation(self):
        case = copy.deepcopy(self.cases[0])
        original = execute_cases([case])[-1]
        case['after']['payload']['parent']['subscription_details']['subscription'] = 'sub_demo_other'
        changed = execute_cases([case])[-1]
        self.assertEqual(original['expected'], changed['expected'])
        self.assertNotEqual(original['actual'], changed['actual'])
        self.assertFalse(changed['matches_expectation'])

    def test_summary_distinguishes_examples_mismatches_and_exceptions(self):
        rows = execute_cases(self.cases)
        groups = summarize(rows)
        self.assertEqual(len(rows), 23)
        self.assertEqual([(s['total'], s['matched'], s['mismatched'], s['exceptions']) for s in groups],
                         [(5, 4, 1, 0), (9, 2, 7, 0), (9, 9, 0, 0)])
        bad = copy.deepcopy(self.cases[0]); bad['before']['payload'] = []
        result = execute_cases([bad])[0]
        self.assertIsNotNone(result['exception'])
        self.assertFalse(result['matches_expectation'])

    def test_other_contract_pair_is_rejected_before_output(self):
        path = self.recipe()
        entry = json.loads(path.read_text())
        p = self.root / 'after.json'; spec = json.loads(p.read_text()); spec['info']['version'] = 'other'
        p.write_text(json.dumps(spec)); entry['after']['sha256'] = hashlib.sha256(p.read_bytes()).hexdigest()
        path.write_text(json.dumps(entry))
        with self.assertRaisesRegex(ValueError, 'limited to'):
            build(path, self.root / 'view', with_consumer_demo=True)
        self.assertFalse((self.root / 'view').exists())

    def test_changed_source_and_changed_field_shape_are_rejected(self):
        path = self.recipe(); p = self.root / 'after.json'
        spec = json.loads(p.read_text()); spec['components']['schemas']['invoice']['properties']['parent']['nullable'] = False
        p.write_text(json.dumps(spec))
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            build(path, self.root / 'view', with_consumer_demo=True)
        entry = json.loads(path.read_text()); entry['after']['sha256'] = hashlib.sha256(p.read_bytes()).hexdigest();path.write_text(json.dumps(entry))
        with self.assertRaisesRegex(ValueError, 'field shapes'):
            build(path, self.root / 'view', with_consumer_demo=True)
        self.assertFalse((self.root / 'view').exists())

    def test_build_preserves_unknown_real_consumers_and_local_provenance(self):
        path = self.recipe()
        manifest = build(path, self.root / 'view', with_consumer_demo=True)
        bundle = json.loads((self.root / 'view/case-bundle.json').read_text())
        self.assertTrue(bundle['synthetic'])
        self.assertEqual((manifest['case_assets'], manifest['case_relations']), (6, 4))
        self.assertEqual(bundle['results'][0]['consumers'], [])
        self.assertEqual(bundle['coverage'], [])
        self.assertEqual(manifest['consumer_coverage'], 'UNKNOWN')
        self.assertEqual(manifest['runtime'], 'NOT_VERIFIED')
        self.assertEqual(bundle['provenance']['consumer_demo']['real_consumer_runtime'], 'NOT_VERIFIED')
        self.assertEqual([r['kind'] for r in bundle['relations']], ['CONTAINS', 'CONTAINS', 'DEMO_READS', 'DEMO_READS'])
        self.assertTrue(all(e['synthetic'] for e in bundle['evidence'] if e['claim'] == 'local_simulation_result'))
        for name, digest in manifest['outputs_sha256'].items():
            self.assertEqual(hashlib.sha256((self.root / 'view' / name).read_bytes()).hexdigest(), digest)
        self.assertNotIn(str(self.root), (self.root / 'view/case-bundle.json').read_text())
        with self.assertRaisesRegex(ValueError, 'new output directory'):
            build(path, self.root / 'view', with_consumer_demo=True)

    def test_recorded_evidence_matches_the_executed_code_and_fixture_bytes(self):
        path = self.recipe(); facts, inputs = inspect_case(path)
        report, files = run(facts, inputs)
        saved = json.loads(files['demo/result.json'])
        self.assertEqual(saved, report)
        for source in report['files']:
            self.assertEqual(hashlib.sha256(files[source['file']]).hexdigest(), source['sha256'])
        self.assertFalse(report['external_api_called'])
        self.assertFalse(report['contract_scope']['complete_response_validation'])
        self.assertEqual(report['real_consumer_coverage'], 'UNKNOWN')


if __name__ == '__main__':
    unittest.main()
