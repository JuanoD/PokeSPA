FROM node:16

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY src/ ./src
COPY public/ ./public

CMD [ "npm", "run", "build" ]