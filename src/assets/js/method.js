// Données de la méthode en 15 jours
const dayData = [
  {
    day: 1,
    title: "Les illusions du travail",
    description: "Mon temps est une ressource limitée. Je le gère comme je gère le réservoir d’essence de ma voiture.",
    points: [
      "J’apprends à dire non à des tâches pour ne pas « tomber en panne ».",
      "Je comprends que le travail est élastique : plus je lui laisse de temps, plus il en prend.",
      "Compenser une situation de manque de ressources par un surcroît de travail met l'organisation à risque."
    ]
  },
  {
    day: 2,
    title: "Mesurer son temps pour le réduire",
    description: "Pour gérer mon temps efficacement, je mesure mon temps de travail et je le limite.",
    points: [
      "Je me libère du mythe du gros bosseur : ce qui compte est de travailler bien.",
      "Limiter son temps de travail, c’est redevenir maître de celui-ci.",
      "J’utilise un outil comme Toggl pour mesurer mon temps de travail."
    ]
  },
  {
    day: 3,
    title: "Les gros cailloux d’abord !",
    description: "Je choisis judicieusement là où j’investis mon temps en priorisant mes tâches (matrice Eisenhower).",
    points: [
      "Tâches urgentes et importantes (carré A) : à faire immédiatement.",
      "Importantes mais non urgentes (carré B) : planification proactive.",
      "Urgentes mais non importantes (carré C) : à déléguer ou négocier.",
      "Non urgentes et non importantes (carré D) : à éviter."
    ]
  },
  {
    day: 4,
    title: "Chaque jour une page blanche",
    description: "Commencez chaque jour avec une liste de tâches vierge, sans reprendre celle de la veille.",
    points: [
      "Utilisez un petit papier pour noter les tâches essentielles.",
      "Numérotez les tâches selon leur importance.",
      "Suivez cet ordre scrupuleusement."
    ]
  },
  {
    day: 5,
    title: "L’intelligence artificielle",
    description: "L’IA peut grandement aider à prioriser les tâches grâce à son accès à un contexte large.",
    points: [
      "Les principes fondamentaux d’organisation restent inchangés.",
      "L’IA est un bon serviteur mais je reste seul décisionnaire.",
      "L’intuition humaine (« tripes », « cœur ») devient cruciale."
    ]
  },
  {
    day: 7,
    title: "Votre boîte mail est un piège",
    description: "La majorité des emails sont du « sable ». Y passer trop de temps met à risque les « gros cailloux ».",
    points: [
      "Distinguer « canal d’information » et « canal de priorisation ».",
      "Ne pas lire les emails au fil de l’eau mais par sessions.",
      "Bannir les notifications."
    ]
  },
  {
    day: 8,
    title: "Oui mais les autres ?",
    description: "Quand on me demande une tâche, je vérifie l’importance et l’urgence avant d'accepter.",
    points: [
      "Négocier les modalités ou la date de livraison.",
      "Proposer des alternatives ou demander un arbitrage.",
      "Ne pas prendre en charge les problèmes que les autres peuvent résoudre."
    ]
  },
  {
    day: 9,
    title: "Les réunions",
    description: "Les réunions inefficaces représentent une perte de temps considérable.",
    points: [
      "Avoir un agenda clair pour chaque réunion.",
      "Préférer les formats engageants aux présentations passives.",
      "Utiliser les réunions pour décider, non pour informer.",
      "Documenter rapidement les décisions."
    ]
  },
  {
    day: 10,
    title: "Commencer par la fin",
    description: "Visualiser la destination finale pour orienter ses choix et gagner du temps.",
    points: [
      "Écrire le discours de son propre enterrement (S. Covey).",
      "Cadre de minimisation des regrets (J. Bezos).",
      "Rédiger un « faux communiqué de presse » avant de lancer un projet."
    ]
  },
  {
    day: 11,
    title: "Le sniper plutôt que le tromblon",
    description: "Adopter une approche structurée pour résoudre les problèmes au lieu de proposer des solutions hâtives.",
    points: [
      "Bien définir le problème et son origine.",
      "Analyser les causes profondes.",
      "Explorer toutes les solutions avant de recommander l'optimale."
    ]
  },
  {
    day: 12,
    title: "Perdre du temps pour en gagner",
    description: "Développer une vision stratégique est crucial pour ne pas s'enliser dans l'efficacité aveugle.",
    points: [
      "Se demander « suis-je dans la bonne jungle ? ».",
      "Anticiper et créer l’avenir plutôt que de le subir.",
      "Avoir une boussole (principes) plutôt qu'une carte (plan rigide)."
    ]
  },
  {
    day: 13,
    title: "Le sens, moteur de l’efficacité",
    description: "Un jour philo : plus nous mettons du sens, plus nous sommes motivés.",
    points: [
      "Salaire et estime sociale.",
      "Nouvelles compétences (savoir, savoir-être, savoir-faire).",
      "Service et sentiment d’utilité.",
      "Épanouissement personnel."
    ]
  },
  {
    day: 14,
    title: "Le grand bilan - conclusion",
    description: "Clôture du parcours de 15 jours et projection vers la suite.",
    points: [
      "Revue des apprentissages clés.",
      "Mise en place de rituels durables.",
      "Engagement à long terme."
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
