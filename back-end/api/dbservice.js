const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});
connection.connect((err) =>{
    if(err){
        console.log(err.message);
    }
    console.log("DB " + connection.state + ".");
});


// Fonction pour insérer un personnage dans la BDD
async function postCharacter(characterData){
    const query = "INSERT INTO Characters (charaFrame, name, img, introduction, position, gender, birthday, astrologicalSign, height, school, committee, club, partTimeJob, hobbies, specialty, favoriteFood, hatedFood, dislikes, color, voice, id_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        characterData.charaFrame,
        characterData.name,
        characterData.img,
        characterData.introduction,
        characterData.position,
        characterData.gender,
        characterData.birthday,
        characterData.astrologicalSign,
        characterData.height,
        characterData.school,
        characterData.schoolClass,
        characterData.committee,
        characterData.club,
        characterData.partTimeJob,
        characterData.hobbies,
        characterData.specialty,
        characterData.favoriteFood,
        characterData.hatedFood,
        characterData.dislikes,
        characterData.color,
        characterData.voice,
        characterData.id_unit
    ];

    try{
        const result = await new Promise((resolve, reject) =>{
            connection.query(query, values, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return result;
    } catch(error){
        throw error;
    }
}

// Fonction pour insérer une carte dans la BDD
async function postCard(cardData){
    const query = "INSERT INTO Cards (id, title, quote, voicedQuote, card, trainedCard, attribute, attributeIcon, rarity, rarityStars, skillName, id_character) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        cardData.id,
        cardData.title,
        cardData.quote,
        cardData.voicedQuote,
        cardData.card,
        cardData.trainedCard,
        cardData.attribute,
        cardData.attributeIcon,
        cardData.rarity,
        cardData.rarityStars,
        cardData.skillName,
        cardData.id_character
    ];

    try{
        const result = await new Promise((resolve, reject) =>{
            connection.query(query, values, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return result;
    } catch(error){
        throw error;
    }
}


// Fonction pour récupérer les cartes ✰4
async function get4StarsCards(){
    const query = 
        `SELECT Cards.*, Characters.name as charaName
        FROM Cards
        INNER JOIN Characters ON Cards.id_character = Characters.id
        WHERE Cards.rarity = '✰4'`;

    try{
        const card = await new Promise((resolve, reject) =>{
            connection.query(query, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return card;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer les groupes avec leurs membres respectifs depuis la BDD
async function getAllUnitsWithMembers(){
    const query =
        `SELECT Units.id AS unitID, Units.logo, Units.name AS unitName, Units.color AS unitColor, Characters.*
        FROM Units
        INNER JOIN Characters ON Units.id = Characters.id_unit`;

    try{
        const units = await new Promise((resolve, reject) =>{
            connection.query(query, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });

        // Pour réorganiser les données
        const groupedData = [];

        units.forEach(row =>{
            // Recherche si le groupe existe déjà dans groupedData
            let unit = groupedData.find(u => u.id === row.unitID);
            // Si le groupe n'existe pas, le créé
            if(!unit){
                unit ={
                    id: row.unitID,
                    logo: row.logo,
                    name: row.unitName,
                    color: row.unitColor,
                    members: []
                };
                groupedData.push(unit);
            }
            // Ajoute le membre au groupe
            // En vérifiant d'abord s'il a un ID valide
            if(row.id){
                unit.members.push({
                    id: row.id,
                    charaFrame: row.charaFrame,
                    name: row.name,
                    img: row.img,
                    introduction: row.introduction,
                    position: row.position,
                    gender: row.gender,
                    birthday: row.birthday,
                    height: row.height,
                    school: row.school,
                    committee: row.committee,
                    club: row.club,
                    partTimeJob: row.partTimeJob,
                    hobbies: row.hobbies,
                    specialty: row.specialty,
                    favoriteFood: row.favoriteFood,
                    hatedFood: row.hatedFood,
                    dislikes: row.dislikes,
                    color: row.color,
                    voice: row.voice
                });
            }
        });
        return groupedData;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer un personnage via son ID
async function getCharacterByID(characterID){
    const query = 
        `SELECT Characters.*, Units.name AS unitName
        FROM Characters
        INNER JOIN Units ON Characters.id_unit = Units.id
        WHERE Characters.id = ?`;

    try{
        const character = await new Promise((resolve, reject) =>{
            connection.query(query, characterID, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return character;
    } catch(error){
        throw error;
    }
}

// Fonction pour filtrer les personnages
async function filterCharacters(searchTerm, selectedUnit, selectedSchool, selectedGender, selectedAstrologicalSign){
    const sqlParams = [];
    let whereClause = "1 = 1";

    // SI une information est fournie, ALORS on ajoute la clause à la requête
    // On push également le paramètre dans la requête, qui va remplacer les ? des clauses par la suite
    if(searchTerm){
        whereClause +=
            ` AND (
                Units.name LIKE ? OR
                Characters.name LIKE CONCAT('%', ?, '%') OR
                Characters.position LIKE CONCAT('%', ?, '%') OR
                Characters.gender LIKE ? OR
                Characters.birthday LIKE CONCAT('%', ?, '%') OR
                Characters.astrologicalSign LIKE CONCAT('%', ?, '%') OR
                Characters.height LIKE CONCAT('%', ?, '%') OR
                Characters.school LIKE CONCAT('%', ?, '%') OR
                Characters.committee LIKE CONCAT('%', ?, '%') OR
                Characters.club LIKE CONCAT('%', ?, '%') OR
                Characters.partTimeJob LIKE CONCAT('%', ?, '%') OR
                Characters.hobbies LIKE CONCAT('%', ?, '%') OR
                Characters.specialty LIKE CONCAT('%', ?, '%') OR
                Characters.favoriteFood LIKE CONCAT('%', ?, '%') OR
                Characters.hatedFood LIKE CONCAT('%', ?, '%') OR
                Characters.dislikes LIKE CONCAT('%', ?, '%') OR
                Characters.voice LIKE CONCAT('%', ?, '%')
            )`;
        for (let i=0; i<17; i++){
            sqlParams.push(searchTerm);
        }
    }
    if(selectedUnit){
        whereClause += " AND Units.id = ?";
        sqlParams.push(selectedUnit);
    }
    if(selectedSchool){
        whereClause += " AND Characters.school = ?";
        sqlParams.push(selectedSchool);
    }
    if(selectedGender){
        whereClause += " AND Characters.gender = ?";
        sqlParams.push(selectedGender);
    }
    if(selectedAstrologicalSign){
        whereClause += " AND Characters.astrologicalSign = ?";
        sqlParams.push(selectedAstrologicalSign);
    }

    const query =
        `SELECT Units.id AS unitID, Units.name AS unitName, Units.color AS unitColor, Characters.*
        FROM Units
        INNER JOIN Characters ON Units.id = Characters.id_unit
        WHERE ${whereClause}`;

    try{
        const filteredCharacters = await new Promise((resolve, reject) =>{
            connection.query(query, sqlParams, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return filteredCharacters;
    } catch(error){
        throw error;
    }
}


module.exports = { postCharacter, postCard, get4StarsCards, getAllUnitsWithMembers, getCharacterByID, filterCharacters };