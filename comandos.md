# Práctica 01: Servidor HTML con Docker

## Paso 1: Descargar la imagen del servidor web

Descargo la imagen `nginx:alpine` par el servidor web
docker pull nginx:alpine


## Paso 2: Prueba rápida del contenedor con Run

Creo un contenedor temporal (lo elimino al pararlo con --rm) y pongo el puerto 80 del contenedor en el 8080 del host
docker run --rm -p 8080:80 nginx:alpine

En otra terminal, compruebo con curl y con firefox en `http://localhost:8080`:
curl http://localhost:8080


## Paso 3: Crear el contenedor definitivo del servidor

Se crea un contenedor con nombre `web-server` publicando el puerto 8080, se arranca y se comprueba.


docker create --name web-server -p 8080:80 nginx:alpine
docker start web-server
docker ps
curl http://localhost:8080

## Paso 4: Preparación y copia del contenido web

Se da permiso de lectura a todos los usuarios sobre la carpeta `html` y se copia su contenido a la carpeta que sirve nginx dentro del contenedor (el `.` final copia el contenido y no crea una subcarpeta `html`).


chmod -R o+r ./html/
docker cp ./html/. web-server:/usr/share/nginx/html/

## Paso 5: Gestión de permisos dentro del contenedor

Se entra en el contenedor y se cambia el propietario a `root:root`, los permisos de las carpetas a 755 y los de los archivos a 644.

docker exec -it web-server sh


Dentro del contenedor:


chown -R root:root /usr/share/nginx/html
find /usr/share/nginx/html -type d -exec chmod 755 {} \;
find /usr/share/nginx/html -type f -exec chmod 644 {} \;
ls -l /usr/share/nginx/html/
exit

## Paso 6: Monitoreo de logs en tiempo real

Se siguen los logs en modo follow y, desde el navegador o con curl, se hacen peticiones para ver cómo se actualizan. Se sale con `Ctrl + C`.

docker logs -f web-server

## Paso 7: Crear una imagen personalizada a partir del contenedor

Se crea la imagen a partir del estado actual del contenedor, con el formato `desarrollador/nombre_imagen:tag`.

docker commit web-server julescles/web_server:1.0
docker images

## Paso 8: Exportar la imagen a un archivo TAR

Se exporta la imagen **por su nombre** para que el nombre y el tag queden guardados dentro del TAR, y se comprueba con el `manifest.json`.

docker save -o web-server.tar julescles/web_server:1.0
tar -xOf web-server.tar manifest.json


Se añade el archivo al repositorio:

git add web-server.tar
git commit -m "P01: imagen exportada web-server.tar"
git push


## Paso 9: Limpieza de recursos locales

Primero se para y elimina el contenedor (una imagen no se puede borrar si hay un contenedor que la usa) y después se elimina la imagen.

docker stop web-server
docker rm web-server
docker rmi julescles/web_server:1.0


Comprobación (la imagen `nginx:alpine` puede quedarse):


docker ps -a
docker images


## Paso 10: Importar imagen y restauración del servicio en segundo plano

Se carga la imagen desde el TAR (recupera su nombre y tag), se comprueba y se levanta el servicio en segundo plano con `-d`.


docker load -i web-server.tar
docker images
docker run -d --name web-server -p 8080:80 julescles/web_server:1.0
docker ps
curl http://localhost:8080
