#!/usr/bin/env python3
"""Read-only continuity checks; Python standard library and Git only."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--require-private', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    state = json.loads((root / 'evidence-graph/CONTINUIDADE.json').read_text(encoding='utf-8'))
    failures = []
    for name in state['essential_files']:
        if not (root / name).is_file():
            failures.append('Arquivo ausente: ' + name)
    for name, expected in state['public_assets_sha256'].items():
        p = root / name
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != expected:
            failures.append('Arquivo publicado ausente ou modificado: ' + name)
    branch = subprocess.run(['git', 'branch', '--show-current'], cwd=root, text=True, capture_output=True, check=True).stdout.strip()
    head = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=root, text=True, capture_output=True, check=True).stdout.strip()
    config = subprocess.run(['git', 'config', '--local', '--get', state['private_context_config']], cwd=root, text=True, capture_output=True)
    private_root = Path(config.stdout.strip()).expanduser() if config.returncode == 0 and config.stdout.strip() else None
    private_index = private_root / 'INDICE_PORTATIL.json' if private_root else None
    private_ok = bool(private_index and private_index.is_file())
    if private_ok:
        private = json.loads(private_index.read_text(encoding='utf-8'))
        for item in private['essential_sources']:
            p = private_root / item['path']
            if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != item['sha256']:
                failures.append('Fonte privada ausente ou alterada: ' + item['path'])
                private_ok = False
    if args.require_private and not private_ok:
        failures.append('Contexto privado integral não restaurado/configurado.')
    result = {
        'status': 'FAIL' if failures else 'PASS', 'branch': branch, 'head': head,
        'expected_resume_branch': state['resume_branch'],
        'public_assets_checked': len(state['public_assets_sha256']),
        'private_context_verified': private_ok,
        'scope': 'Integridade e disponibilidade; não executa suites funcionais nem confirma status externos.',
        'failures': failures,
    }
    if branch != state['resume_branch']:
        result['branch_note'] = 'Branch diferente da referência de retomada; conferir intenção antes de editar.'
    if not private_ok:
        result['private_note'] = 'O clone público pode continuar trabalho técnico; contexto privado exige o pacote separado.'
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
