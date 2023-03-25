FROM node:18 AS builder 
WORKDIR /app 
COPY package*.json .
RUN npm ci 
COPY . . 
RUN npm run build 

FROM node:18 AS frontend
RUN npm i serve -g
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD [ "serve", "-s", "build" ]
# CMD ["serve", "-s"]                                          