const COLORES = ['#5c3a1e', '#7a2e1d', '#3d4a2a', '#8a5a1c', '#4a2c2a', '#996515', '#2f3b4f', '#6e3b1b'];
const TEXTO_GUARDAR = 'Inscribir libro en el estante';
const TEXTO_ACTUALIZAR = 'Actualizar libro';
const $ = (id) => document.getElementById(id);
const form = $('form'), msg = $('msg'), librero = $('librero');
const detalle = $('detalle'), contador = $('contador'), boton = $('guardar');
const cancelar = $('cancelar'), tituloFicha = $('titulo-ficha');
const ficha = document.querySelector('.ficha');
const portada = $('portada'), abrir = $('abrir'), app = $('app');
const audio = $('audio'), btnMusica = $('musica');

let libros = [];
let nuevoId = null;
let activoId = null;
let editandoId = null;
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

/* ---------- Portada: abrir el códice ---------- */
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

/* ---------- Utilidades ---------- */
function hash(texto) {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
function colorDe(l) {
  return COLORES[hash(l.titulo + l.autor) % COLORES.length];
}
function avisar(texto) {
  msg.textContent = texto;
  msg.className = '';
  void msg.offsetWidth;
  msg.className = 'pop';
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
function mostrarHint() {
  detalle.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'hint';
  p.textContent = 'Toca un libro para sacarlo del estante y leer su pergamino.';
  detalle.appendChild(p);
}

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
  if (l.isbn) linea('ISBN: ' + l.isbn);
  if (l.anio) linea('Año: ' + l.anio);
  linea('Inscrito: ' + new Date(l.fechaRegistro).toLocaleString('es-MX'));

  const acciones = document.createElement('div');
  acciones.className = 'acciones';
  const bEditar = document.createElement('button');
  bEditar.type = 'button';
  bEditar.className = 'btn-sec';
  bEditar.textContent = '✏️ Editar';
  bEditar.addEventListener('click', () => entrarEdicion(l));
  const bBorrar = document.createElement('button');
  bBorrar.type = 'button';
  bBorrar.className = 'btn-sec borrar';
  bBorrar.textContent = '🗑️ Eliminar';
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
  form.titulo.value = l.titulo;
  form.autor.value = l.autor;
  form.isbn.value = l.isbn || '';
  form.anio.value = l.anio == null ? '' : l.anio;
  boton.textContent = TEXTO_ACTUALIZAR;
  cancelar.hidden = false;
  tituloFicha.textContent = 'Corregir pergamino';
  ficha.classList.add('editando');
  avisar('✏️ Editando "' + l.titulo + '"');
  ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
  form.titulo.focus({ preventScroll: true });
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
  avisar('Edición cancelada');
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
      avisar('🗑️ Libro eliminado de la base de datos');
    }, 450);
  } catch (e) {
    avisar('❌ ' + e.message);
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
        avisar('✅ Libro actualizado en la base de datos');
        render();
        if (activoId === guardado._id) mostrarDetalle(guardado, colorDe(guardado));
      } else {
        nuevoId = guardado._id;
        avisar('✅ Libro inscrito en la base de datos y colocado en el estante');
        form.reset();
        libros.unshift(guardado);
        render();
        animarContador(libros.length);
      }
    } else {
      const err = await res.json();
      avisar('❌ ' + err.error);
    }
  } catch (e) {
    avisar('❌ No se pudo conectar con el servidor');
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
cargar();
