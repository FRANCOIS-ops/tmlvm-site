// Données de la méthode en 14 jours
const dayData = [
  {
    day: 1,
    title: "Cartographier votre réalité",
    description: "Listez tout ce qui vous occupe vraiment : tâches visibles, demandes informelles, notifications.",
    points: [
      "Inventaire complet de vos canaux de sollicitations",
      "Estimation du temps réellement passé vs temps perçu",
      "Identification des urgences fictives"
    ]
  },
  {
    day: 2,
    title: "Calmer l'urgence",
    description: "Fermez les canaux non essentiels pendant 30 minutes, mesurez la différence.",
    points: [
      "Configurer des réponses automatiques",
      "Bloquer des créneaux focus",
      "Prévenir votre équipe"
    ]
  },
  {
    day: 3,
    title: "Limiter la journée",
    description: "Fixez une heure de fin non négociable pour éviter les soirées interminables.",
    points: [
      "Choisir une heure réaliste",
      "Planifier le rituel de fermeture",
      "Préparer la journée suivante"
    ]
  },
  {
    day: 4,
    title: "Prioriser par impact",
    description: "Classez vos tâches selon impact / énergie.",
    points: [
      "Utiliser la matrice 2x2",
      "Attribuer des durées",
      "Reporter ce qui n'apporte pas"
    ]
  },
  {
    day: 5,
    title: "Domestiquer les emails",
    description: "Passez de la réactivité à des sessions contrôlées.",
    points: [
      "Trois créneaux par jour",
      "Filtres automatiques",
      "Modèles de réponse"
    ]
  },
  {
    day: 6,
    title: "Informer votre entourage",
    description: "Annoncez vos nouvelles règles : disponibilité, délais, modes de réponse.",
    points: [
      "Message clair à l'équipe",
      "Alignement avec le manager",
      "Script pour les clients"
    ]
  },
  {
    day: 7,
    title: "Dire non sans culpabiliser",
    description: "Utilisez la méthode Sandwich pour poser des limites fermes.",
    points: [
      "Reconnaître la demande",
      "Rappeler vos priorités",
      "Proposer une alternative"
    ]
  },
  {
    day: 8,
    title: "Audit de réunions",
    description: "Passez en revue vos réunions, gardez seulement celles avec un objectif.",
    points: [
      "Annuler ou décliner",
      "Proposer un document partagé",
      "Limiter la durée"
    ]
  },
  {
    day: 9,
    title: "Déléguer intelligemment",
    description: "Identifiez les tâches qui peuvent être confiées.",
    points: [
      "Check-list de délégation",
      "Clarté sur les attentes",
      "Boucle de feedback"
    ]
  },
  {
    day: 10,
    title: "IA coéquipière",
    description: "Utilisez l'IA pour préparer vos synthèses et vos drafts.",
    points: [
      "Lister vos cas d'usage",
      "Tester un prompt",
      "Réviser avant envoi"
    ]
  },
  {
    day: 11,
    title: "Rituels d'énergie",
    description: "Ajoutez des micro-pauses pour éviter les crashs d'attention.",
    points: [
      "Pause respiration",
      "Étirements",
      "Check émotionnel"
    ]
  },
  {
    day: 12,
    title: "Revue hebdo",
    description: "Bilan sur vos progrès, ajustez vos limites.",
    points: [
      "Mesurer ce qui marche",
      "Identifier les rechutes",
      "Prévoir la semaine suivante"
    ]
  },
  {
    day: 13,
    title: "Négociation avec la hiérarchie",
    description: "Préparez un échange basé sur les données collectées.",
    points: [
      "Rappeler les faits",
      "Proposer des ajustements",
      "Demander un arbitrage"
    ]
  },
  {
    day: 14,
    title: "Installer l'après",
    description: "Créez votre tableau de bord personnel pour continuer.",
    points: [
      "Indicateurs simples",
      "Routine mensuelle",
      "Plan anti-rechute"
    ]
  }
];

// Récupération des éléments DOM
const dayButtonsContainer = document.getElementById("day-buttons");
const dayDetail = document.getElementById("day-detail");

// Création des boutons Jour 1 → Jour 14
function renderDayButtons() {
  dayButtonsContainer.innerHTML = "";

  dayData.forEach(item => {
    const button = document.createElement("button");
    button.textContent = `Jour ${item.day}`;
    button.className =
      "day-button border border-slate-200 rounded-2xl py-3 px-4 text-left text-sm font-medium bg-white hover:border-cyan-400 transition";
    button.dataset.day = item.day;

    button.addEventListener("click", () => {
      updateDayDetail(item.day);
    });

    dayButtonsContainer.appendChild(button);
  });

  // Initialisation sur Jour 1
  updateDayDetail(1);
}

// Mise à jour du bouton actif
function updateActiveButton(day) {
  document.querySelectorAll(".day-button").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.day) === day);
  });
}

// Mise à jour du contenu détaillé
function updateDayDetail(day) {
  const data = dayData.find(d => d.day === day);
  if (!data) return;

  dayDetail.innerHTML = `
    <p class="text-cyan-500 font-semibold uppercase tracking-[0.4em] text-xs">
      Jour ${data.day}
    </p>
    <h3 class="text-2xl font-bold mt-2 mb-4">
      ${data.title}
    </h3>
    <p class="text-slate-600">
      ${data.description}
    </p>
    <ul class="mt-6 space-y-3 text-slate-700">
      ${data.points.map(point => `<li>• ${point}</li>`).join("")}
    </ul>
  `;

  updateActiveButton(day);
}

// Lancement
renderDayButtons();
