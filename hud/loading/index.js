// Écran de chargement : barre de progression et conseils qui tournent
const tips = [
    "Le reiatsu se concentre quand tu restes immobile.",
    "Les Hollows apparaissent surtout la nuit, dans les zones sombres.",
    "Une division forte protège ses membres : reste en groupe.",
    "Ta vie remonte lentement hors combat.",
    "Le capitaine de ta division donne les missions."
];

let progress = 0;
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");
const tip = document.getElementById("tip");
let tipIndex = 0;

// Avance de manière irrégulière, pour donner l'impression d'un vrai chargement
const loader = setInterval(function () {
    progress = Math.min(100, progress + 1 + Math.random() * 4);
    fill.style.width = progress + "%";
    percent.textContent = Math.round(progress) + " %";
    if (progress >= 100) clearInterval(loader);
}, 180);

// Change de conseil toutes les 3 secondes
setInterval(function () {
    tip.classList.add("fade");
    setTimeout(function () {
        tipIndex = (tipIndex + 1) % tips.length;
        tip.textContent = tips[tipIndex];
        tip.classList.remove("fade");
    }, 400);
}, 3000);

tip.textContent = tips[0];
