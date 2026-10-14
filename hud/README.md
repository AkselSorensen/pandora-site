# HUD Bleach nanos world (WebUI HTML)

Package HUD inspiré de l'univers Bleach, basé sur le tutoriel officiel « Basic HUD (HTML) » :
https://docs.nanos-world.com/fr/docs/getting-started/tutorials-and-examples/basic-hud-html

Ce dossier n'est pas servi par le site : il sert de package à copier dans nanos world.

## Aucun fichier à télécharger

Le HUD n'utilise ni jQuery ni image externe : les kanji remplacent l'icône de vie, et le JavaScript est en pur DOM.

## Contenu

- **Vie** (bas gauche) : barre de reiatsu avec le kanji 霊圧. Elle passe au rouge Hollow sous 25.
- **Munitions** (bas droite) : chargeur et stock, avec le kanji 残弾. Apparaît quand une arme est tenue.

Le script `Client/Index.lua` n'a pas changé : il envoie toujours `UpdateHealth` et `UpdateWeaponAmmo`.

## Structure

```
Client/
├── Index.lua
└── UI/
    ├── index.html
    ├── style.css
    └── index.js
```
