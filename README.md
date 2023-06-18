# BSALE_test

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
