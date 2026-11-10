# START HERE — EvidentGraph Core

## Leitura atual — 10/11/2026

**Primeiro acesso de equipe, orientação ou IA:** ler [CONTEXTO_PARA_IA.md](../../../CONTEXTO_PARA_IA.md). Ele é a síntese pública atual, disponível no clone padrão. Não requer Drive nem chat anterior.

**Desenvolvimento integral:** usar `codex/continuidade-20261109` e a [RETOMADA.md dessa branch](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/RETOMADA.md). A main contém o site; não contém todos os arquivos do laboratório. O guia descreve o que está em cada uma.

Estado consolidado: Stripe e Aurora publicados com identidade Fenda; L7 integrada no desenvolvimento integral, sem reaplicar patches. O fluxo chat → GitHub → Pages → Edge foi conferido com o PR #4 em 10/11. A organização atual retira a demo Acme, preserva sua URL por redirecionamento e melhora a entrada documental. O PR #3 permanece separado; conferir seu estado antes de qualquer decisão futura.

Ordem para resolver divergências: instrução atual do responsável e estado verificável do Git/código; guia e retomada atualizados; decisões e checkpoints datados; propostas históricas. Um status antigo de “somente local” não revoga uma publicação posterior. Esta orientação de leitura não transforma hipótese em capacidade implementada.

## Documentação histórica preservada

As seções abaixo registram seus respectivos momentos. Afirmações antigas de trabalho pendente, somente local ou de demo preservada não substituem o estado atual acima.

This directory is the persistent memory of the canonical project.

## Source-of-truth hierarchy

1. `01_CANONICAL_CONTEXT.md` — current truth of the research project.
2. `08_DECISION_LOG.md` — append-only decisions and changes in direction.
3. `09_RESEARCH_LOG.md` — research findings, hypotheses, and external evidence.
4. [12_PRODUCT_UX_VISION.md](./12_PRODUCT_UX_VISION.md) — product/UX specification; graph-first opening was restored by the review below.
5. [18_ASSET_INVESTIGATION.md](./18_ASSET_INVESTIGATION.md) — current implementation checkpoint: shared graph/list workspace and asset investigation. Earlier checkpoints: `15_M1_VALIDATION.md`, `16_M2_PREVIEW.md`, `17_M2_GRAPH_REVIEW.md`.
6. Other files — detailed views of product, research, architecture, market, and roadmap.

## Rules

- Separate **fact**, **hypothesis**, **decision**, and **idea**.
- Do not turn repeated hypotheses into facts.
- Do not claim novelty merely because a feature is new to this project.
- Keep the Core independent from edital/course-specific constraints.
- GitHub is the project memory. Chat conversations are working sessions.
- If an opportunity requires an adaptation, create or update its own folder under `opportunities/`.

## Current project name

**EvidentGraph**

Why this name:
- “Evident” emphasizes evidence, explainability, and provenance.
- “Graph” reflects the dependency/path model.
- It is broad enough for data, software, APIs, agents, identity, and runtime.
- It does not lock the project to a single vendor or to agentic AI only.

This is a **working project name**, not a trademark/domain clearance.

## Current work — 2026-10-14, M3 evaluation

M1 has 240 synthetic assets, 512 relations, a bounded reference impact analyzer and 43 model tests. M2 introduced review, inventory and evidence; the proponent then requested restoring the graph. The accepted direction is **graph plus operational analysis**, with a fictional Grupo Aurora and no repeated demo labels.

M3 adds three questions per asset, depth-limited typed traversal, explicit process associations, shared graph/list filters and selection, return from review to the selected asset, and context export. Source: `preview-m2/`. The original public files at `evidence-graph/index.html`, `app.js`, `styles.css` are not replaced.

The user authorized a separate evaluation address at `/evidence-graph/preview-m2/`. Verify the actual merge and deployment in PR #1; do not confuse local tests or this note with a successful deployment. Generated `data.js` and `manifest.json` must be present before merge; the restricted PR build workflow supplies them.

Read [18_ASSET_INVESTIGATION.md](./18_ASSET_INVESTIGATION.md) for the test record and limitations. Twenty UI tests ran using direct DOM loading because browser HTTP navigation was blocked. This does not validate hosted localStorage persistence. The 13 pure traversal tests do not turn catalog exploration into impact or authorization analysis.

Next: verify the hosted experience with users, then a small real-collector PoC. Do not restart the design, remove the graph, add decorative nodes or change Campus Mobile, academic submissions, contributors or personal material.
