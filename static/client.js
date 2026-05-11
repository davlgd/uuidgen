"use strict";
let toastTimer = 0;

function showToast(msg, isError) {
  const t = document.getElementById("toast");
  clearTimeout(toastTimer);
  t.setAttribute("role", isError ? "alert" : "status");
  t.textContent = msg;
  t.classList.add("show");
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

function flash(el) {
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 400);
}

function spinIcon(btn) {
  const icon = btn.querySelector(".icon-refresh");
  if (!icon) return;
  icon.classList.remove("spinning");
  void icon.offsetWidth;
  icon.classList.add("spinning");
}

function applyData(data) {
  for (const k of Object.keys(data)) {
    const el = document.getElementById(k);
    if (el) {
      el.textContent = data[k];
      el.removeAttribute("aria-busy");
      flash(el);
    }
  }
}

async function fetchJson(url, init) {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}

async function genOne(type, btn) {
  if (btn) spinIcon(btn);
  try {
    applyData(await fetchJson("/" + encodeURIComponent(type)));
  } catch {
    showToast("Generation failed", true);
  }
}

async function genAll() {
  try {
    applyData(await fetchJson("/", { headers: { Accept: "application/json" } }));
  } catch {
    showToast("Generation failed", true);
  }
}

function copy(type) {
  const el = document.getElementById(type);
  if (!el || el.hasAttribute("aria-busy")) return;
  navigator.clipboard.writeText(el.textContent).then(
    () => showToast("Copied!", false),
    () => showToast("Copy failed", true),
  );
}

document.querySelectorAll("[data-gen]").forEach((btn) => {
  btn.addEventListener("click", () => genOne(btn.dataset.gen, btn));
});
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => copy(btn.dataset.copy));
});
document.getElementById("gen-all").addEventListener("click", genAll);

const h = document.getElementById("curl-hint");
if (h) {
  const o = location.origin;
  h.textContent = `curl -H "Accept: application/json" ${o}/\ncurl -H "Accept: text/yaml" ${o}/`;
}

genAll();
