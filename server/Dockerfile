FROM node:21-alpine AS base

FROM base AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat python3
# RUN apk --no-cache --virtual build-dependencies add \

COPY package*json tsconfig.json src ./

RUN npm i && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY package.json /app

USER hono
EXPOSE 3001

CMD ["npm", "run", "start"]
