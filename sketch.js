let jogador;
let obstaculos = [];
let scrollX = 0;
let estadoJogo = "jogando";
let carregando = false;
let entregas = 0;
let coleta = { x: 100, y: 300, raio: 25 };
let entrega = { x: 2000, y: 300, raio: 25 };

function setup() {
  createCanvas(800, 400);
  jogador = {
    x: 100,
    y: height / 2,
    raio: 20,
    velocidade: 3,
  };

  for (let i = 0; i < 12; i++) {
    obstaculos.push({
      x: random(400, 2200),
      y: random(60, height - 60),
      raio: 20,
    });
  }
}

function draw() {
  // Fundo: muda conforme posição
  if (-scrollX < 1200) {
    background(200, 240, 200); // campo
  } else {
    background(180); // cidade/asfalto
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
  if (keyIsDown(UP_ARROW)) jogador.y -= jogador.velocidade;
  if (keyIsDown(DOWN_ARROW)) jogador.y += jogador.velocidade;

  jogador.y = constrain(jogador.y, 0, height - jogador.raio * 2);
}

function drawJogador() {
  fill(carregando ? 'orange' : 'blue');
  ellipse(jogador.x, jogador.y, jogador.raio * 2);
}

function drawObstaculos() {
  fill(50);
  for (let o of obstaculos) {
    ellipse(o.x + scrollX, o.y, o.raio * 2);
  }
}

function drawChao() {
  fill(-scrollX < 1200 ? '#a0522d' : '#404040'); // estrada de terra ou asfalto
  rect(0, height - 50, width, 50);
}

function drawPontos() {
  // Ponto de coleta
  fill('green');
  ellipse(coleta.x + scrollX, coleta.y, coleta.raio * 2);
  textAlign(CENTER);
  fill(0);
  text("Coleta", coleta.x + scrollX, coleta.y - 20);

  // Ponto de entrega
  fill('red');
  ellipse(entrega.x + scrollX, entrega.y, entrega.raio * 2);
  fill(0);
  text("Entrega", entrega.x + scrollX, entrega.y - 20);
}

function verificarColetaEntrega() {
  let cx = jogador.x;
  let cy = jogador.y;

  if (!carregando && colisaoCirculoCirculo(cx, cy, jogador.raio, coleta.x + scrollX, coleta.y, coleta.raio)) {
    carregando = true;
  }

  if (carregando && colisaoCirculoCirculo(cx, cy, jogador.raio, entrega.x + scrollX, entrega.y, entrega.raio)) {
    carregando = false;
    entregas++;
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
  if (estadoJogo === "perdeu") {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("Você bateu em uma pedra!", width / 2, height / 2);
    textSize(16);
    text("Pressione ESPAÇO para reiniciar", width / 2, height / 2 + 40);
  }
}

function keyPressed() {
  if (key === " " && estadoJogo === "perdeu") {
    location.reload();
  }
}
