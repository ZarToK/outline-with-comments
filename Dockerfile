ARG APP_PATH=/opt/outline
FROM node:16.14.2-alpine3.15 AS deps

ARG APP_PATH
WORKDIR $APP_PATH
COPY . .

RUN yarn install --network-timeout 1000000 && \
  yarn cache clean

RUN yarn build

# ---
ARG APP_PATH=/opt/outline
FROM outlinewiki/outline-base as base

ARG APP_PATH
WORKDIR $APP_PATH

# ---
FROM node:16.14.2-alpine3.15 AS runner

ARG APP_PATH
WORKDIR $APP_PATH
ENV NODE_ENV production

COPY --from=deps $APP_PATH/build ./build
COPY --from=deps $APP_PATH/server ./server
COPY --from=deps $APP_PATH/public ./public
COPY --from=deps $APP_PATH/.sequelizerc ./.sequelizerc
COPY --from=deps $APP_PATH/node_modules ./node_modules
COPY --from=deps $APP_PATH/package.json ./package.json

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001 && \
  chown -R nodejs:nodejs $APP_PATH/build

USER nodejs

EXPOSE 3000
CMD ["yarn", "start"]
