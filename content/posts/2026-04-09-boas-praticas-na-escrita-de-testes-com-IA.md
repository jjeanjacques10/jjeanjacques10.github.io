---
title: "Boas práticas na escrita de testes unitários com IA"
date: 2026-04-09
description: ""
tags: ["Engenharia de Software", "Testes", "Kotlin", "IA"]
categories: ["software-engineering"]
cover: "/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/cover.png"
draft: false
---

A forma como trabalhamos com desenvolvimento de software vem mudando com o tempo, a cada dia novas ferramentas aparecem e melhoraram e muito como entregamos código, mas isso também gera algumas preocupações, como a qualidade desse código gerado. Trouxe aqui algumas boas práticas para escrever testes unitários utilizando LLMs, garantindo que o código gerado seja de qualidade e siga as melhores práticas do mercado.

## Unit Tests (Testes unitários)

Antes de tudo é importante entender o que são testes unitários, para então passar a como escrever bons testes.

Unit tests são testes automatizados que validam cenários específicos de regras de negócio, validações lógicas e fluxos de código que garantem qualidade na entrega evitando bugs e falhas em produção. Eles são escritos para testar unidades isoladas de código, como métodos ou classes, garantindo que cada parte do sistema funcione corretamente.

Nos temos unitários temos alguns tipos de cobertura (coverage) como:

- Cobertura de `linha`: indica a porcentagem de linhas de código que foram executadas durante a execução dos testes.
- Cobertura de `método`: indica a porcentagem de métodos que foram executados durante a execução dos testes.
- Cobertura de `branch`: indica a porcentagem de ramos de decisão (como `if`, `else`, `switch`) que foram executados durante a execução dos testes. Uma alta cobertura de branch indica que diferentes caminhos lógicos do código foram testados.

A seguinte estrutura é sempre recomendada para escrever testes unitários:

- `Given`: onde são definidos os dados de entrada e o cenário do teste.
- `When`: onde é executada a ação ou comportamento que está sendo testado.
- `Then`: onde são feitas as asserções para verificar se o resultado esperado foi alcançado.

Segue um exemplo em java:

```java
@Test
public void testCalculateTotalPrice() {
    // Given
    NinjaShoppingCart cart = new NinjaShoppingCart();
    cart.addItem(new Item("Kunai", 15.0));
    cart.addItem(new Item("Bandana da Vila de Konoha", 25.0));

    // When
    double totalPrice = cart.calculateTotalPrice();

    // Then
    assertEquals(40.0, totalPrice, 0.001);
}
```

Seguir essa estrutura garante que os testes sejam claros, organizados e fáceis de entender, facilitando a manutenção e a identificação de falhas no código.

### Mocks, Stubs e Fakes

Um outra boa prática é utilizar mocks, stubs e fakes para lidar com dependências externas, como bancos de dados, APIs ou serviços de terceiros, garantindo que os testes sejam independentes e possam ser executados isoladamente.

- **Mock**: usado para verificar interações
- **Stub**: retorna valores pré-definidos
- **Fake**: implementação simplificada para teste
- **Spy**: mistura comportamento real e simulado

Normalmente sua linguagem terá uma biblioteca específica para lidar com esses conceitos, como o Mockito para Java/Kotlin, o unittest.mock para Python, entre outros.

### Nomemclatura e legibilidade

Outra boa prática é utilizar uma nomenclatura clara e descritiva para os testes, garantindo que outros desenvolvedores possam entender facilmente o propósito do teste apenas lendo o nome do método de teste. Além disso, é importante manter os testes legíveis e organizados, utilizando boas práticas de formatação e estruturação do código.

``` java
// Exemplo de nomemclatura ruim
@Test
public void test1() {
    // código do teste
}

// Exemplo de nomemclatura boa
@Test
public void shouldCalculateTotalPriceWhenItemHasChakra() {
    // código do teste
}
```

## Cobertura não é qualidade

Mesmo que o código tenha uma boa cobertura de testes, isso não significa necessariamente que o código seja de qualidade. A cobertura é apenas uma métrica que indica a quantidade de código que foi testada, mas não garante que os testes sejam eficazes ou que o código esteja livre de bugs.

Exemplo: Um teste que executa uma linha sem validar corretamente o comportamento ainda conta para a cobertura, mas não garante qualidade. Cobertura é um indicador, não um objetivo final.

``` java
@Test
void shouldExecuteMethod() {
    service.process();
    assertTrue(true);
}
```

> Lembre-se sempre: Testes devem cobrir cenários reais, ou seja, devem ser escritos pensando em situações que podem ocorrer na vida real, garantindo que o código seja testado de forma abrangente e eficaz. Testar por testar apenas poluí o ambiente de desenvolvimento de dificulta análises futuras. Pense no teste como uma documentação viva do código, ele deve ser escrito para ajudar outros desenvolvedores (e IAs) a entenderem o comportamento do código e a identificar possíveis falhas.

## AGENTS.md

Outra dica que ajuda a manter o padrão de código e testes do time é utilizar arquivos de configuração, como o [AGENTS.md](https://agents.md/), nele é definido como a AI deve lidar com as situações apresentadas, seguindo um guide de boas práticas, como por exemplo:

- Sempre seguir a estrutura Given, When, Then para escrever testes unitários.
- Garantir que os testes sejam independentes e possam ser executados isoladamente.
- Manter os testes legíveis e fáceis de entender, utilizando nomes descritivos para os testes e as variáveis.

Também podem ser definidas as principais ferramentas utilizadas para escrever testes unitários, como o JUnit para Kotlin/Java, o pytest para Python, entre outros, e as melhores práticas para cada uma dessas ferramentas.

Exemplo de AGENTS.md para um time quen utiliza Kotlin e JUnit no dia a dia:

```markdown
# AGENTS.md

## Setup commands
- Install dependencies: `mvn clean install`
- Configure proxy variables if necessary: ​​`export http_proxy=http://proxy.example.com:8080` and `export https_proxy=http://proxy.example.com:8080`
- Configure the development environment: `export JAVA_HOME=/path/to/java` and `export PATH=$JAVA_HOME/bin:$PATH`

## Code style
- Use camelCase for variable and method names, and PascalCase for class names.
- Follow the standard Kotlin code conventions for formatting, including indentation, spacing, and line breaks.
- Use meaningful and descriptive names for variables, methods, and classes to enhance readability and maintainability

## Testing instructions
1. Always follow the Given, When, Then structure to ensure clarity and organization in tests.
2. Ensure that tests are independent, avoiding dependencies between them to facilitate isolated execution.
3. Keep tests readable and easy to understand, using descriptive names for tests and variables, facilitating maintenance and identification of code flaws.

## PR instructions
- Title format: [<project_name>] <Title>
- Description: Provide a clear and concise description of the changes made, including the purpose and any relevant details.
```

Para configurar o uso do AGENTS.md no IntelliJ IDEA, siga os passos abaixo (Esse processo pode variar dependendo da ferramenta que você utiliza, mas o importante é entender o método de configuração):

1. Selecione na aba do copilot a opção "Configure Agents":

![Configuração do Agent](/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/agent-configuration-intellij.png)

2. Nas configurações teremos a opção GitHub Copilot -> Customizations -> Copilot Instructions, é nessa parte que iremos configurar o AGENTS.md (nesse caso `copilot-instructions.md`) para o nosso projeto:

![Configuração de Copilot Instructions no GitHub Copilot](/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/agent-instructions-intellij.png)

3. Com o arquivo criado na pasta `.github` do projeto basta copiar o seu AGENTS.md para o `copilot-instructions.md` e salvar, com isso o GitHub Copilot irá utilizar as instruções definidas no AGENTS.md para gerar os testes unitários seguindo as boas práticas definidas no arquivo.

![Arquivo copilot-instructions.md criado na pasta .github](/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/copilot-instructions-created.png)

## Usando IAs para escrever testes unitários

Agora que vimos o que são testes unitários e a importância de manter um padrão de código, vamos falar sobre como usar IAs para escrever testes unitários.

As ferramentas que irei utilizar aqui são o IntelliJ IDEA e o GitHub Copilot, mas o importante é entender o método simples de escrever testes unitários utilizando IAs, que pode ser aplicado em outras ferramentas.

### Passo 1: Detalhar o cenários de teste (criar o prompt)

Essa é a etapa mais importante, definir quais são os requisitos da sua funcionalidade ou daquele pedaço de código que deseja testar.

Exemplo de prompt para um cenário de teste:

```
Você é um engenheiro de QA sênior especializado em testes unitários Java com expertise em sistemas distribuídos e Redis.

Analise a classe fornecida e gere uma suíte de testes unitários completa que atinja 95% de cobertura de linhas, branches e métodos.

Antes de executar a criação dos testes, forneça um plano detalhado de execução, incluindo:

- Identificação dos cenários de teste mais críticos com base na complexidade do código e nas dependências.
- Estratégia para lidar com dependências externas, como mocks ou stubs.
```

Com um prompt detalhado, a IA tem mais informações para gerar um teste unitário de qualidade, seguindo as melhores práticas e garantindo uma boa cobertura de código.

> Dica: Existem diversas ferramentas para auxiliar em escrever bons prompts, como por exemplo o [Prompt Cowboy](https://www.promptcowboy.ai/), sempre que estiver na dúvida utilize ele para melhorar a sua entrada para a IA

### Passo 2: Solicitar um plano de execução para a IA

Nesta etapa iremos utilizar o prompt criado no passo anterior para solicitar a IA um plano de execução para escrever os testes unitários, com isso a IA irá analisar o código e criar um plano detalhado de execução, identificando os cenários de teste mais críticos e a estratégia para lidar com dependências externas.

No IntelliJ IDEA, temos a opção de "Plan", com ela podemos solicitar para a IA um plano de execução detalhado, seguindo as melhores práticas definidas no AGENTS.md, para escrever os testes unitários.

![Opção 'Plan' selecionada na aba do GitHub Copilot do IntelliJ IDEA](/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/selected-plan-option.png)

Segue um exemplo de plano de execução gerado pela IA, nele temos todos os principais cenários de teste identificados:

![Exemplo de plano de execução detalhado gerado pela IA com cenários de teste identificados](/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/execution-plan.png)

Após validar o plano gerado podemos clicar na opção "`Start Implementation`" na própria IDE, lembrando que caso esteja em outra ferramenta basta responder a IA com um simples: "Pode implementar" ou caso tenha pontos de melhoria solicitar uma atualização do plano.

> Classe que foi utilizada para gerar o plano de execução: [RedisDistributedTokenBucket.kt](https://github.com/jjeanjacques10/rate-limit-hero-orders/blob/main/src/main/kotlin/com/myheroacademia/heroorders/service/RedisDistributedTokenBucket.kt)


### Passo 3: Solicitar a implementação do teste unitário

Com o plano de execução validado, podemos solicitar para a IA a implementação do teste unitário, seguindo o plano de execução gerado no passo anterior e as boas práticas definidas no `copilot-instructions.md` (AGENTS.md).

![Implementação do teste unitário sendo gerada pela IA no IntelliJ IDEA](/posts/images/2026-04-09-boas-praticas-na-escrita-de-testes-com-IA/test-execution.png)

Segue o exemplo de teste gerado: [RedisDistributedTokenBucketTest](https://github.com/jjeanjacques10/rate-limit-hero-orders/blob/feature/create-unit-tests/src/test/kotlin/com/myheroacademia/heroorders/service/RedisDistributedTokenBucketTest.kt)

``` java
@ExtendWith(MockitoExtension::class)
class RedisDistributedTokenBucketTest {

    @Mock
    private lateinit var redisTemplate: RedisTemplate<String, Any>

    @Mock
    private lateinit var valueOperations: ValueOperations<String, Any>

    private lateinit var tokenBucket: RedisDistributedTokenBucket

    @BeforeEach
    fun setUp() { // Criação correta dos mocks e configuração do comportamento esperado
        whenever(redisTemplate.opsForValue()).thenReturn(valueOperations)
        tokenBucket = RedisDistributedTokenBucket(redisTemplate)
    }

    @Test // Cenário criado com a estrutura Given, When, Then e seguindo as boas práticas definidas no AGENTS.md
    fun `Given no last refill key When tryConsume Then initialize bucket and consume token`() {
        // Given
        whenever(valueOperations.get("hero:orders:token_bucket:last_refill")).thenReturn(null)
        whenever(valueOperations.get("hero:orders:token_bucket")).thenReturn(10)
        whenever(valueOperations.decrement("hero:orders:token_bucket", 1L)).thenReturn(9L)
        whenever(redisTemplate.expire(eq("hero:orders:token_bucket"), any<Duration>())).thenReturn(true)
        whenever(redisTemplate.expire(eq("hero:orders:token_bucket:last_refill"), any<Duration>())).thenReturn(true)

        // When
        val consumed = tokenBucket.tryConsume()

        // Then
        assertTrue(consumed)
        verify(valueOperations).set("hero:orders:token_bucket", 10)
        verify(valueOperations).set(eq("hero:orders:token_bucket:last_refill"), any<Long>())
        verify(valueOperations).decrement("hero:orders:token_bucket", 1L)
        verify(redisTemplate, times(2)).expire(eq("hero:orders:token_bucket"), any<Duration>())
        verify(redisTemplate).expire(eq("hero:orders:token_bucket:last_refill"), any<Duration>())
    }
    
}
```

> Caso queira ver todo o Pull Request (fazer seu próprio code review) segue o link: [Pull Request com teste unitário gerado pela IA](https://github.com/jjeanjacques10/rate-limit-hero-orders/pull/2)


### Passo 4: Revisar o teste unitário gerado pela IA

Com o código gerado pela IA, vamos para uma das principais etapas como desenvolvedor nos dia atuais: Fazer o Code Review (Revisar código).

Os principais pontos que devem ser analisados são:

1. **Cenários cobertos**: Verificar se os principais cenários de teste foram cobertos, garantindo que o código esteja testado de forma abrangente e eficaz.
2. **Boas práticas**: Analisar se o teste unitário segue as boas práticas definidas no AGENTS.md, como a estrutura Given, When, Then, a independência dos testes e a legibilidade do código.
3. **Cobertura de código**: Verificar se a cobertura de código atingiu o percentual esperado, garantindo que o teste unitário esteja cobrindo as linhas, branches e métodos de forma adequada.
4. **Qualidade do código**: Analisar a qualidade do código gerado pela IA, verificando se ele é legível, organizado e fácil de entender, garantindo que outros desenvolvedores possam manter e evoluir o código no futuro.
5. **Validação dos resultados**: Verificar se as asserções feitas no teste unitário estão corretas e se os resultados esperados estão de acordo com o comportamento do código, garantindo que o teste esteja validando corretamente o código. (As vezes a IA alucina e faz o clássico `assertEquals(true, true)`)

## Conclusão

Uma aplicação bem testada evita diversos problemas produtivos, como bugs, falhas e retrabalho, além de garantir a qualidade do código e evitar retrabalho no futuro. Com o aumento no uso de IAs para auxiliar no desenvolvimento de software, ou até realizar todo o processo de desenvolvimento, uma das principais preocupações dos desenvolvedores será a qualidade do código gerado por essas IAs, e a melhor forma de garantir isso é utilizando boas práticas na escrita de testes.

Esse foi apenas o inicio, temos outros tipos de testes, como testes de integração, testes de aceitação, testes de performance que são importantes para garantir a qualidade do software e da entrega final.

Com isso, o desenvolvedor deve conhecer cada vez mais os fundamentos para não cair na armadilha de confiar cegamente na IA, e sim utilizar a IA como uma ferramenta para auxiliar no processo de desenvolvimento, mas sempre mantendo o controle e a responsabilidade sobre o código gerado.

## Referências

- [AGENTS.md](https://agents.md/)
- [Prompt Cowboy](https://www.promptcowboy.ai/)
- [JUnit](https://junit.org/junit5/)
- [Mockito](https://site.mockito.org/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)