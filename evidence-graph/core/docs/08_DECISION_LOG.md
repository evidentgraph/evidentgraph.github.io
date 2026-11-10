# Decision Log — EvidentGraph Core

Append-only log. Do not silently delete old decisions; supersede them explicitly.

---

## D-001 — Keep a canonical Core independent from opportunity-specific requirements
**Date:** 2026-09-22  
**Status:** DECIDED

The Core remains independent from competitions, grants, and calls.

External requirements belong under `opportunities/`.

---

## D-002 — Use GitHub as the source of truth
**Date:** 2026-09-22  
**Status:** DECIDED

GitHub stores canonical documentation, decisions, research, demos, and opportunity variants.

ChatGPT is a working environment, not the authoritative project memory.

---

## D-003 — Use an agent-first demo while preserving a broader Core
**Date:** 2026-09-22  
**Status:** DECIDED

Agentic AI is the strongest current demonstration domain, but the project remains broader than agent governance.

---

## D-004 — Synthetic execution is allowed in the demo
**Date:** 2026-09-22  
**Status:** DECIDED

Synthetic traces may be used for communication as long as they are clearly labeled synthetic.

---

## D-005 — Treat Databricks as both benchmark and evidence source
**Date:** 2026-09-25  
**Status:** DECIDED

Do not position the project as a replacement for Unity Catalog / Unity Gateway.

Databricks can become a connector/evidence source for cross-platform correlation.

---

## D-006 — Adopt “EvidentGraph” as the working project name
**Date:** 2026-09-27  
**Status:** DECIDED — working name

Project name: **EvidentGraph**

Subtitle: **Dependency Intelligence for Data, Software & AI**

This is a working name, not a trademark/domain clearance.

Reason:
- emphasizes evidence and explainability;
- preserves the graph concept;
- is not vendor-specific;
- does not constrain the project to AI agents only.

---

## D-007 — Separate Core and Claro Campus Mobile into distinct workspaces
**Date:** 2026-09-27  
**Status:** DECIDED

Canonical project:
`core/`

Claro/Campus Mobile variant:
`opportunities/claro-campus-mobile-2026/`

The mobile requirement must not permanently change the Core.

---

## D-008 — Use EvidentGraph Core in the Disciplina de Projetos
**Date:** 2026-09-27  
**Status:** DECIDED

The Core project will be reused for class activities instead of inventing a second unrelated project.

Course answers live under:
`core/academic/project-discipline/`

Durable insights can later be promoted into canonical files after feedback/validation.

---

## D-009 — Preserve the synthetic HTML demo
**Date:** 2026-09-27  
**Status:** DECIDED

The original professor presentation was canceled, but the HTML demo remains valuable.

Keep it published as a reusable:
- portfolio artifact;
- future demo;
- UX prototype;
- explanatory tool.

Do not treat it as the canonical technical implementation.

---

## D-010 — Make the next Core experience task-first and decision-oriented
**Date:** 2026-10-13  
**Status:** DECIDED for product direction; implementation pending

The proponent reported professor feedback that the public demo is too small and presentation-oriented, emphasizing the technical mechanism rather than a business task. This is qualitative reported feedback, not customer validation.

The next experience prioritizes **change-impact review**: select a change, understand consequences and uncertainty, identify owners, record checks and export an analysis. The graph is contextual exploration; detailed evidence remains inspectable.

This supersedes D-003 only as the opening/navigation strategy for the next demo. Agentic AI remains an important use case, and the Core still covers data, software, models and agents. D-009 remains valid: preserve the current demo until the replacement is reviewed.

Specification: `12_PRODUCT_UX_VISION.md`. Dataset sizes, screen details and test thresholds are proposed design parameters, not validated results.

---

## D-011 — Separate enterprise-scale simulation, real PoC and business discovery
**Date:** 2026-10-13  
**Status:** DECIDED for sequencing; tests and implementation pending

Use a larger coherent synthetic enterprise environment to test product UX, while keeping real collectors and evidence-fusion evaluation in a controlled small PoC. A larger synthetic graph does not demonstrate production scalability.

Run discovery and usability in parallel with development. This supersedes the previous roadmap placement of customer discovery only after the technical experiment.

Do not hide uncertainty, equate missing traces with absent dependencies, count structural relations as runtime calls, or claim that a dependency alone proves breakage.

This documentation revision does not change public demo code, Campus Mobile, academic submissions, contributor names or personal material.

---

## D-012 — Abandon Sites migration and resume the Core on GitHub Pages
**Date:** 2026-10-15  
**Status:** DECIDED by the proponent

The user decided to discard the Sites experiment and keep GitHub Pages for the current interface. PR #2 was closed without merge; its branch is historical, not a prerequisite. Deleting the Sites project is the user's own action and was not performed here.

Retain the accepted M3 graph-plus-list experience and Grupo Aurora identity. Continue with usability evaluation and a restricted runtime-evidence laboratory, not another visual rewrite or hosting migration. This confirms the graph-restoration correction recorded in `17_M2_GRAPH_REVIEW.md`; task-first does not mean graph removal.

The L1 laboratory collects real loopback HTTP/SQLite execution via manual OpenTelemetry instrumentation while using fictitious business data. It is separate from the M1 synthetic schema and published UI. It does not demonstrate IAM, enterprise collectors, real customers or statistically validated superiority.

See `21_RETOMADA_CORE_E_LABORATORIO.md` and `22_ROTEIRO_AVALIACAO_M3.md`. Preserve prior publications, Campus Mobile, academic files, team names and personal-material exclusions.

---

## D-013 — Transfer all project continuity to this environment
**Date:** 2026-10-20
**Status:** DECIDED by the proponent; integral package received and reconciled

Implementation, maintenance, research, architecture, product, UX, business, documentation, presentations, academic activities and opportunities continue here. This supersedes instructions to reserve strategy for another chat or return outputs to the previous assistant. No approval in the source chat is needed. Consolidated documents and source copies sustain continuity; this is not a verbatim export of every message.

D-002 remains valid for public technical/project memory. Private memory, original call PDF, contacts and confidential drafts are preserved outside public Git; the repository-local `evidentgraph.privateContext` pointer locates the private receipt/index without committing its value. Public team names already recorded remain; removed personal/professional material must not be recovered or reintroduced.

The source package is additive historical/context material. It does not replace the directly verified L7 state or authorize reapplying patches, rebuilding the environment or restarting Checkpoints 1–3. Earlier statements that L7 was only local/unsent are superseded, with their records retained. The scoped instructions are in `evidence-graph/AGENTS.md`.

Normal documentation commits/pushes on the existing authorized feature branch are allowed after diff/trigger review. Merge, deploy, push to main, publication/release, destructive actions, privileged installations, spending, third-party contact, submissions and declarations require the user's specific approval here. Source-chat deletion is the user's action and is not automated.

---

## D-014 — Resume CTE-IA proposal after the completed L7 cycle
**Date:** 2026-10-20
**Status:** DECIDED for continuity; proposal and implementation choices remain open

The technical cycle requested before the application is closed by the validated L7. Preparing the CTE-IA proposal does not require merging, deploying, opening L8, expanding the parser or redesigning the interface. Keep it in `opportunities/cte-ia-2026/`, distinct from Campus Mobile and academic deliveries.

Discuss the business problem, initial audience, differentiation, team, measurable targets, Annex I gaps and an honest role for AI. Deterministic rules, the bounded AST analyzer, mapping an agent and using Codex during development do not establish AI as a central product component. NLP/generative extraction and reconciliation of references in documents is a hypothesis, not an approved architecture or delivered feature. Compare against conventional rules/IDs/parsers before claiming an advantage.

The supplied call v1 is a dated source. Confirm official amendments, dates, eligibility and live form limits before relying on them for submission. Team roles, availability, rights/permissions and application commitments remain unconfirmed; do not invent them. Independent user/research validation remains pending. This decision does not authorize an application or new product implementation.

---

## D-015 — Apply a bounded local usability pass to the M3 evaluation UI
**Date:** 2026-10-20
**Status:** AUTHORIZED by the proponent; local implementation for review

After two internal guided feedback reports, the owner authorized proceeding
without waiting for another participant in this round. Preserve the reports and
participant details privately. Their findings concern orientation, explanation of
the change and navigation; they do not establish commercial value or an AI benefit.

Keep the existing graph, connection list, operational change review and Grupo
Aurora dataset. Clarify the distinction between the connection list and analysis
list, make the loaded-analysis state visible, explain contract requirements next
to the consumer and defer secondary controls. A late-loaded extension must still
initialize its controls after the core is ready.

This authorizes reversible local implementation and checks. It does not authorize
merge, deploy, publication, new AI integration or changes to historical L7
captures/results. See `31_M3_USABILITY_ADJUSTMENTS.md`.

---

## D-016 — Publish the bounded M3 evaluation corrections
**Date:** 2026-10-20
**Status:** AUTHORIZED and published; participant retest pending

The owner explicitly approved publishing the corrected evaluation screen for a
new internal test. Commit `f29ac5d536cac612d1f1f8605e00d356f266c230`, based on
published `main`, changes exactly five files in `preview-m2/`: `index.html`,
`app.js`, `lineage.js`, `investigation.js` and `investigation.css`. Pages completed
the build; public bytes and eight focused browser scenarios were verified.

This publication leaves the broader PR #3 unmerged. Historical L7 results retain
their original scope. Further releases, merges, integrations and third-party
contact still require the owner's specific authorization. Participant feedback
on the corrected version remains pending. See document 31.

---

## D-017 — Prepare a second local usability round from review evidence
**Date:** 2026-10-22
**Status:** AUTHORIZED and implemented locally; publication and participant retest pending

The owner authorized corrections after the internal guided reports and an AI
interface inspection. Preserve their original evidence privately and distinguish
technical observations from unmeasured human comprehension.

Keep the graph/list identity and Grupo Aurora catalog. Open with the selected
change's bounded paths; improve readable scale, controls, contrast and naming.
Represent view context in URL/history while excluding local notes. Validate links,
back/forward, pending changes, shared filters, field distinction and existing
review behavior. See `32_M3_REVIEW_ROUND_2.md`.

This round does not authorize publication, merge, contact with participants,
spending or new AI integration. Historical L7 results and the earlier published
release remain preserved. Passing implementation checks does not complete the
planned participant retest.


---

## D-018 — Publish the second UI review round on the existing site
**Date:** 2026-10-22
**Status:** AUTHORIZED, published and checked; participant retest and AI review pending

The owner explicitly requested updating the public site for the next review.
Publish the five tested UI files only, based on current `main` (`f29ac5d`), without
merging PR #3 or changing the feature checkout/index. Commit
[`a147eaf`](https://github.com/ASCCJR/asccjr.github.io/commit/a147eaf8a0f89758fce84760c1a6495214bd9f77)
was pushed as a fast-forward; Pages completed that build. Ten public resources
matched the local tested files, and the same sixteen browser scenarios passed
in HTTPS without page/resource errors. Do not count the repeated executions as
additional cases or as participant validation. See `32_M3_REVIEW_ROUND_2.md`.

Keep private reports, identities, contacts and drafts outside public Git.
Retest messages were prepared for the owner; none was sent to participants or an
external AI service. The branch, L7 historical results, UNKNOWN and 240/512 remain
preserved. Documentation/test updates remain local to the feature checkout.

---

## D-019 — Continue local UX work and a bounded public contract case
**Date:** 2026-10-22
**Status:** AUTHORIZED by the proponent; local implementation, participant retest pending

The owner authorized proceeding after an automated re-review, with participant
feedback deferred. Address the remaining map-orientation, detail-sharing and
history-confirmation issues in the existing M3 experience. Preserve the original
reports privately and do not equate automated checks with human comprehension.

Advance the prepared public API case through a bounded local adapter: verify a
selected response-field removal from two hash-pinned contracts and render its
sources in the existing graph/list/review/export. Keep the original Aurora
catalog separately available. No consumer, owner, runtime usage or operational
failure may be inferred solely from a contract change. Replacement-path guidance
is supplied by the documented case, not discovered as semantic equivalence.

The current increment is implemented locally in `core/contract-case/`; it does
not replace the M1 schema or expand the L6-B source parser. No new AI integration,
customer pilot, merge, publication or third-party contact follows automatically.
See document 33 for behavior, verification and remaining validation limits.

---

## D-020 — Demonstrate a small simulated consumer of the public API case
**Date:** 2026-10-22
**Status:** AUTHORIZED and implemented locally; unpublished

After the proposed next increment, the owner authorized proceeding. Implement a
small owned invoice reader and a limited migration, using explicitly synthetic
field excerpts tied to the preserved public contract versions. Compare each
execution with authored task expectations, including insufficient-input cases.
Do not equate absence of exceptions with a correct business result.

Keep the documentary-only mode, Aurora dataset and all earlier captures. In the
optional combined viewer, identify every simulated reader/evidence and the
illustrative read relationships. The graph is not proof of discovered production
dependencies. Real consumers, coverage and runtime remain unknown/unverified;
no Stripe account, API request or customer data is required.

The local record contains executable code, fixtures, source hashes and observed
outputs; it does not establish independent evaluation, market demand, AI benefit
or safe migration. Preserve failures of the old example, including its limitation
before the change. See document 34 for exact scope and results. Publication,
merge, spending and third-party contact do not follow from this increment.

---

## D-021 — Publish the reviewed UI and the separate simulated Stripe case
**Date:** 2026-10-22
**Status:** AUTHORIZED, published and verified over HTTPS

The owner explicitly authorized updating the public site after the completed
local demonstration. Publish the reviewed Aurora UI at its existing URL and
link it to a separate Stripe case. Preserve visible labels for real public
contracts versus the owned simulated consumer; real coverage/runtime remain
UNKNOWN/NOT_VERIFIED. No private evaluation report or participant information
is part of the release.

Commit `64fa50388e9255d8c0d8bd9f78402c8553b88f71` advances `main` normally from
`a147eaf`, changing five preview UI files and adding 24 static case files. Pages
built this commit; 34 public resources matched the prepared bytes. Eleven scoped
browser scenarios passed in HTTPS, plus verification of the link between pages.
The repeated local/public executions do not increase distinct-case totals.

Keep the feature checkout/index, PR #3 draft and L7 unchanged. This publication
does not authorize merging that PR, contacting participants, submitting an
application or claiming independent/business validation. Source/test and
complementary documentation changes remain local. See document 35.

---

## D-022 — Complete the consolidated UI corrections on the existing public site
**Date:** 2026-10-23
**Status:** AUTHORIZED, implemented, published and verified over HTTPS

The owner authorized executing the seven consolidated findings from the recent
automated reviews. Continue the previously authorized public-site update with
these bounded fixes: preserve the selected simulated example when sharing or
restoring navigation; expose owner/actions on narrow screens; provide comparison
and return destinations; improve keyboard focus and accessible names; identify
fictional Aurora data inside shared details. Preserve the graph/list relationship
and the distinction between contracts, simulated execution and unknown real usage.

Twenty-three scoped local browser scenarios passed. One initial scrolling
assertion was corrected after measuring the short documentary page's physical
scroll limit; the original failure remains in the private evidence. It was not
a product defect. These checks do not establish participant understanding or
business validation. Document 36 records the behavior and verification scope.

Commit `de1cab2f7fd6178653ab56a4bc357610b25fed01` advances `main` from `64fa503`
with only the reviewed static preview/case files. Pages built that commit;
34 public resources matched the prepared bytes and the 19 applicable browser
scenarios passed again over HTTPS without page/resource errors. These repetitions
do not increase the 23 distinct local scenarios. Keep the feature checkout/index,
PR #3 draft and L7 unchanged. Publication does not authorize third-party contact,
application submission or unrelated changes. Private reports and continuity
records stay outside Git; adapter/test/complementary-document changes remain local.


---

## D-023 — Preserve the approved Fenda public identity
**Date:** 2026-10-24
**Status:** AUTHORIZED, published and verified in its recorded scope

The owner selected Fenda and explicitly authorized publication. Commit
`83b393692f23ff4dea9dd8c0e369a5661eccf39a` changed 14 public files for the mark,
favicon, shared styles, local fonts/licenses and two existing views. Application
JavaScript and data remained unchanged. Eight local scenarios repeated over
public HTTPS passed; 47 resources matched prepared hashes. Original design
references, generation records and evaluation evidence remain private.

## D-024 — Consolidate portable continuity for a new computer
**Date:** 2026-11-09
**Status:** AUTHORIZED by the owner's request to organize repository continuity

Create `codex/continuidade-20261109` from the existing feature history. Preserve
the former checkout, add the reviewed local adapter/tests/docs, and copy the
already-published static views/brand from `83b3936`. This is a separate continuity
branch, not a merge of PR #3, a change to main or a new Pages release. Add a short
entry document, machine-readable state and a Python-only verification command.
Keep full private context and evidence in a separate portable archive with
hashes and restoration instructions. A public clone alone must not claim that
private context is present. Historical results retain their original scope.

## D-025 — Use the connected private Drive for cross-computer context
**Date:** 2026-11-09
**Status:** AUTHORIZED by the owner's request to keep the private files in Drive

Keep code in the existing GitHub continuity branch and the dated private context
in the owner's Google Drive folder `EvidentGraph`. Its `00_COMECE_AQUI.txt` points
to readable source documents and the complete verified migration archive. This
replaces manual ZIP transport as the preferred retrieval path. Preserve private
access, the original local copies and the existing Pages publication. Do not
assume that later edits outside the synchronized folder are automatically saved
to Drive, or that the archive's Git bundle contains subsequent commits.

## D-026 — Verify the chat-to-GitHub-to-site workflow with a small visual change
**Date:** 2026-11-10
**Status:** AUTHORIZED, published and verified over HTTPS

The owner chose a small visual adjustment and authorized sending and testing it
on the public site. PR #4 added a 3 px lavender inset marker and weight 600 to the
active navigation item, with matching cache references and manifest hashes.
Its five-file change was based on the existing published main; PR #3 and L7 were
not merged as part of this release. Pages successfully deployed merge commit
`756002f14f6d3c704f371247a965cfc431781830` in run `42754832278`.

The local and public views were checked in Edge: Stripe and Aurora load, the
active item follows section navigation, and Tab/Enter navigation works. No console
errors or warnings were captured. All five changed public resources matched
the prepared SHA-256 hashes. These are scoped basic checks, not a repeat of the
historical L7 suites or independent product validation. Synchronize the same
visual change and published asset references into the continuity branch.

Repository cleanup for the team and professor is a later task. No files were
deleted and no Git history was rewritten for this workflow test. Private
documents remain outside the public repository.

## D-027 — Publish a shared public context guide and retire approved obsolete files
**Date:** 2026-11-10
**Status:** AUTHORIZED, implemented and published through PR #5

The owner approved the eight-file cleanup proposal and requested a Markdown entry
that enables the team or professor to clone the repository and ask an AI to explain
the project accurately. Add root `CONTEXTO_PARA_IA.md`, route README/AGENTS readers
to it, and explain the public artifact, complete development branch, implemented
architecture, research limits, recorded tests, academic context and pending
validation. A public explanation does not require private Drive sources. The guide
does not expose the private archive or turn proposed AI capabilities into features.

Remove only the approved root resume stylesheet, old PR #1 data workflow, Acme
JavaScript/CSS and four obsolete documentary pointers/notices. Replace the old
entry HTML with a redirect to Stripe. Preserve the two current experiences, 44
existing published asset hashes, source contracts, licenses, generator copies,
laboratory, technical chronology, academic work and opportunities. No Git history
rewrite, PR #3 merge or L7 reconstruction is part of this change.

PR #5 merged as `f2a765913a75cb158055a2c81692dc9cae53b391`. Static checks verified
the eight deletions, 27 local Markdown links, 25 HTML resource references and the
redirect. Local and public Edge checks exercised the old URL redirect, inventory,
source switch, map and direct Aurora entry; no console errors/warnings were captured.
These are scoped checks, not a rerun of historical functional suites. Synchronize
the shared entry documents selectively so the continuity branch retains its
additional historical records. Restore its missing public Stripe README and add
the redirect to the continuity asset verifier.

Pages run `42758036465` completed successfully for that merge commit. All nine
new/updated public files matched their prepared bytes over HTTPS; the eight
removed paths returned HTTP 404. The continuity verifier now checks 45 published
assets, including the redirect; private sources remain separately verified.
