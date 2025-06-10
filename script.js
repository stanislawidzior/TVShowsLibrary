//"use strict";

var fetchedShows = []
var apiSearchedMovies = [];
var apiSearch = false;
var favouriteShows = new Set();
let currentPage = 1;
const moviesPerPage = 10;
let maxPage = 10;
const rootUrl = `https://api.tvmaze.com/`
const found = localStorage.getItem("favouriteShows");
if (found !== null) {
  favouriteShows = new Set(JSON.parse(found));
}


const appContainer = document.getElementById('timeline-app');
const moviesContainer = createElement('div', ['relative','grid','grid-cols-1','sm:grid-cols-3','gap-4','items-stretch']);
const displayOptions = createElement('div', ['mb-10','bg-white','p-4','rounded-lg','shadow-md','relative',])
async function fetchContent(url){
        try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd HTTP przy pobieraniu użytkownika: ${odpowiedzUzytkownik.status}`);
        }
        let data = await response.json()
        let newdata
        if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('show')) {
            newdata = data.map(item => item.show);
            }else{

             newdata = data;
            }
        console.log(newdata)
        const simplifiedShows = newdata.map(film => ({id: film.id, name: film.name || "", image: film.image.medium ,
            premiered: film.premiered || "",genres: film.genres || [], rating: film.rating.average || null,summary: film.summary || ""
    }));
    
    console.log(simplifiedShows)
    console.log(data)
    return simplifiedShows;
        }catch(e){
        throw e
            }
}

function filterBy(kategoria){    
      return (a)=>{
        let present = false;
        a.genres.some(g=>{
            if(g==kategoria){
                present = true;
                return true;
            }else return false;
        })
        return present;        
    }
    }
function sortBy(fieldName){
      
          return fieldName == "rok" ? (a,b)=>new Date(b.premiered) - new Date(a.premiered) : (a,b)=>b.rating - a.rating
    }
  // global current filter
  var currentFilter = ()=>true;
  var currentSort = sortBy("ocena");
  var currentSearch = ""

let moviesTable = [];       
let currentMovieIndex = 0; 

// funkcja do szczegolow filmu
function showMovieDetails(film) {
    const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center';
  const modal = document.createElement('div');
  modal.className = 'bg-white p-6 rounded shadow-lg max-w-md';
  modal.innerHTML = film.summary;
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.className = 'mt-4 px-4 py-2 bg-blue-500 text-white rounded';
  closeButton.addEventListener('click', () => document.body.removeChild(overlay));
  modal.appendChild(closeButton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
// czytanie klawiatury
document.addEventListener("keydown", (e) => {
  if (moviesTable.length == 0) return;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    currentMovieIndex = (currentMovieIndex + 1) % moviesTable.length;
    moviesTable[currentMovieIndex].focus();
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    currentMovieIndex = (currentMovieIndex - 1 + moviesTable.length) % moviesTable.length;
    moviesTable[currentMovieIndex].focus();
  }
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

    // Funkcja pomocnicza do tworzenia elementów
    function createElement(tag, classNames = [], textContent = '') {
        const element = document.createElement(tag);
        if (classNames.length > 0) {
            element.className = classNames.join(' ');
        }
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    }
    function createSVGElement(tag, attributes = {}, children = []) {
  const xmlns = "http://www.w3.org/2000/svg";
  const element = document.createElementNS(xmlns, tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  children.forEach(child => element.appendChild(child));

  return element;
}
    // funkcje sortujace


    // Tworzenie Nagłówka Aplikacji
    function getHeader(){
    const header = createElement('header', ['mb-10', 'text-center','bg-blue-500','rounded-lg','p-8','shadow-md']);
    const mainTitle = createElement('h1', ['text-3xl', 'font-bold','text-white'], 'Biblioteka filmowa');
    header.appendChild(mainTitle);
    return header;
    }
    //
    // FILTRY SORTOWANIE
    //
    function getFilterOptions(){

    let onlyGenres = fetchedShows.flatMap(f=>f.genres);
    
    const kategorie = [...new Set(onlyGenres)];

  
    
    const filtersHeader = createElement('p', ['font-bold','my-2'],"Filtruj według gatunku");
    const filtersContainer = createElement('div', ['flex-1'],"");
    const filter = createElement('button',['bg-blue-500', 'p-2', 'text-white','rounded-md','mr-2'], "Wszystkie");
    filter.addEventListener("click", ()=> {
      currentFilter = () => true;
      renderMovies(currentFilter,filter)})
    filtersContainer.appendChild(filter);
    const fav = createElement('button',['bg-gray-200', 'p-2', 'text-black','rounded-md','mr-2'], "Ulubione");
     fav.addEventListener("click", ()=> {
      currentFilter = (f) => favouriteShows.has(f.id)
      renderMovies(currentFilter,fav)})
      filtersContainer.appendChild(fav)
    kategorie.forEach(kategoria =>{
        const filter1 = createElement('button',['bg-gray-200', 'p-2','rounded-md','mr-2'], kategoria);
        filtersContainer.appendChild(filter1);
       filter1.addEventListener("click",() =>{
        currentFilter = filterBy(kategoria)
        renderMovies(currentFilter,filter1)});
    })

    displayOptions.appendChild(filtersHeader);
    displayOptions.appendChild(filtersContainer);
    
    const sortingHeader = createElement('p', ['font-bold','my-2'],"Sortuj według");
    const sortingContainer = createElement('div', ['flex-1'],"");
    const sortOpt = createElement('button',['bg-blue-500', 'p-2', 'text-white','rounded-md','mr-2'], "Oceny (najlepsze)");
    sortOpt.addEventListener("click",()=>{
      currentSort = sortBy("ocena")
      renderMovies(currentFilter,sortOpt, currentSort )})
    const sortOpt1 = createElement('button',['bg-gray-200', 'p-2', 'text-black','rounded-md','mr-2'], "Roku (najnowsze)");
    sortOpt1.addEventListener("click",()=>{
      currentSort = sortBy("rok");
      renderMovies(currentFilter,sortOpt1, currentSort )})
    
    displayOptions.appendChild(sortingHeader)
    
    sortingContainer.appendChild(sortOpt)
    sortingContainer.appendChild(sortOpt1)
    displayOptions.appendChild(sortingContainer)

    return displayOptions;

  }
  // favourites

function addToFavourite(event, film) {
    const heartIcon = event.target
    const filmId = film.id
    if (!favouriteShows.has(filmId)) {
        favouriteShows.add(filmId)
        heartIcon.setAttribute("fill", "red")
        }  else {
            favouriteShows.delete(filmId)
            heartIcon.setAttribute("fill", "none")
        }

    localStorage.setItem("favouriteShows", JSON.stringify([...favouriteShows]))
}

  // wyszukiwanie w api
function getSearchApi(){
    const searchContainer = createElement('div', ['mb-10','bg-white','p-4','rounded-lg','shadow-md','relative','flex', 'items-center', 'gap-2']);
    const searchBar = createElement('input', ["flex-grow","p-2","border","border-gray-300","rounded","focus:outline-none","focus:ring-2","focus:ring-blue-400"])
    const searchButton = createElement('button',['bg-blue-500', 'p-2', 'text-white','rounded-md','mr-2'], "szukaj")
    searchBar.type = "text";
    searchBar.placeholder = "szukaj filmów api"
    searchButton.addEventListener("click",(e)=>{
      apiSearch = searchBar.value;
      if(apiSearch === ""){
        apiSearch = false
                   try{
        maxPage = Math.ceil(fetchedShows.length / 10);
        }catch(e){
            throw e
        }
        alert("search results cleared back to normal")
        renderMovies(currentFilter, "no", currentSort)
        getNavigation("clear");
      }else{
        "use strict";
        fetchContent(rootUrl + `search/shows?q=${apiSearch}`).then((wynik)=>{
        console.log(rootUrl + `search/shows?q=${apiSearch}`)
        console.log(wynik)

        apiSearchedMovies = wynik
        let counter = 0
        apiSearchedMovies.forEach(apiMovie => {
                    let exists = fetchedShows.some(fetchedMovie => fetchedMovie.id === apiMovie.id);
                     if (!exists) {
                        counter++;
                    fetchedShows.push(apiMovie);
                }});
        alert(`found ${counter} shows, all added to cache`)
                   try{
        maxPage = Math.ceil(apiSearchedMovies.length / 10);
        }catch(e){
            throw e
        }
        apiSearch = true;
        renderMovies(currentFilter, "no", currentSort)
        getNavigation("clear");
    }).catch(e=>{
      alert(e);
    });
        }
    })
    
    searchContainer.appendChild(searchBar);
    searchContainer.appendChild(searchButton);
    
    return searchContainer;
  }
  // wyszukiwanie
    function getSearch(){
    const searchContainer = createElement('div', ['mb-10','bg-white','p-4','rounded-lg','shadow-md','relative',]);
    const searchBar = createElement('input', ["w-full","p-2","border","border-gray-300","rounded","focus:outline-none","focus:ring-2","focus:ring-blue-400"])
    searchBar.type = "text";
    searchBar.placeholder = "szukaj filmów"
    searchBar.addEventListener("input", (e)=>{
      currentSearch = e.target.value;
      setTimeout(() => {
      renderMovies(currentFilter,"no",currentSort ,currentSearch);
      }, 500)

    })
    searchContainer.appendChild(searchBar);
    return searchContainer;
  }


    // Generowanie Kart Filmów
    function setMovies(filtrowanie = currentFilter, sortowanie = currentSort, searchValue = ""){

    moviesTable = []
    try{
      const filteredMovies = (apiSearch?apiSearchedMovies:fetchedShows)
        .filter(f => filtrowanie(f))
        .filter(film => film.name.toLowerCase().includes(searchValue.toLowerCase()))
        .sort((a, b) => sortowanie(a, b));
        const startIndex = (currentPage - 1) * moviesPerPage;
        const endIndex = startIndex + moviesPerPage;
        const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
        paginatedMovies.forEach(film =>{
        
        const movieContainer = createElement('div',[])
        const movieImage = createElement('img', ['w-48', 'h-auto', 'rounded','self-center']);
        movieImage.src = film.image;
        movieImage.alt = film.name;
        
        const movieTitle = createElement('p',['font-bold'],film.name);
        
        //const movieDirector = createElement ('p',[''],`Reżyser: ${film.network.country.name}`);
        
        const movieYear =  createElement ('p',[''],`Rok: ${film.premiered}`);
    
        const movieGenre =  createElement ('p',[''],`Gatunek: ${film.genres}`);
        let movieGrade;
        let movieGradebarParent;
        if(film.rating != null || film.rating != undefined){
        if(film.ocena < 5 ){
            r = 255;
            g = 255 * (film.rating/10) * 2
        }else{
            g = 255;
            r = 255 * (1 -(film.rating)/10)  * 3
        }
        movieGrade =  createElement ('p',[''],`Ocena: ${film.rating}`);
        movieGradebarParent = createElement('div',[`bg-gray-200`,`w-[100%]`, 'h-2','rounded-md'])
        movieGradebar = createElement('div',[`bg-[rgba(${r},${g},0,1)]`,`w-[${film.rating*10}%]`, 'h-2','rounded-md']);
        movieGradebarParent.appendChild(movieGradebar);
        }else{
            movieGrade = createElement('p',[],"empty value")
            movieGradebarParent = createElement('div',[`bg-gray-200`,`w-[100%]`, 'h-2','rounded-md'])
        }
        const xmlns = "http://www.w3.org/2000/svg";
        const heartIcon = document.createElementNS(xmlns, "svg");
        favouriteShows.has(film.id)?heartIcon.setAttribute("fill", "red"):(heartIcon.setAttribute("fill","none"));
        heartIcon.setAttribute("viewBox", "0 0 24 24");
        heartIcon.setAttribute("stroke-width", "1.5");
        heartIcon.setAttribute("stroke", "currentColor");
        heartIcon.setAttribute("class", "size-6");
        const path = document.createElementNS(xmlns, "path");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("d", "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z");
        heartIcon.appendChild(path);
        const heartContainer = createElement('div', ['bg-gray-200','w-[100%]', 'rounder-md'])
        heartIcon.addEventListener("click", e => addToFavourite(e, film))
        heartContainer.appendChild(heartIcon);
        movieContainer.appendChild(movieImage)
        movieContainer.appendChild(movieTitle)
        movieContainer.appendChild(movieYear)
        //movieContainer.appendChild(movieDirector)
        movieContainer.appendChild(movieGenre)
        movieContainer.appendChild(heartContainer)
        movieContainer.appendChild(movieGrade)
        movieContainer.appendChild(movieGradebarParent);
        moviesTable.push(movieContainer);
        movieContainer.tabIndex = 0;
        movieImage.addEventListener("click", ()=>showMovieDetails(film))
        movieContainer.addEventListener("keydown",(e) => {
          if(e.key == "Enter"){
            showMovieDetails(film)
          }
        })
        moviesContainer.appendChild(movieContainer)  
    
    })
    }catch(e){
        console.log(e)
    }
    return moviesContainer;
  }
 function renderMovies(filtrowanie, clicked, sortowanie,searchValue = ""){
    console.log("wpierdol")
  if(clicked != "no"){
  clicked.classList.remove("bg-gray-200", "text-black");
  clicked.classList.add("bg-blue-500", "text-white")
  Array.from(clicked.parentNode.children).filter((a)=>(a!=clicked)).forEach((a)=>{
    a.classList.remove("bg-blue-500", "text-white");
    a.classList.add("bg-gray-200", "text-black")
  })
}
  moviesContainer.innerHTML="";
   setMovies(filtrowanie, sortowanie,searchValue );
  }

  //NAWIGACJA
 const nav = createElement('nav', ['flex', 'flex-col', 'items-center', 'gap-4', 'mb-8', ]);
function getNavigation(clear) {
     if(clear = "clear"){
        nav.innerHTML = ""
     }
    
    const pageNumbersContainer = createElement('div', ['flex', 'space-x-2']);
    const totalPages = maxPage;
    let startPage = (totalPages - currentPage < 5)? Math.max(maxPage - 4, 1) : currentPage;
    let endPage = (totalPages - currentPage < 5)? maxPage : currentPage +4;
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createElement('button',['p-2','rounded-md','mr-2',i == currentPage ? 'bg-blue-500': 'bg-white',i == currentPage ? 'text-white': 'text-black'], i.toString());
        pageButton.addEventListener('click', (e) => {
            currentPage = i;
            renderMovies(currentFilter, e.target, currentSort, currentSearch);
            getNavigation();
        });
        pageNumbersContainer.appendChild(pageButton);
    }
     const navButtonsContainer = createElement('div', ['flex', 'space-x-4']);
    const prevButton = createElement('button', ['bg-white', 'p-2', 'text-black','rounded-md','mr-2'], 'Previous');
    const nextButton = createElement('button',['bg-white', 'p-2', 'text-black','rounded-md','mr-2'], 'Next');
      prevButton.addEventListener('click', (e) => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies(currentFilter, e.target, currentSort, currentSearch);
            getNavigation("clear");
        }
    });
    nextButton.addEventListener('click', (e) => {
        if (currentPage < totalPages) {
            currentPage++;
            renderMovies(currentFilter, e.target, currentSort, currentSearch);
            getNavigation("clear");
        }
    });
    const last = createElement('button', ['bg-white', 'p-2', 'text-black','rounded-md','mr-2'], 'Last');
    last.addEventListener('click', e => {
        currentPage = maxPage;
        renderMovies(currentFilter,e.target, currentSort, currentSearch);
        getNavigation("clear")
    })
        const first = createElement('button', ['bg-white', 'p-2', 'text-black','rounded-md','mr-2'], 'First');
    first.addEventListener('click', e => {
        currentPage = 1;
        renderMovies(currentFilter,e.target, currentSort, currentSearch);
        getNavigation("clear")
    })
    const lastButtonContainer = createElement('div', ['flex', 'space-x-4']);
    lastButtonContainer.appendChild(first)
    lastButtonContainer.appendChild(last);
    navButtonsContainer.appendChild(prevButton);
    navButtonsContainer.appendChild(nextButton);
    nav.appendChild(pageNumbersContainer);
    nav.appendChild(navButtonsContainer);
    nav.appendChild(lastButtonContainer);
    return nav;
}





// generowanie strony
function renderApp(){
    
    if (!appContainer) {
         console.error("Nie znaleziono kontenera #timeline-app");
         return;
    }

    // 4. Prosta Stopka
    const footer = createElement('footer', ['text-center', 'text-xs', 'text-gray-500', 'mt-10', 'pt-5', 'border-t']);
    footer.innerHTML = ` &copy; ${new Date().getFullYear()} Biblioteka filmowa | Stworzona z użyciem JavaScript i Tailwind CSS `;
    appContainer.appendChild(getHeader())
    appContainer.appendChild(getSearchApi());
    appContainer.appendChild(getFilterOptions());
    appContainer.appendChild(getSearch());
    appContainer.appendChild(setMovies())
    appContainer.appendChild(getNavigation())
    appContainer.appendChild(footer);

}
// pobieranie wstepnych danych
 fetchContent(rootUrl+"shows").then((wynik)=>{
        fetchedShows = wynik
                try{
        maxPage = Math.ceil(fetchedShows.length / 10);
        }catch(e){
            throw e
        }
      document.addEventListener('DOMContentLoaded', renderApp()) 
    }).catch(e=>{
      alert(e);
    });