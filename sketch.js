let jogador;
let obstaculos = [];
let scrollX = 0;
let estadoJogo = "jogando"; // "jogando", "perdeu"

function setup() {
  createCanvas(800, 400);

  jogador = {
    x: 100,
    y: height / 2,
    raio: 20,
    velocidade: 3,
  };

  // Gera obstáculos aleatórios no "mundo"
  for (let i = 0; i < 10; i++) {
    obstaculos.push({
      x: random(400, 2000),
      y: random(50, height - 50),
      raio: 20,
    });
  }
}

function draw() {
  background(180, 220, 255); // céu
  drawChao();

  if (estadoJogo === "jogando") {
    moverJogador();
    scrollX -= jogador.velocidade;

    drawObstaculos();
    drawJogador();
    verificarColisoes();

    fill(0);
    textSize(16);
    text(`Distância percorrida: ${-scrollX}px`, 20, 30);
  } else if (estadoJogo === "perdeu") {
    fill(200, 0, 0, 200);
    rect(width / 4, height / 3, width / 2, 100);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Caminhão colidiu com uma pedra!", width / 2, height / 2);
    textSize(16);
    text("Pressione ESPAÇO para recomeçar", width / 2, height / 2 + 30);
    noLoop();
  }
}

function moverJogador() {
  if (keyIsDown(UP_ARROW)) jogador.y -= jogador.velocidade;
  if (keyIsDown(DOWN_ARROW)) jogador.y += jogador.velocidade;

  jogador.y = constrain(jogador.y, 0, height - jogador.raio * 2);
}

function drawJogador() {
  fill(0, 100, 255);
  ellipse(jogador.x, jogador.y, jogador.raio * 2);
}

function drawObstaculos() {
  fill(50);
  for (let o of obstaculos) {
    ellipse(o.x + scrollX, o.y, o.raio * 2);
  }
}

function drawChao() {
  fill(100, 200, 100);
  rect(0, height - 50, width, 50);
}

function verificarColisoes() {
  for (let o of obstaculos) {
    let cx = jogador.x;
    let cy = jogador.y;
    let ox = o.x + scrollX;
    let oy = o.y;

    if (colisaoCirculoCirculo(cx, cy, jogador.raio, ox, oy, o.raio)) {
      estadoJogo = "perdeu";
    }
  }
}

function colisaoCirculoCirculo(x1, y1, r1, x2, y2, r2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let distancia = sqrt(dx * dx + dy * dy);
  return distancia < r1 + r2;
}

function keyPressed() {
  if (key === " " && estadoJogo === "perdeu") {
    location.reload();
  }
}
