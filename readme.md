# Guia de Setup para Aplicação

## Requisitos

Antes de iniciar, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/): versão 14 ou superior
- [Docker](https://www.docker.com/): versão mais recente
- [Docker Compose](https://docs.docker.com/compose/)

## Passo a Passo para o Setup

### 1. Clone o Repositório

Primeiro, clone o repositório do projeto:

```sh
$ git clone <[URL_DO_REPOSITORIO](https://github.com/yarion1/lumi-backend)>
$ cd <lumi-backend>
```

### 2. Instale as Dependências

Instale as dependências do Node.js usando npm ou yarn:

```sh
# Usando npm
$ npm install

# Ou usando yarn
$ yarn install
```

### 3. Configuração do Prisma

1. **Gerar o arquivo `.env`**:

   Copie o arquivo `.env.example` para criar o seu arquivo `.env`:

   ```sh
   $ cp .env.example .env
   ```

2. **Configurar o Banco de Dados**:

   No arquivo `.env`, configure a variável `DATABASE_URL` com a URL do banco de dados. Se você estiver usando Docker, certifique-se de que o banco de dados está sendo configurado para ser acessível através do Docker.

3. **Gerar o Cliente Prisma**:

   Rode o seguinte comando para gerar o cliente do Prisma:

   ```sh
   $ npx prisma generate
   ```

### 4. Configuração do Docker

Para rodar a aplicação em um ambiente Docker, siga os passos abaixo.

1. **Verifique o `docker-compose.yml`**:

   O projeto deve conter um arquivo `docker-compose.yml`. Certifique-se de que ele está configurado corretamente para a sua aplicação e banco de dados.

2. **Construir e Rodar os Contêineres**:

   Execute o seguinte comando para construir e rodar os contêineres:

   ```sh
   $ docker-compose up --build
   ```

   Isso criará e iniciará os contêineres para a aplicação e o banco de dados.

### 5. Migrações do Banco de Dados

Depois de rodar o Docker, você precisará aplicar as migrações do banco de dados:

```sh
$ npx prisma migrate dev
```

Este comando aplicará as migrações e criará as tabelas no banco de dados.

### 6. Acessando a Aplicação

Após os contêineres serem iniciados com sucesso, a aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### 7. Rodando em Desenvolvimento

Caso deseje rodar a aplicação localmente, sem Docker, utilize o comando abaixo:

```sh
$ npm run dev
```

ou

```sh
$ yarn dev
```

Isso iniciará o servidor Express e conectará ao banco de dados configurado.



