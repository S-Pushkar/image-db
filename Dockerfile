FROM node:18-alpine

RUN addgroup -S app && adduser -S app -G app

USER app:app

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]