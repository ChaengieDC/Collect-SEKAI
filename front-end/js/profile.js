// JS du PROFIL
/* --------- */

// Fonction pour récupérer les données d'un utilisateur et générer son profil
function generateProfileHTML(){
    // Pour séparer l'URL du profil en segments en utilisant "/" comme séparateur
    const profileURL = window.location.pathname.split("/");
    // On récupère l'ID utilisateur de l'URL, situé au 3ème segment (index 2 dans le tableau)
    const userID = profileURL[2];

    fetch(`/getUserProfileByID/${userID}`)
        .then(response =>{
            return response.json();
        })
        .then(user =>{
            document.querySelector("title").innerText = user.nickname + " || Collect SEKAI";

            const userInfoWrapper = document.createElement("div");
            userInfoWrapper.className = `user-info-wrapper`;

            const profilePicture = document.createElement("img");
            // SI l'utilisateur a changé son avatar ALORS on le lui donne, SINON on met l'avatar par défaut
            profilePicture.src = user.avatar ? user.avatar : "/img/default_pp.png";
            profilePicture.className = "profile-picture";
            profilePicture.alt = "Avatar";

            const userInfo = document.createElement("div");
            userInfo.className = `user-info`;

            const username = document.createElement("h4");
            username.className = "username";
            username.textContent = user.nickname;

            const userDesc = document.createElement("p");
            userDesc.className = "user-desc";
            // SI l'utilisateur possède une description ALORS on le lui donne, SINON on met la description par défaut
            userDesc.textContent = user.description ? user.description : "Sans titre.";

            const userBirthday = document.createElement("p");
            if(user.displayBirthday){
                userBirthday.className = "user-birthday";

                // On récupère la date enregistrée dans la BDD (au format ISO YYYY-MM-DD)
                const isoDate = user.birthdate;
                // Création d'un objet date pour manipuler cette dernière
                const date = new Date(isoDate);
                // On lui indique quels et comment afficher les éléments suivants
                const options = {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                };
                // On la retranscrit au format français selon les options sélectionnées
                const formattedDate = date.toLocaleDateString("fr-FR", options);

                userBirthday.textContent = formattedDate;
            }

            const socialWrapper = document.createElement("div");
            socialWrapper.className = "social-wrapper";

            const socialInfo = document.createElement("div");
            socialInfo.className = "social-info";

            const socialMedia = [
                { url: "https://www.twitch.tv/", username: user.twitchProfile, icon: "/img/social/twitch.png", alt: "Twitch" },
                { url: "https://x.com/", username: user.twitterProfile, icon: "/img/social/twitter.png", alt: "Twitter" },
                { url: "https://www.instagram.com/", username: user.instagramProfile, icon: "/img/social/instagram.png", alt: "Instagram" },
                { url: "https://myanimelist.net/profile/", username: user.myanimelistProfile, icon: "/img/social/myanimelist.png", alt: "MyAnimeList", style: true },
                { url: "https://anilist.co/user/", username: user.anilistProfile, icon: "/img/social/anilist.png", alt: "Anilist", style: true }
            ];
            socialMedia.forEach(media =>{
                // Pour chaque réseau social, on regarde si l'utilisateur l'a renseigné, et si oui, on l'ajoute
                if(media.username){
                    const socialLink = document.createElement("a");
                    socialLink.className = "social-link";
                    socialLink.href = media.url + media.username;
                    socialLink.setAttribute("target", "_blank");

                    const socialIcon = document.createElement("img");
                    socialIcon.src = media.icon;
                    socialIcon.alt = media.alt;
                    socialIcon.style.width = "auto";
                    socialIcon.height = "18";
                    if(media.style){
                        socialIcon.style.borderRadius = "10%";
                    }

                    socialLink.appendChild(socialIcon);
                    socialInfo.appendChild(socialLink);
                }
            });

            // Pour vérifier si des favoris ont été sélectionnés
            let hasFavorite = false;
            const favWrapper = document.createElement("div");
            favWrapper.className = "fav-wrapper";

            // Mapping pour "Groupe préféré"
            const unitNames = {
                1: "Leo/need",
                2: "MORE MORE JUMP!",
                3: "Vivid BAD SQUAD",
                4: "Wonderlands x Showtime",
                5: "25-ji, Nightcord de.",
                6: "VIRTUAL SINGER"
            };

            const favInfoUnit = document.createElement("div");
            if(user.favoriteUnit){
                favInfoUnit.className = "fav-info";

                const favTitleUnit = document.createElement("p");
                favTitleUnit.className = "fav-title";
                favTitleUnit.textContent = "Groupe préféré";

                const favUnit = document.createElement("p");
                favUnit.className = "fav-unit";
                favUnit.textContent = unitNames[user.favoriteUnit];

                favInfoUnit.appendChild(favTitleUnit);
                favInfoUnit.appendChild(favUnit);

                hasFavorite = true;
            }

            // Mapping pour "Personnage préféré"
            const charaNames = {
                1: "Ichika Hoshino",
                2: "Saki Tenma",
                3: "Honami Mochizuki",
                4: "Shiho Hinomori",
                5: "Minori Hanasato",
                6: "Haruka Kiritani",
                7: "Airi Momoi",
                8: "Shizuku Hinomori",
                9: "Kohane Azusawa",
                10: "An Shiraishi",
                11: "Akito Shinonome",
                12: "Toya Aoyagi",
                13: "Tsukasa Tenma",
                14: "Emu Otori",
                15: "Nene Kusanagi",
                16: "Rui Kamishiro",
                17: "Kanade Yoisaki",
                18: "Mafuyu Asahina",
                19: "Ena Shinonome",
                20: "Mizuki Akiyama",
                21: "Miku Hatsune",
                22: "Rin Kagamine",
                23: "Len Kagamine",
                24: "Luka Megurine",
                25: "MEIKO",
                26: "KAITO"
            };

            const favInfoChara = document.createElement("div");
            if(user.favoriteCharacter){
                favInfoChara.className = "fav-info";

                const favTitleChara = document.createElement("p");
                favTitleChara.className = "fav-title";
                favTitleChara.textContent = "Personnage préféré";

                const favChara = document.createElement("p");
                favChara.className = "fav-chara";
                favChara.textContent = charaNames[user.favoriteCharacter];

                favInfoChara.appendChild(favTitleChara);
                favInfoChara.appendChild(favChara);

                hasFavorite = true;
            }

            const favInfoSong = document.createElement("div");
            if(user.favoriteSong){
                favInfoSong.className = "fav-info";

                const favTitleSong = document.createElement("p");
                favTitleSong.className = "fav-title";
                favTitleSong.textContent = "Chanson préférée";

                const favSong = document.createElement("p");
                favSong.className = "fav-song";
                favSong.textContent = user.favoriteSong;

                favInfoSong.appendChild(favTitleSong);
                favInfoSong.appendChild(favSong);

                hasFavorite = true;
            }

            const collectionTitle = document.createElement("p");
            collectionTitle.className = "collection-title";
            collectionTitle.textContent = "C O L L E C T I O N";

            const collectionSelectors = document.createElement("div");
            collectionSelectors.className = "collection-selectors";

            const cardsButton = document.createElement("button");
            cardsButton.textContent = "Cartes";
            const eventsButton = document.createElement("button");
            eventsButton.textContent = "Événements";
            const emotesButton = document.createElement("button");
            emotesButton.textContent = "Emotes";

            userInfo.appendChild(username);
            userInfo.appendChild(userDesc);

            if(user.displayBirthday){
                userInfo.appendChild(userBirthday);
            }

            // Pour l'ajout ou non du bouton des paramètres
            createSettings(userID);
            socialWrapper.appendChild(socialInfo);

            userInfoWrapper.appendChild(profilePicture);
            userInfoWrapper.appendChild(userInfo);
            userInfoWrapper.appendChild(socialWrapper);

            if(user.favoriteUnit){
                favWrapper.appendChild(favInfoUnit);
            }
            if(user.favoriteCharacter){
                favWrapper.appendChild(favInfoChara);
            }
            if(user.favoriteSong){
                favWrapper.appendChild(favInfoSong);
            }

            collectionSelectors.appendChild(cardsButton);
            collectionSelectors.appendChild(eventsButton);
            collectionSelectors.appendChild(emotesButton);

            const containerProfile = document.querySelector(".container-profile");
            containerProfile.appendChild(userInfoWrapper);

            if(hasFavorite){
                containerProfile.appendChild(favWrapper);
            }

            containerProfile.appendChild(document.createElement("hr"));
            containerProfile.appendChild(collectionTitle);
            containerProfile.appendChild(collectionSelectors);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateProfileHTML();
});

// Fonction pour créer un bouton vers les paramètres si le profil correspond à celui de l'utilisateur de la session
function createSettings(userID){
    fetch("/checkSession")
        .then(response =>{
            return response.json();
        })
        .then(sessionData =>{
            if(sessionData.success){
                const loggedUserID = sessionData.id;

                // Comparaison entre l'ID du profil sélectionné et celui de la session utilisateur
                if(loggedUserID == userID){
                    const settingsButton = document.createElement("a");
                    settingsButton.className = "settings-button";
                    settingsButton.href = "/settings.html";

                    const settingsIcon = document.createElement("i");
                    settingsIcon.className = "fa-solid fa-gear";
                    settingsIcon.style.color = "#6e9bb3";

                    const settingsTitle = document.createElement("span");
                    settingsTitle.className = "settings-title";
                    settingsTitle.textContent = "Paramètres";

                    settingsButton.appendChild(settingsIcon);
                    settingsButton.appendChild(settingsTitle);

                    const socialWrapper = document.querySelector(".social-wrapper");
                    const socialInfo = document.querySelector(".social-info");
                    socialWrapper.insertBefore(settingsButton, socialInfo);

                    // On rajoute un margin sur TABLETTE + PC si au moins un réseau est renseigné
                    const socialLinks = socialWrapper.querySelectorAll(".social-link");
                    if(socialLinks.length > 0 && window.innerWidth >= 576){
                        settingsButton.style.marginBottom = "0.5rem";
                    }
                }
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors de la comparaison: ${error}`);
        });
}