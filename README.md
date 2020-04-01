# Pré-requisitos


Este projeto está equipado com docker-compose, para utilizar instale-o.

Importe esta coleção de requests no Postman.

https://www.getpostman.com/collections/b8c3e7a715d1bbd77f53

Após clonar o projeto renomeie o arquivo **src/.env.example** para **src/.env** e adicione as chaves do pipedrive, bling e o as credenciais do banco de dados, estou usando o MongoDB Atlas (não execute com chaves de produção).

# Execução

Feito isso o projeto estará pronto para rodar com `docker-compose down; docker-compose up --build --remove-orphans` na raiz do repositório clonado.

Dando tudo certo, o projeto estará rodando com este endereço base: **http://localhost:8081/v1** e estes endpoints disponíveis:

- GET **/** : status
- GET **/deal** : lista de dados salvos
- POST **/deal** : sincroniza dados entre pipedrive e bling, salvando os dados intermediários na database **linkou** com o documento **deals**.
