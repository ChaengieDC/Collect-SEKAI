// JS de la page des CARTES
/* --------------------- */

// Fonction pour récupérer les données des personnages et générer leur code HTML respectif
function generateCardsHTML(){
    fetch("http://localhost:3000/getAllCards")
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

                const cardWrapper = document.createElement("div");
                cardWrapper.className = "card-wrapper";

                const cardAttribute = document.createElement("img");
                cardAttribute.src = card.attributeIcon;
                cardAttribute.className = "attribute";
                cardAttribute.alt = card.attribute;
                cardAttribute.width = 20;
                cardAttribute.height = 20;

                const rarityWrapper = document.createElement("div");
                rarityWrapper.className = "rarity-wrapper";

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
                    rarityStar.src = card.rarityStars;
                    rarityStar.alt = card.rarity;
                    rarityStar.width = 20;
                    rarityStar.height = 20;
                
                    rarityWrapper.appendChild(rarityStar);
                }

                const cardUntrained = document.createElement("img");
                cardUntrained.src = card.card;
                cardUntrained.className = "card-untrained";
                cardUntrained.alt = card.charaName;
                cardUntrained.width = 215;
                cardUntrained.height = 123;

                const cardTrained = document.createElement("img");
                if(card.trainedCard){
                    cardWrapper.classList.add("has-trained-card");

                    cardTrained.src = card.trainedCard;
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

                cardCol.appendChild(cardWrapper);
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