document.addEventListener('DOMContentLoaded', function() {
    const artGrid = document.getElementById('artGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const loader = document.getElementById('loader'); 
    const departmentSelect = document.getElementById('departmentSelect'); // Select de departamentos
    const keywordInput = document.getElementById('keywordInput'); // Input de palabra clave
    const locationInput = document.getElementById('locationInput'); // Input de localización
    const applyFiltersBtn = document.getElementById('applyFiltersBtn'); // Botón para aplicar filtros
    const defaultImage = "https://www.jpeg-repair.org/img/index_sample3A.jpg"; // URL de la imagen predeterminada

    let currentPage = 1;
    const itemsPerPage = 20;
    let totalItems = 0;
    let objectIDs = [];

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
        const department = departmentSelect.value;
        const keyword = keywordInput.value;
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
                displayObjects();
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

    // Recupera y muestra objetos para la página actual
    async function displayObjects() {
        loader.style.display = 'block'; // Mostrar el loader al empezar a cargar los objetos
        artGrid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const objectsToDisplay = objectIDs.slice(start, end);

        console.log(`Mostrando objetos del índice ${start} al ${end}.`);

        for (let objectID of objectsToDisplay) {
            console.log('Obteniendo datos para ID de objeto:', objectID);
            try {
                const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
                const data = await response.json();

                let imageSrc = data.primaryImageSmall || defaultImage;

                const card = `
                    <div class="card">
                        <img src="${imageSrc}" alt="${data.title || 'Sin título'}" onerror="this.onerror=null; this.src='${defaultImage}';">
                        <h3>${data.title || 'Sin título'}</h3>
                        <p><strong>Cultura:</strong> ${data.culture || 'N/A'}</p>
                        <p><strong>Dinastía:</strong> ${data.dynasty || 'N/A'}</p>
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
        currentPage = 1; // Reiniciar a la primera página al aplicar filtros
        fetchObjectIDs();
    });

    // Inicializar la aplicación
    fetchDepartments(); // Cargar departamentos al iniciar
    fetchObjectIDs(); // Cargar objetos al iniciar
});
