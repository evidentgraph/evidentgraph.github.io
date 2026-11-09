# Revisão local de um campo removido de contrato

Este adaptador recebe dois contratos OpenAPI 3 JSON e uma descrição delimitada
do caso. Confere a presença do campo selecionado antes e sua ausência no mesmo
objeto depois; apresenta as fontes no grafo, lista, detalhes e exportação M3.
Consumidores continuam desconhecidos. Não executa a API, código de consumidores,
oasdiff ou uma previsão geral de impacto.

Essa descrição vale para o modo documental padrão. A opção explícita
`--with-consumer-demo` acrescenta a execução local do exemplo próprio descrito
abaixo; consumidores **reais** continuam desconhecidos.

O caso público preparado usa a [mudança de faturamento da Stripe em
2025-03-31.basil](https://docs.stripe.com/changelog/basil/2025-03-31/adds-new-parent-field-to-invoicing-objects).
Os contratos completos, licença e recebimento estão preservados na área privada
indicada pela configuração local de continuidade. O material público real não
é um piloto com clientes. Um estudo anterior executou oasdiff separadamente;
seu resultado não é reexecutado nem apresentado como resultado deste adaptador.

## Preparar a entrada

Criar um JSON externo ao repositório no formato abaixo. Valores entre sinais de
menor/maior são instruções de preenchimento, não fontes ou hashes existentes.
Os caminhos de arquivos são relativos ao JSON de entrada; também se aceitam
caminhos absolutos locais. As URLs são referências, nunca baixadas pelo builder.

```json
{
  "schema_version": "eg-contract-case/v1",
  "material_kind": "public_contracts",
  "title": "Revisão de um campo da resposta",
  "captured_at": "<data ISO 8601 com fuso da preservação>",
  "endpoint": "/v1/invoices/{invoice}",
  "method": "GET",
  "response_status": "200",
  "field": ["subscription"],
  "replacement_field": ["parent", "subscription_details", "subscription"],
  "documentation_url": "<URL HTTPS da orientação original>",
  "migration_note": "<orientação documental, com condições e limites>",
  "before": {"file": "before.json", "sha256": "<SHA-256>", "url": "<URL HTTPS fixada>"},
  "after": {"file": "after.json", "sha256": "<SHA-256>", "url": "<URL HTTPS fixada>"},
  "license": {"file": "LICENSE", "sha256": "<SHA-256>", "url": "<URL HTTPS da licença>"}
}
```

`replacement_field` pode ser omitido. Quando informado, sua presença também é
conferida no contrato posterior. Isso não infere equivalência entre campos:
a indicação e a orientação vêm do autor do caso e da documentação citada.
`license` preserva o aviso de licença fornecido; no caso Stripe, a licença MIT
dos contratos acompanha a visualização.

## Gerar e abrir

Python 3.12 ou posterior; sem dependências novas:

```sh
python3 evidence-graph/core/contract-case/build_case.py --case /caminho/case.json --out /caminho/nova-pasta
python3 -m http.server 8766 --bind 127.0.0.1 --directory /caminho/nova-pasta
```

Abrir a porta local no navegador. O seletor permite alternar o caso e o Grupo
Aurora. O builder recusa sobrescrever uma pasta existente. As cópias dos contratos,
o manifesto e `case-bundle.json` ficam na saída; nenhuma entrada ou arquivo de
`preview-m2/` é reescrito. Publicação requer uma decisão específica do proponente.

Na branch de continuidade de 09/11/2026, as saídas geradas incluem uma cópia
local de `brand/` e suas fontes/licenças. Assim podem ser servidas isoladamente
sem depender da pasta da máquina antiga. O caso já publicado é preservado como
registro, não é regenerado automaticamente na retomada.

## Interpretação

O mapa representa duas respostas versionadas e seus campos documentados. Cada
vínculo `CONTAINS` pertence ao respectivo contrato; não há ligação operacional
inventada entre versões. A lista mostra o mesmo recorte. Detalhes e evidências
têm links próprios, com a mesma origem da visualização. Fontes completas podem
ser baixadas localmente e conferidas pelo hash do manifesto.

Não há consumidores, equipes de integração ou telemetria neste conjunto.
`UNKNOWN` e `NOT_VERIFIED` continuam explícitos. Ausência do campo na declaração
do objeto não demonstra, sozinha, sua ausência em toda resposta de execução;
também não identifica os consumidores afetados. É necessário conhecer a versão
adotada pela integração, seu uso do campo e um teste pertinente.

## Limites da entrada

- Dois arquivos JSON de até 10 MiB cada, OpenAPI 3, resposta `application/json`.
- Caminho de propriedades explícitas de um objeto. Referências internas e
  `anyOf` com uma única alternativa são percorridos; composições ambíguas,
  ciclos no caminho e pais ausentes exigem revisão manual.
- Referências externas, JSON inválido/duplicado, hashes divergentes e um campo
  não removido são recusados. Nenhum endereço externo é resolvido.
- O hash verifica integridade da cópia, não autentica sua autoria. A classificação
  como material público é declarada na entrada e precisa ser sustentada pelas fontes.
- Esta entrada delimitada não é importador corporativo, coletor, interface de
  upload ou motor completo de comparação OpenAPI. O contrato M1 e a L7 não mudam.

## Verificação

```sh
cd evidence-graph/core/contract-case
python3 -m unittest -v test_case
```

Oito testes usam contratos mínimos fictícios para verificar recusas, hashes,
preservação da saída, separação das versões e ausência de consumidores inventados.
Os percursos reais de navegador estão em `../demo-ui/test_review_round3.cjs`;
fornecer `EG_PLAYWRIGHT_MODULE`, `EG_PREVIEW_URL`, `EG_CASE_URL` e uma pasta nova
externa em `EG_BROWSER_OUTPUT`. Usam sandbox habilitado e não instalam navegador.

## Consumidor simulado da Stripe

O incremento [34](../docs/34_SIMULATED_CONSUMER.md) demonstra uma tarefa pequena:
associar a fatura à assinatura indicada, preservando a diferença entre ausência
explícita e informação insuficiente. Código, recortes e expectativas são próprios,
preparados para demonstração; nenhum deles foi extraído de um cliente da Stripe.

```sh
python3 evidence-graph/core/contract-case/build_case.py --case /caminho/case.json --out /caminho/nova-demo --with-consumer-demo
python3 -m http.server 8767 --bind 127.0.0.1 --directory /caminho/nova-demo
```

O sinalizador executa somente `legacy_invoice` e `migrated_invoice` deste módulo,
em recortes fixos de `consumer_demo_cases.json`. Não carrega código da entrada,
não usa SDK, rede, conta, credencial, banco ou pagamento. Antes da execução,
confere hashes, o par Acacia/Basil e os tipos/condições dos campos selecionados
nos contratos preservados. Outros pares são recusados. Isso **não** valida
recortes como respostas completas do fornecedor.

`demo/result.json` registra cada entrada, expectativa, saída, exceção, versão e
data de execução. Código e recortes executados acompanham a saída e são fixados
por SHA-256. Para reproduzir, usar o projeto com esta revisão e o comando acima;
o arquivo de código baixado isoladamente não é um aplicativo. A execução nova
tem outro horário e hash; não sobrescrever a anterior.

O espaço combinado inclui seis ativos e quatro relações. Quatro ativos e duas
relações `CONTAINS` continuam documentais; os outros dois ativos são leitores
simulados. `DEMO_READS`, limitado a essa visualização gerada, declara qual campo
o código de cada leitor usa. Não representa uma chamada coletada, nem acrescenta
um consumidor real à análise M1. `results[].consumers` e cobertura real continuam
vazios/UNKNOWN. A lista, detalhes, links e exportação conservam essa distinção.

O navegador mostra resultados já executados; escolher outro cenário não roda
Python ou chama a Stripe. Os 23 registros correspondem a nove cenários preparados
(cinco com antes/depois e quatro de robustez somente depois), em até três
combinações de código/contrato. Não são 23 consumidores nem testes independentes.
As divergências do leitor antigo são o fenômeno demonstrado, não falhas da suíte.

```sh
cd evidence-graph/core/contract-case
python3 -m unittest -v test_case test_consumer_demo
```

Dezoito testes (oito anteriores e dez do incremento) verificam o adaptador,
abstenção, recusa de fontes/escopos divergentes, vínculo dos bytes e alterações
de entrada que mudam a saída. O navegador usa
`../demo-ui/test_consumer_demo.cjs` com `EG_PLAYWRIGHT_MODULE`, `EG_CASE_URL`
e uma nova pasta externa em `EG_BROWSER_OUTPUT`.

## Compartilhar o exemplo e retomar a comparação

Os links incluem `eg_example` com o identificador do cenário selecionado. Abrir
em outra aba, recarregar e usar Voltar/Avançar conserva essa seleção, inclusive
quando o link abre um detalhe ou uma evidência. Identificadores desconhecidos
mostram aviso e usam o exemplo padrão; Aurora e o modo documental não carregam
uma seleção de exemplo. Notas e verificações locais não entram no endereço.

“Ver comparação” leva ao título dos resultados simulados, ou aos contratos no
modo documental. Os detalhes do contrato posterior e do leitor adaptado oferecem
retorno à comparação existente, sem declarar consumidores reais. A seleção e a
navegação não executam novamente os leitores.

`../demo-ui/test_review_round4.cjs` verifica esses comportamentos, a análise em
320/390 pixels, nomes acessíveis, foco por teclado e identificação local de dados
fictícios. Requer `EG_PREVIEW_URL`, `EG_CASE_URL`, `EG_PLAYWRIGHT_MODULE` e uma nova
pasta em `EG_BROWSER_OUTPUT`; `EG_DOCUMENTARY_URL` opcional acrescenta a variante
sem consumidor. Não instala navegador nem publica arquivos. Ver documento 36
para resultados observados e limites da avaliação.
