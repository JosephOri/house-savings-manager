FROM node:24.11-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

