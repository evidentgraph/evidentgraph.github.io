# EvidentGraph — Grupo Aurora

**Atualização em 23/10/2026, commit de1cab2:** os sete ajustes consolidados estão
implementados, publicados e conferidos por HTTPS.
Incluem análise legível no celular, foco de teclado, aviso de dados fictícios
nos detalhes e preservação do exemplo Stripe nos links. Os 23 cenários locais
passaram; 19 aplicáveis passaram novamente no site e 34 recursos públicos
conferiram por hash. Ver [escopo e resultados](../core/docs/36_M3_CONSOLIDATED_UX_FIXES.md).
Reteste com pessoas continua pendente.

**Publicação em 22/10/2026, commit 64fa503:** orientação do mapa, entrada em lista
no estreito, links de detalhe/evidência e histórico corrigido estão publicados.
O menu inclui um atalho para o [caso Stripe com consumidor simulado](https://asccjr.github.io/evidence-graph/caso-stripe/?source=case&eg_view=analysis&eg_change=CASE-001&eg_scope=all&eg_technical=1),
em página separada do catálogo fictício. Ver [publicação e verificação HTTPS](../core/docs/35_PUBLIC_UI_AND_STRIPE_CASE.md)
e [rodada 3](../core/docs/33_M3_REVIEW_AND_PUBLIC_CASE.md). Este README e os registros
complementares continuam localmente modificados; o commit publica a interface
e os arquivos estáticos do caso, preservando a distinção entre fontes e simulação.

Versão de avaliação com grafo, lista, investigação por ativo e análise de mudanças. O Grupo Aurora e seus dados são fictícios. Site de avaliação: `/evidence-graph/preview-m2/`; a versão anterior em `/evidence-graph/` permanece preservada.

## Abrir

Depois de gerados/versionados os dados, abrir `index.html` ou o endereço do GitHub Pages. Não há backend ou credenciais. Para regenerar:

```sh
python3 evidence-graph/core/demo-ui/build_preview.py
```

## Funcionalidades

Selecionar um ativo; investigar dependências, consumidores ou processos; variar alcance; alternar grafo/lista sem trocar o contexto; revisar um consumidor nos cenários existentes; registrar verificações e exportar Markdown.

`exploration.js` contém as regras de alcance tipado; `investigation.js` mantém contexto/seleção compartilhados e exporta o recorte. `lineage.js` desenha o mapa. `app.js` mantém análises pré-calculadas pelo Python M1, inventário e notas locais.

## Ajuste local de usabilidade — 20/10/2026

A análise indica quando o exemplo já está aberto e confirma cliques repetidos sem
limpar os filtros. A lista explica a relação do consumidor com a mudança; detalhes
e painel do grafo mostram o campo exigido quando o contrato registrado o sustenta.
Filtros adicionais e versões/período podem ser abertos sob demanda.

**Lista de conexões** alterna a representação do mapa. **Lista da análise** volta
aos consumidores da mudança; **Ver caminhos no grafo** mostra seus caminhos e
preserva os filtros da análise. As extensões também se inicializam quando terminam
de carregar depois do evento de prontidão do core.

Os cinco arquivos da interface foram publicados com autorização em
[`f29ac5d`](https://github.com/ASCCJR/asccjr.github.io/commit/f29ac5d536cac612d1f1f8605e00d356f266c230),
com conferência de dez recursos e oito cenários de navegador sobre HTTPS público.
Este README, o registro da rodada e o teste DOM ainda têm alterações locais.
Resultados, dados sintéticos e limites da análise não mudaram. Evidências em
[31_M3_USABILITY_ADJUSTMENTS.md](../core/docs/31_M3_USABILITY_ADJUSTMENTS.md).

## Testes

```sh
cd evidence-graph/core/demo-data && python3 -m unittest -q test_model
cd ../demo-ui && node --test test_exploration.cjs
python3 -m unittest -q test_navigation
```

O último comando requer Playwright e Chromium. Consulte `../core/docs/18_ASSET_INVESTIGATION.md` para o escopo histórico desse teste. A rodada atual acrescentou verificações por DOM e oito cenários em Chromium por HTTP local, com capturas inspecionadas; não valida implantação. Ambiente, evidências e limites estão no documento 31.

Os novos testes de interação por DOM usam Node 18+ e `jsdom@26.1.0`. A dependência
de verificação pode ficar fora do clone, sem alterar o site:

```sh
npm install --prefix /tmp/evidentgraph-dom-check --ignore-scripts --no-audit --no-fund --save-exact jsdom@26.1.0
EG_DOM_MODULE=/tmp/evidentgraph-dom-check/node_modules/jsdom node --test evidence-graph/core/demo-ui/test_feedback.cjs
```

Executar esses comandos na raiz do repositório. Os testes carregam os fontes locais
em DOM e verificam inicialização tardia, navegação, estado da análise e explicação
do contrato. Não renderizam layout nem substituem testes em navegador.

## Segunda rodada — 22/10/2026, publicada e conferida

A entrada mostra os caminhos da mudança (seis ativos/cinco relações em CHG-001),
com escala de leitura, controles acima do desenho e nomes de campos qualificados.
Contexto do ativo e empresa inteira continuam disponíveis. A lista mantém a
representação do mesmo recorte e explica o caminho indireto registrado.

O endereço usa parâmetros `eg_` para seção, mudança, seleção, filtros e alcance.
Copiar link, abrir em outra aba, recarregar e Voltar/Avançar preservam a vista.
Notas e verificações continuam locais e não entram no endereço. Zoom/arrasto e
diálogos temporários não são compartilhados. Valores desconhecidos no endereço
voltam a opções válidas do catálogo. O botão de copiar link requer um endereço
HTTP/HTTPS; o restante da prévia continua sem backend.

Passaram 19 cenários DOM, 13 testes de exploração, 20 de compatibilidade do gerador
e 16 cenários em navegador local. As famílias têm escopos distintos; não somar
às contagens históricas da L7. A publicação foi autorizada e concluída em
[`a147eaf`](https://github.com/ASCCJR/asccjr.github.io/commit/a147eaf8a0f89758fce84760c1a6495214bd9f77):
dez recursos públicos conferidos por hash e os mesmos 16 cenários aprovados em
HTTPS. Essas repetições não aumentam os totais. Reteste com pessoas e nova revisão
pela IA pendentes; textos foram preparados, sem envio. Este README e os registros
de verificação permanecem no checkout local. Registro:
[32_M3_REVIEW_ROUND_2.md](../core/docs/32_M3_REVIEW_ROUND_2.md).
