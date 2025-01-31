FROM node:18-alpine as dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.23.3
EXPOSE 80
COPY --from=builder /app/dist/psr-ui/browser /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]