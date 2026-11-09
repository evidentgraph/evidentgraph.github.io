# Consumidor simulado sobre o caso público da Stripe

**22/10/2026. Implementado e verificado localmente; visualização posteriormente
publicada em 64fa503.** Ver [35](./35_PUBLIC_UI_AND_STRIPE_CASE.md) para os arquivos
publicados, o endereço e a verificação HTTPS. O adaptador e os testes têm alterações
locais; a publicação não altera os resultados do exemplo registrados abaixo.

O proponente autorizou continuar com a demonstração proposta após o incremento
[33](./33_M3_REVIEW_AND_PUBLIC_CASE.md). A tarefa escolhida é preservar a referência
da assinatura ao ler os campos de uma fatura. Ela cria uma consequência concreta
para investigar, sem inventar um consumidor real, cliente, incidente ou perda
financeira. Não reabre L7 nem altera a pesquisa de inferência anterior.

## Comportamento observado

Há dois leitores pequenos em Python, próprios do exemplo. O antigo procura
`subscription` e transforma ausência/nulo em “sem assinatura”. O adaptado conhece
apenas `2025-03-31.basil`: verifica `parent`, seu `type` e a referência em
`parent.subscription_details.subscription`. Tipos, versões ou informações fora
do escopo pedem revisão. Referências por ID e por objeto expandido são exercitadas.

Com os dois recortes que contêm assinatura, o leitor antigo funciona no formato
anterior e perde a associação no posterior, **sem lançar exceção**. O adaptado
preserva a referência esperada. Essa expectativa foi escrita para a tarefa;
não é inferida automaticamente pelo contrato ou por IA.

O antigo também já confunde um campo opcional omitido com ausência de assinatura
antes da migração. O relatório expõe essa limitação prévia; não atribui todas as
divergências à mudança de API. O adaptado pede revisão para entrada omitida,
detalhes nulos, referência ausente/malformada ou tipo desconhecido.

| Código / formato do contrato | Execuções | Conferem com a expectativa | Divergem | Exceções |
|---|---:|---:|---:|---:|
| Antigo / Acacia | 5 | 4 | 1 | 0 |
| Antigo / Basil | 9 | 2 | 7 | 0 |
| Adaptado / Basil | 9 | 9 | 0 | 0 |

São 23 registros de execução em **nove cenários preparados**, dos quais quatro
são de robustez somente no formato posterior. Não são amostras independentes,
taxa de acurácia representativa ou validação de migração. Algumas expectativas
corretas são pedir revisão, não decidir que uma integração é segura.

## Proveniência e experiência

O modo documental permanece padrão. `--with-consumer-demo` acrescenta o exemplo
ao [adaptador](../contract-case/README.md), com código e recortes fixos; não
executa código fornecido pelo usuário. O sinalizador exige o par de versões,
operação e formatos de campos esperados. Os JSON públicos preservados têm seus
hashes conferidos. Os recortes são fictícios e parciais, não respostas completas
da API; conferimos somente os tipos/condições usados neste exemplo.

A análise apresenta os cartões de antes/depois e um seletor de cenário; entradas,
expectativas, saídas e exceções podem ser examinadas. Resultados completos, código
e recortes estão disponíveis para download. O navegador mostra registros de uma
execução local anterior, sem reexecutar o teste ao trocar cartões.

Grafo e lista mostram quatro ativos documentais e dois leitores simulados.
`CONTAINS` continua estrutural; `DEMO_READS` declara a leitura feita pelo código
do exemplo. A relação nova só existe no adaptador gerado, sem mudar o contrato
M1, parser, coletores ou classificação da L7. Não é telemetria e não estabelece
uma cadeia operacional entre ambientes. Detalhes e relatórios preservam essa
distinção. O conjunto combinado indica que contém material sintético; cada leitor
e sua evidência também têm identificação própria. Aurora 240/512 segue separado.

Consumidores reais continuam **UNKNOWN** e sua execução **NOT_VERIFIED**.
Nenhuma conta, SDK, chamada à Stripe, credencial, banco ou pagamento foi usado.
Os originais do contrato, licença e saídas anteriores não foram sobrescritos.

## Verificação

- 18 testes Python passaram: oito regressões do adaptador e dez do incremento.
  Incluem alteração de entrada que muda a saída, nulidade/ausência, versão fora
  do escopo, entrada incompatível, hashes e preservação dos resultados reais
  como desconhecidos.
- Oito percursos anteriores de navegador passaram com uma nova saída documental,
  mantendo seu escopo de quatro ativos e duas relações.
- Seis novos percursos em Chromium real, com sandbox, passaram: rótulos de
  origem, nove exemplos, compartilhamento de evidência, exportação/download,
  grafo/lista e Aurora separado, larguras de 320 e 390 px. Nenhum erro de página,
  recurso ou requisição externa apareceu na rodada final.
- Capturas de comparação, revisão necessária, grafo e celular foram inspecionadas.
  O layout dispõe contratos, campos e leitores por versão, sem linhas cruzando
  os cartões intermediários. A captura alta de uma seção incluiu o link fixo
  de acessibilidade fora da área visível; a inspeção da janela confirmou que
  permanece fora da tela quando não tem foco.

A primeira rodada de navegador encontrou inicialização da extensão antes do
aviso de contexto e ausência de explicação no painel de um leitor sem resultado
M1. A extensão passou a aguardar a inicialização e incluir uma explicação própria
da simulação. A rodada seguinte passou; a tentativa inicial permanece preservada.
As repetições não ampliam os números acima. Os 23 registros do exemplo não se
somam aos testes do software nem aos resultados históricos da L7.

## Implicação para produto e próximo limite

O incremento demonstra uma forma de investigar a pergunta “o que muda para quem
usa este campo?” e torna inspecionável a diferença entre execução sem exceção e
resultado adequado à tarefa. Ainda falta saber se a experiência ajuda uma pessoa
real a tomar a decisão, comparada à documentação e aos testes que ela já usa.
Código, expectativas e exemplos têm a mesma autoria; não há holdout independente,
vantagem competitiva, demanda comercial ou benefício de IA demonstrados.

A próxima revisão humana pode pedir três respostas sem ajuda: qual associação
foi perdida, qual evidência sustenta isso e em quais casos o sistema pede revisão.
Medir compreensão e utilidade antes de ampliar cenários ou adicionar IA. Quando
houver acesso autorizado a uma integração real, repetir a conferência com suas
expectativas, dados permitidos e responsável. Contatos e publicação continuam
sujeitos à decisão específica do proponente.
