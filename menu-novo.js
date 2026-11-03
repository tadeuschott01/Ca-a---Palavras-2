/* MENU PREMIUM — CAÇA-PALAVRAS
   Mantém moedas, progresso e desbloqueio dos mundos.
   O modo de teste libera os cinco mundos quando TESTE_LIBERADO = true.
*/
(function () {
  "use strict";

  const byId = id => document.getElementById(id);
  const home = byId("homeScreen");
  if (!home) return;

  home.innerHTML = `
    <div class="mn-scene">
      <div class="mn-cloud mn-c1" aria-hidden="true"></div>
      <div class="mn-cloud mn-c2" aria-hidden="true"></div>
      <div class="mn-wrap">
        <header class="mn-top">
          <div class="mn-coins">
            <span class="mn-coin" aria-hidden="true">🪙</span>
            <strong id="homeCoins">150</strong>
            <button class="mn-plus" id="shopButton" type="button" aria-label="Loja de moedas">+</button>
          </div>
          <button class="mn-gear" id="settingsButton" type="button" aria-label="Configurações">⚙</button>
        </header>

        <div class="mn-sign">
          <h1>🔍 Caça-Palavras</h1>
          <p>Aventura dos Mundos</p>
          <small>Escolha um mundo para jogar!</small>
        </div>

        <div id="worldGrid" class="mn-worlds" aria-label="Escolha um mundo"></div>

        <footer class="mn-foot">
          <div id="homeProgress">0/630 fases</div>
          <div class="mn-total"><i id="homeTotalBar" style="width:0%"></i></div>
          <small>Seu progresso na aventura</small>
        </footer>
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

  window.renderWorlds = function renderWorlds() {
    const grid = byId("worldGrid");
    if (!grid || typeof WORLDS === "undefined") return;

    grid.innerHTML = "";

    ORDER.forEach(key => {
      const world = WORLDS[key];
      const missing = Math.max(0, world.start - totalDone());
      const locked = !window.TESTE_LIBERADO && missing > 0;
      const done = worldDone(key);

      const card = document.createElement("button");
      card.type = "button";
      card.className = `mn-card w-${key}` + (locked ? " locked" : "");
      card.setAttribute(
        "aria-label",
        `Mundo ${world.name}, ${done} de ${world.phases} fases` +
        (locked ? `, bloqueado, faltam ${missing}` : ", jogar")
      );

      card.innerHTML = `
        <div class="mn-art" aria-hidden="true">${world.emoji}</div>
        <div class="mn-info">
          <strong></strong>
          <small></small>
          <div class="mn-bar"><i></i></div>
        </div>
        <span class="mn-go"></span>
      `;

      card.querySelector(".mn-info strong").textContent = world.name;
      card.querySelector(".mn-info small").textContent = `${done}/${world.phases} fases`;
      card.querySelector(".mn-bar i").style.width =
        `${Math.min(100, done / world.phases * 100)}%`;
      card.querySelector(".mn-go").textContent =
        locked ? `🔒 Faltam ${missing}` : "▶ Jogar";

      card.addEventListener("click", () => openWorld(key));
      grid.appendChild(card);
    });

    const totalBar = byId("homeTotalBar");
    if (totalBar) {
      totalBar.style.width =
        `${Math.min(100, totalDone() / TOTAL_PHASES * 100)}%`;
    }
  };

  if (typeof updateHud === "function") updateHud();
  else window.renderWorlds();
})();
