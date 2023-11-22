FROM node:16-alpine as builder
WORKDIR /app

RUN yarn global add @nestjs/cli
COPY package.json yarn.lock ./

RUN yarn install
COPY . .

RUN nest build abridge
RUN nest build polygon-listener
RUN nest build init-service


FROM node:16.13.2-alpine3.14 as executor
WORKDIR /app
COPY --from=builder /app .