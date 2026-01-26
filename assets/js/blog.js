// Configuration
const ARTICLES_PER_PAGE = 6;

// Éléments DOM
const blogList = document.getElementById("blog-list");
const blogPagination = document.getElementById("blog-pagination");
const blogSearch = document.getElementById("blog-search");

let allArticles = [];
let filteredArticles = [];
let currentPage = 1;

// Chargement de l’index des articles
fetch("articles.json")
  .then(res => {
    if (!res.ok) throw new Error("Impossible de charger l’index du blog");
    return res.json();
  })
  .then(data => {
    allArticles = data.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
    filteredArticles = [...allArticles];
    render();
  })
  .catch(err => {
    console.error(err);
    blogList.innerHTML =
      `<div class="text-center p-8 bg-red-50 rounded-xl border border-red-100">
         <p class="text-red-600 font-bold mb-2">Erreur de chargement des articles</p>
         <p class="text-sm text-red-500 font-mono">${err.message}</p>
         <p class="text-xs text-slate-400 mt-4">Vérifiez que vous consultez bien le site via un serveur local (http://localhost:...) et non directement le fichier.</p>
       </div>`;
  });

// Rendu principal
function render() {
  renderArticles();
  renderPagination();
}

// Rendu des articles
function renderArticles() {
  blogList.innerHTML = "";

  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const pageArticles = filteredArticles.slice(start, end);

  if (pageArticles.length === 0) {
    blogList.innerHTML =
      "<p class='text-slate-500'>Aucun article trouvé.</p>";
    return;
  }

  pageArticles.forEach(article => {
    const el = document.createElement("article");
    el.className =
      "section-card bg-white rounded-3xl p-6 flex flex-col";

    el.innerHTML = `
      <p class="text-cyan-500 text-xs uppercase tracking-[0.4em] mb-3">
        ${article.category || "Article"}
      </p>
      <h3 class="text-xl font-semibold mb-3">
        <a href="article.html?slug=${article.slug}" class="hover:text-cyan-600">
          ${article.title}
        </a>
      </h3>
      <p class="text-slate-600 flex-1">
        ${article.excerpt || ""}
      </p>
      <a href="article.html?slug=${article.slug}"
         class="text-cyan-600 font-semibold mt-4">
        Lire l’article →
      </a>
    `;

    blogList.appendChild(el);
  });
}

// Pagination
function renderPagination() {
  blogPagination.innerHTML = "";

  const totalPages = Math.ceil(
    filteredArticles.length / ARTICLES_PER_PAGE
  );

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className =
      "px-4 py-2 rounded-full border text-sm font-medium transition";

    if (i === currentPage) {
      btn.classList.add(
        "bg-cyan-500",
        "text-white",
        "border-transparent"
      );
    } else {
      btn.classList.add(
        "border-slate-200",
        "hover:border-cyan-400"
      );
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      render();
      window.scrollTo({
        top: blogList.offsetTop - 100,
        behavior: "smooth"
      });
    });

    blogPagination.appendChild(btn);
  }
}

// Recherche
if (blogSearch) {
  blogSearch.addEventListener("input", e => {
    const query = e.target.value.toLowerCase().trim();

    filteredArticles = allArticles.filter(article => {
      const text =
        `${article.title} ${article.excerpt} ${article.keywords?.join(" ") || ""}`
          .toLowerCase();
      return text.includes(query);
    });

    currentPage = 1;
    render();
  });
}
