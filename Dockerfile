# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat ffmpeg g++ make py3-pip
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_KEY
ARG NEXT_PUBLIC_WEB_DOMAIN

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
ENV NEXT_PUBLIC_WEB_DOMAIN=$NEXT_PUBLIC_WEB_DOMAIN

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Add "kaguya" group and "web" user (no sudo needed)
RUN addgroup --system --gid 1001 kaguya \
    && adduser --system --uid 1001 upload

# Copy files and set appropriate ownership and permissions
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=upload:kaguya /app/.next/standalone ./
COPY --from=builder --chown=upload:kaguya /app/.next/static ./.next/static

# Grant read and write permissions to the "web" user and "kaguya" group
RUN chmod -R g+rwX ./public ./package.json ./.next

USER upload

EXPOSE 3000

CMD ["node", "server.js"]