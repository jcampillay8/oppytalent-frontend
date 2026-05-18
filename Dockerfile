FROM node:22-alpine AS build

RUN npm install -g pnpm@11

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# CAMBIA TU LÍNEA FINAL A ESTA SINTAXIS SIMPLE:
CMD envsubst '$PORT $BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'