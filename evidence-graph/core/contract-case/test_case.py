"""Adapter checks use minimal synthetic contracts, not Stripe customer behavior."""
import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from build_case import build, inspect_case, make_bundle


class ContractCaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        schema = {'type': 'object', 'properties': {'old_id': {'type': 'string'}}}
        self.before = {'openapi': '3.0.0', 'info': {'version': '1'},
                       'components': {'schemas': {'Response': schema}},
                       'paths': {'/items/{id}': {'get': {'responses': {'200': {'content': {
                           'application/json': {'schema': {'$ref': '#/components/schemas/Response'}}}}}}}}}
        self.after = copy.deepcopy(self.before)
        self.after['info']['version'] = '2'
        self.after['components']['schemas']['Response']['properties'] = {'new_id': {'type': 'string'}}
        self.recipe = {'schema_version': 'eg-contract-case/v1', 'material_kind': 'public_contracts',
                       'title': 'Synthetic adapter fixture', 'captured_at': '2026-10-22T12:00:00Z',
                       'endpoint': '/items/{id}', 'method': 'GET', 'response_status': '200',
                       'field': ['old_id'], 'replacement_field': ['new_id'],
                       'documentation_url': 'https://example.org/change'}
        self.path = self.root / 'case.json'

    def write(self):
        for name, value in [('before', self.before), ('after', self.after)]:
            raw = json.dumps(value).encode()
            (self.root / (name + '.json')).write_bytes(raw)
            self.recipe[name] = {'file': name + '.json', 'sha256': hashlib.sha256(raw).hexdigest(),
                                 'url': 'https://example.org/' + name}
        self.path.write_text(json.dumps(self.recipe))

    def test_removal_keeps_consumers_unknown_and_versions_structural(self):
        self.write()
        facts, _ = inspect_case(self.path)
        self.assertFalse(facts['previous']['required'])
        bundle = make_bundle(facts)
        self.assertFalse(bundle['synthetic'])
        self.assertEqual(bundle['results'][0]['consumers'], [])
        self.assertEqual(bundle['coverage'], [])
        self.assertEqual(facts['consumer_coverage'], 'UNKNOWN')
        self.assertEqual(facts['consumer_runtime_result'], 'NOT_VERIFIED')
        self.assertEqual(len(bundle['assets']), 4)
        self.assertEqual([r['kind'] for r in bundle['relations']], ['CONTAINS', 'CONTAINS'])
        self.assertEqual(bundle['relations'][0]['target'], 'field-before')
        self.assertEqual(bundle['relations'][1]['source'], 'response-after')

    def test_identical_contracts_do_not_create_a_removal(self):
        self.after = copy.deepcopy(self.before)
        self.write()
        with self.assertRaisesRegex(ValueError, 'declared before and absent after'):
            inspect_case(self.path)

    def test_hash_mismatch_rejects_modified_input_before_output(self):
        self.write()
        (self.root / 'before.json').write_text('{}')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            build(self.path, self.root / 'view')
        self.assertFalse((self.root / 'view').exists())

    def test_external_reference_is_never_resolved(self):
        self.before['components']['schemas']['Unused'] = {'$ref': 'https://example.org/remote'}
        self.write()
        with self.assertRaisesRegex(ValueError, 'External references'):
            inspect_case(self.path)

    def test_ambiguous_and_cyclic_paths_require_manual_review(self):
        for schema in [{'oneOf': [{'type': 'object'}, {'type': 'string'}]},
                       {'$ref': '#/components/schemas/Response'}]:
            with self.subTest(schema=schema):
                self.after['components']['schemas']['Response'] = schema
                self.write()
                with self.assertRaises(ValueError):
                    inspect_case(self.path)

    def test_missing_replacement_cannot_be_presented_as_verified(self):
        self.recipe['replacement_field'] = ['invented']
        self.write()
        with self.assertRaisesRegex(ValueError, 'replacement path is absent'):
            inspect_case(self.path)

    def test_duplicate_keys_and_non_json_numbers_are_rejected(self):
        self.write()
        for raw in [b'{"x":1,"x":2}', b'{"x":NaN}']:
            with self.subTest(raw=raw):
                self.path.write_bytes(raw)
                with self.assertRaises(ValueError):
                    inspect_case(self.path)

    def test_build_preserves_inputs_and_existing_output(self):
        self.write()
        original = (self.root / 'before.json').read_bytes()
        manifest = build(self.path, self.root / 'view')
        self.assertEqual(manifest['aurora_assets'], 240)
        html = (self.root / 'view/index.html').read_text()
        self.assertIn('brand/brand.css', html)
        self.assertNotIn('../brand/', html)
        self.assertTrue((self.root / 'view/brand/brand.css').is_file())
        self.assertTrue((self.root / 'view/brand/favicon.svg').is_file())
        self.assertTrue((self.root / 'view/brand/fonts/inter-latin.woff2').is_file())
        self.assertEqual(manifest['aurora_relations'], 512)
        self.assertEqual((self.root / 'view/sources/before.json').read_bytes(), original)
        self.assertEqual((self.root / 'before.json').read_bytes(), original)
        self.assertNotIn(str(self.root), (self.root / 'view/case-bundle.json').read_text())
        for name, digest in manifest['outputs_sha256'].items():
            self.assertEqual(hashlib.sha256((self.root / 'view' / name).read_bytes()).hexdigest(), digest)
        old_manifest = (self.root / 'view/manifest.json').read_bytes()
        with self.assertRaisesRegex(ValueError, 'new output directory'):
            build(self.path, self.root / 'view')
        self.assertEqual((self.root / 'view/manifest.json').read_bytes(), old_manifest)


if __name__ == '__main__':
    unittest.main()
