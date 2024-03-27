FROM node:21-alpine AS base

FROM base AS builder
WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat python3

COPY package*json tsconfig.json src ./

RUN npm i && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY package.json /app

# initialize EXPORT_DIR
RUN mkdir -p static && chown -R hono:nodejs static

USER hono
EXPOSE 3001

CMD ["npm", "run", "start"]
