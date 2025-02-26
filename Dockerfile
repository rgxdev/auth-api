FROM node:21
WORKDIR /usr/src
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 1407
CMD ["npm", "start"]