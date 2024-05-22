# CMSP BYPAS

## Contexto

CMSP BYPAS é um projeto que integra inteligência artificial ao sistema de rotas do Express para responder questões educativas. Ele consiste em dois scripts:

1. **index.js**: Este é o back-end do projeto, que deve ser hospedado (usaremos Heroku para isso). Ele contém um sistema de rotas Express integrado com inteligência artificial, cujo objetivo é responder a questões.
2. **script-navegador.js**: Este script deve ser adicionado no console do navegador para interagir com o site CMSP, facilitando a obtenção de respostas para as tarefas.

## Índice

- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
  - [Hospedando no Heroku](#hospedando-no-heroku)
- [Como Utilizar](#como-utilizar)
  - [Utilizando o script-navegador.js](#utilizando-o-script-navegadorjs)
- [Exemplo de Uso](#exemplo-de-uso)
- [Licença](#licença)
- [Créditos](#créditos)

## Funcionalidades

- **Respostas a Questões**: Utilize a API para obter respostas de questões educacionais.
- **Suporte a Imagens**: A API pode analisar questões que contenham imagens.
- **Interface Simples**: Um botão no navegador que facilita a interação com a API.

## Requisitos

- Node.js
- Conta no Heroku
- Navegador com console de desenvolvedor (Chrome, Firefox, etc.)

## Instalação e Configuração

### Hospedando no Heroku

1. **Clone o repositório**

   ```sh
   git clone <URL_DO_REPOSITÓRIO>
   cd <NOME_DO_REPOSITÓRIO>
