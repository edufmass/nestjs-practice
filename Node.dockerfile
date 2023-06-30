# develop stage
FROM node:18.16.1-bullseye as dev-stage

EXPOSE 3000

#RUN apk --no-cache add python2
RUN apt clean && apt update && apt install python build-essential -y && npm i -g @nestjs/cli

WORKDIR /app
#ADD ./app /app
#RUN npm install --force
#RUN npm run dev