// JS du LAYOUT
/* --------- */

// Fonction qui permet de charger le CSS du layout
function loadCSS(){
    const cssLayout = document.createElement("link");
    cssLayout.rel = "stylesheet";
    cssLayout.href = "/css/layout.css";
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
loadContent("/nav.html", headerElement);
const footerElement = document.querySelector("footer");
if(footerElement){
    loadContent("/footer.html", footerElement);
};

// Modification des éléments selon si un utilisateur est connecté ou non
fetch("/checkSession")
    .then(response =>{
        return response.json();
    })
    .then(connectionState =>{
        if(connectionState.success === true){
            // Modification du menu "Utilisateur" en "{Pseudo}"
            document.querySelector("#navbarFourthDropdownMenuLink").innerText = connectionState.nickname;

            document.querySelector("#loginLink").style.display = "none";
            document.querySelector("#registerLink").style.display = "none";
        } else{
            document.querySelector("#profileLink").style.display = "none";
            document.querySelector("#settingsLink").style.display = "none";
            document.querySelector("#logoutLink").style.display = "none";
        }
    })
    .catch(error =>{
        console.error(`Une erreur est survenue lors de la récupération de l'état d'authentification: ${error}`);
    });