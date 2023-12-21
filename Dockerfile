FROM node:18-buster-slim AS builder
RUN mkdir -p /app

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm 

RUN pnpm i

COPY . .

RUN pnpm build

FROM node:18-buster-slim AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 runner
USER runner

COPY --from=builder --chown=runner:nodejs /app/build ./build

EXPOSE 3000

CMD ["node", "build/index.js"]
















