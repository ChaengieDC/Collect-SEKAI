// JS de la page des CHANSONS
/* ----------------------- */

// Fonction pour récupérer les données des personnages et générer leur code HTML respectif
function generateSongsHTML(){
    fetch("/getAllSongs")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Tri des données par ID de façon décroissante (les plus récentes en haut)
            data.sort((a, b) => b.id - a.id);

            const songsRow = document.createElement("div");
            songsRow.className = `row songs-grid`;

            data.forEach(song =>{
                const songCol = document.createElement("div");
                songCol.className = "col";
                songCol.style.marginTop = "30px";

                const songCover = document.createElement("img");
                songCover.src = "/img/covers/" + song.cover;
                songCover.className = "song-cover";
                songCover.alt = song.title;
                songCover.width = 250;
                songCover.height = 250;
                songCover.onclick = () => openPopup(song.id);

                songCol.appendChild(songCover);
                songsRow.appendChild(songCol);
            });

            const containerSong = document.querySelector(".container-song");
            containerSong.appendChild(songsRow);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateSongsHTML();
});


// Pour ouvrir le pop-up contenant les informations de la chanson sélectionnée
function openPopup(songID){
    const popupContainer = document.querySelector("#popup");
    popupContainer.style.display = "block";

    // Pour empêcher de scroll sur la page en arrière-plan
    const htmlScroll = document.querySelector("html");
    htmlScroll.style.overflowY = "hidden";

    // Remettre la page en haut lors de l'ouverture du pop-up
    popupContainer.scrollTop = 0;

    // Permet de récupérer les données json des personnages
    fetch("/getSongByID/" + songID)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const song = data[0];
            document.querySelector("#song-popup-title").innerText = song.title;

            document.querySelector("#song-popup-cover").src = "/img/covers/" + song.cover;
            document.querySelector("#song-popup-cover").alt = song.title;

            document.querySelector("#song-popup-unit").src = "/img/units/" + song.unitLogo;
            document.querySelector("#song-popup-unit").alt = song.unitName;
            document.querySelector("#song-popup-songAudio").src = "/sound/songs/" + song.songAudio;

            document.querySelector("#song-popup-type").innerText = song.type;
            document.querySelector("#song-popup-easy").innerText = "Nv. " + song.easyLevel + "\n" + song.easyNotes + " notes";
            document.querySelector("#song-popup-normal").innerText = "Nv. " + song.normalLevel + "\n" + song.normalNotes + " notes";
            document.querySelector("#song-popup-hard").innerText = "Nv. " + song.hardLevel + "\n" + song.hardNotes + " notes";
            document.querySelector("#song-popup-expert").innerText = "Nv. " + song.expertLevel + "\n" + song.expertNotes + " notes";
            document.querySelector("#song-popup-master").innerText = "Nv. " + song.masterLevel + "\n" + song.masterNotes + " notes";

            // Pour ajouter certaines informations seulement si elles sont définies, et les cacher si elles ne le sont pas
            if(!song.appendLevel){
                document.querySelector("#song-popup-append").parentNode.style.display = "none";
            } else{
                document.querySelector("#song-popup-append").innerText = "Nv. " + song.appendLevel + "\n" + song.appendNotes + " notes";
                document.querySelector("#song-popup-append").parentNode.style.display = "";
            }

            document.querySelector("#song-popup-bpm").innerText = song.bpm;
            document.querySelector("#song-popup-arranger").innerText = song.arranger;
            document.querySelector("#song-popup-composer").innerText = song.composer;
            document.querySelector("#song-popup-lyricist").innerText = song.lyricist;

            // Génération des clips
            const mv2dButton = document.querySelector("#mv2dSelector");
            const mv3dButton = document.querySelector("#mv3dSelector");
            const mv2dVideo = document.querySelector("#mv2dVideo");
            const mv3dVideo = document.querySelector("#mv3dVideo");

            if(song.mv){
                if(song.mv.includes("Clip 2D, Clip 3D")){
                    mv2dButton.style.display = "inline-block";
                    mv3dButton.style.display = "inline-block";
    
                    mv2dVideo.style.display = "inline-block";
                    mv2dVideo.src = song.mv2dLink + "&enablejsapi=1";
    
                    mv2dButton.addEventListener("click", () =>{
                        mv3dVideo.style.display = "none";
                        // Message vers l'API de YouTube pour arrêter la vidéo
                        mv3dVideo.contentWindow.postMessage('{"event":"command","func":"stopVideo"}', 'https://www.youtube.com');
    
                        mv2dVideo.style.display = "inline-block";
                        mv2dVideo.src = song.mv2dLink + "&enablejsapi=1";
                    });
                    mv3dButton.addEventListener("click", () =>{
                        mv2dVideo.style.display = "none";
                        // Message vers l'API de YouTube pour arrêter la vidéo
                        mv2dVideo.contentWindow.postMessage('{"event":"command","func":"stopVideo"}', 'https://www.youtube.com');
    
                        mv3dVideo.style.display = "inline-block";
                        mv3dVideo.src = song.mv3dLink + "&enablejsapi=1";
                    });
                } else if(song.mv.includes("Clip 2D")){
                    mv2dButton.style.display = "inline-block";
                    mv2dButton.disabled= true;
    
                    mv2dVideo.style.display = "inline-block";
                    mv2dVideo.src = song.mv2dLink;
                } else if(song.mv.includes("Clip 3D")){
                    mv3dButton.style.display = "inline-block";
                    mv3dButton.disabled= true;
    
                    mv3dVideo.style.display = "inline-block";
                    mv3dVideo.src = song.mv3dLink;
                }
            } else{
                document.querySelector(".mv-selectors").style.display = "none";
                document.querySelector(".container-mv").style.display = "none";
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du pop-up: ${error}`);
        });
}


// Envoi du formulaire de filtrage (requête GET) au clic de l'utilisateur
document.querySelector("form").addEventListener("submit", function (event){
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    
    const formData = new FormData(this);
    const searchTerm = formData.get("searchBar");
    const selectedUnit = formData.get("unit");
    const selectedType = formData.get("type");
    const selectedVideo = formData.get("mv");
    const url = form.action;
    // Envoi d'une requête au serveur pour récupérer les chansons filtrées
    fetch(`${url}?searchBar=${searchTerm}&unit=${selectedUnit}&type=${selectedType}&mv=${selectedVideo}`)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Pour update l'affichage avec les chansons filtrées
            updateSongList(data);
            // Remettre la page en haut lors de la réorganisation des chansons
            window.scrollTo(0, 0);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du filtrage des chansons: ${error}`);
        });
});
// Fonction pour réorganiser la liste des chansons
function updateSongList(data){
    const containerSong = document.querySelector(".container-song");

    // Boucle qui retire tous les éléments à chaque recherche pour éviter une duplication
    while(containerSong.firstChild){
        containerSong.removeChild(containerSong.firstChild);
    }

    if(data.length === 0){
        const noResult = document.createElement("div");
        noResult.className = "no-result";

        const textResult = document.createElement("p");
        textResult.textContent = "Pas de résultat."

        noResult.appendChild(textResult);
        containerSong.appendChild(noResult);
    } else{
        // Tri des données par ID de façon décroissante (les plus récentes en haut)
        data.sort((a, b) => b.id - a.id);

        const songsRow = document.createElement("div");
        songsRow.className = `row cards-grid`;

        data.forEach(song =>{
            const songCol = document.createElement("div");
            songCol.className = "col";
            songCol.style.marginTop = "30px";

            const songCover = document.createElement("img");
            songCover.src = "/img/covers/" + song.cover;
            songCover.className = "song-cover";
            songCover.alt = song.title;
            songCover.width = 250;
            songCover.height = 250;
            songCover.onclick = () => openPopup(song.id);

            songCol.appendChild(songCover);
            songsRow.appendChild(songCol);
        });

        containerSong.appendChild(songsRow);
    }
}