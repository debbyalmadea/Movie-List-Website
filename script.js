const API_KEY = 'api_key=3646c928b1d09ad843c146504a0749e0';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?'+API_KEY

const main = document.getElementById("main")
const form = document.getElementById("form")
const search = document.getElementById("search")
const prevButton = document.getElementById("prev-page")
const nextButton = document.getElementById("next-page")

getMovies(API_URL);
function getMovies(url) {
    fetch(url).then(res => res.json()).then(data =>{
        console.log(data.results);
        if (data.results.length !== 0) {
          showMovies(data.results);
          current_page = data.page;
          next_page = current_page + 1;
          prev_page = current_page - 1;
          total_pages = data.total_pages

          if (current_page <= 1) {
            prevButton.style.display = "none";
            nextButton.style.display = "block";
            nextButton.onclick = function() {pageCall(url, next_page)}
          }

          else if (current_page < total_pages) {
            prevButton.style.display = "block"
            nextButton.style.display = "block"
            nextButton.onclick = function() {pageCall(url, next_page)}
            prevButton.onclick = function() {pageCall(url, prev_page)}
          }
        } 
        else {
          main.innerHTML =`<h4>Pencarian tidak ditemukan</h4>`;
          prevButton.style.display = "none";
          nextButton.style.display = "none";
        }

    })
}

function showMovies(data) {
  main.innerHTML =``;
  data.forEach(movie => {
    const{id, title, poster_path, popularity, overview, release_date} = movie;
    const movieFormat = document.createElement('div');
    movieFormat.className = 'movie'
    movieFormat.onclick = function() {showModal(id);}
    movieFormat.innerHTML = `
    <img 
      src="${IMG_URL+poster_path}"
      alt="${title} poster"
    />
    <div class="movie-info">
      <h3 id="popularity" class="popularity">${popularity} popularity</h3>
      <h2 id="title">${title}</h2>
    </div>
    `;
    main.appendChild(movieFormat);
    
    const modalFormat = document.createElement('div');
    modalFormat.id = id
    modalFormat.className = 'modal'
    modalFormat.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick='closeModal(${id})'>&times;</span>
        <img
          src="${IMG_URL+poster_path}"
          alt="${title} poster"
        />
        <div class="modal-movie-info">
          <h1 id="title" class="movie-title">${title}</h1>
          <div class="modal-movie-detail">
            <h3 id="date" class="release-date">${release_date} |</h3>
            <h3 id="popularity" class="movie-popularity">${popularity} popularity</h3>
          </div>
        </div>
        <p class="movie-desc">
          ${overview}
        </p>
      </div>
    `;
    main.appendChild(modalFormat);
  });
}

function showModal(id) {
  var modal = document.getElementById(id)
  modal.style.display = "block"; 

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function closeModal(id) {
  var modal = document.getElementById(id)
  modal.style.display = "none"; 
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  if(searchTerm) {
      getMovies(SEARCH_URL+'&query='+searchTerm)
  }else{
      getMovies(API_URL);
  }

})


function pageCall(url, page) {
  page = page.toString()
  getMovies(url+'&page='+page)
}
