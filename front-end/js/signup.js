// JS de la page d'INSCRIPTION
/* ------------------------ */

// Envoi du formulaire d'inscription (requête POST) au clic de l'utilisateur
document.querySelector("form").addEventListener("submit", async (event) =>{
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    // Efface les messages d'erreur précédents
    document.querySelector("#nicknameError").style.display = "none";
    document.querySelector("#nickname").classList.remove("error-margin");
    document.querySelector("#emailError").style.display = "none";
    document.querySelector("#email").classList.remove("error-margin");
    document.querySelector("#passwordError").style.display = "none";
    document.querySelector("#confirmPassword").classList.remove("error-margin");

    const formData = new FormData(event.target);
    // Pour récupérer toutes les valeurs du formulaire et les transformer en objet JavaScript
    const data = Object.fromEntries(formData.entries());

    fetch("/createUser", {
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
                } else if(errorType === "nickname"){
                    document.querySelector("#nicknameError").style.display = "block";
                    document.querySelector("#nickname").classList.add("error-margin");
                } else if(errorType === "email"){
                    document.querySelector("#emailError").style.display = "block";
                    document.querySelector("#email").classList.add("error-margin");
                } else if(errorType === "password"){
                    document.querySelector("#passwordError").style.display = "block";
                    document.querySelector("#confirmPassword").classList.add("error-margin");
                }
            } else {
                window.location.href = "/login.html";
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors de création du compte: ${error}`);
        });
});