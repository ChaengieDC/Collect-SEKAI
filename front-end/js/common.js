// JS du MENU
/* ------- */

// Événement permettant d'afficher ou masquer le menu de filtrage sur les versions MOBILE
if(["/characters.html", "/songs.html", "/cards.html"].includes(window.location.pathname)){
    const toggleButton = document.querySelector("#toggleForm");
    const form = document.querySelector("form");
    toggleButton.addEventListener("click", () =>{
        form.classList.toggle("d-none");
        // Pour déplacer la position du bouton selon si le menu est affiché ou masqué
        if(form.classList.contains("d-none")){
            toggleButton.style.right = "-1px";
        } else{
            toggleButton.style.right = "234px";
        }
    });  
}

// Pour recharger la page après le reset du menu de filtrage
if(["/characters.html", "/songs.html", "/cards.html"].includes(window.location.pathname)){
    const resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", () =>{
        location.reload();
    });
}


/* JS du POP-UP */
/* ------------ */
/* ------------ */

// Fonction d'arrêt de l'audio
function stopAudio(){
    // Pour les chansons
    const songAudio = document.querySelector("#song-popup-songAudio");
    if(songAudio){
        songAudio.pause();
        songAudio.currentTime = 0;
    }

    // Pour les citations des cartes
    const voicedQuote = document.querySelector("#card-popup-voicedQuote");
    if(voicedQuote){
        voicedQuote.pause();
        voicedQuote.currentTime = 0;
    }
}

// Fonction de réinitialisation des clips
function resetMVs(){
    const mv2dButton = document.querySelector("#mv2dSelector");
    const mv3dButton = document.querySelector("#mv3dSelector");
    const mv2dVideo = document.querySelector("#mv2dVideo");
    const mv3dVideo = document.querySelector("#mv3dVideo");

    document.querySelector(".mv-selectors").style.display = "";
    mv2dButton.style.display = "none";
    mv2dButton.disabled = false;
    mv3dButton.style.display = "none";
    mv3dButton.disabled = false;

    document.querySelector(".container-mv").style.display = "";
    mv2dVideo.style.display = "none";
    mv2dVideo.src = "";
    mv3dVideo.style.display = "none";
    mv3dVideo.src = "";
}

// Pour fermer le pop-up
// Via la croix
if(["/characters.html", "/songs.html", "/cards.html"].includes(window.location.pathname) || window.location.pathname.startsWith("/profile/")){
    const closeButton = document.querySelector(".close");
    const popupContainer = document.querySelector("#popup");
    const htmlScroll = document.querySelector("html");
    closeButton.addEventListener("click", () =>{
        popupContainer.style.display = "none";
        htmlScroll.style.overflow = "";
        document.body.style.overflow = "";

        // Arrêt de l'audio à la fermeture du pop-up
        stopAudio();     
        // Réinitialisation des clips
        if(window.location.pathname === "/songs.html"){
            resetMVs();
        }
    });
    // Via un clic en dehors de ce dernier
    popupContainer.addEventListener("click", (e) =>{
        const popup = document.querySelector(".popup-content");
        if(!popup.contains(e.target)){
            popupContainer.style.display = "none";
            htmlScroll.style.overflow = "";
            document.body.style.overflow = "";

            // Arrêt de l'audio à la fermeture du pop-up
            stopAudio();     
            // Réinitialisation des clips
            if(window.location.pathname === "/songs.html"){
                resetMVs();
            }
        }
    });
}