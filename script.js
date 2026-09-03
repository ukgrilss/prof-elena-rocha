/* =========================================================================
   Kit Setembro Amarelo — script unico
   -------------------------------------------------------------------------
   O que mudou em relacao ao arquivo antigo, e por que:

   1. passUTMs procurava links de "hotmart.com". O checkout desta pagina e
      pay.wiapy.com, entao NENHUMA UTM chegava no checkout — sobra do
      template de onde a pagina foi copiada. Corrigido pra wiapy.

   2. Sairam o contador de "pessoas na cidade" que subia sozinho com
      Math.random, a barra de "92% esgotando" e o cronometro de 15 min que
      reiniciava a cada carregamento. Nenhum media a coisa nenhuma.

   3. A contagem agora e de dias reais ate o fim do Setembro Amarelo.

   4. Prova social e aviso de venda leem window.KIT (no topo do index.html).
      Vazio = nao aparece. Nada e gerado pelo script.

   5. O botao do hero e a barra do celular apontam pra #planos, nao pro
      checkout: a pessoa cai na secao com os dois precos e escolhe ali.
      Quem carrega UTM pro checkout sao os 3 links de pagamento que sobraram
      (basico, premium e o do fechamento) — ancora nao precisa de UTM.
   ========================================================================= */

(function () {
  'use strict';

  var CFG = window.KIT || {};
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     CARROSSEL
     ------------------------------------------------------------------ */
  (function carrossel() {
    var trilha = document.getElementById('trilha');
    if (!trilha) return;

    var fotos = trilha.children;
    var bolinhas = document.getElementById('bolinhas');
    var atual = 0;
    var timer;

    for (var i = 0; i < fotos.length; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bolinha';
      b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
      b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      b.addEventListener('click', (function (n) {
        return function () { vaiPara(n); reinicia(); };
      })(i));
      bolinhas.appendChild(b);
    }

    function vaiPara(n) {
      atual = (n + fotos.length) % fotos.length;
      trilha.style.transform = 'translateX(-' + (atual * 100) + '%)';
      var pontos = bolinhas.children;
      for (var i = 0; i < pontos.length; i++) {
        pontos[i].setAttribute('aria-current', i === atual ? 'true' : 'false');
      }
    }

    function proxima() { vaiPara(atual + 1); }
    function anterior() { vaiPara(atual - 1); }

    document.getElementById('prox').addEventListener('click', function () { proxima(); reinicia(); });
    document.getElementById('ant').addEventListener('click', function () { anterior(); reinicia(); });

    var x0 = 0;
    trilha.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    trilha.addEventListener('touchend', function (e) {
      var d = x0 - e.changedTouches[0].clientX;
      if (Math.abs(d) > 40) { d > 0 ? proxima() : anterior(); reinicia(); }
    });

    function comeca() { if (!semMovimento) timer = setInterval(proxima, 5000); }
    function reinicia() { clearInterval(timer); comeca(); }
    comeca();
  })();

  /* ------------------------------------------------------------------
     DIAS ATE O FIM DO SETEMBRO AMARELO
     Prazo de verdade: a campanha acaba em 30/09. Se a data ja passou, o
     texto de urgencia simplesmente sai do ar em vez de mentir.
     ------------------------------------------------------------------ */
  (function contagem() {
    var fim = CFG.fimDaCampanha;
    if (!fim) return;

    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var alvo = new Date(fim + 'T00:00:00');
    var dias = Math.round((alvo - hoje) / 86400000);

    var naTopbar = document.getElementById('dias-restantes');
    var noFecho = document.getElementById('fecho-dias');

    if (dias > 1) {
      if (naTopbar) naTopbar.textContent = 'faltam ' + dias + ' dias';
      if (noFecho) noFecho.textContent = 'Faltam ' + dias + ' dias pro fim da campanha. Da tempo de imprimir e montar com folga.';
    } else if (dias === 1) {
      if (naTopbar) naTopbar.textContent = 'e amanha';
      if (noFecho) noFecho.textContent = 'Amanha e o ultimo dia da campanha.';
    } else if (dias === 0) {
      if (naTopbar) naTopbar.textContent = 'e hoje';
      if (noFecho) noFecho.textContent = 'Hoje e o ultimo dia da campanha.';
    } else {
      if (naTopbar) naTopbar.closest('.topbar').hidden = true;
      if (noFecho) noFecho.textContent = 'O kit continua disponivel pra usar no ano que vem.';
    }
  })();

  /* ------------------------------------------------------------------
     PROVA SOCIAL — so o que voce preencheu em window.KIT
     ------------------------------------------------------------------ */
  (function provaNota() {
    var el = document.getElementById('prova-nota');
    if (!el) return;

    var partes = [];
    if (CFG.avaliacao && CFG.avaliacoes > 0) {
      partes.push('Nota ' + CFG.avaliacao + ' em ' + CFG.avaliacoes + ' avaliacoes');
    }
    if (CFG.kitsVendidos > 0) {
      partes.push(CFG.kitsVendidos + ' kits ja baixados');
    }
    if (!partes.length) return;   // nada preenchido: o elemento fica escondido

    el.className = 'pilula pilula-coracao';
    el.style.marginBottom = '.9rem';
    el.textContent = partes.join(' · ');
    el.hidden = false;
  })();

  /* ------------------------------------------------------------------
     AVISO DE VENDA
     Roda em cima de CFG.vendasRecentes. Lista vazia = nunca aparece.
     O script nao inventa nome, cidade nem horario: mostra o que voce
     colocou na lista. Foi assim de proposito — o codigo antigo sorteava
     nomes com Math.random e isso e o tipo de coisa que, quando o cliente
     percebe, derruba a confianca no resto da pagina.
     ------------------------------------------------------------------ */
  (function avisoVenda() {
    var lista = CFG.vendasRecentes;
    if (!lista || !lista.length) return;

    var caixa = document.createElement('div');
    caixa.className = 'aviso';
    caixa.setAttribute('role', 'status');
    document.body.appendChild(caixa);

    var n = 0;
    function mostra() {
      var v = lista[n % lista.length];
      n++;
      caixa.innerHTML = '<span class="aviso-tique">&#10003;</span><span><b>' +
        String(v.nome || '').replace(/</g, '&lt;') + '</b>' +
        (v.cidade ? ', ' + String(v.cidade).replace(/</g, '&lt;') : '') +
        ' levou o ' + String(v.produto || 'kit').replace(/</g, '&lt;') + '</span>';
      caixa.classList.add('aparece');
      setTimeout(function () { caixa.classList.remove('aparece'); }, 5000);
    }
    setTimeout(function () { mostra(); setInterval(mostra, 22000); }, 6000);
  })();

  /* ------------------------------------------------------------------
     BARRA DE COMPRA NO CELULAR
     Ela existe pra trazer o botao pra perto de quem esta longe dele.
     Logo: aparece quando o botao do hero sai da tela E desaparece quando a
     secao de planos entra. Sem essa segunda condicao a barra ficaria em
     cima dos dois cartoes de preco apontando pra #planos, ou seja: um botao
     que nao faz nada visivel na tela.
     ------------------------------------------------------------------ */
  (function barraFixa() {
    var barra = document.getElementById('barra-fixa');
    var botaoHero = document.getElementById('cta-hero');
    var planos = document.getElementById('planos');
    if (!barra || !botaoHero || !('IntersectionObserver' in window)) return;

    var naTela = {};

    var olho = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        naTela[entradas[i].target.id] = entradas[i].isIntersecting;
      }
      barra.classList.toggle('aparece', !naTela['cta-hero'] && !naTela['planos']);
    }, { threshold: 0 });

    olho.observe(botaoHero);
    if (planos) olho.observe(planos);
  })();

  /* ------------------------------------------------------------------
     UTM ATE O CHECKOUT  <-- este era o bug caro
     O script antigo so mexia em links de hotmart.com, mas todo checkout
     desta pagina e pay.wiapy.com. Ou seja: utm_source, utm_campaign e
     utm_content nao chegavam no checkout, e voce perdia a atribuicao de
     qual anuncio gerou a venda. Agora vale pra qualquer link de pagamento.
     ------------------------------------------------------------------ */
  (function levaUTM() {
    var busca = new URLSearchParams(window.location.search);
    var chaves = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
                  'utm_term', 'utm_id', 'src', 'sck', 'fbclid', 'gclid'];

    var extras = [];
    chaves.forEach(function (k) {
      if (busca.has(k)) extras.push(k + '=' + encodeURIComponent(busca.get(k)));
    });
    if (!extras.length) return;

    var links = document.querySelectorAll(
      'a[href*="pay.wiapy.com"], a[href*="wiapy.com"], a[href*="pay."]'
    );
    Array.prototype.forEach.call(links, function (a) {
      a.href += (a.href.indexOf('?') === -1 ? '?' : '&') + extras.join('&');
    });
  })();

  /* ------------------------------------------------------------------
     ROLAGEM SUAVE PRA ANCORAS INTERNAS
     ------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var alvo = document.querySelector(this.getAttribute('href'));
      if (!alvo) return;
      e.preventDefault();
      alvo.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
    });
  });




})();
