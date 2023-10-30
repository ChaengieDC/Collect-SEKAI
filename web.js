// JS du SITE
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

// Pour ouvrir le pop-up contenant les informations du personnage sélectionné
function openPopup(characterJson){
    const popupContainer = document.querySelector("#charapopup");
    popupContainer.style.display = "block";

    // Pour empêcher de scroll sur la page en arrière-plan
    const htmlScroll = document.querySelector("html");
    htmlScroll.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Remettre la page en haut lors de l'ouverture du pop-up
    popupContainer.scrollTop = 0;

    // Permet de récupérer les données json des personnages
    fetch("data/characters/" + characterJson)
        .then(response =>{
            return response.json();
        })
        .then(characterData =>{
            document.querySelector("#chara-popup-name").innerText = characterData.name;

            document.querySelector("#chara-popup-img").src = characterData.img;
            document.querySelector("#chara-popup-img").alt = characterData.name;

            document.querySelector("#chara-popup-introduction").innerText = characterData.introduction;
            document.querySelector("#chara-popup-band").innerText = characterData.band;
            document.querySelector("#chara-popup-position").innerText = characterData.position;
            document.querySelector("#chara-popup-gender").innerText = characterData.gender;
            document.querySelector("#chara-popup-birthday").innerText = characterData.birthday;
            document.querySelector("#chara-popup-height").innerText = characterData.height + " cm";

            // Boucle pour ajouter certaines informations seulement si elles sont définies, et les cacher si elles ne le sont pas
            for(const property of ["school", "committee", "club", "partTimeJob", "hobbies", "specialty", "favoriteFood", "hatedFood", "dislikes"]){
                const element = document.querySelector(`#chara-popup-${property}`);
                element.innerText = characterData[property];
                if(!characterData[property]){
                    element.parentNode.style.display = "none";
                } else{
                    element.parentNode.style.display = "";
                }
            }

            document.querySelector("#chara-popup-color").innerText = characterData.color;
            // Pour la couleur du personnage en question
            document.querySelector("#chara-popup-color").style.color = characterData.color;

            document.querySelector("#chara-popup-voice").innerText = characterData.voice;
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du JSON: ${error}`);
        });
}

// Pour fermer le pop-up
// Via la croix
const closeButton = document.querySelector(".close");
const popupContainer = document.querySelector("#charapopup");
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