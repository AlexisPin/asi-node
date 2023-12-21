FROM node:18-buster-slim AS builder

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm 

RUN pnpm i

COPY . .

RUN pnpm build && cd build && pnpm i -P

FROM node:18-buster-slim AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 runner
USER runner

COPY --from=builder --chown=runner:nodejs /app/build .

EXPOSE 3000

CMD ["node", "index.js"]
















