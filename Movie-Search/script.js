// --- API Configuration ---
// Get your free API key from http://www.omdbapi.com/
const API_KEY = 'YOUR_API_KEY'; 

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Mock data to display if the user hasn't added their API key yet
const mockMovies = [
    { Title: "Inception", Year: "2010", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" },
    { Title: "Interstellar", Year: "2014", Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDItN2IxOS00NTZkLThhYTctNjYwZDNlZWI3ZWE2XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
    { Title: "The Dark Knight", Year: "2008", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" },
    { Title: "The Matrix", Year: "1999", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
    { Title: "Pulp Fiction", Year: "1994", Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTItNDJhOC00YWE0LThmZTItZjcwY2QwNWGkYTk5XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg" }
];

// Fetch movies from API
async function getMovies(url) {
    // Fallback to mock data if no API key is provided
    if (API_KEY === 'YOUR_API_KEY') {
        showMovies(mockMovies);
        
        // Add a warning message about the API key
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box');
        messageBox.innerHTML = 'Showing mock data. To search real movies, please add your free OMDb API Key in <code>script.js</code>.';
        main.prepend(messageBox);
        return;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            showMovies(data.Search);
        } else {
            main.innerHTML = `<h2 style="width:100%; text-align:center; margin-top:2rem;">${data.Error}</h2>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        main.innerHTML = `<h2 style="width:100%; text-align:center; margin-top:2rem;">Failed to fetch movies. Check your connection.</h2>`;
    }
}

// Render movies to DOM
function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { Title, Poster, Year } = movie;
        
        // Use a placeholder if there is no poster available
        const imageSrc = Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/300x450/22254b/ffffff?text=No+Poster';

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${imageSrc}" alt="${Title}">
            <div class="movie-info">
                <h3>${Title}</h3>
                <span class="year">${Year}</span>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

// Search form event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm && searchTerm !== '') {
        // Call the OMDb API with the search term
        getMovies(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
        search.value = ''; // clear input
    } else {
        window.location.reload();
    }
});

// Initial load (using Avengers as a default search keyword if using a real API key)
if (API_KEY !== 'YOUR_API_KEY') {
    getMovies(`https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`);
} else {
    getMovies(''); // Trigger mock data flow
}
