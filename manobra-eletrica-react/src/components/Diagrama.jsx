import React, { useEffect, useRef } from "react";
import "../assets/css/Diagrama.css";
import svgUrl from "@/assets/svg/I-DE-3010.2J-5140-946-KES-001_B_202509002_1513.svg?url";

export default function Diagrama(){
  const holderRef = useRef(null);
  const canvasRef = useRef(null);
  const listGenRef = useRef(null);
  const listDjRef = useRef(null);
  const mounted = useRef(false);

  // estado de zoom guardado em refs + CSS vars (sem inline nos elementos do SVG)
  const scaleRef = useRef(1);
  const baseWRef = useRef(2000);
  const baseHRef = useRef(1000);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    (async () => {
      // cria o canvas onde o SVG será injetado
      holderRef.current.innerHTML = '<div class="canvas"></div>';
      const canvas = holderRef.current.querySelector(".canvas");
      canvasRef.current = canvas;

      const txt = await fetch(svgUrl).then(r => {
        if (!r.ok) throw new Error(`Falha ao carregar SVG: ${r.status}`);
        return r.text();
      });

      canvas.innerHTML = txt;
      const svg = canvas.querySelector("svg");
      if (!svg) {
        holderRef.current.textContent = "SVG inválido.";
        return;
      }

      // mede o SVG para configurar scroll + zoom com tamanho real
      const { w, h } = measureSvg(svg);
      baseWRef.current = w;
      baseHRef.current = h;
      setCssVar('--svg-w', w);
      setCssVar('--svg-h', h);
      setCssVar('--zoom', scaleRef.current);

      // ===== Seletor dos GERADORES =====
      const GEN_SELECTOR = [
        'g[id^="TG-"]',
        'g[inkscape\\:label^="TG-"]',
        'g[id^="_tg_"]'
      ].join(',');

      // ===== Seletor dos DISJUNTORES =====
      const DJ_IN_LAYER = 'g[inkscape\\:label=".disjuntor"] g[id^="id_dj_"]';
      const DJ_TG       = [
        'g[id^="disjuntor_tg_"]',
        'g[inkscape\\:label^="disjuntor_tg_"]'
      ].join(',');

      const genGroups = uniq(Array.from(svg.querySelectorAll(GEN_SELECTOR)));
      const djGroups  = uniq([
        ...Array.from(svg.querySelectorAll(DJ_IN_LAYER)),
        ...Array.from(svg.querySelectorAll(DJ_TG))
      ]);

      listGenRef.current.innerHTML = "";
      const genControls = buildControls(genGroups, "gerador", listGenRef.current, labelGen);

      listDjRef.current.innerHTML  = "";
      const djControls  = buildControls(djGroups,  "disjuntor", listDjRef.current,  labelDj);

      // botões globais
      document.getElementById("genAllOn").onclick  = () => genControls.forEach(c => c.set("on"));
      document.getElementById("genAllOff").onclick = () => genControls.forEach(c => c.set("off"));
      document.getElementById("genAllNeu").onclick = () => genControls.forEach(c => c.set("neutral"));
      document.getElementById("djAllOn").onclick   = () => djControls.forEach(c => c.set("on"));
      document.getElementById("djAllOff").onclick  = () => djControls.forEach(c => c.set("off"));
      document.getElementById("djAllNeu").onclick  = () => djControls.forEach(c => c.set("neutral"));

      // ===== ZOOM: botões + roda do mouse só dentro do holder =====
      const btnIn  = document.getElementById("zoomIn");
      const btnOut = document.getElementById("zoomOut");
      const btn100 = document.getElementById("zoomReset");

      btnIn.onclick  = () => zoomTo(scaleRef.current * 1.1);
      btnOut.onclick = () => zoomTo(scaleRef.current / 1.1);
      btn100.onclick = () => zoomTo(1);

      holderRef.current.addEventListener("wheel", (e) => {
        // zoom sob o cursor, sem afetar o resto da página
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1/1.1 : 1.1;
        zoomTo(scaleRef.current * factor, e);
      }, { passive: false });

    })().catch(err => {
      holderRef.current.textContent = err.message;
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }, []);

  // ===== render =====
  return (
    <div className="page">
      <section className="panel">
        <h2>Geradores</h2>
        <div ref={listGenRef} className="controls" role="list" aria-label="Geradores" />
        <div className="toolbar">
          <button id="genAllOn"  className="small" type="button">Ligar todos</button>
          <button id="genAllOff" className="small" type="button">Desligar todos</button>
          <button id="genAllNeu" className="small" type="button">Neutro</button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--br)", margin: "14px 0" }} />

        <h2>Disjuntores</h2>
        <div ref={listDjRef} className="controls" role="list" aria-label="Disjuntores" />
        <div className="toolbar">
          <button id="djAllOn"  className="small" type="button">Ligar todos</button>
          <button id="djAllOff" className="small" type="button">Desligar todos</button>
          <button id="djAllNeu" className="small" type="button">Neutro</button>
        </div>
      </section>

      <section className="panel svgWrap">
        {/* Toolbar de zoom só para esta área */}
        <div className="zoomBar">
          <button id="zoomOut"  className="zoombtn" type="button">−</button>
          <button id="zoomReset" className="zoombtn" type="button">100%</button>
          <button id="zoomIn"   className="zoombtn" type="button">+</button>
        </div>

        {/* Área rolável do diagrama */}
        <div ref={holderRef} className="holder" aria-busy="true">Carregando diagrama…</div>
      </section>
    </div>
  );

  /* ===== helpers ===== */

  function setCssVar(name, value){
    // aplica variável CSS na área do holder (escopo local)
    holderRef.current?.style.setProperty(name, String(value));
  }

  // zoom com ancoragem no cursor (mantém o ponto sob o mouse)
  function zoomTo(nextScale, wheelEvent){
    const min = 0.25, max = 4;
    nextScale = Math.min(max, Math.max(min, nextScale));
    const holder = holderRef.current;
    const canvas = canvasRef.current;
    if (!holder || !canvas) return;

    const prev = scaleRef.current;
    if (Math.abs(prev - nextScale) < 0.001) return;

    // coordenadas do cursor no conteúdo antes do zoom
    let cx = holder.clientWidth  / 2;
    let cy = holder.clientHeight / 2;
    if (wheelEvent){
      const r = holder.getBoundingClientRect();
      cx = wheelEvent.clientX - r.left;
      cy = wheelEvent.clientY - r.top;
    }
    const contentX = (holder.scrollLeft + cx) / prev;
    const contentY = (holder.scrollTop  + cy) / prev;

    // aplica novo zoom atualizando as variáveis que definem o tamanho do canvas
    scaleRef.current = nextScale;
    setCssVar('--zoom', nextScale);

    // atualiza scroll para manter o ponto ancorado
    holder.scrollLeft = contentX * nextScale - cx;
    holder.scrollTop  = contentY * nextScale - cy;
  }

  function measureSvg(svg){
    // usa viewBox se existir; senão, mede o bbox do conteúdo
    const vb = svg.getAttribute("viewBox");
    if (vb){
      const nums = vb.trim().split(/[\s,]+/).map(Number);
      return { w: nums[2] || 2000, h: nums[3] || 1000 };
    }
    try{
      const bb = svg.getBBox();
      return { w: Math.max(1, bb.width), h: Math.max(1, bb.height) };
    }catch{
      const r = svg.getBoundingClientRect();
      return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
    }
  }
}

/* ==== funções já existentes (sem mudanças de regra) ==== */
function uniq(arr){
  const out = [], seen = new Set();
  for (const g of arr){
    if (!g) continue;
    const key = g.id || g.getAttribute("inkscape:label") || g;
    if (!seen.has(key)){ seen.add(key); out.push(g); }
  }
  return out;
}

function labelGen(g){
  const t = g.querySelector("text");
  if (t){
    const s = (t.textContent || "").trim();
    const m = s.match(/GE-TS-5147001[\w\-]+/i);
    if (m) return m[0].toUpperCase();
  }
  return g.getAttribute("inkscape:label") || g.id || "Gerador";
}

function labelDj(g){
  const id  = g.id || "";
  const lab = g.getAttribute("inkscape:label") || "";

  const m = (id || lab).match(/id_dj_(\d+)_?(\d+)?_?([a-z0-9\-]+)?/i);
  if (m){
    const a = m[1] || "";
    const b = m[2] ? `-${m[2]}` : "";
    const c = m[3] ? ` ${m[3].toUpperCase().replace(/-/g,"-")}` : "";
    return `DJ ${a}${b}${c}`.trim();
  }
  const n = (id || lab).match(/disjuntor_tg_([a-z])/i);
  if (n) return `Disjuntor TG-${n[1].toUpperCase()}`;
  return lab || id || "Disjuntor";
}

function buildControls(groups, kind, container, makeLabel){
  const list = [];
  groups.forEach(g => {
    g.classList.add(kind, "is-off"); // estado inicial: OFF (verde)

    const row = document.createElement("div");
    row.className = "row"; row.setAttribute("role","listitem");

    const left = document.createElement("div");
    const dot  = document.createElement("span"); dot.className = "dot off";
    const name = document.createElement("span"); name.className = "name";
    name.textContent = makeLabel(g);
    left.append(dot, name);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "small";
    toggle.textContent = "Alternar";

    function set(state){ // 'on' | 'off' | 'neutral'
      g.classList.remove("is-on", "is-off");
      dot.classList.remove("on","off");
      if (state === "on"){
        g.classList.add("is-on");
        dot.classList.add("on");
      } else if (state === "off"){
        g.classList.add("is-off");
        dot.classList.add("off");
      }
    }

    toggle.addEventListener("click", () => {
      const isOn = g.classList.contains("is-on");
      set(isOn ? "off" : "on");
    });

    g.addEventListener("click", (ev) => {
      ev.preventDefault();
      const isOn = g.classList.contains("is-on");
      set(isOn ? "off" : "on");
    });

    row.append(left, toggle);
    container.appendChild(row);
    list.push({ group: g, set });
  });
  return list;
}
