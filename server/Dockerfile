FROM node:21-alpine AS base

FROM base AS builder
WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat python3

COPY package*json tsconfig.json src ./

RUN npm i && \
    npm run build && \
    npm prune --omit=dev

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

ARG FFMPEG_PATH=/usr/bin/ffmpeg
ARG FFPROBE_PATH=/usr/bin/ffprobe

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY package.json /app

ARG EXPORT_DIR=static
ARG DATA_DIR=tmp

RUN mkdir -p /app/${EXPORT_DIR} && chown -R hono:nodejs /app/${EXPORT_DIR}
RUN mkdir -p /app/${DATA_DIR} && chown -R hono:nodejs /app/${DATA_DIR}

USER hono
EXPOSE 3001

CMD ["npm", "run", "start"]
