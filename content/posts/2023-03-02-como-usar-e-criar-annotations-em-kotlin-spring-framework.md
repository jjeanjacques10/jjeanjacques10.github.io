---
title: "Como usar e criar Annotations em Kotlin — Spring Framework"
date: 2023-03-02
description: "Como usar e criar annotations customizadas em Kotlin com Spring Framework para simplificar validações e comportamentos transversais."
tags: ["Kotlin", "Spring Boot", "APIs", "Engenharia de Software"]
cover: "/posts/images/2023-03-02-como-usar-e-criar-annotations-em-kotlin-spring-framework/cover.png"
draft: false
---

## Como usar e criar Annotations em Kotlin — Spring Framework

### Este é um guia que crie para auxiliar na criação de annotations customizadas no Spring Framework utilizando Kotlin

Trabalhando com Spring, uma das primeiras coisas que se nota é a quantidade de annotations que precisamos utilizar. Sendo que elas têm a finalidade de fornecer informações adicionais tanto para o compilador quanto para o Spring Framework, indicando como lidar com determinadas classes, métodos ou propriedades.

Como exemplo temos o @Service, @Controller, @Component e dentre várias outras comumente utilizadas. Mesmo com um grande número de anotações disponíveis por padrão pode ser interessante criar a sua própria, nesse artigo vou explicar um pouco sobre como criar e utilizar anotações em Kotlin.

Repositório projeto de exemplo:

> Todos esses exemplos podem ser encontrados no seguinte repositório no GitHub: <https://github.com/jjeanjacques10/annotations-kotlin-spring-boot>

## Pondo a mão na massa 👨🏻‍💻

Para isso vamos criar uma nova aplicação Spring Boot para realizar o cadastro de livros. Vamos começar adicionando o seguinte controller, observe que estou utilizando o @Valid, essa annotation é utilizada para validar os dados de entrada de uma requisição, sem ela as próximas configurações na classe BookRequest não funcionarão.

```kotlin
import javax.validation.Valid

@RestController
class BookController {
  @PostMapping("/book")
    fun create(@Valid @RequestBody book: BookRequest): Map<String, Any?> {
        return mapOf(
            "status" to 200,
            "details" to "Book created - ".plus(book.title)
        )
    }
}
```

### Utilizando anotações de validação do Spring

Um dos usos mais comuns quando trabalhamos com API’s Rest é validar os dados de entrada enviados pelo usuário. Para isso podemos importar a lib javax.validation.constraints, nela temos várias anotações que podem ser utilizadas para validar os dados de entrada. A classe BookRequest representa os dados de entrada que serão enviados pelo usuário.

```kotlin
import javax.validation.constraints.NotBlank

data class BookRequest(
    @field:NotBlank
    val title: String? = ""
)
```

Nela temos o atributo title que possui acima dele o @NotBlank, essa annotation indica que o atributo não pode ser nulo e nem vazio. Temos diversas possibilidades quando utilizamos essa lib de validação, seguem as principais:

- @NotNull — Indica que o atributo não pode ser nulo
- @NotEmpty — Indica que o atributo não pode ser nulo ou vazio
- @NotBlank — Indica que o atributo não pode ser nulo ou vazio e não pode conter apenas espaços em branco
- @Size(min = 1, max = 10) — Indica que o atributo deve ter no mínimo 1 e no máximo 10 caracteres
- @Email — Indica que o atributo deve ser um email válido
- @Pattern(regexp = “^[a-zA-Z0–9]*$”) — Indica que o atributo deve seguir o padrão regex informado

> ❗ Importante: Passei um tempo quebrando a cabeça por não saber que no caso de validações em Kotlin precisamos utilizar o `@field:<annotation>` para que a anotação seja aplicada ao atributo

## Por baixo dos panos 🕵🏼‍♂️

Vamos olhar um pouco mais fundo para entender como que essa flag com @ na frente funciona. Quando utilizamos uma annotation em Kotlin estamos utilizando uma feature chamada reflection, que basicamente permite que o código acesse informações sobre si mesmo em tempo de execução. Com isso podemos acessar informações sobre classes, métodos, atributos e etc.

Se entrarmos em uma das anotações do Spring, como por exemplo a @NoEmpty, podemos ver que ela é uma interface que herda de @Constraint, @Target e @Retention.

```typescript
@Constraint(validatedBy = {})
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotEmpty {
    ...
}
```

> Existem mais anotações que compõe NotEmpty, mas para fins didáticos não vou entrar em detalhes.

@Target especifica os tipos possíveis de elementos que podem ser anotados. Os valores possíveis são:

- CLASS: Pode ser aplicada em classes, interfaces e enums.
- FUNCTION: Pode ser aplicada em funções e construtores.
- PROPERTY: Pode ser aplicada em propriedades de classes.
- FIELD: Pode ser aplicada em campos de classes.

@Retention especifica se a annotation é armazenada nos arquivos de classe compilados e se ela é visível por meio de reflection em tempo de execução (por padrão, ambas são verdadeiras). Existem três possíveis valores para essa propriedade:

- SOURCE: É descartada pelo compilador e não está presente no bytecode gerado.
- CLASS: É mantida no bytecode, mas não está disponível em tempo de execução.
- RUNTIME: É mantida no bytecode e também está disponível em tempo de execução.

Esse é o básico de como funcionam as configurações das principais annotations no Spring. Vamos agora ver como podemos criar nossas próprias aplicando esses conceitos.

## Criando uma annotation customizada

Mas não apenas do padrão vive o dev, às vezes nossos projetos pedem por comportamentos específicos que o framework não está apto a fornecer. Nesse caso podemos criar nossas próprias annotations, vamos então adicionar a validação se o gênero do livro é válidos.

Como comentado anteriormente, precisamos ter o @Target, que nesse caso será FIELD, pois queremos que apenas seja utilizada em atributos de classes. Também precisamos do @Retention, sendo ele definido como RUNTIME, já que esse tipo de validação é feita em tempo de execução. E por fim, a mais importante, a annotation @Constraint, nela que definimos a regra de validação que será utilizada.

```kotlin
import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@MustBeDocumented
@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [GenreValidator::class])
annotation class Genre(
    val message: String = "O gênero do livro é inválido",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
```

Definimos na annotation @Genre três parâmetros: message, groups e payload. O primeiro é a mensagem de erro que será exibida caso a validação falhe, o segundo é um array de classes que podem ser utilizadas para agrupar validações e o terceiro também um array de classes que podem ser utilizadas para definir payloads customizados. Vamos preencher apenas a mensagem de erro, pois os outros parâmetros não serão utilizados nesse exemplo.

```kotlin
enum class GenreType {
    FANTASY,
    SCI_FI,
    ROMANCE,
    MYSTERY,
    HORROR,
    THRILLER,
    NON_FICTION
}

class GenreValidator : ConstraintValidator<Genre, String> {
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) false
        return try {
            GenreType.valueOf(value!!)
            true
        } catch (e: IllegalArgumentException) {
            false
        }
    }
}
```

A lógica da constraint se encontra na classe GenreValidator, nela apenas verificamos se o valor do atributo está presente na lista de GenreType, caso não esteja ele retornará que esse valor é inválido. Agora vamos aplicar essa annotation na classe BookRequest.

```kotlin
data class BookRequest(
    @field:Genre
    val genre: String
)
```

### Testando a annotation customizada

Agora com nossas annotations criadas vamos testar se elas estão funcionando corretamente. Quando realizamos uma chamada na API com um gênero inválido o retorno será 422 Unprocessable Entity.

![Erro retornado pela API por conta do campo gênero ter sido enviado errado](/posts/images/2023-03-02-como-usar-e-criar-annotations-em-kotlin-spring-framework/image-2.png)

Também podemos retornar uma lista com diversos erros, como por exemplo, quando o título do livro é nulo e o gênero é inválido:

![Error retornado pela API por campos enviados serem inválidos](/posts/images/2023-03-02-como-usar-e-criar-annotations-em-kotlin-spring-framework/image-3.png)

Ao realizar a chamada na API com valores válidos o retorno será 200 OK, mostrando que o livro foi criado com sucesso.

![Mensagem de sucesso quando o livro foi cadastrado](/posts/images/2023-03-02-como-usar-e-criar-annotations-em-kotlin-spring-framework/image-4.png)

## Conclusão

Passei um bom tempo estudando sobre annotations no Spring para poder utilizar em um projeto, esse conteúdo é um resumo de tudo que pesquisei e consegui aplicar, espero que tenha lhe ajudado em sua jornada.

Caso tenha alguma crítica, sugestão ou dúvida fique a vontade para me enviar uma mensagem:

Até a próxima!

## Referências

Doc Kotlin Annotations <https://kotlinlang.org/docs/annotations.html>

Kotlin Spring validation not working <https://youtrack.jetbrains.com/issue/KT-50511/Kotlin-Spring-validation-not-working>
