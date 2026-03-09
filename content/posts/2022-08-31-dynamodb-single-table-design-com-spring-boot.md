---
title: "DynamoDB Single-Table Design com Spring Boot"
date: 2022-08-31
description: ""
tags: ["AWS", "DynamoDB", "Spring Boot", "Arquitetura de Software"]
categories: ["cloud"]
cover: "/posts/images/2022-08-31-dynamodb-single-table-design-com-spring-boot/cover.png"
draft: false
---

## DynamoDB Single-Table Design com Spring Boot

### Um exemplo prático de como utilizar Single-table Design em uma aplicação Java Spring Boot

Desde que conheci o conceito de Sigle-Table Design quis entender melhor como isso poderia ser aplicado em um cenário real, criei essa prova de conceito e gostaria de apresentar para vocês!

DynamoDB é um banco de dados No-SQL de chave-valor (key-value) criado pela AWS, ele tem como foco trabalhar com grandes volumes de dados oferecendo performance. Diversas empresas atualmente utilizam esse banco de dados, como por exemplo Itaú, Amazon, Mercado Livre e a própria AWS. Neste artigo irei abordar algumas diferenças que você teria ao utilizar a estratégia de Single-table.

### O que é Single-table Design

Vamos começar lembrando um fato sobre o DynamoDB, sendo um banco de dados No-SQL, não tem o conceito de “joins”, portanto, se os dados estão na forma normalizada em várias tabelas, recuperar itens relacionados em mais de uma tabela exigirá várias solicitações em série para obter esses registros. No seguinte exemplo temos duas tabelas, a de personagens e a de revistas, que em nossa consulta retornam para o usuário informações sobre a os quadrinhos de um personagem específico e também seu perfil, aqui precisaríamos realizar duas consultas separadas para cada tabela.

![Consulta sendo realizada em múltiplas tabelas](/posts/images/2022-08-31-dynamodb-single-table-design-com-spring-boot/image-2.png)

Um método mais simples de obter esse mesmo resultado é centralizando tudo em apenas 1 tabela, aplicando o Single-Table Design, assim sempre que for necessário retornar informações do personagem e das revistas em que ele participa podemos realizar apenas 1 consulta que obteremos todos os dados.

![Consulta sendo feita em uma Single Table](/posts/images/2022-08-31-dynamodb-single-table-design-com-spring-boot/image-3.png)

Sendo essa a principal razão para migrar para uma single table no DynamoDB, a possibilidade de recuperar vários tipos de dados heterogêneos usando uma única solicitação.

Outra vantagem é que não será necessária a criação e acompanhamento de de alarmes ou métricas de monitoração para múltiplas tabelas, sendo que a cada uma que você provisiona novas configurações são necessárias, como permissões e monitoração como já citado. Quando centralizamos tudo em apenas uma tabela temos a redução de custos consumo para capacidades de leitura sendo que antes tínhamos o consumo dessa capacidade sendo feita em múltiplas queries e agora apenas 1 é necessária.

### Modelando a tabela

Vamos iniciar nossa modelagem determinando quais entidades queremos trabalhar, esse processo é muito parecido com o que fazemos ou modelar tabelas em um banco relacional, como MySQL ou Oracle. No nosso caso de uso as duas entidades são Character (Personagem) e Comic (Quadrinho), como é possível observar na imagem a baixo poderíamos ter uma tabela para cada um deles.

![Modelagem relacional das tabelas](/posts/images/2022-08-31-dynamodb-single-table-design-com-spring-boot/image-4.png)

Em banco relacionais temos a opção de realizar “JOIN’s” para obter a informação destas duas tabelas em conjunto, mas no DynamoDB isso não é possível.

Então vamos evoluir esse modelo aplicando o Single-Table Design a ele. Primeiro passo é definir os padrões de acesso que iremos utilizar:

- Retornar o perfil de um personagem
- Listar todos os perfis de personagens
- Listar todos os quadrinhos de um personagem
- Listar todos os quadrinhos

![Tabela de comics normalizada para Single-Table Design](/posts/images/2022-08-31-dynamodb-single-table-design-com-spring-boot/image-5.png)

Nesta nova modelagem, já no estilo de nosso banco No-SQL, temos como PK (PartitionKey) a informação de Character juntamente com o seu nickname, e nossa SK (SortKey) é composta pelo tipo (PROFILE/COMIC) e seu identificador. Antes o que eram 2 tabelas se transformaram em apenas uma onde cada linha representa um tipo de dado, como o DynamoDB é um banco com esquema “fraco” podemos ter diferentes colunas em cada linha da tabela, por conta disso não ficamos presos em colunas desnecessárias, exemplo disso são as colunas “comicId” e “name”.

Agora, quando queremos buscar o Personagem e os Quadrinhos, podemos fazê-lo em uma única solicitação sem precisar de uma operação de concatenação.

Com esse conceito e com nossa tabela já modelada, vou mostrar agora como colocar a mão na massa e implementar chamadas em uma aplicação Spring Boot!

## Criando nossa Aplicação Spring Boot

Criei a base do projeto utilizando o site: <https://start.spring.io/> . Selecione as bibliotecas padrões do Spring Web para criação de uma API Rest.

### Dependências

Após descompactar a pasta dele vamos iniciar adicionando as dependências necessárias, as duas libs que iremos utilizar são:

- AWS SDK
- DynamoDB Enhanced

``` xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>dynamodb-enhanced</artifactId>
    <version>2.17.263</version>
</dependency>
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-dynamodb</artifactId>
    <version>1.11.857</version>
</dependency>
```

> Obs: Não irei entrar em muitos detalhes sobre a configuração dessas duas libs, então caso tenha alguma dúvida pode entrar no repositório de exemplo na pasta config (comics/config/DynamoDbConfig.java)

### Entidades

Nessa próxima etapa vamos criar nossa entidade que será a referência do item salvo em na tabela do Dynamo. Aqui temos a Entity de Characters apenas com os campos que esse tipo de dado necessita, na visão da tabela seria a linha com o SK PROFILE#.

Agora essa é referente ao item de Comics (Quadrinho), são muito parecidas, afinal apenas os campos “comicId” e “type” foram adicionados para esse tipo de objeto e que não existiam no outro. Na visão da tabela seria a linha com o SK COMIC#.

Agora para o cenário que comentamos anteriormente, onde são retornados ambos: profile e comics, vamos utilizar essa nova entidade que possuí todos os campos necessários para os dois itens. Nos casos onde um não é possível encontrar o campo no registro apenas será ignorado, como por exemplo profile que não te “comicId” e comic que não possuí “name”.

Pronto! Entidades criadas, elas serão a base para os próximos passos onde iremos realizar as consultas.

### Realizando buscas

O DynamoDb trabalha com dois tipos de buscas o Scan e a Query, sendo o primeiro o mais lento e custoso, que faz uma pesquisa na tabela e retorna todas as informações, podemos até realizar filtros, porém, eles apenas serão aplicados depois de mapear todos os dados. O método Query é o mais recomendado a ser utilizado, onde apenas solicitamos a informação que precisamos. Contudo, o query apenas funciona em buscas utilizando os campos PartitionKey e SortKey que juntos forma o PrimaryKey. Este campo no DynamoDB pode ser simples ou composto.

- Simple Primary Keys: Consistem em uma PartitionKey e nenhuma SortKey.
- Composite Primary Keys: Consistem em uma PartitionKey e uma SortKey.

Para não ficarmos limitados apenas aqueles primeiros PK e SK que criamos podemos criar Global Secondary Indexes, que são PK’s e SK’s diferentes do que geramos na criação da tabela e correspondem a cópias de nossa tabela, facilitando assim na hora de realizar buscas. Por exemplo, seria a utilização do campo type (PK) e date (SK) para realizar filtros de tempo. Isso se mostra como uma vantagem, mas apenas podemos criar 20 desses indexes personalizados.

Para realizar buscas mais avançadas sem precisar de Global Secondary Indexes para tudo podemos utilizar o begins_with que faz um filtro em nossa SortKey, e essa é uma das principais vantagens de utilizar um Single-table Design. Aqui é um exemplo de código onde busco apenas o perfil de um personagem:

Também conseguimos filtrar todos os quadrinhos de um personagem específico utilizando o begins_with COMIC#.

> Só é possível utilizar esse método begins_with em SortKeys.

Agora para o tipo de consulta que comentamos acima onde devolvemos essas duas consultas anteriores juntas, em apenas uma busca na tabela fazemos a query sem passar a informação de SortKey, apenas a nossa partition.

De forma simples evitamos consumir muitos recursos na hora de fazer o que antes seria um “JOIN” procurando a informação em duas tabelas. Exemplo de retorno:

``` json
[
    {
        "pk": "CHARACTER#greenlantern",
        "sk": "COMIC#58f59aa1",
        "type": "COMIC",
        "nickName": "greenlantern",
        "realName": null,
        "description": "Green Lantern: New Guardians is an American comic book series originally written by Tony Bedard with art by Tyler Kirkham and Batt and published by DC Comics. The team consists of representatives of each of the Corps that tap into a particular portion of the emotional spectrum.",
        "comicId": "58f59aa1",
        "title": "Green Lantern: New Guardians"
    },
    <.. Comics ..>
    {
        "pk": "CHARACTER#greenlantern",
        "sk": "PROFILE#greenlantern",
        "type": null,
        "nickName": "greenlantern",
        "realName": "Hal Jordan",
        "description": "Harold 'Hal' Jordan, one of the characters known as Green Lantern, is a superhero appearing in American comic books published by DC Comics.",
        "comicId": null,
        "title": null
    }
]
```

Repositório projeto de exemplo:

> Todos esses exemplos podem ser encontrados no seguinte repositório no GitHub: jjeanjacques10/spring-dynamodb-single-table-design: Demo project for Spring Boot + DynamoDB Single Table Design (github.com)

### Desvantagens

Em bases como essa temos algumas desvantagens, por exemplo a dificuldade para realizar análises de dados, como temos essas informações desnormalizadas, o processo de exportar esse tipo de tabela para ferramentas de analytic acaba se tornando complexo. Além disso, com o tempo surge a falta de flexibilidade para adicionar novos padrões de acesso, como por exemplo uma nova entidade que se relacionará com personagens e quadrinhos.

Outro ponto é a curva de aprendizado que acaba sendo maior para quem inicia em um projeto em andamento, sendo que no inicio como vimos foram necessárias diversas conversas para chegar em um modelo ideal, esse conhecimento teria que ser passado a frente juntamente com as regras de negócio que ajudaram a modelar esse resultado atual do projeto.

## Conclusão

Com isso podemos concluir que o que irá determinar o uso desse tipo de design é o caso de uso que você tem em mãos. Como tudo em desenvolvimento de software esse tipo de abordagem é muito interessante, porém tem seus tradeoffs.

O uso de tabelas DynamoDB facilita muito no dia a dia, principalmente quando nossos dados são utilizamos muito para consultas, convido vocês a clonar o repositório com os exemplos, nele tem um ambiente criado para testes locais utilizando o Localstack, simulando o DynamoDB. Só colocando a mão na massas que será possível entender se essa abordagem cumpre com os desafios propostos!

Caso tenha alguma crítica, sugestão ou dúvida fique a vontade para me enviar uma mensagem

Até a próxima!

### Referências

The What, Why, and When of Single-Table Design with DynamoDB (alexdebrie.com)

Amazon DynamoDB single-table design using DynamoDBMapper and Spring Boot | AWS Database Blog

Getting started with DynamoDB and AWS SDKs — Amazon DynamoDB
