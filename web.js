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


// Fonction pour récupérer les données des personnages et générer leur code HTML respectif
function generateCharactersHTML(){
    fetch("http://localhost:3000/getAllUnitsWithMembers")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            let charactersHTML = "";
            data.forEach((unit, index) =>{
                // isLastUnit = true SI l'index est celui de la dernière unité du tableau data
                const isLastUnit = index === data.length - 1;
                // SI (?) isLastUnit = true, alors unitClass appliquera la class "last-unit", SINON (:) elle sera vide
                const unitClass = isLastUnit ? "last-unit" : "";
                charactersHTML += 
                    `<img src="${unit.logo}" class="group-logo" alt="Logo ${unit.name}" width="150" height="63"></img>
                    <div class="row ${unitClass}">`;

                unit.members.forEach(member =>{
                    charactersHTML +=
                        `<div class="col" onclick="openPopup(${member.id})">
                            <img src="${member.charaFrame}" class="chara-pic" alt="${member.name}" width="195" height="250">
                            <h4 class="chara-name" style="color: ${unit.color}">${member.name}</h4>
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
    htmlScroll.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

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
            document.querySelector("#chara-popup-birthday").innerText = character.birthday;
            document.querySelector("#chara-popup-height").innerText = character.height + " cm";

            // Boucle pour ajouter certaines informations seulement si elles sont définies, et les cacher si elles ne le sont pas
            for(const property of ["school", "committee", "club", "partTimeJob", "hobbies", "specialty", "favoriteFood", "hatedFood", "dislikes"]){
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