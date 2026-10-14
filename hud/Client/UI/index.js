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
