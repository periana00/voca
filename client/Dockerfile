FROM node:16.16.0-alpine3.16

WORKDIR /app
COPY package*.json .
RUN npm install
# ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start"]