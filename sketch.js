let jogador;
let alimentos = [];
let obstaculos = [];
let pontes = [];
let scrollX = 0;
let estadoJogo = "jogando";
let alimentosColetados = 0;
let pontesConstruidas = 0;

function setup() {
  createCanvas(800, 400);

  jogador = {
    x: 50,
    y: height / 2,
    largura: 40,
    altura: 40,
    velocidade: 4,
    carregando: false,
  };

  for (let i = 0; i < 5; i++) {
    alimentos.push({
      x: random(200, 2000),
      y: random(50, height - 50),
      tipo: floor(random(3)),
      coletado: false,
    });
  }

  for (let i = 0; i < 4; i++) {
    obstaculos.push({
      x: random(300, 2000),
      y: random(80, height - 80),
      raio: 25,
    });
  }
}

function draw() {
  background(180, 220, 255); // céu azul claro

  push();
  translate(-scrollX, 0);

  drawGround();

  // Obstáculos (pedras pretas)
  for (let o of obstaculos) {
    fill(0);
    ellipse(o.x, o.y, o.raio * 2);
  }

  // Alimentos
  for (let a of alimentos) {
    if (!a.coletado) {
      if (a.tipo === 0) fill(255, 0, 0);
      else if (a.tipo === 1) fill(0, 255, 0);
      else fill(210, 180, 140);
      ellipse(a.x, a.y, 20);
    }
  }

  // Jogador (caixa)
  fill(255, 150, 0);
  rect(jogador.x, jogador.y, jogador.largura, jogador.altura);

  pop();

  // Movimentação
  if (keyIsDown(LEFT_ARROW)) jogador.x -= jogador.velocidade;
  if (keyIsDown(RIGHT_ARROW)) jogador.x += jogador.velocidade;
  if (keyIsDown(UP_ARROW)) jogador.y -= jogador.velocidade;
  if (keyIsDown(DOWN_ARROW)) jogador.y += jogador.velocidade;

  jogador.y = constrain(jogador.y, 0, height - jogador.altura);

  scrollX = jogador.x - 100;

  // Coleta de alimentos
  if (!jogador.carregando) {
    for (let a of alimentos) {
      if (!a.coletado && dist(jogador.x + jogador.largura / 2 + scrollX, jogador.y + jogador.altura / 2, a.x, a.y) < 25) {
        a.coletado = true;
        jogador.carregando = true;
        break;
      }
    }
  }

  // Colisão com obstáculos
  for (let o of obstaculos) {
    let dx = jogador.x + jogador.largura / 2 + scrollX - o.x;
    let dy = jogador.y + jogador.altura / 2 - o.y;
    let distancia = sqrt(dx * dx + dy * dy);
    if (distancia < o.raio + jogador.largura / 2) {
      estadoJogo = "perdeu";
    }
  }

  // Entregar alimento
  if (jogador.carregando && jogador.x + scrollX > 2000) {
    jogador.carregando = false;
    alimentosColetados++;

    if (alimentos.every(a => a.coletado)) {
      estadoJogo = "ganhou";
    }
  }

  // Interface
  fill(0);
  textSize(16);
  text(`Alimentos entregues: ${alimentosColetados}`, 20, 30);

  if (estadoJogo === "ganhou") {
    fill(0, 200, 0, 200);
    rect(width / 4, height / 3, width / 2, 100);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Parabéns! Você venceu!", width / 2, height / 2);
    noLoop();
  } else if (estadoJogo === "perdeu") {
    fill(200, 0, 0, 200);
    rect(width / 4, height / 3, width / 2, 100);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Você colidiu com uma pedra!", width / 2, height / 2);
    textSize(16);
    text("Pressione ESPAÇO para tentar novamente", width / 2, height / 2 + 30);
    noLoop();
  }
}

function drawGround() {
  fill(100, 200, 100);
  rect(0, height - 50, 3000, 50); // chão verde
}

function keyPressed() {
  if (key === " " && estadoJogo === "perdeu") {
    location.reload();
  }
}
