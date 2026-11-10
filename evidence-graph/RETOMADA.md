# EvidentGraph — começar aqui

Atualização: **10/11/2026**. Este é o ponto de retomada para outro computador ou chat.

## Repositório e branch

- Repositório: https://github.com/ASCCJR/asccjr.github.io
- Branch de continuidade: **`codex/continuidade-20261109`**.
- `main` contém a publicação do site; não contém todo o laboratório e o trabalho posterior.
- Esta branch reúne o Core/L7 já existente, as alterações de UX/contratos/testes e os ativos Fenda publicados. Os PRs #4 (menu) e #5 (limpeza e contexto público para IA) foram publicados em 10/11/2026 e sincronizados aqui; o PR #3 permanece separado.

```sh
git clone -c core.autocrlf=false --branch codex/continuidade-20261109 https://github.com/ASCCJR/asccjr.github.io.git EvidentGraph
cd EvidentGraph
python3 evidence-graph/tools/verify_resume.py
```

Se o clone já existir, conferir arquivos locais antes de trocar de branch. Nunca usar reset/clean para retomar automaticamente. No Windows, `python` pode substituir `python3`.
Preservar as quebras de linha do Git evita que a conversão automática do Windows
altere os hashes dos arquivos publicados.

## Estado que prevalece sobre documentos históricos

- **Produto:** protótipo funcional e laboratório de pesquisa aplicada. Hipótese inicial: apoiar equipes de software/plataforma na revisão de mudanças de APIs. Sem cliente real, ganho de negócio medido ou MVP validado.
- **Apresentação recomendada:** caso Stripe como exemplo principal e Aurora como complemento de grafo/dependências. Isso é orientação de apresentação, não aprovação de nova funcionalidade.
- **Publicação atual:** commit `f2a765913a75cb158055a2c81692dc9cae53b391` ([PR #5](https://github.com/ASCCJR/asccjr.github.io/pull/5)), com guia público para IA, READMEs atualizados e retirada de oito arquivos obsoletos aprovada pelo responsável. A interface mantém a marca Fenda, paleta azul/noite/branco/lavanda, Inter e Roboto Mono e o destaque do menu do PR #4. Os arquivos estáticos desta branch correspondem a essa publicação.
- **Duas experiências:** `caso-stripe/` oferece `Caso público` e `Grupo Aurora`; `preview-m2/` abre diretamente Aurora e tem atalho para o caso. A entrada `/evidence-graph/` agora redireciona para Stripe, substituindo a demo antiga Acme. As duas experiências atuais permanecem.
- **Caso Stripe:** contratos públicos reais e código consumidor próprio com entradas simuladas. Nove cenários, 23 registros de execução; não são 23 clientes/casos independentes. A página mostra resultados preparados. Consumidores reais UNKNOWN e execução real NOT_VERIFIED.
- **Aurora:** 240 ativos e 512 relações sintéticos. Grafo, lista de conexões e análise operacional permanecem complementares.
- **L7:** integrada e validada no escopo histórico do checkpoint 30; não reaplicar patch, reconstruir o projeto, reiniciar Checkpoints 1–3 ou abrir L8 para uma transferência. PR #3 segue separado; conferir seu estado remoto antes de uma decisão de merge.
- **Validação:** resultados históricos, não reexecutados integralmente por esta organização: L7 249 Python/36 HTTP; UX 23 locais/19 repetições públicas; marca 8 locais/8 repetições públicas e 47 recursos por hash. Em 10/11/2026, o ajuste do menu passou por conferência local e pública no Edge: duas entradas, navegação entre seções e Tab/Enter, sem erros/avisos no console. Os cinco arquivos alterados publicados conferiram por SHA-256 e o Pages concluiu com sucesso. Esse teste básico não equivale a uma revalidação integral. Novo reteste humano e validação comercial não estão confirmados.
- **IA:** extração/reconciliação documental permanece hipótese. Não declarar integração Meta, LLM, conectores corporativos ou vantagem científica implementada.
- **Oportunidades:** CTE-IA, Campus Mobile e inscrições são contextos distintos. Consultar fontes privadas e revalidar prazos/status externos antes de agir. Não deduzir aprovação, rejeição ou envio a partir de um rascunho ou de datas antigas.

## Leitura por assunto

Para primeiro acesso de equipe, orientação ou IA, ler [CONTEXTO_PARA_IA.md](../CONTEXTO_PARA_IA.md). Ele consolida o contexto público sem exigir Drive e distingue main, continuidade, capacidades existentes e hipóteses. O README do caso Stripe, antes ausente nesta branch, foi reposto a partir da versão publicada.

1. [Instruções do projeto](AGENTS.md) e [índice técnico](core/docs/00_START_HERE.md).
2. Pesquisa/arquitetura: [contexto](core/docs/01_CANONICAL_CONTEXT.md), [decisões](core/docs/08_DECISION_LOG.md), [pesquisa](core/docs/09_RESEARCH_LOG.md), [visão de produto/UX](core/docs/12_PRODUCT_UX_VISION.md).
3. Últimos incrementos: docs [30](core/docs/30_L7_EVIDENCE_REVIEW.md), [33](core/docs/33_M3_REVIEW_AND_PUBLIC_CASE.md), [34](core/docs/34_SIMULATED_CONSUMER.md), [35](core/docs/35_PUBLIC_UI_AND_STRIPE_CASE.md), [36](core/docs/36_M3_CONSOLIDATED_UX_FIXES.md).
4. Adaptador e execução: [core/contract-case/README.md](core/contract-case/README.md).
5. Candidatura: [opportunities/cte-ia-2026/README.md](opportunities/cte-ia-2026/README.md); atividades acadêmicas em `core/academic/project-discipline/`.

## Contexto privado no computador novo

O Git público preserva código e contexto público. Memória integral, edital original, rascunhos, relatórios recebidos, dados pessoais e evidências completas ficam na pasta privada **`EvidentGraph` do Google Drive**, escolhida pelo usuário para a continuidade. Começar por `00_COMECE_AQUI.txt` usando a conexão Google Drive; `Contexto e fontes` permite ler os documentos principais sem extrair o backup. O ZIP integral e seu arquivo de hash estão na mesma pasta. **Clonar só este repositório não restaura esses materiais.**

O Drive para computador também pode disponibilizar essa pasta localmente; não
presumir letra de disco ou usuário. Acesso pela conexão requer que o novo chat
tenha acesso à conta correta. Sem acesso, informar a lacuna e pedir a conexão ou
o caminho da pasta, sem recriar documentos. A cópia é um retrato datado: mudanças
fora da pasta sincronizada não são enviadas automaticamente ao Drive.

Depois de copiar e extrair o pacote, executar seu `restaurar.py` ou configurar `git config --local evidentgraph.privateContext` com o caminho local da pasta restaurada `transferencia-integral-20261019`. Esse valor não deve ser commitado. Ler primeiro `RETOMADA_NOVO_COMPUTADOR.txt`, depois `RETOMADA.txt` e `ESTADO_TRANSFERENCIA.json` na área privada.

O bundle dentro do backup fixa `936658e`; os documentos de descoberta do Drive
foram adicionados depois nesta mesma branch. Com internet, conferir a ponta
remota antes de editar, preservando alterações locais. O backup não acompanha
automaticamente commits posteriores.

Os caminhos absolutos nos registros antigos são proveniência da máquina de origem. Usar o mapa de raízes do pacote para localizar as cópias; não recriar arquivos ausentes a partir da memória nem alterar originais só para trocar seus hashes. Sem o pacote, seguir apenas trabalho técnico/público e informar a lacuna quando ela for relevante.

## Abrir e conferir

Servir **a raiz do repositório**, para que as duas rotas e os ativos compartilhados funcionem:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/evidence-graph/caso-stripe/?source=case&eg_view=analysis&eg_change=CASE-001`.

O verificador de retomada usa apenas Python e Git. A interface pronta não exige instalar bibliotecas. O adaptador usa Python 3.12 ou posterior:

```sh
cd evidence-graph/core/contract-case
python3 -m unittest -v test_case test_consumer_demo
```

Testes de navegador M3 usam Node e Playwright separados; configurar `EG_PLAYWRIGHT_MODULE`, `EG_PREVIEW_URL`, `EG_CASE_URL` e `EG_BROWSER_OUTPUT` conforme o README. A rodada de marca usou Playwright Core 1.63.0/Chromium 153. O laboratório L7 conserva requisitos próprios (Playwright 1.57.0 e ambiente suportado); não substituir dependências antigas para fingir revalidação histórica. Reinstalar dependências para o sistema novo quando necessário; não copiar sessões de login ou ambientes virtuais como se fossem portáveis.

## Próxima sessão

O PR #5 foi conferido localmente e no site público no Edge: redirecionamento, Inventário, troca para Aurora, mapa e entrada direta. Os 44 ativos anteriores mantiveram seus hashes; a entrada de redirecionamento também passou a ser verificada no manifesto de continuidade. A retirada foi limitada aos oito arquivos aprovados, com histórico Git preservado. Esses testes básicos não revalidam as suítes históricas L7.

Confirmar branch/estado e ler o contexto antes de escolher o próximo incremento com o usuário. A migração não autoriza nova funcionalidade, merge, publicação, gastos, contatos, inscrições ou aceite de declarações. Todo o trabalho continua com o usuário no chat novo; não depender de consultar o assistente anterior.
