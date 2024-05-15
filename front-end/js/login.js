// JS de la page de CONNEXION
/* ----------------------- */

document.querySelector("form").addEventListener("submit", async (event) =>{
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    // Efface les messages d'erreur précédents
    document.querySelector("#loginError").style.display = "none";
    document.querySelector("#password").classList.remove("error-margin");

    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/loginUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nickname, password })
        })
        .then(response =>{
            return response.json();
        })
        .then(responseData =>{
            if(responseData.success === false){
                document.querySelector("#loginError").style.display = "block";
                document.querySelector("#password").classList.add("error-margin");
            } else{
                window.location.href = "http://127.0.0.1:5500/front-end/html/index.html";
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors de création du compte: ${error}`);
        });
});