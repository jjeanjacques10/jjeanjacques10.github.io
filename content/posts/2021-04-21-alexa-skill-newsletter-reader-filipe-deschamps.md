---
title: "Alexa Skill — Newsletter Reader (Filipe Deschamps)"
date: 2021-04-21
description: "Aprenda a criar uma Alexa Skill do zero para ler a newsletter do Filipe Deschamps usando AWS Lambda e Serverless."
tags: ["AWS", "Alexa", "Serverless", "Integrações"]
categories: ["cloud"]
cover: "/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/cover.png"
draft: false
---

## Alexa Skill — Newsletter Reader (Filipe Deschamps)

Uma maneira simples de ler newsletters que você recebe por e-mail

Depois que comprei um Echo Dot, que utiliza a assistente virtual por voz Alexa, fiquei um pouco preguiçoso. Para mim, é complicado ler todas as newsletters que recebo por email, por isso decidi incumbir a minha nova amiga robô esse processo de leitura ❤.

Logo de cara, tive algumas dificuldades para descobrir uma forma de receber as notícias e enviar para a Alexa, depois procurei no Google algumas alternativas e encontrei vários softwares e aplicações web, infelizmente era tudo pago 😥 (e as opções gratuitas eram limitadas). Porém, descobri o Portal de Desenvolvimento das Skills da Alexa, diferentemente das outras opções, nesta eu conseguia resolver o meu problema de forma TOTALMENTE GRATUITA!

Contudo… eu precisaria ter meu próprio código, mas isso não é um problema 😤😁

Vamos ver como criei a minha primeira Alexa Skill para ler uma das minhas Newsletters favoritas!!

## Alexa Skills

![Logo Alexa](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-2.png)

Segundo o site oficial, as skills da Alexa são aplicativos ativados por voz que adicionam recursos a um dispositivo compatível com a assistente virtual. As skills adicionam novas funcionalidades à sua experiência com a Alexa. Elas estão disponíveis em várias categorias, como Educação, Notícias, Jogos ou Música.

![Dispositivos que aceitam Alexa Skills](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-3.png)

## A Newsletter

Esse é o Filipe Deschamps, programador e YouTuber que criou uma newsletter incrível e 100% gratuita onde compartilha novidades de tecnologia com seus assinantes. E foi ela que utilizei para criar minha skill. Todos os dias, meu robô lê o e-mail enviado por ele e se integra com a Alexa.

Ah, antes que eu esqueça: você pode se inscrever neste link

![Example of newsletter email](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-4.png)

## Get Started

- Newsletter (Uma que goste)
- Alexa Developer Console
- NodeJS
- Zapier
- Google Sheets

A primeira etapa é fazer o scrapping do e-mail:

## Zapier

Eu adoro esta ferramenta, Zapier é um automation helper (do inglês, ajudante de automação), você pode criar integrações com várias plataformas, como Planilhas Google, Trello, GitHub e outras. Estou acostumado a usar-lo para melhorar meus aplicativos, é bem mais fácil do que reinventar a roda sempre.

Para isso criei uma integração de Planilhas Google + Gmail, o processo é simples:

### 1. Crie uma label no Gmail

No meu caso, eu marquei como “technewsletter”, então sempre que recebo um novo e-mail do contato “<newsletter@filipedeschamps.com.br>”, será definido este rótulo. Isso me ajudou a controlar meu fluxo de e-mail e não perder nenhum que for enviado.

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-5.png)

### 2. Crie um Zap Gmail

Agora devemos configurar no Zapier o e-mail onde recebemos a newsletter. É a maneira mais simples de obter informações do Gmail ou de outros sistemas de e-mail.

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-6.png)

Depois de configurar seu e-mail, a etapa mais importante é configurar um trigger, que é como um gatilho para rodar a configuração que estamos fazendo. Como expliquei acima, você deve utilizar a label que criamos anteriormente como nosso gatilho principal.

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-7.png)

Gmail configurado!

### 3. Crie uma planilha no Google Sheets

Como um “banco de dados” optei por utilizar uma planilha, era a maneira mais simples de salvar os dados e acessá-los posteriormente. Assim, usando o Zapier, criei um Zap do Google Sheet onde selecionei a opção “Criar linha da planilha”(Create Spreadsheet Row).

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-8.png)

Na etapa de action, você deve selecionar uma spreadsheet e um worksheet, no meu exemplo eu usei:

- Newsletter => Spreadsheet
- News => Worksheet

Na mensagem passei o corpo do HTML. Quando utilizo este formato tenho mais controle sobre a estrutura do texto, o que mais para frente vou mostrar como pode ser útil…

Depois de criar nossa tabela e configurá-la para preencher toda vez que recebermos uma nova newsletter por e-mail, temos uma planilha como esta:

![The excel file with the news](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-9.png)

> E se eu tivesse feito uma conexão direta com o Gmail, seria mais fácil, não seria? Bem… eu poderia fazer isso, mas o principal motivo para evitar essa abordagem é que ficaria mais complicado para gerenciar erros, por isso preferi enviar primeiro para o Planilhas Google. Além da possibilidade de reuso em outras aplicações.

## Alexa Skill

O primeiro passo é criar uma conta de desenvolvimento no Developer Portal e acessar o console, onde você encontrará todas as configurações de suas habilidades. Depois disso, você pode prosseguir para as próximas etapas …

## Os códigos

Desenvolvi dois códigos, o primeiro é uma Custom Skill onde leio diretamente o texto da newsletter da última linha escrita na planilha e o envio para a assistente. E o segundo é um flash briefing, onde gero um arquivo JSON que tem a separação entre as notícias e é lido pela Alexa. Sempre me perguntam o porque fazer duas skills que tem a mesma função, vamos lá… o principal motivo foi: A primeira que desenvolvi foi a custom, e ao criar as Skills não há a possibilidade de mudar a versão para Flash Briefing sem perder todos os dados. Criei a segunda versão, Flash Briefing, por conta dos pedidos de separação das notícias, porém, essa segunda tem um limite de itens (5 no total). Para manter os pontos positivos de ambas resolvi deixar as duas online.

Flash briefing: Separação entre notícias, poder adicionar de forma mais fácil ao resumo diário.

Custom Skill: Conseguir ler todas as notícias.

Aqui está como desenvolvi elas duas:

### Criando uma nova habilidade…

Vamos começar criando a Skill, acesse o portal de desenvolvimento e após clicar no console você será redirecionado para este endereço: Create new Alexa Skill. Selecione o nome da sua habilidade e o tipo dela como no exemplo a baixo. Como podem ver temos as opções de Custom e Flash Briefing, irei tratar sobre as duas mais a frente.

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-10.png)

## Custom Skill

Caso tenha selecionado esta opção clique na aba de "Build". O primeiro passo é criar sua intenção, que se refere ao objetivo que o cliente tem em mente ao falar com a assistente. Por exemplo, a intenção que criei foi a “NewsLetterIntent”, ela é ativada sempre que o usuário deseja ler as notícias. Como é possível ver, as opções de chamada são:

- newsletter filipe deschamps
- newsletter do deschamps
- newsletter do filipe

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-11.png)

Com a intenção criada, acesse o portal e selecione a aba de código no Alexa developer console. Você verá a uma estrutura de arquivos bem parecida com um serverless. Adicione o código abaixo no arquivo index.js, com ele podemos fazer com que a intenção “NewsLetterIntent” retorne as notícias que estão sendo buscadas na tabela criada no Google Sheets.

```javascript
// Aqui está o código que lê a planilha
const readSpreadSheet = require('./readSpreadSheet.js');
```

```kotlin
const NewsLetterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NewsLetterIntent';
    },
    async handle(handlerInput) {
        var speakOutput = await readSpreadSheet;
```

```
return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .withShouldEndSession(true)
            .getResponse();
    }
};
```

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-12.png)

```javascript
const readSpreadSheet = require('./readSpreadSheet.js');
```

Nesta linha estou fazendo a importação do código que lê a minha planilha, limpa o texto e o retona para a Alexa. Mais a baixo quando falo sobre a Skill Flash Briefing eu explico detalhadamente cada um dos métodos utilizados nete arquivo.

Você pode encontrar o código completo da Skill customizada neste link: custom skill newsletter jjeanjacques10/alexa-newsletter-deschamps.

## Flash Briefing

Está opção é bem mais simples, o que você vai precisar é de um JSON no formato certo para a Alexa ler. Então vamos lá! O e-mail é um código HTML, não posso enviar para Alexa diretamente, então criei um método onde pego esse código, limpo todas as tags e deixo em um formato entendível.

Para facilitar separei meu código em 3 partes, que são estas:

### getNews()

Conecta o GoogleSpreadsheet utilizando o pacote google-spreadsheet | npm. Seleciona a última linha da planilha, que corresponde ao último e-mail enviado com a newsletter, e então chama a função que faz a limpeza do texto (cleanText).

### cleanText()

Tive alguns problemas quando tentei publicar, a Amazon é muito rígida com o formato do texto e também o conteúdo que você vai apresentar para o usuário, depois de algumas revisões corrigi estes problemas:

- Vírgulas no lugar errado
- Links de promoções não informadas anteriormente

### buildJson()

Para poder fazer um Flash Briefing devemos utilizar um tipo de JSON pré-definido pela Amazon. Precisei criar um neste formato:

```json
[
   {
      "uid": "b89847c0-bd29-4ae6-a983-e1e715811b32",
      "updateDate": "2021-04-20T15:10:03.335Z",
      "titleText": "Notícias que chamaram a nossa atenção nesta terça-feira:",
      "mainText": "Notícias que chamaram a nossa atenção nesta terça-feira: ",
      "redirectionUrl": "https://filipedeschamps.com.br/newsletter"
   }
   ...
]
```

Este código é responsável por construir a estrutura JSON e retornar um array de notícias.

Após todo este processo você deve pegar o arquivo gerado e salvar em um servidor. Você pode utilizar um S3 da AWS (Amazon Web Services) para fazer isso ou em alguma máquina própria. Apenas saiba que precisará disponibilizar para acesso externo o arquivo. Com o link direcionando para ele entre no portal na parte de configurações de Flash Briefing e defina como feed padrão o endereço. Desta forma:

![Image](/posts/images/2021-04-21-alexa-skill-newsletter-reader-filipe-deschamps/image-13.png)

## Conclusão

Ok, com tudo configurado podemos ler nossa newsletter utilizando a Alexa! Convido vocês a testar as Skills “Newsletter Filipe Deschamps”!

Aqui estão os links para as duas Skills, não esqueça de dar uma nota no site da Amazon, isso ajuda muito!

- Custom Skill — <https://www.amazon.com.br/dp/B08RG61BPD>
- Flash Briefing — <https://www.amazon.com.br/dp/B08SQTLJSK>

E gostaria de agradecer ao Filipe Deschamps, confesso que pensei que seria processado de inicio 😅, mas ele deu super apoio ao projeto, então meu super obrigado!

Caso tenha interesse é possível acessar o código aqui:

> Repositório GitHub
<https://github.com/jjeanjacques10/alexa-newsletter-deschamps>

Caso tenha alguma crítica, sugestão ou dúvida fique a vontade para me enviar uma mensagem:

Revisão de texto realizada por: Gabriel Petillo

Até a próxima!

## Referências

Alexa Skills Kit Official Site: Build Skills for Voice <https://developer.amazon.com/pt-BR/alexa/alexa-skills-kit>

Alexa Skills and Features <https://www.amazon.com/alexa-skills/b?ie=UTF8&node=13727921011>

Newsletter Filipe Deschamps <https://filipedeschamps.com.br/newsletter>

@jjean_dev • Instagram <https://www.instagram.com/jjean_dev/>
