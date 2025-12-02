FROM node:25
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
