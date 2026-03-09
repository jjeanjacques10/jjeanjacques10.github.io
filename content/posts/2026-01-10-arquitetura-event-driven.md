---
title: "Event Driven Architecture explicado com Naruto"
date: 2026-01-10
description: "Como sistemas distribuídos funcionam usando analogias de Naruto"
tags: ["architecture", "distributed-systems", "event-driven"]
categories: ["software-engineering"]
cover: "https://picsum.photos/seed/event-driven/800/400"
draft: false
---

Imagina que você é o **Hokage de Konoha** e precisa coordenar centenas de ninjas ao mesmo tempo. Como você faz isso sem criar um caos total? É exatamente assim que funciona uma **Event Driven Architecture (EDA)**.

## O Problema

Em sistemas tradicionais (síncronos), cada componente precisa aguardar uma resposta antes de continuar. É como o Naruto esperando o Kakashi terminar de ler o relatório antes de sair para a missão. Funciona, mas não escala.

## A Solução: Mensagens como Jutsus

{{< sensei-note >}}
Em uma arquitetura event-driven, os serviços se comunicam através de **eventos** — mensagens assíncronas que carregam informações sobre algo que aconteceu no sistema.
{{< /sensei-note >}}

Pensa assim: quando o Naruto usa o **Rasengan**, ele não espera o inimigo reagir para decidir o próximo passo. Ele age, e as consequências se propagam pelo campo de batalha.

## Os Componentes

### Producer (O Ninja que age)

O **producer** é o serviço que gera o evento. No nosso exemplo, é o checkout de um e-commerce que emite um evento `OrderPlaced`:

```json
{
  "eventType": "OrderPlaced",
  "orderId": "ORD-001",
  "customerId": "USR-42",
  "timestamp": "2026-01-10T10:00:00Z",
  "items": [
    { "productId": "P-001", "quantity": 2 }
  ]
}
```

### Event Bus (A Vila)

O **event bus** (Kafka, SQS, SNS) é a infraestrutura que recebe e distribui os eventos. É como a central de comunicações de Konoha — recebe todas as mensagens e entrega para quem precisa.

### Consumers (Os outros ninjas)

Os **consumers** são os serviços que reagem aos eventos:
- Serviço de estoque: atualiza o inventário
- Serviço de notificação: envia e-mail para o cliente
- Serviço de cobrança: processa o pagamento

{{< battle-pattern >}}
**Padrão Observado:** Cada consumer é independente. Se o serviço de notificação cair, o pedido ainda é processado. Isso é **resiliência**.
{{< /battle-pattern >}}

## Benefícios

| Benefício | Analogia Naruto |
|-----------|----------------|
| Desacoplamento | Ninjas de clãs diferentes colaborando sem dependência direta |
| Escalabilidade | Multiplicar clones sombra conforme demanda |
| Resiliência | Sistema continua mesmo que um componente falhe |
| Auditoria | O Anbu registra tudo que acontece |

## Quando usar?

{{< technique >}}
**Técnica: Event Sourcing**

Armazene não apenas o estado atual, mas toda a sequência de eventos que levaram a esse estado. Como o scroll do Silêncio da Aldeia Oculta na Areia — cada jutsu registrado para a posteridade.
{{< /technique >}}

Use EDA quando:
- Serviços precisam reagir a ações de outros serviços
- Você precisa de alta escalabilidade
- O desacoplamento é mais importante que a consistência imediata

## Conclusão

Event Driven Architecture não é apenas um padrão técnico — é uma **filosofia de design**. Como os ninjas de Konoha, seus serviços devem ser autônomos, reativos e resilientes.

---

*Próximo artigo: Kafka vs SQS — qual escolher para sua missão?*
