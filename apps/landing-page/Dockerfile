FROM node:24.15-alpine AS base
RUN apk update && apk upgrade
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/landing-page/package.json ./apps/landing-page/
COPY apps/extension/package.json ./apps/extension/
RUN pnpm install --frozen-lockfile --filter @shrink/landing-page... --ignore-scripts

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/landing-page/node_modules ./apps/landing-page/node_modules
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/landing-page ./apps/landing-page
COPY apps/extension/package.json ./apps/extension/package.json
RUN pnpm --filter @shrink/landing-page build

FROM node:24.15-alpine AS runner
WORKDIR /app
COPY --from=build /app/apps/landing-page/.output ./.output
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
