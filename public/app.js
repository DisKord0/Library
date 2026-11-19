/* Íconos SVG (heredan el color del texto) */
const ICONOS = {
 "lis": "<svg class=\"ic lleno\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 1.8c2.1 2.3 3 4.9 2.3 7.5-.3 1.1-1 2.1-2.3 2.9-1.3-.8-2-1.8-2.3-2.9C9 6.7 9.900 4.100 12 1.800z\"/><path d=\"M8.500 7.600C5.900 7 3.600 8.500 3.200 11c-.3 2.200 1 3.900 3 4.300 1.500.3 3-.2 4-1.300-1.700-.2-2.900-1.100-3.400-2.600-.5-1.500 0-2.800 1.700-3.800z\"/><path d=\"M15.500 7.600c2.600-.6 4.900.9 5.300 3.400.3 2.200-1 3.900-3 4.300-1.500.3-3-.2-4-1.300 1.700-.2 2.900-1.100 3.400-2.600.5-1.500 0-2.800-1.700-3.800z\"/><rect x=\"6.500\" y=\"15.800\" width=\"11\" height=\"2\" rx=\".6\"/><path d=\"M9.800 18.600h4.400L12 22.600z\"/></svg>",
 "castillo": "<svg class=\"ic lleno\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M2 9h5.500v12H2z\"/><path d=\"M16.500 9H22v12h-5.500z\"/><path d=\"M2 6.500h1.500V9H2zM4 6.500h1.500V9H4zM6 6.500h1.500V9H6z\"/><path d=\"M16.500 6.500H18V9h-1.500zM18.500 6.500H20V9h-1.500zM20.500 6.500H22V9h-1.500z\"/><path d=\"M7.500 12h9v9h-3.500v-3.500a1.500 1.500 0 0 0-3 0V21H7.500z\"/><path d=\"M7.500 9.500h1.500V12H7.500zM10.300 9.500h1.500V12h-1.500zM12.200 9.500h1.500V12h-1.500zM15 9.500h1.500V12H15z\"/><path d=\"M11.250 2v5.500h4.500L14.600 4.700 15.750 2z\"/></svg>",
 "pergamino": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 17V5a2 2 0 0 0-2-2H4\"/><path d=\"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3\"/></svg>",
 "libro": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 7v14\"/><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"/></svg>",
 "nota": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/></svg>",
 "notaOff": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/><path d=\"M3 3l18 18\"/></svg>",
 "pluma": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12.670 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.490-8.490L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z\"/><path d=\"M16 8 2 22\"/><path d=\"M17.500 15H9\"/></svg>",
 "papelera": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 6h18\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><path d=\"M10 11v6\"/><path d=\"M14 11v6\"/></svg>",
 "check": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20 6 9 17l-5-5\"/></svg>",
 "cruz": "<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></svg>"
};
ICONOS.lupa = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';
function pintarIconos() {
  document.querySelectorAll('[data-ic]').forEach((el) => { el.innerHTML = ICONOS[el.dataset.ic] || ''; });
}
pintarIconos();

const COLORES = ['#5c3a1e', '#7a2e1d', '#3d4a2a', '#8a5a1c', '#4a2c2a', '#996515', '#2f3b4f', '#6e3b1b'];
const CATEGORIAS = ['Novela', 'Historia', 'Ciencia', 'Fantasía', 'Poesía', 'Filosofía', 'Tecnología', 'Infantil', 'Otros'];
const TEXTO_GUARDAR = 'Inscribir libro en el estante';
const TEXTO_ACTUALIZAR = 'Actualizar libro';
const $ = (id) => document.getElementById(id);
const form = $('form'), msg = $('msg'), librero = $('librero');
const contadorTxt = $('contador-txt');
const buscar = $('buscar'), categoriasBox = $('categorias'), resultado = $('resultado'), limpiar = $('limpiar'), selectCat = $('categoria');
const detalle = $('detalle'), contador = $('contador'), boton = $('guardar');
const cancelar = $('cancelar'), tituloFicha = $('titulo-ficha');
const ficha = document.querySelector('.ficha');
const portada = $('portada'), abrir = $('abrir'), app = $('app');
const audio = $('audio'), btnMusica = $('musica');

let libros = [];
let nuevoId = null;
let activoId = null;
let editandoId = null;
let filtroCat = 'Todas';
let consulta = '';
let animar = true;
let mostrado = 0;
let cargado = false;
let visible = false;
let audioOk = true;
const botones = new Map();

/* ---------- Brasas de fondo ---------- */
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
audio.addEventListener('error', () => { audioOk = false; if (!btnMusica.hidden) avisarMusica(); });
function avisarMusica(texto) {
  const e = audio.error;
  const motivo = texto || (e && e.code === 3 ? 'El archivo de música está dañado o su formato no es compatible.'
    : e && e.code === 2 ? 'Error de red al cargar la música.'
    : 'No se encontró musica.mp3 o no es un MP3 válido.');
  let t = document.querySelector('.toast-musica');
  if (!t) { t = document.createElement('div'); t.className = 'toast-musica'; document.body.appendChild(t); }
  t.textContent = motivo;
  clearTimeout(t._t);
  t.classList.add('ver');
  t._t = setTimeout(() => t.classList.remove('ver'), 7000);
}
function actualizarMusica() {
  const on = !audio.paused;
  btnMusica.innerHTML = on ? ICONOS.nota : ICONOS.notaOff;
  btnMusica.classList.toggle('sonando', on);
  btnMusica.title = on ? 'Pausar música' : 'Activar música';
}
audio.addEventListener('play', actualizarMusica);
audio.addEventListener('pause', actualizarMusica);
btnMusica.addEventListener('click', () => {
  if (!audioOk) { avisarMusica(); return; }
  if (audio.paused) audio.play().catch(() => avisarMusica('No se pudo iniciar la música en este navegador.')); else audio.pause();
});

/* ---------- Portada: abrir el códice ---------- */
abrir.addEventListener('click', () => {
  abrir.disabled = true;
  portada.classList.add('abierto');
  btnMusica.hidden = false;
  actualizarMusica();
  if (audioOk) audio.play().catch(() => avisarMusica('No se pudo iniciar la música en este navegador.'));
  else avisarMusica();
  setTimeout(() => portada.classList.add('salir'), 3100);
  setTimeout(() => { portada.remove(); revelar(); }, 4000);
});

function revelar() {
  visible = true;
  app.classList.remove('oculto');
  if (cargado) { render(); animarContador(libros.length); } else mostrarEspera();
}

/* ---------- Utilidades ---------- */
function hash(texto) {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
function colorDe(l) {
  return COLORES[hash(l.titulo + l.autor) % COLORES.length];
}
function avisar(texto, tipo) {
  const mapa = { ok: 'check', error: 'cruz', edit: 'pluma', borrar: 'papelera', info: 'lis' };
  msg.innerHTML = '';
  if (mapa[tipo]) {
    const ic = document.createElement('span');
    ic.innerHTML = ICONOS[mapa[tipo]];
    msg.appendChild(ic);
  }
  const tx = document.createElement('span');
  tx.textContent = texto;
  msg.appendChild(tx);
  msg.className = '';
  void msg.offsetWidth;
  msg.className = 'pop ' + (tipo || '');
}
function animarContador(destino) {
  const inicio = mostrado, t0 = performance.now(), dur = 700;
  function paso(t) {
    const p = Math.min(1, (t - t0) / dur);
    const n = Math.round(inicio + (destino - inicio) * p);
    contadorTxt.textContent = n + (n === 1 ? ' libro' : ' libros') + ' en la biblioteca';
    if (p < 1) requestAnimationFrame(paso); else mostrado = destino;
  }
  requestAnimationFrame(paso);
}
function mostrarHint() {
  detalle.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'hint';
  p.textContent = 'Toca un libro para sacarlo del estante y leer su pergamino.';
  detalle.appendChild(p);
}

/* ---------- Categorías y búsqueda ---------- */
function normalizar(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function catDe(l) {
  return l.categoria || 'Otros';
}
function filtrados() {
  const q = normalizar(consulta.trim());
  return libros.filter((l) =>
    (filtroCat === 'Todas' || catDe(l) === filtroCat) &&
    (!q || normalizar(l.titulo).includes(q) || normalizar(l.autor).includes(q))
  );
}
function construirCategorias() {
  selectCat.innerHTML = '';
  CATEGORIAS.forEach((c) => {
    const o = document.createElement('option');
    o.value = c;
    o.textContent = c;
    if (c === 'Otros') o.setAttribute('selected', '');
    selectCat.appendChild(o);
  });
  categoriasBox.innerHTML = '';
  ['Todas', ...CATEGORIAS].forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.cat = c;
    b.textContent = c;
    b.addEventListener('click', () => { filtroCat = c; render(); });
    categoriasBox.appendChild(b);
  });
  actualizarChips();
}
function actualizarChips() {
  const cuenta = {};
  libros.forEach((l) => { cuenta[catDe(l)] = (cuenta[catDe(l)] || 0) + 1; });
  categoriasBox.querySelectorAll('.chip').forEach((b) => {
    const c = b.dataset.cat;
    const n = c === 'Todas' ? libros.length : cuenta[c] || 0;
    b.textContent = n ? c + ' (' + n + ')' : c;
    b.classList.toggle('activa', c === filtroCat);
  });
}
buscar.addEventListener('input', () => { consulta = buscar.value; render(); });
limpiar.addEventListener('click', () => {
  filtroCat = 'Todas';
  consulta = '';
  buscar.value = '';
  render();
});

/* ---------- Estantes ---------- */
function crearLibro(l, i) {
  const h = hash(l.titulo + l.autor);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'libro' + (animar ? ' entra' : '') + (l._id === nuevoId ? ' nuevo' : '') + (l._id === activoId ? ' activo' : '');
  btn.style.setProperty('--d', i * 45 + 'ms');
  btn.style.backgroundColor = colorDe(l);
  btn.style.height = 120 + (h % 55) + 'px';
  btn.style.width = 34 + (h % 5) * 6 + 'px';
  btn.title = l.titulo;
  btn.textContent = l.titulo;
  btn.addEventListener('click', () => mostrarDetalle(l, colorDe(l)));
  botones.set(l._id, btn);
  return btn;
}

function render() {
  librero.innerHTML = '';
  botones.clear();
  const lista = filtrados();
  const porEstante = Math.max(4, Math.floor((librero.clientWidth - 60) / 46));
  const estantes = Math.max(2, Math.ceil(lista.length / porEstante));
  let idx = 0;
  for (let i = 0; i < estantes; i++) {
    const est = document.createElement('div');
    est.className = 'estante';
    const fila = document.createElement('div');
    fila.className = 'libros';
    lista.slice(i * porEstante, (i + 1) * porEstante).forEach((l) => fila.appendChild(crearLibro(l, idx++)));
    const tabla = document.createElement('div');
    tabla.className = 'tabla';
    est.appendChild(fila);
    est.appendChild(tabla);
    librero.appendChild(est);
  }
  if (!lista.length) {
    const v = document.createElement('p');
    v.className = 'vacio';
    v.textContent = libros.length ? 'Ningún libro coincide con tu búsqueda.' : 'El estante está vacío. Inscribe tu primer libro.';
    librero.appendChild(v);
  }
  const hayFiltro = filtroCat !== 'Todas' || consulta.trim() !== '';
  resultado.textContent = hayFiltro
    ? 'Mostrando ' + lista.length + ' de ' + libros.length + (libros.length === 1 ? ' libro' : ' libros')
    : libros.length + (libros.length === 1 ? ' libro' : ' libros') + ' en el estante';
  limpiar.hidden = !hayFiltro;
  actualizarChips();
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

/* ---------- Pergamino del libro (consulta + editar + eliminar) ---------- */
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
  linea('Categoría: ' + catDe(l));
  if (l.isbn) linea('ISBN: ' + l.isbn);
  if (l.anio) linea('Año: ' + l.anio);
  linea('Inscrito: ' + new Date(l.fechaRegistro).toLocaleString('es-MX'));

  const acciones = document.createElement('div');
  acciones.className = 'acciones';
  const bEditar = document.createElement('button');
  bEditar.type = 'button';
  bEditar.className = 'btn-sec';
  bEditar.innerHTML = ICONOS.pluma + '<span>Editar</span>';
  bEditar.addEventListener('click', () => entrarEdicion(l));
  const bBorrar = document.createElement('button');
  bBorrar.type = 'button';
  bBorrar.className = 'btn-sec borrar';
  bBorrar.innerHTML = ICONOS.papelera + '<span>Eliminar</span>';
  bBorrar.addEventListener('click', () => eliminar(l));
  acciones.appendChild(bEditar);
  acciones.appendChild(bBorrar);
  card.appendChild(acciones);

  detalle.appendChild(card);
  detalle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- ACTUALIZACIÓN: modo edición ---------- */
function entrarEdicion(l) {
  editandoId = l._id;
  const campo = (n) => form.querySelector('[name=' + n + ']');
  campo('titulo').value = l.titulo;
  campo('autor').value = l.autor;
  campo('isbn').value = l.isbn || '';
  campo('anio').value = l.anio == null ? '' : l.anio;
  campo('categoria').value = catDe(l);
  boton.textContent = TEXTO_ACTUALIZAR;
  cancelar.hidden = false;
  tituloFicha.textContent = 'Corregir pergamino';
  ficha.classList.add('editando');
  avisar('Editando "' + l.titulo + '"', 'edit');
  ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
  campo('titulo').focus({ preventScroll: true });
}

function salirEdicion() {
  editandoId = null;
  form.reset();
  boton.textContent = TEXTO_GUARDAR;
  cancelar.hidden = true;
  tituloFicha.textContent = 'Pergamino de registro';
  ficha.classList.remove('editando');
}

cancelar.addEventListener('click', () => {
  salirEdicion();
  avisar('Edición cancelada', 'info');
});

/* ---------- ELIMINACIÓN ---------- */
async function eliminar(l) {
  if (!confirm('¿Eliminar "' + l.titulo + '" del estante? Esta acción no se puede deshacer.')) return;
  try {
    const res = await fetch('/api/libros/' + l._id, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'No se pudo eliminar');
    }
    const btn = botones.get(l._id);
    if (btn) btn.classList.add('sale');
    setTimeout(() => {
      libros = libros.filter((x) => x._id !== l._id);
      if (activoId === l._id) { activoId = null; mostrarHint(); }
      if (editandoId === l._id) salirEdicion();
      render();
      animarContador(libros.length);
      avisar('Libro eliminado de la base de datos', 'borrar');
    }, 450);
  } catch (e) {
    avisar(e.message, 'error');
  }
}

/* ---------- CONSULTA: carga inicial (empieza desde la portada) ---------- */
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

/* ---------- INSERCIÓN y ACTUALIZACIÓN: envío del formulario ---------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  const editando = editandoId;
  if (editando) {
    datos.anio = datos.anio === '' ? null : datos.anio;
  } else if (!datos.anio) {
    delete datos.anio;
  }
  boton.disabled = true;
  boton.classList.add('cargando');
  boton.textContent = editando ? 'Actualizando…' : 'Inscribiendo…';
  try {
    const res = await fetch(editando ? '/api/libros/' + editando : '/api/libros', {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      const guardado = await res.json();
      if (editando) {
        libros = libros.map((x) => (x._id === guardado._id ? guardado : x));
        salirEdicion();
        avisar('Libro actualizado en la base de datos', 'ok');
        render();
        if (activoId === guardado._id) mostrarDetalle(guardado, colorDe(guardado));
      } else {
        nuevoId = guardado._id;
        avisar('Libro inscrito en la base de datos y colocado en el estante', 'ok');
        form.reset();
        filtroCat = 'Todas';
        consulta = '';
        buscar.value = '';
        libros.unshift(guardado);
        render();
        animarContador(libros.length);
      }
    } else {
      const err = await res.json();
      avisar(err.error, 'error');
    }
  } catch (e) {
    avisar('No se pudo conectar con el servidor', 'error');
  } finally {
    boton.disabled = false;
    boton.classList.remove('cargando');
    boton.textContent = editandoId ? TEXTO_ACTUALIZAR : TEXTO_GUARDAR;
  }
});

let t;
window.addEventListener('resize', () => {
  clearTimeout(t);
  t = setTimeout(() => { if (visible && cargado) render(); }, 150);
});
construirCategorias();
cargar();
