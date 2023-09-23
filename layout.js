// JS du LAYOUT
/* --------- */

// Fonction qui permet de charger le CSS du layout
function loadCSS(){
    const cssLayout = document.createElement("link");
    cssLayout.rel = "stylesheet";
    cssLayout.href = "layout.css";
    document.head.appendChild(cssLayout);
}

// Fonction qui va permettre d'appliquer la classe "active" selon la page où l'utilisateur se trouve
function setNavBarActiveItem(){
    const navElements = document.querySelectorAll(".nav-link");
    const currentURL = window.location.href;
    navElements.forEach(navLink =>{
        if(navLink.href === currentURL){
            navLink.classList.add("active");
            navLink.setAttribute("aria-current", "page");
        }
    });
}

// Enfin, la fonction qui va permettre de charger TOUT le layout
function loadContent(file, targetElement){
    fetch(file)
        .then(response =>{
            return response.text();
        })
        .then(data =>{
            targetElement.innerHTML = data;
            loadCSS();
            setNavBarActiveItem();
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement: ${error}`);
        });
}
const headerElement = document.querySelector("header");
loadContent("nav.html", headerElement);
const footerElement = document.querySelector("footer");
loadContent("footer.html", footerElement);