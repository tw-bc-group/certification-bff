FROM node:10-alpine
WORKDIR /app
COPY build package.json yarn.lock /app/
RUN apk add --no-cache make gcc g++ python git && \
  yarn install --production && \
  apk del make gcc g++ python git
CMD ["yarn", "prod:start"]
