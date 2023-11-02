# Repositorio de Servicio Requestor

Este proyecto esta hecho en NodeJS + Express para crear un servicio ejecutable con endpoints a la escucha de eventos.
Por ahora solo escucha peticiones GET con query params especificas. Dicha funcionalidad esta pendiente de implementaciones.

Teniendo en cuenta que la version de Node utilizada para este proyecto es la version 18.17, se ejecuta en entornos cuyo SO sea Ubuntu 20.04 o superior, Windows 10 o superior, si no, se puede utilizar la version 16 de NodeJS para evitar incompatibilidades con el SO del entorno.


Los comandos para ejecutar este proyecto, una vez clonado el repositorio, son: 
```
npm install 

node app.js
```
Comando opcional para ejecutar el proyecto con deteccion de cambios en los archivos -> `npm run dev `

Nota: Tener instalado Nodemon globalmente para poder ejecutar el script: ` npm run dev `

Nota: Es importante setear variables de entorno de desarrollo en un archivo .env.

Las siguientes variables son vitales para el funcionamiento correcto:
```
ID = 'ID del advertiser del AdServer'
PORT = 8000 (Default port)
BASE_URL = (AdServer BaseURL)
```
