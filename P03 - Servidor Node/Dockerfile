FROM node:24

RUN mkdir -p /home/app

WORKDIR /home/app

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copiar los archivos de dependencias
COPY ./node /home/app

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del proyecto
#COPY . .

EXPOSE 3000

# Ejecutar la aplicación con nodemon
CMD ["nodemon", "index.js"]