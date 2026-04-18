import { games } from "./games.js";

// ---------- PAGE ENTER ----------
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// ---------- PAGE DETECTION ----------
const path = window.location.pathname;

const isIndex =
  path.endsWith("index.html") ||
  path === "/" ||
  path.endsWith("/");

const isGame = path.includes("game.html");


// ---------- FORMAT NAME ----------
function formatName(name) {
  return name
    .split("-")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}


// ---------- STAGGER ANIMATION ----------
function animateCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, index * 80);
  });
}


// ---------- INDEX ----------
if (isIndex) {
  const container = document.getElementById("list");

  [...games]
    .sort((a, b) =>
      formatName(a).localeCompare(formatName(b))
    )
    .forEach(name => {
      const card = document.createElement("div");
      card.className = "card";

      const link = document.createElement("a");
      link.href = `game.html?name=${name}`;
      link.textContent = formatName(name);

      card.appendChild(link);
      container.appendChild(card);
    });

  animateCards();
}


// ---------- GAME PAGE ----------
if (isGame) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  const container = document.getElementById("content");

  if (!name) {
    container.innerHTML = "<p>Invalid game.</p>";
  } else {
    fetch(`games/${name}.md`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(md => {
        const html = marked.parse(md);
        container.innerHTML = html;

        wrapSections(container);
        animateCards();

        if (window.lucide) {
          lucide.createIcons();
        }
      })
      .catch(() => {
        container.innerHTML = "<p>Game not found.</p>";
      });
  }
}


// ---------- WRAP SECTIONS ----------
function wrapSections(container) {
  const elements = Array.from(container.children);
  container.innerHTML = "";

  let currentCard = null;

  elements.forEach(el => {
    if (el.tagName === "H2") {
      currentCard = document.createElement("div");
      currentCard.className = "card";

      currentCard.appendChild(el);
      container.appendChild(currentCard);
    } else if (currentCard) {
      currentCard.appendChild(el);
    } else {
      container.appendChild(el);
    }
  });
}


// ---------- PAGE EXIT ----------
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {
    const url = this.getAttribute("href");

    if (!url || url.startsWith("#") || url.startsWith("http")) return;

    e.preventDefault();

    document.body.classList.remove("loaded");
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = url;
    }, 250);
  });
});


// ---------- LUCIDE ----------
if (window.lucide) {
  lucide.createIcons();
}