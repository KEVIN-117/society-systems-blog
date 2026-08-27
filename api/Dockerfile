FROM node:22-alpine AS deps
# Install libvips for sharp compatibility and other build tools
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
WORKDIR /app
RUN npm install -g pnpm@11.15.1
RUN pnpm config set strict-dep-builds false
COPY package.json ./
RUN pnpm install

FROM node:22-alpine AS builder
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
WORKDIR /app
RUN npm install -g pnpm@11.15.1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache vips-dev bash
WORKDIR /app
RUN npm install -g pnpm@11.15.1
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database
EXPOSE 1337
CMD ["pnpm", "run", "start"]
