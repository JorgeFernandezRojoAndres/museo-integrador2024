

---

# Metropolitan Museum Art Collection

Este proyecto es una aplicación web interactiva que permite explorar la colección de arte del Museo Metropolitano de Arte utilizando su API pública. Los usuarios pueden buscar obras de arte por departamento, palabra clave y ubicación, y aplicar un filtro para ver solo objetos con imágenes adicionales. Además, ofrece una funcionalidad de traducción de texto para que el título y la descripción de las obras se muestren en español.

## Características

- **Filtros de búsqueda**: Permite a los usuarios filtrar obras de arte por departamento, palabra clave y ubicación.
- **Imágenes adicionales**: Los usuarios pueden activar un filtro para mostrar solo objetos con imágenes adicionales.
- **Traducción de texto**: Utiliza un servidor Node.js con la librería `node-google-translate-skidz` para traducir títulos y descripciones de las obras de inglés a español.
- **Animación con Particles.js**: La página principal incluye una animación interactiva de partículas, utilizando `tsParticles`, que reacciona al movimiento del ratón y a los clics. Esto mejora la experiencia visual y añade un fondo dinámico y envolvente.
- **Visualización de imágenes en modal**: Permite a los usuarios ver imágenes adicionales en un modal al hacer clic en el botón "Ver más imágenes".
- **Paginación**: Navegación entre páginas de resultados de búsqueda.

## Requisitos

- Node.js
- NPM (Node Package Manager)

## Instalación

1. **Clona este repositorio** en tu máquina local:

    ```bash
    git clone https://github.com/JorgeFernandezRojoAndres/museo-integrador.git
    cd museo-integrador
    ```

2. **Instala las dependencias**:

    ```bash
    npm install
    ```

3. **Ejecuta el servidor**:

    ```bash
    node server.js
    ```

4. **Abre tu navegador** y ve a `http://localhost:3000`.

## Uso

- **Filtrar obras de arte**: Selecciona un departamento, introduce una palabra clave o elige una localización para buscar obras de arte específicas.
- **Ver imágenes adicionales**: Activa el filtro de "Solo mostrar objetos con imágenes adicionales" para ver solo objetos que tienen imágenes adicionales. Haz clic en el botón "Ver más imágenes" para abrir un modal con todas las imágenes adicionales disponibles.
- **Traducción de texto**: El servidor Node.js automáticamente traduce los títulos y descripciones de las obras de inglés a español.
- **Animación de partículas**: La animación de partículas mejora la experiencia visual, brindando un fondo interactivo que responde a las acciones del usuario (movimientos del ratón y clics).

## Estructura del Proyecto

- `server.js`: Servidor Node.js que maneja la traducción de texto y sirve archivos estáticos.
- `public/index.html`: Página principal de la aplicación web.
- `public/script.js`: Lógica de cliente para interactuar con la API del museo y gestionar la interfaz de usuario.
- `public/style.css`: Estilos CSS para la interfaz de usuario.
- `public/particles-config.js`: Archivo de configuración de `tsParticles` para manejar la animación de partículas.
- `public/tsparticles.slim.js`: Biblioteca `tsParticles` utilizada para la animación de partículas.

## Contribuciones

Siéntete libre de contribuir al proyecto enviando pull requests o reportando problemas en el repositorio.

## Licencia

Este proyecto está bajo la [Licencia MIT](https://opensource.org/licenses/MIT).

## Créditos

- **API de la colección del Museo Metropolitano de Arte**: [Open Access API](https://github.com/metmuseum/openaccess)
- **Traducción**: [node-google-translate-skidz](https://www.npmjs.com/package/node-google-translate-skidz)
- **Animación de partículas**: [tsParticles](https://particles.js.org/)

---

