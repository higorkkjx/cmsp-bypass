//CRIADO POR HIGOR OLIVEIRA
//AINDA EM DESENVOLVIMENTO

import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/files';
import axios from 'axios';
import path from 'path'
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const app = express();
const port = process.env.PORT || 3000;
import fs from 'fs'
const apiKey = 'AIzaSyDFkkCgmWZcA2VwZA-cjFXTU1wKKoM3GCo'
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

//ORDENANDO A INTELIGENCIA ARTIFICIAL (NAO MUDE) --------> 
const OrdemIA = "Seja um professor, você entende de qualquer área, irei te fornecer questões nesse formato: \n\n\"Questão ${numeroQuestao}\n\n${textoDaQuestao}\n\n${Alternativas}\"\n\nQuero que você apenas me responda qual a questão correta, por exemplo \nResposta Correta: alternativa), e nada mais. me envie apenas \nResposta Correta:  alternativa)\n"
// ----->

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

app.use(bodyParser.json());


//ESSSA ROTA POSSUI SUPORTE A ANALISE DE IMAGENS (PARA AQUELAS QUESTÕES QUE TEM  O CONTEXTO EM IMAGEM)
app.get('/responder2', async (req, res) => {
  try {
    const questao = req.query.questao;

    // Lógica para verificar se há algum link de imagem na string questao
    const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi;
    const temURL_deImagem = imageRegex.test(questao);
    const urlsImagens = questao.match(imageRegex);
    
    let imagensDrive = []; // Array para armazenar as imagens enviadas ao Gemini (ia)
    
    if (temURL_deImagem && urlsImagens && urlsImagens.length > 0) {
      console.log("URLs das imagens na questão:", urlsImagens);
    
      for (let i = 0; i < urlsImagens.length; i++) {
        const urlImagem = urlsImagens[i];
        try {
          
          const response = await axios.get(urlImagem, { responseType: 'arraybuffer' }); //OBTENDO O BUFFER DA IMAGEM DA QUESTÃO
          const imageExtension = urlImagem.split('.').pop();
          const imagePath = `./temp_image_${i}.${imageExtension}`;
          fs.writeFileSync(imagePath, response.data);
    
          // Define o objeto imageDrive para enviar ao Gem AI
          const imageDrive = await uploadToGemini(imagePath, "image/jpeg");
          imagensDrive.push(imageDrive);
        } catch (error) {
          console.error(`Erro ao baixar ou enviar a imagem ${urlImagem}:`);
        }
      }
    } else {
      console.log("Nenhuma URL de imagem encontrada na questão.");
    }
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: OrdemIA,
    });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    
    let chatSession;
    if (temURL_deImagem && imagensDrive.length > 0) {
      const historyParts = imagensDrive.map((imageDrive, index) => ({
        role: "user",
        parts: [
          { text: `imagem  ${index + 1} mencionada na questão:` },
          {
            fileData: {
              mimeType: imageDrive.mimeType,
              fileUri: imageDrive.uri,
            },
          },
        ],
      }));
    
      chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: historyParts,
      });
      
      const result = await chatSession.sendMessage(questao);
      const resposta = result.response.text();
    
      res.json({ resposta });
    } else {
      //EM "HISTORY" abaixo, contem um mini treinamento para a IA ser mais "inteligente"
      chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              { text: "Questão 1\nANDRADE, Mário de. Macunaíma. Belo Horizonte: Vila Rica, 1993.\n\nA ursa maior é Macunaíma. É mesmo o herói capenga que de tanto penar na terra sem saúde e com muita saúva, se aborreceu de tudo, foi-se embora e banza solitário no campo vasto do céu.\n\n\n\n\n\n\n\nA descrição de Macunaíma é típica do movimento:\n\n\n\nA) Romântico.\nx\nB) Modernista.\nx\nC) Barroco.\nx\nD) Realista.\nx\nE) Naturalista.\nx" },
            ],
          },
          {
            role: "model",
            parts: [
              { text: "Resposta Correta: alternativa B) \n" },
            ],
          },
          {
            role: "user",
            parts: [
              { text: "Questão 2\nLeia o fragmento inicial da obra “I-Juca-Pirama”, pertencente ao movimento do Romantismo:\n\n\n\n\n“No meio das tabas de amenos verdores,\n\nCercadas de troncos – cobertos de flores,\n\nAlteiam-se os tetos d’altiva nação;\n\nSão muitos seus filhos, nos ânimos fortes,\n\nTemíveis na guerra, que em densas coortes\n\nAssombram das matas a imensa extensão.\n\n\n\n\nSão rudos, severos, sedentos de glória,\n\nJá prélios incitam, já cantam vitória,\n\nJá meigos atendem à voz do cantor:\n\nSão todos Timbiras, guerreiros valentes!”\n\nDIAS, Gonçalves. “I-Juca Pirama”. Poemas de Gonçalves Dias. Ed. Péricles Eugênio da Silva Ramos. São Paulo: Cultrix, 1980.\n\n\n\n\nNeste fragmento inicial da obra, em que os Timbiras são apresentados e descritos, os indígenas são retratados como:\n\n\n\nA) Pacíficos e submissos, dispostos a negociar e evitar conflitos.\nx\nB) Hostis e agressivos, buscando constantemente a guerra e a conquista.\nx\nC) Orgulhosos e poderosos, líderes de uma nação guerreira e temível.\nx\nD) Passivos e indiferentes, desinteressados em lutar por sua terra e sua cultura.\nx\nE) Frágeis e vulneráveis, incapazes de resistir aos invasores e exploradores estrangeiros.\nx" },
            ],
          },
          {
            role: "model",
            parts: [
              { text: "Resposta Correta: alternativa C) \n" },
            ],
          },
        ],
      });
      const result = await chatSession.sendMessage(questao);
      const resposta = result.response.text();
  
      res.json({ resposta });
    }

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


//ESSA ROTA NÃO TEM SUPORTE A ANALISE DE IMAGENS,APENAS TEXTOS.
app.get('/responder', async (req, res) => {
  try {
    const questao = req.query.questao;

    const temURL_deImagem = false
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: OrdemIA,
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

 let chatSession;
    if (temURL_deImagem == true) {

      //LOGICA PARA BAIXAR A IMAGEM LOCALMENTE E TEMPORARIAMENTE AQUI

      const imageDrive0 = await uploadToGemini(`${LOCAL_DA_IMG}`, "image/jpeg");
      console.log(imageDrive0)

       chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {text: "imagem:"},
              {
                fileData: {
                  mimeType: imageDrive0.mimeType,
                  fileUri: imageDrive0.uri,
                },
              },
            ],
          }
        ],
      });
    } else {
     chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {text: "Questão 1\nANDRADE, Mário de. Macunaíma. Belo Horizonte: Vila Rica, 1993.\n\nA ursa maior é Macunaíma. É mesmo o herói capenga que de tanto penar na terra sem saúde e com muita saúva, se aborreceu de tudo, foi-se embora e banza solitário no campo vasto do céu.\n\n\n\n\n\n\n\nA descrição de Macunaíma é típica do movimento:\n\n\n\nA) Romântico.\nx\nB) Modernista.\nx\nC) Barroco.\nx\nD) Realista.\nx\nE) Naturalista.\nx"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Resposta Correta: alternativa B) \n"},
            ],
          },
          {
            role: "user",
            parts: [
              {text: "Questão 2\nLeia o fragmento inicial da obra “I-Juca-Pirama”, pertencente ao movimento do Romantismo:\n\n\n\n\n“No meio das tabas de amenos verdores,\n\nCercadas de troncos – cobertos de flores,\n\nAlteiam-se os tetos d’altiva nação;\n\nSão muitos seus filhos, nos ânimos fortes,\n\nTemíveis na guerra, que em densas coortes\n\nAssombram das matas a imensa extensão.\n\n\n\n\nSão rudos, severos, sedentos de glória,\n\nJá prélios incitam, já cantam vitória,\n\nJá meigos atendem à voz do cantor:\n\nSão todos Timbiras, guerreiros valentes!”\n\nDIAS, Gonçalves. “I-Juca Pirama”. Poemas de Gonçalves Dias. Ed. Péricles Eugênio da Silva Ramos. São Paulo: Cultrix, 1980.\n\n\n\n\nNeste fragmento inicial da obra, em que os Timbiras são apresentados e descritos, os indígenas são retratados como:\n\n\n\nA) Pacíficos e submissos, dispostos a negociar e evitar conflitos.\nx\nB) Hostis e agressivos, buscando constantemente a guerra e a conquista.\nx\nC) Orgulhosos e poderosos, líderes de uma nação guerreira e temível.\nx\nD) Passivos e indiferentes, desinteressados em lutar por sua terra e sua cultura.\nx\nE) Frágeis e vulneráveis, incapazes de resistir aos invasores e exploradores estrangeiros.\nx"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Resposta Correta: alternativa C) \n"},
            ],
          },
        ],
      });
    }

    const result = await chatSession.sendMessage(questao);
    const resposta = result.response.text();

    res.json({ resposta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


//ROTA PARA OBTER AS RESPOSTAS E ENVIAR O HTML DE RESPOSTA
app.get('/multipla', async (req, res) => {
    try {
      const questao1 = req.query.questao1;
      const questao2 = req.query.questao2;
  
      let resposta1;
      let resposta2;
  
      for (let i = 0; i < 2; i++) {
        const solic1 = await axios.get(`https://higor-cmsp-api-93266b3970dc.herokuapp.com/responder2?questao=${questao1}`)
        await sleep(3000)
        const solic2 = await axios.get(`https://higor-cmsp-api-93266b3970dc.herokuapp.com/responder2?questao=${questao2}`)
  
        resposta1 = solic1.data.resposta;
        resposta2 = solic2.data.resposta;
      }
  
      // Construir a string HTML e CSS
      const HTMLResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
  
            .container {
              max-width: 600px;
              margin: auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
  
            h2 {
              color: #333;
            }
  
            .resposta {
              margin-top: 10px;
            }
  
            .creditos {
              margin-top: 20px;
              font-style: italic;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Respostas</h2>
            <div class="resposta">
              <strong>QUESTAO 1:</strong> ${resposta1}
            </div>
            <div class="resposta">
              <strong>QUESTAO 2:</strong> ${resposta2}
            </div>
          </div>
          <div class="creditos">
          Site e script criado por Higor Oliveira.
          insta: @higorkkjx
        </div>
        </body>
        </html>
      `;
  
      res.send(HTMLResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
