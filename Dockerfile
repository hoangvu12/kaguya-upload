
# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 kaguya
RUN adduser --system --uid 1001 web

# Grant sudo permissions to the "web" user
RUN echo "web ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Add the "web" user to the "kaguya" group
RUN adduser web kaguya

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=kaguya:web /app/.next/standalone ./
COPY --from=builder --chown=kaguya:web /app/.next/static ./.next/static

USER web

EXPOSE 3000

CMD ["node", "server.js"]