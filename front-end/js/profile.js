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
            document.querySelector("title").textContent = user.nickname + " || Collect SEKAI";

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
                { url: "https://www.twitch.tv/", username: formatSocialLink(user.twitchProfile, "twitch"), icon: "/img/social/twitch.png", alt: "Twitch" },
                { url: "https://x.com/", username: formatSocialLink(user.twitterProfile, "twitter"), icon: "/img/social/twitter.png", alt: "Twitter" },
                { url: "https://www.instagram.com/", username: formatSocialLink(user.instagramProfile, "instagram"), icon: "/img/social/instagram.png", alt: "Instagram" },
                { url: "https://myanimelist.net/profile/", username: formatSocialLink(user.myanimelistProfile, "myanimelist"), icon: "/img/social/myanimelist.png", alt: "MyAnimeList", style: true },
                { url: "https://anilist.co/user/", username: formatSocialLink(user.anilistProfile, "anilist"), icon: "/img/social/anilist.png", alt: "Anilist", style: true }
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
            // Fonction pour nettoyer l'entrée utilisateur (lien complet ou pseudo)
            function formatSocialLink(input, platform){
                const urlPatterns = {
                    twitch: /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([\w-]+)/i,
                    twitter: /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([\w-]+)/i,
                    instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([\w-]+)/i,
                    myanimelist: /(?:https?:\/\/)?(?:www\.)?myanimelist\.net\/profile\/([\w-]+)/i,
                    anilist: /(?:https?:\/\/)?(?:www\.)?anilist\.co\/user\/([\w-]+)/i,
                };

                const pattern = urlPatterns[platform];
                if(pattern){
                    const match = input?.trim().match(pattern);
                    if(match){
                        // Si c'est un lien complet, on extrait le pseudo
                        return match[1];
                    }
                }
                // Si ce n'est pas un lien complet, on retourne l'entrée telle quelle
                return input?.trim();
            }

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

            const collectionWrapper = document.createElement("div");
            collectionWrapper.className = "collection-wrapper";

            const buttonsWrapper = document.createElement("div");
            buttonsWrapper.className = "buttons-wrapper";

            const cardsButton = document.createElement("button");
            cardsButton.textContent = "Cartes";
            cardsButton.addEventListener("click", () =>{
                // Boucle qui retire tous les éléments à chaque clique pour éviter une duplication
                while(userCollection.firstChild){
                    userCollection.removeChild(userCollection.firstChild);
                }

                generateCardCollectionHTML();
            });
            const eventsButton = document.createElement("button");
            eventsButton.textContent = "Événements";
            eventsButton.addEventListener("click", () =>{
                // Boucle qui retire tous les éléments à chaque clique pour éviter une duplication
                while(userCollection.firstChild){
                    userCollection.removeChild(userCollection.firstChild);
                }
            });
            const emotesButton = document.createElement("button");
            emotesButton.textContent = "Emotes";
            emotesButton.addEventListener("click", () =>{
                // Boucle qui retire tous les éléments à chaque clique pour éviter une duplication
                while(userCollection.firstChild){
                    userCollection.removeChild(userCollection.firstChild);
                }
            });

            const userCollection = document.createElement("div");
            userCollection.className = "user-collection";

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

            buttonsWrapper.appendChild(cardsButton);
            buttonsWrapper.appendChild(eventsButton);
            buttonsWrapper.appendChild(emotesButton);
            collectionWrapper.appendChild(buttonsWrapper);
            collectionWrapper.appendChild(userCollection);

            const containerProfile = document.querySelector(".container-profile");
            containerProfile.appendChild(userInfoWrapper);

            if(hasFavorite){
                containerProfile.appendChild(favWrapper);
            }

            containerProfile.appendChild(document.createElement("hr"));
            containerProfile.appendChild(collectionTitle);
            containerProfile.appendChild(collectionWrapper);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}
// Appel de la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () =>{
    generateProfileHTML();
    setTimeout(() =>{
        generateCardCollectionHTML();
    }, 100);
});

// Fonction pour récupérer la collection d'un utilisateur et la générer sur son profil
function generateCardCollectionHTML(){
    // Pour séparer l'URL du profil en segments en utilisant "/" comme séparateur
    const profileURL = window.location.pathname.split("/");
    // On récupère l'ID utilisateur de l'URL, situé au 3ème segment (index 2 dans le tableau)
    const userID = profileURL[2];

    fetch(`/getUserCardCollectionByID/${userID}`)
        .then(response =>{
            return response.json();
        })
        .then(collection =>{
            // Tri de la collection par ID de façon décroissante (les plus récentes en haut)
            collection.sort((a, b) => b.id - a.id);

            const userCollection = document.querySelector(".user-collection");

            if(collection.length === 0){
                const noResult = document.createElement("div");
                noResult.className = "no-result";
        
                const textResult = document.createElement("p");
                textResult.textContent = "Pas de cartes possédées."
        
                noResult.appendChild(textResult);
                userCollection.appendChild(noResult);
            } else {
                collection.forEach(card =>{
                    const cardThumbnail = document.createElement("img");
                    cardThumbnail.src = "/img/thumbnails/" + card.cardThumbnail;
                    cardThumbnail.className = "card-thumbnail";
                    cardThumbnail.alt = card.charaName;
                    cardThumbnail.width = 52;
                    cardThumbnail.height = 52;
                    cardThumbnail.onclick = () => openPopup(userID, card.id, card.additionDate);
        
                    userCollection.appendChild(cardThumbnail);
                });
            }
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du code html: ${error}`);
        });
}

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


// Pour ouvrir le pop-up contenant les informations de la carte sélectionnée
function openPopup(userID, cardID, additionDate){
    const popupContainer = document.querySelector("#popup");
    popupContainer.style.display = "block";

    // Pour empêcher de scroll sur la page en arrière-plan
    const htmlScroll = document.querySelector("html");
    htmlScroll.style.overflowY = "hidden";

    // Remettre la page en haut lors de l'ouverture du pop-up
    popupContainer.scrollTop = 0;

    // Permet de récupérer les données json des personnages
    fetch("/getCardByID/" + cardID)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            const card = data[0];

            fetch("/checkSession")
                .then(response =>{
                    return response.json();
                })
                .then(sessionData =>{
                    if(sessionData.success){
                        const loggedUserID = sessionData.id;
        
                        // Comparaison entre l'ID du profil sélectionné et celui de la session utilisateur
                        if(loggedUserID == userID){
                            const possessedInfo = document.querySelector(".possessed-info");

                            // Boucle qui retire tous les éléments à chaque ouverture du pop-up pour éviter une duplication
                            while(possessedInfo.firstChild){
                                possessedInfo.removeChild(possessedInfo.firstChild);
                            }

                            const deleteButton = document.createElement("button");
                            deleteButton.type = "submit";
                            deleteButton.value = "submit";
                            deleteButton.className = "delete-button";
                            deleteButton.dataset.cardId = card.id; // Pour stocker l'ID de la carte
                            deleteButton.textContent = "- Supprimer de ma collection";

                            deleteButton.addEventListener("click", async (event) =>{
                                const confirmation = confirm("Êtes-vous bien sûr de vouloir supprimer cette carte de votre collection ?");

                                if(!confirmation){
                                    // Si l'utilisateur annule, on arrête l'exécution ici
                                    return;
                                }

                                const cardID = event.target.dataset.cardId;
                
                                fetch("/removeCard", {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ cardID })
                                })
                                .then(response =>{
                                    return response.json();
                                })
                                .then(responseData =>{
                                    if(responseData.success === true){
                                        location.reload();
                                    }
                                })
                                .catch(error =>{
                                    console.error(`Erreur lors de la suppression de la carte: ${error}`);
                                });
                            });

                            const cardAdditionDate = document.createElement("h6");
                            cardAdditionDate.className = "addition-date";

                            // On récupère la date enregistrée dans la BDD (au format ISO YYYY-MM-DD)
                            const isoDate = additionDate;
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

                            cardAdditionDate.textContent = "Ajoutée le " + formattedDate + ".";
                            
                            document.querySelector(".close").style.marginTop = "0";

                            possessedInfo.appendChild(deleteButton);
                            possessedInfo.appendChild(cardAdditionDate);
                            possessedInfo.appendChild(document.createElement("hr"));
                        }
                    }
                })
                .catch(error =>{
                    console.error(`Une erreur est survenue lors de la comparaison: ${error}`);
                });

            document.querySelector("#card-popup-title").textContent = card.title;

            // Pour cacher ou non le bouton interchangeant les cartes
            if(!card.trainedCard){
                document.querySelector(".swap-card").style.display = "none";
            } else{
                document.querySelector(".swap-card").style.display = "";

                // Bouton interchangeant les cartes
                let imageState = 1;
                document.querySelector(".swap-card").addEventListener("click", () =>{
                    if(imageState == 1){
                        document.querySelector("#card-popup-img").src = "/img/cards/" + card.trainedCard;
                        imageState = 2;
                    } else{
                        document.querySelector("#card-popup-img").src = "/img/cards/" + card.card;
                        imageState = 1;
                    }
                });
            }

            document.querySelector("#card-popup-img").src = "/img/cards/" + card.card;
            document.querySelector("#card-popup-img").alt = card.title;

            // Pour ajouter certaines informations seulement si elles sont définies, et les cacher si elles ne le sont pas
            if(!card.quote){
                document.querySelector("#card-popup-quote").style.display = "none";
                document.querySelector("#card-popup-voicedQuote").style.display = "none";
            } else{
                document.querySelector("#card-popup-quote").textContent = `"` + card.quote + `"`;
                document.querySelector("#card-popup-quote").style.display = "";
                document.querySelector("#card-popup-voicedQuote").src = "/sound/quotes/" + card.voicedQuote;
                document.querySelector("#card-popup-voicedQuote").style.display = "";
            }

            document.querySelector("#card-popup-chara").textContent = card.charaName;

            const popupRarity = document.querySelector("#card-popup-rarity");
            // Boucle qui retire tous les éléments à chaque ouverture du pop-up pour éviter une duplication
            while(popupRarity.firstChild){
                popupRarity.removeChild(popupRarity.firstChild);
            }

            // Puis on les rajoute selon les caractéristiques de la carte
            let nbStars = 1;
            if(card.rarity == "✰4"){
                nbStars = 4;
            } else if(card.rarity == "✰3"){
                nbStars = 3;
            } else if(card.rarity == "✰2"){
                nbStars = 2;
            }
            for(let i=0; i<nbStars; i++){
                const rarityStar = document.createElement("img");
                rarityStar.src = "/img/icons/" + card.rarityStars;
                rarityStar.alt = card.rarity;
                rarityStar.width = 25;
                rarityStar.height = 25;
            
                popupRarity.appendChild(rarityStar);
            }

            document.querySelector("#card-popup-attribute").src = "/img/icons/" + card.attributeIcon;
            document.querySelector("#card-popup-attribute").alt = card.attribute;
            document.querySelector("#card-popup-attribute").width = 25;
            document.querySelector("#card-popup-attribute").height = 25;

            document.querySelector("#card-popup-skillName").textContent = card.skillName;
            document.querySelector("#card-popup-releaseDate").textContent = "//WIP...";
            document.querySelector("#card-popup-gacha").textContent = "//WIP...";
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement du pop-up: ${error}`);
        });
}