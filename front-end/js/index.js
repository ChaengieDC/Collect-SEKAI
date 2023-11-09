// JS de la page d'ACCUEIL
/* -------------------- */

// Fonction pour récupérer les trois dernières cartes ✰4 et générer leur code HTML respectif
function generateLast4StarsCardsHTML(){
    fetch("http://localhost:3000/get4StarsCards")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const lastCard = data.length - 1;
            let cardsHTML = "";
 
            for(let i=(data.length - 1); i>=(data.length - 3); i--){
                // SI la carte en question est la toute dernière ALORS on lui donne la classe active, SINON rien
                const cardClass = i === lastCard ? "active" : "";
                const card = data[i];
                cardsHTML += 
                `<div class="carousel-item ${cardClass}">
                   <img src="${card.trainedCard}" class="d-block w-100" alt="${card.charaName} - ${card.title}">
                   <div class="carousel-caption d-none d-sm-block">
                       <h5 class="card-name">${card.charaName}</h5>
                       <p>"${card.quote}"</p>
                   </div>
                </div>`;
            }
            document.querySelector(".carousel-inner").innerHTML = cardsHTML;
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateLast4StarsCardsHTML();
});