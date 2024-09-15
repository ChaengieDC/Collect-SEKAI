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
});