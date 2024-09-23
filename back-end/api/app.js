// APP.JS = Routes & Requêtes POST/GET
/* -------------------------------- */

// Configuration du serveur Express
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const path = require('path');

dotenv.config();
const app = express();
const dbservice = require('./dbservice')
const middleware = require('./middleware');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.use(middleware.authenticationRedirect, express.static(path.join(__dirname, '../../front-end/html')));
app.use('/css', express.static(path.join(__dirname, '../../front-end/css')));
app.use('/js', express.static(path.join(__dirname, '../../front-end/js')));

app.use('/font', express.static(path.join(__dirname, '../../data/font')));
app.use('/img', express.static(path.join(__dirname, '../../data/img')));
app.use('/sound', express.static(path.join(__dirname, '../../data/sound')));


// Requêtes de type GET
// Requête GET pour vérifier si un utilisateur est bien connecté
app.get('/checkSession', async(req, res) =>{
    try{
        if(req.session.user){
            const id = req.session.user.id;
            const nickname = req.session.user.nickname;
            res.json({ success: true, id: id, nickname: nickname });
        } else{
            res.json({ success: false });
        }
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de l'accès à la session: ${error}`);
    }
});

// Requête GET pour rediriger vers le bon profil utilisateur
app.get('/profile/:id/:username', async(req, res) =>{
    res.sendFile(path.join(__dirname, '../../front-end/html/profile.html'));
});

// Requête GET pour déconnecter un utilisateur
app.get('/logoutUser', async(req, res) =>{
    try{
        req.session.destroy((error) =>{
            res.redirect("/");
        })
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la déconnexion: ${error}`);
    }
});

// Requête GET pour récupérer un profil utilisateur via son ID
app.get('/getUserProfileByID/:userID', async(req, res) =>{
    const userID = req.params.userID;
    try{
        const profile = await dbservice.getUserProfileByID(userID);
        res.json(profile);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération du profil utilisateur: ${error}`);
    }
});

// Requête GET pour récupérer les paramètres utilisateur
app.get('/getUserSettings', async(req, res) =>{
    const userID = req.session.user.id;
    try{
        if(req.session.user){
            const settings = await dbservice.getUserProfileByID(userID);
            res.json(settings);
        } else{
            res.redirect("/login.html");
        }
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des paramètres utilisateur: ${error}`);
    }
});

// Requête GET pour récupérer les groupes avec leurs membres respectifs depuis la BDD
app.get('/getAllUnitsWithMembers', async(req, res) =>{
    try{
        const units = await dbservice.getAllUnitsWithMembers();
        res.json(units);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des groupes + membres: ${error}`);
    }
});

// Requête GET pour récupérer un personnage via son ID
app.get('/getCharacterByID/:characterID', async(req, res) =>{
    const characterID = req.params.characterID;
    try{
        const character = await dbservice.getCharacterByID(characterID);
        res.json(character);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération du personnage: ${error}`);
    }
});

// Requête GET pour filtrer les personnages
app.get('/filterCharacters', async(req, res) =>{
    try{
        const searchTerm = req.query.searchBar;
        const selectedUnit = req.query.unit;
        const selectedSchool = req.query.school;
        const selectedGender = req.query.gender;
        const selectedAstrologicalSign = req.query.astrologicalSign;

        if(searchTerm || selectedUnit || selectedSchool || selectedGender || selectedAstrologicalSign){
            const filteredCharacters = await dbservice.filterCharacters(searchTerm, selectedUnit, selectedSchool, selectedGender, selectedAstrologicalSign);
            res.json(filteredCharacters);
        } else{
            res.status(400).json(`Paramètres manquants dans la requête GET: ${error}`);
        }
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des personnages: ${error}`);
    }
});

// Requête GET pour récupérer toutes les chansons
app.get('/getAllSongs', async(req, res) =>{
    try{
        const songs = await dbservice.getAllSongs();
        res.json(songs);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des chansons: ${error}`);
    }
});

// Requête GET pour récupérer une chanson via son ID
app.get('/getSongByID/:songID', async(req, res) =>{
    const songID = req.params.songID;
    try{
        const song = await dbservice.getSongByID(songID);
        res.json(song);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération de la chanson: ${error}`);
    }
});

// Requête GET pour filtrer les chansons
app.get('/filterSongs', async(req, res) =>{
    try{
        const searchTerm = req.query.searchBar;
        const selectedUnit = req.query.unit;
        const selectedType = req.query.type;
        const selectedVideo = req.query.mv;

        if(searchTerm || selectedUnit || selectedType || selectedVideo){
            const filteredSongs = await dbservice.filterSongs(searchTerm, selectedUnit, selectedType, selectedVideo);
            res.json(filteredSongs);
        } else{
            res.status(400).json(`Paramètres manquants dans la requête GET: ${error}`);
        }
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des chansons: ${error}`);
    }
});

// Requête GET pour rechercher des chansons
app.get('/searchSongs', async (req, res) =>{
    const songQuery = req.query.query;
    try{
        const songs = await dbservice.searchSongs(songQuery);
        res.json(songs);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la recherche des chansons: ${error}`);
    }
});

// Requête GET pour récupérer toutes les cartes
app.get('/getAllCards', async(req, res) =>{
    try{
        const cards = await dbservice.getAllCards();
        res.json(cards);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des cartes: ${error}`);
    }
});

// Requête GET pour récupérer les cartes ✰4
app.get('/get4StarsCards', async(req, res) =>{
    try{
        const cards = await dbservice.get4StarsCards();
        res.json(cards);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des cartes: ${error}`);
    }
});

// Requête GET pour récupérer une carte via son ID
app.get('/getCardByID/:cardID', async(req, res) =>{
    const cardID = req.params.cardID;
    try{
        const card = await dbservice.getCardByID(cardID);
        res.json(card);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération de la carte: ${error}`);
    }
});

// Requête GET pour filtrer les cartes
app.get('/filterCards', async(req, res) =>{
    try{
        const searchTerm = req.query.searchBar;
        const selectedCharacter = req.query.character;
        const selectedUnit = req.query.unit;
        const selectedRarity = req.query.rarity;
        const selectedAttribute = req.query.attribute;

        if(searchTerm || selectedCharacter || selectedUnit || selectedRarity || selectedAttribute){
            const filteredCards = await dbservice.filterCards(searchTerm, selectedCharacter, selectedUnit, selectedRarity, selectedAttribute);
            res.json(filteredCards);
        } else{
            res.status(400).json(`Paramètres manquants dans la requête GET: ${error}`);
        }
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des cartes: ${error}`);
    }
});


// Requêtes de type POST
// Requête POST pour inscrire un utilisateur dans la BDD
app.post('/createUser', async(req, res) =>{
    const userRegister = req.body;
    try{
        if(req.session.user){
            res.json({ success: false, errorType: "alreadyAuthenticated" });
            return;
        }

        const userSearch = await dbservice.getUserByNickname(userRegister.nickname);
        if(userSearch){
            res.json({ success: false, errorType: "nickname" });
            return;
        }

        const emailSearch = await dbservice.getUserByEmail(userRegister.email);
        if(emailSearch){
            res.json({ success: false, errorType: "email" });
            return;
        }

        if(userRegister.password !== userRegister.confirmPassword){
            res.json({ success: false, errorType: "password" });
            return;
        }

        // Hachage du mot de passe
        // 10 étant le nombre de fois que le hachage va avoir lieu, un bon compromis entre sécurité et performances
        const hashedPassword = await bcrypt.hash(userRegister.password, 10);

        // SI la checkbox est coché ALORS true, SINON false
        const birthdayValue = userRegister.checkboxDate === "on" ? true : false;

        // Objet avec les données de l'utilisateur à enregistrer dans la BDD
        const userData = {
            nickname: userRegister.nickname,
            email: userRegister.email,
            password: hashedPassword,
            birthdate: userRegister.birthdate,
            displayBirthday: birthdayValue
        };

        await dbservice.createUser(userData);
        res.json({ success: true });
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de l\'inscription: ${error}`);
    }
});

// Requête POST pour connecter un utilisateur
app.post("/loginUser", async(req, res) =>{
    const userLogin = req.body;
    try{
        if(req.session.user){
            res.json({ success: false, errorType: "alreadyAuthenticated" });
            return;
        }

        const userSearch = await dbservice.getUserByNickname(userLogin.nickname);
        if(!userSearch || userSearch.length === 0){
            res.json({ success: false, errorType: "notMatching" });
            return;
        }

        // Si l'utilisateur existe, on vérifie si les mots de passe correspondent
        const hashedPassword = userSearch[0].password;
        const passwordMatch = await bcrypt.compare(userLogin.password, hashedPassword);

        if(!passwordMatch){
            res.json({ success: false, errorType: "notMatching" });
            return;
        }

        // Enregistrmeent d'une session utilisateur
        req.session.user = {
            id: userSearch[0].id,
            nickname: userSearch[0].nickname,
        };

        res.json({ success: true });
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la connexion: ${error}`);
    }
});

// Requête POST pour insérer un personnage dans la BDD
app.post('/postCharacter', async(req, res) =>{
    const characterData = req.body;
    try{
        await dbservice.postCharacter(characterData);
        res.send("Données insérées avec succès.");
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de l\'insertion des données: ${error}`);
    }
});

// Requête POST pour insérer une chanson dans la BDD
app.post('/postSong', async(req, res) =>{
    const songData = req.body;
    try{
        await dbservice.postSong(songData);
        res.send("Données insérées avec succès.");
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de l\'insertion des données: ${error}`);
    }
});

// Requête POST pour insérer une carte dans la BDD
app.post('/postCard', async(req, res) =>{
    const cardData = req.body;
    try{
        await dbservice.postCard(cardData);
        res.send("Données insérées avec succès.");
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de l\'insertion des données: ${error}`);
    }
});


// Requêtes de type PUT
// Requête PUT pour modifier un profil utilisateur
app.put('/updateUserProfile', async(req, res) =>{
    if(!req.session.user){
        res.json({ success: false });
        return;
    }

    const userID = req.session.user.id;
    const userProfile = req.body;
    try{
        const favoriteSong = userProfile.favSong;
        if(favoriteSong){
            const validSong = await dbservice.getOneSong(favoriteSong);
            if(validSong.length === 0){
                res.json({ success: false, errorType: "notValid" });
                return;
            }
        }

        const existingProfile = await dbservice.getUserProfileByID(userID);
        if(existingProfile.id === null){
            const newProfileData = {
                description: userProfile.userDesc,
                favUnit: userProfile.favUnit,
                favCharacter: userProfile.favChara,
                favSong: userProfile.favSong,
                birthdate: userProfile.birthdate,
                displayBirthday: userProfile.checkboxDate === "on" ? true : false,
                twitchLink: userProfile.twitchLink,
                twitterLink: userProfile.twitterLink,
                instagramLink: userProfile.instagramLink,
                malLink: userProfile.malLink,
                anilistLink: userProfile.anilistLink,
                id_user: userID
            };
            await dbservice.createUserProfile(newProfileData);
        } else{
            const profileData = {
                description: userProfile.userDesc,
                favUnit: userProfile.favUnit,
                favCharacter: userProfile.favChara,
                favSong: userProfile.favSong,
                birthdate: userProfile.birthdate,
                displayBirthday: userProfile.checkboxDate === "on" ? true : false,
                twitchLink: userProfile.twitchLink,
                twitterLink: userProfile.twitterLink,
                instagramLink: userProfile.instagramLink,
                malLink: userProfile.malLink,
                anilistLink: userProfile.anilistLink
            };
            await dbservice.updateUserProfile(userID, profileData);
        }

        res.json({ success: true });
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la mise à jour du profil utilisateur: ${error}`);
    }
});


app.listen(3000, () =>{
    console.log("App is running...");
});