let jogador;
let obstaculos = [];
let scrollX = 0;
let estadoJogo = "jogando";
let alimentosNoCaminhao = 0;
let maxAlimentos = 10;
let entregas = 0;

let coleta = { x: 100, y: 300, raio: 25 };
let entrega = { x: 2000, y: 300, raio: 25 };

function setup() {
  createCanvas(800, 400);
  jogador = {
    x: 100,
    y: height / 2,
    raio: 20,
    velocidadeBase: 3,
    velocidade: 3,
  };

  for (let i = 0; i < 12; i++) {
    obstaculos.push({
      x: random(400, 2200),
      y: random(60, height - 60),
      raio: 30,
    });
  }
}

function draw() {
  // Fundo: campo ou cidade
  if (-scrollX < 1200) {
    background(200, 240, 200); // campo
  } else {
    background(180); // cidade
  }

  drawChao();
  moverJogador();

  scrollX -= jogador.velocidade;

  drawObstaculos();
  drawJogador();
  drawPontos();
  verificarColisoes();
  verificarColetaEntrega();
  mostrarInfo();
}

function moverJogador() {
  // movimentação vertical
  if (keyIsDown(UP_ARROW)) jogador.y -= jogador.velocidade;
  if (keyIsDown(DOWN_ARROW)) jogador.y += jogador.velocidade;
  jogador.y = constrain(jogador.y, 0, height - jogador.raio * 2);

  // Aceleração com SHIFT
  if (keyIsDown(SHIFT)) {
    jogador.velocidade = jogador.velocidadeBase * 2;
  } else {
    jogador.velocidade = jogador.velocidadeBase;
  }

  // Movimento horizontal controlado
  if (keyIsDown(RIGHT_ARROW)) {
    scrollX -= jogador.velocidade; // anda para frente
  }
  if (keyIsDown(LEFT_ARROW)) {
    scrollX += jogador.velocidade.*-1; // ré
  }
}

function drawJogador() {
  fill(alimentosNoCaminhao > 0 ? 'orange' : 'blue');
  ellipse(jogador.x, jogador.y, jogador.raio * 2);

  // Mostrar contador de alimentos
  fill(255);
  textSize(12);
  textAlign(CENTER);
  text(alimentosNoCaminhao, jogador.x, jogador.y + 4);
}

function drawObstaculos() {
  fill(50);
  for (let o of obstaculos) {
    ellipse(o.x + scrollX, o.y, o.raio * 2);
  }
}

function drawChao() {
  fill(-scrollX < 1200 ? '#a0522d' : '#404040');
  rect(0, height - 50, width, 50);
}

function drawPontos() {
  fill('green');
  ellipse(coleta.x + scrollX, coleta.y, coleta.raio * 2);
  fill(0);
  textAlign(CENTER);
  text("Coleta", coleta.x + scrollX, coleta.y - 20);

  fill('red');
  ellipse(entrega.x + scrollX, entrega.y, entrega.raio * 2);
  fill(0);
  text("Entrega", entrega.x + scrollX, entrega.y - 20);
}

function verificarColetaEntrega() {
  let cx = jogador.x;
  let cy = jogador.y;

  // Coletar
  if (
    alimentosNoCaminhao < maxAlimentos &&
    colisaoCirculoCirculo(cx, cy, jogador.raio, coleta.x + scrollX, coleta.y, coleta.raio)
  ) {
    alimentosNoCaminhao++;
  }

  // Entregar
  if (
    alimentosNoCaminhao > 0 &&
    colisaoCirculoCirculo(cx, cy, jogador.raio, entrega.x + scrollX, entrega.y, entrega.raio)
  ) {
    entregas += alimentosNoCaminhao;
    alimentosNoCaminhao = 0;
  }
}

function verificarColisoes() {
  for (let o of obstaculos) {
    let ox = o.x + scrollX;
    let oy = o.y;
    if (colisaoCirculoCirculo(jogador.x, jogador.y, jogador.raio, ox, oy, o.raio)) {
      estadoJogo = "perdeu";
      noLoop();
    }
  }
}

// Verifica se o jogador chegou à cidade para entregar
if (jogador.x + scrollX > cidadeX) {
  if (jogador.carga > 0) {
    alimentosEntregues += jogador.carga;
    jogador.carga = 0;

    if (alimentosEntregues >= totalAlimentos) {
      estadoJogo = "ganhou";
    }
  } else {
    estadoJogo = "perdeu";
  }
}

function colisaoCirculoCirculo(x1, y1, r1, x2, y2, r2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let distancia = sqrt(dx * dx + dy * dy);
  return distancia < r1 + r2;
}

function mostrarInfo() {
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text(`Entregas: ${entregas}`, 20, 30);
  text(`Caminhão: ${alimentosNoCaminhao}/${maxAlimentos}`, 20, 50);

  if (estadoJogo === "perdeu") {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("Você bateu em uma pedra!", width / 2, height / 2);
    textSize(16);
    text("Pressione ESPAÇO para reiniciar", width / 2, height / 2 + 40);
  }
}

if (estadoJogo === "ganhou") {
  fill(0, 200, 0, 220);
  rect(width / 4, height / 3, width / 2, 100, 10);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Você entregou todos os alimentos!", width / 2, height / 2);
  noLoop();
} else if (estadoJogo === "perdeu") {
  fill(200, 0, 0, 220);
  rect(width / 4, height / 3, width / 2, 100, 10);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Você chegou sem alimentos!", width / 2, height / 2);
  noLoop();
}

function keyPressed() {
  if (key === " " && estadoJogo === "perdeu") {
    location.reload();
  }
}
