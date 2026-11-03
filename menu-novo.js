/* MENU PRINCIPAL (principal.png) + CENÁRIOS DOS MUNDOS
   Carregado depois da lógica do jogo (index.html).
   Mantém moedas, progresso e desbloqueios (usa o mesmo save do jogo). */
(function () {
  "use strict";

  /* ================= CONFIGURAÇÃO ================= */

  // true  = a loja credita moedas de graça (só para testar).
  // false = a loja avisa que o pagamento não está conectado. Use false ao publicar.
  const MODO_TESTE = true;

  const IMAGEM_MENU = "principal.png";

  // Áreas clicáveis sobre a imagem, em % da largura/altura da imagem.
  // Posições PROVISÓRIAS: abra o jogo com  index.html#calibrar  para ajustar.
  const HOTSPOTS = {
    jogar:  { x: 25, y: 60, w: 50, h: 9,  label: "Jogar" },
    mundos: { x: 25, y: 71, w: 50, h: 8,  label: "Mundos" },
    loja:   { x: 33, y: 2,  w: 10, h: 6,  label: "Loja (+)" },
    config: { x: 84, y: 2,  w: 13, h: 6,  label: "Config" },
    moedas: { x: 10, y: 2,  w: 22, h: 6,  label: "Contador de moedas" }
  };

  // Um cenário fixo por mundo (o mesmo em todas as fases).
  const CENARIOS = {
    natureza: "natureza.png",
    lunar:    "lunar.png",
    magico:   "magico.png",
    mar:      "fundo-do-mar.png",
    ceu:      "ceu.png"
  };

  // Pacotes da loja (ajuste valores e preços).
  const PACOTES = [
    { coins: 500,  preco: "R$ 4,99" },
    { coins: 1500, preco: "R$ 12,99" },
    { coins: 5000, preco: "R$ 39,90" }
  ];

  const CFG_KEY = "cacaPalavrasConfig";

  /* ================= ESTILOS ================= */

  const fundosCss = Object.entries(CENARIOS).map(([k, src]) =>
    `.game-screen[data-world="${k}"],.complete-screen[data-world="${k}"]{` +
      `background:linear-gradient(rgba(0,0,0,.18),rgba(0,0,0,.35)),url("${src}") center/cover no-repeat!important}` +
    `.mn-card.w-${k}{background:linear-gradient(110deg,rgba(0,0,0,.55),rgba(0,0,0,.05)),url("${src}") center/cover}`
  ).join("\n");

  const css = `
  #homeScreen{padding:0!important;background:#78bff0!important}
  .mn-stage{position:relative;width:fit-content;line-height:0}
  .mn-img{display:block;max-width:100vw;max-height:100vh;max-height:100dvh;width:auto;height:auto;
    user-select:none;-webkit-user-select:none;-webkit-user-drag:none}
  .mn-hot{position:absolute;cursor:pointer;border-radius:14px;line-height:normal;
    -webkit-tap-highlight-color:transparent}
  .mn-hot:active{background:rgba(255,255,255,.28)}
  .mn-hot:focus-visible{outline:3px solid #fff}
  .mn-coinnum{display:grid;place-items:center;color:#fff;font-weight:900;cursor:default;
    text-shadow:0 2px 3px #000a;pointer-events:none}
  .mn-hot.cal{background:rgba(255,0,0,.28);outline:2px dashed #f00;resize:both;overflow:hidden;
    touch-action:none;pointer-events:auto;font:700 12px sans-serif;color:#000;cursor:move}
  .mn-hot.cal::before{content:attr(data-label)}
  .mn-cal-out{position:fixed;left:0;right:0;bottom:0;height:150px;z-index:99;font:12px monospace}

  .worlds-screen{padding:14px 14px 30px;background:linear-gradient(180deg,#39a8f4,#9cdbfa 60%,#83c7e7)!important}
  .worlds-inner{width:min(100%,760px);margin:0 auto}
  .worlds-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
  .worlds-top .coin-pill{padding:8px 14px;border-radius:30px;background:#0b2540;border:3px solid #7dc7f4;font-weight:900}
  .worlds-inner h1{text-align:center;color:#ffd95b;text-shadow:0 3px 0 #74380d;margin:14px 0 16px;font-size:clamp(26px,7vw,38px)}
  .cfg-row{display:flex;align-items:center;gap:10px;padding:10px 4px;font-weight:800;text-align:left}
  .cfg-row input{width:22px;height:22px}
  .cfg-note{font-size:13px;opacity:.85}
  .shop-list{display:grid;gap:10px;margin-top:12px}
  .shop-list .primary-button{display:flex;justify-content:space-between;align-items:center}

  ${fundosCss}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  /* ================= BASE ================= */

  const byId = id => document.getElementById(id);
  const home = byId("homeScreen");
  if (!home) return;

  let cfg = { som: true, vibracao: true };
  try { Object.assign(cfg, JSON.parse(localStorage.getItem(CFG_KEY)) || {}); } catch (e) {}
  const saveCfg = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {} };

  /* ================= MENU PRINCIPAL ================= */

  home.innerHTML = `
    <div class="mn-stage" id="mnStage">
      <img class="mn-img" id="mnImg" src="${IMAGEM_MENU}" alt="Caça-Palavras — Aventura dos Mundos" draggable="false">
    </div>`;

  const stage = byId("mnStage");
  const hot = {};

  Object.entries(HOTSPOTS).forEach(([k, h]) => {
    const el = document.createElement(k === "moedas" ? "span" : "div");
    el.className = "mn-hot";
    el.dataset.k = k;
    el.dataset.label = h.label;
    el.style.cssText = `left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%`;
    if (k === "moedas") {
      el.id = "homeCoins";               // o jogo atualiza este id
      el.classList.add("mn-coinnum");
      el.textContent = "0";
    } else {
      el.setAttribute("role", "button");
      el.tabIndex = 0;
      el.setAttribute("aria-label", h.label);
    }
    stage.append(el);
    hot[k] = el;
  });

  // Tamanho do número de moedas acompanha o tamanho da imagem
  const ajustarFonte = () => { stage.style.fontSize = (stage.clientWidth * 0.06) + "px"; };
  new ResizeObserver(ajustarFonte).observe(stage);
  byId("mnImg").addEventListener("load", ajustarFonte);

  /* ================= TELA DE MUNDOS ================= */

  const worlds = document.createElement("section");
  worlds.id = "worldsScreen";
  worlds.className = "screen worlds-screen hidden";
  worlds.innerHTML = `
    <div class="worlds-inner">
      <header class="worlds-top">
        <button class="wood-button" id="worldsBack" type="button">← Menu</button>
        <div class="coin-pill">🪙 <strong id="worldsCoins">0</strong></div>
      </header>
      <h1>Escolha um mundo</h1>
      <div id="worldGrid" class="mn-worlds" aria-label="Escolha um mundo"></div>
      <footer class="mn-foot">
        <div id="homeProgress">0/630 fases</div>
        <div class="mn-total"><i id="homeTotalBar" style="width:0%"></i></div>
      </footer>
    </div>`;
  byId("app").append(worlds);

  byId("worldsBack").onclick = () => show("homeScreen");

  // Desenha os cartões dos mundos (bloqueio continua por fases concluídas)
  window.renderWorlds = function renderWorlds() {
    const grid = byId("worldGrid");
    if (!grid) return;
    grid.innerHTML = "";

    ORDER.forEach(key => {
      const w = WORLDS[key];
      const missing = Math.max(0, w.start - totalDone());
      const locked = missing > 0;
      const done = worldDone(key);

      const card = document.createElement("button");
      card.type = "button";
      card.className = `mn-card w-${key}` + (locked ? " locked" : "");
      card.setAttribute("aria-label",
        `Mundo ${w.name}, ${done} de ${w.phases} fases` + (locked ? `, bloqueado, faltam ${missing}` : ", jogar"));
      card.innerHTML = `
        <div class="mn-art" aria-hidden="true"></div>
        <div class="mn-info"><strong></strong><small></small><div class="mn-bar"><i></i></div></div>
        <span class="mn-go"></span>`;
      card.querySelector(".mn-art").textContent = w.emoji;
      card.querySelector("strong").textContent = w.name;
      card.querySelector("small").textContent = `${done}/${w.phases} fases`;
      card.querySelector(".mn-bar i").style.width = Math.min(100, done / w.phases * 100) + "%";
      card.querySelector(".mn-go").textContent = locked ? `🔒 Faltam ${missing}` : "▶ Jogar";
      card.addEventListener("click", () => openWorld(key));
      grid.append(card);
    });

    const bar = byId("homeTotalBar");
    if (bar) bar.style.width = Math.min(100, totalDone() / TOTAL_PHASES * 100) + "%";
  };

  /* ================= INTEGRAÇÃO COM O JOGO ================= */

  // Telas: inclui a tela de mundos e aplica o cenário do mundo atual
  const _show = window.show;
  window.show = function (id) {
    _show(id);
    worlds.classList.toggle("hidden", id !== "worldsScreen");
    if (id === "gameScreen" || id === "completeScreen") {
      byId("gameScreen").dataset.world = currentWorld;
      byId("completeScreen").dataset.world = currentWorld;
    }
  };

  // Lembra o último mundo jogado (botão Jogar continua dele)
  const _openWorld = window.openWorld;
  window.openWorld = function (key) {
    _openWorld(key);
    if (currentWorld === key && !byId("gameScreen").classList.contains("hidden")) {
      state.lastWorld = key;
      save();
    }
  };

  // Atualiza também o contador da tela de mundos
  const _updateHud = window.updateHud;
  window.updateHud = function () {
    _updateHud();
    const c = byId("worldsCoins");
    if (c) c.textContent = state.coins;
  };

  // "← Mundos" e "Voltar aos mundos" levam à tela de mundos
  byId("backButton").onclick = () => { updateHud(); show("worldsScreen"); };
  byId("completeHomeButton").onclick = () => { updateHud(); show("worldsScreen"); };

  /* ================= LOJA ================= */

  const shop = document.createElement("dialog");
  shop.innerHTML = `
    <div class="dialog-inner">
      <button class="dialog-close" data-close aria-label="Fechar">×</button>
      <h2>Loja de moedas</h2>
      <p class="cfg-note">${MODO_TESTE ? "Modo de teste: as compras são simuladas." : "Escolha um pacote."}</p>
      <div class="shop-list"></div>
    </div>`;
  document.body.append(shop);

  PACOTES.forEach(p => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "primary-button";
    const a = document.createElement("span"); a.textContent = `🪙 ${p.coins.toLocaleString("pt-BR")} moedas`;
    const c = document.createElement("span"); c.textContent = p.preco;
    b.append(a, c);
    b.onclick = () => comprar(p);
    shop.querySelector(".shop-list").append(b);
  });

  function comprar(p) {
    shop.close();
    if (!MODO_TESTE) {
      notice("Pagamento indisponível", "O pagamento ainda não está conectado a uma plataforma de compras.");
      return;
    }
    state.coins += p.coins;
    save();
    notice("Moedas recebidas!", `+${p.coins} moedas adicionadas (modo de teste).`);
  }

  /* ================= CONFIGURAÇÕES ================= */

  const cfgDlg = document.createElement("dialog");
  cfgDlg.innerHTML = `
    <div class="dialog-inner">
      <button class="dialog-close" data-close aria-label="Fechar">×</button>
      <h2>Configurações</h2>
      <label class="cfg-row"><input type="checkbox" id="cfgSom"> Efeitos sonoros</label>
      <label class="cfg-row"><input type="checkbox" id="cfgVib"> Vibração</label>
      <button class="secondary-button" id="cfgReset" type="button">Reiniciar progresso</button>
      <p class="cfg-note">Seu progresso e suas moedas ficam salvos neste navegador.</p>
    </div>`;
  document.body.append(cfgDlg);

  byId("cfgSom").onchange = e => { cfg.som = e.target.checked; saveCfg(); };
  byId("cfgVib").onchange = e => { cfg.vibracao = e.target.checked; saveCfg(); };
  byId("cfgReset").onclick = () => {
    cfgDlg.close();
    notice("Reiniciar progresso?",
      "Isso apaga moedas, fases concluídas e desbloqueios deste navegador. Não dá para desfazer.",
      "Apagar tudo",
      () => { try { localStorage.removeItem(STORAGE); } catch (e) {} location.reload(); });
  };

  [shop, cfgDlg].forEach(d => d.addEventListener("click", e => {
    if (e.target === d || e.target.dataset.close !== undefined) d.close();
  }));

  function abrirLoja() { shop.showModal(); }
  function abrirConfig() {
    byId("cfgSom").checked = cfg.som;
    byId("cfgVib").checked = cfg.vibracao;
    cfgDlg.showModal();
  }

  /* ================= SOM E VIBRAÇÃO AO ACHAR PALAVRA ================= */

  let ac = null;
  function beep() {
    if (!cfg.som) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "triangle"; o.frequency.value = 660;
      g.gain.setValueAtTime(.15, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .18);
      o.connect(g).connect(ac.destination);
      o.start(); o.stop(ac.currentTime + .2);
    } catch (e) {}
  }
  new MutationObserver(() => {
    if (byId("message").textContent.startsWith("Muito bem!")) {
      beep();
      if (cfg.vibracao && navigator.vibrate) navigator.vibrate(40);
    }
  }).observe(byId("message"), { childList: true, characterData: true, subtree: true });

  /* ================= BOTÕES DO MENU ================= */

  const acoes = {
    jogar:  () => openWorld(state.lastWorld || "natureza"),
    mundos: () => { updateHud(); show("worldsScreen"); },
    loja:   abrirLoja,
    config: abrirConfig
  };

  const CALIBRAR = location.hash === "#calibrar";

  if (!CALIBRAR) {
    Object.keys(acoes).forEach(k => {
      hot[k].addEventListener("click", acoes[k]);
      hot[k].addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); acoes[k](); }
      });
    });
  }

  /* ================= MODO DE CALIBRAÇÃO (index.html#calibrar) ================= */
  // Arraste cada caixa vermelha para cima do botão correspondente na imagem
  // e puxe o canto inferior direito para ajustar o tamanho.
  // Copie o texto da caixa de baixo e cole no lugar de HOTSPOTS acima.

  function calibrar() {
    const out = document.createElement("textarea");
    out.className = "mn-cal-out";
    out.readOnly = true;
    document.body.append(out);

    const atualizar = () => {
      const r = {};
      Object.entries(hot).forEach(([k, el]) => {
        const W = stage.clientWidth, H = stage.clientHeight;
        r[k] = {
          x: +(el.offsetLeft / W * 100).toFixed(1),
          y: +(el.offsetTop / H * 100).toFixed(1),
          w: +(el.offsetWidth / W * 100).toFixed(1),
          h: +(el.offsetHeight / H * 100).toFixed(1),
          label: HOTSPOTS[k].label
        };
      });
      out.value = "const HOTSPOTS = " + JSON.stringify(r, null, 2) + ";";
    };

    Object.values(hot).forEach(el => {
      el.classList.add("cal");
      new ResizeObserver(atualizar).observe(el);
      el.addEventListener("pointerdown", e => {
        if (e.offsetX > el.clientWidth - 20 && e.offsetY > el.clientHeight - 20) return; // canto de redimensionar
        el.setPointerCapture(e.pointerId);
        const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
        const mv = ev => {
          el.style.left = ((ox + ev.clientX - sx) / stage.clientWidth * 100) + "%";
          el.style.top = ((oy + ev.clientY - sy) / stage.clientHeight * 100) + "%";
          atualizar();
        };
        const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); };
        el.addEventListener("pointermove", mv);
        el.addEventListener("pointerup", up);
      });
    });
    atualizar();
  }

  if (CALIBRAR) calibrar();

  updateHud();
})();
