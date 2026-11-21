const PDFDocument = require('pdfkit');

const C = {
  cafe: '#4a2c14', dorado: '#996515', oro: '#d4a02c', crema: '#f3e3b8',
  crema2: '#fbf3de', tinta: '#2b1a0c', lacre: '#8c1c13'
};
const MARGEN = 40;
// [encabezado, ancho, campo]
const COLUMNAS = [
  ['Título', 238, 'titulo'],
  ['Autor', 150, 'autor'],
  ['ISBN', 110, 'isbn'],
  ['Año', 45, 'anio'],
  ['Editorial', 217, 'editorial']
];
const ANCHO_TABLA = COLUMNAS.reduce((s, c) => s + c[1], 0);

function slug(t) {
  return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'reporte';
}
function celda(v) {
  return v === undefined || v === null || v === '' ? '—' : String(v);
}
function agrupar(lista, clave) {
  const mapa = new Map();
  lista.forEach((l) => {
    const k = clave(l);
    if (!mapa.has(k)) mapa.set(k, []);
    mapa.get(k).push(l);
  });
  return mapa;
}
const ordenES = (a, b) => a.localeCompare(b, 'es');
const ordenSub = (a, b) => (a === 'General') - (b === 'General') || ordenES(a, b);
const porTitulo = (a, b) => String(a.titulo).localeCompare(String(b.titulo), 'es');

/* Escribe en `res` un PDF con los libros agrupados por área y subárea. */
function generarReporte(res, libros, { area, subarea } = {}) {
  const doc = new PDFDocument({
    size: 'A4', layout: 'landscape', margin: MARGEN, bufferPages: true,
    info: { Title: 'Reporte de libros', Author: 'Bibliotheca' }
  });
  const nombre = 'reporte-' + slug(area || 'todas-las-areas') + (subarea ? '-' + slug(subarea) : '') + '.pdf';
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="' + nombre + '"');
  doc.pipe(res);

  const H = doc.page.height;
  const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  function banda() {
    doc.save();
    doc.rect(0, 0, doc.page.width, 46).fill(C.cafe);
    doc.rect(0, 46, doc.page.width, 3).fill(C.oro);
    doc.fillColor('#f0cf7a').font('Times-Bold').fontSize(18).text('Bibliotheca', MARGEN, 13, { lineBreak: false });
    doc.fillColor('#e8d3a2').font('Times-Italic').fontSize(11)
      .text('Reporte de libros', MARGEN, 18, { width: doc.page.width - MARGEN * 2, align: 'right', lineBreak: false });
    doc.restore();
    doc.x = MARGEN;
    doc.y = 66;
  }
  doc.on('pageAdded', banda);
  banda();

  function tituloArea(texto, total) {
    doc.fillColor(C.lacre).font('Times-Bold').fontSize(20).text('Área: ' + texto, MARGEN, doc.y, { width: ANCHO_TABLA });
    doc.fillColor(C.dorado).font('Times-Italic').fontSize(11)
      .text(total + (total === 1 ? ' libro' : ' libros') + '  ·  Generado el ' + fecha, MARGEN, doc.y + 2, { width: ANCHO_TABLA });
    doc.moveDown(0.8);
  }

  function cabeceraTabla(y) {
    doc.rect(MARGEN, y, ANCHO_TABLA, 22).fill(C.dorado);
    let x = MARGEN;
    doc.fillColor('#fff8e6').font('Times-Bold').fontSize(11);
    COLUMNAS.forEach(([t, w]) => {
      doc.text(t, x + 5, y + 6, { width: w - 10, lineBreak: false });
      x += w;
    });
    return y + 22;
  }

  function seccion(titulo, items) {
    if (doc.y > H - 130) doc.addPage();
    doc.fillColor(C.cafe).font('Times-Bold').fontSize(13)
      .text(titulo + '  (' + items.length + (items.length === 1 ? ' libro' : ' libros') + ')', MARGEN, doc.y, { width: ANCHO_TABLA });
    let y = cabeceraTabla(doc.y + 4);
    items.forEach((l, i) => {
      const vals = COLUMNAS.map((c) => celda(l[c[2]]));
      doc.font('Times-Roman').fontSize(10.5);
      const h = Math.max(...vals.map((v, k) => doc.heightOfString(v, { width: COLUMNAS[k][1] - 10 }))) + 10;
      if (y + h > H - 55) {
        doc.addPage();
        y = cabeceraTabla(doc.y);
      }
      doc.rect(MARGEN, y, ANCHO_TABLA, h).fill(i % 2 ? C.crema2 : C.crema);
      doc.fillColor(C.tinta).font('Times-Roman').fontSize(10.5);
      let x = MARGEN;
      vals.forEach((v, k) => {
        doc.text(v, x + 5, y + 5, { width: COLUMNAS[k][1] - 10 });
        x += COLUMNAS[k][1];
      });
      y += h;
    });
    doc.x = MARGEN;
    doc.y = y + 14;
  }

  const porArea = agrupar(libros, (l) => l.area || 'Otros');
  const areas = [...porArea.keys()].sort(ordenES);
  if (!areas.length) {
    tituloArea(area || 'Todas las áreas', 0);
    doc.fillColor(C.tinta).font('Times-Italic').fontSize(13)
      .text('No hay libros registrados para este reporte.', MARGEN, doc.y, { width: ANCHO_TABLA });
  }
  areas.forEach((a, i) => {
    if (i > 0) doc.addPage();
    const items = porArea.get(a);
    tituloArea(a + (subarea ? '  —  Subárea: ' + subarea : ''), items.length);
    const porSub = agrupar(items, (l) => l.subarea || 'General');
    [...porSub.keys()].sort(ordenSub).forEach((s) => seccion('Subárea: ' + s, porSub.get(s).sort(porTitulo)));
  });

  // Numeración de páginas
  const { count } = doc.bufferedPageRange();
  for (let i = 0; i < count; i++) {
    doc.switchToPage(i);
    const margenInferior = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.fillColor(C.dorado).font('Times-Italic').fontSize(9)
      .text('Página ' + (i + 1) + ' de ' + count, MARGEN, H - 28, { width: ANCHO_TABLA, align: 'center', lineBreak: false });
    doc.page.margins.bottom = margenInferior;
  }
  doc.end();
}

module.exports = { generarReporte };
