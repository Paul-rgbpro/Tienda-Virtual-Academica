/* ============================================================
   ISHOP ALL — main.js
   Depende de: productos.js (debe cargarse antes)
   ============================================================ */

(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* ══ AUTH ROLES (NUEVO) ══ */
const AUTH_KEY = "ishop_user";

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
  catch { return null; }
}

function isAdmin() {
  const u = getUser();
  return u && u.role === "admin";
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  updateUIByRole();
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  updateUIByRole();
  Toast.show("Sesión cerrada");
}
window.logout = logout;

function updateUIByRole() {
  const loginBtns = $$(".btn-login");

  loginBtns.forEach(b => {
    b.onclick = () => {
      const user = getUser(); // ← SIEMPRE actualizado

      // 🔐 ADMIN → abre panel admin
      if (user && user.role === "admin") {
        $("#admin-panel")?.classList.add("open");
        $("#admin-overlay")?.classList.add("open");
        document.body.style.overflow = "hidden";
        return;
      }

      // 👤 USER normal
      if (user && user.role === "user") {
        Toast.show(`Bienvenido ${user.nombre}`);
        return;
      }

      // 🚪 No logueado → abrir login
      $(".modal-overlay")?.classList.add("open");
    };
  });

  // Cambiar texto del botón dinámicamente
  const user = getUser();

  loginBtns.forEach(b => {
    if (!user) b.textContent = "Ingresar";
    else if (user.role === "admin") b.textContent = "Panel Admin";
    else b.textContent = "Mi cuenta";
  });
}

  /* ══ TOAST ══ */
  const Toast = (() => {
    let wrap = null;
    function box() {
      if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-container"; document.body.appendChild(wrap); }
      return wrap;
    }
    function show(msg, type = "success") {
      const t = document.createElement("div");
      t.className = `toast ${type}`;
      t.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${type === "success" ? '<polyline points="20 6 9 17 4 12"/>' : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}</svg><span>${msg}</span>`;
      box().appendChild(t);
      setTimeout(() => { t.style.cssText = "opacity:0;transform:translateY(8px);transition:.3s"; setTimeout(() => t.remove(), 300); }, 3000);
    }
    return { show };
  })();

  /* ══ CARRITO ══ */
  const Cart = (() => {
    const KEY = "ishopall_cart";
    let items = [];

    function load()  { try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch { items = []; } }
    function save()  { localStorage.setItem(KEY, JSON.stringify(items)); }
    function find(id){ return items.find(i => i.id === id); }

    function add(p) {
      const ex = find(p.id);
      ex ? ex.qty++ : items.push({ ...p, qty: 1 });
      save(); render(); badge();
    }
    function remove(id) { items = items.filter(i => i.id !== id); save(); render(); badge(); }
    function qty(id, d) {
      const it = find(id); if (!it) return;
      it.qty += d;
      if (it.qty <= 0) remove(id); else { save(); render(); badge(); }
    }
    function total() { return items.reduce((a, i) => a + i.precio * i.qty, 0); }
    function count() { return items.reduce((a, i) => a + i.qty, 0); }

    function fmt(n) { return `S/ ${n.toLocaleString("es-PE")}`; }

    function badge() {
      $$(".cart-count").forEach(el => { const c = count(); el.textContent = c; el.style.display = c > 0 ? "inline-flex" : "none"; });
    }

    function render() {
      const panel = $(".cart-items"); if (!panel) return;
      if (!items.length) {
        panel.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Tu carrito está vacío</p></div>`;
      } else {
        panel.innerHTML = items.map(it => `
          <div class="cart-item" data-id="${it.id}">
            <div class="cart-item-thumb" style="background:#f0efe9;width:60px;height:60px;border-radius:6px;flex-shrink:0;overflow:hidden">
              ${it.imagen ? `<img src="${it.imagen}" style="width:100%;height:100%;object-fit:cover">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:22px">${it.emoji||"📦"}</div>`}
            </div>
            <div class="cart-item-info">
              <strong>${it.nombre}</strong>
              <span class="item-price">${fmt(it.precio)}</span>
              <div class="cart-item-qty">
                <button class="qty-btn" data-action="dec" data-id="${it.id}">−</button>
                <span>${it.qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${it.id}">+</button>
              </div>
            </div>
            <button class="cart-item-remove" data-id="${it.id}" title="Eliminar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>`).join("");
      }
      const tv = $(".cart-total-value"); if (tv) tv.textContent = fmt(total());
    }

    function init() {
      load(); badge(); render();
      document.addEventListener("click", e => {
        const q = e.target.closest(".qty-btn");
        const r = e.target.closest(".cart-item-remove");
        if (q) qty(q.dataset.id, q.dataset.action === "inc" ? 1 : -1);
        if (r) { remove(r.dataset.id); Toast.show("Producto eliminado del carrito", "error"); }
      });
    }

    return { init, add, fmt };
  })();

  /* ══ PANEL CARRITO ══ */
  function initCartPanel() {
    const ov = $(".cart-panel-overlay"), p = $(".cart-panel"); if (!ov || !p) return;
    const open = () => { ov.classList.add("open"); p.classList.add("open"); document.body.style.overflow = "hidden"; };
    const close = () => { ov.classList.remove("open"); p.classList.remove("open"); document.body.style.overflow = ""; };
    $$(".btn-cart").forEach(b => b.addEventListener("click", open));
    $(".cart-panel-close")?.addEventListener("click", close);
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
  }

  /* ══ MODAL LOGIN ══ */
function initLogin() {
  const ov = $(".modal-overlay"); if (!ov) return;
  const open = () => ov.classList.add("open");
  const close = () => ov.classList.remove("open");

  $(".modal-close")?.addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });

  const USERS = [
    { email: "admin@ishop.com", password: "1234", role: "admin", nombre: "Administrador" },
    { email: "user@ishop.com",  password: "1234", role: "user",  nombre: "Cliente" }
  ];

  $("#login-form")?.addEventListener("submit", e => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const pass  = e.target.password.value.trim();

    const user = USERS.find(u => u.email === email && u.password === pass);

    if (!user) return Toast.show("Credenciales incorrectas", "error");

    setUser(user);
    close();
    Toast.show(`Bienvenido ${user.nombre} ✓`);
  });

  updateUIByRole(
);
}

  /* ══ FAQ ══ */
  function initFAQ() {
    $$(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const ans = btn.nextElementSibling, open = ans.classList.contains("open");
        $$(".faq-answer").forEach(a => a.classList.remove("open"));
        $$(".faq-question").forEach(b => b.setAttribute("aria-expanded", "false"));
        if (!open) { ans.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
      });
    });
  }

  /* ══ CONTACTO ══ */
  function initContact() {
    $("#contact-form")?.addEventListener("submit", e => { e.preventDefault(); Toast.show("¡Mensaje enviado! Te responderemos pronto."); e.target.reset(); });
  }

  /* ══ NAV ACTIVO ══ */
  function initNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    $$("nav a").forEach(a => { if (a.getAttribute("href").split("/").pop() === path) a.classList.add("active"); });
  }

  /* ══ MENÚ MÓVIL ══ */
  function initMobile() {
    const ov = $(".mobile-nav-overlay"), nav = $(".mobile-nav"), ob = $(".btn-menu"); if (!ov || !nav || !ob) return;
    const open = () => { ov.classList.add("open"); nav.classList.add("open"); document.body.style.overflow = "hidden"; };
    const close = () => { ov.classList.remove("open"); nav.classList.remove("open"); document.body.style.overflow = ""; };
    ob.addEventListener("click", open);
    $(".close-nav")?.addEventListener("click", close);
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
  }

  /* ══════════════════════════════════════════════
     TIENDA DINÁMICA — renderiza desde productos.js
  ══════════════════════════════════════════════ */
  function initTienda() {
    const grid = $("#product-grid");
    const filterBar = $("#filter-bar");
    const searchInput = $("#search-input");
    const resultCount = $("#result-count");

    if (!grid) return; // no estamos en tienda.html
    if (typeof PRODUCTOS === "undefined" || typeof CATEGORIAS === "undefined") {
      grid.innerHTML = "<p style='color:red'>Error: productos.js no cargado.</p>"; return;
    }

    let categoriaActiva = "todos";
    let busqueda = "";

    /* ── Categoría pills ── */
    if (filterBar) {
      filterBar.innerHTML = CATEGORIAS.map(cat => `
        <button class="cat-pill${cat.id === "todos" ? " active" : ""}" data-cat="${cat.id}">
          <span class="cat-emoji">${cat.emoji}</span> ${cat.label}
        </button>`).join("");

      filterBar.addEventListener("click", e => {
        const btn = e.target.closest(".cat-pill"); if (!btn) return;
        $$(".cat-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        categoriaActiva = btn.dataset.cat;
        renderProductos();
      });
    }

    /* ── Buscador ── */
    searchInput?.addEventListener("input", () => { busqueda = searchInput.value.trim().toLowerCase(); renderProductos(); });

    /* ── Render ── */
    function renderProductos() {
      const filtrados = PRODUCTOS.filter(p => {
        const matchCat = categoriaActiva === "todos" || p.categoria === categoriaActiva;
        const matchQ   = !busqueda || p.nombre.toLowerCase().includes(busqueda) || (p.descripcion||"").toLowerCase().includes(busqueda);
        return matchCat && matchQ;
      });

      if (resultCount) resultCount.textContent = `${filtrados.length} producto${filtrados.length !== 1 ? "s" : ""}`;

      if (!filtrados.length) {
        grid.innerHTML = `
          <div class="no-results">
            <span style="font-size:48px">🔍</span>
            <p>No encontramos productos para "<strong>${busqueda || categoriaActiva}</strong>"</p>
            <button onclick="document.getElementById('search-input').value='';window.resetFiltros()" style="margin-top:12px;padding:8px 20px;background:var(--clr-accent);color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:var(--font-body);font-weight:600">Mostrar todos</button>
          </div>`; return;
      }

      grid.innerHTML = filtrados.map(p => buildCard(p)).join("");

      /* eventos de los botones recién creados */
      $$(".btn-add", grid).forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          const prod = PRODUCTOS.find(p => p.id === id); if (!prod) return;
          Cart.add({ id: prod.id, nombre: prod.nombre, precio: prod.precio, imagen: prod.imagen, emoji: CATEGORIAS.find(c=>c.id===prod.categoria)?.emoji || "📦" });
          Toast.show(`"${prod.nombre}" agregado al carrito ✓`);
          const orig = btn.innerHTML;
          btn.textContent = "✓ Agregado"; btn.style.background = "var(--clr-green)";
          setTimeout(() => { btn.innerHTML = orig; btn.style.background = ""; }, 1600);
        });
      });

      $$(".btn-wish", grid).forEach(btn => {
        btn.addEventListener("click", () => {
          const active = btn.classList.toggle("active");
          Toast.show(active ? "Guardado en favoritos ♥" : "Eliminado de favoritos", active ? "success" : "error");
        });
      });
    }

    /* ── Build card HTML ── */
    function buildCard(p) {
      const cat = CATEGORIAS.find(c => c.id === p.categoria);
      const thumb = p.imagen
        ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">`
        : `<div class="card-placeholder">${cat?.emoji || "📦"}</div>`;
      const badge = p.badge ? `<span class="card-badge" ${p.badgeColor ? `style="background:${p.badgeColor}"` : ""}>${p.badge}</span>` : "";
      const original = p.precioOriginal ? `<span class="precio-original">${Cart.fmt(p.precioOriginal)}</span>` : "";

      return `
        <article class="card" data-id="${p.id}">
          <div class="card-img-wrap">
            ${badge}
            ${thumb}
            <span class="card-cat-tag">${cat?.emoji || ""} ${cat?.label || ""}</span>
          </div>
          <div class="card-body">
            <h3>${p.nombre}</h3>
            <p class="card-desc">${p.descripcion || ""}</p>
            <div class="card-pricing">
              ${original}
              <p class="precio">${Cart.fmt(p.precio)}</p>
            </div>
            <div class="card-actions">
              <button class="btn-add" data-id="${p.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Agregar
              </button>
              <button class="btn-wish" aria-label="Guardar en favoritos">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>
        </article>`;
    }

    /* reset global para el botón "Mostrar todos" */
    window.resetFiltros = () => {
      categoriaActiva = "todos"; busqueda = "";
      if (searchInput) searchInput.value = "";
      $$(".cat-pill").forEach(b => b.classList.toggle("active", b.dataset.cat === "todos"));
      renderProductos();
    };

    renderProductos();
  }

  /* ══════════════════════════════════════════════
     PANEL ADMIN — agregar productos sin tocar código
  ══════════════════════════════════════════════ */
  function initAdmin() {
    const trigger = $("#admin-trigger");
    const panel = $("#admin-panel");
    const overlay = $("#admin-overlay");
    if (!trigger || !panel) return;

    /* Poblar select de categorías */
    const catSelect = $("#admin-categoria");
    if (catSelect && typeof CATEGORIAS !== "undefined") {
      CATEGORIAS.filter(c => c.id !== "todos").forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id; opt.textContent = `${c.emoji} ${c.label}`;
        catSelect.appendChild(opt);
      });
    }

    const open = () => { panel.classList.add("open"); overlay?.classList.add("open"); document.body.style.overflow = "hidden"; };
    const close = () => { panel.classList.remove("open"); overlay?.classList.remove("open"); document.body.style.overflow = ""; };

    trigger.addEventListener("click", open);
    $("#admin-close")?.addEventListener("click", close);
    overlay?.addEventListener("click", close);

    $("#admin-form")?.addEventListener("submit", e => {
          if (!isAdmin()) return Toast.show("Solo el administrador puede agregar productos", "error");
      e.preventDefault();
      const fd = new FormData(e.target);
      const nuevo = {
        id: "prod_" + Date.now(),
        nombre:        fd.get("nombre"),
        precio:        parseInt(fd.get("precio"), 10),
        categoria:     fd.get("categoria"),
        imagen:        fd.get("imagen") || "",
        badge:         fd.get("badge") || null,
        badgeColor:    null,
        precioOriginal: fd.get("precioOriginal") ? parseInt(fd.get("precioOriginal"), 10) : null,
        descripcion:   fd.get("descripcion") || "",
      };

      /* Agregar al array en memoria y re-renderizar */
      PRODUCTOS.push(nuevo);
      close();
      e.target.reset();
      Toast.show(`"${nuevo.nombre}" agregado a la tienda ✓`);

      /* Disparar re-render de la tienda si estamos en esa página */
      if (typeof window.resetFiltros === "function") window.resetFiltros();

      /* Mostrar snippet para copiar a productos.js */
      showSnippet(nuevo);
    });
  }

  function showSnippet(p) {
    const modal = document.createElement("div");
    modal.style.cssText = "position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px";
    modal.innerHTML = `
      <div style="background:#1a1a18;color:#e8e8e4;border-radius:14px;padding:32px;max-width:580px;width:100%;font-family:monospace;position:relative">
        <h4 style="font-family:var(--font-display,sans-serif);color:#fff;margin-bottom:12px;font-size:16px">📋 Copia esto en <code style="background:#333;padding:2px 6px;border-radius:4px">js/productos.js</code></h4>
        <pre id="snippet-code" style="background:#0d0d0c;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.7;color:#a8f0b4">${JSON.stringify(p, null, 2).replace(/</g,"&lt;")}</pre>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button onclick="navigator.clipboard.writeText(document.getElementById('snippet-code').textContent);this.textContent='¡Copiado! ✓'" style="padding:9px 18px;background:var(--clr-accent,#2a1fa8);color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600">Copiar código</button>
          <button onclick="this.closest('[style]').remove()" style="padding:9px 18px;background:#333;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:13px">Cerrar</button>
        </div>
        <p style="font-size:12px;color:#888;margin-top:12px">⚠️ El producto solo persiste en esta sesión. Agrégalo a <strong>productos.js</strong> para que sea permanente.</p>
      </div>`;
    document.body.appendChild(modal);
  }

  /* ══ INIT ══ */
  document.addEventListener("DOMContentLoaded", () => {
    Cart.init();
    initCartPanel();
    initLogin();
    initFAQ();
    initContact();
    initNav();
    initMobile();
    initTienda();
    initAdmin();
    updateUIByRole();
  });

})();
