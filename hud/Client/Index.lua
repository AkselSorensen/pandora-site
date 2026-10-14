-- Spawns a WebUI with the HTML file you just created
main_hud = WebUI("Main HUD", "file://UI/index.html")

-- When LocalPlayer spawns, sets an event on it to trigger when we possess a new character. This event is only called once, see Package.Subscribe("Load") for when reloading the package
Client.Subscribe("SpawnLocalPlayer", function(local_player)
    local_player:Subscribe("Possess", function(player, character)
        UpdateLocalCharacter(character)
    end)
end)

-- When package loads, verify if LocalPlayer already exists (eg. when reloading the package), then try to get and store it's controlled character
Package.Subscribe("Load", function()
    local local_player = Client.GetLocalPlayer()
    if (local_player ~= nil) then
        UpdateLocalCharacter(local_player:GetControlledCharacter())
    end
end)

-- Function to set all needed events on local character (to update the UI when it takes damage or dies)
function UpdateLocalCharacter(character)
    -- Verifies if character is not nil (eg. when GetControlledCharacter() doesn't return a character)
    if (character == nil) then return end

    -- Updates the UI with the current character's health
    UpdateHealth(character:GetHealth())

    -- Updates the health UI whenever the health changes (damage, healing, death or respawn)
    character:Subscribe("HealthChange", function(charac, old_health, new_health)
        UpdateHealth(new_health)
    end)

    -- Try to get if the character is holding any weapon
    local current_picked_item = character:GetPicked()

    -- If so, update the UI
    if (current_picked_item and current_picked_item:IsA(Weapon)) then
        UpdateAmmo(true, current_picked_item:GetAmmoClip(), current_picked_item:GetAmmoBag())
    end

    -- Sets on character an event to update his grabbing weapon (to show ammo on UI)
    character:Subscribe("PickUp", function(charac, object)
        if (object:IsA(Weapon)) then
            UpdateAmmo(true, object:GetAmmoClip(), object:GetAmmoBag())
        end
    end)

    -- Sets on character an event to remove the ammo ui when he drops it's weapon
    character:Subscribe("Drop", function(charac, object)
        UpdateAmmo(false)
    end)

    -- Sets on character an event to update the UI when he fires
    character:Subscribe("Fire", function(charac, weapon)
        UpdateAmmo(true, weapon:GetAmmoClip(), weapon:GetAmmoBag())
    end)

    -- Sets on character an event to update the UI when he reloads the weapon
    character:Subscribe("Reload", function(charac, weapon, ammo_to_reload)
        UpdateAmmo(true, weapon:GetAmmoClip(), weapon:GetAmmoBag())
    end)
end

-- Function to update the Ammo's UI
function UpdateAmmo(enable_ui, ammo, ammo_bag)
    -- Each argument after the event name arrives as a separate parameter in JavaScript
    main_hud:CallEvent("UpdateWeaponAmmo", enable_ui, ammo, ammo_bag)
end

-- Function to update the Health's UI
function UpdateHealth(health)
    main_hud:CallEvent("UpdateHealth", health)
end

-- Carte du joueur : nom et division (à brancher sur les vraies données du joueur)
function UpdatePlayer(name, division)
    main_hud:CallEvent("UpdatePlayer", name, division)
end

-- Boussole : cap en degrés (0 = Nord)
function UpdateCompass(heading)
    main_hud:CallEvent("UpdateCompass", heading)
end

-- Fil d'événements : texte et type ("kill", "alert" ou "info")
function AddFeed(text, kind)
    main_hud:CallEvent("AddFeed", text, kind)
end

-- Valeurs de départ pour la carte du joueur (remplace-les par le vrai nom et la vraie division)
UpdatePlayer("Shinigami", 4)

-- Invite d'action : touche et texte affichés sous le réticule
function ShowPrompt(key, text)
    main_hud:CallEvent("ShowPrompt", key, text)
end

-- Cache l'invite d'action
function HidePrompt()
    main_hud:CallEvent("HidePrompt")
end

-- Chat : auteur et message
function AddChat(author, text)
    main_hud:CallEvent("AddChat", author, text)
end

-- Bandeau de mission : titre et progression (0 à 100)
function UpdateMission(title, progress)
    main_hud:CallEvent("UpdateMission", title, progress)
end

-- Barre d'XP et rang
function UpdateXP(rank, progress)
    main_hud:CallEvent("UpdateXP", rank, progress)
end

-- Capacité : emplacement (0 à 3), libellé et cooldown restant (0 à 1)
function SetAbility(slot, label, cooldown)
    main_hud:CallEvent("SetAbility", slot, label, cooldown)
end

-- Hotbar : emplacement (0 à 4), libellé et état actif
function SetHotbar(slot, label, active)
    main_hud:CallEvent("SetHotbar", slot, label, active)
end

-- Indicateur de dégâts sous le réticule (à appeler quand le joueur touche)
function HitMarker()
    main_hud:CallEvent("HitMarker")
end

-- Écran de mort avec compte à rebours (en secondes)
function ShowDeath(seconds)
    main_hud:CallEvent("ShowDeath", seconds)
end

-- Fin de l'écran de mort
function HideDeath()
    main_hud:CallEvent("HideDeath")
end

-- Tableau des scores : vider, ajouter une ligne, puis afficher ou cacher
function ClearScore()
    main_hud:CallEvent("ClearScore")
end

function AddScoreRow(name, division, kills)
    main_hud:CallEvent("AddScoreRow", name, division, kills)
end

function ShowScoreboard(show)
    main_hud:CallEvent("ShowScoreboard", show)
end

-- Notification temporaire (haut centre)
function Toast(text)
    main_hud:CallEvent("Toast", text)
end

-- Menu pause : affiché ou caché
function ShowPause()
    main_hud:CallEvent("ShowPause")
end

function HidePause()
    main_hud:CallEvent("HidePause")
end

-- Les boutons du menu pause envoient "PauseAction" (resume, help, quit) depuis la page.
-- Pour recevoir ces choix côté Lua, il faut la fonction de réception de WebUI documentée
-- par nanos world : à vérifier dans la doc avant de brancher les boutons.
