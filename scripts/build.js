import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const SITE_URL = "https://example.com"; // TODO: remplace par ton domaine
const POSTS_PER_PAGE = 6;

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const CONTENT_BLOG = path.join(ROOT, "content", "blog");

const LAYOUT_PATH = path.join(SRC, "templates", "layout.html");
const HOME_PATH = path.join(SRC, "pages", "index.html");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function slugToUrl(slug) {
  return `/blog/${slug}/`;
}

function applyLayout({ title, description, canonical, contentHtml }) {
  const layout = read(LAYOUT_PATH);
  return layout
    .replaceAll("{{TITLE}}", title)
    .replaceAll("{{DESCRIPTION}}", description)
    .replaceAll("{{CANONICAL}}", canonical)
    .replace("{{CONTENT}}", contentHtml);
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function buildBlogIndex(posts) {
  const index = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    keywords: p.keywords,
    publishedAt: p.publishedAt
  }));
  write(path.join(DIST, "content", "blog", "index.json"), JSON.stringify(index, null, 2));
}

function buildPostPages(posts) {
  for (const post of posts) {
    const articleTemplate = `
      <main class="max-w-3xl mx-auto px-6 py-16">
        <a href="/#blog" class="text-cyan-600 font-semibold">← Retour au blog</a>

        <p class="text-cyan-500 uppercase tracking-[0.4em] text-xs mt-8 mb-3">${post.category}</p>
        <h1 class="text-4xl font-bold mb-3">${post.title}</h1>
        <p class="text-slate-500 mb-10">${post.publishedAt}</p>

        <div class="prose prose-slate max-w-none">
          ${post.html}
        </div>
      </main>
    `.trim();

    const canonical = SITE_URL + slugToUrl(post.slug);
    const full = applyLayout({
      title: `${post.title} | Travailler moins, vivre mieux`,
      description: post.excerpt,
      canonical,
      contentHtml: articleTemplate
    });

    const outDir = path.join(DIST, "blog", post.slug);
    write(path.join(outDir, "index.html"), full);
  }
}

function buildHome() {
  // Home: on garde ton contenu en HTML tel quel (il charge blog.js)
  const homeInner = read(HOME_PATH);
  const canonical = SITE_URL + "/";
  const full = applyLayout({
    title: "Travailler moins, vivre mieux",
    description: "Méthode en 14 jours pour retrouver un équilibre durable, réduire le stress et reprendre le contrôle de votre temps de travail.",
    canonical,
    contentHtml: homeInner
  });
  write(path.join(DIST, "index.html"), full);
}

function buildBlogPagesForSEO(posts) {
  // Pages blog paginées SEO: /blog/ (page 1), /blog/page/2/ ...
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  for (let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * POSTS_PER_PAGE;
    const slice = posts.slice(start, start + POSTS_PER_PAGE);

    const cards = slice.map(p => `
      <article class="section-card bg-white rounded-3xl p-6 flex flex-col">
        <p class="text-cyan-500 text-xs uppercase tracking-[0.4em] mb-3">${p.category}</p>
        <h3 class="text-xl font-semibold mb-3">
          <a class="hover:underline" href="${slugToUrl(p.slug)}">${p.title}</a>
        </h3>
        <p class="text-slate-600 flex-1">${p.excerpt}</p>
        <a href="${slugToUrl(p.slug)}" class="text-cyan-600 font-semibold mt-4">Lire l’article</a>
      </article>
    `).join("");

    const nav = `
      <div class="flex items-center justify-center gap-3 mt-10">
        ${page > 1 ? `<a class="px-4 py-2 rounded-full border" href="${page === 2 ? "/blog/" : `/blog/page/${page - 1}/`}">Précédent</a>` : ""}
        <span class="text-slate-500">Page ${page} / ${totalPages}</span>
        ${page < totalPages ? `<a class="px-4 py-2 rounded-full border" href="/blog/page/${page + 1}/">Suivant</a>` : ""}
      </div>
    `;

    const contentHtml = `
      <main class="max-w-6xl mx-auto px-6 py-16">
        <h1 class="text-3xl font-bold mb-6">Blog</h1>
        <div class="grid gap-8 md:grid-cols-3">${cards}</div>
        ${nav}
      </main>
    `.trim();

    const canonicalPath = page === 1 ? "/blog/" : `/blog/page/${page}/`;
    const outDir = page === 1 ? path.join(DIST, "blog") : path.join(DIST, "blog", "page", String(page));
    const full = applyLayout({
      title: page === 1 ? "Blog | Travailler moins, vivre mieux" : `Blog (page ${page}) | Travailler moins, vivre mieux`,
      description: "Articles pratiques pour les journées qui débordent : surcharge, priorités, e-mails, IA…",
      canonical: SITE_URL + canonicalPath,
      contentHtml
    });
    write(path.join(outDir, "index.html"), full);
  }
}

function buildSitemap(posts) {
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/blog/`, priority: "0.7" },
    ...posts.map(p => ({ loc: `${SITE_URL}${slugToUrl(p.slug)}`, priority: "0.6" }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
  write(path.join(DIST, "sitemap.xml"), xml);
}

function buildRSS(posts) {
  const items = posts.slice(0, 20).map(p => `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${SITE_URL}${slugToUrl(p.slug)}</link>
    <guid>${SITE_URL}${slugToUrl(p.slug)}</guid>
    <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
  </item>
  `.trim()).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Travailler moins, vivre mieux — Blog</title>
  <link>${SITE_URL}/blog/</link>
  <description>Articles pratiques pour les journées qui débordent.</description>
  ${items}
</channel>
</rss>
`;
  write(path.join(DIST, "rss.xml"), xml);
}

function loadPosts() {
  const files = fs.readdirSync(CONTENT_BLOG).filter(f => f.endsWith(".md"));

  const posts = files.map(file => {
    const slug = file.replace(".md", "");
    const raw = read(path.join(CONTENT_BLOG, file));
    const { data, content } = matter(raw);

    const html = marked.parse(content);

    return {
      slug,
      title: String(data.title || slug),
      category: String(data.category || "Général"),
      publishedAt: String(data.publishedAt || "1970-01-01"),
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      methodDays: Array.isArray(data.methodDays) ? data.methodDays : [],
      excerpt: String(data.excerpt || ""),
      html
    };
  });

  // tri desc par date
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return posts;
}

function cleanDist() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);
}

function copyStatic() {
  // Copie CSS/JS vers dist/assets
  copyDir(path.join(SRC, "assets"), path.join(DIST, "assets"));

  // Copie robots.txt
  fs.copyFileSync(path.join(SRC, "robots.txt"), path.join(DIST, "robots.txt"));

  // Copie page Eisenhower (standalone)
  if (fs.existsSync(path.join(SRC, "pages", "eisenhower.html"))) {
    fs.copyFileSync(path.join(SRC, "pages", "eisenhower.html"), path.join(DIST, "eisenhower.html"));
  }
}

function build() {
  cleanDist();
  copyStatic();

  const posts = loadPosts();

  buildHome();
  buildBlogIndex(posts);              // index.json généré automatiquement
  buildPostPages(posts);              // URLs propres /blog/slug/
  buildBlogPagesForSEO(posts);        // pagination SEO /blog/page/2/
  buildSitemap(posts);                // sitemap.xml
  buildRSS(posts);                    // rss.xml

  console.log(`✅ Build terminé : ${posts.length} articles`);
}

build();
