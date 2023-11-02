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
    const query = "INSERT INTO Characters (charaFrame, name, img, introduction, position, gender, birthday, height, school, committee, club, partTimeJob, hobbies, specialty, favoriteFood, hatedFood, dislikes, color, voice, id_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        characterData.charaFrame,
        characterData.name,
        characterData.img,
        characterData.introduction,
        characterData.position,
        characterData.gender,
        characterData.birthday,
        characterData.height,
        characterData.school,
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

// Fonction pour récupérer les groupes avec leurs membres respectifs depuis la BDD
async function getAllUnitsWithMembers(){
    const query =
        `SELECT Units.id AS unitID, Units.logo, Units.name AS unitName, Units.color AS unitColor, Characters.*
        FROM Units
        LEFT JOIN Characters ON Units.id = Characters.id_unit`;

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
        JOIN Units ON Characters.id_unit = Units.id
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


module.exports = { postCharacter, getAllUnitsWithMembers, getCharacterByID };