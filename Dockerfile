FROM oven/bun:1-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && apt-get clean

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate
RUN bun run build

FROM base AS runner
RUN useradd -m -u 1001 -s /bin/sh nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/docker-entrypoint.sh ./

RUN mkdir -p /app/data /home/ytt/photo/ip && chown -R nextjs:nextjs /app /home/ytt/photo/ip

USER nextjs
EXPOSE 3010
ENV PORT=3010
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/dev.db"

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
