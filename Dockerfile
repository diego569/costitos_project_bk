# Usa una imagen oficial de Node.js como imagen base
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del proyecto al contenedor
COPY . .

# Expone el puerto que utiliza la aplicación (ejemplo: 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
