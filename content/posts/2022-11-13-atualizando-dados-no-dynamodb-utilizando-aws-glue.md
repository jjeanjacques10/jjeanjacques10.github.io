---
title: "Atualizando dados no DynamoDB utilizando AWS Glue"
date: 2022-11-13
description: "Como usar AWS Glue com Python para atualizar dados em lote no DynamoDB de forma escalável e sem complexidade operacional."
tags: ["AWS", "DynamoDB", "Python", "Engenharia de Dados"]
categories: ["cloud"]
cover: "/posts/images/2022-11-13-atualizando-dados-no-dynamodb-utilizando-aws-glue/cover.png"
draft: false
---

## Atualizando dados no DynamoDB utilizando AWS Glue

### Uma forma simples de atualizar um grande número de registros no banco de dados não relacional utilizam a ferramenta AWS Glue

Quando trabalhamos com grandes massas de dados diversas abordagens surgem na mente para realizar atualizações em lotes. Contudo, nem sempre essas soluções são práticas e dependem de configuração de uma infraestrutura e da criação de aplicações completas para um job que deveria ser simples de se fazer, como popular um campo ou removê-lo.

Uma das ferramentas que podemos utilizar nesses casos é o AWS Glue, que é uma plataforma serverless de ETL (Extract, Transform, Load), orientada a eventos fornecida pela Amazon. É um serviço de computação que executa código em resposta à eventos e gerência automaticamente os recursos de computação exigidos por esse código.

> Todos os códigos apresentados nesse artigo podem ser encontrados no seguinte repositório do GitHub: <https://github.com/jjeanjacques10/update-dynamodb-glue>

### Cenário

Como exemplo temos essa tabela no DynamoDB onde apenas as informações de número e nome de nossos Pokémon estão cadastradas. Surgiu uma nova regra de negócio e nosso cliente precisa que sejam retornadas as categorias de cada Pokémon, para que assim não seja necessário buscar em fontes externas. Vamos então realizar esse processo de atualização para ele!

![Tabela de Pokémon no DynamoDB sem o campo de categoria](/posts/images/2022-11-13-atualizando-dados-no-dynamodb-utilizando-aws-glue/image-2.png)

Nesse exemplo temos 9 itens cadastrados (no total são 905 criaturinhas no mundo do anime), mas poderíamos ter terabytes de informação nesse tipo de base e realizar manualmente à atualização desses dados levaria muito tempo, sem falar que é necessário filtrar apenas os dados que precisam ser atualizados, assim evitando consumir recursos de forma desnecessária no DynamoDB, que é cobrado por capacidade de leitura e escrita.

## Criando AWS Glue ETL Job

### Adicionando as permissões

Para poder executar o script Glue é necessário ter uma Role com os acessos necessários, o primeiro é o Trusted Entity do tipo Service, onde iremos selecionar o serviço do Glue.

![Tela de cadastro de uma nova Role, selecionando o tipo AWS Service e Glue](/posts/images/2022-11-13-atualizando-dados-no-dynamodb-utilizando-aws-glue/image-3.png)

Com o arquivo de Role gerado sendo o seguinte:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "glue.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

Como iremos trabalhar com o DynamoDB teremos que adicionar a Policy que libera o acesso à esse banco de dados e também ao S3 que é onde o nosso arquivo script.py será armazenado.

![Policies selecionadas AmazonDynamoDBFullAccess e AmazonS3FullAccess](/posts/images/2022-11-13-atualizando-dados-no-dynamodb-utilizando-aws-glue/image-4.png)

> Você não precisa dar o FullAccess, a melhor prática é adicionar apenas as permissões necessárias, como por exemplo apenas leitura ou escrita.

Com a Role glue-pokemon-role criada e todas as permissões configuradas podemos ir para o desenvolvimento do script que vai fazer a mágica acontecer.

### Script

Então vamos para a criação do nosso PySpark Script. O primeiro ponto é realizar o setup onde é criado o contexto e a sessão que iremos utilizar quando esse script for executado. Também temos aqui as importações que serão necessárias mais para frente.

```python
import sys
import os
import requests
from awsglue.dynamicframe import DynamicFrame
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

# @params: [JOB_NAME]
args = getResolvedOptions(sys.argv, ['JOB_NAME'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
```

Após iniciar o job é feita a conexão com o banco de dados. Nele informamos qual o nome da tabela e os parâmetros de configuração para essa conexão.

``` python
TABLE_NAME = "tb_pokemons"

dyf = glueContext.create_dynamic_frame.from_options(
    connection_type="dynamodb",
    connection_options={
        "dynamodb.input.tableName": TABLE_NAME,
        "dynamodb.throughput.read.percent": "1.0",
        "dynamodb.splits": "100"
    }
)

print(f"Count Items: {dyf.count()}")
print("Items:")
dyf.show()
```

Nas últimas linhas apresentamos a quantidade de itens listados e podemos dar um dyf.show() para mostrar todos os itens encontrados. Caso tenham muitas linhas em sua tabela é desejável que comente esse comando para evitar custos indesejáveis no CloudWatch 😅.

Vamos filtrar apenas os registros que nos interessam, fazemos isso por meio da função filter. Na Lambda a seguir digo que quero apenas os registros que não possuem “category”.

``` python
filtered_dyf = dyf.filter(f=lambda x: "category" not in x)

print(f"Count Items without category: {filtered_dyf.count()}")
print("Items without category:")
filtered_dyf.show()
```

Dados filtrados, já sabemos onde atacar, para popular esse campo iremos utilizar a PokeAPI, que é um serviço gratuito onde podemos buscar informações sobre todos os Pokémon deste vasto universo. Na função buscamos pelo número do registro e então atualizamos a linha com o valor encontrado.

``` python
def add_category(row):
    url = f"https://pokeapi.co/api/v2/pokemon/{row['number']}"

    row["category"] = requests.get(url).json()["types"][0]["type"]["name"]
    return row

# Filter out the rows that no have category
updated_dyf = filtered_dyf.map(add_category)

# Show date filtered
updated_dyf.show()
```

DataFrame atualizado agora é a hora de enviar esses dados para a tabela tb_pokemons utilizando o mesmo glueContext passamos como parâmetro o frame igual ao nosso DF.

``` python
if filtered_dyf.count() < 1:
    print('There are no items to process')
    os._exit(0)
else:
    print('There are items to process')

    # Update the table
    new_data = DynamicFrame.fromDF(updated_dyf.toDF(), glueContext, "new_data")

    write_df = glueContext.write_dynamic_frame_from_options(
        frame=new_data,
        connection_type="dynamodb",
        connection_options={
            "dynamodb.output.tableName": TABLE_NAME,
            "dynamodb.throughput.write.percent": "1.0"
        },
        transformation_ctx="write_df"
    )

    job.commit()
```

### Resultado

Após rodar o script podemos verificar que os dados que faltavam de categoria agora estão inseridos na tabela!

![Tabela tb_pokemons com os registros atualizados possuindo categoria](/posts/images/2022-11-13-atualizando-dados-no-dynamodb-utilizando-aws-glue/image-5.png)

### Conclusão

A Amazon Web Services possuí diversos serviços que podem facilitar a nossa vida, normalmente o Glue é utilizado para trabalhos envolvendo Data Science ou engenharia de dados, trouxe para vocês um exemplo de como desenvolvedores podem utilizar essa ferramenta para resolver problemas do dia a dia.

Conseguimos realizar a atualizar em lote de forma fácil e rápida, sem precisar gerenciar uma arquitetura complexa como a criação de uma Lambda ou de uma aplicação apenas para isso. Essa prova de conceito serviu para mostrar o potencial de um script Python para evitar que utilizemos um canhão para matar uma formiga.

Caso tenha alguma crítica, sugestão ou dúvida fique à vontade para me enviar uma mensagem

Até a próxima!

## Referências

- AWS Glue
<https://aws.amazon.com/glue/>
- Connection types and options for ETL in AWS Glue
<https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect.html#aws-glue-programming-etl-connect-dynamodb>
- Update DynamoDB Glue GitHub
<https://github.com/jjeanjacques10/update-dynamodb-glue>
- PySpark Glue Tutorial
<https://github.com/johnny-chivers/pyspark-glue-tutorial>
- How to export an Amazon DynamoDB table to Amazon S3 using AWS Step Functions and AWS Glue
<https://aws.amazon.com/blogs/big-data/how-to-export-an-amazon-dynamodb-table-to-amazon-s3-using-aws-step-functions-and-aws-glue/>
