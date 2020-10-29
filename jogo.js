console.log("Desenvolvido por Leonardo Klaus!") //desenvolvedor

const sprites = new Image();
sprites.src="sprites.png";

const img_pontos = new Image();
img_pontos.src="recorde.png";

var frames = 0;
var frames_canos = 0;
var pontos = 0;
var recorde = 0;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const som_hit = new Audio;
som_hit.src="audio/hit.wav";

//Botao
//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//The rectangle should have x,y,width,height properties
var rect = {
    x:23,
    y:403,
    width:116,
    height:43
};



//Plano de Fundo
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0,0, canvas.width, canvas.height);

        ctx.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        ctx.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
};

//Chao
function criaChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        desenha() {
            ctx.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
    
            ctx.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
        atualiza(){
            const mov_chao = 2;
            chao.x -= mov_chao;
            if(chao.x == -(chao.largura / 2)){
                chao.x=0;
            }
        },
    };
    return chao;
};



//Tela Inicio
const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - (174/2),
    y: 50,
    desenha() {
        ctx.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    },
};

//Tela Pontos
const pontuacao_final = {
    spriteX: 0,
    spriteY: 0,
    largura: 273,
    altura: 422,
    x: 23.5,
    y: 20,
    desenha() {
        ctx.drawImage(
            img_pontos,
            pontuacao_final.spriteX, pontuacao_final.spriteY,
            pontuacao_final.largura, pontuacao_final.altura,
            pontuacao_final.x, pontuacao_final.y,
            pontuacao_final.largura, pontuacao_final.altura,
        );

        ctx.font = "40px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(pontos, 160, 100);

        ctx.font = "40px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(recorde, 160, 220);

    },
};

function fazColisao(){
    if(globais.flappyBird.y >= 340){
        return true;
    }else{
        return false;
    }
};

//flappy

function criaFlappyBird(){
    const flappyBird = {
        largura: 33,
        altura: 24,
        x: 10,
        y: 57,
        velocidade : 0,
        gravidade : 0.25,
        pula: 4.6,
        movimentos: [
            { spriteX: 0, spriteY: 0, }, //asa pra cima
            { spriteX: 0, spriteY: 26, }, //asa no meio
            { spriteX: 0, spriteY: 52, }, //asa pra baixo
            { spriteX: 0, spriteY: 26, }, //asa no meio
        ],
        frameAtual: 0,
        atualizarFrameAtual(){
            if(frames % 7 == 0){
                const base_incremento = 1;
                if (this.frameAtual >= 3){
                    this.frameAtual = 0;
                }else{
                    flappyBird.frameAtual+=base_incremento;
                }
            }
        },
        desenha(){
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            flappyBird.atualizarFrameAtual();
            ctx.drawImage(
                sprites,
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,  
            )
            
        },
        atualiza(){
            if(fazColisao()){
                som_hit.play();
                setTimeout(() => {
                    mudaDeTela(Tela.pontos);
                  }, 500);
                return;
            }else{
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
            }
        },
        ctr_grav : 0.25,
        atualiza_inicio(){
            
            //flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            
            if (flappyBird.y >= 70){
                flappyBird.ctr_grav = -0.25;
                
            }else if(flappyBird.y <= 40){
                flappyBird.ctr_grav = 0.35;
                //flappyBird.velocidade = 0.3;
            }else if(54.9 <= flappyBird.y <= 55){
                flappyBird.velocidade = 0;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.ctr_grav;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
                //flappyBird.velocidade = -8;
            //else{
                //flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
                //flappyBird.y = flappyBird.y + flappyBird.velocidade;

        },
        pular(){
            //console.log("antes " + flappyBird.velocidade);
            flappyBird.velocidade = -flappyBird.pula;
            //console.log("depois " + flappyBird.velocidade);
        }
    }
    return flappyBird;
};

//Canos

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

function criarCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        //intervalo_canos : getRandomArbitrary(100, 150),
        //yceu: getRandomArbitrary(-200, -360),

        desenha(){
            canos.pares.forEach(function(par) {
                const canoCeuX = par.x;
                const canoCeuY = par.y;
                const canoChaoX = par.x;
                const canoChaoY = ((canos.altura) + canoCeuY) + par.esp;

            
                //Cano do Ceu
                ctx.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                );

                //Cano do Chao
                ctx.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )
                })   
        },
        pares : [],
        atualiza(){
            var intervalo_canos = 100;
            if((frames_canos % (intervalo_canos) === 0) && frames_canos >= 100){
                console.log("Plota Cano" + frames_canos);
                canos.pares.push({
                    x: canvas.width,
                    y: getRandomArbitrary(-200, -360),
                    esp: getRandomArbitrary(70, 100)
                  });
            }

            canos.pares.forEach(function(par){
                par.x = par.x - 2;
                //console.log(par.x, par.y);
                //console.log(canos.altura + par.y);
                if(((canos.altura + par.y) >= (globais.flappyBird.y)) && ((par.x)  <= (globais.flappyBird.x  + globais.flappyBird.largura)) && ((par.x + canos.largura) >= globais.flappyBird.x)){
                    mudaDeTela(Tela.pontos);
                }
                if((((canos.altura + par.y) + par.esp) <= (globais.flappyBird.y + globais.flappyBird.altura)) && (globais.flappyBird.y <= canvas.height) && ((par.x)  <= (globais.flappyBird.x  + globais.flappyBird.largura)) && ((par.x + canos.largura) >= globais.flappyBird.x)){
                    mudaDeTela(Tela.pontos);
                }
                //if((par.x == globais.flappyBird.x) && (par.y <= globais.flappyBird.y <= (par.y + canos.altura))){
                    //mudaDeTela(Tela.inicio);
                //}
        
                if(par.x + canos.largura <= 0) {
                  canos.pares.shift();
                  pontos++;
                  
                  if(pontos > recorde){
                      recorde = pontos;
                  };
                }
            })
        },
    }
    return canos;
};

const globais = {};
let telaAtiva = {};
function mudaDeTela(novaTela){
    //console.log("antes" + frames);
    telaAtiva = novaTela;
    //console.log("depois" + frames);

    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
};

const Tela = {
    inicio: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criarCanos();
            pontos = 0;
        },
        desenha(){
            planoDeFundo.desenha(); 
            globais.chao.desenha();
            mensagemGetReady.desenha();
            globais.flappyBird.desenha();
            
        },
        atualiza(){
            globais.chao.atualiza();
            globais.flappyBird.atualiza_inicio();
        },
        click(){
            mudaDeTela(Tela.jogo);
        },
    },
    jogo: {
        desenha(){
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
        },
        atualiza(){
            globais.flappyBird.atualiza();
            globais.chao.atualiza();
            globais.canos.atualiza();

        },
        click(){
            globais.flappyBird.pular();
        },
    },
    pontos: {
        desenha(){
            planoDeFundo.desenha(); 
            globais.chao.desenha();
            pontuacao_final.desenha();
            
        },
        atualiza(){
            globais.chao.atualiza();
        },
        click(){
            //mudaDeTela(Tela.inicio);
        },
    },
};

function loop(){
    
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames +=1;
    if(telaAtiva == Tela.jogo){
        frames_canos +=1;
    }
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});

//Verifica area do clique

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
    
        if (isInside(mousePos,rect) && (telaAtiva == Tela.pontos)) {
            mudaDeTela(Tela.inicio);
        }   
    }, false);


mudaDeTela(Tela.inicio);
loop();

