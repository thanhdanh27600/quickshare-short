# Get NPM packages
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package.json .env ./
RUN npm install
# add sharp for image production
RUN npm install sharp
# Update IP Database
# ENV GEOLITE2_LICENSE_KEY ${GEOLITE2_LICENSE_KEY}
# RUN ./update_ip_db.sh


# Rebuild the source code only when needed
FROM dependencies AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM builder AS runner
WORKDIR /app

ENV NODE_ENV production

EXPOSE 3000
RUN node -v

CMD ["npm", "start"]
