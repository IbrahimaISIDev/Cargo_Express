document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 3;
    let currentPage = 1;
    let allItems = [];

    const cargoList = document.getElementById('cargo-list');
    const searchInput = document.getElementById('searchInput');
    const paginationContainer = document.getElementById('pagination');

    function displayItems(items, wrapper, rowsPerPage, page) {
        wrapper.innerHTML = '';
        page--;

        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const paginatedItems = items.slice(start, end);

        paginatedItems.forEach(item => {
            wrapper.appendChild(item);
        });
    }

    function setupPagination(items, wrapper, rowsPerPage) {
        wrapper.innerHTML = '';
        const pageCount = Math.ceil(items.length / rowsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const btn = createPaginationButton(i, items);
            wrapper.appendChild(btn);
        }

        // Appliquer les styles CSS aux boutons de pagination
        const paginationButtons = document.querySelectorAll('#pagination button');
        paginationButtons.forEach(button => {
            button.classList.add(
                'mx-1', 'px-3', 'py-1', 'bg-gray-200', 'text-gray-700', 'hover:bg-gray-700', 'hover:text-white', 'rounded'
            );
        });

        let activeButton = document.querySelector('#pagination button.active');
        if (activeButton) {
            activeButton.classList.add('bg-blue-700', 'text-white');
        }
    }

    function createPaginationButton(page, items) {
        const button = document.createElement('button');
        button.innerText = page;
        button.classList.add('mx-1', 'px-3', 'py-1', 'bg-gray-200', 'text-gray-700', 'rounded');

        if (currentPage === page) {
            button.classList.add('bg-blue-700', 'text-white', 'active');
        }

        button.addEventListener('click', function () {
            currentPage = page;
            displayItems(items, cargoList, itemsPerPage, currentPage);

            const currentBtn = document.querySelector('#pagination button.active');
            if (currentBtn) {
                currentBtn.classList.remove('bg-blue-700', 'text-white', 'active');
            }
            button.classList.add('bg-blue-700', 'text-white', 'active');
        });

        return button;
    }

    function filterItems(items, searchTerm) {
        return items.filter(item => item.innerHTML.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    function search() {
        const searchTerm = searchInput.value;
        const filteredItems = filterItems(allItems, searchTerm);

        displayItems(filteredItems, cargoList, itemsPerPage, 1);
        setupPagination(filteredItems, paginationContainer, itemsPerPage);
    }

    searchInput.addEventListener('input', function () {
        if (this.value.length >= 3) {
            search();
        } else {
            displayItems(allItems, cargoList, itemsPerPage, 1);
            setupPagination(allItems, paginationContainer, itemsPerPage);
        }
    });

    document.getElementById('searchBtn').addEventListener('click', search);

    function updateItems(newItems) {
        allItems = newItems;
        displayItems(allItems, cargoList, itemsPerPage, 1);
        setupPagination(allItems, paginationContainer, itemsPerPage);
    }

    function simulateDynamicDataLoading() {
        const newItems = Array.from(document.querySelectorAll('#cargo-list tr'));
        updateItems(newItems);
    }

    setTimeout(simulateDynamicDataLoading, 1000);
});
