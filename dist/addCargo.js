document.addEventListener('DOMContentLoaded', () => {
    const addCargoBtn = document.getElementById('addCargoBtn');
    const addCargoModal = document.getElementById('addCargoModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addCargoForm = document.getElementById('addCargoForm');
    const cargoList = document.getElementById('cargo-list');
    const searchInput = document.getElementById('searchInput');
    const paginationContainer = document.getElementById('pagination');

    const editCargoModal = document.getElementById('editCargoModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editCargoForm = document.getElementById('editCargoForm');
    const deleteCargoBtn = document.getElementById('deleteCargoBtn');

    const dateDepartInput = document.getElementById('dateDepart');
    const dateArriveeInput = document.getElementById('dateArrivee');
    const stopCriteriaSelect = document.getElementById('stopCriteria');
    const criteriaValueInput = document.getElementById('criteriaValue');
    let pointDepart = null;
    let pointArrivee = null;

    const itemsPerPage = 3; // Nombre d'éléments par page
    let currentPage = 1; // Page actuelle
    let allItems = []; // Tous les éléments cargo

    const cargoCounters = {
        maritime: 0,
        aerien: 0,
        terrestre: 0
    };

    addCargoBtn.addEventListener('click', () => {
        addCargoModal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        addCargoModal.classList.add('hidden');
        resetForm();
    });

    cancelEditBtn.addEventListener('click', () => {
        editCargoModal.classList.add('hidden');
        editCargoForm.reset();
    });

   /*  addCargoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const type = addCargoForm.type.value;
        const dateDepart = addCargoForm.dateDepart.value;
        const dateArrivee = addCargoForm.dateArrivee.value;
        const stopCriteria = addCargoForm.stopCriteria.value;
        const criteriaValue = addCargoForm.criteriaValue.value;

        const cargoId = generateCargoId(type);


        const newRow = createNewCargoRow(cargoId, type, dateDepart, dateArrivee, distance.toFixed(2));
        allItems.unshift(newRow);
        updateItems(allItems);
        renderPage(allItems, 1); // Afficher la première page

        addCargoModal.classList.add('hidden');
        addCargoForm.reset();
        resetForm();
    }); */


    addCargoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const type = addCargoForm.type.value;
        const dateDepart = addCargoForm.dateDepart.value;
        const dateArrivee = addCargoForm.dateArrivee.value;
        const stopCriteria = addCargoForm.stopCriteria.value;
        const criteriaValue = addCargoForm.criteriaValue.value;

        const cargoId = generateCargoId(type);


        const newRow = createNewCargoRow(cargoId, type, dateDepart, dateArrivee, distance.toFixed(2));
        console.log(newRow);
        allItems.unshift(newRow);
        updateItems(allItems);
        renderPage(allItems, 1); // Afficher la première page

        addCargoModal.classList.add('hidden');
        addCargoForm.reset();
        resetForm();
    });

    editCargoForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const cargoId = document.getElementById('editCargoId').value;
        const dateDepart = document.getElementById('editDateDepart').value;
        const dateArrivee = document.getElementById('editDateArrivee').value;
        const etat = document.getElementById('editEtat').value;
        const status = document.getElementById('editStatus').value;
    
        console.log('Cargo ID:', cargoId);
        console.log('Date de départ:', dateDepart);
        console.log('Date d\'arrivée:', dateArrivee);
        console.log('État:', etat);
        console.log('Status:', status);
    
        const rowIndex = allItems.findIndex(row => row.querySelector('td').textContent === cargoId);
        console.log('Row Index:', rowIndex);
    
        if (rowIndex !== -1) {
            const cells = allItems[rowIndex].querySelectorAll('td');
            cells[2].textContent = dateDepart;
            cells[3].textContent = dateArrivee;
            cells[5].innerHTML = `<button>${etat}</button>`;
            cells[6].innerHTML = `<button>${status}</button>`;
        }
    
        editCargoModal.classList.add('hidden');
        updateItems(allItems);
    });
    



    deleteCargoBtn.addEventListener('click', () => {
        const cargoId = document.getElementById('editCargoId').value;
        const rowIndex = allItems.findIndex(row => row.querySelector('td').textContent === cargoId);
        if (rowIndex !== -1) {
            allItems.splice(rowIndex, 1);
            updateItems(allItems);
        }
        editCargoModal.classList.add('hidden');
    });

    function resetForm() {
        dateDepartInput.value = '';
        dateArriveeInput.value = '';
        stopCriteriaSelect.value = '';
        criteriaValueInput.value = '';
        document.getElementById('depart').value = '';
        document.getElementById('arrivee').value = '';
        departMarker = null;
        arriveeMarker = null;
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    function generateCargoId(type) {
        if (!cargoCounters[type]) {
            cargoCounters[type] = 0;
        }
        cargoCounters[type]++;
        return `${type.charAt(0).toUpperCase()}${cargoCounters[type].toString().padStart(3, '0')}`;
    }

    function createNewCargoRow(id, type, dateDepart, dateArrivee, distance) {
        const newRow = document.createElement('tr');
        newRow.classList.add('border-b');
        newRow.innerHTML = `
            <td class="py-2 px-4">${id}</td>
            <td class="py-2 px-4">${type}</td>
            <td class="py-2 px-4">${dateDepart}</td>
            <td class="py-2 px-4">${dateArrivee}</td>
            <td class="py-2 px-4">${distance}</td>
            <td class="py-2 px-4"><button>Ouvert</button></td>
            <td class="py-2 px-4"><button>En attente</button></td>
            <td class="py-2 px-4">
                <button class="bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Voir</button>
            </td>
            <td class="py-2 px-4">
                <button class="bg-blue-700 text-white font-bold px-4 py-2 rounded-lg editCargoBtn">
                Modifier
            </button>
        </td>
    `;

        newRow.querySelector('.editCargoBtn').addEventListener('click', () => {
            const cells = newRow.querySelectorAll('td');
            document.getElementById('editCargoId').value = cells[0].textContent;
            document.getElementById('editType').value = cells[1].textContent;
            document.getElementById('editDateDepart').value = cells[2].textContent;
            document.getElementById('editDateArrivee').value = cells[3].textContent;

            editCargoModal.classList.remove('hidden');
        });

        return newRow;
    }

    function filterItems() {
        const filterText = searchInput.value.toLowerCase();
        const filteredItems = allItems.filter(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filterText));
        });

        renderPage(filteredItems, 1); // Toujours réinitialiser à la première page après le filtrage
        renderPagination(filteredItems);
    }

    function updateItems(items) {
        allItems = items;
        filterItems(); // Mettre à jour les éléments affichés en fonction du filtre actuel
    }

    function renderPage(items, page) {
        cargoList.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = items.slice(start, end);
        for (const item of paginatedItems) {
            cargoList.appendChild(item);
        }
    }

    function renderPagination(items) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(items.length / itemsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const pageLink = document.createElement('button');
            pageLink.classList.add('page-link', 'px-2', 'py-1', 'mx-1', 'bg-blue-600', 'text-white', 'rounded');
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderPage(items, currentPage);
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    searchInput.addEventListener('input', filterItems);
    updateItems(Array.from(document.querySelectorAll('#cargo-list tr')));

    function validateForm() {
        clearErrors();
        let isValid = true;

        const selectedType = getSelectedType();
        if (!selectedType) {
            showError('typeError', 'Veuillez choisir un type de cargaison.');
            isValid = false;
        }

        const now = new Date().toISOString().split('T')[0];
        if (dateDepartInput.value < now) {
            showError('dateDepartError', 'La date de départ ne doit pas être inférieure à la date actuelle.');
            isValid = false;
        }

        if (dateArriveeInput.value <= dateDepartInput.value) {
            showError('dateArriveeError', 'La date d\'arrivée doit être supérieure à la date de départ.');
            isValid = false;
        }

        if (stopCriteriaSelect.value && criteriaValueInput.value <= 0) {
            showError('criteriaValueError', 'La valeur doit être positive.');
            isValid = false;
        }
        if (!criteriaValueInput.value) {
            showError('criteriaValueError', 'Le champ ne doit pas etre vide.');
            isValid = false;
        }
        return isValid;
    }

    function clearErrors() {
        document.getElementById('typeError').textContent = '';
        document.getElementById('dateDepartError').textContent = '';
        document.getElementById('dateArriveeError').textContent = '';
        document.getElementById('criteriaValueError').textContent = '';
        document.getElementById('mapError').textContent = '';
    }

    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    function getSelectedType() {
        const radios = document.getElementsByName('type');
        for (const radio of radios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    }

    function filterItems() {
        const filterText = searchInput.value.toLowerCase();
        const filteredItems = allItems.filter(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filterText));
        });

        renderPage(filteredItems, 1); // Always reset to the first page after filtering
        renderPagination(filteredItems);
    }

    function updateItems(items) {
        allItems = items;
        filterItems(); // Update displayed items based on current filter
    }

    function renderPage(items, page) {
        cargoList.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = items.slice(start, end);
        for (const item of paginatedItems) {
            cargoList.appendChild(item);
        }
    }

    function renderPagination(items) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(items.length / itemsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const pageLink = document.createElement('button');
            pageLink.classList.add('page-link', 'px-2', 'py-1', 'mx-1', 'bg-blue-600', 'text-white', 'rounded');
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderPage(items, currentPage);
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    searchInput.addEventListener('input', filterItems);
    updateItems(Array.from(document.querySelectorAll('#cargo-list tr')));
    // Reste du code pour la carte, la pagination, le filtrage, etc.
    const map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
    }).addTo(map);

    let departMarker, arriveeMarker;

    map.on("click", function (e) {
        if (!departMarker) {
            departMarker = createMarker(e.latlng, "Lieu de départ");
            updateInputWithLocationName(e.latlng, "depart");
        } else if (!arriveeMarker) {
            arriveeMarker = createMarker(e.latlng, "Lieu d'arrivée");
            updateInputWithLocationName(e.latlng, "arrivee");
            calculateDistance(departMarker.getLatLng(), arriveeMarker.getLatLng());
        }
    });

    function createMarker(latlng, popupText) {
        return L.marker(latlng)
            .addTo(map)
            .bindPopup(popupText)
            .openPopup();
    }

    function updateInputWithLocationName(latlng, inputId) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
            .then((response) => response.json())
            .then((data) => {
                const locationName = data.display_name || `${latlng.lat}, ${latlng.lng}`;
                document.getElementById(inputId).value = locationName;
            })
            .catch((error) => {
                console.error("Error fetching location name:", error);
                document.getElementById(inputId).value = `${latlng.lat}, ${latlng.lng}`;
            });
    }

    let distance = null;

    function calculateDistance(start, end) {
        const R = 6371; // Earth's radius in km
        const dLat = ((end.lat - start.lat) * Math.PI) / 180;
        const dLon = ((end.lng - start.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((start.lat * Math.PI) / 180) * Math.cos((end.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = R * c;
        document.getElementById("distance").value = distance.toFixed(2);
    }

    const choixSelect = document.getElementById("choix");
    const champSaisi = document.getElementById("champ-saisi");
    const labelValeur = document.querySelector("#champ-saisi label");
    const inputValeur = document.getElementById("valeur");

    choixSelect.addEventListener("change", function () {
        if (this.value === "poids" || this.value === "nombre") {
            showInputField("Entrez la valeur", "Entrez la valeur");
        } else {
            hideInputField();
        }
    });

    function showInputField(labelText, placeholderText) {
        champSaisi.classList.remove("hidden");
        labelValeur.textContent = labelText;
        inputValeur.placeholder = placeholderText;
        inputValeur.classList.remove("hidden");
    }

    function hideInputField() {
        champSaisi.classList.add("hidden");
        inputValeur.classList.add("hidden");
    }

    function filterItems() {
        const filterText = searchInput.value.toLowerCase();
        const filteredItems = allItems.filter(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filterText));
        });

        renderPage(filteredItems, 1); // Always reset to the first page after filtering
        renderPagination(filteredItems);
    }

    function updateItems(items) {
        allItems = items;
        filterItems(); // Update displayed items based on current filter
    }

    function renderPage(items, page) {
        cargoList.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = items.slice(start, end);
        for (const item of paginatedItems) {
            cargoList.appendChild(item);
        }
    }

    function renderPagination(items) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(items.length / itemsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const pageLink = document.createElement('button');
            pageLink.classList.add('page-link', 'px-2', 'py-1', 'mx-1', 'bg-blue-600', 'text-white', 'rounded');
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderPage(items, currentPage);
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    searchInput.addEventListener('input', filterItems);
    updateItems(Array.from(document.querySelectorAll('#cargo-list tr')));
    function updateInputWithLocationName(latlng, inputId) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
            .then((response) => response.json())
            .then((data) => {
                const locationName = data.display_name || `${latlng.lat}, ${latlng.lng}`;
                document.getElementById(inputId).value = locationName;
            })
            .catch((error) => {
                console.error("Error fetching location name:", error);
                document.getElementById(inputId).value = `${latlng.lat}, ${latlng.lng}`;
            });
    }
});
