# Stage 1: Build the React frontend
FROM node:18-alpine AS client-build
WORKDIR /ticklr/client
COPY client/package*.json ./  
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Copy the user documentation build
FROM node:18-alpine AS docs-build
WORKDIR /ticklr/user_documentation
COPY user_documentation/package*.json ./
RUN npm install
COPY user_documentation/ ./
RUN npm run build

# Stage 3: Set up the Node.js backend with SQLite3
FROM node:18-alpine AS server
WORKDIR /ticklr/server
RUN apk update && apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite && \
    rm -rf /var/lib/apk/lists/*

# Copy package files
COPY server/package*.json ./  
RUN npm install
COPY server/ ./

# Rebuild sqlite3 package to ensure compatibility with the environment
RUN npm rebuild sqlite3 --unsafe-perm

# Stage 4: Final runtime image
FROM node:18-alpine

WORKDIR /ticklr
COPY --from=client-build /ticklr/client/dist ./client/dist
COPY --from=docs-build /ticklr/user_documentation/build ./user_documentation/build
COPY --from=server /ticklr/server ./server

EXPOSE 3000
CMD ["node", "server/server.js"]
