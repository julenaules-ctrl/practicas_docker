FROM node:24

RUN mkdir -p /home/app

COPY ./node /home/app

WORKDIR /home/app

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]