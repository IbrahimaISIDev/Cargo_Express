document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 3; // Nombre d'éléments par page
    let currentPage = 1; // Page actuelle
    let allItems = []; // Contiendra tous les éléments du tableau

    const cargoList = document.getElementById('cargo-list');
    const searchInput = document.getElementById('searchInput');
    const paginationContainer = document.getElementById('pagination');

    // Fonction pour afficher les éléments du tableau
    function displayItems(items, wrapper, rowsPerPage, page) {
        wrapper.innerHTML = ''; // Vider le contenu du tableau
        page--;

        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const paginatedItems = items.slice(start, end);

        paginatedItems.forEach(item => {
            wrapper.appendChild(item);
        });
    }

    // Fonction pour créer les boutons de pagination
    function setupPagination(items, wrapper, rowsPerPage) {
        wrapper.innerHTML = '';

        const pageCount = Math.ceil(items.length / rowsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const btn = createPaginationButton(i, items);
            wrapper.appendChild(btn);
        }
    }

    // Fonction pour créer un bouton de pagination
    function createPaginationButton(page, items) {
        const button = document.createElement('button');
        button.innerText = page;
        button.classList.add('mx-1', 'px-3', 'py-1', 'bg-gray-200', 'text-gray-700', 'rounded');

        if (currentPage === page) {
            button.classList.add('bg-blue-700', 'text-white');
        }

        button.addEventListener('click', function () {
            currentPage = page;
            displayItems(items, cargoList, itemsPerPage, currentPage);

            const currentBtn = document.querySelector('#pagination button.bg-blue-700');
            if (currentBtn) {
                currentBtn.classList.remove('bg-blue-700', 'text-white');
            }
            button.classList.add('bg-blue-700', 'text-white');
        });

        return button;
    }

    // Fonction pour filtrer les éléments du tableau
    function filterItems(items, searchTerm) {
        return items.filter(item => item.innerHTML.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Fonction de recherche
    function search() {
        const searchTerm = searchInput.value;
        const filteredItems = filterItems(allItems, searchTerm);

        displayItems(filteredItems, cargoList, itemsPerPage, 1);
        setupPagination(filteredItems, paginationContainer, itemsPerPage);
    }

    // Événement pour déclencher la recherche après la saisie de 3 caractères
    searchInput.addEventListener('input', function () {
        if (this.value.length >= 3) {
            search();
        } else {
            displayItems(allItems, cargoList, itemsPerPage, 1);
            setupPagination(allItems, paginationContainer, itemsPerPage);
        }
    });

    // Événement pour déclencher la recherche au clic sur le bouton de recherche
    document.getElementById('searchBtn').addEventListener('click', search);

    // Fonction pour mettre à jour les éléments et réinitialiser la pagination et la recherche
    function updateItems(newItems) {
        allItems = newItems;
        displayItems(allItems, cargoList, itemsPerPage, 1);
        setupPagination(allItems, paginationContainer, itemsPerPage);
    }

    // Exemple de mise à jour des éléments du tableau (appelez cette fonction après avoir rempli le tableau dynamiquement)
    function simulateDynamicDataLoading() {
        // Exemple de nouvelles données
        const newItems = Array.from(document.querySelectorAll('#cargo-list tr'));
        updateItems(newItems);
    }

    // Simuler le chargement dynamique des données après 1 seconde
    setTimeout(simulateDynamicDataLoading, 1000);
});

/* document.addEventListener('DOMContentLoaded', function() {
    let cargos = [];
    let currentPage = 1;
    const itemsPerPage = 2;

    // Fonction pour ajouter des cargaisons de manière dynamique
    function addCargo(cargo) {
        cargos.push(cargo);
        displayPage(currentPage);
    }

    // Exemple d'ajout de cargaisons (vous pouvez le remplacer par vos propres données dynamiques)
    for (let i = 1; i <= 20; i++) {
        addCargo({
            id: i,
            type: `Type ${i}`,
            dateDepart: `2024-05-${i < 10 ? '0' + i : i}`,
            dateArrivee: `2024-06-${i < 10 ? '0' + i : i}`,
            distance: Math.floor(Math.random() * 1000),
            etat: `Etat ${i}`,
            status: `Status ${i}`
        });
    }

    // Fonction pour afficher une page spécifique
    function displayPage(page) {
        const cargoList = document.getElementById('cargo-list');
        cargoList.innerHTML = '';

        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedItems = cargos.slice(start, end);

        paginatedItems.forEach(cargo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4">${cargo.id}</td>
                <td class="py-2 px-4">${cargo.type}</td>
                <td class="py-2 px-4">${cargo.dateDepart}</td>
                <td class="py-2 px-4">${cargo.dateArrivee}</td>
                <td class="py-2 px-4">${cargo.distance}</td>
                <td class="py-2 px-4">${cargo.etat}</td>
                <td class="py-2 px-4">${cargo.status}</td>
                <td class="py-2 px-4"><button class="bg-blue-500 text-white px-2 py-1 rounded">Details</button></td>
            `;
            cargoList.appendChild(row);
        });

        updatePagination();
    }

    // Fonction pour mettre à jour les boutons de pagination
    function updatePagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const pageCount = Math.ceil(cargos.length / itemsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = `mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
            button.addEventListener('click', () => {
                currentPage = i;
                displayPage(i);
            });
            pagination.appendChild(button);
        }
    }

    // Initialisation de l'affichage
    displayPage(1);
});
 */