'use strict';

// Dados carregados via API Django — editáveis em /admin
let reunioesData = [];
let videosData = [];

const quizPerguntas = [
  'Você já percebeu que ficou jogando por mais tempo do que tinha planejado?',
  'Quando está estressado, ansioso ou chateado, o jogo já apareceu como uma forma de aliviar o que está sentindo?',
  'Você costuma pensar em jogar ou planejar apostas enquanto realiza outras atividades do dia a dia, como trabalhar, estudar ou conversar com outras pessoas?',
  'Você frequentemente pensa "só mais uma rodada" ou "só mais uma aposta" e acaba jogando por mais tempo do que pretendia?',
  'Com o tempo, você percebeu que precisava apostar valores maiores para sentir a mesma emoção de antes?',
  'Depois de perder, você já voltou a jogar com a intenção de recuperar o que perdeu?',
  'Já houve momentos em que você tentou reduzir ou parar de jogar, mas não conseguiu?',
  'Você já ficou irritado, inquieto ou ansioso quando não conseguia jogar ou quando tentava parar?',
  'O jogo já trouxe algum problema financeiro para você, mesmo que pequeno, como apertar o orçamento ou atrasar uma conta?',
  'Alguém próximo — familiar, amigo ou parceiro(a) — já demonstrou preocupação com a frequência ou intensidade com que você joga?',
  'O jogo já ocupou um espaço que antes era dedicado a outras atividades importantes para você, como hobbies, amigos ou família?',
  'Você já escondeu ou evitou contar para alguém quanto tempo ou dinheiro gastou com jogos de azar?',
  'O jogo já gerou conflitos em algum relacionamento importante para você?',
  'Você já deixou de cumprir compromissos importantes, como trabalho, estudos ou responsabilidades familiares, por causa do jogo?',
  'Você já precisou pedir dinheiro emprestado ou buscar ajuda financeira para cobrir perdas causadas pelo jogo?',
];

// Carrega reuniões e vídeos da API ao iniciar
async function carregarDados() {
  try {
    const [rRes, vRes] = await Promise.all([
      fetch('/api/reunioes/'),
      fetch('/api/videos/')
    ]);
    reunioesData = await rRes.json();
    videosData   = await vRes.json();
  } catch (e) {
    console.error('Erro ao carregar dados da API:', e);
  }
}

carregarDados();
