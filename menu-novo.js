/* MENU PREMIUM — CAÇA-PALAVRAS (com imagens) */

(function () {
  "use strict";

  const byId = id => document.getElementById(id);
  const home = byId("homeScreen");

  if (!home) return;

  // Imagem de cada mundo (nomes iguais aos do repositório)
  const IMAGES = {
    natureza: "natureza.png",
    lunar: "lunar.png",
    magico: "magico.png",
    mar: "fundo-do-mar.png",
    ceu: "ceu.png"
  };

  home.innerHTML = `
    <div class="mn-scene">
      <div class="mn-wrap">

        <header class="mn-top">

          <div class="mn-coins">
            <span class="mn-coin" aria-hidden="true">$</span>
            <strong id="homeCoins">150</strong>
            <button class="mn-plus" id="shopButton" type="button" aria-label="Comprar moedas">+</button>
          </div>

          <button class="mn-gear" id="settingsButton" type="button" aria-label="Configurações">⚙</button>

        </header>

        <div class="mn-sign">
          <h1>🔍 Caça-Palavras</h1>
          <p>Escolha um mundo para jogar!</p>
        </div>

        <div id="worldGrid" class="mn-worlds" aria-label="Escolha um mundo"></div>

        <footer class="mn-foot">
          <div id="homeProgress">0/630 fases</div>
          <div class="mn-total"><i id="homeTotalBar" style="width:0%"></i></div>
        </footer>

      </div>
    </div>
  `;

  byId("shopButton").addEventListener("click", function () {
    notice(
      "Loja de moedas",
      "A loja poderá ser conectada a compras dentro do aplicativo quando a versão de publicação estiver definida."
    );
  });

  byId("settingsButton").addEventListener("click", function () {
    notice(
      "Configurações",
      "Seu progresso e suas moedas ficam salvos neste navegador. Em outro dispositivo, será necessário implementar uma conta e sincronização em nuvem."
    );
  });

  window.renderWorlds = function renderWorlds() {

    const grid = byId("worldGrid");

    if (!grid || typeof WORLDS === "undefined") return;

    grid.innerHTML = "";

    ORDER.forEach(key => {

      const world = WORLDS[key];
      const missing = Math.max(0, world.start - totalDone());
      const locked = missing > 0;
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
        <div class="mn-art" aria-hidden="true"></div>

        <div class="mn-info">
          <strong></strong>
          <small></small>
          <div class="mn-bar"><i></i></div>
        </div>

        <span class="mn-go"></span>
      `;

      card.querySelector(".mn-art").style.backgroundImage =
        `url("${IMAGES[key]}")`;

      card.querySelector(".mn-info strong").textContent = world.name;

      card.querySelector(".mn-info small").textContent =
        `${done}/${world.phases} fases`;

      card.querySelector(".mn-bar i").style.width =
        `${Math.min(100, done / world.phases * 100)}%`;

      card.querySelector(".mn-go").textContent =
        locked ? `🔒 Faltam ${missing}` : "▶ Jogar";

      card.addEventListener("click", function () {
        openWorld(key);
      });

      grid.appendChild(card);

    });

    const totalBar = byId("homeTotalBar");

    if (totalBar) {
      totalBar.style.width =
        `${Math.min(100, totalDone() / TOTAL_PHASES * 100)}%`;
    }

  };

  if (typeof updateHud === "function") {
    updateHud();
  } else {
    window.renderWorlds();
  }

})();
