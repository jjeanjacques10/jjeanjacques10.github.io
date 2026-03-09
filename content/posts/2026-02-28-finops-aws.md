---
title: "FinOps na AWS: Como parar de gastar dinheiro sem precisar"
date: 2026-02-28
description: "Práticas de FinOps para otimizar custos na AWS sem sacrificar performance"
tags: ["aws", "finops", "cloud", "cost-optimization"]
categories: ["cloud", "platform-engineering"]
cover: "https://picsum.photos/seed/finops-aws/800/400"
draft: false
---

Você abriu o dashboard da AWS e viu uma conta de R$ 50.000 este mês. O seu coração parou. Sua conta não deveria passar de R$ 15.000. O que aconteceu?

Bem-vindo ao mundo real do **Cloud Cost Management**.

{{< sensei-note >}}
**FinOps** (Financial Operations) é a prática de trazer responsabilidade financeira para o modelo de gastos variável da nuvem. É a interseção entre finanças, tecnologia e negócio.
{{< /sensei-note >}}

## Os Três Pilares do FinOps

Como os **Três Grandes Ninjas** de Konoha, o FinOps tem três pilares fundamentais:

### 1. Inform (Visibilidade)

Você não pode otimizar o que não vê. O primeiro passo é ter **visibilidade total** dos seus gastos.

**Ferramentas AWS:**
- **AWS Cost Explorer**: Análise visual de custos
- **AWS Budgets**: Alertas de orçamento
- **Cost Allocation Tags**: Organização por projeto/time

```bash
# Listar recursos não tagueados
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values="" \
  --output table
```

{{< battle-pattern >}}
**Padrão: Tagging Strategy**

Toda sua infraestrutura deve ter tags obrigatórias:
- `Project`: Nome do projeto
- `Environment`: prod/staging/dev
- `Team`: Responsável pelo recurso
- `CostCenter`: Centro de custo para chargeback
{{< /battle-pattern >}}

### 2. Optimize (Otimização)

Com visibilidade, você identifica desperdícios. Os principais vilões:

#### EC2: Instâncias Superdimensionadas

Geralmente, instâncias EC2 operam com menos de **20% de CPU** na média. Use o **AWS Compute Optimizer** para receber recomendações de rightsizing.

```python
import boto3

compute_optimizer = boto3.client('compute-optimizer')

recommendations = compute_optimizer.get_ec2_instance_recommendations(
    instanceArns=['arn:aws:ec2:us-east-1:123456789:instance/i-001234']
)

for rec in recommendations['instanceRecommendations']:
    print(f"Current: {rec['currentInstanceType']}")
    print(f"Recommended: {rec['recommendationOptions'][0]['instanceType']}")
    print(f"Savings: {rec['recommendationOptions'][0]['estimatedMonthlySavings']}")
```

#### S3: Lifecycle Policies

Dados que não são acessados após 30 dias não precisam estar em S3 Standard.

```json
{
  "Rules": [
    {
      "ID": "MoveToIntelligentTiering",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "INTELLIGENT_TIERING"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

{{< technique >}}
**Técnica: Savings Plans**

Para workloads previsíveis, os **Savings Plans** oferecem até 72% de desconto em troca de um compromisso de uso por 1 ou 3 anos. Calcule pelo AWS Cost Explorer antes de comprar.
{{< /technique >}}

### 3. Operate (Cultura)

FinOps não é responsabilidade só do time de plataforma — é uma **cultura organizacional**.

**Práticas essenciais:**
- Weekly cost review com todos os times
- Custo como métrica de produto
- "You build it, you pay for it"
- Alertas de anomalias configurados

## Os 5 Maiores Desperdícios

| Desperdício | Solução | Economia Típica |
|-------------|---------|----------------|
| Instâncias paradas | AWS Instance Scheduler | 30-40% |
| Dados em S3 Standard antigos | Lifecycle policies | 60-80% |
| EC2 superdimensionados | Rightsizing | 20-40% |
| NAT Gateway data processing | VPC Endpoints | 15-25% |
| Snapshots antigos | Lifecycle Manager | 10-20% |

## Script de Auditoria Rápida

```python
#!/usr/bin/env python3
"""Script para auditoria rápida de custos AWS"""

import boto3
from datetime import datetime, timedelta

def get_top_services_cost(days=30):
    ce = boto3.client('cost-explorer')
    
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    response = ce.get_cost_and_usage(
        TimePeriod={'Start': start_date, 'End': end_date},
        Granularity='MONTHLY',
        Metrics=['BlendedCost'],
        GroupBy=[{'Type': 'DIMENSION', 'Key': 'SERVICE'}]
    )
    
    results = response['ResultsByTime'][0]['Groups']
    sorted_results = sorted(
        results, 
        key=lambda x: float(x['Metrics']['BlendedCost']['Amount']),
        reverse=True
    )
    
    print(f"\n{'Serviço':<40} {'Custo (USD)':<15}")
    print("-" * 55)
    for item in sorted_results[:10]:
        service = item['Keys'][0]
        cost = float(item['Metrics']['BlendedCost']['Amount'])
        print(f"{service:<40} ${cost:>10.2f}")

if __name__ == '__main__':
    get_top_services_cost()
```

## Conclusão

{{< sensei-note >}}
O objetivo do FinOps não é gastar menos — é **gastar melhor**. Cada real gasto na nuvem deve ter um propósito claro e mensurável para o negócio.
{{< /sensei-note >}}

FinOps é uma jornada contínua, não um projeto. Como o treinamento de um ninja, requer disciplina diária, revisão constante e a coragem de questionar decisões estabelecidas.

Comece hoje: ative o Cost Explorer, configure alertas de orçamento e reúna seu time para a primeira sessão de cost review.

---

*Série Cloud AWS: [Event Driven Architecture](/posts/2026-01-10-arquitetura-event-driven/) | [Kafka vs SQS](/posts/2026-02-05-kafka-vs-sqs/) | FinOps na AWS*
