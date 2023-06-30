# develop stage
FROM node:18.16.1-bullseye as dev-stage

ARG user
ARG uid
ARG gid

EXPOSE 3000

RUN apt clean && apt update && apt install python build-essential -y && npm i -g @nestjs/cli

USER $user

WORKDIR /app