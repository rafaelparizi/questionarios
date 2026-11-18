# Envio das respostas para o Google Planilhas (Apps Script)

Todas as pesquisas (todas as pastas em `estudos/`) enviam para UM Apps Script na sua conta Google. Cada pesquisa vira uma aba (nome = `id` do config.js) na planilha "Questionários · respostas".
Por padrão não envia e-mail (`ENVIAR_EMAIL = false` no topo do script); com `true`, manda um aviso com CSV
para a conta que publicou o script. O endereço não aparece no código público da página.

## Instalação

1. Acesse https://script.google.com e clique em **Novo projeto**.
   (Também funciona abrindo **Extensões → Apps Script** a partir de uma planilha.)
2. Apague o conteúdo de `Código.gs`, cole o conteúdo de [`Code.gs`](Code.gs) e salve (Ctrl/Cmd + S).
3. Na barra superior, escolha a função **`testarEnvio`** e clique em **Executar**.
   - Em "Autorização necessária", clique em **Revisar permissões** e escolha sua conta.
   - Se aparecer "O Google não verificou este app", clique em **Avançado → Acessar … (não seguro)**.
     O app é seu; o aviso aparece para todo script pessoal.
   - Confira o **Registro de execução**: deve terminar com `Tudo certo. Planilha: …`.
   - Abra a planilha pelo link e apague a aba `TESTE`.
4. Clique em **Implantar → Nova implantação**, na engrenagem escolha **App da Web** e defina:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa** (não "Qualquer pessoa com Conta do Google")
5. Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
6. Abra essa URL no navegador: deve aparecer `{"ok":true, …}` com o link da planilha.
   Cole essa URL em `envioUrl` no `config.js` de cada pesquisa.

Se alterar o código depois: **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**.
Salvar o código não basta; a URL `/exec` continua usando a versão implantada.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Erro no registro ao rodar `testarEnvio` | Leia a mensagem no registro de execução |
| Abrir a URL `/exec` pede login | Acesso definido como "Qualquer pessoa com Conta do Google"; troque para "Qualquer pessoa" |
| A página mostra "Não foi possível enviar" | Implantação antiga (publique uma nova versão) ou URL errada (use a que termina em `/exec`, não `/dev`) |

Se o envio falhar, a página mostra "Tentar enviar novamente"; as respostas ficam salvas no navegador até o envio dar certo.
Para aceitar só ids conhecidos, preencha `ESTUDOS_PERMITIDOS` no topo do script.
A URL `/exec` aceita envios de qualquer pessoa que a conheça; uma linha estranha na planilha pode ser apagada.

## Painel admin (quantas respostas por pesquisa)

O painel `admin/index.html` pede ao script um resumo de cada aba (total, hoje, última resposta,
códigos distintos, duração mediana, respostas por dia). Ele só funciona com senha:

1. No Apps Script, abra **Configurações do projeto** (engrenagem à esquerda) → **Propriedades do script** →
   **Adicionar propriedade**: nome `ADMIN_SENHA`, valor = a senha que você quiser → **Salvar**.
   A senha fica só na sua conta Google, não no código.
2. Publique a versão nova do `Code.gs`: **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**.
3. Abra o painel e digite a senha.

O painel não mostra o conteúdo das respostas, só contagens. Pelo painel também dá para
**fechar/reabrir** uma pesquisa; o status fica na propriedade `FECHADAS` do script (não edite à mão).
