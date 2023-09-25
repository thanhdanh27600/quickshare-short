# Get NPM packages
FROM oven/bun:latest AS dependencies
ARG NEXT_PUBLIC_SHORT_DOMAIN
WORKDIR /app
COPY package.json bun.lockb prisma .env ./
RUN bun install
# add sharp for image production
RUN bun install sharp
# Update IP Database
# ENV GEOLITE2_LICENSE_KEY ${GEOLITE2_LICENSE_KEY}
# RUN ./update_ip_db.sh


# Rebuild the source code only when needed
FROM dependencies AS builder
WORKDIR /app
COPY . .
RUN bun run build

# Production image, copy all the files and run next
FROM builder AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_SHORT_DOMAIN $NEXT_PUBLIC_SHORT_DOMAIN

EXPOSE 3000
RUN bun -v

CMD ["bun", "start"]
