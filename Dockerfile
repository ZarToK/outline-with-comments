ARG APP_PATH=/opt/outline
FROM node:16.14.2-alpine3.15 AS deps

ARG APP_PATH
WORKDIR $APP_PATH
COPY . .

ENV NODE_ENV production

RUN yarn install --pure-lockfile --network-timeout 1000000 && \
  yarn cache clean

RUN yarn build

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001 && \
  chown -R nodejs:nodejs $APP_PATH/build

USER nodejs

EXPOSE 3000
CMD ["yarn", "start"]
