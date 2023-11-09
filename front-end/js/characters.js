// JS de la page des PERSONNAGES
/* -------------------------- */

// Fonction pour récupérer les données des personnages et générer leur code HTML respectif
function generateCharactersHTML(){
    fetch("http://localhost:3000/getAllUnitsWithMembers")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const lastUnit = data[data.length - 1];
            let charactersHTML = "";

            data.forEach(unit =>{
                // SI le groupe en question est le dernier groupe ALORS on lui donne la classe last-unit, SINON rien
                const unitClass = unit === lastUnit ? "last-unit" : "";
                charactersHTML += 
                    `<img src="${unit.logo}" class="group-logo" alt="Logo ${unit.name}" width="150" height="63"></img>
                    <div class="row ${unitClass}">`;

                unit.members.forEach(member =>{
                    charactersHTML +=
                        `<div class="col" onclick="openPopup(${member.id})">
                            <img src="${member.charaFrame}" class="chara-pic" alt="${member.name}" width="195" height="250">
                            <h4 class="chara-name" style="color: ${unit.color};">${member.name}</h4>
                        </div>`;
                });

                charactersHTML +=
                    `</div>
                    <hr>`;
            });
            document.querySelector(".container-chara").innerHTML = charactersHTML;
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateCharactersHTML();
});


// Pour ouvrir le pop-up contenant les informations du personnage sélectionné
function openPopup(characterID){
    const popupContainer = document.querySelector("#charapopup");
    popupContainer.style.display = "block";

    // Pour empêcher de scroll sur la page en arrière-plan
    const htmlScroll = document.querySelector("html");
    htmlScroll.style.overflowY = "hidden";

    // Remettre la page en haut lors de l'ouverture du pop-up
    popupContainer.scrollTop = 0;

    // Permet de récupérer les données json des personnages
    fetch("http://localhost:3000/getCharacterByID/" + characterID)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const character = data[0];
            document.querySelector("#chara-popup-name").innerText = character.name;

            document.querySelector("#chara-popup-img").src = character.img;
            document.querySelector("#chara-popup-img").alt = character.name;

            document.querySelector("#chara-popup-introduction").innerText = character.introduction;
            document.querySelector("#chara-popup-unit").innerText = character.unitName;
            document.querySelector("#chara-popup-position").innerText = character.position;
            document.querySelector("#chara-popup-gender").innerText = character.gender;
            document.querySelector("#chara-popup-birthday").innerText = character.birthday + "\n" + character.astrologicalSign;
            document.querySelector("#chara-popup-height").innerText = character.height + " cm";

            // Pour ajouter certaines informations seulement si elles sont définies, et les cacher si elles ne le sont pas
            if(!character.school){
                document.querySelector("#chara-popup-school").parentNode.style.display = "none";
            } else{
                document.querySelector("#chara-popup-school").innerText = character.school + "\n" + character.schoolClass;
            }
            // Boucle pour alléger le code
            for(const property of ["committee", "club", "partTimeJob", "hobbies", "specialty", "favoriteFood", "hatedFood", "dislikes"]){
                const element = document.querySelector(`#chara-popup-${property}`);
                element.innerText = character[property];
                if(!character[property]){
                    element.parentNode.style.display = "none";
                } else{
                    element.parentNode.style.display = "";
                }
            }

            document.querySelector("#chara-popup-color").innerText = character.color;
            // Pour la couleur du personnage en question
            document.querySelector("#chara-popup-color").style.color = character.color;

            document.querySelector("#chara-popup-voice").innerText = character.voice;
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du pop-up: ${error}`);
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

// Envoi du formulaire de filtrage (requête GET) au clic de l'utilisateur
document.querySelector("form").addEventListener("submit", function (event){
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    const formData = new FormData(this);
    const searchTerm = formData.get("searchBar");
    const selectedUnit = formData.get("unit");
    const selectedSchool = formData.get("school");
    const selectedGender = formData.get("gender");
    const selectedAstrologicalSign = formData.get("astrologicalSign");
    const url = form.action;
    // Envoi d'une requête au serveur pour récupérer les personnages filtrés
    fetch(`${url}?searchBar=${searchTerm}&unit=${selectedUnit}&school=${selectedSchool}&gender=${selectedGender}&astrologicalSign=${selectedAstrologicalSign}`)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Mettez à jour l'affichage avec les personnages filtrés
            updateCharacterList(data);
            // Remettre la page en haut lors de la réorganisation des personnages
            window.scrollTo(0, 0);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du filtrage des personnages: ${error}`);
        });
});
// Fonction pour réorganiser la liste des personnages
function updateCharacterList(data){
    document.querySelector(".container-chara").style.paddingBottom = "30px";
    let charactersHTML = "";
    
    if(data.length === 0){
        charactersHTML +=
            `<div class="no-result">
                <p>Pas de résultat.</p>
            </div`;
    } else{
        charactersHTML += `<div class="row characters-grid">`;
        
        data.forEach(member =>{
            charactersHTML +=
                `<div class="col" onclick="openPopup(${member.id})" style="margin-top: 30px;">
                    <img src="${member.charaFrame}" class="chara-pic" alt="${member.name}" width="195" height="250">
                    <h4 class="chara-name" style="color: ${member.unitColor}; margin-bottom: 0;">${member.name}</h4>
                </div>`;
        });

        charactersHTML += `</div>`;
    }

    document.querySelector(".container-chara").innerHTML = charactersHTML;
}