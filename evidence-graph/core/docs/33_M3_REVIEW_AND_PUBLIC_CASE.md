# M3 — orientação do mapa, compartilhamento e caso público

**22/10/2026. Implementação local concluída; interface posteriormente publicada
em 64fa503.** Ver [35](./35_PUBLIC_UI_AND_STRIPE_CASE.md) para o escopo publicado
e a verificação HTTPS; o modo documental isolado descrito aqui continua local.

Continuação: [34 — consumidor simulado](./34_SIMULATED_CONSUMER.md) acrescenta
uma execução de exemplo opcional. O modo documental e seus resultados abaixo
permanecem separados dessa simulação.

O proponente autorizou continuar os ajustes e o avanço técnico enquanto o
reteste por pessoas foi adiado. A reavaliação automatizada da versão a147eaf
considerou cinco achados anteriores resolvidos nos percursos examinados e um
parcial. Ela conhece o relatório anterior e não é uma nova avaliação cega ou
validação com usuários. Originais, manifesto conferido e capturas ficam privados.

## Mudanças na experiência

- Em largura de até 780 px, a entrada nova usa a lista do mesmo recorte, em
  cartões que cabem na tela. Uma escolha explícita de grafo/lista no endereço
  prevalece. O desktop mantém a entrada pelo grafo.
- O grafo informa quantos ativos estão inteiramente visíveis. Botões de direção
  e setas do teclado, com foco na região do mapa, permitem mover a área visível.
  Leitura, Ajustar tudo e retorno ao ativo selecionado continuam disponíveis;
  este último revela a seleção mesmo que um filtro a tenha excluído.
- O detalhe oferece seu próprio botão de copiar link. Consumidor, ativo,
  relação e evidência expandida podem ser restaurados. Só identificadores
  existentes e evidências pertencentes ao detalhe são aceitos. Notas e
  verificações permanecem locais.
- Voltar/Avançar descarta confirmações antigas. Fechar o detalhe atualiza o
  endereço antes de uma recarga imediata, evitando reabrir o painel encerrado.

As alterações reutilizam as telas, o dataset Aurora 240/512 e as classificações
existentes. A lista estreita melhora acesso aos elementos; não constitui prova
de usabilidade móvel ou conformidade WCAG integral.

## Entrada de um caso público

O [adaptador de contrato](../contract-case/README.md) recebe dois JSON OpenAPI
fixados por hash e uma descrição delimitada de campo/resposta. Gera uma cópia
local da experiência M3, preservando o catálogo Aurora como fonte separada.

No caso da Stripe, os contratos `2025-02-24.acacia` e `2025-03-31.basil` confirmam
que `invoice.subscription` deixou de ser declarado no objeto. O caminho indicado
pela documentação, `parent.subscription_details.subscription`, foi conferido no
contrato posterior. A orientação condiciona o acesso ao tipo de `parent`.
Isso não descobre consumidores ou demonstra o resultado de uma migração.

A tela apresenta quatro ativos documentais e duas relações estruturais: duas
respostas versionadas e seus campos. Nenhuma chamada ou dependência entre as
versões foi inventada. A análise e os relatórios mantêm consumidores desconhecidos
e execução não verificada; expõem fontes, hashes, condições e próximo passo.
Os contratos completos e a licença MIT acompanham a saída privada.

Este avanço torna material externo revisável nas telas existentes. Não é um
piloto comercial nem uma nova execução L7. O adaptador não executa oasdiff;
o estudo separado da comparação registrou a remoção como informativa no modo
changelog, pois o campo era opcional. Não há alegação de detecção exclusiva.

## Verificação

Registros de execução e inspeção visual ficam na área privada de continuidade:

- 23 cenários de interação DOM e 13 checks puros de exploração aprovados.
  DOM não renderiza layout e usa substitutos explícitos para diálogo/ResizeObserver.
- 20 testes de compatibilidade do gerador L7 aprovados em Python 3.12. São
  regressões do gerador, sem reexecutar a validação HTTP histórica da L7.
- Oito testes do novo adaptador aprovados, com contratos mínimos fictícios;
  a geração do caso Stripe usou separadamente os contratos públicos completos.
- 16 percursos HTTP anteriores reexecutados e oito novos cenários focados
  aprovados em Chromium real, com sandbox habilitado. Repetições de desenvolvimento
  não ampliam essas contagens. Os cenários cobrem vista estreita, filtros,
  histórico, notas, detalhes/evidências, exportação e troca das fontes.
- Nenhum erro de página ou recurso nos resultados finais. Capturas de lista
  estreita, evidência compartilhada, comparação e grafo documental foram
  examinadas. A inspeção levou ao alinhamento das duas versões no mapa.

A primeira regressão detectou recarga antes da atualização do endereço ao
fechar um detalhe; o fluxo foi corrigido e o mesmo teste passou. O primeiro
carregamento do novo adaptador também expôs uma dependência acidental do
laboratório; foi removida, mantendo o builder apenas com biblioteca padrão.
Os registros dessas tentativas permanecem preservados.

Essas verificações não medem compreensão humana, benefício comercial ou
superioridade científica; não se somam aos 249 Python/36 HTTP históricos da L7.

L7, experimentos, capturas históricas, equipe e oportunidades permanecem nos
escopos anteriores. Merge, publicação, gastos e contato externo não decorrem
desta implementação local. O próximo teste humano ainda está pendente.
