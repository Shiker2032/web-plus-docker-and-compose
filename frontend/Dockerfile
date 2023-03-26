FROM node:16-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci --audit=false
COPY . .
RUN npm run build

FROM nginx:1.16.0-alpine AS frontend
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]         