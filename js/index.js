"use strict"

const DISCOVER_API = "https://api.themoviedb.org/3/discover/movie?api_key=1044ef1f18b82547c2c5d0057e925baf";
const GENRE_API = "https://api.themoviedb.org/3/genre/movie/list?api_key=1044ef1f18b82547c2c5d0057e925baf";
const BACKDROP_URL = "http://image.tmdb.org/t/p/w500//";
const SEARCH_API = "https://api.themoviedb.org/3/search/movie?api_key=1044ef1f18b82547c2c5d0057e925baf"
const GENRE_DIV = document.querySelector("#genre-results");
const RESULTS_DIV = document.querySelector("#results");
const ERROR_ALERT_DIV = document.querySelector("#error");

let state = {"movies" : [], "pageNumber" : 1, "totPages" : -1, "genre" : "", "currGenre" : -1, "search" : ""};

function firstLoad() {
    fetch(GENRE_API)
        .then(handleResponse)
        .then(renderResultsGenre)
        .catch(handleError);

    changePage();
}

let btPrev = document.querySelector("#previous");
let btNext = document.querySelector("#next");

btPrev.addEventListener("click", function() {
    if(state.pageNumber > 1) {
        state.pageNumber--;
        changePage();
    }
});

btNext.addEventListener("click", function() {
    if(state.pageNumber < state.totPages) {
        state.pageNumber++;
        changePage();
    }
});

function renderResultsDiscover(data) {
    RESULTS_DIV.textContent = "";
    let pageNumbers = document.querySelector("#page-numbers");
    state.totPages = Math.min(data.total_pages, 1000);

    pageNumbers.textContent = "page " + state.pageNumber + " of " + state.totPages + " pages";

    for(let i = 0; i < data.results.length; i++) {
        RESULTS_DIV.appendChild(renderDiscover(data.results[i]));
    }
}

function changePage() {
    if(state.search != "") {
        fetch(SEARCH_API + "&query=" + state.search + "&page=" + state.pageNumber)
        .then(handleResponse)
        .then(renderResultsDiscover)
        .catch(handleError);
        
    }else {
        fetch(DISCOVER_API + "&page=" + state.pageNumber + "&with_genres=" + state.genre)
        .then(handleResponse)
        .then(renderResultsDiscover)
        .catch(handleError);
    }

}

function openUrl(query) {
    window.location = "./movie.html" + "?id=" + query;
}

function renderDiscover(movie) {
    let card = document.createElement("a");
    card.className = 'card';
    card.classList.add("col-lg-3", "col-md-6", "col-sm-12", "pl-2");
    let img = card.appendChild(document.createElement("img"));
    if(movie.backdrop_path != undefined) {
        img.src = BACKDROP_URL + movie.backdrop_path;
    }else {
        img.src = "../img/noPoster.jpg";
    }
    img.classList.add("card-img-top");
    let title = card.appendChild(document.createElement("h4"));
    title.classList.add("card-title");
    title.textContent = movie.original_title;
    let descr = card.appendChild(document.createElement("p"));
    descr.classList.add("module");
    descr.textContent = movie.overview;

    card.addEventListener("click", function() {
        openUrl(movie.id);
    });

    return card;
}

function renderResultsGenre(data) {
    let allButton = GENRE_DIV.appendChild(document.createElement("button"));
    allButton.textContent = "All";
    allButton.classList.add("btn", "m-1", "btn-success", "btn-" + -1);

    allButton.addEventListener("click", function() {
        if(state.currGenre != -1) {
            updateButtonColor(-1);
        }
        state.currGenre = -1;
        state.genre = "";
        state.search = "";
        updatePage();
    });
    for(let i = 0; i < data.genres.length; i++) {
        GENRE_DIV.appendChild(renderGenre(data.genres[i], i));
    }
}

function renderGenre(genre, i) {
    let button = document.createElement("button");
    button.textContent = genre.name;
    button.classList.add("btn", "m-1", "btn-primary", "btn-" + i);
    button.addEventListener("click", function() {
        updateButtonColor(i);

        state.genre = genre.id;
        state.currGenre = i;
        state.search = "";
        updatePage();
    });

    return button;
}

function updateButtonColor(index) {
    if(state.currGenre != index) {
        let button = document.querySelector(".btn-" + index);
        button.classList.remove("btn-primary");
        button.classList.add("btn-success");
    
        let oldButton = document.querySelector(".btn-" + state.currGenre);
        oldButton.classList.add("btn-primary");
        oldButton.classList.remove("btn-success");
    }
}

document.querySelector("#search-form").addEventListener("submit", function(evt) {
    evt.preventDefault();
    state.search = this.querySelector("input").value;
    updateButtonColor(-1);
    updatePage();
});

function updatePage() {
    state.pageNumber = 1;
    changePage();
}

function handleResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        return response.json()
            .then(function(err) {
                throw new Error(err.errorMessage);
            });
    }
}


function handleError(err) {
    console.error(err);
    ERROR_ALERT_DIV.textContent = err.message;
    ERROR_ALERT_DIV.classList.remove("d-none");
}

// Called when the page is first loaded
firstLoad();