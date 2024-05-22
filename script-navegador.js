
//COLE ESSE CODIGO NO CONSOLE DA PAGINA
const start = async() => {
    const questoes = await document.querySelectorAll('.ql-editor');
    const alternativas = await document.querySelectorAll('.css-odg2wy');
    
    let questao1;
    let questao2;
    
    // Exibir questões e alternativas no console
    for (let i = 0; i < questoes.length; i++) {
      const numeroQuestao = i + 1;
      const textoDaQuestao = questoes[i].innerText;
      const alternativasTexto = [];
      alternativas[i].querySelectorAll('textarea').forEach((alternativa) => {
        alternativasTexto.push(alternativa.value);
      });

      const imagensDaQuestao = questoes[i].querySelectorAll('img');
      const imagensLinks = [];
      
      imagensDaQuestao.forEach((imagem) => {
        imagensLinks.push(imagem.src);
      });


    console.log(numeroQuestao)
    console.log(textoDaQuestao)
    const questaoAtual = `Questão ${numeroQuestao}\n${textoDaQuestao}\n${imagensLinks.join('\n')}\n${alternativasTexto.join('\n')}\n`;
    console.log(questaoAtual)
      if (i == 0) {
        console.log(1)
        questao1 = questaoAtual;
      } else if (i == 1) {
        console.log(2)
        questao2 = questaoAtual;
      }
    
    
    }
    
    console.log(questao1)
    console.log(questao2)
    
   window.open(`https://higor-cmsp-api-93266b3970dc.herokuapp.com/multipla?questao1=${questao1}&questao2=${questao2}`, '_blank');
}


const criarBotao = () => {
    const botao = document.createElement('button');
    botao.textContent = 'Ver Respostas';
    botao.className = 'botao-ver-respostas';
    const estiloBotao = `
    display: inline-block;
    padding: 15px 25px; /* Aumente o padding para mais espaço */
    font-size: 18px; /* Aumente o tamanho da fonte */
    font-weight: bold;
    background-color: #4CAF50; /* Verde */
    color: white;
    border: none;
    border-radius: 10px; /* Arredondamento mais suave */
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); /* Sombra 3D */
    transition: background-color 0.3s ease; /* Efeito hover suave */
    cursor: pointer;
    position: fixed;
    top: 20px; /* Ajuste a posição conforme necessário */
    right: 20px; /* Ajuste a posição conforme necessário */
    z-index: 9999;
    `;
    botao.style.cssText = estiloBotao;
    return botao;
  };
  
  const botaoVerRespostas = criarBotao();
  document.body.appendChild(botaoVerRespostas);
  botaoVerRespostas.addEventListener('click', start);
