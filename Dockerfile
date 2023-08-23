FROM node:18

WORKDIR /loa-stat
COPY ./package.json /loa-stat
COPY ./package-lock.json /loa-stat
RUN npm install

COPY . /loa-stat

CMD npm run start