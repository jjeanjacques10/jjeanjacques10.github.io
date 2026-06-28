---
title: "Tornando seu código mais SOLID!"
date: 2022-02-23
description: "Aprenda os 5 princípios SOLID com exemplos práticos em Java e Spring para escrever código limpo, extensível e fácil de manter."
tags: ["Engenharia de Software", "SOLID", "Java", "Spring Boot"]
cover: "/posts/images/2022-02-23-tornando-seu-codigo-mais-solid/cover.png"
draft: false
---

## Tornando seu código mais SOLID

### Explicando os conceitos SOLID de orientação a objetos de uma forma simples e com um projeto prático

Respondendo a primeira e mais importante pergunta, o que é SOLID? O SOLID são os 5 princípios de design de código voltados para orientação a objetos que auxiliam os desenvolvedores a escreverem um código para “serem humanos” não apenas para máquinas. O que significa que tornam o sistema criado mais fácil de se manter e também mais adaptável, facilitando alterações de escopo que podem surgir durante a evolução do projeto.

Estes princípios se mantiveram importantes desde que foram definidos por Robert C. Martin (Uncle Bob) e a necessidade de implementa-los começa a surgir quando se sente um “cheirinho estranho” no código, ou melhor dizendo, um code smells, pode ser definido como qualquer ponto no código que não pareça muito bem e possa indicar algum problema mais profundo. Neste artigo vou lhe mostrar como identificar alguns destes pontos de atenção.

> Os exemplos utilizados neste artigo foram escritos em Java, mas podem ser replicados em qualquer linguagem! ☕

### Princípios do SOLID

Vamos começar dizendo o que cada letra significa:

- S — Single-responsibility Principle
- O — Open-closed Principle
- L — Liskov Substitution Principle
- I — Interface Segregation Principle
- D — Dependency Inversion Principle

Vamos começar pelo primeiro princípio e também, em minha opinião, o mais importante de todos eles, o princípio de:

### Single-Responsibility Principle

No princípio da responsabilidade única, uma classe não deve ter mais do que um objetivo ou finalidade. Com cada parte do seu código responsável por um escopo bem definido, quando isso é feito da maneira certa é possível encontrar de forma fácil o que deseja modificar e também identificar qual o melhor local para implementar uma nova funcionalidade.

Outra vantagem é que o SRP evita de você ter que guardar todo o programa em sua cabeça, sendo que pequenos “módulos” do código são mais fáceis de lembrarmos no dia a dia. Em projetos grandes é comum criar confusão na hora de lembrar onde fica uma certa função ou qual método deve ser chamado para realizar uma ação.

Exemplo de uma classe que tem mais responsabilidades do que o necessário:

Este é um exemplo de uma God Class (Classe Deus), em POO damos esse nome quando uma classe “sabe demais”, ou seja, que implementa vários métodos e não tem um objetivo bem definido. Com o tempo a tendência é ela aumentar cada vez mais de tamanho. Um dos caminhos para evitar essa bola de neve que irá se formar é utilizar o princípio da responsabilidade única criando classes que são responsáveis por uma única tarefa:

Neste novo exemplo fiz a separação das responsabilidades, agora temos o ReportService que cuida dos métodos de relatório e o PokedexService que é responsável pelo CRUD de Pokemon. O acesso ao banco de dados é feito por meio de um Repository. Agora ficou mais fácil para crescer a aplicação, com cada item com responsabiliades bem divididas.

Principais problemas quando não implementado:

- Dificuldade em escrever testes, principalmente de unidade;
- Falta de coesão no código;
- Alto acoplamento, a dependência entre as partes de sua aplicação irá aumentar.

### Open-closed Principle

> “Entidades de software (classes, módulos, funções e etc.) devem estar abertas para extensão, porém fechadas para modificação”

Este princípio determina que uma classe deve ser “fechada para alteração e aberta para extensão”. Okay, mas o que isso significa? 😕

Isso quer dizer que sempre que uma regra de negócio nova é adicionada não será necessário alterar um código já existente e sim adicionar uma nova implementação dele. Isso ficará muito mais claro depois de alguns exemplos:

Aqui temos diversas validações sendo realizadas ao tentar treinar um Pokémon, sempre que uma nova validação precisar ser adicionada precisaremos modificar esse código adicionando uma condicional. Como solução podemos fazer a seguinte modificação:

Agora nosso Service recebe uma lista de validações (linha 5) que implementa a interface TrainingValidation. Desta forma sempre que uma nova validação precisar ser adicionada ao nosso treinamento basta criar uma nova classe que implemente está interface.

Obs: O OCP pode lembrar bastante o Design Pattern Strategy, é um tópico interessante para se aprofundar.

Principais problemas quando não implementado:

- Métodos com várias condicionais
- Modificações constantes em entidades de software que já existem
- Aumento no número de bugs ocasionais ao alterar regras de negócio

### Liskov Substitution Principle

> “Se S é um subtipo de T, então os objetos do tipo T, em um programa, podem ser substituídos pelos objetos de tipo S sem que seja necessário alterar as propriedades deste programa” — Wikipedia

Vamos combinar que essa definição pode deixar nossa mente mais confusa do que explicar algo 😅, mas vamos por partes… Em outras palavras: Um novo objeto criado a partir de uma classe que possuí herança não pode quebrar o comportamento da classe ancestral.

Como exemplo estou utilizando a classe Item que é estendida para as classes filho PokeBall, MasterBall e UltraBall. Mas quando vemos a implementação podemos perceber que MasterBall não implementa o método “buy” porquê não é possível comprar esse tipo de item, apenas adquiri-lo em um lugar específico durante a sua jornada.

Por conta disso temos esse efeito inesperado quando tentamos vender um item MasterBall.

![Exemplificação de como a herança feriu o LSP](/posts/images/2022-02-23-tornando-seu-codigo-mais-solid/image-2.png)

Para seguirmos o princípio LSP a nossa MasterBall não deve herdar da classe “Item” e sim da nova Classe “ItemRare” que tem os métodos que se encaixam melhor no escopo desejado.

Com essa nova implementação as classes filho podem substituir facilmente a classe ancestral.

Principais problemas quando não implementado:

- Métodos que lançam exceções inesperadas
- Valores de tipos diferentes da classe base
- Implementar um método que não faz nada
- Muita lógica condicional espalhada pela aplicação

### Interface Segregation Principle

Uma classe não deve implementar métodos que não irá utilizar. Por conta disso uma segmentação maior acaba sendo melhor para a organização do código. Ao desenvolver um software devemos preferir ter mais interfaces específicas, em vez de uma única interface grande e de uso geral, o que tem relação com o princípio de responsabilidade única (SRP), de acordo com essa ideia vejamos a seguinte implementação. Essa é a interface de Payment onde temos os métodos relacionados a um processo de transação dentro da aplicação:

Agora vamos ver a implementação desta interfacenas Classes WalletService e LoanService.

O service de Wallet precisa implementar todos os métodos da interface, o que acaba causando comportamentos inesperados quando métodos relacionados a empréstimo como o initiateLoanSettlement são chamados, nesse exemplo a classe Wallet não tem como iniciar um empréstimo assim como a classe de LoanService não tem como iniciar um pagamento.

Como solução para este problema segue um exemplo de implementação de interfaces mais específicas que atendem melhor a necessidade de nossa aplicação:

![Diagrama de Classe — Exemplo ISP](/posts/images/2022-02-23-tornando-seu-codigo-mais-solid/image-3.png)

Neste novo desenho cada Service implementa de uma interface com os métodos que pertence ao seu domínio. Como dá para perceber o número de arquivos aumentou, mas isso não é um problema porquê o foco é manter as classes implementando apenas os métodos necessários.

Resumindo este princípio, caso uma interface comece a ganhar muitas responsabilidades ela deve ser dividida em interfaces menores, as quais serão implementadas pelos clientes (entidades de software). Lembrando que os clientes não devem implementar métodos que não utilizam.

Principais problemas quando não implementado:

- Comportamentos inesperados quando chamar uma função
- Utilização dos conceitos de herança de forma errada
- Ferir o primeiro princípio da responsabilidade única

### Dependency Inversion Principle

O princípio de inversão de dependência é sobre como classes devem depender de abstrações, não de implementações específicas dessas abstrações. Quando fazemos isso evitamos que detalhes ditem como devemos implementar uma solução. Se você realiza a chamada de uma classe dentro de outra está classe irá depender da que foi chamada. Isso resulta em um grande acoplamento e dificulta na alteração de módulos externos e também na escrita de testes. Busque então incorporar essa noção em seu código caso queira torna-lo mais flexível, ágil e reutilizável.

Neste exemplo a classe PokedexService está instanciando o modelMapper e também a Conexão do banco de dados dentro de seu construtor, da forma que está implementada temos uma dependência destes dois atributos. No caso temos acesso até as informações de URL, USER e PASSWORD referentes a conexão ao banco de dados, o que sai totalmente do escopo original da Pokedex.

Para resolver esses problemas transformamos a conexão em uma interface de Repository, que é a abstração que comentei a cima, onde ela pode ser trocada facilmente por outros clientes de banco de dados. Além disso ambos Repository e ModelMapper são trazidos para classe de Service por meio da passagem da informação pelo construtor (Dependency Injection) sendo possível uma maior flexibilidade.

Podemos utilizar este conceito também para estruturar melhor nossa aplicação, como exemplo no projeto criei uma interface por serviço, desta forma tenho uma visão melhor de quais são os métodos realmente necessários e também tenho uma facilidade maior para trocar uma implementação caso necessário.

![Estrutura de arquivos no projeto de exemplo](/posts/images/2022-02-23-tornando-seu-codigo-mais-solid/image-4.png)

Principais problemas quando não implementado:

- Alto acoplamento entre classes
- Aumento da complexidade para trocar um sistema externo (adapter)
- Aumento da complexidade na escrita de testes

## Recomendações

Conheci os princípios do SOLID por meio do livro Clean Code. É uma leitura que recomendo para aqueles que buscam melhorar a forma que escrevem código. Poderia recomendar também diversos vídeos e artigos como este, contudo, o mais importante é implementar o que viu aqui em seus projetos, só assim estes conceitos ficaram mais enraizados em sua mente.

Para ajudar você a por a mão na massa segue um link que pode ser bem útil:

> Repositório GitHub
Aqui está o link para o repositório no GitHub onde coloquei os exemplos de código escritos em Java: <https://github.com/jjeanjacques10/solid>

## Conclusão

Quando implementamos estes conceitos em nossos projetos temos um código melhor organizado, mais robusto e de fácil manutenção. Que é basicamente o sonho de todo desenvolvedor. O SOLID sozinho não vai fazer milagres, mas ajuda aqueles que trabalham com programação orientada a objetos a terem uma visão mais voltada para o reaproveitamento e boas práticas.

No começo pode ser um pouco complicado entender todos estes princípios, mas o que me ajuda a compreender cada dia mais o SOLID é buscar implementa-los todos os dias nos códigos que desenvolvo. Se quer aprender então coloque a mão na massa!

Caso tenha alguma crítica, sugestão ou dúvida fique a vontade para me enviar uma mensagem. Até a próxima!

## Referências

<http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod>

Interface Segregation Principle in Java | Baeldung

Exploring S.O.L.I.D Principle in Android | by Anitaa Murthy | ProAndroidDev (medium.com)
