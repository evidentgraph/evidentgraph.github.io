# EvidentGraph

Protótipo e laboratório de pesquisa aplicada para revisar mudanças de APIs e explorar dependências com suas evidências e incertezas.

**Para entender o projeto ou contextualizar uma IA, comece por [CONTEXTO_PARA_IA.md](CONTEXTO_PARA_IA.md).** O guia explica problema, produto atual, arquitetura, pesquisa, decisões, validação e pendências, sem depender de conversas anteriores ou material privado.

## Experimentar

- **[Caso Stripe](https://evidentgraph.github.io/evidence-graph/caso-stripe/?source=case&eg_view=analysis&eg_change=CASE-001):** contratos públicos de duas versões e resultados de leitores próprios com entradas simuladas.
- **[Grupo Aurora](https://evidentgraph.github.io/evidence-graph/preview-m2/):** grafo, lista, inventário e análise de mudanças em um ambiente fictício com 240 ativos e 512 relações.

O caso Stripe não representa cliente ou integração real da Stripe. Consumidores reais permanecem desconhecidos e a página mostra resultados preparados. O projeto ainda não tem validação comercial ou científica independente demonstrada.

## Código e leitura

| Onde | Conteúdo |
| --- | --- |
| `main` | Site publicado pelo GitHub Pages e contexto público para leitura |
| [`codex/continuidade-20261109`](https://github.com/evidentgraph/evidentgraph.github.io/tree/codex/continuidade-20261109) | Desenvolvimento integral público: adaptador, geradores, testes, laboratório e registros atuais |
| [Guia para IA](CONTEXTO_PARA_IA.md) | Explicação consolidada, limites e roteiro de leitura |
| [Retomada técnica](https://github.com/evidentgraph/evidentgraph.github.io/blob/codex/continuidade-20261109/evidence-graph/RETOMADA.md) | Instruções para continuar o desenvolvimento |
| [Novo computador ou chat](https://github.com/evidentgraph/evidentgraph.github.io/blob/codex/continuidade-20261109/evidence-graph/NOVO_COMPUTADOR.md) | Preparação, fontes privadas separadas e estado da passagem de 11/11/2026 |
| [Disciplina e equipe](evidence-graph/core/academic/project-discipline/README.md) | Atividades, autoria e registros acadêmicos |

Um clone padrão da `main` permite abrir o site e entender o projeto, mas não contém todo o laboratório. O guia informa quais fontes estão na outra branch. Documentos privados e rascunhos confidenciais ficam fora do Git.

## Abrir localmente

Na raiz do checkout, com Python disponível:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

No Windows o executável pode se chamar `python`. Abrir `http://127.0.0.1:8765/evidence-graph/`. A interface estática não exige instalar bibliotecas ou fornecer credenciais; testes e laboratório têm requisitos próprios.

## Usar com uma IA

> Leia CONTEXTO_PARA_IA.md e as referências disponíveis neste clone. Explique o problema, o que funciona hoje, a arquitetura implementada, a hipótese de pesquisa e o que falta validar. Diferencie fatos, simulações, resultados medidos e planos. Informe a branch e qualquer fonte ausente. Não altere arquivos apenas para contextualizar o projeto.
