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
        console.log(data)
        for (let i = 0; i < data.Search.length; i++) {
            // Get more detailed movie information
            fetch(`${baseUrl}?t=${data.Search[i].Title.toLowerCase()}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(movie => console.log(movie))
        }
    })
})