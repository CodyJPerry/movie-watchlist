/**
 * Store our API information we need
 * http://www.omdbapi.com/?apikey=[yourkey]&
 * Documentation => http://www.omdbapi.com/
 */

// Build our Search query
const baseUrl = "http://www.omdbapi.com/"

const movieList = []
const localStorageWatchList = []
let myWatchlist = []
let searchResultObj = {}

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
                    // Create our own object with values and add it to our array 
                    searchResultObj = {
                        imgSrc: movie.Poster,
                            title: movie.Title,
                            runtime: movie.Runtime,
                            genre: movie.Genre,
                            plot: movie.Plot
                    }
                    movieList.push(searchResultObj)

                    searchResultHtml += `
                        <div class="search-result">
                            <div class="search-result-img">
                                <img src="${movie.Poster}" alt="${movie.Title}">
                            </div>
                            <div class="search-result-description">
                                <div class="search-result-title-wrapper">
                                    <h3 class="search-result-title">${movie.Title}</h3>
                                    <span class="search-result-rating"><i class="fa-solid fa-star"></i>${movie.imdbRating}</span>
                                </div>
                                <div class="search-result-details-wrapper">
                                    <span class="duration">${movie.Runtime}</span>
                                    <span class="genre">${movie.Genre}</span>
                                    <span class="watchlist-btn"><i class="fa-solid fa-circle-plus"></i>Watchlist</span>
                                </div>
                                <p class="search-result-text">${movie.Plot}</p>
                            </div>
                        </div>
                `
                // Let's build the string and update our results section of the DOM
                searchResultsEl.innerHTML = searchResultHtml

                // We want to add an event listener to each button as it gets created
                let watchlistBtnEls = document.querySelectorAll('.watchlist-btn')
                watchlistBtnEls.forEach((watchlistBtn) => {
                    watchlistBtn.addEventListener('click', (event) => {
                        // We need to add an object with the respective properties into local storage
                        let searchResultTitle = watchlistBtn.parentElement.previousElementSibling.firstElementChild
                        movieList.forEach((movieListItem) => {
                            if (searchResultTitle.textContent.toLowerCase() === movieListItem.title.toLowerCase())
                            localStorageWatchList.push(movieListItem)
                        })
                        // Add to localstorage
                        window.localStorage.setItem('myWatchlist', JSON.stringify(localStorageWatchList))
                        
                        // Get our localstorage array ready for use
                        myWatchlist =  JSON.parse(window.localStorage.getItem('myWatchlist'))
                        console.log(myWatchlist)

                    })
                })
            })
        }
    })

    // Add overflow property 
    document.querySelector('.section-results-wrapper').style.overflow = 'auto'

    // Reset our search input
    document.querySelector('.section-search input').value = ""
})