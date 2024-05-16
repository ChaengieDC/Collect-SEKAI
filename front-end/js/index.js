// JS de la page d'ACCUEIL
/* -------------------- */

// Fonction pour récupérer les trois dernières cartes ✰4 et générer leur code HTML respectif
function generateLast4StarsCardsHTML(){
    fetch("/get4StarsCards")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Va trier les cartes dans un tableau par leur ID en ordre décroissant
            data.sort((a, b) => b.id - a.id);
            // Puis garder seulement les 3 premières cartes du tableau (soit les dernières sorties)
            const cardsIndex = Math.min(2, data.length - 1);
 
            for(let i=0; i<=cardsIndex; i++){
                // SI la carte en question est la toute dernière ALORS on lui donne la classe active, SINON rien
                const cardClass = i === cardsIndex ? "active" : "";
                const card = data[i];

                const carouselItem = document.createElement("div");
                carouselItem.className = `carousel-item ${cardClass}`;

                const carouselImg = document.createElement("img");
                carouselImg.src = "/img/cards/" + card.trainedCard;
                carouselImg.className = "d-block w-100";
                carouselImg.alt = `${card.charaName} - ${card.title}`;

                const carouselCaption = document.createElement("div");
                carouselCaption.className = "carousel-caption d-none d-sm-block";

                const cardName = document.createElement("h5");
                cardName.className = "card-name";
                cardName.textContent = card.charaName;

                const cardQuote = document.createElement("p");
                cardQuote.textContent = `"${card.quote}"`;

                carouselCaption.appendChild(cardName);
                carouselCaption.appendChild(cardQuote);
                carouselItem.appendChild(carouselImg);
                carouselItem.appendChild(carouselCaption);

                const carousel = document.querySelector(".carousel-inner");
                carousel.appendChild(carouselItem);
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateLast4StarsCardsHTML();
});