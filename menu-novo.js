/* TELA PRINCIPAL — CAÇA-PALAVRAS
   Usa a arte principal.png exatamente como desenhada (900 x 1600).
   Por cima dela ficam apenas:
   - botões invisíveis nos 5 mundos, na loja (+) e nas configurações (engrenagem);
   - o número de moedas, desenhado sobre um "remendo" que esconde o "200" fixo da imagem.
   Mantém moedas, progresso e desbloqueio dos mundos.
*/
(function () {
  "use strict";

  const byId = id => document.getElementById(id);
  const home = byId("homeScreen");
  if (!home) return;

  /* Posições medidas na imagem original (em pixels de 900 x 1600). */
  const IMG_W = 900, IMG_H = 1600;
  const pct = (v, total) => (v / total * 100).toFixed(3) + "%";
  const box = (x, y, w, h) =>
    `left:${pct(x, IMG_W)};top:${pct(y, IMG_H)};width:${pct(w, IMG_W)};height:${pct(h, IMG_H)};`;

  const CARDS = {
    natureza: box(40, 505, 825, 192),
    lunar:    box(40, 728, 825, 176),
    magico:   box(40, 932, 825, 178),
    mar:      box(40, 1136, 825, 166),
    ceu:      box(40, 1328, 825, 168)
  };
  const SHOP_BOX = box(264, 48, 80, 82);
  const GEAR_BOX = box(762, 26, 104, 104);
  const COIN_BOX = box(146, 56, 112, 58);

  const css = `
  #homeScreen{padding:0;display:block;background:#2f7fc4}
  .pm-scene{
    --w:min(100vw,calc(100vh*.5625));
    position:relative;display:flex;align-items:center;justify-content:center;
    min-height:100vh;overflow:hidden;background:#2f7fc4;
  }
  @supports (height:100dvh){
    .pm-scene{--w:min(100vw,calc(100dvh*.5625));min-height:100dvh}
  }
  /* Faixa que sobra em telas mais compridas: a mesma arte, desfocada. */
  .pm-scene::before{
    content:"";position:absolute;inset:-40px;
    background:url("principal.png") center/cover no-repeat;
    filter:blur(18px) brightness(.92);
  }
  .pm-stage{
    position:relative;flex:none;width:var(--w);height:calc(var(--w)*16/9);
    background:url("principal.png") center/100% 100% no-repeat;
  }
  .pm-hit{
    position:absolute;display:block;margin:0;padding:0;border:0;background:transparent;
    cursor:pointer;-webkit-tap-highlight-color:transparent;color:transparent;font-size:0;
    transition:background .12s;
  }
  .pm-hit:active{background:rgba(255,255,255,.16)}
  .pm-hit:focus-visible{outline:4px solid #fff;outline-offset:2px}
  .pm-card{border-radius:calc(var(--w)*.05)}
  .pm-round{border-radius:50%}
  /* Esconde o "200" da imagem e escreve o valor real das moedas. */
  .pm-coin-patch{
    position:absolute;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(180deg,#164e7f 0%,#0a3a62 45%,#062446 100%);
    border-radius:calc(var(--w)*.012);
    pointer-events:none;
  }
  .pm-coin-patch strong{
    font:900 calc(var(--w)*.058)/1 "Trebuchet MS",Arial,sans-serif;
    color:#fff;white-space:nowrap;letter-spacing:.01em;
    text-shadow:0 calc(var(--w)*.004) 0 rgba(0,20,45,.55);
  }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  home.innerHTML = `
    <div class="pm-scene">
      <div class="pm-stage" role="group" aria-label="Menu principal do Caça-Palavras">
        <div class="pm-coin-patch" style="${COIN_BOX}"><strong id="homeCoins">150</strong></div>
        <button class="pm-hit pm-round" id="shopButton" type="button" aria-label="Loja de moedas" style="${SHOP_BOX}">+</button>
        <button class="pm-hit pm-round" id="settingsButton" type="button" aria-label="Configurações" style="${GEAR_BOX}">⚙</button>
        <div id="worldGrid" aria-label="Escolha um mundo"></div>
      </div>
    </div>
  `;

  byId("shopButton").onclick = function () {
    if (typeof notice === "function") {
      notice("Loja de moedas", "A loja de moedas poderá ser conectada futuramente.");
    }
  };

  byId("settingsButton").onclick = function () {
    if (typeof notice === "function") {
      notice("Configurações", "Seu progresso e suas moedas ficam salvos neste navegador.");
    }
  };

  /* Reduz a fonte se o número de moedas passar de 3 dígitos, para caber no remendo. */
  function fitCoins() {
    const el = byId("homeCoins");
    if (!el) return;
    const len = String(el.textContent).length;
    el.style.fontSize = len > 3
      ? `calc(var(--w) * ${(0.058 * 3.1 / len).toFixed(4)})`
      : "";
  }

  /* Desenha só as áreas clicáveis; o visual vem todo da imagem. */
  window.renderWorlds = function renderWorlds() {
    const grid = byId("worldGrid");
    if (!grid || typeof WORLDS === "undefined") return;

    grid.innerHTML = "";

    ORDER.forEach(key => {
      const world = WORLDS[key];
      const missing = Math.max(0, world.start - totalDone());
      const locked = !window.TESTE_LIBERADO && missing > 0;
      const done = worldDone(key);

      const hit = document.createElement("button");
      hit.type = "button";
      hit.className = "pm-hit pm-card";
      hit.style.cssText = CARDS[key] || "";
      hit.setAttribute(
        "aria-label",
        `Mundo ${world.name}, ${done} de ${world.phases} fases` +
        (locked ? `, bloqueado, faltam ${missing}` : ", jogar")
      );
      hit.addEventListener("click", () => openWorld(key));
      grid.appendChild(hit);
    });

    fitCoins();
  };

  if (typeof updateHud === "function") updateHud();
  else window.renderWorlds();
})();
