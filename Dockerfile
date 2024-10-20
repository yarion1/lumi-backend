FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

COPY .env.example .env

RUN npx prisma generate

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]
