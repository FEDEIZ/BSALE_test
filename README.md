# BSALE_test

## Archivo .env

`PORT=3001
DB_URL=mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=bsale_test
DB_PASSWORD=bsale_test
DB_NAME=airline`

Para ejecutar la API se debe correr el comando:

`npm start`

Se debe visualizar:

`INFO [default] Listening on port 3001`

Para probar el estado de conexion con la base de datos puede probar un metodo GET a la ruta: /health

Se debe visualizar:

`{
    "timestamp": "2023-06-18T00:29:55.004Z",
    "status": "healthy",
    "db": "connected"
}`

## EXPLICACION DE LA SOLUCION:

**Estructura del proyecto:**

La estructura utilizada contempla buenas practicas de programacion. Utiliza una arquitectura limpia separando las capas por responsabilidades limitadas.

El codigo fuente se encuentra en la carpeta ./src (source)

La aplicacion API REST se encuentra definida en el archivo .src/app.ts
Ha sido diseñada con el framework express sobre node js utilizando typescript como lenguaje de desarrollo.

La configuracion de la conexion a la base de datos se encuentra en el archivo .src/db

El archivo server y loggger se utilizar para levantar la aplicacion en a traves de un servidor express y logger es una herramienta para mostrar las peticiones y estados de las mismas en la consola.

Luego las diferentes carpetas representas diferentes capas de la aplicacion:

_Routes:_

Define todos los enrutadores express de la app. En este caso se trabaja con protocolos http. Se puede migrar a otro protocolo cambiando estos archivos sin modificar la logica de negocio.

_Controllers:_

Define los controladores, o sea la logica de negocios que utiliza la aplicacion para procesar la peticion. En este caso solamente se encuentra el controlador denominado **autoCheckIn** el cual a su vez contiene su acceso raiz **index.tx** y sus archivos auxiliares.

_Domain_ :

Hace referencia a las interfaces de las entidades de dominio que utiliza la aplicacion. De acuerdo al dominio esta planificada la logica de negocio.

_Repositories_ :

Guarda las interfaces que estructuran como se implementara el acceso a la informacion persistente de los dominios definidos.

_dao_ :

Es la implementacion de esos repositorios con una herramienta especifica utilizada para acceder a la base de datos. Si el dia de mañana se quiere utilizar otra DB, solamente se debera cambiar estos archivos resguardando la estructura definida en Repositories.

_Utils_:

Aloja archivos extra utilizados posiblemente en distintos puntos de la aplicacion. Como la definicion de la clase **BSaleError**.

**Logica de la solucion de Simulacion de CheckIn Automatico:**

1. Se lee la informacion necesaria para trabajar en la solucion: Vuelo, asientos del vuelo (de ese avion) y pasajeros del vuelo.

2. Se ordenan cada grupo de clase de asientos con una logica que permita ubicar los pasajeros lo mas proximo posible.
   Esto se hace con la funcion **orderFreeSeats**.

3. Luego con la funcion **seatSeats** se realiza la sasignacion de asientos donde previamente se filtran los asientos libres que quedan ya ordenados con la logica del punto anterior.
   En esta funcion se insertan inicialmente los pasajeros con asientos ya asignados previamente, y el resto pasa a la logica de asignacion.Consta de agrupar los pasajeros por compra (purchase_id) y ordenar primero los de la clase superior (en concordancia con el orden de los asientos libres).Luego se asignan por cada grupo de pasajeros los asientos libres disponibles, verificando que pertenezcan a esa clase.
