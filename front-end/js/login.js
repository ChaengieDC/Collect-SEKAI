// JS de la page de CONNEXION
/* ----------------------- */

// Envoi du formulaire de connexion (requête POST) au clic de l'utilisateur
document.querySelector("form").addEventListener("submit", async (event) =>{
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    // Efface les messages d'erreur précédents
    document.querySelector("#loginError").style.display = "none";
    document.querySelector("#password").classList.remove("error-margin");

    const formData = new FormData(event.target);
    // Pour récupérer toutes les valeurs du formulaire et les transformer en objet JavaScript
    const data = Object.fromEntries(formData.entries());

    fetch("/loginUser", {
            method: "POST",
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
                if(errorType === "alreadyAuthenticated"){
                    window.location.href = "/";
                    return;
                } else if(errorType === "notMatching"){
                    document.querySelector("#loginError").style.display = "block";
                    document.querySelector("#password").classList.add("error-margin");
                }
            } else{
                window.location.href = "/";
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors de la connexion: ${error}`);
        });
});