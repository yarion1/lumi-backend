# Guia de Setup para Aplicação

## Requisitos

Antes de iniciar, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/): versão 14 ou superior
- [Docker](https://www.docker.com/): versão mais recente
- [Docker Compose](https://docs.docker.com/compose/): versão mais recente

## Setup Usando Docker (Recomendado)

### 1. Clone o Repositório

Primeiro, clone o repositório do projeto:

```sh
$ git clone https://github.com/yarion1/lumi-backend
$ cd lumi-backend
```

### 2. Construir e Rodar os Contêineres

Com o Docker, a configuração é simples. Basta rodar os seguintes comandos para construir e iniciar os contêineres:

```sh
$ docker-compose build
$ docker-compose up -d
```

### 3. Acessando a Aplicação

Após os contêineres serem iniciados com sucesso, a aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

> **Nota**: Todos os serviços necessários, incluindo o banco de dados, são gerenciados automaticamente pelos contêineres Docker.

---

## Setup Manual (Sem Docker)

### 1. Clone o Repositório

Primeiro, clone o repositório do projeto:

```sh
$ git clone https://github.com/yarion1/lumi-backend
$ cd lumi-backend
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

1. **Gerar o Arquivo `.env`**:

   Copie o arquivo `.env.example` para criar o seu arquivo `.env`:

   ```sh
   $ cp .env.example .env
   ```

2. **Configurar o Banco de Dados**:

   No arquivo `.env`, configure a variável `DATABASE_URL` com a URL do banco de dados. Certifique-se de que o banco de dados esteja acessível e corretamente configurado.

3. **Gerar o Cliente Prisma**:

   Rode o seguinte comando para gerar o cliente do Prisma:

   ```sh
   $ npx prisma generate
   ```

### 4. Migrações do Banco de Dados

Depois de configurar o banco de dados, aplique as migrações:

```sh
$ npx prisma migrate dev
```

Este comando aplicará as migrações e criará as tabelas no banco de dados.

### 5. Rodando a Aplicação em Desenvolvimento

Para rodar a aplicação localmente, utilize o comando abaixo:

```sh
# Usando npm
$ npm run dev

# Ou usando yarn
$ yarn dev
```

Isso iniciará o servidor e conectará ao banco de dados configurado. A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Resumo

- **Com Docker**: Clone o repositório e rode `docker-compose build` seguido de `docker-compose up -d` para ter a aplicação funcionando rapidamente.
- **Sem Docker**: Siga os passos de instalação das dependências, configuração do Prisma, e rode a aplicação com `npm run dev` ou `yarn dev`.

Este guia atualizado fornece um fluxo de trabalho mais claro e separado para quem quer usar Docker e para quem quer fazer a configuração manual, tornando a experiência de setup mais prática e direta.

