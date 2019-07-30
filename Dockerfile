FROM node:10.16.0
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:10.16.0-alpine
WORKDIR /app
COPY build package.json ./
COPY --from=0 /app/node_modules ./node_modules
CMD ["yarn", "prod:start"]
