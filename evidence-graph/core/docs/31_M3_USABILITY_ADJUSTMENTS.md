# M3 — ajuste local de clareza e navegação

**20/10/2026. Cinco arquivos da interface publicados após autorização específica.**

Publicação em [`f29ac5d`](https://github.com/evidentgraph/evidentgraph.github.io/commit/f29ac5d536cac612d1f1f8605e00d356f266c230).
Este documento e o teste DOM continuam locais no checkout da feature.

O proponente autorizou uma rodada delimitada após dois retornos internos com
roteiro. Ambos relataram dificuldade para se orientar entre as informações. Um
retorno apontou análise já aberta sem sinal claro, dificuldade de compreender a
incompatibilidade e de voltar do grafo para a lista. Os textos e identidades dos
participantes permanecem privados. Esses relatos não são validação de mercado,
medição de produtividade ou avaliação independente de IA.

## Alterações

- Estado persistente de análise já aberta; confirmação ao clicar novamente sem
  apagar busca e filtros. Outra mudança selecionada continua pendente até abrir.
- **Lista de conexões** e **Lista da análise** com destinos explícitos. A ida da
  análise ao grafo mostra os caminhos da mudança; a volta conserva a seleção de
  cenário e os filtros. Reentrar no grafo não deixa a lista de conexões visível.
- Inicialização idempotente das extensões de grafo/investigação, mesmo quando
  chegam depois do evento de prontidão do core. Controles começam desabilitados
  até seus ouvintes estarem conectados.
- Explicação do consumidor na tabela, nos detalhes e no painel do grafo. A frase
  sobre um campo exigido requer o contrato correspondente entre as evidências do
  consumidor; não atribui falha observada em execução.
- Relação direta descrita na lista de conexões com o sentido e o tipo do vínculo.
  Relações indiretas e processos compartilhados mantêm seus limites.
- Filtros adicionais e metadados de versão/período sob demanda; indicadores mais
  compactos e destaque dos caminhos selecionados.
- Quebra de linha nos botões de investigação para o texto caber no painel lateral;
  o excesso de largura encontrado na inspeção de 1366 px foi corrigido.

O modelo, os resultados preparados, as 240 entidades/512 relações e os três
cenários do Grupo Aurora permanecem iguais. UNKNOWN continua inconclusivo.
Evidências, caminhos, notas e exportações continuam acessíveis. Não há IA nova.

## Verificação e limites

- 43 testes do modelo M1 e 13 testes puros de exploração passaram.
- 13 cenários de interação por DOM passaram com Node 22.23.2 e jsdom 26.1.0:
  extensões tardias, inicialização única, ida/volta, preservação de filtros,
  estado inicial/pendente, relação explícita, explicação do contrato e UNKNOWN,
  ausência de garantia de segurança, catálogo completo e filtros adicionais.
- 20 testes de compatibilidade do gerador L7 passaram no ambiente Python já
  existente. Verificam geração, integridade e limites; não constituem nova
  execução dos testes HTTP ou revalidação integral da L7.
- Um controle com os fontes anteriores falhou na alternância ao carregar a
  investigação depois de `eg:ready`; os fontes ajustados passaram. É reprodução
  controlada em DOM, sem comprovar a causa da sessão relatada pelo participante.
- O primeiro lançamento local parou por `libnspr4.so` ausente. A conferência
  completa identificou também NSS e ALSA ausentes. Três pacotes oficiais Ubuntu
  (`libnspr4`, `libnss3`, `libasound2t64`) tiveram seus SHA-256 conferidos contra os
  metadados do APT e foram extraídos em um runtime privado fora do clone. As
  bibliotecas são fornecidas apenas ao processo de teste, sem instalação no
  sistema, privilégios ou mudança de política.
- O runtime separado usa Node 22.23.2, Playwright 1.63.0 e Chromium headless shell
  153.0.8010.12, revisão 1243, em WSL Ubuntu 26.04.1. O lançamento mantém
  `chromiumSandbox: true`, sem `--no-sandbox`; o processo renderer registrou UID
  1000, namespace próprio, `NoNewPrivs: 1` e `Seccomp: 2`. Isso verifica capacidade
  de execução, sem constituir auditoria de segurança. A documentação atual do
  [Playwright](https://playwright.dev/docs/intro#system-requirements) inclui
  Ubuntu 26.04; o ambiente histórico da L7 permanece separado.
- Oito cenários em navegador por HTTP local passaram: equivalência grafo/lista;
  análise aberta e filtros preservados na ida/volta; explicação e diálogo nativo;
  mudança pendente; UNKNOWN com notas após recarga e exportação real; carregamento
  tardio de cada uma das duas extensões; capturas e limites de largura da página.
  Nenhum erro JavaScript ou pedido de recurso falhou nessa execução.
- Capturas reais foram inspecionadas, incluindo análise, grafo e detalhes.
  As larguras 1920, 1366 e 390 px não apresentaram excesso de largura da página.
  Após a correção, o painel lateral também coube em sua largura. A segunda rodada
  repetiu os mesmos oito cenários após esse ajuste; não são 16 casos distintos.
- O servidor de prévia em loopback entregou oito recursos com HTTP 200 e bytes
  idênticos aos arquivos locais. Essa checagem de transporte não executa a UI.

Essas contagens não se somam às contagens históricas da L7. Os testes por DOM não
renderizam layout e usam substitutos explícitos para diálogo e ResizeObserver.
As verificações em Chromium acrescentam interação real, persistência após recarga
e inspeção de capturas; não cobrem outros navegadores ou uma auditoria completa
de acessibilidade. Em 390 px, a tabela mantém rolagem horizontal e o grafo ajustado
fica pequeno, exigindo zoom. Não se demonstrou legibilidade satisfatória de um
catálogo grande nem redução do esforço percebido; isso precisa de novo uso pelos
participantes. As capturas, logs e instrução de retomada do runtime ficam na área
privada indicada pela configuração local, sem dados de participantes no Git.

O teste `core/demo-ui/test_feedback.cjs` pode usar `EG_DOM_MODULE` para localizar
jsdom fora do clone; `EG_PREVIEW_ROOT` permite executar um controle contra outra
cópia dos fontes. Ver instruções em `preview-m2/README.md`.

## Publicação e novo teste

O proponente autorizou publicar os ajustes da tela de avaliação. Um commit com
pai no `main` publicado alterou somente `index.html`, `app.js`, `lineage.js`,
`investigation.js` e `investigation.css`, dentro de `preview-m2/`. O checkout da
feature e os demais trabalhos foram preservados. Não foi feito merge do PR #3.

O GitHub Pages concluiu a publicação do commit acima. Dez recursos no endereço
público foram recebidos com HTTP 200 e hashes esperados. Os mesmos oito cenários
foram executados em Chromium sobre HTTPS público e passaram, sem erro JavaScript
ou falha de recurso. Nove capturas públicas foram preservadas; análise, grafo e
detalhes em 1366 px foram abertos e inspecionados. Essa repetição não amplia a
população de casos nem as contagens históricas da L7.

Usar o [link para o novo teste](https://evidentgraph.github.io/evidence-graph/preview-m2/?review=f29ac5d).
O servidor mantém recursos em cache por até dez minutos; quem abriu a versão
anterior deve recarregar com `Ctrl+F5` antes do teste. O parâmetro do link identifica
a revisão solicitada, sem fixar os arquivos em um commit imutável.

Os dois revisores foram indicados para o novo teste pelo proponente. Seus novos
retornos sobre esta versão continuam pendentes; a publicação não comprova melhora
de compreensão. Nenhuma mensagem foi enviada aos participantes pelo assistente.

## Revisão local complementar

Servir `preview-m2/` em um servidor HTTP apenas em loopback. Conferir o caminho
análise → grafo → lista de conexões → lista da análise, depois abrir Serviço de
pedidos e ler a explicação do campo. A versão publicada é a dos cinco arquivos
listados acima; futuras publicações continuam sujeitas a autorização específica.
