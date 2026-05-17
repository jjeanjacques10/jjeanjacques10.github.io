---
title: "[PT-BR] Spring Data JPA — Overview"
date: 2022-07-07
description: "Visão geral do Spring Data JPA em português: entidades, repositórios, queries e boas práticas para acessar banco de dados com Java."
tags: ["Spring Boot", "Java", "Banco de Dados", "JPA"]
cover: "/posts/images/2022-07-07-pt-br-spring-data-jpa-overview/cover.png"
draft: false
---

## [PT-BR] Spring Data JPA — Overview

Entendendo de verdade o Framework mais utilizado em aplicações Spring para manipulação de dados

Quem já precisou trabalhar com bancos de dados relacionais utilizando o Spring Framework muito provavelmente já se deparou com o Spring Data JPA.

O Spring Data JPA é um Framework que faz parte da família Spring Data, que é composta também pelo Spring MongoDB e Spring Data Redis. Tem como objetivo tornar mais fácil a construção de aplicações Java que necessitam de um mapeamento de banco de dados, servindo como um ORM (Object Relational Mapper).

Mesmo sendo frequente no cinto de utilidades dos desenvolvedores, ainda existem muitas dúvidas sobre o seu funcionamento e como trabalhar de forma eficiente com esse Framework, então lhes convido a seguir comigo nesse artigo, onde passaremos pelos tópicos mais importantes do Spring Data JPA!

Lembrando que todo código e exemplos podem ser encontrados no repositório do GitHub.

### Instalando as dependências

Vamos iniciar adicionando a dependência do Spring Data no arquivo pom.xml, desta forma habilitamos o uso em nossa aplicação Spring Boot.

``` xml
<dependencies>
  <dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
  </dependency>
</dependencies>
```

É possível trabalhar com diversos SGBD’s (Sistema de Gerenciamento de Banco de Dados), como por exemplo:

- MySQL
- PostgreSQL
- SQL Server
- MariaDB
- Oracle Database

Sendo todos eles bancos de dados Relacionais. Contudo, para isso precisamos adicionar a dependência específica ao Driver que queremos utilizar. Segue exemplo para uma conexão MySQL:

``` xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.25</version>
</dependency>
```

### Configurando a aplicação

Com as dependências instaladas devemos configurar a nossa conexão e também tomar algumas decisões importantes dependendo do ambiente que pretendemos alocar nosso App, no arquivo application.properties acrescentamos os seguintes atributos.

É nessa etapa que você deve analisar bem qual ambiente deseja subir seu aplicativo. Quando vamos configurar o spring.jpa.hibernate.ddl-auto temos algumas opções que, caso não sejam bem configuradas, podem gerar grande dor de cabeça! Vamos conhecer elas:

- create: Deleta as tabelas que já existem e em seguida cria novas.
- create-drop: Muito parecido com o create, mas aqui as tabelas serão deletas após todas as demais operações.
- update: Observa as atualizações feitas e atualiza o esquema com as diferenças encontradas.
- validate: Valida se tudo que foi mapeado existe (tabelas, campos e etc…), caso contrário, lança uma exceção.
- none: Nenhuma das outras opções, desliga a atualização e criação de esquema.

> A escolha errada pode causa perda de dados ou corromper seu schema

### Annotations

O Spring Data JPA facilita a nossa vida abstraindo a configuração por meio de Annotations (Anotações). Ao invés de referenciarmos em um arquivo XML podemos apenas “anotar” nossas classes e atributos Java com os seguintes valores:

- @Entity
Adicionamos na classe para informar para o Spring que ela será uma entidade mapeável para o banco de dados.
- @Table
Adicionamos na classe para informar quais configurações devem ser feitas para a tabela que estamos mapeando. Podemos passar informações referentes a ela como o nome.
- @Column
Adicionamos nos atributos da classe para especificar qual coluna corresponde no banco de dados. Configurações como tamanho, se aceita nulo dentre outras coisas podem ser feitas nessa anotação.
- @Id
Adicionamos no atributo que corresponde ao ID da tabela. É obrigatório que toda Entidade possua um identificador único.
- @GeneratedValue
Possibilita definirmos qual estratégia queremos para gerar o ID da entidade. Adicionamos acima do atributo com a anotação @Id
- @Enumerated
Adicionamos nos atributos do tipo ENUM que desejamos mapear, podemos fazer configurações como utilizar número ou o valor do ENUM.

> Estas são as principais anotações, temos outras que podem ser encontradas no link a seguir — <https://www.baeldung.com/spring-data-annotations>

### Trabalhando com ID’s

Esse é um ponto que gera muita dúvida: Qual estratégia devo utilizar para geração de chaves primárias em minha tabela? Vamos conhecer um pouco mais sobre cada uma das possibilidades e assim suas decisões podem ser tomadas com mais embasamento.

- GenerationType.AUTO
É a estratégia padrão, sempre que não definimos um GenerationType para o nosso identificador estamos utilizando o AUTO, nele os valores serão determinados a partir do tipo de nosso atributo. São aceitos os types numeral e UUID.
- GenerationType.IDENTITY
Estratégia mais utilizada em projetos. Os IDs serão gerados pela coluna de AUTO_INCREMENT do banco de dados. Alguns bancos podem não suportar essa opção.
- GenerationType.SEQUENCE
Utiliza sequências quando elas são aceitas pelo banco de dados utilizado, como por exemplo: SEQUENCE em Oracle Database. Caso o banco não aceite mudara automaticamente para TABLE.
- GenerationType.TABLE
Utiliza tabelas para gerar as chaves primárias. Aceito por todos os bancos de dados, porém, não é muito recomendado por não escalar bem e poder causar problemas de performance.

Agora que conhece melhor sobre cada tipo de geração de identificadores escolha com sabedoria em seus próximos projetos.

### Criando um repositório

Após a criação de nossas entidades precisamos interagir com os dados, o Spring Data JPA oferece uma interface que facilita esse processo. Estendemos da interface JpaRepository, por meio dela podemos utilizar alguns métodos padrões ou criar nossas próprias Queries.

Nesse exemplo temos os dois primeiros métodos que são padrões da interface JpaRepository, o primeiro retorna uma lista e o segundo nos retorna um objeto Optional da Entity Shinobi. Perceba que precisamos mapear os genéricos da interface com a primeira posição sendo a entidade (Shinobi) e a segunda o tipo de Id (Long), os retornos destes método mudam de acordo com o que for mapeado no repositório.

Muitas vezes é necessário executar consultas SQL, e para isso utilizamos uma anotação chamada @Query que aceita esse código como parâmetro. Como por exemplo no findByNameLikeQuery, onde estamos passando o código SQL “SELECT s FROM Shinobi s WHERE name LIKE %:name%”, perceba que é necessário passar o nome da tabela com a primeira letra em maiúsculo e criar um alias (a letra “s”) para realizar a consulta (não é preciso quando utilizamos queries nativas)

A abordagem utilizando o @Query nos dá mais poder sobre o Framework, não engessando o desenvolvimento e possibilitando a criação de consultas mais complexas e performáticas.

### Consultas nativas

Para criar consultas nativas basta adicionar um novo parâmetro para a anotação chamado nativeQuery e setar o valor como “true”.

![Query nativa sendo executada](/posts/images/2022-07-07-pt-br-spring-data-jpa-overview/image-2.png)

### Inicializando a aplicação com dados

Essa é uma necessidade que você pode vir a ter, a de inicializar seu banco de dados com alguns valores padrões, é possível fazer isso adicionando um arquivo de inicialização, no caso o populate-database.sql na pasta sql de nossa aplicação.

Quando executarmos pela primeira vez veremos essa interação nos logs com os itens sendo inseridos.

![Populando aplicação Spring Boot ao iniciar](/posts/images/2022-07-07-pt-br-spring-data-jpa-overview/image-3.png)

Repositório projeto de exemplo:

> Todos esses exemplos podem ser encontrados no seguinte repositório no GitHub: <https://github.com/jjeanjacques10/spring-data-jpa-demo>

Alguns tópicos ficaram de fora, como por exemplo a parte de relacionamento, queries mais avançadas, pensando na performance da aplicação, paginação e dentro outros pontos. Mais para frente irei lançar uma parte dois e adiciono o link aqui!

### Conclusão

Após me aprofundar na biblioteca que vejo diariamente, percebi o quanto ainda tenho a aprender, e esses novos tópicos que descobri já começaram a me ajudar no dia a dia de trabalho diminuindo o tempo de desenvolvimento e buscas no Stack Overflow (além de evitar muita dor de cabeça ao debugar as aplicações). Espero que este artigo tenha lhe auxiliado em sua jornada de aprendizado com Spring Data JPA.

Caso tenha alguma crítica, sugestão ou dúvida fique a vontade para me enviar uma mensagem:

Até a próxima!

### Referências

- Spring Data JPA<https://spring.io/projects/spring-data-jpa>
- Spring JPA — Multiple Databases <https://www.baeldung.com/spring-data-jpa-multiple-databases>
- Spring Data JPA Demo <https://github.com/jjeanjacques10/spring-data-jpa-demo>
