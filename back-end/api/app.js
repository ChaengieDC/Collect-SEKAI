const cors = require('cors');
const express = require('express');

const app = express();
const dbservice = require('./dbservice')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


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


app.listen(3000, () =>{
    console.log("App is running...");
});