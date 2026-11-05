/* ===== STOP MOTION: boneco de massinha, ciclo de caminhada com 24 poses ===== */
const POSES = 24, FPS = 12;   // 24 poses por passada, "filmado" a 12 quadros por segundo
const NS = 'http://www.w3.org/2000/svg';
const ruido = (n = 1.4) => (Math.random() - .5) * n;   // imperfeição da mão do animador

function bonecoHTML(p){
  const perna = (k, calca, sapato) => `
    <g data-k="coxa${k}"><line x2="0" y2="26" stroke="${calca}" stroke-width="13" stroke-linecap="round"/>
      <g data-k="canela${k}"><line x2="0" y2="24" stroke="${calca}" stroke-width="12" stroke-linecap="round"/>
        <g data-k="pe${k}"><ellipse cx="6" cy="3" rx="10.5" ry="5.5" fill="${sapato}"/></g></g></g>`;
  const braco = (k, manga, pele) => `
    <g data-k="ombro${k}"><line x2="0" y2="19" stroke="${manga}" stroke-width="10.5" stroke-linecap="round"/>
      <g data-k="cotovelo${k}"><line x2="0" y2="17" stroke="${pele}" stroke-width="8.5" stroke-linecap="round"/>
        <circle cy="19" r="5.6" fill="${pele}"/></g></g>`;
  return `
  <defs>
    <radialGradient id="${p}pele" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#f4c896"/><stop offset="1" stop-color="#b06a3a"/></radialGradient>
    <linearGradient id="${p}camisa" x1="0" x2="1"><stop offset="0" stop-color="#ea8352"/><stop offset=".6" stop-color="#c9572d"/><stop offset="1" stop-color="#93391a"/></linearGradient>
    <linearGradient id="${p}chapeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c56a"/><stop offset="1" stop-color="#c58f2e"/></linearGradient>
    <filter id="${p}massa" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="1" result="r"/>
      <feDisplacementMap in="SourceGraphic" in2="r" scale="2.4"/>
    </filter>
  </defs>
  <g filter="url(#${p}massa)" data-k="raiz">
    <g data-k="inclinaB">${braco('B', '#8a3517', '#a5653a')}</g>
    ${perna('B', '#1f4e4a', '#22140c')}
    ${perna('A', '#2d726c', '#3b2417')}
    <g data-k="inclina">
      <path d="M-12,-50 Q-16,-24 -12,3 L12,3 Q16,-24 12,-50 Q0,-56 -12,-50Z" fill="url(#${p}camisa)"/>
      <path d="M-12,-4 L12,-4" stroke="#5a2a14" stroke-width="3" opacity=".6"/>
      <circle cx="9" cy="-32" r="1.6" fill="#5a2a14" opacity=".55"/><circle cx="10" cy="-20" r="1.6" fill="#5a2a14" opacity=".55"/>
      <rect x="-3" y="-57" width="8" height="9" rx="3" fill="url(#${p}pele)"/>
      <path d="M-9,-51 L11,-51 L4,-41Z" fill="#3aa59c"/>
      <g data-k="cabeca">
        <circle r="15" fill="url(#${p}pele)"/>
        <ellipse cx="-5" cy="2" rx="4" ry="5" fill="#a85f34" opacity=".5"/>
        <ellipse cx="8.5" cy="-1" rx="2.1" ry="2.8" fill="#1a0f0a" data-k="olho"/>
        <circle cx="9.2" cy="-2" r=".8" fill="#fff"/>
        <path d="M5,-6 Q9,-8 12,-6" stroke="#3b2417" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <circle cx="15.5" cy="2.5" r="3.6" fill="#d9925c"/>
        <circle cx="7" cy="6" r="3" fill="#e2735a" opacity=".45"/>
        <path d="M8,9 Q11,11 13,8.5" stroke="#5a2a14" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M-13,-8 Q-11,-23 2,-24 Q14,-23 13,-8Z" fill="url(#${p}chapeu)"/>
        <path d="M-13,-11 Q0,-13 13,-11" stroke="#a8431f" stroke-width="3.2" fill="none"/>
        <ellipse cx="1" cy="-8" rx="24" ry="5" fill="#d9a441"/>
        <path d="M-20,-8 Q1,-4 22,-8" stroke="#b07a25" stroke-width="1.2" fill="none" opacity=".7"/>
      </g>
      ${braco('A', 'url(#' + p + 'camisa)', 'url(#' + p + 'pele)')}
    </g>
  </g>`;
}

function criarBoneco(g, p){
  g.innerHTML = bonecoHTML(p);
  const k = {}; g.querySelectorAll('[data-k]').forEach(e => k[e.dataset.k] = e);
  const turb = g.querySelector('feTurbulence');
  const tr = (el, x, y, ang) => el.setAttribute('transform', `translate(${x} ${y}) rotate(${(ang + ruido()).toFixed(2)})`);
  function perna(s, f){
    const coxa = -24 * Math.cos(2 * Math.PI * f);
    const joelho = f < .5 ? 7 * Math.sin(Math.PI * f / .5) : 58 * Math.sin(Math.PI * (f - .5) / .5);
    const pe = -(coxa + joelho) + (f > .5 ? 22 * Math.sin(Math.PI * (f - .5) / .5) : 0);
    tr(k['coxa' + s], 0, 0, coxa); tr(k['canela' + s], 0, 26, joelho); tr(k['pe' + s], 0, 24, pe);
  }
  function braco(s, f){
    const c = Math.cos(2 * Math.PI * f);
    tr(k['ombro' + s], 0, -42, 26 * c); tr(k['cotovelo' + s], 0, 19, -18 - 15 * (1 - c) / 2);
  }
  let piscar = 0;
  return function pose(t, quadro){
    const sobe = -5 * Math.sin(2 * Math.PI * t) ** 2;          // o quadril sobe quando as pernas se cruzam
    k.raiz.setAttribute('transform', `translate(${ruido(.5).toFixed(2)} ${(-53 + sobe + ruido(.5)).toFixed(2)})`);
    perna('A', t); perna('B', (t + .5) % 1);
    braco('A', (t + .5) % 1); braco('B', t);
    const inc = 5 + 2 * Math.sin(4 * Math.PI * t);
    tr(k.inclina, 0, 0, inc); tr(k.inclinaB, 0, 0, inc);
    tr(k.cabeca, 3, -64, -3 * Math.sin(4 * Math.PI * t + .7));
    if (piscar > 0) piscar--; else if (Math.random() < .03) piscar = 2;   // piscadinha
    k.olho.setAttribute('ry', piscar ? .5 : 2.8);
    if (quadro % 2 === 0) turb.setAttribute('seed', 1 + (quadro / 2) % 5); // massinha "fervendo"
    return sobe;
  };
}

function cenarioHTML(){
  const casa = x => `<g transform="translate(${x} 250)">
      <rect x="-34" y="-46" width="68" height="46" rx="3" fill="#b8693b"/><rect x="-34" y="-46" width="68" height="46" rx="3" fill="url(#textura)"/>
      <path d="M-42,-44 L0,-74 L42,-44Z" fill="#7a2f1a"/><path d="M-42,-44 L0,-74 L42,-44" stroke="#5a2010" stroke-width="3" fill="none"/>
      <rect x="-8" y="-28" width="16" height="28" rx="2" fill="#3b2417"/><rect x="14" y="-34" width="13" height="12" fill="#2f8a83"/><rect x="-27" y="-34" width="13" height="12" fill="#2f8a83"/></g>`;
  const cacto = (x, h) => `<g transform="translate(${x} 250)" fill="#3f7d4a">
      <rect x="-7" y="${-h}" width="14" height="${h}" rx="7"/><rect x="-22" y="${-h * .62}" width="10" height="${h * .34}" rx="5"/><rect x="-22" y="${-h * .34}" width="18" height="9" rx="4.5"/>
      <rect x="12" y="${-h * .78}" width="10" height="${h * .36}" rx="5"/><rect x="4" y="${-h * .48}" width="18" height="9" rx="4.5"/>
      <path d="M-3,${-h + 8} V-6 M3,${-h + 12} V-8" stroke="#2c5d36" stroke-width="1.5"/></g>`;
  const cerca = x => `<g transform="translate(${x} 250)" stroke="#6b4425" stroke-width="5" stroke-linecap="round"><path d="M0,0 V-30 M24,0 V-30 M48,0 V-30 M-4,-20 H52 M-4,-9 H52"/></g>`;
  const flores = x => `<g transform="translate(${x} 250)"><path d="M0,0 V-14 M7,0 V-10" stroke="#3f7d4a" stroke-width="2"/><circle cy="-15" r="4" fill="#f0b44c"/><circle cx="7" cy="-11" r="3.4" fill="#e2735a"/></g>`;
  const bloco = `${casa(70)}${cacto(190, 64)}${cerca(250)}${flores(330)}${cacto(420, 40)}${flores(455)}`;
  const morro = `<path d="M0,250 Q60,170 140,205 T300,190 T480,210 V250Z" fill="#000" opacity=".22"/>`;
  const cores = ['#e2735a', '#f0b44c', '#3aa59c', '#f4ecdc', '#9b7ad6'];
  const bandeiras = Array.from({length: 12}, (_, i) => `<path d="M${i * 40},${30 + Math.sin(i) * 3} l12,0 l-6,13z" fill="${cores[i % 5]}"/>`).join('');
  const pedras = Array.from({length: 24}, (_, i) => `<ellipse cx="${i * 40 + 12}" cy="${262 + (i % 3) * 9}" rx="${7 + (i % 4) * 2}" ry="2.6" fill="#2a170d"/>`).join('');
  return `
    <defs><pattern id="textura" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#000" opacity=".2"/><circle cx="6" cy="5" r=".8" fill="#fff" opacity=".12"/></pattern></defs>
    <g data-c="morros">${morro}<g transform="translate(480 0)">${morro}</g></g>
    <g data-c="bandeiras"><path d="M0,30 Q120,40 240,30 T480,30 T720,30 T960,30" stroke="#f4ecdc" stroke-width="1" fill="none" opacity=".5"/>${bandeiras}<g transform="translate(480 0)">${bandeiras}</g></g>
    <g data-c="props">${bloco}<g transform="translate(480 0)">${bloco}</g></g>
    <rect x="0" y="248" width="400" height="60" fill="#3b2417"/>
    <g data-c="chao">${pedras}</g>
    <rect x="0" y="248" width="400" height="3" fill="#5a3a22"/>
    <ellipse data-c="sombra" cx="200" cy="251" rx="28" ry="5" fill="#000" opacity=".4"/>
    <g data-c="boneco"></g>`;
}

function animarCena(svg, comCenario, p){
  let pose; const partes = {};
  if (comCenario){
    svg.innerHTML = cenarioHTML();
    svg.querySelectorAll('[data-c]').forEach(e => partes[e.dataset.c] = e);
    partes.boneco.setAttribute('transform', 'translate(200 251) scale(1.25)');
    const gi = document.createElementNS(NS, 'g'); partes.boneco.appendChild(gi); pose = criarBoneco(gi, p);
  } else {
    const sombra = document.createElementNS(NS, 'ellipse');
    Object.entries({cx: 0, cy: 31, rx: 24, ry: 4.5, fill: '#000', opacity: .45}).forEach(([a, v]) => sombra.setAttribute(a, v));
    const g = document.createElementNS(NS, 'g'); g.setAttribute('transform', 'translate(0 30)');
    svg.append(sombra, g); partes.sombra = sombra; pose = criarBoneco(g, p);
  }
  // o chão anda o mesmo tanto que o pé de apoio, para o pé não "escorregar"
  const passo = 2 * 50 * Math.sin(24 * Math.PI / 180) * 1.25 / (POSES / 2);
  let quadro = 0, desloc = 0;
  return function avancar(){
    quadro++;
    const sobe = pose((quadro % POSES) / POSES, quadro);
    const e = 1 + sobe / 25;
    partes.sombra.setAttribute('rx', ((comCenario ? 28 : 24) * e).toFixed(2));
    partes.sombra.setAttribute('opacity', (.45 * e).toFixed(2));
    if (comCenario){
      desloc += passo;
      partes.chao.setAttribute('transform', `translate(${-(desloc % 480)} 0)`);
      partes.props.setAttribute('transform', `translate(${-(desloc % 480)} 0)`);
      partes.bandeiras.setAttribute('transform', `translate(${-((desloc * .6) % 480)} 0)`);
      partes.morros.setAttribute('transform', `translate(${-((desloc * .25) % 480)} 0)`);
      svg.style.filter = `brightness(${(.95 + Math.random() * .09).toFixed(3)})`; // luz variando de leve entre as fotos
    }
    return quadro;
  };
}

