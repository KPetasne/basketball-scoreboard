# Etapa 1: build de React
FROM node:18 as build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# Etapa 2: backend + frontend build
FROM node:18
WORKDIR /app

# Backend - copiar package.json y instalar dependencias
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Ahora sí, copiar el resto del backend SIN pisar node_modules
COPY backend/. .

# Volver a raíz de /app
WORKDIR /app

# Copiar el build del frontend al directorio raíz
COPY --from=build-frontend /app/frontend/build ./build

# Variables de entorno (opcional)
ENV PORT=3000

EXPOSE 3000

# Iniciar backend
CMD ["node", "backend/app.js"]
