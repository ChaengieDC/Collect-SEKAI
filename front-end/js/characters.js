// JS de la page des PERSONNAGES
/* -------------------------- */

// Fonction pour récupérer les données des personnages et générer leur code HTML respectif
function generateCharactersHTML(){
    fetch("/getAllUnitsWithMembers")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const lastUnit = data[data.length - 1];

            data.forEach(unit =>{
                // SI le groupe en question est le dernier groupe ALORS on lui donne la classe last-unit, SINON rien
                const unitClass = unit === lastUnit ? "last-unit" : "";

                const unitLogo = document.createElement("img");
                unitLogo.src = "/img/units/" + unit.logo;
                unitLogo.className = "unit-logo";
                unitLogo.alt = `Logo ${unit.name}`;
                unitLogo.width = 150;
                unitLogo.height = 63;

                const unitsRow = document.createElement("div");
                unitsRow.className = `row ${unitClass}`;

                unit.members.forEach(member =>{
                    const memberCol = document.createElement("div");
                    memberCol.className = "col";
                    memberCol.style.marginTop = "30px";

                    const charaWrapper = document.createElement("div");
                    charaWrapper.className = "chara-wrapper";
                    charaWrapper.style.display = "inline-block";

                    const charaPic = document.createElement("img");
                    charaPic.src = "/img/chara/" + member.charaFrame;
                    charaPic.className = "chara-pic";
                    charaPic.alt = member.name;
                    charaPic.width = 195;
                    charaPic.height = 250;
                    charaPic.onclick = () => openPopup(member.id);

                    const charaName = document.createElement("h4");
                    charaName.className = "chara-name";
                    charaName.style.color = unit.color;
                    charaName.textContent = member.name;

                    charaWrapper.appendChild(charaPic);
                    charaWrapper.appendChild(charaName);
                    memberCol.appendChild(charaWrapper);
                    unitsRow.appendChild(memberCol);
                });

                const containerChara = document.querySelector(".container-chara");
                containerChara.appendChild(unitLogo);
                containerChara.appendChild(unitsRow);
                containerChara.appendChild(document.createElement("hr"));
            });
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
    const popupContainer = document.querySelector("#popup");
    popupContainer.style.display = "block";

    // Pour empêcher de scroll sur la page en arrière-plan
    const htmlScroll = document.querySelector("html");
    htmlScroll.style.overflowY = "hidden";

    // Remettre la page en haut lors de l'ouverture du pop-up
    popupContainer.scrollTop = 0;

    // Permet de récupérer les données json des personnages
    fetch("/getCharacterByID/" + characterID)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const character = data[0];
            document.querySelector("#chara-popup-name").innerText = character.name;

            document.querySelector("#chara-popup-img").src = "/img/cards/" + character.img;
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
                document.querySelector("#chara-popup-school").parentNode.style.display = "";
            }
            // Boucle pour alléger le code
            for(const property of ["committee", "club", "partTimeJob", "hobbies", "specialty", "favoriteFood", "hatedFood", "dislikes"]){
                const element = document.querySelector(`#chara-popup-${property}`);
                if(!character[property]){
                    element.parentNode.style.display = "none";
                } else{
                    element.innerText = character[property];
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
            // Pour update l'affichage avec les personnages filtrés
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
    const containerChara = document.querySelector(".container-chara");
    containerChara.style.paddingBottom = "30px";

    // Boucle qui retire tous les éléments à chaque recherche pour éviter une duplication
    while(containerChara.firstChild){
        containerChara.removeChild(containerChara.firstChild);
    }

    if(data.length === 0){
        const noResult = document.createElement("div");
        noResult.className = "no-result";

        const textResult = document.createElement("p");
        textResult.textContent = "Pas de résultat."

        noResult.appendChild(textResult);
        containerChara.appendChild(noResult);
    } else{
        const charaRow = document.createElement("div");
        charaRow.className = "row characters-grid"

        data.forEach(member =>{
            const memberCol = document.createElement("div");
            memberCol.className = "col";
            memberCol.style.marginTop = "30px";

            const charaWrapper = document.createElement("div");
            charaWrapper.className = "chara-wrapper";
            charaWrapper.style.display = "inline-block";

            const charaPic = document.createElement("img");
            charaPic.src = "/img/chara/" + member.charaFrame;
            charaPic.className = "chara-pic";
            charaPic.alt = member.name;
            charaPic.width = 195;
            charaPic.height = 250;
            charaPic.onclick = () => openPopup(member.id);

            const charaName = document.createElement("h4");
            charaName.className = "chara-name";
            charaName.style.color = member.unitColor;
            charaName.textContent = member.name;

            charaWrapper.appendChild(charaPic);
            charaWrapper.appendChild(charaName);
            memberCol.appendChild(charaWrapper);
            charaRow.appendChild(memberCol);
        });

        containerChara.appendChild(charaRow);
    }
}