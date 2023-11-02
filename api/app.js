const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();
const app = express();
const dbservice = require('./dbservice')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Requête POST pour insérer un personnage dans la BDD
app.post('/postCharacter', async (req, res) =>{
    const characterData = req.body;

    try{
        await dbservice.postCharacter(characterData);
        res.send("Données insérées avec succès.");
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de l\'insertion des données: ${error}`);
    }
});

// Requête GET pour récupérer les groupes avec leurs membres respectifs depuis la BDD
app.get('/getAllUnitsWithMembers', async (req, res) =>{
    try{
        const units = await dbservice.getAllUnitsWithMembers();
        res.json(units);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des groupes + membres: ${error}`);
    }
});

// Requête GET pour récupérer un personnage via son ID
app.get('/getCharacterByID/:characterID', async (req, res) =>{
    const characterID = req.params.characterID;
    try{
        const character = await dbservice.getCharacterByID(characterID);
        res.json(character);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération du personnage: ${error}`);
    }
});


app.listen(3000, () =>{
    console.log("App is running...");
});