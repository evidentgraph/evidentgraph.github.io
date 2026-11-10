# EvidentGraph

Protótipo e laboratório de pesquisa aplicada para revisar mudanças e dependências com evidência rastreável e incerteza explícita.

## Começar

Para uma explicação completa, inclusive por uma IA, ler [CONTEXTO_PARA_IA.md](../CONTEXTO_PARA_IA.md). O guia público reúne problema, público pretendido, capacidades existentes, arquitetura, pesquisa, limites e próximos passos; não exige acesso ao contexto privado.

- [Caso Stripe](https://asccjr.github.io/evidence-graph/caso-stripe/?source=case&eg_view=analysis&eg_change=CASE-001): contratos reais e consumidor próprio com entradas simuladas.
- [Grupo Aurora](https://asccjr.github.io/evidence-graph/preview-m2/): ambiente fictício com 240 ativos e 512 relações, grafo/lista, inventário e revisão operacional.
- [Disciplina e equipe](core/academic/project-discipline/README.md): entregas e registros acadêmicos.

O site não observa clientes reais nem chama a API da Stripe para gerar resultados ao vivo. Não há validação comercial ou científica independente demonstrada.

## Desenvolvimento

`main` publica o site. A [branch de continuidade](https://github.com/ASCCJR/asccjr.github.io/tree/codex/continuidade-20261109) também reúne adaptador de contratos, laboratório L1–L7, experimentos, testes e documentação posterior. Começar pela [retomada técnica](https://github.com/ASCCJR/asccjr.github.io/blob/codex/continuidade-20261109/evidence-graph/RETOMADA.md) antes de editar.

`core/` reúne o projeto; `core/academic/` registra seu uso na disciplina; `opportunities/` reúne adaptações para oportunidades distintas. Planos antigos são históricos, não autorização para reconstruir etapas concluídas.

Servir a raiz do checkout com `python3 -m http.server 8765 --bind 127.0.0.1` e abrir `/evidence-graph/`. Essa entrada encaminha para Stripe; a URL de Aurora permanece válida. A demonstração anterior Acme foi retirada da árvore atual com seu histórico preservado no Git.
