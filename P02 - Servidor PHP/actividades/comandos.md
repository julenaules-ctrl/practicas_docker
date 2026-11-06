# Práctica P02: Servidor PHP con Docker

- Alumno: Julen Escosteguy Lescano
- Curso: 2º DAM O
- Asignatura: Sistemas de Gestión Empresarial

## 1. Objetivo

Desarrollar una aplicación web con HTML, CSS y PHP para inscribirse en actividades de un centro educativo y desplegarla con Docker, usando la imagen base `php:8.3-apache`, que incluye PHP y Apache configurados para trabajar juntos.

## 2. Estructura del proyecto

    actividades/
    ├── Dockerfile
    ├── comandos.md
    └── html/
        ├── index.html
        ├── procesar.php
        └── estilos.css

- `Dockerfile`: instrucciones para construir la imagen.
- `comandos.md`: este documento.
- `html/index.html`: formulario de inscripción (método POST).
- `html/procesar.php`: recibe los datos y muestra el resumen.
- `html/estilos.css`: diseño de ambas páginas.

Todos los comandos se ejecutan desde la raíz `actividades/`.

Creación de la estructura:

    mkdir -p "P02 - Servidor PHP/actividades/html"
    cd "P02 - Servidor PHP/actividades"

## 3. Prueba con volumen de host

Antes de construir la imagen se probó la aplicación con un contenedor temporal que monta la carpeta `html` del anfitrión en la carpeta del servidor, para ver los cambios sin reconstruir la imagen.

    docker run -d --name actividades-dev -p 8080:80 -v "$(pwd)/html":/var/www/html php:8.3-apache

- `-d`: ejecuta el contenedor en segundo plano.
- `--name actividades-dev`: nombre del contenedor temporal.
- `-p 8080:80`: publica el puerto 80 del contenedor en el 8080 del anfitrión.
- `-v ruta_host:ruta_contenedor`: monta la carpeta del proyecto en la del servidor.

Al terminar las pruebas se eliminó:

    docker rm -f actividades-dev

## 4. Dockerfile

    FROM php:8.3-apache
    WORKDIR /var/www/html
    COPY html/ /var/www/html/
    EXPOSE 80

- `FROM php:8.3-apache`: imagen base con PHP 8.3 y Apache.
- `WORKDIR /var/www/html`: directorio de trabajo, que es el directorio web de Apache.
- `COPY html/ /var/www/html/`: copia el contenido de la carpeta `html` al directorio web de la imagen.
- `EXPOSE 80`: documenta que Apache escucha en el puerto 80.

## 5. Construcción de la imagen

    docker build -t actividades-php:v1 .

- `docker build`: construye una imagen a partir de un Dockerfile.
- `-t actividades-php:v1`: le asigna el nombre `actividades-php` y la etiqueta `v1`.
- `.`: el contexto de construcción es el directorio actual, donde están el `Dockerfile` y la carpeta `html`.

## 6. Creación y ejecución del contenedor

    docker run -d --name actividades-web -p 8080:80 actividades-php:v1

- `docker run`: crea un contenedor a partir de la imagen y lo ejecuta.
- `-d`: segundo plano.
- `--name actividades-web`: nombre del contenedor.
- `-p 8080:80`: el puerto 80 del contenedor queda disponible en el 8080 del equipo anfitrión.
- `actividades-php:v1`: imagen utilizada.

Se accede a la aplicación en `http://localhost:8080`.

## 7. Comprobaciones obligatorias

### 7.1 Imagen construida correctamente

    docker build -t actividades-php:v1 .
    docker images

Resultado: la construcción terminó sin errores (`FINISHED`) y la imagen `actividades-php:v1` aparece en la lista de imágenes.

### 7.2 Contenedor en ejecución

    docker ps

Resultado:

    CONTAINER ID   IMAGE                COMMAND                  CREATED                  STATUS                  PORTS                                     NAMES
    d7892673ae95   actividades-php:v1   "docker-php-entrypoi…"   Less than a second ago   Up Less than a second   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   actividades-web

El contenedor `actividades-web` está en estado `Up`, con el puerto 8080 del anfitrión asociado al 80 del contenedor.

### 7.3 Acceso al formulario desde el navegador

    xdg-open http://localhost:8080

Resultado: se muestra el formulario de inscripción con los estilos aplicados. En los registros del contenedor aparecen las peticiones `GET /` y `GET /estilos.css` del navegador.

### 7.4 Inscripción con todos los campos cumplimentados

    curl -s -X POST http://localhost:8080/procesar.php \
      --data-urlencode "nombre=Ana Pérez" \
      --data-urlencode "correo=ana@ejemplo.com" \
      --data-urlencode "actividad=Robótica" \
      --data-urlencode "turno=Mañana" \
      -d "portatil=20" -d "auriculares=10" -d "escritura=5" \
      --data-urlencode "observaciones=Necesito <b>enchufe</b>" | grep -E "<span>|<li>|Total"

Resultado:

    <span>Ana Pérez</span>
    <span>ana@ejemplo.com</span>
    <span>Robótica</span>
    <span>Mañana</span>
    <li>Ordenador portátil (20 €)</li>
    <li>Auriculares (10 €)</li>
    <li>Material de escritura (5 €)</li>
    <span class="total">Total: 35 €</span>
    <span>Necesito &lt;b&gt;enchufe&lt;/b&gt;</span>

Se muestran todos los datos, el material seleccionado con el total (35 €) y las observaciones. Las etiquetas HTML escritas por el usuario aparecen escapadas (`&lt;b&gt;`), lo que confirma que `htmlspecialchars()` funciona.

### 7.5 Inscripción sin material adicional

    curl -s -X POST http://localhost:8080/procesar.php \
      --data-urlencode "nombre=Julen Escosteguy Lescano" \
      --data-urlencode "correo=julen@ejemplo.com" \
      --data-urlencode "actividad=Ciberseguridad" \
      --data-urlencode "turno=Tarde" | grep -E "<span>|Observaciones"

Resultado:

    <span>Julen Escosteguy Lescano</span>
    <span>julen@ejemplo.com</span>
    <span>Ciberseguridad</span>
    <span>Tarde</span>
    <span>Sin material adicional</span>

Aparece "Sin material adicional" y no se muestra el campo Observaciones porque estaba vacío. También se probó desde el navegador.

### 7.6 Datos correctos en la página de resultados

Resultado: en ambas pruebas los datos mostrados coinciden con los enviados.

### 7.7 Enlace para volver al formulario

    curl -s -X POST http://localhost:8080/procesar.php -d "nombre=x" | grep "index.html"

Resultado:

    <a href="index.html" class="boton-enlace">

El enlace existe, y al pulsarlo en el navegador se carga de nuevo el formulario (en los registros aparece `GET /index.html`). También se comprobó que el formulario usa el método POST:

    curl -s http://localhost:8080 | grep 'method="POST"'

Resultado:

    <form action="procesar.php" method="POST">

### 7.8 Registros del contenedor

    docker logs actividades-web

Resultado:

    AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
    [Fri Nov 06 21:22:39.672511 2026] [mpm_prefork:notice] [pid 1:tid 1] AH00163: Apache/2.4.69 (Debian) PHP/8.3.36 configured -- resuming normal operations
    [Fri Nov 06 21:22:39.672592 2026] [core:notice] [pid 1:tid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
    172.17.0.1 - - [06/Nov/2026:21:22:47 +0000] "POST /procesar.php HTTP/1.1" 200 2336 "-" "curl/8.5.0"
    172.17.0.1 - - [06/Nov/2026:21:24:07 +0000] "GET / HTTP/1.1" 200 1327 "-" "Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0"
    172.17.0.1 - - [06/Nov/2026:21:24:49 +0000] "POST /procesar.php HTTP/1.1" 200 900 "http://localhost:8080/" "Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0"
    172.17.0.1 - - [06/Nov/2026:21:24:53 +0000] "GET /index.html HTTP/1.1" 200 1326 "http://localhost:8080/procesar.php" "Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0"

Apache arrancó correctamente y se registran las peticiones recibidas. El aviso `AH00558` es informativo (falta definir `ServerName`) y no afecta al funcionamiento.

### 7.9 Detener el contenedor y comprobar su estado

    docker stop actividades-web
    docker ps -a

Resultado:

    CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS                              PORTS     NAMES
    d7892673ae95   actividades-php:v1   "docker-php-entrypoi…"   2 minutes ago   Exited (0) Less than a second ago             actividades-web

El contenedor sigue existiendo pero está detenido (`Exited (0)`).

### 7.10 Volver a iniciarlo y verificar que funciona

    docker start actividades-web
    docker ps
    xdg-open http://localhost:8080

Resultado:

    CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS                  PORTS                                     NAMES
    d7892673ae95   actividades-php:v1   "docker-php-entrypoi…"   2 minutes ago   Up Less than a second   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   actividades-web

El contenedor vuelve a estar `Up` y la aplicación sigue funcionando en `http://localhost:8080`.

### 7.11 Eliminar el contenedor y la imagen

    docker stop actividades-web
    docker rm actividades-web
    docker rmi actividades-php:v1
    docker ps -a
    docker images

Primero se detiene y elimina el contenedor y después la imagen, porque Docker no permite borrar una imagen mientras un contenedor la utiliza.

Resultado: `docker rm` y `docker stop` devuelven el nombre del contenedor, `docker rmi` muestra `Untagged: actividades-php:v1` y `Deleted: sha256:...`, y ni `docker ps -a` ni `docker images` muestran ya el contenedor `actividades-web` ni la imagen `actividades-php:v1`.

## 8. Resumen de comandos

| Operación                        | Comando                                                              |
| -------------------------------- | -------------------------------------------------------------------- |
| Construir la imagen              | `docker build -t actividades-php:v1 .`                               |
| Listar imágenes                  | `docker images`                                                      |
| Crear y ejecutar el contenedor   | `docker run -d --name actividades-web -p 8080:80 actividades-php:v1` |
| Listar contenedores
