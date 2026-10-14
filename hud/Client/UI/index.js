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

    // Sous 25 : le HUD passe au rouge Hollow
    const low = value <= 25;
    document.getElementById("health_fill").style.background = low
        ? "linear-gradient(90deg, #d24a3a, #f08a7a)"
        : "linear-gradient(90deg, #9fb7d1, #efeae0)";
});

// Carte du joueur (nom et division), envoyée par Lua via UpdatePlayer
Events.Subscribe("UpdatePlayer", function(name, division) {
    document.getElementById("player_name").textContent = name;
    document.getElementById("player_division").textContent = "DIVISION " + division;
});

// Boussole : cap en degrés (0 = Nord), envoyé par Lua via UpdateCompass
Events.Subscribe("UpdateCompass", function(heading) {
    // Déplace la bande de points cardinaux selon le cap
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
