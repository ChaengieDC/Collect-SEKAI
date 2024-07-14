// JS du PROFIL
/* --------- */

// Fonction pour récupérer les données d'un utilisateur et générer son profil
function generateProfileHTML(){
    // Pour séparer l'URL du profil en segments en utilisant "/" comme séparateur
    const profileURL = window.location.pathname.split("/");
    // On récupère l'ID utilisateur de l'URL, situé au 3ème segment (index 2 dans le tableau)
    const userID = profileURL[2];

    fetch(`/getUserByID/${userID}`)
        .then(response =>{
            return response.json();
        })
        .then(user =>{
            document.querySelector("title").innerText = user[0].nickname + " || Collect SEKAI";
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateProfileHTML();
});