// JS de la page des CARTES
/* --------------------- */

// Fonction pour récupérer les données des personnages et générer leur code HTML respectif
function generateCardsHTML(){
    fetch("/getAllCards")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Tri des données par ID de façon décroissante (les plus récentes en haut)
            data.sort((a, b) => b.id - a.id);

            const cardsRow = document.createElement("div");
            cardsRow.className = `row cards-grid`;

            data.forEach(card =>{
                const cardCol = document.createElement("div");
                cardCol.className = "col";
                cardCol.style.marginTop = "40px";

                const cardElements = document.createElement("div");
                cardElements.className = "card-elements";

                const cardWrapper = document.createElement("div");
                cardWrapper.className = "card-wrapper";
                cardWrapper.style.display = "inline-block";
                cardWrapper.onclick = () => openPopup(card.id);

                const cardAttribute = document.createElement("img");
                cardAttribute.src = "/img/icons/" + card.attributeIcon;
                cardAttribute.className = "attribute";
                cardAttribute.alt = card.attribute;
                cardAttribute.width = 20;
                cardAttribute.height = 20;

                const rarityWrapper = document.createElement("div");
                rarityWrapper.className = "rarity-wrapper";

                // Ajoute la rareté selon les caractéristiques de la carte
                let nbStars = 1;
                if(card.rarity == "✰4"){
                    nbStars = 4;
                } else if(card.rarity == "✰3"){
                    nbStars = 3;
                } else if(card.rarity == "✰2"){
                    nbStars = 2;
                }
                for(let i=0; i<nbStars; i++){
                    const rarityStar = document.createElement("img");
                    rarityStar.src = "/img/icons/" + card.rarityStars;
                    rarityStar.alt = card.rarity;
                    rarityStar.width = 20;
                    rarityStar.height = 20;
                
                    rarityWrapper.appendChild(rarityStar);
                }

                const cardUntrained = document.createElement("img");
                cardUntrained.src = "/img/cards/" + card.card;
                cardUntrained.className = "card-untrained";
                cardUntrained.alt = card.charaName;
                cardUntrained.width = 215;
                cardUntrained.height = 123;

                const cardTrained = document.createElement("img");
                if(card.trainedCard){
                    cardElements.classList.add("has-trained-card");
    
                    cardTrained.src = "/img/cards/" + card.trainedCard;
                    cardTrained.className = "card-trained";
                    cardTrained.alt = card.charaName;
                    cardTrained.width = 215;
                    cardTrained.height = 123;
                }

                const addToCollection = document.createElement("button");
                addToCollection.type = "submit";
                addToCollection.value = "submit";
                addToCollection.className = "addcard-button";
                addToCollection.textContent = "+ Ajouter à ma collection";

                cardWrapper.appendChild(cardAttribute);
                cardWrapper.appendChild(rarityWrapper);
                cardWrapper.appendChild(cardUntrained);
    
                if(card.trainedCard){
                    cardWrapper.appendChild(cardTrained);
                }
    
                cardElements.appendChild(cardWrapper);
                cardCol.appendChild(cardElements);
                cardCol.appendChild(addToCollection);
                cardsRow.appendChild(cardCol);
            });

            const containerCard = document.querySelector(".container-card");
            containerCard.appendChild(cardsRow);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateCardsHTML();
});


// Pour ouvrir le pop-up contenant les informations de la carte sélectionnée
function openPopup(cardID){
    const popupContainer = document.querySelector("#popup");
    popupContainer.style.display = "block";

    // Pour empêcher de scroll sur la page en arrière-plan
    const htmlScroll = document.querySelector("html");
    htmlScroll.style.overflowY = "hidden";

    // Remettre la page en haut lors de l'ouverture du pop-up
    popupContainer.scrollTop = 0;

    // Permet de récupérer les données json des personnages
    fetch("/getCardByID/" + cardID)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const card = data[0];
            document.querySelector("#card-popup-title").innerText = card.title;

            // Pour cacher ou non le bouton interchangeant les cartes
            if(!card.trainedCard){
                document.querySelector(".swap-card").style.display = "none";
            } else{
                document.querySelector(".swap-card").style.display = "";

                // Bouton interchangeant les cartes
                let imageState = 1;
                document.querySelector(".swap-card").addEventListener("click", () =>{
                    if(imageState == 1){
                        document.querySelector("#card-popup-img").src = "/img/cards/" + card.trainedCard;
                        imageState = 2;
                    } else{
                        document.querySelector("#card-popup-img").src = "/img/cards/" + card.card;
                        imageState = 1;
                    }
                });
            }

            document.querySelector("#card-popup-img").src = "/img/cards/" + card.card;
            document.querySelector("#card-popup-img").alt = card.title;

            // Pour ajouter certaines informations seulement si elles sont définies, et les cacher si elles ne le sont pas
            if(!card.quote){
                document.querySelector("#card-popup-quote").style.display = "none";
                document.querySelector("#card-popup-voicedQuote").style.display = "none";
            } else{
                document.querySelector("#card-popup-quote").innerText = `"` + card.quote + `"`;
                document.querySelector("#card-popup-quote").style.display = "";
                document.querySelector("#card-popup-voicedQuote").src = "/sound/quotes/" + card.voicedQuote;
                document.querySelector("#card-popup-voicedQuote").style.display = "";
            }

            document.querySelector("#card-popup-chara").innerText = card.charaName;

            const popupRarity = document.querySelector("#card-popup-rarity");
            // Boucle qui retire tous les éléments à chaque ouverture du pop-up pour éviter une duplication
            while(popupRarity.firstChild){
                popupRarity.removeChild(popupRarity.firstChild);
            }

            // Puis on les rajoute selon les caractéristiques de la carte
            let nbStars = 1;
            if(card.rarity == "✰4"){
                nbStars = 4;
            } else if(card.rarity == "✰3"){
                nbStars = 3;
            } else if(card.rarity == "✰2"){
                nbStars = 2;
            }
            for(let i=0; i<nbStars; i++){
                const rarityStar = document.createElement("img");
                rarityStar.src = "/img/icons/" + card.rarityStars;
                rarityStar.alt = card.rarity;
                rarityStar.width = 25;
                rarityStar.height = 25;
            
                popupRarity.appendChild(rarityStar);
            }

            document.querySelector("#card-popup-attribute").src = "/img/icons/" + card.attributeIcon;
            document.querySelector("#card-popup-attribute").alt = card.attribute;
            document.querySelector("#card-popup-attribute").width = 25;
            document.querySelector("#card-popup-attribute").height = 25;

            document.querySelector("#card-popup-skillName").innerText = card.skillName;
            document.querySelector("#card-popup-releaseDate").innerText = "//WIP...";
            document.querySelector("#card-popup-gacha").innerText = "//WIP...";
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
    const selectedCharacter = formData.get("character");
    const selectedUnit = formData.get("unit");
    const selectedRarity = formData.get("rarity");
    const selectedAttribute = formData.get("attribute");
    const url = form.action;
    // Envoi d'une requête au serveur pour récupérer les cartes filtrées
    fetch(`${url}?searchBar=${searchTerm}&character=${selectedCharacter}&unit=${selectedUnit}&rarity=${selectedRarity}&attribute=${selectedAttribute}`)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Pour update l'affichage avec les cartes filtrées
            updateCardList(data);
            // Remettre la page en haut lors de la réorganisation des cartes
            window.scrollTo(0, 0);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du filtrage des cartes: ${error}`);
        });
});
// Fonction pour réorganiser la liste des personnages
function updateCardList(data){
    const containerCard = document.querySelector(".container-card");
    containerCard.style.paddingBottom = "30px";

    // Boucle qui retire tous les éléments à chaque ouverture du pop-up pour éviter une duplication
    while(containerCard.firstChild){
        containerCard.removeChild(containerCard.firstChild);
    }

    if(data.length === 0){
        const noResult = document.createElement("div");
        noResult.className = "no-result";

        const textResult = document.createElement("p");
        textResult.textContent = "Pas de résultat."

        noResult.appendChild(textResult);
        containerCard.appendChild(noResult);
    } else{
        // Tri des données par ID de façon décroissante (les plus récentes en haut)
        data.sort((a, b) => b.id - a.id);

        const cardsRow = document.createElement("div");
        cardsRow.className = `row cards-grid`;

        data.forEach(card =>{
            const cardCol = document.createElement("div");
            cardCol.className = "col";
            cardCol.style.marginTop = "40px";

            const cardElements = document.createElement("div");
            cardElements.className = "card-elements";

            const cardWrapper = document.createElement("div");
            cardWrapper.className = "card-wrapper";
            cardWrapper.style.display = "inline-block";
            cardWrapper.onclick = () => openPopup(card.id);

            const cardAttribute = document.createElement("img");
            cardAttribute.src = "/img/icons/" + card.attributeIcon;
            cardAttribute.className = "attribute";
            cardAttribute.alt = card.attribute;
            cardAttribute.width = 20;
            cardAttribute.height = 20;

            const rarityWrapper = document.createElement("div");
            rarityWrapper.className = "rarity-wrapper";

            // Ajoute la rareté selon les caractéristiques de la carte
            let nbStars = 1;
            if(card.rarity == "✰4"){
                nbStars = 4;
            } else if(card.rarity == "✰3"){
                nbStars = 3;
            } else if(card.rarity == "✰2"){
                nbStars = 2;
            }
            for(let i=0; i<nbStars; i++){
                const rarityStar = document.createElement("img");
                rarityStar.src = "/img/icons/" + card.rarityStars;
                rarityStar.alt = card.rarity;
                rarityStar.width = 20;
                rarityStar.height = 20;
            
                rarityWrapper.appendChild(rarityStar);
            }

            const cardUntrained = document.createElement("img");
            cardUntrained.src = "/img/cards/" + card.card;
            cardUntrained.className = "card-untrained";
            cardUntrained.alt = card.charaName;
            cardUntrained.width = 215;
            cardUntrained.height = 123;

            const cardTrained = document.createElement("img");
            if(card.trainedCard){
                cardElements.classList.add("has-trained-card");

                cardTrained.src = "/img/cards/" + card.trainedCard;
                cardTrained.className = "card-trained";
                cardTrained.alt = card.charaName;
                cardTrained.width = 215;
                cardTrained.height = 123;
            }

            const addToCollection = document.createElement("button");
            addToCollection.type = "submit";
            addToCollection.value = "submit";
            addToCollection.className = "addcard-button";
            addToCollection.textContent = "+ Ajouter à ma collection";

            cardWrapper.appendChild(cardAttribute);
            cardWrapper.appendChild(rarityWrapper);
            cardWrapper.appendChild(cardUntrained);

            if(card.trainedCard){
                cardWrapper.appendChild(cardTrained);
            }

            cardElements.appendChild(cardWrapper);
            cardCol.appendChild(cardElements);
            cardCol.appendChild(addToCollection);
            cardsRow.appendChild(cardCol);
        });

        containerCard.appendChild(cardsRow);
    }
}