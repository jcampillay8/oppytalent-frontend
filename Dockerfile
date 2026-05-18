FROM node:22-alpine AS build

RUN npm install -g pnpm@11

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Colocamos el archivo original como template
COPY default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# MODIFICA ESTA LÍNEA (Le indicamos explícitamente qué variables cambiar antes de iniciar):
ENV ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
CMD ["sh", "-c", "envsubst '\$PORT \$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]