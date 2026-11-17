const COLORES = ['#5c3a1e', '#7a2e1d', '#3d4a2a', '#8a5a1c', '#4a2c2a', '#996515', '#2f3b4f', '#6e3b1b'];
const $ = (id) => document.getElementById(id);
const form = $('form'), msg = $('msg'), librero = $('librero');
const detalle = $('detalle'), contador = $('contador'), boton = $('guardar');
const portada = $('portada'), abrir = $('abrir'), app = $('app');
const audio = $('audio'), btnMusica = $('musica');

let libros = [];
let nuevoId = null;
let activoId = null;
let animar = true;
let mostrado = 0;
let cargado = false;
let visible = false;
let audioOk = true;
const botones = new Map();

/* ---------- Polvo de fondo ---------- */
(function polvo() {
  const cont = $('polvo');
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    const t = 2 + Math.random() * 3;
    s.style.left = Math.random() * 100 + '%';
    s.style.width = s.style.height = t + 'px';
    s.style.animationDuration = 14 + Math.random() * 14 + 's';
    s.style.animationDelay = -Math.random() * 20 + 's';
    cont.appendChild(s);
  }
})();

/* ---------- Música ---------- */
audio.volume = 0.5;
audio.addEventListener('error', () => { audioOk = false; btnMusica.hidden = true; });
function actualizarMusica() {
  const on = !audio.paused;
  btnMusica.textContent = on ? '🔊' : '🔇';
  btnMusica.classList.toggle('sonando', on);
  btnMusica.title = on ? 'Pausar música' : 'Activar música';
}
audio.addEventListener('play', actualizarMusica);
audio.addEventListener('pause', actualizarMusica);
btnMusica.addEventListener('click', () => {
  if (audio.paused) audio.play().catch(() => {}); else audio.pause();
});

/* ---------- Portada: abrir libro ---------- */
abrir.addEventListener('click', () => {
  abrir.disabled = true;
  portada.classList.add('abierto');
  if (audioOk) {
    audio.play().catch(() => {});
    btnMusica.hidden = false;
    actualizarMusica();
  }
  setTimeout(() => portada.classList.add('salir'), 3100);
  setTimeout(() => { portada.remove(); revelar(); }, 4000);
});

function revelar() {
  visible = true;
  app.classList.remove('oculto');
  if (cargado) { render(); animarContador(libros.length); } else mostrarEspera();
}

/* ---------- Estantes ---------- */
function hash(texto) {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function animarContador(destino) {
  const inicio = mostrado, t0 = performance.now(), dur = 700;
  function paso(t) {
    const p = Math.min(1, (t - t0) / dur);
    const n = Math.round(inicio + (destino - inicio) * p);
    contador.textContent = '📜 ' + n + (n === 1 ? ' libro' : ' libros') + ' en la biblioteca';
    if (p < 1) requestAnimationFrame(paso); else mostrado = destino;
  }
  requestAnimationFrame(paso);
}

function crearLibro(l, i) {
  const h = hash(l.titulo + l.autor);
  const color = COLORES[h % COLORES.length];
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'libro' + (animar ? ' entra' : '') + (l._id === nuevoId ? ' nuevo' : '') + (l._id === activoId ? ' activo' : '');
  btn.style.setProperty('--d', i * 45 + 'ms');
  btn.style.backgroundColor = color;
  btn.style.height = 120 + (h % 55) + 'px';
  btn.style.width = 34 + (h % 5) * 6 + 'px';
  btn.title = l.titulo;
  btn.textContent = l.titulo;
  btn.addEventListener('click', () => mostrarDetalle(l, color));
  botones.set(l._id, btn);
  return btn;
}

function mostrarDetalle(l, color) {
  activoId = l._id;
  botones.forEach((b, id) => b.classList.toggle('activo', id === activoId));
  detalle.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'detalle-card';
  card.style.setProperty('--c', color);
  const linea = (texto, tag) => {
    const el = document.createElement(tag || 'p');
    el.textContent = texto;
    card.appendChild(el);
  };
  linea(l.titulo, 'h3');
  linea('Autor: ' + l.autor);
  if (l.isbn) linea('ISBN: ' + l.isbn);
  if (l.anio) linea('Año: ' + l.anio);
  linea('Inscrito: ' + new Date(l.fechaRegistro).toLocaleString('es-MX'));
  detalle.appendChild(card);
  detalle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function render() {
  librero.innerHTML = '';
  botones.clear();
  const porEstante = Math.max(4, Math.floor((librero.clientWidth - 60) / 46));
  const estantes = Math.max(2, Math.ceil(libros.length / porEstante));
  let idx = 0;
  for (let i = 0; i < estantes; i++) {
    const est = document.createElement('div');
    est.className = 'estante';
    const fila = document.createElement('div');
    fila.className = 'libros';
    libros.slice(i * porEstante, (i + 1) * porEstante).forEach((l) => fila.appendChild(crearLibro(l, idx++)));
    const tabla = document.createElement('div');
    tabla.className = 'tabla';
    est.appendChild(fila);
    est.appendChild(tabla);
    librero.appendChild(est);
  }
  if (!libros.length) {
    const v = document.createElement('p');
    v.className = 'vacio';
    v.textContent = 'El estante está vacío. Inscribe tu primer libro.';
    librero.appendChild(v);
  }
  animar = false;
  nuevoId = null;
}

function mostrarEspera() {
  librero.innerHTML = '';
  const v = document.createElement('p');
  v.className = 'vacio';
  v.textContent = 'Despertando a los escribas… un momento';
  librero.appendChild(v);
}

/* La carga empieza desde la portada para que Render alcance a despertar */
async function cargar() {
  try {
    const res = await fetch('/api/libros');
    if (!res.ok) throw new Error('fallo');
    libros = await res.json();
    cargado = true;
    if (visible) { render(); animarContador(libros.length); }
  } catch (e) {
    if (visible) mostrarEspera();
    setTimeout(cargar, 4000);
  }
}

function avisar(texto) {
  msg.textContent = texto;
  msg.className = '';
  void msg.offsetWidth;
  msg.className = 'pop';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  if (!datos.anio) delete datos.anio;
  boton.disabled = true;
  boton.classList.add('cargando');
  boton.textContent = 'Inscribiendo…';
  try {
    const res = await fetch('/api/libros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      const guardado = await res.json();
      nuevoId = guardado._id;
      avisar('✅ Libro inscrito en la base de datos y colocado en el estante');
      form.reset();
      libros.unshift(guardado);
      render();
      animarContador(libros.length);
    } else {
      const err = await res.json();
      avisar('❌ ' + err.error);
    }
  } catch (e) {
    avisar('❌ No se pudo conectar con el servidor');
  } finally {
    boton.disabled = false;
    boton.classList.remove('cargando');
    boton.textContent = 'Inscribir libro en el estante';
  }
});

let t;
window.addEventListener('resize', () => {
  clearTimeout(t);
  t = setTimeout(() => { if (visible && cargado) render(); }, 150);
});
cargar();
