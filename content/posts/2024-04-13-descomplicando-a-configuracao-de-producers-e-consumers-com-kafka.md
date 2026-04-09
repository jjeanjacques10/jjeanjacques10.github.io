---
title: "Descomplicando a Configuração de Producers e Consumers com Kafka"
date: 2024-04-13
description: ""
tags: ["Kafka", "Spring Boot", "Mensageria", "Sistemas Distribuídos"]
categories: ["platform-engineering"]
cover: "/posts/images/2024-04-13-descomplicando-a-configuracao-de-producers-e-consumers-com-kafka/cover.png"
draft: false
---

## Descomplicando a Configuração de Producers e Consumers com Kafka

Entendendo como configurar Producers e Consumers com Kafka de forma simples e descomplicada visando o que faz sentido para os seus projetos

Em algum momento pode ser que apareça uma tarefa em seu trabalho onde precise criar uma integração com o Kafka, quando você começa a desenvolver sua aplicação, criar sua lógica de negócio e então se de para com o arquivo cheio de parâmetros surgindo a pergunta: “Quais configurações devo fazer aqui que fazem sentido para o meu cenário?”.

É comum esse tipo de questionamento, kafka como uma ferramenta robusta nos oferece diversos recursos e configurações, e é importante entender como cada uma delas pode ser utilizada para atender as necessidades do seu projeto. Vamos entender um pouco mais sobre o Kafka e trazer exemplos práticos de como você pode preencher esses parâmetros da melhor forma sem precisar “chutar” o que pode ou não ser o melhor para o seu cenário.

## O que é o Kafka

Kafka é uma plataforma de streaming distribuída desenvolvida pelo LinkedIn em 2011 e posteriormente, foi doada para a Apache Software Foundation, que hoje cuida da ferramenta. Nasceu da necessidade de lidar com fluxos de dados em tempo real de forma escalável, durável e tolerante a falhas, tornando-se uma peça fundamental em arquiteturas modernas de processamento de dados com a capacidade de processar trilhões de mensagens por dia. Em exemplos reais, Kafka pode ser utilizado para:

- Streaming de Dados em tempo real
- Monitoramento e Alertas
- Processamento de Big Data
- Integração entre Microsserviços

### Tópicos

Tópicos são utilizados para organizar o fluxo de dados no Kafka, onde os registros são armazenados na sequência em que foram gerados, vamos entrar em detalhes mais a frente de como isso funciona. Por exemplo, uma aplicação de processamento de pagamentos pode ter tópicos como “transacoes-cartao”, “transacoes-boletos” e “transacoes-pix”, cada um representando um tipo diferente de transação financeira.

Tópicos vs Filas: Ao discutir tópicos no Kafka, muitas vezes surge a dúvida sobre a diferença entre eles e as filas. Em uma fila, as mensagens são consumidas sequencialmente por um único consumidor, garantindo o processamento FIFO (First In, First Out). Por outro lado, em um tópico, segue-se o modelo publish/subscribe, onde cada mensagem publicada é consumida por todos os consumidores registrados no tópico. Além disso, são utilizadas técnicas de particionamento para garantir a escalabilidade na leitura das mensagens pelos grupos de consumidores.

![Image](/posts/images/2024-04-13-descomplicando-a-configuracao-de-producers-e-consumers-com-kafka/image-2.png)

### Brokers

Os brokers no Kafka são os servidores encarregados de armazenar e gerenciar os dados dos tópicos. Cada broker é parte de um cluster Kafka e mantém uma cópia dos dados dos tópicos aos quais está atribuído. Eles são escaláveis e podem ser adicionados ou removidos do cluster conforme necessário para aumentar a capacidade ou a disponibilidade do sistema.

### Partições (Partitions)

Partições são segmentações que permitem dividir o tópico em frações menores; novas mensagens são adicionadas a uma partition.

Cada partição possui offsets, que são a identificação da mensagem dentro de uma partição específica, o que ajuda a saber a ordem em que foram recebidas e que devem ser processadas. Serem separadas por offsets facilita na hora de processar as mensagens, pois é possível configurar para que sejam lidas a partir de um offset específico, como em casos de reprocessamento, regras de negócio que precisem “voltar no tempo” para processar mensagens antigas ou onde queremos apenas ler mensagens de um determinado ponto.

Utilizar várias partições garante desempenho com grandes cargas de trabalho, aproveitando a replicação e a distribuição de carga entre os brokers. Por exemplo, se um tópico tiver 3 partições e 3 consumidores, cada consumidor lerá de uma partição diferente, garantindo que as mensagens sejam processadas de forma paralela.

![Image](/posts/images/2024-04-13-descomplicando-a-configuracao-de-producers-e-consumers-com-kafka/image-3.png)

### Avro

O Kafka transfere bytes de um local para outro, Avro é uma solução para garantir o contrato nessa comunicação. Ele é uma ferramenta de serialização/deserialização de dados que define o formato das mensagens que serão enviadas e recebidas. Além disso, ele permite definir esquemas para os dados transferidos, o que auxilia na garantia de que os dados sejam interpretados corretamente pelos consumidores, mesmo quando os esquemas evoluem ao longo do tempo.

Aqui está um exemplo de um esquema Avro que define um objeto chamado TransactionItem:

```json
{
  "type": "record",
  "name": "TransactionItem",
  "namespace": "com.payment",
  "fields": [
    {
      "name": "value",
      "type": "string"
    },
    {
      "name": "origin",
      "type": {
        "type": "record",
        "name": "Origin",
        "fields": [
          {
            "name": "account",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createdAt",
      "type": {
        "type": "string"
      }
    }
  ]
}
```

Importante lembrar que o Avro não é obrigatório, mas é uma boa prática utilizá-lo para garantir a compatibilidade entre as mensagens enviadas e recebidas.

Além dos exemplos mencionados anteriormente, existem muitas outras aplicações para essa ferramenta. Neste artigo, vamos nos concentrar na comunicação entre microsserviços. Nosso exemplo será um sistema de pagamentos que processa transações PIX e notifica os clientes quando tudo ocorrer com sucesso!

> Todos os exemplos apresentados neste artigo podem ser encontrados no seguinte repositório no GitHub: jjeanjacques10/payment-async-kafka: This is a payment system that utilizes Kafka technology for asynchronous integration

## Producer

O producer Kafka é responsável por gerar as mensagens e publicá-las nos tópicos. É possível ter diversos producers publicando mensagens em um mesmo tópico, e também é possível ter diversos producers publicando mensagens em tópicos diferentes. Para evitar de perder mensagens, lembre-se de configurar o “acks”, que define o número de replicas que devem confirmar o recebimento da mensagem, e também o “retries”, que define o número de tentativas que o producer deve realizar para enviar a mensagem.

Aqui está um exemplo de configuração para um produtor em Spring, onde as principais configurações estão relacionadas à forma como queremos enviar as mensagens.

```
spring:
  application.name: pix-processor
  kafka:
    producer:
      bootstrap-servers: localhost:9092
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: io.confluent.kafka.serializers.KafkaAvroSerializer
      compression-type: snappy # Configura o tipo de compressão que deve ser aplicado às mensagens
      acks: all # Configura o acks para "all" para garantir que todas as réplicas confirmem o recebimento da mensagem
      retries: 3 # Configura o número de tentativas que o producer deve realizar para enviar a mensagem
    template:
      default-topic: payment-topic
```

- bootstrap-servers: Define os endpoints utilizados para se conectar com o cluster Kafka. Ex: bootstrap-servers=kafka1:9092,kafka2:9092
- key-serializer: Classe responsável pela serialização das chaves das mensagens produzidas. Ex: key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
- value-serializer: Classe responsável pela serialização dos valores das mensagens produzidas, ele define o formato que os consumidores devem seguir. Ex: key-deserializer=io.confluent.kafka.serializers.KafkaAvroSerializer
- properties.schema.registry.url: URL do registro de esquemas utilizado para registrar e recuperar esquemas. Ex: schema.registry.url=<http://localhost:8082> (exemplo para configuração local)
- auto.register.schemas: Indica se os esquemas que ainda não existem devem ser registrados automaticamente no schema registry. Ex: auto.register.schemas=false
- retries: Número de tentativas que o produtor deve realizar para enviar a mensagem. Ex: retries=3

### acks

O “acks” é uma propriedade que define o número de réplicas que devem confirmar o recebimento da mensagem. Existem três valores possíveis para essa propriedade:

- 0: O produtor não aguarda nenhuma confirmação.
- 1: O produtor aguarda a confirmação do líder da partição.
- all: O produtor aguarda a confirmação de todas as réplicas da partição.

### value-serializer

Um dos pontos principais a serem configurados no produtor é o “value-serializer”, que define como os valores das mensagens serão serializados. No exemplo acima, o “value-serializer” está configurado como “io.confluent.kafka.serializers.KafkaAvroSerializer”, que é um serializador Avro.

- io.confluent.kafka.serializers.KafkaAvroDeserializer
- org.apache.kafka.common.serialization.StringSerializer
- org.apache.kafka.common.serialization.ByteArraySerializer

### compression-type

O “compression-type” é uma propriedade que define o tipo de compressão que deve ser aplicado às mensagens. Existem alguns tipos de compressão disponíveis, como:

- none: Sem compressão.
- gzip: Compressão GZIP.
- snappy: Compressão Snappy.
- lz4: Compressão LZ4.

## Consumer

Os consumidores são aqueles que se conectam aos nossos tópicos para ler as mensagens publicadas pelos produtores. É possível ter diversos consumers conectados a um tópico. Para evitar a leitura de mensagens repetidas, lembre-se de configurar o “group-id”, definindo que o novo consumidor faz parte de um grupo único e que realiza o mesmo processo e também realiza o “acknowledging” que remove a mensagem da fila para o grupo definido. É utilizado o offset para controlar a leitura das mensagens, garantindo que as mensagens sejam lidas apenas uma vez por aquele grupo consumidor (group-id).

Aqui está um exemplo de configuração para um consumidor em Spring, onde as principais configurações estão relacionadas à forma como queremos receber as mensagens e como elas devem ser tratadas.

```kotlin
spring:
  application.name: notification
  kafka:
    consumer:
      bootstrap-servers: localhost:9092
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: io.confluent.kafka.serializers.KafkaAvroDeserializer
      group-id: notification-payment-group
      properties:
        auto.offset.reset: earliest # ou 'latest'
    listener:
      ack-mode: MANUAL_IMMEDIATE
    template:
      default-topic: payment-topic
    properties:
      spring.deserializer.key.delegate.class: org.apache.kafka.common.serialization.StringDeserializer
      spring.deserializer.value.delegate.class: io.confluent.kafka.serializers.KafkaAvroDeserializer
      spring.deserializer.value.fail-on-unknown-type: false
      spring.deserializer.value.type: io.confluent.kafka.serializers.subject.RecordNameStrategy
      schema.registry.url: http://localhost:8082
      specific.avro.reader: true # Deserialize to the generated Avro class rather than a GenericRecord type
      auto.register.schemas: false # Whether schemas that do not yet exist should be registered
```

Existem tantas configurações que seria difícil descrevê-las todas neste artigo, então vou focar em algumas das propriedades que costumo adicionar em minhas configurações, busque entender o que faz mais sentido para o seu cenário.

- key-deserializer: Classe responsável pela desserialização das chaves das mensagens consumidas. Ex: key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
- value-deserializer: Classe responsável pela desserialização dos valores das mensagens consumidas. Ex: value-deserializer=io.confluent.kafka.serializers.KafkaAvroDeserializer
- group-id: Identificador do grupo de consumidores ao qual este consumidor pertence. Ex: group-id=pix-consumer-group
- properties.spring.deserializer.key.delegate.class: Classe delegada responsável pela desserialização das chaves das mensagens, utilizada para configurações específicas do Spring. Ex: spring.deserializer.key.delegate.class=org.apache.kafka.common.serialization.StringDeserializer
- properties.spring.deserializer.value.delegate.class: Classe delegada responsável pela desserialização dos valores das mensagens, utilizada para configurações específicas do Spring. Ex: spring.deserializer.value.delegate.class=io.confluent.kafka.serializers.KafkaAvroDeserializer
- properties.spring.deserializer.value.fail-on-unknown-type: Indica se deve falhar ao desserializar um tipo desconhecido. Pode auxiliar em cenários onde o esquema é desconhecido. Ex: spring.deserializer.value.fail-on-unknown-type=false
- properties.spring.deserializer.value.type: Estratégia para obter o nome do registro do esquema para um determinado valor, usado em conjunto com o Schema Registry. Ex: spring.deserializer.value.type=io.confluent.kafka.serializers.subject.RecordNameStrategy
- specific.avro.reader: Indica se a desserialização deve ser feita para a classe Avro gerada específica ou para o tipo GenericRecord. Ex: specific.avro.reader=true

### ack-mode

O “ack-mode” é uma propriedade que define como o consumidor deve confirmar o recebimento da mensagem. Existem três modos de confirmação:

- RECORD: Confirmação de registro por registro.
- BATCH: Confirmação de registros em lote.
- MANUAL: Confirmação manual.
- MANUAL_IMMEDIATE: Confirmação manual imediata.

No exemplo abaixo, o “ack-mode” está configurado para MANUAL_IMMEDIATE, ou seja, a confirmação é feita manualmente e imediatamente após o processamento da mensagem.

```json
try {
    log.info("Consume Kafka message - topic: {}, offset: {}, partition: {}", topic, offset, partition)
    notificationService.process(transactionItem.toTransaction())
} catch (
ex: `Exception) {`
    log.error("Error processing message: {}", ex.message, ex)
} finally {
    ack.acknowledge() // Confirmação manual sendo realizada
}
```

### consumer.properties.auto.offset.reset

No Kafka, as configurações “earliest” e “latest” são usadas para determinar onde o consumidor deve começar a consumir mensagens.

- earliest: Quando o deslocamento da partição não está presente (por exemplo, quando o grupo de consumidores está consumindo a partição pela primeira vez), o consumidor começará a consumir a partir do início da partição.
- latest: Quando o deslocamento da partição não está presente, o consumidor começará a consumir a partir do final da partição, ou seja, ele não consumirá nenhuma mensagem que já esteja na partição no momento em que começou a consumir.

## Boas práticas

É uma boa prática adiciona o log do offset e também a partition que está lendo, isso pode auxiliar na análise futura do problema de ambos os lados, tanto no consumer quanto no producer.

```kotlin
@KafkaListener(topics = ["payment-topic"], containerFactory = "kafkaListenerContainerFactory")
fun consumePayment(
    @Payload transaction: TransactionItem,
    @Header(KafkaHeaders.OFFSET) offset: Long,
    @Header(KafkaHeaders.RECEIVED_PARTITION) partition: Int?,
    @Header(KafkaHeaders.RECEIVED_TOPIC) topic: String?,
    ack: Acknowledgment
) {
    try {
        log.info("Consume Kafka message - topic: {}, offset: {}, partition: {}", topic, offset, partition)
    } catch (
      ex: `Exception) {`
        log.error("Error processing message: {}", ex.message, ex)
    } finally {
        ack.acknowledge()
    }
}
```

![Image](/posts/images/2024-04-13-descomplicando-a-configuracao-de-producers-e-consumers-com-kafka/image-4.png)

Outro ponto importante é a segurança, em ambientes produtivos é essencial proteger o cluster Kafka. Isso pode incluir autenticação, autorização, SSL/TLS, entre outros. Aqui está um exemplo de configuração para habilitar SSL/TLS:

```
spring.kafka.properties.security.protocol: SSL
spring.kafka.properties.ssl.truststore.location: /path/to/truststore
spring.kafka.properties.ssl.truststore.password: truststorePassword
spring.kafka.properties.ssl.keystore.location: /path/to/keystore
spring.kafka.properties.ssl.keystore.password: keystorePassword
```

Essas configurações devem ser ajustadas de acordo com as necessidades específicas do ambiente e da política de segurança da organização.

## Conclusão

Desde que comecei a aprender sobre mensageria e todas as possíveis aplicações percebi como é um tema vasto. Até focando apenas no Kafka já vemos como não é algo simples, sendo ele uma ferramenta robusta que pode ser utilizada para diversos cenários, desde streaming de dados até integração entre microsserviços. Neste artigo, vimos algumas das principais configurações que pode ser feitas em nossas aplicações, para ir mais além vá mais a fundo na documentação e realize testes dentro de casa.

A forma que mais aprendi sobre Kafka foi passando por problemas durante o desenvolvimento, e o que mais me auxiliou a resolver esses problemas foi entender melhor como a ferramenta funciona, por isso a introdução de conceitos básicos é essencial para quem está começando.

Espero que este artigo tenha sido último em sua jornada e que seja um ponto de partida para você começar a explorar cada vez mais o Kafka em seus projetos.

Fique a vontade para compartilhar tópicos que ache interessantes nos comentários!

Gostaria de agradecer ao Gustavo Santos Madeira por ter me apresentado estes conceitos sobre o Kafka me incentivado a ir mais a fundo nos estudos.

Caso tenha alguma crítica, sugestão ou dúvida fique a vontade para me enviar uma mensagem:

Até a próxima!

## Referências

- <https://kafka.apache.org/>
- org.springframework.kafka.listener (Spring for Apache Kafka 3.1.4 API)
- Avro Schema Serializer and Deserializer for Schema Registry | Confluent Documentation
- Kafka Schema Registry & Avro: Spring Boot Demo (2 of 2)
- Implementação de uma Fila e de um Tópico JMS
