# template Vuejs Vuetifyjs

Plantilla Desarrollada en VueJS y el Framework Component Vuetifyjs (https://vuetifyjs.com/), que ya tiene componentes generados en material design.


# Caracteristicas

* Vue 2.4.2
* Vuetyfyjs.
* Servicios REST con Axios.
* Manejo de estados centralizados con Vuex.
* Almacenamiento de datos en local Storage.
* Consume datos desde un servidor remoto http://tarjetas-serv.joseluiszamora.tecnologia.bo/


# Instalación

1. instalar nodeJS y npm (http://gitlab.miteleferico.bo/vuejs/template/wikis/instalar-nodejs-via-nvm).

2. Mediante la terminal, ingresar al directorio del projecto y ejecutar

``` bash
# instalar dependencias
npm install

# ejecutar el proyecto en modo desarrollo
npm run dev

```

3. Probar el sistema desde un navegador en el puerto 8080 (http://localhost:8080/)

# Información

* Sistema desarrollado en VueJs 2.4.2.
* Maneja estados centralizados, como ser los datos de sesión (token, nombre de usuario).
* consume datos desde un servidor remoto (http://tarjetas-serv.joseluiszamora.tecnologia.bo/), configurable en el archivo src/config.js.
* Una vez se realiza el logueo, se almacena el token en localstorage para futuras peticiones REST.
en el listado de universidades: http://localhost:8080/Universidad, se consume un servicio GET desde el servidor remoto enviandole el token del usuario.