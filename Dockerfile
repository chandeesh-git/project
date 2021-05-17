FROM node:10-slim
WORKDIR /usr/src/app
COPY package*.json ./
COPY . ./
RUN apt-get update && apt-get install -y net-tools wget unzip \
    bash && \
    npm install && \
    npm -v && \
    npm install -g
ENV CI=true
EXPOSE 3000
CMD ["node", "app.js"]
