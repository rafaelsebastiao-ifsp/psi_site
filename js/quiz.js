'use strict';

let respostas = [];
let perguntaAtual = 0;

function getResultadoTexto(sim) {
  if (sim >= 7) {
    return `Você respondeu SIM a ${sim} perguntas. A maioria dos jogadores compulsivos respondeu SIM a pelo menos 7 dessas perguntas.`;
  }
  if (sim >= 4) {
    return `Você respondeu SIM a ${sim} perguntas. A maioria dos jogadores compulsivos respondeu SIM a pelo menos 7 dessas perguntas.`;
  }
  return `Você respondeu SIM a apenas ${sim} pergunta(s). A maioria dos jogadores compulsivos respondeu SIM a pelo menos 7 dessas perguntas.`;
}

function getResultadoEmoji(sim) {
  if (sim >= 7) return '🔴';
  if (sim >= 4) return '🟡';
  return '🟢';
}

function startAutoaval() {
  respostas = [];
  perguntaAtual = 0;
  const quiz = document.getElementById('autoaval-quiz');
  quiz.style.display = 'flex';
  renderQuiz();
}

function handleQuizClick(e) {
  const btn = e.target.closest('[data-resposta]');
  if (!btn) return;
  respostas.push(btn.dataset.resposta);
  perguntaAtual++;
  renderQuiz();
}

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  if (perguntaAtual >= quizPerguntas.length) {
    const sim = respostas.filter(r => r === 'sim').length;

    container.innerHTML = `
      <div style="text-align:center;">
        <h2 style="font-size:1.8rem;font-weight:800;margin-bottom:16px;">Resultado</h2>
        <div style="font-size:3rem;margin-bottom:16px;">${getResultadoEmoji(sim)}</div>
        <p style="font-size:1.1rem;line-height:1.75;color:#475569;margin-bottom:24px;">
          ${getResultadoTexto(sim)}
        </p>
        <div style="display:flex;gap:16px;justify-content:center;margin-top:8px;flex-wrap:wrap;">
          <a class="btn btn-red"    href="#" data-page="quem-somos" style="padding:16px 40px;white-space:nowrap;">Primeiro passo</a>
          <a class="btn btn-yellow" href="#" data-page="reunioes"   style="padding:16px 40px;white-space:nowrap;">Encontrar um grupo</a>
        </div>
      </div>
    `;
    return;
  }

  const progresso = Math.round((perguntaAtual / quizPerguntas.length) * 100);

  container.innerHTML = `
    <div style="margin-bottom:8px;font-size:0.85rem;color:#64748b;font-weight:600;">
      Pergunta ${perguntaAtual + 1} de ${quizPerguntas.length}
    </div>
    <div style="height:6px;background:#e2e8f0;border-radius:3px;margin-bottom:32px;">
      <div style="height:6px;background:#742C24;border-radius:3px;width:${progresso}%;transition:width 0.4s;"></div>
    </div>
    <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:32px;line-height:1.5;">
      ${quizPerguntas[perguntaAtual]}
    </h3>
    <div style="display:flex;gap:16px;">
      <button data-resposta="sim" class="btn btn-yellow" style="flex:1;font-size:1.1rem;padding:16px;color:#ffffff;">SIM</button>
      <button data-resposta="nao" class="btn btn-red"    style="flex:1;font-size:1.1rem;padding:16px;color:#ffffff;">NÃO</button>
    </div>
  `;

  container.addEventListener('click', handleQuizClick, { once: true });
}

document.getElementById('start-autoaval-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  startAutoaval();
});