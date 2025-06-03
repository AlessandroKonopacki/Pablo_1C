let jogador;
let alimentos = [];
let obstaculos = [];
let pontes = [];
let cidadeImg, campoImg, ponteImg, caminhaoImg;
let pontesConstruidas = 0;
let alimentosColetados = 0;
let estadoJogo = "jogando"; // "jogando", "ganhou", "perdeu"

function preload() {
  cidadeImg = loadImage(
    'img/cidade.png');
  campoImg = loadImage(
    'img/campo.png');
  ponteImg = loadImage(
   'img/ponte.png');
  caminhaoImg = loadImage(
    'img/caminhao.png');
}

function setup() {
  createCanvas(800, 400);

  jogador = {
    x: 50,
    y: height / 2,
    largura: 60,
    altura: 30,
    velocidade: 3,
    carregando: false,
  };

  for (let i = 0; i < 5; i++) {
    alimentos.push({
      x: random(50, 300),
      y: random(50, height - 50),
      tipo: floor(random(3)), // 0=fruta, 1=verdura, 2=grão
      coletado: false,
    });
  }

  for (let i = 0; i < 3; i++) {
    obstaculos.push({
      x: random(350, 450),
      y: random(100, height - 100),
      largura: 80,
      altura: 20,
    });
  }
}

function draw() {
  background(220);

  image(campoImg, 0, 0, width / 2, height);
  image(cidadeImg, width / 2, 0, width / 2, height);

  fill(100, 100, 255);
  rect(width / 2 - 50, 0, 100, height);

  for (let ponte of pontes) {
    image(ponteImg, ponte.x, ponte.y, ponte.largura, ponte.altura);
  }

  for (let alimento of alimentos) {
    if (!alimento.coletado) {
      if (alimento.tipo === 0) {
        fill(255, 0, 0);
        ellipse(alimento.x, alimento.y, 20, 20);
      } else if (alimento.tipo === 1) {
        fill(0, 255, 0);
        rect(alimento.x - 10, alimento.y - 10, 20, 20);
      } else {
        fill(210, 180, 140);
        ellipse(alimento.x, alimento.y, 15, 15);
      }
    }
  }

  for (let obstaculo of obstaculos) {
    fill(150);
    rect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
  }

  image(caminhaoImg, jogador.x, jogador.y, jogador.largura, jogador.altura);

  if (keyIsDown(LEFT_ARROW)) jogador.x -= jogador.velocidade;
  if (keyIsDown(RIGHT_ARROW)) jogador.x += jogador.velocidade;
  if (keyIsDown(UP_ARROW)) jogador.y -= jogador.velocidade;
  if (keyIsDown(DOWN_ARROW)) jogador.y += jogador.velocidade;

  jogador.x = constrain(jogador.x, 0, width - jogador.largura);
  jogador.y = constrain(jogador.y, 0, height - jogador.altura);

  if (!jogador.carregando) {
    for (let alimento of alimentos) {
      if (
        !alimento.coletado &&
        dist(
          jogador.x + jogador.largura / 2,
          jogador.y + jogador.altura / 2,
          alimento.x,
          alimento.y
        ) < 30
      ) {
        alimento.coletado = true;
        jogador.carregando = true;
        break;
      }
    }
  }

  let colidiu = false;
  for (let obstaculo of obstaculos) {
    if (colisaoRetRet(jogador, obstaculo)) {
      let temPonte = false;
      for (let ponte of pontes) {
        if (colisaoRetRet(ponte, obstaculo)) {
          temPonte = true;
          break;
        }
      }
      if (!temPonte) {
        colidiu = true;
        break;
      }
    }
  }

  if (colidiu) {
    estadoJogo = "perdeu";
  }

  if (jogador.carregando && jogador.x > width - 100) {
    jogador.carregando = false;
    alimentosColetados++;

    if (alimentosColetados % 2 === 0 && pontes.length < obstaculos.length) {
      let obstaculoLivre = obstaculos.find((o) => {
        return !pontes.some((p) => colisaoRetRet(p, o));
      });

      if (obstaculoLivre) {
        pontes.push({
          x: obstaculoLivre.x - 10,
          y: obstaculoLivre.y - 5,
          largura: obstaculoLivre.largura + 20,
          altura: obstaculoLivre.altura + 10,
        });
        pontesConstruidas++;
      }
    }

    if (
      alimentos.every((a) => a.coletado) &&
      pontes.length === obstaculos.length
    ) {
      estadoJogo = "ganhou";
    }
  }

  fill(0);
  textSize(16);
  text(`Alimentos entregues: ${alimentosColetados}`, 20, 30);
  text(`Pontes construídas: ${pontesConstruidas}/${obstaculos.length}`, 20, 50);

  if (estadoJogo === "ganhou") {
    fill(0, 200, 0, 200);
    rect(width / 4, height / 3, width / 2, 100);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Parabéns! Você fortaleceu a conexão!", width / 2, height / 2);
    textSize(16);
    text("Campo e cidade estão mais unidos agora!", width / 2, height / 2 + 30);
    noLoop();
  } else if (estadoJogo === "perdeu") {
    fill(200, 0, 0, 200);
    rect(width / 4, height / 3, width / 2, 100);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Ops! O caminhão caiu no rio!", width / 2, height / 2);
    textSize(16);
    text("Pressione ESPAÇO para tentar novamente", width / 2, height / 2 + 30);
    noLoop();
  }
}

function colisaoRetRet(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.largura &&
    obj1.x + obj1.largura > obj2.x &&
    obj1.y < obj2.y + obj2.altura &&
    obj1.y + obj1.altura > obj2.y
  );
}

function keyPressed() {
  if (key === " " && estadoJogo === "perdeu") {
    location.reload();
  }
}
