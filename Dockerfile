FROM node:18

WORKDIR /app

RUN npm install -g serve

COPY dist ./dist

CMD ["serve", "-s", "dist", "-l", "3000"]