document.addEventListener('DOMContentLoaded', function() {
    const artGrid = document.getElementById('artGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const loader = document.getElementById('loader'); 
    const departmentSelect = document.getElementById('departmentSelect'); // Select de departamentos
    const keywordInput = document.getElementById('keywordInput'); // Input de palabra clave
    const locationInput = document.getElementById('locationInput'); // Input de localización
    const applyFiltersBtn = document.getElementById('applyFiltersBtn'); // Botón para aplicar filtros
    const additionalImagesOnlyCheckbox = document.getElementById('additionalImagesOnly');
    const defaultImage = "https://www.jpeg-repair.org/img/index_sample3A.jpg"; // URL de la imagen predeterminada
    



    let currentPage = 1;
    const itemsPerPage = 20;
    let totalItems = 0;
    let objectIDs = [];
    let additionalImagesOnly = false; // Variable global para manejar el filtro de imágenes adicionales 

    // Obtener departamentos al cargar la página
    async function fetchDepartments() {
        try {
            const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            populateDepartmentSelect(data.departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }

    // Poblar el select de departamentos
    function populateDepartmentSelect(departments) {
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.departmentId;
            option.textContent = department.displayName;
            departmentSelect.appendChild(option);
        });
    }

    // Obtiene los ID de objeto de la API utilizando los filtros seleccionados
    async function fetchObjectIDs() {
        loader.style.display = 'block'; // Mostrar cargador al iniciar la carga
        const department = departmentSelect.value 
        const keyword = keywordInput.value || 'flowers';            
        const location = locationInput.value;
        
        let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(keyword)}`;
        
        if (department) {
            apiUrl += `&departmentId=${department}`;
        }
        
        if (location) {
            apiUrl += `&geoLocation=${encodeURIComponent(location)}`;
        }
        
        try {   
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.objectIDs && data.objectIDs.length > 0) {
                objectIDs = data.objectIDs;
                totalItems = objectIDs.length;
                console.log(`Se encontraron ${totalItems} objetos con imágenes.`);
                await displayObjects();
            } else {
                console.warn('No se encontraron objetos con los filtros aplicados.');
                artGrid.innerHTML = '<p>No se encontraron resultados. Intente con otros filtros.</p>';
                loader.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching object IDs:', error);
        } finally {
            loader.style.display = 'none'; // Ocultar cargador después de intentar cargar datos
        }   
    }
    // Función para traducir texto usando el servidor de Node.js
    async function translateText(text, targetLang) {
        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text, targetLang: targetLang })
            });
            const result = await response.json();
            return result.translatedText;
        } catch (error) {
            console.error('Error al traducir el texto:', error);
            return text; // Devuelve el texto original si hay un error
        }
    }

    // Recupera y muestra objetos para la página actual
    async function displayObjects() {
        loader.style.display = 'block'; // Mostrar el loader al empezar a cargar los objetos
        artGrid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const objectsToDisplay = objectIDs.slice(start, end);

        console.log(`Mostrando objetos del índice ${start} al ${end}.`);//mensaje de depuracion 

        for (let objectID of objectsToDisplay) {
            console.log('Obteniendo datos para ID de objeto:', objectID);
            try {
                const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
                const data = await response.json();

                // Verificar si el objeto tiene imágenes adicionales
                const hasAdditionalImages = data.additionalImages && data.additionalImages.length > 0;
                // Si el filtro está activado y no hay imágenes adicionales, continuar con el siguiente objeto
                if (additionalImagesOnly && !hasAdditionalImages) {
                    continue;
                }

            // Traducción de los campos
            const title = await translateText(data.title || 'Sin título', 'es');
            const culture = await translateText(data.culture || 'N/A', 'es');
            const dynasty = await translateText(data.dynasty || 'N/A', 'es');

            let imageSrc = data.primaryImageSmall || defaultImage;
            // Agregar la fecha o aproximación al atributo `title` de la imagen
            const creationDate = data.objectDate || 'Fecha desconocida'; // Usa la fecha de creación o muestra "Fecha desconocida" si no está disponible
                // Detectar imágenes adicionales
                
const additionalImages = data.additionalImages && data.additionalImages.length > 0;
let viewMoreButton = '';
if (additionalImages) {
    // Escapar correctamente el JSON para usar dentro del atributo onclick
    viewMoreButton = `<button class="view-more" onclick="showAdditionalImages('${encodeURIComponent(JSON.stringify(data.additionalImages))}')">Ver más imágenes</button>`;
}
const card = `
    <div class="card">
        <img src="${imageSrc}" alt="${title}" title="Creación: ${creationDate}" onerror="this.onerror=null; this.src='${defaultImage}';">
        <h3>${title}</h3>
        <p><strong>Cultura:</strong> ${culture}</p>
        <p><strong>Dinastía:</strong> ${dynasty}</p>
        ${viewMoreButton} <!-- Mostrar el botón de ver más imágenes si hay -->
    </div>
`;
artGrid.insertAdjacentHTML('beforeend', card);

            } catch (error) {
                console.error(`Error al recuperar el objeto con ID ${objectID}:`, error);
            }
        }

        loader.style.display = 'none'; // Ocultar el loader una vez que se han cargado las imágenes
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= totalItems;
    }
    window.showAdditionalImages = function (encodedImages) {
        // Decodifica el JSON recibido para convertirlo en un array de URLs
        const images = JSON.parse(decodeURIComponent(encodedImages));
        
        const modalContent = images.map(image => `<img src="${image}" class="modal-image" alt="Imagen adicional">`).join('');
        const modal = `
            <div class="modal" id="imageModal">
                <div class="modal-content">
                    <span class="close-button" onclick="closeModal()">×</span>
                    ${modalContent}
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
        document.getElementById('imageModal').style.display = 'block';

         // Forzar el scroll al principio del modal
    window.scrollTo(0, 0);
    };
    
    

    // Cerrar modal
    window.closeModal = function () {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.remove();
        }
    };
    

    // Event listeners para botones de paginación
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loader.style.display = 'block'; // Mostrar el loader al cambiar de página
        displayObjects();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage * itemsPerPage < totalItems) {
        currentPage++;
        loader.style.display = 'block'; // Mostrar el loader al cambiar de página
        displayObjects();
    }
});

// Event listener para aplicar filtros
applyFiltersBtn.addEventListener('click', () => {
    additionalImagesOnly = additionalImagesOnlyCheckbox.checked; // Actualizar la variable según el estado del checkbox
    currentPage = 1; // Reiniciar a la primera página al aplicar filtros
    fetchObjectIDs();
});

// Inicializar la aplicación
fetchDepartments(); // Cargar departamentos al iniciar
fetchObjectIDs(); // Cargar objetos al iniciar

console.log('Final del script alcanzado'); // Añade esta línea para depuración
});