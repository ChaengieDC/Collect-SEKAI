// JS du MENU
/* ------- */

// Événement permettant d'afficher ou masquer le menu de filtrage sur les versions mobiles
const toggleButton = document.querySelector("#toggleForm");
const form = document.querySelector("form");
toggleButton.addEventListener("click", () =>{
    form.classList.toggle("d-none");
    // Pour déplacer la position du bouton selon si le menu est affiché ou masqué
    if(form.classList.contains("d-none")){
        toggleButton.style.right = "-1px";
    } else{
        toggleButton.style.right = "234px";
    }
});

// Pour recharger la page après le reset du menu de filtrage
const resetButton = document.querySelector(".reset-button");
resetButton.addEventListener("click", () =>{
    location.reload();
});


/* JS du POP-UP */
/* ------------ */
/* ------------ */

// Pour fermer le pop-up
// Via la croix
const closeButton = document.querySelector(".close");
const popupContainer = document.querySelector("#popup");
const htmlScroll = document.querySelector("html");
closeButton.addEventListener("click", () =>{
    popupContainer.style.display = "none";
    htmlScroll.style.overflow = "";
    document.body.style.overflow = "";
});
// Via un clic en dehors de ce dernier
popupContainer.addEventListener("click", (e) =>{
    const popup = document.querySelector(".popup-content");
    if(!popup.contains(e.target)){
        popupContainer.style.display = "none";
        htmlScroll.style.overflow = "";
        document.body.style.overflow = "";
    }
});