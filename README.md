# Coleta de dados genérica: TCLE → questionário → Google Planilhas

Generalização do fluxo usado no estudo Collab2Us (`../TAM-SUS-DataFeedback_COLAB2US`).
Cada pesquisa é **uma pasta com um `config.js`**; o motor (`engine/`) monta a página
de TCLE, o questionário e o envio. Um único Apps Script grava todas as pesquisas
na mesma planilha, **uma aba por pesquisa**.

```
engine/questionario.js   motor (não precisa mexer)
engine/style.css         visual
apps-script/Code.gs      recebe as respostas e grava na planilha (instalar 1 vez)
estudos/exemplo/         modelo: index.html + config.js
admin/index.html         painel: quantas respostas cada pesquisa recebeu
```

## Criar uma nova pesquisa

1. Copie `estudos/exemplo` para `estudos/<nome-da-pesquisa>`.
2. Edite `config.js`: `id` (nome da aba na planilha), textos do TCLE e perguntas.
3. Cole em `envioUrl` a URL `/exec` do Apps Script (veja `apps-script/README.md`; a mesma URL serve para todas as pesquisas).
4. Publique (ex.: GitHub Pages) e mande o link aos participantes:
   `https://<usuario>.github.io/<repo>/estudos/<nome-da-pesquisa>/`
   Para já preencher o código do participante: `.../?codigo=A01`.

Teste local:

```bash
python3 -m http.server 8765
```

Depois abra http://localhost:8765/estudos/exemplo/. Com `envioUrl` vazia, nada é enviado:
a página mostra "Modo de teste" e o pacote aparece no console do navegador.

## Painel admin

Com o servidor local rodando, abra http://localhost:8765/admin/ e digite a senha do painel
(configuração da senha em `apps-script/README.md`). Mostra, para cada pesquisa (aba da planilha):
total de respostas, respostas de hoje, última resposta, códigos distintos, duração mediana,
gráfico dos últimos 14 dias e uma meta opcional (ex.: 30 alunos) com barra de progresso.
Atualiza sozinho a cada 60 s. Uma pesquisa aparece no painel a partir da primeira resposta.

As pesquisas ficam em duas abas, **Abertas** e **Fechadas**. O botão **Fechar pesquisa** faz a
página daquela pesquisa mostrar "Esta pesquisa está encerrada" e o Apps Script recusar novos envios;
nenhuma resposta é apagada. **Reabrir pesquisa** desfaz. A mensagem de encerramento pode ser
trocada no `config.js` com `encerrada: { titulo, mensagem }`.

## Formato do `config.js`

| Campo | O que é |
|---|---|
| `id` | Identificador da pesquisa e nome da aba na planilha. Não mude durante a coleta. |
| `envioUrl` | URL `/exec` do Apps Script. Vazia = modo de teste. |
| `marca`, `titulo`, `subtitulo`, `rodape`, `contato` | Textos da página (aceitam HTML simples). |
| `participante` | `{ pedir, rotulo, ajuda, obrigatorio }`. `pedir: false` = sem código. |
| `tcle` | `{ versao, titulo, resumo, info[], secoes[{titulo, paragrafos[]}], aceite, autorizacoes[], recusa }`. `tcle: null` = sem termo. |
| `partes` | Lista de `{ rotulo, titulo, intro, questoes[] }`. |
| `conclusao` | `{ titulo, mensagem }` da tela final. |
| `encerrada` | `{ titulo, mensagem }` mostrados quando a pesquisa é fechada no painel (opcional). |
| `numerar` | `false` para esconder a numeração das perguntas. |
| `confirmarAbertasEmBranco` | `false` para não perguntar "enviar com abertas em branco?". |

### Tipos de pergunta

Toda pergunta tem `id` (vira a coluna da planilha), `tipo` e `texto`. Opcionais: `ajuda`, `obrigatoria`, `mostrarSe`.

| `tipo` | Campos extras | Valor gravado |
|---|---|---|
| `likert` | `escala`: `"concordancia5"`, `"concordancia7"`, `"frequencia5"`, `"satisfacao5"`, `"dificuldade5"`, `"importancia5"`, `"conhecimento5"`, uma lista de rótulos, ou `{de:0, ate:10, min:"…", max:"…"}` | número (1…n ou de…ate) |
| `unica` | `opcoes: [...]`, `outro: true` ou `"Outro:"` | texto da opção (+ coluna `<id>_outro`) |
| `multipla` | `opcoes`, `outro`, `max` | opções separadas por `; ` |
| `lista` | `opcoes` (menu suspenso) | texto da opção |
| `texto` / `textoLongo` | `placeholder`, `linhas` | texto |
| `numero` | `min`, `max`, `passo` | número |
| `data`, `email` | — | texto |
| `secao` | `texto`, `nota` (só um subtítulo, sem resposta) | — |

Opções podem ser textos (`"Sim"`) ou objetos (`{ valor: "1", texto: "Sim, sempre" }`) quando o valor
gravado deve ser diferente do texto exibido.

**Obrigatoriedade padrão:** fechadas (`likert`, `unica`, `multipla`, `lista`) são obrigatórias;
abertas e `numero` são opcionais. Mude com `obrigatoria: true/false`.

**Condicional:** `mostrarSe: { id: "trabalha", igual: "Sim" }` (também aceita lista em `igual`,
`contem: "X"` para múltipla escolha e `preenchida: true`). Perguntas ocultas vão em branco.

## Colunas da planilha

`resposta_id, enviado_em, iniciado_em, duracao_min, participante, tcle_versao, tcle_aceite_em, tcle_<autorização>…`
seguidas das perguntas, na ordem do `config.js`. Se você acrescentar uma pergunta no meio da
coleta, a coluna nova é adicionada ao final da aba sem apagar nada. Reenvios da mesma resposta não duplicam linhas.

## Comportamento para o participante

- O aceite do TCLE e as respostas ficam salvas no navegador: se fechar a aba, continua de onde parou.
- Depois do envio com sucesso, o navegador é limpo (o próximo aluno no mesmo computador começa do zero).
- Se o envio falhar, aparece "Tentar enviar novamente"; nada é perdido.
- O termo pode ser salvo em PDF pelo link no final do TCLE.
