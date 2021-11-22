# Aplicativo administrativo para una universidad.

## Instalación necesaria para correr la aplicacion

### Instalar 
* node.js <https://nodejs.org/es/download/>

1. Ingresar al directorio clonado `universidad`

    ```bash
    $ cd universidad
    ```

2. Instalar las dependencias para correr el server

    ```bash
    $ yarn install o npm install
    ```

3. Inicie el servidor de desarrollo:
    ```bash
    $ yarn dev o npm run dev
    ```
    Se vera de la siguiente forma
    ```bash
    ➜  universidad yarn dev
    yarn run v1.22.15
    $ nodemon src/index.js
    [nodemon] 2.0.15
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node src/index.js`
    Servidor en el puerto 3000
    ```
4. Ingrese al navegador con
<http://localhost:3000/>