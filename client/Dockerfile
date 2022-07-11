FROM node:16.16.0-alpine3.16

WORKDIR /app
COPY package*.json ./
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
RUN npm install
# ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start"]