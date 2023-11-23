// JavaScript para gestionar el modo oscuro
const modoOscuroBtn = document.getElementById('modoOscuroBtn');
const body = document.body;

// Verificar el estado actual del modo oscuro desde localStorage
if (localStorage.getItem('modoOscuro') === 'habilitado') {
    body.classList.add('modo-oscuro');
}

modoOscuroBtn.addEventListener('click', () => {
    body.classList.toggle('modo-oscuro');
    
    // Guardar el estado del modo oscuro en localStorage
    if (body.classList.contains('modo-oscuro')) {
        localStorage.setItem('modoOscuro', 'habilitado');
    } else {
        localStorage.setItem('modoOscuro', 'deshabilitado');
    }
});

const baseURL = "https://pokeapi.co/api/v2/pokemon";
const homeContainer = document.getElementById("home");
const pokemonContainer = document.getElementById("pokemonContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const searchInput = document.getElementById("searchInput");

// Función para obtener un número aleatorio entre 1 y 898 (total de Pokémon en la API)
function getRandomPokemonId() {
    return Math.floor(Math.random() * 898) + 1;
}

// Función para obtener datos de la API de PokeAPI
async function getPokemonData(pokemonId) {
    try {
        const response = await fetch(`${baseURL}/${pokemonId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener datos del Pokémon", error);
    }
}

// Función para crear tarjetas de Pokémon con botón de "Agregar a favoritos" o "Eliminar de favoritos"
function createPokemonCard(pokemon, container) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>Número de la Pokédex: ${pokemon.id}</p>
        <p>Tipo: ${pokemon.types.map((type) => type.type.name).join(", ")}</p>
        <button class="favorite-button">${
            isFavorite(pokemon) ? "Eliminar de favoritos" : "Agregar a favoritos"
        }</button>`;
    const favoriteButton = card.querySelector(".favorite-button");
    favoriteButton.addEventListener("click", () => toggleFavorite(pokemon));
    container.appendChild(card);
}

// Función para verificar si un Pokémon está en la lista de favoritos
function isFavorite(pokemon) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some((favorite) => favorite.id === pokemon.id);
}

// Función para agregar o eliminar un Pokémon de la lista de favoritos
function toggleFavorite(pokemon) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite(pokemon)) {
        const updatedFavorites = favorites.filter(
            (favorite) => favorite.id !== pokemon.id
        );
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${pokemon.name} eliminado de favoritos`,
            showConfirmButton: false,
            timer: 2000 // Duración del mensaje en milisegundos
        });
    } else {
        favorites.push(pokemon);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${pokemon.name} agregado a favoritos`,
            showConfirmButton: false,
            timer: 2000 // Duración del mensaje en milisegundos
        });
    }
    loadFavoritePokemonCards();
}

// Función para agregar un Pokémon a la lista de favoritos
function addToFavorites(pokemon) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(pokemon);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  Toastify({
    text: "Pokémon agregado a favoritos",
    duration: 3000,
    gravity: "bottom", // Adds the toast to the bottom of the page
  }).showToast();
  loadFavoritePokemonCards();
}

// Función para cargar y mostrar tarjetas de Pokémon favoritos
function loadFavoritePokemonCards() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesContainer.innerHTML = "";
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No tienes Pokémon favoritos.</p>";
    return;
  }
  favorites.forEach(async (favorite) => {
    createPokemonCard(favorite, favoritesContainer);
  });
}

// Función para cargar y mostrar tarjetas de Pokémon en el HOME
async function loadPokemonCards() {
  for (let i = 0; i < 20; i++) {
    const randomPokemonId = getRandomPokemonId();
    const pokemon = await getPokemonData(randomPokemonId);
    createPokemonCard(pokemon, homeContainer);
  }
}

// Función para buscar Pokémon por nombre
async function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    pokemonContainer.innerHTML = ""; // Limpiar el contenedor antes de la búsqueda
    if (searchTerm === "") {
        return;
    }
    try {
        const allPokemonResponse = await fetch(`${baseURL}?limit=1118`);
        const allPokemonData = await allPokemonResponse.json();
        const pokemonList = allPokemonData.results;
        
        const foundPokemon = pokemonList.find(pokemon => pokemon.name === searchTerm);
        if (foundPokemon) {
            const pokemonData = await getPokemonData(foundPokemon.name);
            createPokemonCard(pokemonData, pokemonContainer);
        } else {
            pokemonContainer.innerHTML = "<p>No se encontraron resultados para el Pokémon buscado.</p>";
        }
    } catch (error) {
        console.error("Error al obtener datos del Pokémon", error);
        pokemonContainer.innerHTML = "<p>Ocurrió un error al buscar el Pokémon.</p>";
    }
}


// Cargar tarjetas de Pokémon en el HOME al cargar la página
window.addEventListener("load", () => {
  loadPokemonCards();
  loadFavoritePokemonCards();
});

// Escuchar el evento de entrada del usuario para la búsqueda
searchInput.addEventListener("input", searchPokemon);

