FROM node

LABEL maintainer "Viktor Adam <rycus86@gmail.com>"

WORKDIR /app

ADD package.json /app/package.json

RUN npm install && npm install pm2 -g

ARG username
ARG password
ARG android_id

ENV GOOGLE_USERNAME=$username
ENV GOOGLE_PASSWORD=$password
ENV ANDROID_ID=$android_id

ADD index.js /app/index.js
ADD test /app/test

RUN npm test

CMD [ "pm2-docker", "index.js" ]
