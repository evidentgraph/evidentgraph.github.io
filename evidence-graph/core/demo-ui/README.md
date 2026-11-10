# Build e testes de interface M2

`build_preview.py` usa o modelo M1 sem modificá-lo, calcula os três resultados e gera `../../preview-m2/data.js` e `manifest.json` de forma determinística. Essas saídas são regeneráveis e estão versionadas no Git para o GitHub Pages. Conferir o diff antes de publicar dados regenerados; a automação temporária restrita ao antigo PR #1 foi retirada.

O teste histórico M2 `test_ui.py` define 18 testes de DOM em Chromium via Playwright. Como a navegação local foi bloqueada no ambiente daquela etapa, os arquivos locais são inseridos diretamente na página de teste. Nenhuma rede externa é usada. O fallback sem armazenamento persistente é exercitado; não se trata de teste de publicação.

```sh
python build_preview.py
python -m unittest -v test_ui
```

Informe `CHROMIUM_PATH` quando Chromium não estiver em `/usr/bin/chromium`. Playwright é uma dependência apenas de teste. Os resultados da verificação estão em `../docs/16_M2_PREVIEW.md`.

## Contexto e versões

Ler [CONTEXTO_PARA_IA.md](../../../CONTEXTO_PARA_IA.md) para o estado atual. A [branch de continuidade](https://github.com/ASCCJR/asccjr.github.io/tree/codex/continuidade-20261109/evidence-graph/core/demo-ui) contém testes posteriores de navegação e do consumidor simulado. A existência de um arquivo de teste não comprova uma execução atual.
