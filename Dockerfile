FROM node:21-slim

# RUN apk update && apk upgrade --no-cache
# RUN apk add nano pup
RUN apt update && apt upgrade -y
RUN apt install jq pup iputils-ping curl -y
#RUN apt install jq pup golang -y

#RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
#RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -y
#RUN cargo install websocat -y
#RUN apt install amqp-tools -y

#RUN apt install python3-pip -y
# RUN pip3 install --upgrade pip -y
# RUN pip3 install pika -y

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN mkdir -p /crons

EXPOSE 8080

CMD [ "npm", "run", "dev" ]