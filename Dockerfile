FROM node:10.15-alpine as base

RUN apk --no-cache --virtual build-dependencies add \
  python \
  make \
  g++ \
  && rm -f /var/cache/apk/* \
  && npm config set unsafe-perm true \
  && npm install --quiet node-gyp -g --cache /tmp/empty-cache

# builder #
FROM base AS builder

WORKDIR /app
ENV NODE_ENV=production
COPY ./package*.json .
COPY ./yarn.lock .
RUN yarn install && yarn cache clean
COPY . .

# production #
FROM node:10.15-alpine AS production
WORKDIR /app

## copy project
COPY --from=builder /app .
ENV NODE_ENV=production
CMD [ "yarn", "start:prod" ]

# development #
FROM base AS development

WORKDIR /app
ENV NODE_ENV=development