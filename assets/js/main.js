/* =========================================================
   Belas Patas Estética Animal — scripts
   ========================================================= */

/* ⚙️ CONFIGURAÇÃO — edite aqui os dados reais do petshop */
const CONFIG = {
  whatsapp: "5500000000000",               // só números: 55 + DDD + número
  telefone: "(00) 00000-0000",
  instagram: "belaspatas",                 // sem o @
  endereco: "Rua Exemplo, 123 — Bairro, Cidade/UF",
  horario: "Seg a Sex: 8h às 18h · Sáb: 8h às 14h",
  mapa: "Belas Patas Estética Animal",     // texto buscado no Google Maps
};

const whatsLink = (msg = "Olá! Vim pelo site e gostaria de agendar um horário 🐾") =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* Preenche dados de contato */
document.querySelectorAll("[data-config]").forEach((el) => {
  const key = el.dataset.config;
  if (key === "instagram") el.textContent = "@" + CONFIG.instagram;
  else if (CONFIG[key]) el.textContent = CONFIG[key];
});
document.querySelectorAll("[data-whats]").forEach((a) => {
  a.href = whatsLink();
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll("[data-insta]").forEach((a) => {
  a.href = `https://instagram.com/${CONFIG.instagram}`;
});
document.getElementById("mapa").src =
  `https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.mapa)}&output=embed`;
document.getElementById("ano").textContent = new Date().getFullYear();

/* Cabeçalho com sombra ao rolar */
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Menu mobile */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* Animação de entrada ao rolar */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

/* Galeria com lightbox */
const items = [...document.querySelectorAll(".gallery__item")];
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector("figcaption");
let current = 0;

const show = (i) => {
  current = (i + items.length) % items.length;
  const img = items[current].querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = items[current].dataset.caption;
};
items.forEach((btn, i) => btn.addEventListener("click", () => { show(i); lb.showModal(); }));
lb.querySelector(".lightbox__close").addEventListener("click", () => lb.close());
lb.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(current - 1));
lb.querySelector(".lightbox__nav--next").addEventListener("click", () => show(current + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* Formulário de agendamento → mensagem no WhatsApp */
const form = document.getElementById("form-agendar");
const erro = document.getElementById("form-erro");
form.data.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const tutor = fd.get("tutor").trim();
  const pet = fd.get("pet").trim();
  if (!tutor || !pet) {
    erro.hidden = false;
    (tutor ? form.pet : form.tutor).focus();
    return;
  }
  erro.hidden = true;

  const servicos = fd.getAll("servicos");
  const data = fd.get("data")
    ? new Date(fd.get("data") + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" })
    : "a combinar";

  const linhas = [
    `Olá, Belas Patas! 🐾`,
    `Sou ${tutor} e gostaria de agendar um horário para ${pet}.`,
    ``,
    `🐶 Raça: ${fd.get("raca").trim() || "não informada"}`,
    `📏 Porte: ${fd.get("porte")}`,
    `✨ Serviços: ${servicos.length ? servicos.join(", ") : "gostaria de uma indicação"}`,
    `📅 Data: ${data} — ${fd.get("periodo")}`,
  ];
  const obs = fd.get("obs").trim();
  if (obs) linhas.push(`📝 Obs.: ${obs}`);

  window.open(whatsLink(linhas.join("\n")), "_blank", "noopener");
});

/* 🐾 Surpresa: patinhas surgem quando você clica em qualquer lugar */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  document.addEventListener("click", (e) => {
    if (e.target.closest("input, textarea, label, dialog")) return;
    for (let i = 0; i < 3; i++) {
      const paw = document.createElement("span");
      paw.className = "paw-pop";
      paw.textContent = "🐾";
      paw.style.left = e.clientX + "px";
      paw.style.top = e.clientY + "px";
      paw.style.setProperty("--dx", `${(i - 1) * 34}px`);
      paw.style.setProperty("--r", `${(i - 1) * 25}deg`);
      paw.style.animationDelay = `${i * 90}ms`;
      document.body.appendChild(paw);
      paw.addEventListener("animationend", () => paw.remove());
    }
  });
}
