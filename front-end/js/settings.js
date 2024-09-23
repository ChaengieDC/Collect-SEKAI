// JS des PARAMÈTRES
/* -------------- */

// Fonction pour récupérer les données d'un utilisateur et générer son profil
function generateSettingsHTML(){
    fetch("/getUserSettings")
        .then(response =>{
            return response.json();
        })
        .then(settings =>{
            document.querySelector("#userDesc").value = settings.description || "";
            document.querySelector("#favUnit").value = settings.favoriteUnit || "";
            document.querySelector("#favChara").value = settings.favoriteCharacter || "";
            document.querySelector("#favSong").value = settings.favoriteSong || "";

            if(settings.birthdate){
                // Création d'un objet date pour manipuler cette dernière
                const date = new Date(settings.birthdate);
                // Récupération de chaque élément de la date locale
                // padStart sert à avoir toujours deux chiffres pour les mois et les jours (ex: 01 au lieu de 1)
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés de 0 (janvier) à 11 (décembre), donc on ajoute 1 pour obtenir le format 1-12
                const day = String(date.getDate()).padStart(2, "0");
                // On la retranscrit au format YYYY-MM-DD (pour l'input type="date")
                const formattedDate = `${year}-${month}-${day}`;

                document.querySelector("#birthdate").value = formattedDate;
            } else{
                document.querySelector("#birthdate").value = "";
            }

            document.querySelector("#checkboxDate").checked = settings.displayBirthday || false;
            document.querySelector("#twitchLink").value = settings.twitchProfile || "";
            document.querySelector("#twitterLink").value = settings.twitterProfile || "";
            document.querySelector("#instagramLink").value = settings.instagramProfile || "";
            document.querySelector("#malLink").value = settings.myanimelistProfile || "";
            document.querySelector("#anilistLink").value = settings.anilistProfile || "";
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateSettingsHTML();
    displaySuggestionsList();
});


// Affichage de la liste de suggestions selon la recherche de l'utilisateur
document.querySelector("#favSong").addEventListener("input", function(){
    const songQuery = this.value;

    // Si la requête est trop courte, ne pas faire de recherche
    if(songQuery.length<3){
        const suggestionsList = document.querySelector(".suggestions-list");

        while(suggestionsList.firstChild){
            suggestionsList.removeChild(suggestionsList.firstChild);
        }

        displaySuggestionsList();
    } else{
        fetch(`/searchSongs?query=${encodeURIComponent(songQuery)}`)
            .then(response =>{
                return response.json();
            })
            .then(songs =>{
                const suggestionsList = document.querySelector(".suggestions-list");

                while(suggestionsList.firstChild){
                    suggestionsList.removeChild(suggestionsList.firstChild);
                }

                songs.forEach(song =>{
                    const songWrapper = document.createElement("div");
                    songWrapper.className = "song-wrapper";

                    const songCover = document.createElement("img");
                    songCover.src = "/img/covers/" + song.cover;
                    songCover.className = "song-cover";
                    songCover.alt = song.title;
                    songCover.width = 100;
                    songCover.height = 100;

                    const songTitle = document.createElement("div");
                    songTitle.className = "song-title";
                    songTitle.textContent = song.title;

                    songWrapper.appendChild(songCover);
                    songWrapper.appendChild(songTitle);
                    suggestionsList.appendChild(songWrapper);
                });

                displaySuggestionsList();
            })
            .catch(error => {
                console.error(`Une erreur est survenue lors du chargement des suggestions: ${error}`);
            });
    }
});
// Au clic de l'utilisateur sur une suggestion, on ajoute cette dernière à l'input
document.querySelector(".suggestions-list").addEventListener("click", (event) =>{
    if(event.target && event.target.matches(".song-title")){
        document.querySelector("#favSong").value = event.target.textContent;

        // Cacher la liste des suggestions après sélection
        const suggestionsList = document.querySelector(".suggestions-list");

        while (suggestionsList.firstChild) {
            suggestionsList.removeChild(suggestionsList.firstChild);
        }

        displaySuggestionsList();
    }
});
// Si l'utilisateur clique ailleurs: on cache la liste de suggestions
document.addEventListener("click", (event) =>{
    if(!event.target.matches("#favSong") && !event.target.matches(".suggestions-list")){
        const suggestionsList = document.querySelector(".suggestions-list");

        while(suggestionsList.firstChild){
            suggestionsList.removeChild(suggestionsList.firstChild);
        }

        displaySuggestionsList();
    }
});

// Fonction pour mettre à jour l'affichage de la liste des suggestions
function displaySuggestionsList(){
    const suggestionsList = document.querySelector(".suggestions-list");

    if(suggestionsList.children.length>0){
        suggestionsList.style.display = "block";
    } else{
        suggestionsList.style.display = "none";
    }
}


// Envoi du formulaire de modification (requête PUT) au clic de l'utilisateur
document.querySelector("form").addEventListener("submit", async (event) =>{
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const formData = new FormData(event.target);
    // Pour récupérer toutes les valeurs du formulaire et les transformer en objet JavaScript
    const data = Object.fromEntries(formData.entries());

    fetch("/updateUserProfile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(response =>{
            return response.json();
        })
        .then(responseData =>{
            if(responseData.success === false){
                const errorType = responseData.errorType;

                // Changements effectués selon le type d'erreur
                if(errorType === "notValid"){
                    document.querySelector("#notValidError").style.display = "block";
                    document.querySelector("#favSong").classList.add("error-margin");
                } else{
                    window.location.href = "/login.html";
                    return;
                }
            } else{
                    document.querySelector("#notValidError").style.display = "none";
                    document.querySelector("#favSong").classList.remove("error-margin");

                    const alert = document.querySelector("#alert");
                    alert.style.display = "block";
                
                    // Masquer après 3 secondes
                    setTimeout(() =>{
                        alert.style.display = "none";
                    }, 3000);
            }
        })
    .catch(error => {
        console.error(`Une erreur est survenue lors de la mise à jour du profil: ${error}`);
    });
});