<p align="center">
  <img src=" " alt="Logo de COSTITOSYA">
</p>

---

# COSTITOS

COSTITOS es una plataforma de cotizaciones donde los usuarios pueden cotizar productos que las tiendas ofrecen. Este proyecto es desarrollado para la matriz Coorporación DHYRIUM S.A.A.

## Requisitos Previos

- Node.js instalado en tu sistema.
- Servidor PostgreSQL configurado y en ejecución.

## Configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/arnaldomedina564/costitos_back.git
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
Copia .env.example a .env y completa las variables.
```

4. Crear base de datos PostgreSQL:

```bash
npx sequelize db:create
```

5. Ejecutar migraciones:

```bash
npx sequelize-cli db:migrate
```

6. Opcional: Ejecutar seeders:

```bash
npx sequelize-cli db:seed:all
```

## Uso

Una vez que hayas configurado el proyecto, puedes ejecutarlo con el siguiente comando:

```bash
npm run dev
```

Esto iniciará el servidor y podrás acceder a la plataforma desde tu navegador ingresando la URL correspondiente.

## Estructura del Proyecto

La estructura del proyecto es la siguiente:

```bash
costitos/
│
├── app/                    # Carpeta principal de la aplicación
│   ├── controllers/        # Controladores de la lógica de la aplicación
│   ├── db/                 # Configuración de la base de datos
│   │   ├── migrations/     # Migraciones de la base de datos
│   │   ├── models/         # Modelos de la base de datos
│   │   └── seeders/        # Datos iniciales de la base de datos
│   ├── middleware/         # Middleware de la aplicación
│   ├── models/             # Modelos de la aplicación
│   ├── routes/             # Rutas de la aplicación
│   └── validators/         # Validadores de la aplicación
│
├── config/                 # Configuraciones de la aplicación
│
├── utils/                  # Utilidades y funciones auxiliares
│
├── .env                    # Archivo de variables de entorno
│
├── app.js                  # Archivo principal de la aplicación
│
└── ...
```

## Contribuir

¡Si deseas contribuir a este proyecto, estaremos encantados de recibir tus aportes! Puedes hacerlo mediante pull requests.

## Licencia

Este proyecto es propiedad de Coorporación DHYRIUM S.A.A. y está desarrollado bajo su dirección y financiamiento. No se proporciona licencia para el uso o redistribución fuera del ámbito de la empresa.
