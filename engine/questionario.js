// Motor genérico de coleta: TCLE → questionário → envio para Google Planilhas.
// Lê a configuração de window.ESTUDO (arquivo config.js de cada pesquisa).
// Formato da configuração: veja README.md na raiz do projeto.
(function () {
  "use strict";
  const E = window.ESTUDO;
  const root = document.getElementById("app");
  if (!E || !root) {
    document.body.textContent = "Configuração da pesquisa (config.js) não encontrada.";
    return;
  }

  // ---------- Escalas prontas ----------
  const ESCALAS = {
    concordancia5: ["Discordo totalmente", "Discordo", "Nem concordo nem discordo", "Concordo", "Concordo totalmente"],
    concordancia7: ["Discordo totalmente", "Discordo moderadamente", "Discordo um pouco",
      "Nem concordo nem discordo", "Concordo um pouco", "Concordo moderadamente", "Concordo totalmente"],
    frequencia5: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
    satisfacao5: ["Muito insatisfeito(a)", "Insatisfeito(a)", "Indiferente", "Satisfeito(a)", "Muito satisfeito(a)"],
    dificuldade5: ["Muito difícil", "Difícil", "Nem fácil nem difícil", "Fácil", "Muito fácil"],
    importancia5: ["Nada importante", "Pouco importante", "Moderadamente importante", "Importante", "Muito importante"],
    conhecimento5: ["Nenhum", "Pouco", "Razoável", "Bom", "Muito bom"]
  };
  const COLORIDAS = ["concordancia5", "concordancia7", "satisfacao5", "dificuldade5"];

  const KEY = "q-" + E.id;
  const TCLE = E.tcle || null;
  const TCLE_VER = (TCLE && TCLE.versao) || "v1";
  const KEY_TCLE = KEY + "-tcle-" + TCLE_VER;
  const KEY_RESP = KEY + "-respostas";

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  const h = (tag, cls, html) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  };
  const opt = o => typeof o === "object" ? { valor: String(o.valor), texto: o.texto || String(o.valor) } : { valor: String(o), texto: String(o) };
  const isOpen = q => q.tipo === "texto" || q.tipo === "textoLongo";
  const required = q => q.obrigatoria != null ? !!q.obrigatoria : !isOpen(q) && q.tipo !== "numero";

  function stamp(d) {
    d = d || new Date();
    const z = n => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) + " " +
      z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds());
  }
  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  document.title = E.titulo || "Questionário";
  if (E.idioma) document.documentElement.lang = E.idioma;

  // ---------- Cabeçalho e rodapé fixos ----------
  const nav = h("nav", "nav");
  nav.innerHTML = '<div class="wrap"><span class="brand"></span><span class="steps" id="steps"></span></div>';
  nav.querySelector(".brand").textContent = E.marca || E.titulo || "";
  root.appendChild(nav);
  const progress = h("div", "q-progress", '<div class="wrap"><span id="prog-text"></span><span class="bar"><i id="prog-bar"></i></span></div>');
  progress.hidden = true;
  root.appendChild(progress);

  const views = {};
  function view(name) {
    const v = h("div", "view");
    v.dataset.view = name;
    v.hidden = true;
    root.appendChild(v);
    views[name] = v;
    return v;
  }
  const footer = h("footer");
  const contato = E.contato ? '<p>Dúvidas: ' + (E.contato.nome || "") +
    (E.contato.email ? ' · <a href="mailto:' + E.contato.email + '">' + E.contato.email + "</a>" : "") + "</p>" : "";
  footer.innerHTML = '<div class="wrap">' + contato + (E.rodape ? "<p>" + E.rodape + "</p>" : "") + "</div>";

  // ---------- TCLE ----------
  const vT = view("tcle");
  if (TCLE) {
    vT.innerHTML =
      '<header class="hero"><div class="wrap">' +
      '<p class="label">Etapa 1 de 2 · Consentimento</p>' +
      "<h1>" + (TCLE.titulo || "Termo de Consentimento Livre e Esclarecido") + "</h1>" +
      (TCLE.resumo ? '<p class="lede">' + TCLE.resumo + "</p>" : "") +
      (TCLE.info && TCLE.info.length ? '<div class="info-box">' + TCLE.info.map(l => "<p>" + l + "</p>").join("") + "</div>" : "") +
      '</div></header><main class="wrap doc" id="tcle-doc"></main>';
    const doc = vT.querySelector("#tcle-doc");
    (TCLE.secoes || []).forEach(s => {
      if (s.titulo) doc.appendChild(h("h2", null, s.titulo));
      [].concat(s.paragrafos || s.texto || []).forEach(p => doc.appendChild(h("p", null, p)));
    });

    const form = h("form", "consent");
    form.noValidate = true;
    form.innerHTML = '<h2>Sua decisão</h2><label class="check"><input type="checkbox" id="agree"><span></span></label>';
    form.querySelector(".check span").innerHTML = TCLE.aceite ||
      "Li e compreendi este termo, tive a oportunidade de esclarecer minhas dúvidas e <strong>concordo voluntariamente em participar</strong> da pesquisa.";
    (TCLE.autorizacoes || []).forEach(a => {
      const fs = h("fieldset");
      fs.innerHTML = "<legend></legend>" + (a.ajuda ? '<p class="hint" style="margin-top:0"></p>' : "");
      fs.querySelector("legend").innerHTML = a.titulo;
      if (a.ajuda) fs.querySelector(".hint").innerHTML = a.ajuda;
      (a.opcoes || [{ valor: "autorizo", texto: "<strong>AUTORIZO</strong>" }, { valor: "nao-autorizo", texto: "<strong>NÃO AUTORIZO</strong>" }])
        .map(opt).forEach(o => {
          const l = h("label", "check", '<input type="radio"><span></span>');
          l.querySelector("input").name = "aut-" + a.id;
          l.querySelector("input").value = o.valor;
          l.querySelector("span").innerHTML = o.texto;
          fs.appendChild(l);
        });
      form.appendChild(fs);
    });
    form.insertAdjacentHTML("beforeend",
      '<p class="print-only" id="print-summary"></p>' +
      '<div class="actions"><button type="submit" class="btn primary" id="accept" disabled>Aceito participar e quero continuar</button>' +
      '<button type="button" class="btn secondary" id="decline">Não aceito participar</button></div>' +
      '<p class="hint" id="tcle-status" aria-live="polite"></p>' +
      '<p class="hint no-print"><button type="button" class="linklike" id="print">Salvar uma cópia deste termo (PDF)</button></p>');
    doc.appendChild(form);

    const agree = form.querySelector("#agree");
    const accept = form.querySelector("#accept");
    const autVal = id => (form.querySelector('input[name="aut-' + id + '"]:checked') || {}).value || "";
    const pendente = () => (TCLE.autorizacoes || []).filter(a => !autVal(a.id));
    function refresh() {
      const ok = agree.checked && !pendente().length;
      accept.disabled = !ok;
      form.querySelector("#tcle-status").textContent = ok ? "Tudo certo. Você pode continuar." :
        "Para continuar, marque a concordância" + ((TCLE.autorizacoes || []).length ? " e responda às autorizações." : ".");
    }
    form.addEventListener("change", refresh);
    refresh();
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (accept.disabled) return;
      const rec = { em: stamp(), aut: {} };
      (TCLE.autorizacoes || []).forEach(a => rec.aut[a.id] = autVal(a.id));
      store.set(KEY_TCLE, rec);
      consent = rec;
      go("questionario");
    });
    form.querySelector("#decline").addEventListener("click", () => {
      store.del(KEY_TCLE);
      consent = null;
      go("recusa");
    });
    form.querySelector("#print").addEventListener("click", () => {
      form.querySelector("#print-summary").textContent = agree.checked
        ? "Concordância registrada em " + new Date().toLocaleString("pt-BR") + "." : "";
      window.print();
    });
  }

  const vR = view("recusa");
  vR.innerHTML = '<main class="wrap center"><div class="notice"><h2>Obrigado pelo seu tempo.</h2><p></p>' +
    '<div class="actions"><button type="button" class="btn secondary" id="back-tcle">Voltar ao termo</button></div></div></main>';
  vR.querySelector("p").innerHTML = (TCLE && TCLE.recusa) ||
    "Sua decisão de não participar não traz nenhum prejuízo. Se mudar de ideia ou tiver dúvidas, fale com o pesquisador responsável.";
  vR.querySelector("#back-tcle").addEventListener("click", () => go("tcle"));

  // ---------- Questionário ----------
  const vQ = view("questionario");
  const partes = E.partes || [];
  const totalPartes = partes.length;
  vQ.innerHTML = '<header class="hero"><div class="wrap">' +
    '<p class="label">' + (TCLE ? "Etapa 2 de 2 · " : "") + "Questionário</p>" +
    "<h1></h1>" + (E.subtitulo ? '<p class="lede"></p>' : "") + '<div class="q-meta" id="q-meta"></div></div></header>';
  vQ.querySelector("h1").innerHTML = E.titulo || "Questionário";
  if (E.subtitulo) vQ.querySelector(".lede").innerHTML = E.subtitulo;

  const P = E.participante;
  let codigoEl = null;
  if (P && P.pedir !== false) {
    const m = vQ.querySelector("#q-meta");
    m.innerHTML = '<div><label for="participante"></label><input type="text" id="participante" autocomplete="off"></div>';
    m.querySelector("label").innerHTML = (P.rotulo || "Código do participante") + (P.obrigatorio ? ' <span class="req">*</span>' : "");
    codigoEl = m.querySelector("input");
    codigoEl.placeholder = P.ajuda || "";
    const fromUrl = new URLSearchParams(location.search).get("codigo");
    if (fromUrl) codigoEl.value = fromUrl;
  }

  const form = h("form");
  form.id = "q-form";
  form.noValidate = true;
  vQ.appendChild(form);

  const Q = []; // perguntas na ordem (sem títulos de seção)
  const byId = {};
  let num = 0;

  function likert(q) {
    let labels, values, ends = null, colored;
    if (q.escala && typeof q.escala === "object" && !Array.isArray(q.escala)) {
      const de = q.escala.de != null ? q.escala.de : 1, ate = q.escala.ate != null ? q.escala.ate : 5;
      values = []; for (let v = de; v <= ate; v++) values.push(String(v));
      labels = values.map(() => "");
      ends = [q.escala.min || "", q.escala.max || ""];
      colored = !!q.escala.cores;
    } else {
      const nome = typeof q.escala === "string" ? q.escala : "concordancia5";
      labels = Array.isArray(q.escala) ? q.escala : (ESCALAS[nome] || ESCALAS.concordancia5);
      values = labels.map((_, i) => String(i + 1));
      colored = q.cores != null ? !!q.cores : !Array.isArray(q.escala) && COLORIDAS.indexOf(nome) >= 0;
    }
    const n = values.length;
    const colors = values.map((_, i) => n === 5 ? ["s1", "s2", "s4", "s6", "s7"][i] : "s" + (Math.round(i * 6 / Math.max(1, n - 1)) + 1));
    const row = h("div", "lk" + (colored ? "" : " mono") + (n > 7 ? " many" : ""));
    row.style.setProperty("--n", n);
    values.forEach((v, i) => {
      const lab = h("label", colors[i], '<input type="radio"><span class="v"></span><span class="t"></span>');
      lab.querySelector("input").name = q.id;
      lab.querySelector("input").value = v;
      lab.querySelector(".v").textContent = v;
      lab.querySelector(".t").textContent = labels[i];
      lab.dataset.tip = labels[i];
      row.appendChild(lab);
    });
    const e = h("div", "lk-ends", '<span></span><span class="sel" aria-hidden="true"></span><span></span>');
    e.children[0].textContent = ends ? ends[0] : labels[0];
    e.children[2].textContent = ends ? ends[1] : labels[n - 1];
    row.addEventListener("change", ev => showSel(ev.target));
    return [row, e];
  }
  function showSel(input) {
    const lab = input.closest("label");
    const sel = input.closest(".q-item").querySelector(".lk-ends .sel");
    if (!sel) return;
    sel.textContent = input.value + (lab.dataset.tip ? " · " + lab.dataset.tip : "");
    sel.className = "sel on " + lab.classList[0];
  }

  function choices(q, multi) {
    const box = h("div", "choices");
    q.opcoes.map(opt).forEach(o => {
      const l = h("label", "choice", '<input><span></span>');
      const inp = l.querySelector("input");
      inp.type = multi ? "checkbox" : "radio";
      inp.name = q.id;
      inp.value = o.valor;
      l.querySelector("span").innerHTML = o.texto;
      box.appendChild(l);
    });
    if (q.outro) {
      const l = h("label", "choice other", '<input><span></span><input type="text" class="other-text">');
      const inp = l.querySelector("input");
      inp.type = multi ? "checkbox" : "radio";
      inp.name = q.id;
      inp.value = "__outro";
      l.querySelector("span").textContent = typeof q.outro === "string" ? q.outro : "Outro:";
      const t = l.querySelector(".other-text");
      t.id = q.id + "_outro";
      t.setAttribute("aria-label", "Especifique");
      t.addEventListener("input", () => { if (t.value.trim()) { inp.checked = true; } });
      box.appendChild(l);
    }
    if (multi && q.max) {
      box.addEventListener("change", () => {
        const marked = box.querySelectorAll('input[type=checkbox]:checked').length;
        box.querySelectorAll('input[type=checkbox]').forEach(c => { if (!c.checked) c.disabled = marked >= q.max; });
      });
    }
    return box;
  }

  function item(q) {
    if (!q.id) throw new Error("Pergunta sem id: " + q.texto);
    if (byId[q.id]) throw new Error("id repetido: " + q.id);
    num++;
    byId[q.id] = q;
    Q.push(q);
    const fs = h(q.tipo === "likert" || q.tipo === "unica" || q.tipo === "multipla" ? "fieldset" : "div", "q-item");
    fs.id = "item-" + q.id;
    const lg = h(fs.tagName === "FIELDSET" ? "legend" : "label", null,
      '<span class="num"></span><span class="txt"></span>');
    lg.querySelector(".num").textContent = (E.numerar === false ? "" : num + ".");
    lg.querySelector(".txt").innerHTML = q.texto + (required(q) ? ' <span class="req" title="Obrigatória">*</span>' : "");
    if (lg.tagName === "LABEL") lg.htmlFor = q.id;
    fs.appendChild(lg);
    if (q.ajuda) fs.appendChild(h("p", "q-help", q.ajuda));

    if (q.tipo === "likert") likert(q).forEach(el => fs.appendChild(el));
    else if (q.tipo === "unica") fs.appendChild(choices(q, false));
    else if (q.tipo === "multipla") {
      if (q.max) fs.appendChild(h("p", "q-help", "Marque até " + q.max + "."));
      fs.appendChild(choices(q, true));
    } else if (q.tipo === "lista") {
      const s = h("select");
      s.id = s.name = q.id;
      s.innerHTML = '<option value="">Selecione…</option>';
      q.opcoes.map(opt).forEach(o => { const op = h("option"); op.value = o.valor; op.textContent = o.texto; s.appendChild(op); });
      fs.appendChild(s);
    } else if (q.tipo === "textoLongo") {
      const t = h("textarea");
      t.id = t.name = q.id;
      t.rows = q.linhas || 4;
      if (q.placeholder) t.placeholder = q.placeholder;
      fs.appendChild(t);
    } else if (q.tipo === "texto" || q.tipo === "numero" || q.tipo === "data" || q.tipo === "email") {
      const t = h("input");
      t.type = q.tipo === "numero" ? "number" : q.tipo === "data" ? "date" : q.tipo === "email" ? "email" : "text";
      t.id = t.name = q.id;
      if (q.min != null) t.min = q.min;
      if (q.max != null) t.max = q.max;
      if (q.passo != null) t.step = q.passo;
      if (q.placeholder) t.placeholder = q.placeholder;
      if (q.tipo === "numero") t.inputMode = "decimal";
      fs.appendChild(t);
    } else {
      throw new Error("Tipo de pergunta desconhecido: " + q.tipo + " (" + q.id + ")");
    }
    return fs;
  }

  partes.forEach((p, i) => {
    const sec = h("section", "q-part");
    const w = h("div", "wrap");
    sec.appendChild(w);
    w.appendChild(h("p", "label", (totalPartes > 1 ? "Parte " + (i + 1) + " de " + totalPartes + (p.rotulo ? " · " + p.rotulo : "") : (p.rotulo || ""))));
    if (p.titulo) w.appendChild(h("h2", null, p.titulo));
    [].concat(p.intro || []).forEach(t => w.appendChild(h("p", "intro", t)));
    if (p.reiniciarNumeracao) num = 0;
    (p.questoes || []).forEach(q => {
      if (q.tipo === "secao") {
        w.appendChild(h("p", "q-group-title", q.texto));
        if (q.nota) w.appendChild(h("p", "q-group-note", q.nota));
      } else w.appendChild(item(q));
    });
    form.appendChild(sec);
  });

  const endSec = h("section", "q-part");
  endSec.innerHTML = '<div class="wrap"><div class="callout" id="missing-box" hidden role="alert"><p class="label">Faltam respostas</p><p id="missing-title"></p></div>' +
    '<div class="actions"><button type="submit" class="btn primary" id="finish">Enviar respostas</button></div>' +
    '<p class="hint"><span class="req">*</span> pergunta obrigatória. Suas respostas ficam salvas neste navegador até o envio.</p></div>';
  form.appendChild(endSec);

  // Diálogo para perguntas abertas em branco.
  const dialog = h("dialog", "modal");
  dialog.innerHTML = '<h2>Perguntas abertas em branco</h2><p class="modal-count" id="dlg-count"></p>' +
    '<p>Suas respostas abertas são muito importantes para a pesquisa. Deseja enviar mesmo assim?</p>' +
    '<div class="modal-actions"><button type="button" class="btn primary" id="dlg-back">Voltar e responder</button>' +
    '<button type="button" class="btn secondary" id="dlg-skip">Enviar sem responder</button></div>';
  vQ.appendChild(dialog);

  // ---------- Valores ----------
  function val(id) {
    const q = byId[id];
    if (q.tipo === "multipla") {
      return Array.from(form.querySelectorAll('input[name="' + id + '"]:checked'))
        .map(c => c.value === "__outro" ? (document.getElementById(id + "_outro").value.trim() || "Outro") : c.value).join("; ");
    }
    if (q.tipo === "likert" || q.tipo === "unica") {
      const r = form.querySelector('input[name="' + id + '"]:checked');
      if (!r) return "";
      return r.value === "__outro" ? "Outro" : r.value;
    }
    return document.getElementById(id).value.trim();
  }
  function outroVal(id) {
    const r = form.querySelector('input[name="' + id + '"][value="__outro"]');
    return r && r.checked ? document.getElementById(id + "_outro").value.trim() : "";
  }

  // Condição de exibição: { id: "Q3", igual: "Sim" } ou { id, igual: ["A","B"] } ou { id, contem: "X" }.
  function visible(q) {
    const c = q.mostrarSe;
    if (!c) return true;
    if (!byId[c.id] || !visible(byId[c.id])) return false;
    const v = val(c.id);
    if (c.contem != null) return v.split("; ").indexOf(String(c.contem)) >= 0;
    if (c.preenchida) return !!v;
    return [].concat(c.igual).map(String).indexOf(v) >= 0;
  }
  function applyVisibility() {
    Q.forEach(q => { document.getElementById("item-" + q.id).hidden = !visible(q); });
  }

  // ---------- Progresso e armazenamento ----------
  let consent = TCLE ? store.get(KEY_TCLE) : { em: "", aut: {} };
  let saved = store.get(KEY_RESP) || {};
  if (!saved.resposta_id) saved = { resposta_id: uid(), iniciado_em: "", r: {} };

  function snapshot() {
    const rec = { resposta_id: saved.resposta_id, iniciado_em: saved.iniciado_em || stamp(), r: {}, outro: {} };
    if (codigoEl) rec.participante = codigoEl.value.trim();
    Q.forEach(q => {
      if (q.tipo === "multipla") rec.r[q.id] = Array.from(form.querySelectorAll('input[name="' + q.id + '"]:checked')).map(c => c.value);
      else if (q.tipo === "likert" || q.tipo === "unica") rec.r[q.id] = (form.querySelector('input[name="' + q.id + '"]:checked') || {}).value || "";
      else rec.r[q.id] = document.getElementById(q.id).value;
      if (q.outro) rec.outro[q.id] = document.getElementById(q.id + "_outro").value;
    });
    saved = rec;
    store.set(KEY_RESP, rec);
    return rec;
  }
  function restore() {
    if (codigoEl && saved.participante && !codigoEl.value) codigoEl.value = saved.participante;
    Q.forEach(q => {
      const v = (saved.r || {})[q.id];
      if (v == null || v === "") return;
      if (q.tipo === "multipla") v.forEach(x => { const c = form.querySelector('input[name="' + q.id + '"][value="' + CSS.escape(x) + '"]'); if (c) c.checked = true; });
      else if (q.tipo === "likert" || q.tipo === "unica") {
        const r = form.querySelector('input[name="' + q.id + '"][value="' + CSS.escape(v) + '"]');
        if (r) { r.checked = true; if (q.tipo === "likert") showSel(r); }
      } else document.getElementById(q.id).value = v;
      if (q.outro && saved.outro && saved.outro[q.id]) document.getElementById(q.id + "_outro").value = saved.outro[q.id];
    });
    form.querySelectorAll(".choices").forEach(b => b.dispatchEvent(new Event("change")));
  }

  function updateProgress() {
    const vis = Q.filter(visible);
    let done = 0;
    vis.forEach(q => {
      const ok = !!val(q.id);
      if (ok) done++;
      const el = document.getElementById("item-" + q.id);
      el.classList.toggle("answered", ok);
      if (ok) el.classList.remove("missing");
    });
    document.getElementById("prog-text").textContent = done + " de " + vis.length + " respondidas";
    document.getElementById("prog-bar").style.width = (vis.length ? done / vis.length * 100 : 0) + "%";
    const missing = vis.filter(q => required(q) && !val(q.id));
    if (!missing.length) document.getElementById("missing-box").hidden = true;
  }
  function onChange() { applyVisibility(); updateProgress(); snapshot(); }
  form.addEventListener("change", onChange);
  form.addEventListener("input", e => {
    if (e.target.matches("textarea, input[type=text], input[type=number], input[type=email]")) {
      const it = e.target.closest(".q-item");
      if (it && e.target.value.trim()) it.classList.remove("empty");
      onChange();
    }
  });
  if (codigoEl) codigoEl.addEventListener("input", () => { codigoEl.classList.remove("missing-input"); snapshot(); });

  // ---------- Envio ----------
  function focusItem(el) {
    const f = el.querySelector("input, textarea, select");
    if (f) f.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (codigoEl && P.obrigatorio && !codigoEl.value.trim()) {
      codigoEl.classList.add("missing-input");
      codigoEl.focus({ preventScroll: true });
      codigoEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const vis = Q.filter(visible);
    const missing = vis.filter(q => required(q) && !val(q.id));
    const badNum = vis.filter(q => q.tipo === "numero" && val(q.id) && !document.getElementById(q.id).checkValidity());
    const bad = missing.concat(badNum);
    if (bad.length) {
      bad.forEach(q => document.getElementById("item-" + q.id).classList.add("missing"));
      document.getElementById("missing-title").textContent =
        (missing.length === 1 ? "1 pergunta obrigatória está sem resposta." : missing.length ? missing.length + " perguntas obrigatórias estão sem resposta." : "") +
        (badNum.length ? " Há números fora do intervalo permitido." : "") + " Os itens em destaque precisam ser corrigidos.";
      document.getElementById("missing-box").hidden = false;
      focusItem(document.getElementById("item-" + bad[0].id));
      return;
    }
    const emptyOpen = vis.filter(q => isOpen(q) && !required(q) && !val(q.id));
    if (emptyOpen.length && E.confirmarAbertasEmBranco !== false) {
      emptyOpen.forEach(q => document.getElementById("item-" + q.id).classList.add("empty"));
      pendingEmpty = emptyOpen;
      document.getElementById("dlg-count").textContent = emptyOpen.length === 1 ? "1 pergunta aberta está em branco." : emptyOpen.length + " perguntas abertas estão em branco.";
      dialog.showModal();
      document.getElementById("dlg-back").focus();
      return;
    }
    finish();
  });
  let pendingEmpty = [];
  function backToOpen() { dialog.close(); focusItem(document.getElementById("item-" + pendingEmpty[0].id)); }
  dialog.querySelector("#dlg-back").addEventListener("click", backToOpen);
  dialog.querySelector("#dlg-skip").addEventListener("click", () => { dialog.close(); finish(); });
  dialog.addEventListener("cancel", e => { e.preventDefault(); backToOpen(); });

  function pacote() {
    const rec = snapshot();
    const agora = new Date();
    const ini = rec.iniciado_em ? new Date(rec.iniciado_em.replace(" ", "T")) : agora;
    const cols = ["resposta_id", "enviado_em", "iniciado_em", "duracao_min"];
    const d = {
      resposta_id: rec.resposta_id,
      enviado_em: stamp(agora),
      iniciado_em: rec.iniciado_em,
      duracao_min: ((agora - ini) / 60000).toFixed(1)
    };
    if (codigoEl) { cols.push("participante"); d.participante = rec.participante || ""; }
    if (TCLE) {
      cols.push("tcle_versao", "tcle_aceite_em");
      d.tcle_versao = TCLE_VER;
      d.tcle_aceite_em = consent ? consent.em : "";
      (TCLE.autorizacoes || []).forEach(a => { cols.push("tcle_" + a.id); d["tcle_" + a.id] = consent ? consent.aut[a.id] || "" : ""; });
    }
    Q.forEach(q => {
      cols.push(q.id);
      d[q.id] = visible(q) ? val(q.id) : "";
      if (q.outro) { cols.push(q.id + "_outro"); d[q.id + "_outro"] = visible(q) ? outroVal(q.id) : ""; }
    });
    return { estudo: E.id, colunas: cols, dados: d };
  }

  let lastPacote = null;
  function finish() {
    lastPacote = pacote();
    go("fim");
    send(lastPacote);
  }

  const vF = view("fim");
  vF.innerHTML = '<main class="wrap center"><div class="success" role="status">' +
    '<svg class="success-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="currentColor"/>' +
    '<path d="M14 24.5l7 7 13-14" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '<h2></h2><p class="success-lead"></p><p class="send-status" id="send-status" aria-live="polite"></p>' +
    '<div class="actions"><button type="button" class="btn primary" id="retry" hidden>Tentar enviar novamente</button>' +
    '<button type="button" class="btn secondary" id="edit" hidden>Voltar às respostas</button></div></div></main>';
  vF.querySelector("h2").innerHTML = (E.conclusao && E.conclusao.titulo) || "Obrigado pela participação!";
  vF.querySelector(".success-lead").innerHTML = (E.conclusao && E.conclusao.mensagem) || "Suas respostas foram registradas.";
  vF.querySelector("#retry").addEventListener("click", () => send(lastPacote));
  vF.querySelector("#edit").addEventListener("click", () => go("questionario"));

  async function send(pk) {
    const st = document.getElementById("send-status");
    const retry = document.getElementById("retry"), edit = document.getElementById("edit");
    retry.hidden = edit.hidden = true;
    if (!E.envioUrl) {
      st.className = "send-status fail";
      st.textContent = "Modo de teste: envioUrl não configurada no config.js. Nada foi enviado.";
      console.log("Pacote que seria enviado:", pk);
      window.__ultimoPacote = pk;
      edit.hidden = false;
      return;
    }
    st.className = "send-status";
    st.textContent = "Enviando respostas…";
    try {
      // text/plain evita a requisição prévia de CORS do Apps Script.
      const res = await fetch(E.envioUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(pk) });
      const out = await res.json();
      if (out.fechada) {
        store.del(KEY_RESP);
        store.del(KEY_TCLE);
        go("encerrada");
        return;
      }
      if (!out.ok) throw new Error(out.erro || "falha");
      st.className = "send-status ok";
      st.textContent = "Respostas enviadas com sucesso. Você já pode fechar esta página.";
      // Limpa o navegador: o próximo participante (ex.: computador de laboratório) começa do zero.
      store.del(KEY_RESP);
      store.del(KEY_TCLE);
    } catch (err) {
      console.error(err);
      st.className = "send-status fail";
      st.textContent = "Não foi possível enviar suas respostas. Verifique a conexão e tente novamente. Suas respostas continuam salvas neste navegador.";
      retry.hidden = edit.hidden = false;
    }
  }

  // Pesquisa encerrada pelo painel admin.
  const vX = view("encerrada");
  vX.innerHTML = '<main class="wrap center"><div class="notice"><h2></h2><p></p></div></main>';
  vX.querySelector("h2").innerHTML = (E.encerrada && E.encerrada.titulo) || "Esta pesquisa está encerrada";
  vX.querySelector("p").innerHTML = (E.encerrada && E.encerrada.mensagem) ||
    "O período de respostas terminou e não estamos mais recebendo respostas. Obrigado pelo interesse!";

  // Ao abrir a página, pergunta ao Apps Script se a pesquisa ainda está aberta.
  // Sem conexão ou sem resposta em 8 s, segue normalmente (o envio é recusado depois se estiver fechada).
  async function checarStatus() {
    if (!E.envioUrl) return;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(E.envioUrl + (E.envioUrl.indexOf("?") < 0 ? "?" : "&") + "estudo=" + encodeURIComponent(E.id), { signal: ctrl.signal });
      clearTimeout(t);
      const out = await res.json();
      if (out.ok && out.aberta === false) {
        store.del(KEY_RESP);
        store.del(KEY_TCLE);
        go("encerrada");
      }
    } catch (e) { /* segue aberta */ }
  }

  // ---------- Navegação ----------
  function go(name) {
    if (name === "questionario" && TCLE && !consent) name = "tcle";
    Object.keys(views).forEach(k => views[k].hidden = k !== name);
    progress.hidden = name !== "questionario";
    const steps = document.getElementById("steps");
    steps.textContent = name === "tcle" ? "Consentimento" : name === "questionario" ? "Questionário" : "";
    if (name === "questionario" && !saved.iniciado_em) { saved.iniciado_em = stamp(); snapshot(); }
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    window.scrollTo(0, 0);
  }

  root.appendChild(footer);
  restore();
  applyVisibility();
  updateProgress();
  if (TCLE && consent) {
    const agree = document.getElementById("agree");
    agree.checked = true;
    Object.keys(consent.aut || {}).forEach(id => {
      const r = document.querySelector('input[name="aut-' + id + '"][value="' + CSS.escape(consent.aut[id]) + '"]');
      if (r) r.checked = true;
    });
    agree.dispatchEvent(new Event("change", { bubbles: true }));
  }
  go(!TCLE || consent ? "questionario" : "tcle");
  checarStatus();
})();
