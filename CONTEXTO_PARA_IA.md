# EvidentGraph — contexto público para pessoas e IA

**Atualizado em 10/11/2026.** Este é o ponto de entrada para alguém da equipe ou da orientação clonar o repositório e pedir a uma IA que explique o projeto. O texto é autocontido para uma primeira explicação; as referências permitem verificar e aprofundar cada assunto.

Este é o contexto público consolidado, não uma transcrição de conversas nem uma cópia de documentos privados. Não é necessário acessar o Drive, credenciais ou o chat de origem para entender o projeto. Se uma pergunta depender de fontes ausentes, indicar a lacuna em vez de completar pela imaginação.

## 1. Explicação em um minuto

EvidentGraph é um protótipo e laboratório de pesquisa aplicada sobre revisão de mudanças e dependências de software, APIs, dados e sistemas que podem incluir agentes de IA. O problema investigado é que contratos, código, permissões, catálogos e registros de execução mostram partes diferentes de uma mesma dependência. Uma equipe precisa entender o que uma mudança pode afetar, qual evidência sustenta essa conclusão e o que ainda não sabe.

A experiência atual combina grafo, lista de conexões, inventário, análise de mudanças, detalhes de evidências e exportação de relatórios. O exemplo principal compara contratos públicos da Stripe e mostra o efeito da mudança em leitores próprios, usando entradas simuladas. O Grupo Aurora complementa a explicação com um ambiente empresarial inteiramente fictício.

Há código executável e testes registrados. Ainda não há produto de produção, cliente real validado, benefício comercial medido ou demonstração de superioridade científica geral. A hipótese é ajudar a tomar decisões sobre mudanças com evidência rastreável e incerteza explícita.

## 2. Problema, usuário e hipótese de valor

Exemplo de pergunta: “Um campo de uma resposta de API mudou. Que consumidores podem depender dele, o que foi realmente observado e o que precisamos conferir antes de migrar?” Um mapa de dependências ajuda a explorar o contexto, mas uma conexão no grafo não prova, sozinha, que haverá falha.

O público inicial é uma hipótese: quem responde por mudanças de APIs, aplicações ou pipelines, trabalhando com os responsáveis pelos consumidores. Lideranças de Engenharia/Plataforma são possíveis compradores; responsáveis por segurança e pelas fontes podem autorizar integrações. Não houve validação suficiente para fechar segmento, comprador ou preço.

Reduzir tempo de investigação, melhorar a revisão e evitar surpresas são benefícios pretendidos, não resultados medidos. Diagnóstico delimitado, piloto e uso recorrente são possibilidades comerciais. Entrevistas, economia, receita, ROI e disposição a pagar não devem ser inventados a partir do protótipo.

## 3. O que existe e onde está

| Parte | Implementação existente | Limite |
| --- | --- | --- |
| Caso Stripe | Contratos OpenAPI públicos preservados, comparação de campo, leitor antigo e adaptado próprios, cenários e resultados inspecionáveis | Não executa a API da Stripe no navegador nem observa clientes reais |
| Grupo Aurora | 240 ativos e 512 relações fictícios; três cenários preparados; grafo/lista, inventário, investigação e análise | Não é inventário de uma empresa nem demonstra escala de produção |
| Adaptador de contratos | Python: confere um campo delimitado em duas versões e prepara a visualização; extensão opcional executa o consumidor simulado | Não é detector universal de mudanças ou descoberta automática de consumidores |
| Laboratório L1–L5 | HTTP local, SQLite, instrumentação OpenTelemetry, capturas e política de autorização local com cenários controlados | Não é coleta corporativa, IAM de produção ou monitoramento contínuo |
| Experimentos L6-A/L6-B | Comparação de fontes, referências comportamentais e análise limitada de código Python | Resultados condicionais em casos de autoria controlada; não validados externamente |
| Revisão L7 | Interface que separa indícios, inferências sob hipóteses e testes registrados, integrada ao laboratório | Mostrar um resultado gravado não executa novamente o teste |

O site público contém as duas primeiras experiências. Adaptador completo, laboratório, experimentos e testes posteriores estão na **branch de continuidade**. A seção 7 explica essa separação para que a ausência de uma pasta na `main` não seja interpretada como ausência de implementação no projeto.

## 4. Como explicar os exemplos corretamente

### Stripe: documento real, consumidor próprio e entradas simuladas

O recorte é a referência de assinatura em `GET /v1/invoices/{invoice}`. O contrato de `2025-02-24.acacia` declara `subscription` como campo opcional; o de `2025-03-31.basil` deixa de declará-lo naquele objeto. A orientação documental indica verificar `parent` e seu tipo antes de acessar `parent.subscription_details.subscription`. O caminho substituto foi informado pela documentação, não descoberto autonomamente pela ferramenta.

O leitor antigo pode terminar sem exceção e devolver “Sem assinatura” quando a entrada simulada usa a estrutura nova. O adaptado preserva a associação nos casos cobertos e pede revisão quando falta informação. O exemplo mostra por que **“não lançou erro” e “cumpriu a tarefa” são perguntas diferentes**.

São **nove cenários de autoria própria e 23 registros de execução**, não 23 clientes ou estudos independentes. Os cartões da interface mostram saídas previamente calculadas. Consumidores reais permanecem `UNKNOWN` e execução real `NOT_VERIFIED`. Nem a diferença entre esquemas prova o comportamento de uma integração real, nem o exemplo aprova uma migração em produção.

Fontes, licença, scripts de replay e limites: [README do caso](evidence-graph/caso-stripe/README.md), [manifesto](evidence-graph/caso-stripe/manifest.json) e [entradas/saídas simuladas](evidence-graph/caso-stripe/demo/result.json). Os contratos completos estão em `caso-stripe/sources/`.

### Aurora: empresa fictícia para experimentar a jornada

O catálogo tem 240 ativos e 512 relações tipadas. Sistemas, equipes, processos e ambientes fazem parte da simulação; rótulos como “Produção” descrevem a fixture, não uma implantação real do EvidentGraph. Os três cenários envolvem remoção de campo de API, mudança na saída de uma previsão de demanda e desativação de uma API legada com observação insuficiente.

A jornada permite explorar um ativo e suas conexões, revisar uma mudança, inspecionar consumidores e evidências, registrar verificações e exportar um recorte. Grafo e lista são representações complementares; a tabela da análise responde à revisão operacional. O grafo inteiro não precisa ser exibido de uma vez. Notas e verificações são locais ao navegador, sem colaboração sincronizada em um servidor.

Fonte: [README do Aurora](evidence-graph/preview-m2/README.md) e [modelo de referência](evidence-graph/core/demo-data/README.md).

## 5. Pesquisa: pergunta, evidência e limites

A hipótese ampla investiga se correlacionar configuração/metadados, contratos/código, autorização, lineage e runtime melhora respostas sobre dependências e impacto. As três perguntas históricas ajudam a organizar o domínio:

- **CAN IT?** Há evidência de que uma identidade/aplicação pode alcançar um recurso sob condições conhecidas?
- **DID IT?** Esse caminho foi observado em determinada execução e janela?
- **WHAT BREAKS?** Qual consequência de uma mudança pode ser sustentada e o que exige conferência?

O recorte público atual dá ênfase à revisão de mudanças. Não se deve anunciar que o site resolve essas três perguntas de forma geral em ambientes empresariais.

Regras de interpretação:

| Observação | O que ela permite dizer |
| --- | --- |
| Relação declarada/configurada | Existe uma declaração; ela pode estar incompleta ou errada |
| Chamada ou leitura observada | O evento ocorreu no recorte observado; isso não cobre todos os inputs e períodos |
| Permissão de laboratório | A política local produziu uma decisão; não certifica IAM corporativo |
| Indício de dependência | Há motivo para revisar; não prova exceção ou erro de negócio |
| Inferência limitada | A conclusão depende das hipóteses, versão e sintaxe suportadas |
| Teste registrado | Uma execução ocorreu sob condições explícitas; não garante o futuro |
| `UNKNOWN` / inconclusivo | Falta suporte para concluir; não significa ausência de risco nem acerto |

Na L6-B, acrescentar código do consumidor como fonte permitiu 11 previsões corretas de exceção e uma inconclusiva nos 12 casos antigos. A fonte de código isolada produziu o mesmo resultado; portanto, não atribuir o ganho à fusão com informação equivalente. Nos oito casos novos, houve três previsões corretas e cinco inconclusivas. Esses casos também foram feitos pelo autor, não por uma avaliação externa.

Três casos novos violaram expectativas de negócio sem lançar exceção. Isso foi identificado pelo avaliador, não previsto semanticamente pelo analisador. Ausência de erro por abstenção não é precisão perfeita; aumento de informação não prova vantagem do método de fusão.

Referências detalhadas na continuidade: [L6-A](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/core/docs/28_L6_EVIDENCE_EXPERIMENT.md) e [L6-B](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/core/docs/29_L6B_INFERENCE_AND_SEMANTICS.md). Grafos, lineage, OpenTelemetry ou mapeamento de APIs existentes não constituem, por si, novidade científica deste projeto.

## 6. Arquitetura implementada e papel da IA

O site é **HTML, CSS e JavaScript estáticos no GitHub Pages**. Os dados e resultados são preparados por scripts Python; o navegador os carrega e oferece navegação, filtros, notas locais e exportação. Não há backend de produção servindo inferências ou chamando um LLM para a demonstração.

Fluxos implementados, de forma simplificada:

```text
Modelo fictício Aurora -> build_preview.py -> dados versionados -> interface estática
Contratos preservados + receita delimitada -> adaptador Python -> caso e manifesto
Entradas simuladas + leitores próprios -> resultados gravados -> cartões da comparação
HTTP/SQLite/OTel locais -> captura de laboratório -> adaptadores -> revisão L7 separada
```

O laboratório usa Python/FastAPI, HTTPX/Uvicorn, SQLite e instrumentação manual OpenTelemetry. Testes usam Python, Node/DOM e Playwright, com requisitos distintos por etapa. A análise estática experimental é um parser AST restrito e determinístico, não um modelo de linguagem.

**IA no domínio não equivale a IA implementada no produto.** Agentes de IA são um tipo de ativo/caso de uso. Usar assistência de IA no desenvolvimento também não demonstra uma capacidade de IA entregue ao usuário do EvidentGraph.

Extrair ou reconciliar referências de documentos com NLP/IA generativa é uma hipótese a avaliar contra regras, IDs e parsers convencionais. Não há integração Meta, agente LLM, servidor MCP do produto, RAG ou conjunto de conectores corporativos implementado por estes marcos. Neo4j, PostgreSQL, Docker Compose e uma aplicação Next.js aparecem em propostas antigas; não compõem a stack entregue descrita acima.

Fonte conceitual: [arquitetura](evidence-graph/core/docs/05_ARCHITECTURE.md). Seu título e listas antigos devem ser lidos como propostas; implementação e limites atuais estão neste guia e nos checkpoints posteriores da continuidade.

## 7. Como ler o clone e as branches

| Local | Finalidade |
| --- | --- |
| `README.md` | Entrada para pessoas, links do site e deste guia |
| `CONTEXTO_PARA_IA.md` | Síntese pública atual para contextualizar e explicar |
| `AGENTS.md` | Orientação de leitura para ferramentas de programação com IA |
| `evidence-graph/brand/` | Identidade visual Fenda, fontes e licenças |
| `evidence-graph/caso-stripe/` | Artefato publicado do caso, contratos, replay e resultados |
| `evidence-graph/preview-m2/` | Interface Aurora atual; o nome da pasta é histórico |
| `evidence-graph/core/demo-data/` e `core/demo-ui/` | Modelo, geração dos dados e testes de interface |
| `evidence-graph/core/docs/` | Pesquisa, decisões, arquitetura e checkpoints datados |
| `evidence-graph/core/academic/project-discipline/` | Equipe, atividades e entregas da disciplina |
| `evidence-graph/opportunities/` | Adaptações para oportunidades, separadas do produto |

**`main` publica o site.** O clone padrão permite abrir as páginas e ler este contexto, mas não inclui todo o laboratório nem todos os testes e documentos posteriores.

**`codex/continuidade-20261109` contém o desenvolvimento integral público.** Nela estão também `core/contract-case/`, `core/lab-runtime/`, `core/evaluation/`, `core/review-ui/`, os checkpoints até 36, `RETOMADA.md`, `CONTINUIDADE.json` e o verificador de retomada. “Integral” aqui se refere ao código e contexto público; não inclui os arquivos privados.

Para obter esse código em uma pasta nova, sem substituir trabalho existente:

```sh
git clone -c core.autocrlf=false --branch codex/continuidade-20261109 https://github.com/ASCCJR/asccjr.github.io.git EvidentGraph-completo
```

Se já houver checkout, conferir branch e alterações locais antes de trocar. A IA deve informar em qual branch está lendo; não descrever arquivos ausentes como se os tivesse inspecionado. Links para a continuidade exigem internet se seus arquivos não estiverem no clone atual.

Os recursos compartilhados/copiados entre Aurora, Stripe e builders têm função no empacotamento. Não apagar arquivos apenas por terem conteúdo idêntico. Os contratos grandes e suas licenças sustentam a verificabilidade do caso.

## 8. Estado atual versus história

Esta organização mantém a identidade Fenda, o caso Stripe e o Aurora. A antiga demo Acme/Agentic AI foi retirada da árvore atual; `/evidence-graph/` encaminha para Stripe. O histórico do Git permanece disponível. O laboratório não foi reconstruído e a L7 não deve ser reaplicada.

Marcos relevantes:

- **M1–M3, outubro:** modelo sintético, jornada de revisão, restauração do grafo/lista e investigação de ativos.
- **L1–L7, fechamento em 19/10:** laboratório, capturas, autorização local, experimentos limitados e revisão por níveis de evidência. L7 já está integrada ao desenvolvimento integral.
- **22–24/10:** caso Stripe/consumidor simulado, correções de UX e identidade Fenda publicados em etapas próprias.
- **09/11:** consolidação da branch de continuidade e material privado separado para mudança de computador.
- **10/11:** ajuste do menu publicado pelo [PR #4](https://github.com/ASCCJR/asccjr.github.io/pull/4); teste chat → GitHub → Pages → Edge concluído. Em seguida, organização da entrada e deste guia para equipe e orientação.

Na conferência de 10/11, o **PR #3 permanecia aberto como rascunho**, separado da publicação do site. Isso não significa que a L7 esteja pendente de reconstrução. Revalidar o estado remoto antes de uma futura decisão de integração.

Documentos antigos usam expressões como “próxima interface”, “somente local”, “L3 pendente” ou listam stacks pretendidas. São registros de seus momentos; não são uma fila atual de implementação. A [retomada vigente](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/RETOMADA.md) e o [registro de decisões completo](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/core/docs/08_DECISION_LOG.md) indicam o que foi superado.

## 9. O que os testes demonstram

| Evidência registrada | Interpretação correta |
| --- | --- |
| L7: 249 testes Python e 36 casos HTTP distintos no fechamento histórico | Validação funcional no escopo e ambiente documentados; não executada integralmente de novo a cada mudança |
| Três repetições adicionais do cenário de inicialização | Repetições, não três casos distintos extras |
| Correções UX: 23 cenários locais, 19 repetidos no site | Resultado da rodada delimitada; revisão automatizada não substitui compreensão por usuários |
| Stripe: nove cenários e 23 registros | Execução simulada dos leitores próprios, sem clientes reais |
| Teste básico do fluxo em 10/11 | Publicação e navegação conferidas no Edge; não revalida sozinho laboratório, mercado ou segurança de produção |

Os números pertencem a escopos diferentes e não devem ser somados. Para detalhes da L7, consultar o [checkpoint 30](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/core/docs/30_L7_EVIDENCE_REVIEW.md). O HEAD integralmente validado naquele fechamento foi `41b282601c25d6f3e0f9ec574dec9d4049782e62`; os incrementos posteriores têm verificações próprias.

A existência de um teste no repositório não comprova uma execução atual. Ao explicar ou avaliar, separar teste de implementação, avaliação experimental, usabilidade e validação comercial.

## 10. Equipe, disciplina, oportunidades e pendências

Os seis integrantes da disciplina e a relação de autoria dos projetos estão em [TEAM.md](evidence-graph/core/academic/project-discipline/TEAM.md). EvidentGraph e ParkAI são projetos distintos. Não inferir cargos, sociedade, dedicação, vínculo profissional ou participação em um edital a partir da lista acadêmica.

As entregas e os relatos de feedback estão no [workspace da disciplina](evidence-graph/core/academic/project-discipline/README.md). A aprovação/entrega relatada de uma atividade não equivale a validação com clientes ou recuperação dos e-mails originais.

Campus Mobile e CTE-IA são oportunidades separadas. Exigências de celular não redefinem o Core; proposta de IA em edital não prova IA implementada. Regras e prazos antigos precisam ser consultados na fonte vigente antes de uso. Rascunhos não comprovam inscrição, seleção ou aprovação. Dados de candidatura, contatos e memória privada não fazem parte deste guia.

Pendências que não devem ser tratadas como concluídas:

1. Reteste humano da experiência atual e avaliação independente de tarefas/casos.
2. Discovery com potenciais usuários, compradores e responsáveis por integração.
3. Um possível piloto de escopo pequeno, com dados e acesso autorizados e medidas combinadas.
4. Demonstrar utilidade e, se houver hipótese de IA, comparar seu valor com uma alternativa determinística.
5. Decidir próximos incrementos a partir dessas evidências, sem reiniciar marcos concluídos ou ampliar a stack por inércia.

Não há nova entrevista, cliente ou inscrição confirmada apenas porque consta nesta lista.

## 11. Abrir, conferir e explicar

Na raiz do repositório, com Python disponível:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

No Windows o executável pode se chamar `python`. Abrir `http://127.0.0.1:8765/evidence-graph/`. A raiz precisa ser servida para os ativos compartilhados funcionarem. Não há instalação de bibliotecas para abrir a interface estática; laboratório e suítes têm requisitos próprios.

Na branch de continuidade, `python3 evidence-graph/tools/verify_resume.py` verifica integridade/disponibilidade, não executa suítes funcionais. A ausência do contexto privado em um clone da equipe é esperada e não impede a explicação pública. Não usar `--require-private` como requisito para essa leitura.

Prompt sugerido para alguém do time ou da orientação:

> Leia CONTEXTO_PARA_IA.md e as referências disponíveis neste clone. Explique em português o problema do EvidentGraph, o público pretendido, a jornada atual, a arquitetura implementada, a hipótese de pesquisa e as próximas validações. Diferencie documento real, dado sintético, execução medida, hipótese e trabalho pendente. Informe a branch e as fontes usadas. Se uma fonte estiver ausente, diga isso. Não altere o projeto apenas para contextualizá-lo.

Uma boa explicação deve conseguir responder: **qual problema estamos investigando; o que alguém consegue fazer hoje; como sabemos disso; o que ainda não sabemos; e qual evidência falta para avançar**.

## 12. Ordem de leitura e manutenção

1. Ler este guia e conferir os arquivos/branch reais.
2. Para demonstrar, ler os READMEs de Stripe e Aurora e abrir a interface.
3. Para desenvolver, usar a continuidade e ler `RETOMADA.md`, as instruções do projeto e os documentos da área afetada.
4. Para pesquisa/produto, ler contexto canônico, decisões e checkpoints posteriores; datas e escopo prevalecem sobre uma frase antiga marcada como “atual”.
5. Para disciplina ou edital, abrir o workspace correspondente sem transportar requisitos de uma oportunidade para outra.

Ao mudar comportamento, evidência ou decisão de produto, atualizar esta síntese e registrar a fonte. Separar capacidade existente de hipótese e manter a data da revisão. Não copiar documentos privados para tornar o guia “mais completo”. Pedido de explicação não autoriza publicação, exclusão, gastos, contato ou inscrição; essas ações dependem da instrução do responsável.
