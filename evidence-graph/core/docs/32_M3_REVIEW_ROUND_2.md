# M3 — segunda rodada de clareza, leitura e navegação

**22/10/2026. Rodada publicada e conferida em HTTPS; reteste pendente.**

**Continuação local:** a reavaliação automatizada foi recebida posteriormente;
seu resultado e a rodada seguinte estão no [documento 33](./33_M3_REVIEW_AND_PUBLIC_CASE.md).
O reteste por pessoas continua pendente. Os registros abaixo preservam o escopo
e o estado da publicação a147eaf no seu encerramento.

O proponente autorizou correções após os retornos internos e uma avaliação de
interface por IA com capturas e reproduções. As fontes e identidades ficam na
área privada. Após a conferência local, o proponente autorizou atualizar o site público.
A publicação foi concluída; o novo teste com pessoas e a reavaliação pela IA
ainda não ocorreram.

## Comportamento

- A entrada continua pelo grafo, concentrada nos caminhos da mudança selecionada.
  Em CHG-001 são seis ativos e cinco relações: os quatro consumidores e a
  ferramenta intermediária, além da API. Contexto do ativo e empresa inteira
  continuam disponíveis, com os 240 ativos/512 relações preservados.
- O mapa abre em escala de leitura. Zoom, **Leitura** e **Ajustar tudo** ficam
  acima da área do desenho. Ajustar tudo oferece visão geral; Leitura mantém
  nomes em escala normal e focaliza o ativo. Colunas vazias deixam de ocupar
  espaço. Nomes quebram em duas linhas pela largura medida, com nome completo
  preservado no detalhe e no nome acessível.
- Textos secundários e categorias têm contraste reforçado. O seletor se adapta
  à largura estreita. A identificação inicial informa dados fictícios;
  Produção permanece como atributo dos ativos, sem representar operação real.
- A lista explica o vínculo direto e, nos caminhos preparados, o percurso
  indireto registrado. As ações laterais têm identificação de investigação.
  A legenda de conclusões fica disponível sob demanda.
- **Explorar dependências** corresponde ao destino compartilhado entre grafo e
  lista. **Focar ativo da mudança** descreve a centralização, sem sugerir retorno
  à análise. Campos bruto e tratado têm nomes distintos no grafo, lista, detalhe,
  nome acessível e exportação; seus identificadores canônicos não mudaram.
- Seção, mudança, seleção e filtros são representados em parâmetros `eg_` da URL.
  Abrir uma cópia, recarregar e usar Voltar/Avançar restaura a vista. Uma mudança
  apenas selecionada continua pendente até abrir a análise. O botão de copiar
  link compartilha a vista; anotações e marcações locais não entram na URL.
  Diálogos transitórios e zoom/arrasto manuais não são persistidos pelo link.
- O painel oferece botões para examinar evidências das relações, inclusive por
  Tab/Enter e Escape no percurso examinado. Foco por teclado acompanha o nó;
  clique de ponteiro não move o alvo durante a ativação.

As explicações do contrato de pedidos, os responsáveis, os filtros sob demanda e
as distinções de indício, inferência e resultado foram preservados. UNKNOWN não
vira segurança. Não há novo modelo, integração de IA ou alteração dos dados.

## Verificação

- 13 testes puros de exploração e 19 cenários de interação em DOM passaram.
  Os de DOM usam substitutos explícitos para diálogo e ResizeObserver e não
  renderizam layout.
- 20 testes Python de compatibilidade do gerador passaram com Python 3.12 e as
  dependências fixadas em `lab-runtime/requirements.txt`. Isso não reexecuta a
  validação HTTP histórica da L7.
- 16 cenários focados em Chromium real por HTTP local passaram: oito regressões
  da rodada anterior e oito percursos da nova rodada. Os novos verificam link
  em outro contexto sem notas, histórico e estado pendente, investigação e
  alcance, inventário/filtros/página, campos e exportação, leitura/contraste e
  larguras, evidência de relação por teclado e parâmetros inválidos/cópia.
- Não houve erro de página ou recurso nas execuções finais. O navegador usa o
  runtime privado já preservado, com sandbox habilitado; não houve instalação
  privilegiada. As repetições de desenvolvimento não aumentam esses totais.
- Foram examinadas capturas reais de mapa, lista e campos. Há amostras em 1440,
  1366, 390 e 320 CSS px. Sem excesso horizontal do documento nessas amostras;
  em telas estreitas o grafo requer arrasto e a lista tem rolagem interna. Não
  declarar usabilidade móvel completa ou conformidade WCAG integral.

Os testes não demonstram melhora percebida, tempo poupado ou benefício comercial.
Os resultados L7 de 249 Python/36 HTTP continuam históricos e separados. Notas de
pessoas, fontes, logs e capturas desta rodada ficam na área privada apontada pela
configuração local; não incluir caminhos privados no Git público.

## Entrega

Cinco arquivos existentes de `preview-m2/` foram publicados em `main` no commit
[`a147eaf`](https://github.com/evidentgraph/evidentgraph.github.io/commit/a147eaf8a0f89758fce84760c1a6495214bd9f77),
com pai `f29ac5d`: `index.html`, `app.js`, `lineage.js`, `investigation.js` e
`investigation.css`. Não houve merge do PR #3, que continua aberto como draft;
o checkout de trabalho e seu índice foram preservados.

Pages concluiu esse build. Dez recursos públicos coincidem por SHA-256 com os
arquivos locais testados; os mesmos 16 cenários passaram também por HTTPS,
sem erro de página ou recurso. São repetições do recorte local, não mais 16 casos
distintos. Quatro capturas públicas de mapa, lista e campos foram inspecionadas.

[Versão para o novo teste](https://evidentgraph.github.io/evidence-graph/preview-m2/?review=a147eaf).
O parâmetro identifica a revisão e não fixa recursos em commit imutável; uma
visita anterior pode exigir Ctrl+F5 para descartar arquivos em cache.
Documentação e teste DOM permanecem no checkout local, sem novo envio deles.

Foram preparados textos privados para o responsável encaminhar aos revisores e
à IA. Não houve mensagem enviada, novo retorno de participantes ou nova avaliação
externa. O teste com pessoas começa pela primeira impressão e depois por tarefas
curtas, preservando o relato literal.
