# Publicação da interface revisada e do caso Stripe

**22/10/2026, horário de Fortaleza — publicado e conferido.**

Após a autorização direta do proponente, “pode alterar o publico”, a versão
[64fa503](https://github.com/ASCCJR/asccjr.github.io/commit/64fa50388e9255d8c0d8bd9f78402c8553b88f71)
foi publicada por avanço normal de `main`, a partir de `a147eaf`. GitHub Pages
concluiu o build desse commit em 23/10/2026 às 02:29:50 UTC. Não houve merge do
PR #3 nem publicação da L7.

- [Interface Aurora revisada](https://asccjr.github.io/evidence-graph/preview-m2/?review=64fa503).
- [Caso Stripe com consumidor simulado](https://asccjr.github.io/evidence-graph/caso-stripe/?review=64fa503&source=case&eg_view=analysis&eg_change=CASE-001&eg_scope=all&eg_technical=1).

O endereço anterior continua válido e ganhou o atalho “Caso Stripe”. A página
do caso mantém o seletor entre o caso e Aurora. Os recursos JS/CSS têm versões
por hash no endereço, para renovar o cache após a atualização. O parâmetro
`review` identifica a revisão compartilhada; não fixa a página para sempre.

## Escopo versionado na publicação

O commit altera cinco arquivos de `preview-m2/`: `index.html`, `app.js`,
`lineage.js`, `investigation.js` e `investigation.css`. São as correções da
rodada 3, com o atalho e as referências dos recursos. Catálogo, estilos-base,
exploração e manifesto de dados permanecem preservados.

Acrescenta 24 arquivos em `caso-stripe/`: a visualização estática testada,
dados do caso, código e recortes simulados, resultados gravados, os dois
contratos públicos completos, licença MIT, manifesto e instruções para repetir
os leitores. `demo/replay_consumer.py` repete apenas os exemplos locais e
confere igualdade com o registro; não revalida o contrato nem chama a Stripe.
Seu replay conferiu os mesmos 23 registros.

Nenhum relatório de UX/IA/SiDi, memória privada, contato ou rascunho de inscrição
foi incluído. A cópia publicada foi montada por lista explícita de arquivos,
conferida por hash, incluindo o conteúdo descompactado dos datasets. As fontes
públicas e o exemplo sintético deixam de ser apenas locais; os originais e os
registros de recebimento continuam preservados na área privada.

O checkout da feature, seu HEAD e índice foram mantidos. Código do adaptador,
testes e documentação complementar ainda têm alterações locais; o commit de
publicação contém somente os arquivos listados acima. Uma referência local
`codex/publicacao-ux-caso-stripe-20261022` preserva o commit enviado.

## Verificação sobre o endereço público

- O build do Pages aponta o commit publicado; 34 recursos HTTP, incluindo
  arquivos inalterados de apoio, responderam com bytes idênticos aos preparados.
- Cinco percursos da interface e seis do caso passaram em Chromium real, com
  sandbox, sobre HTTPS público. Repetem o recorte local; não são 22 casos novos.
- Foram conferidos navegação, tela estreita, detalhes/evidências compartilháveis,
  histórico, os nove cenários do exemplo, downloads/exportação, grafo/lista e
  retorno ao catálogo Aurora 240/512. O modo documental sem consumidor não integra
  esta publicação e não foi contado entre os cinco percursos da interface.
- Nenhum erro de página ou recurso nos resultados finais. A suíte do caso não
  registrou requisição fora da origem do site. O atalho entre as duas páginas
  foi verificado à parte. Capturas públicas da interface, comparação e grafo
  foram abertas e examinadas.

Manifestos, respostas HTTP, logs e capturas ficam no diretório privado indicado
pela configuração local de continuidade. Consultar `RETOMADA.txt`, item 33.

## Limites mantidos

Contratos públicos reais e consumidor simulado permanecem identificados
separadamente. Consumidores reais continuam UNKNOWN; sua execução permanece
NOT_VERIFIED. O teste do exemplo não representa chamada à API, migração aprovada,
piloto com cliente, compreensão humana ou benefício comercial medido. Os relatos
anteriores e a reavaliação automatizada não se tornam um novo reteste por pessoas.
Nenhuma mensagem foi enviada aos participantes ou a um avaliador externo.
