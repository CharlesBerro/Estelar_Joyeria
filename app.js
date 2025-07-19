// app.js - Versión conectada a DatoCMS

document.addEventListener('DOMContentLoaded', function() {

  // ===================================================================
  // 1. CONFIGURACIÓN DE LA API DE DATOCMS
  // ===================================================================
  const DATO_API_TOKEN = '4aab4621e0b1eefacb7aa1fa2ffab0'; // ¡Pega tu token aquí!
  const DATO_API_URL = 'https://graphql.datocms.com/';

  // Esta es la "pregunta" que le hacemos a la API en lenguaje GraphQL.
  // Le pedimos todos los productos con sus campos.
  const query = `
    query {
      allProductos {
        id
        nombre
        descripcion
        precio
        imagen {
          url
          alt
        }
      }
    }
  `;

  // ===================================================================
  // 2. HACER LA LLAMADA A LA API PARA OBTENER LOS PRODUCTOS
  // ===================================================================
  fetch(DATO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${DATO_API_TOKEN}`,
    },
    body: JSON.stringify({ query: query } ),
  })
  .then(res => res.json())
  .then(result => {
    // Una vez que tenemos la respuesta, llamamos a la función para construir la página.
    const products = result.data.allProductos;
    renderPage(products);
  })
  .catch(error => {
    console.error('Error al cargar los datos desde DatoCMS:', error);
    // Opcional: Mostrar un mensaje de error en la página
    const cardsContainer = document.getElementById('product-cards-container');
    cardsContainer.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los productos. Inténtalo de nuevo más tardesito.</p>';
  });

  // ===================================================================
  // 3. FUNCIÓN PARA CONSTRUIR LA PÁGINA (RENDERIZAR)
  // Esta función toma la lista de productos (ahora desde la API) y crea el HTML.
  // ===================================================================
  function renderPage(products) {
    const cardsContainer = document.getElementById('product-cards-container');
    const modalsContainer = document.getElementById('product-modals-container');

    // Limpiamos los contenedores por si acaso
    cardsContainer.innerHTML = '';
    modalsContainer.innerHTML = '';

    products.forEach(product => {
      const cardHTML = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${product.imagen.url}" class="card-img-top" alt="${product.nombre}" data-bs-toggle="modal" data-bs-target="#productModal${product.id}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.nombre}</h5>
              <h6 class="card-subtitle mt-auto mb-2 text-muted">$${product.precio}</h6>
            </div>
          </div>
        </div>
      `;

      const modalHTML = `
        <div class="modal fade" id="productModal${product.id}" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${product.nombre}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <img src="${product.imagen.url}" class="img-fluid mb-3" alt="${product.nombre}">
                <p>${product.descripcion}</p>
                <h4 class="text-end">$${product.precio}</h4>
              </div>
            </div>
          </div>
        </div>
      `;

      cardsContainer.innerHTML += cardHTML;
      modalsContainer.innerHTML += modalHTML;
    });
  }
});
