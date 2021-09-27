FROM node:16

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY src/ .
COPY public/ .

CMD [ "npm", "run", "build" ]