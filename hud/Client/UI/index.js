// Register for UpdateWeaponAmmo custom event (from Lua)
Events.Subscribe("UpdateWeaponAmmo", function(enable, clip, bag) {
    if (enable)
        $("#weapon_ammo_container").show();
    else
        $("#weapon_ammo_container").hide();

    // Using JQuery, overrides the HTML content of these SPANs with the new Ammo values
    $("#weapon_ammo_clip").html(clip);
    $("#weapon_ammo_bag").html("/ " + bag);
});

// Register for UpdateHealth custom event (from Lua)
Events.Subscribe("UpdateHealth", function(health) {
    // Using JQuery, overrides the HTML content of the SPAN with the new health value
    $("#health_current").html(health);

    // Bonus: make the background red when health below 25
    if (health <= 25)
        $("#health_container").css("background-image", "linear-gradient(to left, #0000, #d00c)");
    else
        $("#health_container").css("background-image", "linear-gradient(to left, #00000000, #00000080)");
});
