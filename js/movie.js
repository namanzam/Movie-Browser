"use strict"

const MOVIE_URL = "https://api.themoviedb.org/3/movie/{movie_id}?api_key=1044ef1f18b82547c2c5d0057e925baf&language=en-US";
const POSTER_URL = "http://image.tmdb.org/t/p/w500//";
const ERROR_ALERT_DIV = document.querySelector("#error");

function firstLoad() {
    var urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    fetch(MOVIE_URL.replace("{movie_id}", id))
        .then(handleResponse)
        .then(renderResult)
        .catch(handleError);
}

function renderResult(movie) {
    let title = document.querySelector("#title");
    let tagline = document.querySelector("#tagline");
    let poster = document.querySelector("#poster");
    let overview = document.querySelector("#overview");
    let genres = document.querySelector("#genres");
    let production = document.querySelector("#production");
    let homepage = document.querySelector("#homepage");

    title.textContent = movie.original_title || "This movie has no title";
    tagline.textContent = movie.tagline || "No tagline for this movie";
    poster.src = POSTER_URL + movie.poster_path || "../img/noPoster.jpg";
    overview.textContent = movie.overview || "No overview for this movie";

    for(let i = 0; i < movie.genres.length - 1; i++) {
        genres.textContent += movie.genres[i].name + ", ";
    }
    if(movie.genres[movie.genres.length - 1] != undefined) {
        genres.textContent += movie.genres[movie.genres.length - 1].name;
    }else {
        genres.textContent += "No genres associated with this movie";
    }

    for(let i = 0; i < movie.production_companies.length - 1; i++) {
        production.textContent += movie.production_companies[i].name + ", ";
    }
    if(movie.production_companies[movie.production_companies.length - 1] != undefined) {
        production.textContent += movie.production_companies[movie.production_companies.length - 1].name;
    }else {
        production.textContent += "No production companies associated with this movie"
    }
    let homeText = document.querySelector("#homepage-text");
    if(movie.homepage != "") {
        homeText.textContent = "Link to movie homepage";
        homepage.href = movie.homepage;
    }
    
    
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

firstLoad();