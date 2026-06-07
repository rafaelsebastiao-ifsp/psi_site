'use strict';

let reunioesRendered = false;

function initReunioes() {
  if (reunioesData.length > 0) {
    if (!reunioesRendered) { renderReunioes(); reunioesRendered = true; }
    setTimeout(() => initMap(), 100);
  } else {
    // dados ainda carregando, tenta de novo
    setTimeout(initReunioes, 150);
  }
}

function renderReunioes() {
  const container = document.getElementById('lista-reunioes');
  if (!container) return;

  container.innerHTML = reunioesData.map((r, i) => `
    <div class="reuniao-card" role="listitem" data-index="${i}">
      <div class="reuniao-date">
        <div class="day">${r.dia}</div>
        <div class="month">${r.mes}</div>
        <div class="weekday">${r.diasem}</div>
      </div>
      <div class="reuniao-info">
        <h4>${r.nome}</h4>
        <div class="time">${r.horario} &nbsp; ${r.endereco}</div>
        <div class="tipo">${r.tipo}</div>
        <div class="dist-badge">${r.dist}</div>
      </div>
      <div class="reuniao-action">
        <button class="btn-detalhes" data-action="detalhes" data-index="${i}">Detalhes</button>
      </div>
    </div>
  `).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="detalhes"]');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    if (idx >= 0 && idx < reunioesData.length) openReuniaoModal(reunioesData[idx]);
  });
}

function openReuniaoModal(r) {
  const modal = document.getElementById('reuniao-modal');
  if (!modal || !r) return;

  const tipo = r.tipo || '';
  const contato = r.contato || '';
  const tipoClass = tipo.includes('fechada') ? 'tipo-fechada' : 'tipo-aberta';

  document.getElementById('modal-nome').textContent = r.nome || 'Reunião';
  document.getElementById('modal-tipo').textContent = tipo;
  document.getElementById('modal-tipo').className = 'modal-tipo-badge ' + tipoClass;
  document.getElementById('modal-dia').textContent = `${r.diasem || ''}, ${r.dia || ''} ${r.mes || ''}`.trim();
  document.getElementById('modal-horario').textContent = r.horario || '—';
  document.getElementById('modal-endereco').textContent = r.endereco || '—';
  document.getElementById('modal-cidade').textContent = r.cidade || '—';
  document.getElementById('modal-dist').textContent = r.dist || '';
  document.getElementById('modal-descricao').textContent = r.descricao || 'Sem informações adicionais no momento.';

  const contatoEl  = document.getElementById('modal-contato');
  const whatsappEl = document.getElementById('modal-whatsapp');

  if (contato) {
    contatoEl.textContent = contato;
    contatoEl.href = 'tel:' + contato.replace(/[^\d+]/g, '');
    contatoEl.style.display = '';
    whatsappEl.href = 'https://wa.me/55' + contato.replace(/\D/g, '');
    whatsappEl.style.display = '';
  } else {
    contatoEl.style.display = 'none';
    whatsappEl.style.display = 'none';
  }

  const distBar = document.querySelector('.modal-dist-bar');
  if (distBar) distBar.style.display = r.dist ? '' : 'none';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeReuniaoModal() {
  const modal = document.getElementById('reuniao-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.closest('.modal-close')) closeReuniaoModal();
  if (e.target.id === 'reuniao-modal') closeReuniaoModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeReuniaoModal();
});

document.querySelector('.reunioes-tabs')?.addEventListener('click', (e) => {
  const tab = e.target.closest('.reunioes-tab');
  if (!tab) return;
  const tabName = tab.dataset.tab;
  document.querySelectorAll('.reunioes-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  document.getElementById('presenciais').hidden = tabName !== 'presenciais';
  document.getElementById('online').hidden = tabName !== 'online';
});

document.querySelector('.filter-btns')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});
