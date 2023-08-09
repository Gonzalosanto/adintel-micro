Repositorio de Servicio Requestor

Este proyecto esta hecho en NodeJS + Express para crear un servicio ejecutable con endpoints a la escucha de eventos.
Por ahora solo escucha peticiones GET con query params especificas. Dicha funcionalidad esta pendiente de implementaciones.

Teniendo en cuenta que la version de Node utilizada para este proyecto es la version 18.17, se ejecuta en entornos cuyo SO sea Ubuntu 20.04 o superior, Windows 10 o superior, si no, se puede utilizar la version 16 de NodeJS para evitar incompatibilidades con el SO del entorno.


Los comandos para ejecutar este proyecto, una vez clonado el repositorio, son: 

npm install 

npm run dev (para ejecutar nodemon en modo development)

node app.js

Nota: Es importante setear variables de entorno de desarrollo en un archivo .env Las siguientes variables son vitales para el funcionamiento correcto:

BUNDLE_LIST = 'ruta del archivo con la lista de bundles'
DELIMITER = ';' o cualquier caracter separador del archivo CSV
MONGO_URL = 'URL de la DB'
MONGO_DB_NAME = 'Nombre de la DB en la cual alojaremos las colecciones de MongoDB'
AID = 'ID del advertiser del AdServer'
PORT = 8000 (Default port)
BASE_URL = http://s.adtelligent.com (AdServer BaseURL)