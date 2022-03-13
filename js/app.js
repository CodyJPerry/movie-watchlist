// Build our Search query
const baseUrl = "http://www.omdbapi.com/"

const movieList = []
let localStorageWatchList = []
let myWatchlist = []
let searchResultObj = {}
let watchListHtml = ""

// Store Our references to the DOM
const formEl = document.querySelector('.section-search form')
const searchResultsEl = document.querySelector('.section-results')
const watchlistWrapperEl = document.querySelector('.watchlist-results')
const toggleEl = document.querySelector('.slider')

// Check that our references to the DOM exist
if (formEl) {
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
            if (data.Response === 'True') {
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
                                    plot: movie.Plot,
                                    rating: movie.imdbRating
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
                                            <span class="watchlist-add-btn"><i class="fa-solid fa-circle-plus"></i>Watchlist</span>
                                        </div>
                                        <p class="search-result-text">${movie.Plot}</p>
                                    </div>
                                </div>
                        `
                        // Let's build the string and update our results section of the DOM
                        searchResultsEl.innerHTML = searchResultHtml
        
                        // We want to add an event listener to each button as it gets created
                        let watchlistAddBtnEls = document.querySelectorAll('.watchlist-add-btn')
                        watchlistAddBtnEls.forEach((watchlistAddBtn) => {
                            watchlistAddBtn.addEventListener('click', (event) => {
                                // We need to add an object with the respective properties into local storage
                                let searchResultTitle = watchlistAddBtn.parentElement.previousElementSibling.firstElementChild
                                movieList.forEach((movieListItem) => {
                                    if (searchResultTitle.textContent.toLowerCase() === movieListItem.title.toLowerCase()) {
                                        /**
                                         * We need to check for cases where user has not used app for the first time and 
                                         * localstorage key does not exist
                                         */
                                        if (localStorage.getItem('myWatchList') === null) {
                                            localStorage.setItem("myWatchList", JSON.stringify(localStorageWatchList));
                                            localStorageWatchList.push({
                                                imgSrc: movieListItem.imgSrc,
                                                title: movieListItem.title,
                                                runtime: movieListItem.runtime,
                                                genre: movieListItem.genre,
                                                plot: movieListItem.plot,
                                                rating: movieListItem.rating
                                            })
                                            localStorage.setItem("myWatchList", JSON.stringify(localStorageWatchList));
                                        } else {
                                            localStorageWatchList = JSON.parse(localStorage.getItem("myWatchList"))
                                            localStorageWatchList.push({
                                                imgSrc: movieListItem.imgSrc,
                                                title: movieListItem.title,
                                                runtime: movieListItem.runtime,
                                                genre: movieListItem.genre,
                                                plot: movieListItem.plot,
                                                rating: movieListItem.rating
                                            })
                                            localStorage.setItem("myWatchList", JSON.stringify(localStorageWatchList));
                                        }
                                    }
                                })
                            })
                        })
                    })
                }

                // Add overflow property 
                document.querySelector('.section-results-wrapper').style.overflow = 'auto'
            
                // Reset our search input
                document.querySelector('.section-search input').value = ""

            } else {
                // Display error message to user
                searchResultsEl.innerHTML = `
                    <div class="error-message-wrapper">
                        <span class="error-text">Unable to find what you’re looking for. Please try another search.</span>
                    </div>
                `
            }
        })
    })
}

// Render our watchlist to the DOM
const renderWatchList = () => {
    if (JSON.parse(localStorage.getItem('myWatchList')).length > 0) {
        // Parse the objects in the array that need added to our watchlist
        JSON.parse(localStorage.getItem('myWatchList')).forEach((watchListItem) => {
            watchListHtml += `
                <div class="watchlist-item">
                    <div class="watchlist-item-img">
                        <img src="${watchListItem.imgSrc}" alt="${watchListItem.title}">
                    </div>
                    <div class="watchlist-item-description">
                        <div class="watchlist-item-title-wrapper">
                            <h3 class="watchlist-item-title">${watchListItem.title}</h3>
                            <span class="watchlist-item-rating"><i class="fa-solid fa-star"></i>${watchListItem.rating}</span>
                        </div>
                        <div class="watchlist-item-details-wrapper">
                            <span class="duration">${watchListItem.runtime}</span>
                            <span class="genre">${watchListItem.genre}</span>
                            <span class="watchlist-remove-btn"><i class="fa-solid fa-circle-minus"></i></i>Remove</span>
                        </div>
                        <p class="watchlist-item-text">${watchListItem.plot}</p>
                    </div>
                </div>
            ` 
            watchlistWrapperEl.innerHTML = watchListHtml 

            // Add overflow property 
            document.querySelector('.watchlist-wrapper').style.overflow = 'auto'
        })
    }
}

// Check that our references to the DOM exist
if (watchlistWrapperEl) {
    renderWatchList()
}

// Remove an item from our watchlist
let watchlistRemoveBtnEls = document.querySelectorAll('.watchlist-remove-btn')
    watchlistRemoveBtnEls.forEach((watchlistRemoveBtn) => {
        watchlistRemoveBtn.addEventListener('click', (event) => {
        // We need to update the local storage item when this event takes place
        let watchListTitle = watchlistRemoveBtn.parentElement.previousElementSibling.firstElementChild
        localStorageWatchList = JSON.parse(localStorage.getItem('myWatchList')).filter((watchListItem) => watchListItem.title.toLowerCase() !== watchListTitle.textContent.toLowerCase())
        localStorage.setItem("myWatchList", JSON.stringify(localStorageWatchList))

        // Remove the whole element from the DOM since it no longer exists in local storage
        watchListTitle.closest('.watchlist-item').remove();
    })
})

// Dark mode toggle functionality
const enableDarkMode = () => {
    toggleEl.addEventListener('click', () => {
        // Setup new stylesheet to be added
        let toggleWrapperEl = toggleEl.parentElement.parentElement
        let linkElement = document.createElement('link')
        linkElement.setAttribute('rel', 'stylesheet')
        linkElement.setAttribute('href', 'css/dark-mode.css')

        // Check for dark mode and add or remove stylesheet based on the condition
        if (toggleWrapperEl.classList.contains('dark-mode')) {
            toggleWrapperEl.classList.remove('dark-mode')
            document.head.appendChild(linkElement)
        } else if (!toggleWrapperEl.classList.contains('dark-mode')) {
            toggleWrapperEl.classList.add('dark-mode')
            document.head.removeChild(document.head.lastChild)
        }
    })
}
enableDarkMode()