/* ============================================================
   ISHOP ALL — productos.js
   ─────────────────────────────────────────────────────────────
   AQUÍ agregas, editas o eliminas productos y categorías.

   Para agregar un producto nuevo, copia uno de los objetos
   dentro del array y cambia los valores. Solo hay 4 campos
   obligatorios: id, nombre, precio, categoria.

   Categorías disponibles:
     "consolas"      → Consolas y videojuegos
     "smartphones"   → Smartphones y tablets
     "audio"         → Audio y parlantes
     "smart-home"    → Smart Home
     "accesorios"    → Accesorios
     "movilidad"     → Movilidad eléctrica

   Para agregar una categoría nueva:
     1. Agrégala en CATEGORIAS (abajo).
     2. Úsala en el campo "categoria" de tus productos.
   ============================================================ */

const CATEGORIAS = [
  { id: "todos",        label: "Todos",               emoji: "🛍️" },
  { id: "consolas",     label: "Consolas",             emoji: "🎮" },
  { id: "smartphones",  label: "Smartphones",          emoji: "📱" },
  { id: "audio",        label: "Audio",                emoji: "🔊" },
  { id: "smart-home",   label: "Smart Home",           emoji: "🏠" },
  { id: "accesorios",   label: "Accesorios",           emoji: "🎧" },
  { id: "movilidad",    label: "Movilidad eléctrica",  emoji: "⚡" },
];

const PRODUCTOS = [
  /* ── CONSOLAS ── */
  {
    id: "ps5",
    nombre: "PlayStation 5",
    precio: 2000,
    categoria: "consolas",
    imagen: "../img/ps5.jpg",
    badge: "Nuevo",
    badgeColor: null,          // null = color acento por defecto
    precioOriginal: null,      // null = sin tachado
    descripcion: "La consola de nueva generación de Sony con SSD ultrarrápido.",
  },
  {
    id: "ns2",
    nombre: "Nintendo Switch 2",
    precio: 1000,
    categoria: "consolas",
    imagen: "../img/ns2.jpg",
    badge: null,
    badgeColor: null,
    precioOriginal: null,
    descripcion: "La nueva generación de la consola híbrida de Nintendo.",
  },

  /* ── SMARTPHONES ── */
  {
    id: "iphone17promax",
    nombre: "iPhone 17 Pro Max",
    precio: 6900,
    categoria: "smartphones",
    imagen: "../img/iphone17.jpg",
    badge: "Popular",
    badgeColor: null,
    precioOriginal: null,
    descripcion: "El iPhone más avanzado, con chip A19 y cámara pro.",
  },
  {
    id: "samsung-s25",
    nombre: "Samsung Galaxy S25 Ultra",
    precio: 5800,
    categoria: "smartphones",
    imagen: "",
    badge: "Nuevo",
    badgeColor: null,
    precioOriginal: null,
    descripcion: "El Android flagship de Samsung con S Pen integrado.",
  },
  {
    id: "xiaomi-15",
    nombre: "Xiaomi 15 Pro",
    precio: 3200,
    categoria: "smartphones",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: 3600,
    descripcion: "Snapdragon 8 Elite, cámara Leica y carga de 90W.",
  },

  /* ── AUDIO ── */
  {
    id: "jbl-charge6",
    nombre: "Parlante JBL Charge 6",
    precio: 700,
    categoria: "audio",
    imagen: "../img/jblparlante.jpg",
    badge: null,
    badgeColor: null,
    precioOriginal: null,
    descripcion: "Sonido potente 360° y batería que carga otros dispositivos.",
  },
  {
    id: "sony-wh1000xm6",
    nombre: "Sony WH-1000XM6",
    precio: 1250,
    categoria: "audio",
    imagen: "",
    badge: "Nuevo",
    badgeColor: null,
    precioOriginal: null,
    descripcion: "Los mejores auriculares con cancelación de ruido del mercado.",
  },
  {
    id: "airpods-pro2",
    nombre: "AirPods Pro 2",
    precio: 950,
    categoria: "audio",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: 1100,
    descripcion: "ANC adaptativo y audio espacial personalizado.",
  },

  /* ── SMART HOME ── */
  {
    id: "echo-dot5",
    nombre: "Amazon Echo Dot 5ta Gen",
    precio: 169,
    categoria: "smart-home",
    imagen: "../img/alexa.jpg",
    badge: "Oferta",
    badgeColor: "#ff6b00",
    precioOriginal: 220,
    descripcion: "Altavoz inteligente compacto con Alexa integrada.",
  },
  {
    id: "echo-show8",
    nombre: "Amazon Echo Show 8",
    precio: 450,
    categoria: "smart-home",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: null,
    descripcion: "Pantalla inteligente con cámara y Alexa para el hogar.",
  },
  {
    id: "google-nest",
    nombre: "Google Nest Hub 2",
    precio: 380,
    categoria: "smart-home",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: 420,
    descripcion: "Pantalla inteligente con Google Assistant y sensor de sueño.",
  },

  /* ── ACCESORIOS ── */
  {
    id: "logitech-mx3",
    nombre: "Mouse Logitech MX Master 3S",
    precio: 380,
    categoria: "accesorios",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: null,
    descripcion: "El mouse inalámbrico más preciso para profesionales.",
  },
  {
    id: "keychron-k2",
    nombre: "Teclado Keychron K2 Pro",
    precio: 520,
    categoria: "accesorios",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: null,
    descripcion: "Teclado mecánico compacto con retroiluminación RGB.",
  },
  {
    id: "apple-watch-s10",
    nombre: "Apple Watch Series 10",
    precio: 1800,
    categoria: "accesorios",
    imagen: "",
    badge: "Nuevo",
    badgeColor: null,
    precioOriginal: null,
    descripcion: "El reloj inteligente más delgado de Apple con nuevas funciones de salud.",
  },

  /* ── MOVILIDAD ── */
  {
    id: "bicimoto-moveen",
    nombre: "Bicimoto Eléctrica Moveen",
    precio: 1100,
    categoria: "movilidad",
    imagen: "../img/motoelectrica.jpg",
    badge: null,
    badgeColor: null,
    precioOriginal: null,
    descripcion: "Movilidad urbana sustentable con autonomía de 60 km.",
  },
  {
    id: "scooter-xiaomi",
    nombre: "Scooter Xiaomi Electric 4 Pro",
    precio: 1350,
    categoria: "movilidad",
    imagen: "",
    badge: null,
    badgeColor: null,
    precioOriginal: 1500,
    descripcion: "Patinete eléctrico con 45 km de autonomía y app integrada.",
  },
];
