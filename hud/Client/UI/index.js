// Mise à jour des munitions (envoyée par Lua via UpdateWeaponAmmo)
Events.Subscribe("UpdateWeaponAmmo", function(enable, clip, bag) {
    const container = document.getElementById("weapon_ammo_container");
    container.style.display = enable ? "flex" : "none";
    document.getElementById("weapon_ammo_clip").textContent = clip;
    document.getElementById("weapon_ammo_bag").textContent = "/ " + bag;
});

// Mise à jour de la vie (envoyée par Lua via UpdateHealth)
Events.Subscribe("UpdateHealth", function(health) {
    const value = Math.max(0, Math.round(health));
    document.getElementById("health_current").textContent = value;
    document.getElementById("health_fill").style.width = Math.min(100, value) + "%";

    // Sous 25 : la barre passe au rouge Hollow
    const low = value <= 25;
    document.getElementById("health_fill").style.background = low
        ? "linear-gradient(90deg, #d24a3a, #f08a7a)"
        : "linear-gradient(90deg, #9fb7d1, #efeae0)";

    // Halo de reiatsu : bords rouges sous 25
    document.getElementById("vignette").classList.toggle("on", low);
});

// Carte du joueur (nom et division), envoyée par Lua via UpdatePlayer
Events.Subscribe("UpdatePlayer", function(name, division) {
    document.getElementById("player_name").textContent = name;
    document.getElementById("player_division").textContent = "DIVISION " + division;
});

// Boussole : cap en degrés (0 = Nord), envoyé par Lua via UpdateCompass
Events.Subscribe("UpdateCompass", function(heading) {
    const strip = document.getElementById("compass_strip");
    const offset = -((heading % 360) / 360) * 400;
    strip.style.transform = "translateX(" + offset + "px)";
});

// Fil d'événements (kill, alerte...), envoyé par Lua via AddFeed
Events.Subscribe("AddFeed", function(text, kind) {
    const feed = document.getElementById("feed");
    const line = document.createElement("div");
    line.className = "feed_line " + (kind || "info");
    line.textContent = text;
    feed.prepend(line);
    // Chaque ligne disparaît après 5 secondes
    setTimeout(() => line.remove(), 5000);
    // Limite à 5 lignes visibles
    while (feed.children.length > 5) feed.lastChild.remove();
});

// Invite d'action (ex. « Ramasser »), envoyée par Lua via ShowPrompt
Events.Subscribe("ShowPrompt", function(key, text) {
    document.getElementById("prompt_key").textContent = key;
    document.getElementById("prompt_text").textContent = text;
    document.getElementById("prompt").classList.remove("hidden");
});

// Cache l'invite d'action, envoyée par Lua via HidePrompt
Events.Subscribe("HidePrompt", function() {
    document.getElementById("prompt").classList.add("hidden");
});

// Chat : ajoute un message, envoyé par Lua via AddChat
Events.Subscribe("AddChat", function(author, text) {
    const log = document.getElementById("chat_log");
    const line = document.createElement("div");
    line.className = "chat_line";
    const who = document.createElement("span");
    who.className = "chat_author";
    who.textContent = author + " : ";
    line.appendChild(who);
    line.appendChild(document.createTextNode(text));
    log.appendChild(line);
    // Garde les 8 derniers messages, et les fait disparaître après 12 secondes
    while (log.children.length > 8) log.firstChild.remove();
    setTimeout(() => line.classList.add("fade"), 12000);
});

// Bandeau de mission : titre et progression (0 à 100), envoyé par Lua via UpdateMission
Events.Subscribe("UpdateMission", function(title, progress) {
    document.getElementById("mission_title").textContent = title;
    document.getElementById("mission_fill").style.width = Math.max(0, Math.min(100, progress)) + "%";
});

// Barre d'XP et rang, envoyée par Lua via UpdateXP
Events.Subscribe("UpdateXP", function(rank, progress) {
    document.getElementById("xp_text").textContent = "Rang " + rank;
    document.getElementById("xp_fill").style.width = Math.max(0, Math.min(100, progress)) + "%";
});

// Capacité : emplacement (0 à 3), libellé et cooldown restant de 0 à 1, envoyé par Lua via SetAbility
Events.Subscribe("SetAbility", function(slot, label, cooldown) {
    const el = document.querySelector('#abilities .slot[data-slot="' + slot + '"]');
    if (!el) return;
    el.querySelector(".label").textContent = label;
    el.querySelector(".cd").style.height = Math.max(0, Math.min(1, cooldown)) * 100 + "%";
});

// Hotbar : emplacement (0 à 4), libellé et état actif, envoyé par Lua via SetHotbar
Events.Subscribe("SetHotbar", function(slot, label, active) {
    const el = document.querySelector('#hotbar .hot[data-hot="' + slot + '"]');
    if (!el) return;
    el.querySelector(".label").textContent = label;
    el.classList.toggle("active", !!active);
});

// Indicateur de dégâts : flash sous le réticule, envoyé par Lua via HitMarker
Events.Subscribe("HitMarker", function() {
    const hit = document.getElementById("hit");
    hit.classList.remove("flash");
    void hit.offsetWidth; // relance l'animation
    hit.classList.add("flash");
});

// Écran de mort avec compte à rebours, envoyé par Lua via ShowDeath (secondes restantes)
let deathTimer = null;
Events.Subscribe("ShowDeath", function(seconds) {
    document.getElementById("death").classList.remove("hidden");
    let left = seconds;
    document.getElementById("death_seconds").textContent = left;
    clearInterval(deathTimer);
    deathTimer = setInterval(function () {
        left--;
        document.getElementById("death_seconds").textContent = Math.max(0, left);
        if (left <= 0) clearInterval(deathTimer);
    }, 1000);
});

// Fin de l'écran de mort, envoyée par Lua via HideDeath
Events.Subscribe("HideDeath", function() {
    clearInterval(deathTimer);
    document.getElementById("death").classList.add("hidden");
});

// Tableau des scores : on vide, on ajoute des lignes, puis on affiche ou cache
Events.Subscribe("ClearScore", function() {
    document.getElementById("score_rows").innerHTML = "";
});
Events.Subscribe("AddScoreRow", function(name, division, kills) {
    const tr = document.createElement("tr");
    [name, "Division " + division, kills].forEach(function (value) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
    });
    document.getElementById("score_rows").appendChild(tr);
});
Events.Subscribe("ShowScoreboard", function(show) {
    document.getElementById("scoreboard").classList.toggle("hidden", !show);
});

// Notification : texte qui apparaît puis disparaît, envoyé par Lua via Toast
Events.Subscribe("Toast", function(text) {
    const box = document.getElementById("toasts");
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = text;
    box.appendChild(item);
    setTimeout(() => item.classList.add("out"), 3500);
    setTimeout(() => item.remove(), 4200);
});
