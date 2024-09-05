// JS de la page d'INSCRIPTION
/* ------------------------ */

document.querySelector("form").addEventListener("submit", async (event) =>{
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    // Efface les messages d'erreur précédents
    document.querySelector("#nicknameError").style.display = "none";
    document.querySelector("#nickname").classList.remove("error-margin");
    document.querySelector("#emailError").style.display = "none";
    document.querySelector("#email").classList.remove("error-margin");
    document.querySelector("#passwordError").style.display = "none";
    document.querySelector("#confirmPassword").classList.remove("error-margin");

    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const birthdate = document.getElementById("birthdate").value;
    const checkboxDate = document.getElementById("checkboxDate").checked ? "on" : "off";

    fetch("/createUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname, email, password, confirmPassword, birthdate, checkboxDate })
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