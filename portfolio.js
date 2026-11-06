/* Monta o portfólio a partir de projetos.js. Não é preciso editar este arquivo. */
(function () {
  var projetos = window.PROJETOS || [];
  var APP_W = 390; // largura de tela de celular em que os apps rodam

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(i) { return String(i + 1).padStart(2, "0"); }

  /* barra de status do celular (hora, sinal, wi-fi e bateria) */
  var STATUS =
    '<div class="status" aria-hidden="true"><span>9:41</span><span class="status-dir">' +
      '<svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor"/><rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor"/><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor"/><rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor"/></svg>' +
      '<svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.2c2.1 0 4 .8 5.5 2.1l1.1-1.2A9.5 9.5 0 0 0 7.5.5 9.5 9.5 0 0 0 .9 3.1L2 4.3a7.9 7.9 0 0 1 5.5-2.1Zm0 3.3c1.2 0 2.3.4 3.2 1.2l1.1-1.2a6.3 6.3 0 0 0-8.6 0l1.1 1.2c.9-.8 2-1.2 3.2-1.2Zm0 3.3c-.4 0-.8.2-1.1.4L7.5 10.5l1.1-1.3c-.3-.2-.7-.4-1.1-.4Z" fill="currentColor"/></svg>' +
      '<svg width="25" height="12" viewBox="0 0 25 12"><rect x=".5" y=".5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/><path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" opacity=".45"/></svg>' +
    '</span></div>';

  /* ---------- celulares ---------- */
  var palco = document.getElementById("palco");
  projetos.forEach(function (p, i) {
    var fig = document.createElement("figure");
    fig.className = "celular-bloco";
    fig.style.setProperty("--capa", p.capinha || "#1C3753");
    fig.innerHTML =
      '<div class="giro" tabindex="0" role="group" aria-label="Celular com o app ' + esc(p.nome) + '. Arraste pela borda ou use as setas para girar e ver a capinha.">' +
      '<div class="celular" id="celular-' + i + '">' +
        '<div class="face frente">' +
          '<span class="botao b-acao"></span><span class="botao b-vol1"></span><span class="botao b-vol2"></span><span class="botao b-power"></span>' +
          '<div class="tela">' +
            STATUS +
            '<span class="ilha" aria-hidden="true"></span>' +
            '<iframe src="' + esc(p.app) + '" title="Mini app ' + esc(p.nome) + '" loading="lazy"></iframe>' +
            '<span class="home-bar" aria-hidden="true"></span>' +
          '</div>' +
        '</div>' +
        '<div class="face verso" aria-hidden="true">' +
          '<span class="botao b-acao"></span><span class="botao b-vol1"></span><span class="botao b-vol2"></span><span class="botao b-power"></span>' +
          '<div class="camera" aria-hidden="true"><span class="lente l1"></span><span class="lente l2"></span><span class="lente l3"></span><span class="flash"></span></div>' +
          '<span class="verso-dp" aria-hidden="true">DP</span>' +
        '</div>' +
      '</div>' +
      '</div>' +
      '<span class="sombra" aria-hidden="true"></span>' +
      '<figcaption>' +
        '<span class="cap-num">' + num(i) + '</span>' +
        '<span class="cap-txt"><strong>' + esc(p.nome) + '</strong><span>' + esc(p.segmento) + '</span></span>' +
        '<span class="cap-acoes">' +
          '<a class="btn-sec" href="' + esc(p.app) + '" target="_blank" rel="noopener">Tela cheia <span aria-hidden="true">↗</span></a>' +
        '</span>' +
      '</figcaption>';
    palco.appendChild(fig);
  });

  /* ajusta o app ao tamanho da tela do mockup */
  function ajustar(tela) {
    var f = tela.querySelector("iframe");
    var s = tela.clientWidth / APP_W;
    var barra = tela.querySelector(".status").offsetHeight;
    f.style.width = APP_W + "px";
    f.style.height = Math.round((tela.clientHeight - barra) / s) + "px";
    f.style.transform = "scale(" + s + ")";
  }
  var telas = document.querySelectorAll(".tela");
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function (es) { es.forEach(function (e) { ajustar(e.target); }); });
    telas.forEach(function (t) { ro.observe(t); });
  } else {
    var tudo = function () { telas.forEach(ajustar); };
    window.addEventListener("resize", tudo); tudo();
  }

  /* girar o celular com o dedo ou o mouse, arrastando pela borda */
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".giro").forEach(function (zona) {
    var cel = zona.querySelector(".celular");
    var frente = cel.querySelector(".frente"), verso = cel.querySelector(".verso");
    var ang = 0, ini = 0, x0 = 0, y0 = 0, arrastando = false, decidido = false, anim = null;
    var hist = [];

    function desenhar() {
      var n = ((ang % 360) + 360) % 360;
      var costas = n > 90 && n < 270;
      var vis = costas ? n - 180 : (n >= 270 ? n - 360 : n);
      cel.style.transform = "perspective(1600px) rotateY(" + vis.toFixed(2) + "deg)";
      if (cel.classList.contains("mostra-verso") !== costas) {
        cel.classList.toggle("mostra-verso", costas);
        frente.setAttribute("aria-hidden", costas ? "true" : "false");
        verso.setAttribute("aria-hidden", costas ? "false" : "true");
      }
    }
    function animarPara(alvo) {
      cancelAnimationFrame(anim);
      if (reduz) { ang = alvo; desenhar(); return; }
      var de = ang, t0 = performance.now(), dur = 520;
      (function passo(t) {
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        ang = de + (alvo - de) * e; desenhar();
        if (k < 1) anim = requestAnimationFrame(passo);
      })(t0);
    }
    zona.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      cancelAnimationFrame(anim);
      arrastando = true; decidido = false;
      x0 = ev.clientX; y0 = ev.clientY; ini = ang; hist = [[performance.now(), ang]];
    });
    zona.addEventListener("pointermove", function (ev) {
      if (!arrastando) return;
      var dx = ev.clientX - x0, dy = ev.clientY - y0;
      if (!decidido) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { arrastando = false; return; }   // rolagem da página
        decidido = true; zona.classList.add("arrastando");
        try { zona.setPointerCapture(ev.pointerId); } catch (e) {}
      }
      ang = ini + dx * 180 / (zona.clientWidth * 0.85);
      hist.push([performance.now(), ang]); if (hist.length > 6) hist.shift();
      desenhar();
    });
    function soltar() {
      if (!arrastando) return;
      arrastando = false; zona.classList.remove("arrastando");
      if (!decidido) return;
      var a = hist[0], b = hist[hist.length - 1];
      var vel = b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;       // graus por ms
      animarPara(Math.round((ang + vel * 180) / 180) * 180);
    }
    zona.addEventListener("pointerup", soltar);
    zona.addEventListener("pointercancel", soltar);
    zona.addEventListener("keydown", function (ev) {
      var alvo = Math.round(ang / 180) * 180;
      if (ev.key === "ArrowRight") alvo += 180;
      else if (ev.key === "ArrowLeft") alvo -= 180;
      else return;
      ev.preventDefault(); animarPara(alvo);
    });
    desenhar();
  });

  /* ---------- detalhes ---------- */
  var lista = document.getElementById("lista-detalhes");
  lista.innerHTML = projetos.map(function (p, i) {
    var meta = [
      ["Cliente", esc(p.cliente)],
      ["Segmento", esc(p.segmento)],
      p.cidade ? ["Local", esc(p.cidade)] : null,
      ["Ano", esc(p.ano)],
      ["Capinha", '<span class="ponto-cor" style="background:' + esc(p.capinha) + '"></span>' + esc(p.capinhaNome)]
    ].filter(Boolean).map(function (m) { return "<div><dt>" + m[0] + "</dt><dd>" + m[1] + "</dd></div>"; }).join("");
    return '<article class="projeto">' +
      '<header class="p-cab">' +
        '<span class="p-num">' + num(i) + '</span>' +
        '<h3>' + esc(p.nome) + '</h3>' +
        '<p class="p-resumo">' + esc(p.resumo) + '</p>' +
        '<dl class="p-meta">' + meta + '</dl>' +
      '</header>' +
      '<div class="p-corpo">' +
        '<div class="p-bloco"><h4>O desafio</h4><p>' + esc(p.desafio) + '</p></div>' +
        '<div class="p-bloco"><h4>A solução</h4><p>' + esc(p.solucao) + '</p></div>' +
        '<div class="p-bloco"><h4>Recursos</h4><ul class="p-lista">' + (p.recursos || []).map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul></div>' +
        '<div class="p-bloco"><h4>Tecnologias</h4><ul class="chips">' + (p.tecnologias || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul></div>' +
        '<a class="p-link" href="' + esc(p.app) + '" target="_blank" rel="noopener">Abrir o app <span aria-hidden="true">↗</span></a>' +
      '</div>' +
    '</article>';
  }).join("");

  /* ---------- números e ano ---------- */
  document.getElementById("total-projetos").textContent = String(projetos.length).padStart(2, "0");
  var ano = String(new Date().getFullYear());
  document.getElementById("ano-atual").textContent = ano;
  document.getElementById("ano-rodape").textContent = ano;
})();
