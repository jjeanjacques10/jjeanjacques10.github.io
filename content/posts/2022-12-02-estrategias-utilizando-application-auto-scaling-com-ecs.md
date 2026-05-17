---
title: "Estratégias utilizando Application Auto Scaling com ECS"
date: 2022-12-02
description: "Estratégias de auto scaling para containers ECS: target tracking, step scaling e scheduled scaling para aplicações na AWS."
tags: ["AWS", "ECS", "Escalabilidade", "Arquitetura de Software"]
cover: "/posts/images/2022-12-02-estrategias-utilizando-application-auto-scaling-com-ecs/cover.png"
draft: false
---

## Estratégias utilizando Application Auto Scaling com ECS

### Como criar regras personalizadas com o Application Auto Scaling em aplicações AWS ECS utilizando CloudFormation

Uma das grandes vantagens de utilizarmos a AWS ou qualquer outro provedor de Cloud é a possibilidade de pagar apenas pelos recursos que utilizamos. Uma ferramenta extremamente útil para gerenciar estes recursos de forma eficiente, evitando gastos desnecessários, é o Auto Scaling ou dimensionamento automático. Esta funcionalidade permite aumentar ou diminuir de forma dinâmica a quantidade desejada de tasks (máquinas rodando) em serviços como o Amazon Elastic Computer Service (ECS). Dessa forma, garantimos que a quantidade de tasks esteja adequada às necessidades da aplicação, optimizando custos e também mantendo nosso serviço disponível mesmo com o aumento de demanda.

O Amazon ECS oferece diversas vantagens na hora de configurar estratégias de escalonamento. Podemos personalizar essas configurações de acordo com o tipo de serviço, como por exemplo aplicações de e-commerce no período de Black Friday ou aquelas com poucos acessos durante a noite, cenários que envolvem uma carga de trabalho variável.

Hoje vou apresentar algumas estratégias que podem ser úteis em seus projetos visando o escalonamento horizontal, replicando as máquinas ao invés de aumentar o tamanho delas.

> Lembrando que todos os códigos apresentados nesse artigo podem ser encontrados no seguinte repositório do GitHub: <https://github.com/jjeanjacques10/springboot-ecs-fargate>

### Como funciona o Application Auto Scaling

O AWS Application Auto Scaling é um serviço que permite escalar automaticamente seus recursos Amazon EC2, Amazon ECS, Amazon EKS, Amazon DynamoDB e Amazon Aurora em resposta à demanda de aplicativos em constante mudança.

![Fluxo de provisionamento de tasks em ECS](/posts/images/2022-12-02-estrategias-utilizando-application-auto-scaling-com-ecs/image-2.jpeg)

No exemplo acima temos o fluxo de Auto Scaling, para definir o recurso a ser dimensionado criamos um Scalable Target, que especifica a capacidade mínima e máxima desse recurso e também as políticas de dimensionamento dele, que determinam como o recurso aumenta ou diminui em resposta a mudanças na demanda. O serviço ECS (Digimon Service) está se comunicando o tempo inteiro com o CloudWatch e enviando métricas para os alarmes presentes nele que serão gerenciados pelo Application Auto Scaling e tem as regras definidas no Scaling Policy.

``` yml
ScalableTarget:
  Type: AWS::ApplicationAutoScaling::ScalableTarget
  DependsOn: Service
  Properties:
    MinCapacity: 2
    MaxCapacity: 6
    ResourceId: !Join
      - "/"
      - - service
        - !Ref EcsClusterName
        - !GetAtt Service.Name
    RoleARN: !GetAtt AutoScalingRole.Arn
    ScalableDimension: ecs:service:DesiredCount
    ServiceNamespace: ecs
```

Agora para especificar como e quando escalar precisamos do Scaling Policy, vamos seguir então para alguns exemplos, começando pelo mais comum de encontrar em aplicações…

### Uso de CPU ou Memória

Esse tipo de métrica utilizada no Scaling Policy é comum porque utiliza características de nossos serviços que dizem muito sobre o status atual da aplicação a nível de hardware. Nestes casos devemos definir um valor alvo a ser atingido (TargetValue) em qualquer uma das duas métricas, CPU ou memória RAM, e quando o valor é alcançado, como por exemplo 30% de uso da CPU, temos o aumento no número de tarefas rodando até o limite pré-estabelecido no Scalable Target. No caso do exemplo abaixo são no máximo 6 tasks e no mínimo 2 tasks.

![Visão do console AWS para o AutoScaling de 30% de uso da CPU](/posts/images/2022-12-02-estrategias-utilizando-application-auto-scaling-com-ecs/image-3.png)

``` yml
ScalingPolicy:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ScaleWithCPUUtilization
    PolicyType: TargetTrackingScaling
    ScalingTargetId: !Ref ScalableTarget
    TargetTrackingScalingPolicyConfiguration:
      PredefinedMetricSpecification:
        PredefinedMetricType: ECSServiceAverageCPUUtilization
      TargetValue: 30.0
```

Para trocar para o verificar 30% do uso de memória alteramos o PredefinedMetricType para “ECSServiceAverageMemoryUtilization”.

Esse tipo de métrica pode ser utilizado para qualquer serviço, mas existem alguns cenários que outros tipos de alarmes podem ser mais interessantes. Por exemplo, podemos aumentar o número de tarefas observando serviços externos como filas SQS e utilizar a métrica de…

### Quantidade de mensagens na fila

Quando trabalhamos com consumers a principal métrica utilizada é a quantidade de itens a serem processados, para isso podemos olhar para um SQS na AWS e de acordo com o aumento no número de mensagens antigas em uma fila disponibilizar mais tasks ou remover essa capacidade extra caso não tenha nada para ser processado.

Pondo a mão na massa vamos então vamos criar nossas Policies. Um ponto importante de saber é que podemos ter várias Policies, mas cada policy só pode ser dimensionada em uma única direção, por essa razão precisamos de duas neste caso.

``` yml
ScalingPolicySQSUp:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ScaleWithSQSUp
    PolicyType: StepScaling
    ScalingTargetId: !Ref ScalableTarget
    StepScalingPolicyConfiguration:
      AdjustmentType: ChangeInCapacity
      Cooldown: 60
      MetricAggregationType: Average
      StepAdjustments:
        - MetricIntervalLowerBound: 0
           MetricIntervalUpperBound: 100
           ScalingAdjustment: 1
        - MetricIntervalLowerBound: 100
           ScalingAdjustment: 2
```

A primeira é referente ao UpScaling, nela será adicionado 1 contêiner quando a fila estiver entre 1000 e 1100, mas adicionará 2 quando houverem mais itens. Agora para diminuir o número de tasks quando cair a demanda criamos outra Policy com valores negativos, nesse caso quando estiver entre 900 e 999 itens será removida 1 task.

``` yml
ScalingPolicySQSDown:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ScaleWithSQSDown
    PolicyType: StepScaling
    ScalingTargetId: !Ref ScalableTarget
    StepScalingPolicyConfiguration:
      AdjustmentType: ChangeInCapacity
      Cooldown: 300
      MetricAggregationType: Average
      StepAdjustments:
        - MetricIntervalUpperBound: 0
          ScalingAdjustment: -1
```

Criadas as ações vamos agora configurar os alarmes no CloudWatch do tipo ApproximateNumberOfMessagesVisible. Vamos precisa de dois alarmes o primeiro é para que quando a fila “digimon-queue” atingir 1000 mensagens, nesse momento a Action de “ScalingPolicySQSUp” será ativada para aumentar a capacidade. O segundo é para nos alertar de quando esse valor diminuir e assim sermos capazes de diminuir o número de tasks ativando a Action “ScalingPolicySQSDown”.

``` yml
# Use SQS Queue to scale up
CloudWatchSQSAlarmScalingUp:
  Type: "AWS::CloudWatch::Alarm"
  Properties:
    AlarmName: "Alarm SQS Up"
    AlarmDescription: "Alarm if our SQS queue is higher than usual."
    Namespace: AWS/SQS
    EvaluationPeriods: 2
    Statistic: Average
    MetricName: ApproximateNumberOfMessagesVisible
    ComparisonOperator: GreaterThanThreshold
    Period: 60
    Dimensions:
      - Name: QueueName
        Value: digimon-queue
    Threshold: 1000
    AlarmActions:
      - !Ref ScalingPolicySQSUp

# Use SQS Queue to scale down
CloudWatchSQSAlarmScalingDown:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: "Alarm SQS Down"
      AlarmDescription: "Alarm if our SQS queue is smaller than usual."
      Namespace: AWS/SQS
      EvaluationPeriods: 1
      Statistic: Average
      MetricName: ApproximateNumberOfMessagesVisible
      Threshold: !Ref SqsMessagesVisibleThresholdScaleDown
      ComparisonOperator: LessThanOrEqualToThreshold
      Period: 60
      Dimensions:
        - Name: QueueName
          Value: digimon-queue
      Threshold: 1000
      AlarmActions:
      - !Ref ScalingPolicySQSDown
```

### Quantidade de chamadas

Quando se trabalha com API’s uma ótima métrica para utilizar é a de quantidade de chamadas recebidas, principalmente nos cenários onde já temos a quantidade de transações por segundo (TPS) mapeada. A criação das Scaling Policies é muito parecido com o de itens na fila, a maior diferença é o Alarme no CloudWatch que será utilizado aqui.

``` yml
ScalingPolicyTCPUp:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ScaleWithFlowCountTCPStepPolicyUp
    PolicyType: StepScaling
    ScalingTargetId: !Ref ScalableTarget
    StepScalingPolicyConfiguration:
      AdjustmentType: ChangeInCapacity
      Cooldown: 60
      MetricAggregationType: Average
      StepAdjustments:
        - MetricIntervalLowerBound: 0
          ScalingAdjustment: +1

ScalingPolicyTCPDown:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ScaleWithFlowCountTCPStepPolicyDown
    PolicyType: StepScaling
    ScalingTargetId: !Ref ScalableTarget
    StepScalingPolicyConfiguration:
      AdjustmentType: ChangeInCapacity
      Cooldown: 60
      MetricAggregationType: Average
      StepAdjustments:
        - MetricIntervalUpperBound: 0
          ScalingAdjustment: -1
```

Agora os alarmes que temos que criar são usados para monitorar as requisições recebidas e acionar um Grupo de Auto Scaling para aumentar ou diminuir com base no número de solicitações. O alarme compara o número de solicitações TCP nos últimos 60 segundos com o limite de 100 solicitações. Se o número de solicitações for maior que o limite, o alarme acionará ScalingPolicyTCPUp e caso seja menor acionará o ScalingPolicyTCPDown para dimensionar o Grupo de Auto Scaling de acordo com a regra pré-definida.

```yml
# Use Active flow count to scale up 
HighTpsAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: !Sub '${MicroServiceName} - High volume of requests'
    EvaluationPeriods: 1
    Threshold: 100
    ComparisonOperator: GreaterThanOrEqualToThreshold
    Period: 60
    Statistic: Sum
    MetricName: ActiveFlowCount
    Dimensions:
      - Name: LoadBalancer
        Value: !GetAtt LoadBalancer.LoadBalancerFullName
    Namespace: AWS/NetworkELB
    AlarmActions:
      - !Ref ScalingPolicyTCPUp

# Use Active flow count to scale down
LowTpsAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: !Sub '${MicroServiceName} - Low volume of requests'
    EvaluationPeriods: 1
    Threshold: 90
    ComparisonOperator: LessThanOrEqualToThreshold
    Period: 60
    Statistic: Sum
    MetricName: ActiveFlowCount
    Dimensions:
      - Name: LoadBalancer
        Value: !GetAtt LoadBalancer.LoadBalancerFullName
    Namespace: AWS/NetworkELB
    AlarmActions:
      - !Ref ScalingPolicyTCPDown
```

No momento em que o alarme é acionado, temos a ação sendo ativada, como demonstrado no exemplo abaixo, onde podemos observar o número de tarefas aumentando após diversas requisições.

![Visão do CloudWatch com alarm de HithTps sendo ativado.](/posts/images/2022-12-02-estrategias-utilizando-application-auto-scaling-com-ecs/image-4.png)

Para verificar se essa configuração está certa podemos acessar nosso serviço ECS e entrar na aba “Auto Scaling”. Nela são apresenados detalhes da nossa configuração, como as regras de escalonamento e a política de subida e descida. Se a configuração estiver correta, esses parâmetros serão exibidos de acordo com as configurações feitas.

![Visão do console AWS com as configurações na aba de Auto Scaling](/posts/images/2022-12-02-estrategias-utilizando-application-auto-scaling-com-ecs/image-5.png)

### Horário (CRON)

Também é possível gerencia a quantidade de tarefas rodando por meio de Schedules que identificam o horário definido para aumentar ou diminuir o número de tasks.

Para definir qual horário nossa ação deve rodar podemos utilizar o CRON, que é um utilitário normalmente utilizado em linha de comando para agendar ações a serem realizadas no sistema.

> Quando for configurar lembre-se que o tempo é em UTC, precisando então adicionar 3 horas (para quem está no Brasil)

Seguem um exemplo onde definimos que todo dia às 8h00 (11 UTC) iremos seguir uma regra de capacidade e a partir das 20h00 iremos parar todas as tarefas rodando.

``` yml
ScalableTarget:
  <...>
  ScheduledActions:
    - ScalableTargetAction:
        MinCapacity: 0
        MaxCapacity: 0
      Schedule: 'cron(0 0 22 ? * MON-FRI)'
      ScheduledActionName: scale-down
    - ScalableTargetAction:
        MinCapacity: 2
        MaxCapacity: 6
      Schedule: 'cron(0 0 10 ? * MON-FRI)'
      ScheduledActionName: scale-up
```

> Esta é uma excelente configuração para usar em ambientes de desenvolvimento ou teste, pois economiza recursos que normalmente não são usados em certos horários!

Com o Scaling Policy são diversas as possibilidades, aqui tem a documentação com todos os valores possíveis do campo PredefinedMetricSpecification. Lá temos alguns outros exemplos utilizando DynamoDB, conexões RDS, Storage Kafka e muito mais!

## Conclusão

Apresentei as principais estratégias de como utilizar Auto Scaling e suas aplicações, o ponto mais importante é entender o melhor cenários para utilizar cada uma delas. Muitas vezes, acabamos não monitorando a métrica certa, o que acarreta problemas para os nossos aplicativos.

Espero que esse conteúdo o tenha ajudado à entender melhor como implementar Auto Scaling em aplicações ECS na AWS!

Caso tenha alguma crítica, sugestão ou dúvida fique à vontade para me enviar uma mensagem:

Até a próxima!

## Referências

- AWS::ApplicationAutoScaling::ScalableTarget ScalableTargetAction — AWS CloudFormation (amazon.com)
- Programar expressões usando rate ou cron — AWS Lambda (amazon.com)
- aws-cloudformation-user-guide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.md at main · awsdocs/aws-cloudformation-user-guide (github.com)
- Auto Scaling Microservices on ECS | by Idan Lupinsky | The Startup | Medium
