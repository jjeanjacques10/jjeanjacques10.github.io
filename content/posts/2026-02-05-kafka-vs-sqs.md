---
title: "Kafka vs SQS: Qual escolher para sua missão?"
date: 2026-02-05
description: "Comparação detalhada entre Apache Kafka e Amazon SQS para sistemas de mensageria"
tags: ["kafka", "aws", "sqs", "distributed-systems", "messaging"]
categories: ["cloud", "software-engineering"]
cover: "https://picsum.photos/seed/kafka-sqs/800/400"
draft: false
---

**Kafka** ou **SQS**? É como escolher entre o **Susanoo** do Sasuke e o **Modo Sábio** do Naruto — ambos são poderosos, mas cada um serve a propósitos diferentes.

## O Contexto

Você está construindo um sistema de processamento de pedidos para uma fintech. Milhares de transações por segundo, múltiplos consumidores e a necessidade de replay de eventos. Qual ferramenta escolher?

{{< sensei-note >}}
Não existe resposta errada. A escolha correta depende das suas necessidades específicas: volume, latência, custo e complexidade operacional.
{{< /sensei-note >}}

## Apache Kafka: O Modo Seis Caminhos da Mensageria

O Kafka foi criado pela LinkedIn em 2011 para processar **bilhões de eventos por dia**. É um log distribuído imutável — uma vez que um evento é escrito, ele permanece lá pelo tempo configurado.

### Características

```
Kafka
├── Throughput: Milhões de msgs/segundo
├── Latência: ~10ms
├── Retenção: Configurável (dias/semanas/forever)
├── Replay: ✅ Sim
├── Ordenação: Por partição
└── Gerenciamento: Alto (você opera o cluster)
```

### Quando usar Kafka?

{{< battle-pattern >}}
**Padrão: Event Streaming**

Use Kafka quando você precisa de:
- **Alto throughput** (> 100k msgs/segundo)
- **Replay de eventos** (auditoria, reprocessamento)
- **Múltiplos consumidores** lendo o mesmo stream
- **Retenção longa** dos dados
{{< /battle-pattern >}}

**Exemplo prático:**
```python
from confluent_kafka import Producer

producer = Producer({'bootstrap.servers': 'kafka:9092'})

def send_transaction(transaction: dict):
    producer.produce(
        topic='transactions',
        key=transaction['id'],
        value=json.dumps(transaction)
    )
    producer.flush()
```

## Amazon SQS: O Clone Sombra da Nuvem

O SQS é um serviço gerenciado da AWS. Você **não opera nada** — a AWS cuida de tudo. É o clone sombra perfeito: aparece quando você precisa e some depois.

### Características

```
SQS
├── Throughput: ~3.000 msgs/segundo (Standard)
├── Latência: ~1-2 segundos (polling)
├── Retenção: Máximo 14 dias
├── Replay: ❌ Após consumo, mensagem é deletada
├── Ordenação: Somente FIFO (custo extra)
└── Gerenciamento: Zero (serverless)
```

### Quando usar SQS?

{{< technique >}}
**Técnica: Decoupled Microservices**

SQS é ideal para desacoplar microserviços quando:
- O throughput é moderado (< 3k msgs/segundo)
- Você quer **zero gestão** de infraestrutura
- O custo é uma preocupação (paga por mensagem)
- Integração nativa com outros serviços AWS (Lambda, EC2, ECS)
{{< /technique >}}

**Exemplo com Lambda + SQS:**
```yaml
# serverless.yml
functions:
  processOrder:
    handler: handler.processOrder
    events:
      - sqs:
          arn: !GetAtt OrderQueue.Arn
          batchSize: 10
```

## Comparação Direta

| Critério | Kafka | SQS |
|----------|-------|-----|
| Throughput | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Facilidade de uso | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Custo (alto volume) | ⭐⭐⭐⭐ | ⭐⭐ |
| Replay | ✅ | ❌ |
| Managed | ❌ (ou MSK $$$) | ✅ |
| Ecossistema AWS | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## A Decisão

```
Se throughput > 100k msgs/s          → Kafka
Se você precisa de replay            → Kafka
Se você está 100% na AWS             → SQS / SNS
Se você quer zero infra              → SQS
Se startup / pequena escala          → SQS
Se auditoria e compliance fortes     → Kafka
```

{{< sensei-note >}}
**Dica do mestre:** Para muitas startups, começar com SQS é a decisão certa. Kafka adiciona complexidade operacional significativa. Só migre quando os problemas de escala realmente aparecerem.
{{< /sensei-note >}}

## Conclusão

Kafka é o **Madara Uchiha** da mensageria — absurdamente poderoso, mas requer experiência e dedicação para dominar. SQS é o **Naruto do anime** — acessível, confiável e integrado ao ecossistema (AWS).

Escolha a ferramenta que resolve o problema de hoje sem criar os problemas de amanhã.

---

*Próximo artigo: FinOps na AWS — como parar de gastar dinheiro sem precisar.*
