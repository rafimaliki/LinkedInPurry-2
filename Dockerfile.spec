FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

COPY ./.env.example ./.env

ENV PORT=3000

EXPOSE 3000

CMD ["node", "index.js"]