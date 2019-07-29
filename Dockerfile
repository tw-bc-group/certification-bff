FROM node:8.16
WORKDIR /app
COPY build package.json yarn.lock /app/
RUN yarn
CMD ["yarn", "prod:start"]
