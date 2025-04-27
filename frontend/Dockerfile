FROM node:20-alpine

WORKDIR /app

COPY ./vitejs ./ 

RUN npm install   

EXPOSE 5173      

CMD ["npm", "run", "dev-expose", "--", "--port", "5173", "--host", "0.0.0.0"]