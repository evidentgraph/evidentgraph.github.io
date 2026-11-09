# Correções consolidadas de navegação e compreensão

**23/10/2026, horário de Fortaleza.** Sete ajustes implementados, publicados
em `de1cab2f7fd6178653ab56a4bc357610b25fed01` e conferidos sobre HTTPS.

O proponente autorizou executar a fila consolidada após duas avaliações
automatizadas e já havia autorizado atualizar o site público. A alteração
continua a mesma experiência M3 e o caso Stripe. As avaliações tinham contexto
anterior; não constituem testes cegos nem uma nova rodada com participantes.

## Comportamento corrigido

| Item | Resultado |
| --- | --- |
| N1 | No celular, cada consumidor reúne problema, conclusão, responsável, verificação local e ações, sem exigir rolagem horizontal para encontrar o responsável ou abrir detalhes. A tabela permanece no desktop. |
| N2 | “Ver comparação” abre a análise, leva à comparação e posiciona o foco no título, inclusive quando a análise já estava aberta. No modo exclusivamente documental, leva à comparação dos contratos. |
| N3 | Os detalhes do contrato posterior e do leitor adaptado oferecem “Voltar à comparação CASE-001”, sem declarar inexistência da comparação nem inventar consumidores reais. |
| N4 | O contorno de foco do menu lateral tem contraste medido de 10,47:1 contra o fundo escuro, com percurso real por Tab. |
| N5 | Os nomes acessíveis dos controles preservam os textos visíveis “Caso Stripe” e “Consumidor”. |
| P1 | O link inclui o exemplo selecionado da Stripe; nova aba, recarga e Voltar/Avançar mantêm exemplo, resultados e detalhe compartilhado. Um identificador inválido mostra aviso e abre o exemplo padrão; Aurora e o modo documental eliminam esse parâmetro. |
| P2 | O detalhe compartilhado de Aurora identifica localmente “Dados fictícios da demonstração”. Evidências com origem `synthetic://` dizem “Uso observado neste cenário fictício”. Contratos públicos e leitores simulados mantêm suas próprias identificações. |

O endereço usa `eg_example` apenas para um identificador existente nos resultados
simulados. Notas e verificações locais não entram no link. Trocar o exemplo
continua mostrando registros anteriores, sem executar código ou chamar a Stripe.

## Verificação local

Passaram **23 cenários de navegador**: oito da revisão anterior, seis do consumidor
simulado e nove da nova suíte `core/demo-ui/test_review_round4.cjs`. Foram usados
Chromium 153.0.8010.12, sandbox habilitado e HTTP local, com contextos novos,
teclado e larguras de 320, 390 e 1440 pixels. Os resultados finais não registraram
erros de página ou recursos nem requisições fora da origem.

Uma asserção inicial exigia que o título do modo documental chegasse ao topo,
embora a página curta já tivesse atingido o fim da rolagem. A medição confirmou
o foco e o título totalmente visível. A asserção foi corrigida para aceitar o
limite físico da página, mantendo as exigências de foco, rolagem e visibilidade.
Não houve alteração do produto para esse caso; a primeira falha foi preservada.

Capturas reais de celular, foco do menu, destino da comparação e detalhe
compartilhado foram abertas e examinadas. Isso não certifica toda a acessibilidade
nem mede a compreensão de uma pessoa.

O caso foi regenerado com as mesmas fontes e recortes. Os 23 registros de
execução conservam entradas, saídas e expectativas; apenas a data da nova execução
e seus hashes derivados mudam. Não são novos casos independentes. A variante
documental sem consumidor foi verificada localmente e não é publicada.

## Publicação e continuidade

O commit avança normalmente de `64fa503`, com cinco arquivos da prévia e doze
do caso estático. Os 34 recursos da publicação incluem os arquivos de apoio
inalterados. Fontes públicas, licença e recortes próprios continuam disponíveis;
o manifesto conserva hashes, versões de cache e instruções de reprodução.

- [Interface Aurora](https://asccjr.github.io/evidence-graph/preview-m2/?review=de1cab2).
- [Caso Stripe](https://asccjr.github.io/evidence-graph/caso-stripe/?review=de1cab2&source=case&eg_view=analysis&eg_change=CASE-001&eg_scope=all&eg_technical=1).
- [Commit publicado](https://github.com/ASCCJR/asccjr.github.io/commit/de1cab2f7fd6178653ab56a4bc357610b25fed01).

O parâmetro `review` identifica a rodada, sem fixar uma versão imutável. Os arquivos
JS/CSS referenciados usam hashes para renovar o cache. O checkout da feature,
seu HEAD e índice foram preservados. Adaptador, testes e documentação complementar
continuam locais; somente os 17 arquivos estáticos alterados integram este commit.
Relatórios recebidos, logs, capturas e registros de retomada ficam privados.

GitHub Pages concluiu o build desse commit às 04:17:09 UTC. Os **34 recursos
públicos** responderam com os mesmos bytes da preparação. Passaram **19 cenários
de navegador em HTTPS**: cinco da interface, seis do consumidor simulado e oito
dos ajustes. Repetem o recorte local; os quatro cenários exclusivamente documentais
ficam fora desta publicação. Não somar 19 e 23 como testes distintos. Não houve
erro de página ou recurso; as duas suítes que observam requisições externas não
registraram nenhuma. Capturas públicas do consumidor no celular e do exemplo
compartilhado foram abertas e examinadas.

Retomar pelo item 36 de `RETOMADA.txt`, na pasta indicada pela configuração local
`evidentgraph.privateContext`. O registro distingue histórico recebido, correções
implementadas e verificação efetiva da publicação.

Consumidores reais permanecem UNKNOWN e execução real NOT_VERIFIED. Aurora
conserva 240 ativos e 512 relações. PR #3 permanece aberto como rascunho e não foi
mesclado; a L7 e suas contagens históricas não mudam. Reteste por participantes
e validação comercial continuam pendentes. Nenhuma mensagem foi enviada a terceiros.
