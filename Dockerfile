FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://dmwt:dmwtpassword@db:5432/dmwt_comments"

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "./scripts/start.sh"]