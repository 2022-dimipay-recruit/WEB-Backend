FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

VOLUME [ "/app/node_modules" ]

CMD ["npm", "run", "serve"]