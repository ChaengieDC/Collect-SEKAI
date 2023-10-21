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
    const popup = document.querySelector("#charapopup");
    popup.style.display = "block";

    // Permet de récupérer les données json des personnages
    fetch("data/characters/" + characterJson)
        .then(response =>{
            return response.json();
        })
        .then(characterData =>{
            document.querySelector("#chara-popup-name").innerText = characterData.name;
            document.querySelector("#chara-popup-group").innerText = characterData.group;
            document.querySelector("#chara-popup-position").innerText = characterData.position;
            document.querySelector("#chara-popup-introduction").innerText = characterData.introduction;
            document.querySelector("#chara-popup-gender").innerText = characterData.gender;
            document.querySelector("#chara-popup-birthday").innerText = characterData.birthday;
            document.querySelector("#chara-popup-astrologicalSign").innerText = characterData.astrologicalSign;
            document.querySelector("#chara-popup-height").innerText = characterData.height;
            document.querySelector("#chara-popup-school").innerText = characterData.school;
            document.querySelector("#chara-popup-schoolClass").innerText = characterData.schoolClass;
            document.querySelector("#chara-popup-committee").innerText = characterData.committee;
            document.querySelector("#chara-popup-hobbies").innerText = characterData.hobbies;
            document.querySelector("#chara-popup-specialty").innerText = characterData.specialty;
            document.querySelector("#chara-popup-favoriteFood").innerText = characterData.favoriteFood;
            document.querySelector("#chara-popup-hatedFood").innerText = characterData.hatedFood;
            document.querySelector("#chara-popup-dislikes").innerText = characterData.dislikes;
            document.querySelector("#chara-popup-color").innerText = characterData.color;
            document.querySelector("#chara-popup-voice").innerText = characterData.voice;
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du JSON: ${error}`);
        });
}

// Pour fermer le pop-up
const closeButton = document.querySelector(".close");
const popup = document.querySelector("#charapopup");
closeButton.addEventListener("click", () =>{
    popup.style.display = "none";
});