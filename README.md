# CMSP BYPAS

## Contexto

O projeto **CMSP BYPAS** consiste em dois scripts principais: `index.js` e `script-navegador.js`. 

- O `index.js` é o back-end do projeto, que utiliza o Express e a API da Google para inteligência artificial para responder questões educacionais. Este script deve ser hospedado em uma plataforma como Heroku para que funcione como uma API.

- O `script-navegador.js` é um script que deve ser executado no console do navegador ao acessar o site CMSP. Ele coleta questões e alternativas diretamente da página e as envia para a API hospedada, exibindo as respostas obtidas.

## Como Hospedar no Heroku

### Passo a Passo

1. **Clone o Repositório**
   ```bash
   git clone https://github.com/seu-usuario/CMSP-BYPAS.git
   cd CMSP-BYPAS
Crie um Novo Projeto no Heroku

Acesse Heroku e faça login.
Crie um novo aplicativo clicando em "New" > "Create new app".
Faça o Deploy do Código

Na seção "Deploy" do seu aplicativo no Heroku, conecte seu repositório GitHub.
Selecione o repositório CMSP-BYPAS.
Clique em "Deploy Branch".
Configure as Variáveis de Ambiente

No painel do Heroku, vá para "Settings" > "Config Vars".
Adicione a variável API_KEY com sua chave de API do Google.
Inicie o Aplicativo

Após o deploy, o Heroku irá iniciar automaticamente o seu aplicativo.
Verifique a URL fornecida pelo Heroku, por exemplo: https://seu-app.herokuapp.com.
Como Utilizar o Script do Navegador
Passo a Passo
Hospede o index.js no Heroku

Certifique-se de que o back-end esteja funcionando e a API esteja acessível.
Acesse o site CMSP

Abra o site CMSP e navegue até a tarefa desejada.
Execute o Script no Console do Navegador

Abra as ferramentas de desenvolvedor (pressione F12 ou Ctrl+Shift+I).
Vá para a aba "Console".
Cole e execute o seguinte código:
javascript
Copiar código
const start = async() => {
    const questoes = await document.querySelectorAll('.ql-editor');
    const alternativas = await document.querySelectorAll('.css-odg2wy');
    
    let questao1;
    let questao2;
    
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

      const questaoAtual = `Questão ${numeroQuestao}\n${textoDaQuestao}\n${imagensLinks.join('\n')}\n${alternativasTexto.join('\n')}\n`;
      if (i == 0) {
        questao1 = questaoAtual;
      } else if (i == 1) {
        questao2 = questaoAtual;
      }
    }
    
    window.open(`https://seu-app




me envie tudo junto na formatação de readme.md, vc esta enviando separado
ChatGPT
markdown
Copiar código
# CMSP BYPAS

## Contexto

O projeto **CMSP BYPAS** consiste em dois scripts principais: `index.js` e `script-navegador.js`. 

- O `index.js` é o back-end do projeto, que utiliza o Express e a API da Google para inteligência artificial para responder questões educacionais. Este script deve ser hospedado em uma plataforma como Heroku para que funcione como uma API.

- O `script-navegador.js` é um script que deve ser executado no console do navegador ao acessar o site CMSP. Ele coleta questões e alternativas diretamente da página e as envia para a API hospedada, exibindo as respostas obtidas.

## Como Hospedar no Heroku

### Passo a Passo

1. **Clone o Repositório**
   ```bash
   git clone https://github.com/seu-usuario/CMSP-BYPAS.git
   cd CMSP-BYPAS
Crie um Novo Projeto no Heroku

Acesse Heroku e faça login.
Crie um novo aplicativo clicando em "New" > "Create new app".
Faça o Deploy do Código

Na seção "Deploy" do seu aplicativo no Heroku, conecte seu repositório GitHub.
Selecione o repositório CMSP-BYPAS.
Clique em "Deploy Branch".
Configure as Variáveis de Ambiente

No painel do Heroku, vá para "Settings" > "Config Vars".
Adicione a variável API_KEY com sua chave de API do Google.
Inicie o Aplicativo

Após o deploy, o Heroku irá iniciar automaticamente o seu aplicativo.
Verifique a URL fornecida pelo Heroku, por exemplo: https://seu-app.herokuapp.com.
Como Utilizar o Script do Navegador
Passo a Passo
Hospede o index.js no Heroku

Certifique-se de que o back-end esteja funcionando e a API esteja acessível.
Acesse o site CMSP

Abra o site CMSP e navegue até a tarefa desejada.
Execute o Script no Console do Navegador

Abra as ferramentas de desenvolvedor (pressione F12 ou Ctrl+Shift+I).

Vá para a aba "Console".

Cole e execute o seguinte código:

javascript
Copiar código
const start = async() => {
    const questoes = await document.querySelectorAll('.ql-editor');
    const alternativas = await document.querySelectorAll('.css-odg2wy');
    
    let questao1;
    let questao2;
    
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

      const questaoAtual = `Questão ${numeroQuestao}\n${textoDaQuestao}\n${imagensLinks.join('\n')}\n${alternativasTexto.join('\n')}\n`;
      if (i == 0) {
        questao1 = questaoAtual;
      } else if (i == 1) {
        questao2 = questaoAtual;
      }
    }
    
    window.open(`https://seu-app.herokuapp.com/multipla?questao1=${questao1}&questao2=${questao2}`, '_blank');
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
  
Clique no Botão "Ver Respostas"

Após executar o script, um botão "Ver Respostas" aparecerá na página.
Clique no botão para abrir uma nova aba com as respostas das questões.
Estrutura dos Scripts
index.js
Este script configura um servidor Express que utiliza a API de inteligência artificial da Google para responder questões. Ele possui duas rotas principais:

/responder2: Suporta análise de imagens.
/responder: Suporta apenas análise de textos.
script-navegador.js
Este script é inserido no console do navegador para coletar questões e alternativas da página do CMSP e enviá-las para a API hospedada, exibindo as respostas em uma nova aba.

Observação
Este projeto está em desenvolvimento contínuo e pode receber atualizações para melhorar a funcionalidade e a precisão das respostas.
