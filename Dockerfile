FROM node:21

# RUN apk update && apk upgrade --no-cache
# RUN apk add nano pup
RUN apt update && apt upgrade -y
RUN apt install jq pup -y

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN mkdir -p /crons

EXPOSE 8080

CMD [ "npm", "run", "dev" ]