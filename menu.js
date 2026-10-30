/* Novo menu mobile do Caça-Palavras: substitui a imagem PNG por um menu feito em HTML/CSS. */
(function () {
  const css = `
  #homeScreen{padding:0;display:block;background:#173d25}
  .mn-scene{position:relative;min-height:100vh;overflow:hidden;padding:max(14px,env(safe-area-inset-top)) 14px max(20px,env(safe-area-inset-bottom));
    background:linear-gradient(#69bff0 0,#b6e3f7 22%,#8fd07a 42%,#3d9142 66%,#173d25 100%)}
  .mn-cloud{position:absolute;height:34px;width:120px;border-radius:40px;background:#fff;opacity:.85}
  .mn-cloud:before{content:"";position:absolute;left:22px;top:-18px;width:48px;height:48px;border-radius:50%;background:#fff}
  .mn-c1{left:8%;top:22%}.mn-c2{right:6%;top:9%;transform:scale(.75)}
  .mn-wrap{position:relative;z-index:1;max-width:1100px;margin:0 auto}
  .mn-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
  .mn-coins{display:flex;align-items:center;gap:8px;padding:5px 5px 5px 6px;border-radius:40px;background:linear-gradient(#1d3a50,#0b1c2b);border:3px solid #3a5a76;box-shadow:0 4px 0 #07131d}
  .mn-coin{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-weight:900;color:#a86400;background:radial-gradient(circle at 35% 30%,#fff3a0,#ffc61a 60%,#d98a00);border:2px solid #f0a800}
  .mn-coins strong{font-size:22px;min-width:44px;text-align:center}
  .mn-plus{width:32px;height:32px;border-radius:50%;border:2px solid #c3ecae;background:linear-gradient(#56f34c,#00952c);color:#fff;font-size:22px;font-weight:900;line-height:1;padding:0}
  .mn-gear{width:46px;height:46px;border-radius:50%;border:3px solid #5b6168;background:linear-gradient(#3a3f45,#1b1e22);font-size:22px;box-shadow:0 4px 0 #000a;padding:0}
  .mn-sign{margin:18px auto 20px;max-width:440px;text-align:center;padding:14px 16px 12px;border-radius:20px;border:5px solid #5a2e10;
    background:repeating-linear-gradient(90deg,#a8662d 0 34px,#9a5a26 34px 36px);box-shadow:0 6px 0 #3c2010,0 14px 20px #0005}
  .mn-sign h1{margin:0;font-size:clamp(30px,9vw,46px);line-height:1;color:#ffd34e;-webkit-text-stroke:2px #7a3d0c;paint-order:stroke fill;text-shadow:0 4px 0 #5a2e10}
  .mn-sign p{display:inline-block;margin:10px 0 0;padding:4px 12px;border-radius:8px;border:2px solid #b57b35;background:#f7e6b8;color:#4b2b14;font-weight:900;font-size:14px}
  .mn-worlds{display:flex;flex-direction:column;gap:12px}
  .mn-card{position:relative;display:grid;grid-template-columns:84px 1fr auto;align-items:center;gap:12px;width:100%;text-align:left;color:#fff;padding:10px 12px 10px 10px;
    border-radius:22px;border:4px solid rgba(255,255,255,.55);box-shadow:0 5px 0 rgba(0,0,0,.35),0 12px 18px #0004;transition:transform .12s}
  .mn-card:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.35)}
  .mn-art{height:72px;border-radius:50%;display:grid;place-items:center;font-size:42px;background:rgba(255,255,255,.22);box-shadow:inset 0 0 0 3px rgba(255,255,255,.35)}
  .mn-info strong{display:block;font-size:20px;text-shadow:0 2px 0 rgba(0,0,0,.35)}
  .mn-info small{display:block;font-size:13px;font-weight:700;opacity:.95;margin:2px 0 7px}
  .mn-bar{height:8px;border-radius:8px;background:rgba(0,0,0,.35);overflow:hidden}
  .mn-bar i{display:block;height:100%;background:linear-gradient(90deg,#fff08a,#ffc61a)}
  .mn-go{padding:10px 14px;border-radius:30px;font-weight:900;font-size:15px;white-space:nowrap;background:linear-gradient(#4edc55,#087b2b);border:2px solid #c3ecae;box-shadow:0 3px 0 #05501c}
  .mn-card.locked{filter:saturate(.45) brightness(.8)}
  .mn-card.locked .mn-go{background:linear-gradient(#444a55,#22262e);border-color:#8a8f99;box-shadow:0 3px 0 #000;font-size:12px;white-space:normal;text-align:center;max-width:92px}
  .mn-card:focus-visible,.mn-plus:focus-visible,.mn-gear:focus-visible{outline:4px solid #fff;outline-offset:2px}
  .w-natureza{background:linear-gradient(#3aa650,#0f5a26)}
  .w-lunar{background:linear-gradient(#3a31a0,#140f40)}
  .w-magico{background:linear-gradient(#8a45d0,#3a1a6a)}
  .w-mar{background:linear-gradient(#2a95dc,#08305c)}
  .w-ceu{background:linear-gradient(#8cc6f8,#3f7fd4)}
  .mn-foot{margin:18px auto 0;max-width:440px;padding:12px 16px;border-radius:20px;background:#0007;border:2px solid #fff4;text-align:center}
  #homeProgress{font-weight:900;font-size:16px;margin-bottom:8px}
  .mn-total{height:10px;border-radius:10px;background:#0006;overflow:hidden}
  .mn-total i{display:block;height:100%;background:linear-gradient(90deg,#6fe34b,#0c9a37)}
  @media(min-width:760px){
    .mn-worlds{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
    .mn-card{grid-template-columns:1fr;justify-items:center;text-align:center;padding:16px 10px 14px;border-radius:90px 90px 24px 24px}
    .mn-art{width:100%;height:150px;border-radius:80px 80px 18px 18px;font-size:70px}
    .mn-info{width:100%}
  }
  @media(prefers-reduced-motion:reduce){.mn-card{transition:none}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  const g = id => document.getElementById(id);
  const oldShop = g("shopButton").onclick;
  const oldSettings = g("settingsButton").onclick;

  g("homeScreen").innerHTML = `
    <div class="mn-scene">
      <div class="mn-cloud mn-c1"></div><div class="mn-cloud mn-c2"></div>
      <div class="mn-wrap">
        <header class="mn-top">
          <div class="mn-coins">
            <span class="mn-coin">$</span><strong id="homeCoins">150</strong>
            <button class="mn-plus" id="shopButton" aria-label="Comprar moedas">+</button>
          </div>
          <button class="mn-gear" id="settingsButton" aria-label="Configurações">⚙️</button>
        </header>
        <div class="mn-sign">
          <h1>🔍 Caça-Palavras</h1>
          <p>Escolha um mundo para jogar!</p>
        </div>
        <div id="worldGrid" class="mn-worlds"></div>
        <footer class="mn-foot">
          <div id="homeProgress">0/630 fases</div>
          <div class="mn-total"><i id="homeTotalBar" style="width:0%"></i></div>
        </footer>
      </div>
    </div>`;

  g("shopButton").onclick = oldShop;
  g("settingsButton").onclick = oldSettings;

  // Substitui a função que desenhava os botões invisíveis sobre a imagem
  window.renderWorlds = function () {
    const grid = g("worldGrid");
    grid.innerHTML = "";
    ORDER.forEach(key => {
      const w = WORLDS[key];
      const missing = w.start - totalDone();
      const locked = missing > 0;
      const done = worldDone(key);
      const b = document.createElement("button");
      b.className = `mn-card w-${key}` + (locked ? " locked" : "");
      b.setAttribute("aria-label", `Mundo ${w.name}` + (locked ? " (bloqueado)" : ""));
      b.innerHTML = `
        <div class="mn-art">${w.emoji}</div>
        <div class="mn-info">
          <strong>${w.name}</strong>
          <small>${done}/${w.phases} fases</small>
          <div class="mn-bar"><i style="width:${Math.min(100, done / w.phases * 100)}%"></i></div>
        </div>
        <span class="mn-go">${locked ? "🔒 Faltam " + missing : "▶ Jogar"}</span>`;
      b.onclick = () => openWorld(key);
      grid.append(b);
    });
    const bar = g("homeTotalBar");
    if (bar) bar.style.width = (totalDone() / TOTAL_PHASES * 100) + "%";
  };

  updateHud();
})();
