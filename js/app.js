/**
 * Store our API information we need
 * http://www.omdbapi.com/?apikey=[yourkey]&
 * Documentation => http://www.omdbapi.com/
 */

// Build our Search query
const baseUrl = "http://www.omdbapi.com/"

// Store Our references to the DOM
const formEl = document.querySelector('.section-search form')
const searchResultsEl = document.querySelector('.section-results')

// Event Listeners
formEl.addEventListener('submit', (event) => {
    // Stop our page from refreshing
    event.preventDefault()
    // Remove the spaces as needed
    let searchQuery = document.querySelector('.section-search input').value.toLowerCase().split(" ").join("+")
    let searchResultHtml = ""

    // Fetch our response object
    fetch (`${baseUrl}?s=${searchQuery}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.Search.length; i++) {
            // Get more detailed movie information
            fetch(`${baseUrl}?t=${data.Search[i].Title.toLowerCase()}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(movie => {
                    searchResultHtml += `
                        <div class="search-result">
                            <div class="search-result-img">
                                <img src="${movie.Poster}" alt="${movie.Title}">
                            </div>
                            <div class="search-result-description">
                                <div class="search-result-title-wrapper">
                                    <h3 class="search-result-title">${movie.Title}</h3>
                                    <span><i class="fa-solid fa-star"></i>${movie.imdbRating}</span>
                                </div>
                                <div class="search-result-details-wrapper">
                                    <span>${movie.Runtime}</span>
                                    <span>${movie.Genre}</span>
                                    <span><i class="fa-solid fa-circle-plus"></i> Watchlist</span>
                                </div>
                                <p class="search-result-text">${movie.Plot}</p>
                            </div>
                        </div>
                `
                // Let's build the string and update our results section of the DOM
                searchResultsEl.innerHTML = searchResultHtml
                })
        }
    })

    // Reset our search input
    document.querySelector('.section-search input').value = ""
})