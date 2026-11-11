# Retomar em outro computador ou chat

Atualizado em **11/11/2026**. Leia também [RETOMADA.md](RETOMADA.md) para o estado
do produto e [CONTEXTO_PARA_IA.md](../CONTEXTO_PARA_IA.md) para a explicação pública.
Este documento organiza a passagem; não inaugura outro checkpoint.

## Onde paramos

- O teste do fluxo chat → GitHub → site foi concluído: pequeno destaque visual
  no menu, PR #4 publicado e conferido no Edge.
- O PR #5 publicou o guia para IA/equipe/professor, atualizou as entradas de
  leitura, retirou os oito arquivos aprovados e redirecionou a demo antiga para
  Stripe. As duas experiências atuais, Stripe e Aurora, estão preservadas.
- A continuidade incorporou essas mudanças em `db9d238`; os commits seguintes
  desta passagem atualizam a documentação de migração. Conferir a ponta remota,
  sem voltar automaticamente ao commit citado.
- A publicação permanece em `f2a765913a75cb158055a2c81692dc9cae53b391`.
  Em 11/11, o PR #3 continuava aberto como rascunho, separado da publicação.
- Não há alteração funcional em andamento para terminar. Depois de conferir a
  retomada, escolher com o responsável o próximo incremento ou teste humano do
  fluxo Stripe. Validação externa/comercial continua pendente.

## Preparar uma cópia nova

Para abrir as páginas prontas, bastam Git e Python. O adaptador requer Python
**3.12 ou posterior**; não é necessário instalar Node, bancos, serviços de IA
ou dependências do laboratório para este primeiro teste.

Use uma pasta de destino que ainda não exista:

```sh
git clone -c core.autocrlf=false --branch codex/continuidade-20261109 https://github.com/ASCCJR/asccjr.github.io.git EvidentGraph
cd EvidentGraph
git status --short --branch
python3 evidence-graph/tools/verify_resume.py
```

No Windows, use `python` ou `py -3` se esse for o Python instalado. Confirme a
versão antes dos testes. `core.autocrlf=false` preserva os bytes dos arquivos
verificados por hash. Um clone padrão da `main` abre o site, mas não traz todo
o laboratório nem estas instruções de continuidade.

Se houver clone/arquivos no destino, examine-os primeiro: não use `reset --hard`,
`clean`, sobrescrita ou troca forçada de branch. O repositório público pode ser
clonado sem login; configurar autenticação somente quando for enviar alterações.

Escolha um ambiente coerente: Git/Python do Windows com caminhos Windows, ou
Git/Python do WSL com caminhos Linux. Crie um clone independente no WSL; não copie
worktrees do computador antigo, cujo arquivo `.git` aponta para caminhos locais.
Ambientes virtuais, navegadores de teste, caches e credenciais não são portáveis.

## Conferir o funcionamento básico

Na raiz do clone:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765/evidence-graph/`: deve encaminhar para Stripe.
Confira Inventário, troca para Grupo Aurora, mapa e a entrada direta
`http://127.0.0.1:8765/evidence-graph/preview-m2/`. Pare o servidor ao terminar.

Os testes curtos do adaptador são:

```sh
cd evidence-graph/core/contract-case
python3 -m unittest -v test_case test_consumer_demo
```

O verificador confere 45 ativos e documentos essenciais. Ele não executa os
testes funcionais nem verifica publicação remota. PASS sem contexto privado
significa apenas que o clone público está íntegro. As suítes históricas L7 e
Playwright mantêm requisitos próprios; não foram integralmente reexecutadas
para esta passagem.

## Recuperar o contexto privado

Na conexão Google Drive, abra a pasta privada `EvidentGraph` do responsável e
leia **`00_COMECE_AQUI.txt`**, depois **`RETOMADA_ATUAL_20261111.md`**. Esses
arquivos atualizam a memória original sem apagar sua proveniência. Leia também
a memória integral e o contexto CTE-IA em `Contexto e fontes`.

Há dois retratos complementares:

| Material privado | Uso |
| --- | --- |
| `EvidentGraph_Migracao_20261109.zip` e `.sha256` | Fontes privadas completas e restaurador; o código interno é o retrato antigo `936658e` |
| `EvidentGraph_Complemento_20261111.zip` e `.sha256` | Retomada atual, registros locais de 10/11 e bundle público atualizado para recuperação offline |
| `INDICE_ARQUIVOS_DRIVE.json` | Índice histórico dos documentos do primeiro retrato |
| `INDICE_COMPLEMENTO_20261111.json` | Arquivos e verificação do complemento atual |

Prefira o clone atual do GitHub para trabalhar. Para obter todas as fontes,
confira o SHA-256 do ZIP integral, extraia-o numa pasta privada e execute seu
`restaurar.py --destino PASTA_NOVA` com Git/Python no mesmo ambiente. Ele recusa
um destino existente. O clone criado por esse restaurador é histórico; não o
confunda com a ponta atual. Use as pastas privadas restauradas junto do clone
atual, configurando nele:

```sh
git config --local evidentgraph.privateContext "CAMINHO_LOCAL/transferencia-integral-20261019"
python3 evidence-graph/tools/verify_resume.py --require-private
```

Substitua o caminho pelo local real no computador novo. Não publique esse valor.
O complemento inclui instruções para clonar seu bundle offline, se necessário.
Extraia-o separadamente; scripts de preparação arquivados são registros de
execuções anteriores, não instaladores nem patches para reaplicar.

Sem acesso ao Drive, informe a lacuna. É possível explicar e executar o projeto
público; não invente memória privada, papéis da equipe ou andamento de inscrições.
Nenhum login ou caminho deste computador é necessário para a leitura pública.

## Histórico, limpeza e próximos passos

O Git estava limpo nas três cópias locais auditadas, sem alterações de código
pendentes de envio e sem caches/temporários encontrados entre os arquivos
versionados. As cópias auxiliares usadas nos PRs #4/#5 não são necessárias no
novo PC. Seus registros úteis ficam no complemento privado.

Os checkpoints, contratos, licenças, dados de demonstração e cópias consumidas
pelos geradores continuam úteis; não são lixo por serem antigos ou repetidos.
Planos em documentos históricos não são pendências atuais. O ponto de entrada
do Drive de 09/11 foi substituído; o backup e a memória de origem permanecem
identificados como retratos históricos. Não há nova exclusão nesta passagem.

A sequência do próximo chat é: ler as entradas atuais, conferir Git e fontes
disponíveis, testar o clone e informar onde parou. Depois continuar o trabalho
escolhido com o responsável, sem pedir o chat anterior. Merge, publicação,
push para `main`, exclusões, gastos, contatos e inscrições continuam exigindo
aprovação específica. A migração não autoriza reaplicar L7 ou reiniciar projeto.
