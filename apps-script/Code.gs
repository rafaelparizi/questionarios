/**
 * Recebe respostas de QUALQUER questionário feito com o motor genérico
 * (DataCollection-Questionnaire) e grava uma linha na planilha.
 *
 * - Cada pesquisa (campo `id` do config.js) vira uma aba própria na planilha.
 * - O cabeçalho é criado a partir das colunas enviadas pela página; colunas novas
 *   (ex.: você acrescentou uma pergunta) são adicionadas ao final, sem perder dados.
 * - Reenvios da mesma resposta (mesmo `resposta_id`) não duplicam linhas.
 *
 * Uma única implantação serve para todas as suas pesquisas: use a mesma URL /exec
 * em todos os config.js. Instalação: veja apps-script/README.md.
 */

// true = manda um e-mail a cada resposta (útil em estudos pequenos; vira spam em turmas grandes).
var ENVIAR_EMAIL = false;
// E-mail que recebe os avisos. Vazio = a conta que publicou o script.
var EMAIL = '';
// Opcional: lista de ids de pesquisa aceitos. Vazia = aceita qualquer id.
var ESTUDOS_PERMITIDOS = [];
var NOME_PLANILHA = 'Questionários · respostas';

function doPost(e) {
  try {
    var pacote = JSON.parse(e.postData.contents);
    if (pacote.acao === 'painel') return resposta(painel(pacote.senha));
    if (pacote.acao === 'status') return resposta(mudarStatus(pacote.senha, pacote.estudo, pacote.aberta));
    if (estaFechada(pacote.estudo)) return resposta({ ok: false, fechada: true, erro: 'Esta pesquisa está encerrada.' });
    var r = registrar(pacote);
    return resposta({ ok: true, duplicada: r.duplicada });
  } catch (err) {
    console.error(err);
    return resposta({ ok: false, erro: String(err) });
  }
}

// Abrir a URL /exec no navegador mostra se a implantação está no ar.
// ?estudo=<id> responde se aquela pesquisa está aberta (usado pela página ao carregar).
function doGet(e) {
  var id = e && e.parameter && e.parameter.estudo;
  if (id) return resposta({ ok: true, estudo: id, aberta: !estaFechada(id) });
  return resposta({ ok: true, servico: 'Questionários genéricos', planilha: planilha().getUrl() });
}

// ---------- Pesquisas abertas/fechadas ----------
// Guardado nas Propriedades do script (FECHADAS = lista de nomes de aba). Toda pesquisa nasce aberta.
function fechadas() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('FECHADAS') || '[]'); }
  catch (err) { return []; }
}
function estaFechada(id) {
  return fechadas().indexOf(nomeAba(id)) >= 0;
}
function senhaOk(senha) {
  var certa = PropertiesService.getScriptProperties().getProperty('ADMIN_SENHA');
  if (!certa) return 'Painel desligado: crie a propriedade ADMIN_SENHA no Apps Script.';
  if (String(senha || '') !== certa) { Utilities.sleep(1500); return 'Senha incorreta.'; }
  return '';
}
function mudarStatus(senha, id, aberta) {
  var erro = senhaOk(senha);
  if (erro) return { ok: false, erro: erro };
  if (!id) return { ok: false, erro: 'Pesquisa não informada.' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var nome = nomeAba(id);
    var lista = fechadas().filter(function (x) { return x !== nome; });
    if (!aberta) lista.push(nome);
    PropertiesService.getScriptProperties().setProperty('FECHADAS', JSON.stringify(lista));
    return { ok: true, estudo: nome, aberta: !!aberta };
  } finally {
    lock.releaseLock();
  }
}

function registrar(pacote) {
  var estudo = nomeAba(pacote.estudo);
  if (ESTUDOS_PERMITIDOS.length && ESTUDOS_PERMITIDOS.indexOf(pacote.estudo) < 0) {
    throw new Error('Pesquisa não autorizada: ' + pacote.estudo);
  }
  var colunas = pacote.colunas || [];
  var dados = pacote.dados || {};
  if (!colunas.length) throw new Error('Pacote sem colunas.');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = planilha();
    var aba = ss.getSheetByName(estudo) || ss.insertSheet(estudo);

    // Cabeçalho: cria ou acrescenta colunas que ainda não existem.
    var cab = aba.getLastRow() === 0 ? [] :
      aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0].map(String);
    var novas = colunas.filter(function (c) { return cab.indexOf(c) < 0; });
    if (novas.length) {
      aba.getRange(1, cab.length + 1, 1, novas.length).setValues([novas]).setFontWeight('bold');
      cab = cab.concat(novas);
      aba.setFrozenRows(1);
    }

    // Evita duplicar quando a página reenvia a mesma resposta.
    var idCol = cab.indexOf('resposta_id') + 1;
    if (idCol > 0 && dados.resposta_id && aba.getLastRow() > 1) {
      var achou = aba.getRange(2, idCol, aba.getLastRow() - 1, 1)
        .createTextFinder(String(dados.resposta_id)).matchEntireCell(true).findNext();
      if (achou) return { duplicada: true };
    }

    var linha = cab.map(function (c) { return dados[c] == null ? '' : String(dados[c]); });
    // Grava tudo como texto para a planilha não reinterpretar datas ou números.
    aba.getRange(aba.getLastRow() + 1, 1, 1, linha.length).setNumberFormat('@').setValues([linha]);

    if (ENVIAR_EMAIL) enviarEmail(pacote.estudo, cab, linha, dados.participante, ss.getUrl());
    return { duplicada: false };
  } finally {
    lock.releaseLock();
  }
}

// Resumo para o painel admin (admin/index.html). Exige a senha guardada em
// Configurações do projeto → Propriedades do script → ADMIN_SENHA. Sem essa propriedade, fica desligado.
function painel(senha) {
  var erro = senhaOk(senha);
  if (erro) return { ok: false, erro: erro };

  var ss = planilha();
  var fech = fechadas();
  var hoje = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var estudos = ss.getSheets().map(function (aba) {
    var n = aba.getLastRow();
    if (n < 1 || aba.getLastColumn() < 1) return null;
    var vals = aba.getRange(1, 1, n, aba.getLastColumn()).getDisplayValues();
    var cab = vals[0];
    if (cab.indexOf('resposta_id') < 0) return null; // abas que não são de questionário
    var linhas = vals.slice(1);
    var iEnv = cab.indexOf('enviado_em'), iPart = cab.indexOf('participante'), iDur = cab.indexOf('duracao_min');
    var porDia = {}, ultima = '', participantes = {}, duracoes = [];
    linhas.forEach(function (l) {
      var env = iEnv >= 0 ? l[iEnv] : '';
      if (env) {
        var dia = env.slice(0, 10);
        porDia[dia] = (porDia[dia] || 0) + 1;
        if (env > ultima) ultima = env;
      }
      if (iPart >= 0 && l[iPart]) participantes[l[iPart]] = 1;
      var d = iDur >= 0 ? parseFloat(l[iDur]) : NaN;
      if (!isNaN(d)) duracoes.push(d);
    });
    duracoes.sort(function (a, b) { return a - b; });
    return {
      id: aba.getName(),
      gid: aba.getSheetId(),
      aberta: fech.indexOf(aba.getName()) < 0,
      total: linhas.length,
      hoje: porDia[hoje] || 0,
      ultima: ultima,
      participantes: iPart >= 0 ? Object.keys(participantes).length : null,
      duracaoMediana: duracoes.length ? duracoes[Math.floor(duracoes.length / 2)] : null,
      perguntas: cab.length,
      porDia: porDia
    };
  }).filter(Boolean);
  return { ok: true, planilha: ss.getUrl(), hoje: hoje, geradoEm: new Date().toISOString(), estudos: estudos };
}

// Nomes de aba: até 100 caracteres, sem []:*?/\
function nomeAba(id) {
  var s = String(id || 'sem-id').replace(/[\[\]:*?\/\\]/g, '-').trim();
  return s.slice(0, 100) || 'sem-id';
}

// Usa a planilha à qual o script está vinculado; se for avulso, cria uma e guarda o ID.
function planilha() {
  var ativa = SpreadsheetApp.getActiveSpreadsheet();
  if (ativa) return ativa;
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PLANILHA_ID');
  if (id) return SpreadsheetApp.openById(id);
  var nova = SpreadsheetApp.create(NOME_PLANILHA);
  props.setProperty('PLANILHA_ID', nova.getId());
  return nova;
}

function enviarEmail(estudo, cab, linha, participante, urlPlanilha) {
  var destino = EMAIL || Session.getEffectiveUser().getEmail();
  if (!destino) throw new Error('Preencha a variável EMAIL no topo do script.');
  var csv = '﻿' + [cab, linha].map(function (r) {
    return r.map(function (v) {
      v = String(v);
      return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(',');
  }).join('\r\n') + '\r\n';
  MailApp.sendEmail({
    to: destino,
    subject: estudo + ' · nova resposta (' + (participante || 'sem código') + ')',
    body: 'Nova resposta recebida para "' + estudo + '".\n\n' +
          'Participante: ' + (participante || 'sem código') + '\n' +
          'Planilha com todas as respostas: ' + urlPlanilha,
    attachments: [Utilities.newBlob(csv, 'text/csv', estudo + '.csv')]
  });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Rode pelo editor para autorizar o acesso à planilha. Cria a aba "TESTE" (pode apagar depois).
function testarEnvio() {
  registrar({
    estudo: 'TESTE',
    colunas: ['resposta_id', 'enviado_em', 'participante', 'Q1'],
    dados: { resposta_id: 'teste-' + Date.now(), enviado_em: new Date().toISOString(), participante: 'TESTE', Q1: 'ok' }
  });
  console.log('Tudo certo. Planilha: ' + planilha().getUrl());
}
