// DBSERVICE.JS = Requêtes MySQL
/* -------------------------- */

// Configuration de la BDD
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


// Fonctions de type GET
// Fonction pour récupérer un utilisateur via son pseudo
async function getUserByNickname(nickname){
    const query = 
        `SELECT *
        FROM Users
        WHERE nickname = ?`;

    try{
        const userSearch = await new Promise((resolve, reject) =>{
            connection.query(query, [nickname], (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return userSearch.length > 0 ? userSearch : null;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer un utilisateur via son e-mail
async function getUserByEmail(email){
    const query = 
        `SELECT *
        FROM Users
        WHERE email = ?`;

    try{
        const userSearch = await new Promise((resolve, reject) =>{
            connection.query(query, [email], (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return userSearch.length > 0 ? userSearch : null;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer un profil utilisateur via son ID
async function getUserProfileByID(userID){
    const query = 
        `SELECT Users.nickname, Users.birthdate, Users.displayBirthday, User_Profiles.*
        FROM Users
        LEFT JOIN User_Profiles ON Users.id = User_Profiles.id_user
        WHERE Users.id = ?`;

    try{
        const user = await new Promise((resolve, reject) =>{
            connection.query(query, [userID], (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results[0]);
                }
            });
        });
        return user;
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
            connection.query(query, [characterID], (error, results) =>{
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
                Characters.name LIKE CONCAT('%', ?, '%') OR
                Units.name LIKE CONCAT('%', ?, '%') OR
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
        `SELECT Characters.*, Units.color AS unitColor
        FROM Characters
        INNER JOIN Units ON Characters.id_unit = Units.id
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

// Fonction pour récupérer toutes les chansons
async function getAllSongs(){
    const query = 
        `SELECT *
        FROM Songs`;

    try{
        const songs = await new Promise((resolve, reject) =>{
            connection.query(query, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return songs;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer une chanson via son ID
async function getSongByID(songID){
    const query = 
        `SELECT Songs.*, Units.logo as unitLogo, Units.name as unitName
        FROM Songs
        INNER JOIN Units ON Songs.id_unit = Units.id
        WHERE Songs.id = ?`;

    try{
        const song = await new Promise((resolve, reject) =>{
            connection.query(query, [songID], (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return song;
    } catch(error){
        throw error;
    }
}

// Fonction pour filtrer les chansons
async function filterSongs(searchTerm, selectedUnit, selectedType, selectedVideo){
    const sqlParams = [];
    let whereClause = "1 = 1";

    // SI une information est fournie, ALORS on ajoute la clause à la requête
    // On push également le paramètre dans la requête, qui va remplacer les ? des clauses par la suite
    if(searchTerm){
        whereClause +=
            ` AND (
                Songs.title LIKE CONCAT('%', ?, '%') OR
                Songs.type LIKE CONCAT('%', ?, '%') OR
                Songs.arranger LIKE CONCAT('%', ?, '%') OR
                Songs.composer LIKE CONCAT('%', ?, '%') OR
                Songs.lyricist LIKE CONCAT('%', ?, '%') OR
                Songs.mv LIKE CONCAT('%', ?, '%') OR
                Units.name LIKE CONCAT('%', ?, '%')
            )`;
        for (let i=0; i<7; i++){
            sqlParams.push(searchTerm);
        }
    }
    if(selectedUnit){
        whereClause += " AND Units.id = ?";
        sqlParams.push(selectedUnit);
    }
    if(selectedType){
        whereClause += " AND Songs.type = ?";
        sqlParams.push(selectedType);
    }
    if(selectedVideo){
        whereClause += " AND Songs.mv LIKE ?";
        sqlParams.push(selectedVideo);
    }

    const query =
        `SELECT Songs.*
        FROM Songs
        INNER JOIN Units ON Songs.id_unit = Units.id
        WHERE ${whereClause}`;

    try{
        const filteredSongs = await new Promise((resolve, reject) =>{
            connection.query(query, sqlParams, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return filteredSongs;
    } catch(error){
        throw error;
    }
}

// Fonction pour rechercher des chansons dynamiquement
async function searchSongs(songQuery){
    const query =
        `SELECT id, title, cover
        FROM Songs
        WHERE title LIKE ?;`;

    try{
        const songs = await new Promise((resolve, reject) =>{
            connection.query(query, [`%${songQuery}%`], (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return songs;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer toutes les cartes
async function getAllCards(){
    const query = 
        `SELECT Cards.*, Characters.name as charaName, Units.name as unitName
        FROM Cards
        INNER JOIN Characters ON Cards.id_character = Characters.id
        INNER JOIN Units ON Characters.id_unit = Units.id;`;

    try{
        const cards = await new Promise((resolve, reject) =>{
            connection.query(query, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return cards;
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
        const cards = await new Promise((resolve, reject) =>{
            connection.query(query, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return cards;
    } catch(error){
        throw error;
    }
}

// Fonction pour récupérer une carte via son ID
async function getCardByID(cardID){
    const query = 
        `SELECT Cards.*, Characters.name as charaName
        FROM Cards
        INNER JOIN Characters ON Cards.id_character = Characters.id
        WHERE Cards.id = ?`;

    try{
        const card = await new Promise((resolve, reject) =>{
            connection.query(query, [cardID], (error, results) =>{
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

// Fonction pour filtrer les cartes
async function filterCards(searchTerm, selectedCharacter, selectedUnit, selectedRarity, selectedAttribute){
    const sqlParams = [];
    let whereClause = "1 = 1";

    // SI une information est fournie, ALORS on ajoute la clause à la requête
    // On push également le paramètre dans la requête, qui va remplacer les ? des clauses par la suite
    if(searchTerm){
        whereClause +=
            ` AND (
                Cards.title LIKE CONCAT('%', ?, '%') OR
                Cards.quote LIKE CONCAT('%', ?, '%') OR
                Characters.name LIKE CONCAT('%', ?, '%') OR
                Units.name LIKE CONCAT('%', ?, '%') OR
                Cards.rarity LIKE CONCAT('%', ?, '%') OR
                Cards.attribute LIKE CONCAT('%', ?, '%') OR
                Cards.skillName LIKE CONCAT('%', ?, '%')
            )`;
        for (let i=0; i<7; i++){
            sqlParams.push(searchTerm);
        }
    }
    if(selectedCharacter){
        whereClause += " AND Characters.id = ?";
        sqlParams.push(selectedCharacter);
    }
    if(selectedUnit){
        whereClause += " AND Units.id = ?";
        sqlParams.push(selectedUnit);
    }
    if(selectedRarity){
        whereClause += " AND Cards.rarity = ?";
        sqlParams.push(selectedRarity);
    }
    if(selectedAttribute){
        whereClause += " AND Cards.attribute = ?";
        sqlParams.push(selectedAttribute);
    }

    const query =
        `SELECT Cards.*
        FROM Cards
        INNER JOIN Characters ON Cards.id_character = Characters.id
        INNER JOIN Units ON Characters.id_unit = Units.id
        WHERE ${whereClause}`;

    try{
        const filteredCards = await new Promise((resolve, reject) =>{
            connection.query(query, sqlParams, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });
        return filteredCards;
    } catch(error){
        throw error;
    }
}


// Fonctions de type POST
// Fonction pour inscrire un utilisateur dans la BDD
async function createUser(userData){
    const query = "INSERT INTO Users (nickname, email, password, birthdate, displayBirthday) VALUES (?, ?, ?, ?, ?)";

    const values = [
        userData.nickname,
        userData.email,
        userData.password,
        userData.birthdate,
        userData.displayBirthday
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

// Fonction pour créer un profil utilisateur dans la BDD
async function createUserProfile(newProfileData){
    const createProfileQuery = "INSERT INTO User_Profiles (description, twitchProfile, twitterProfile, instagramProfile, myanimelistProfile, anilistProfile, favoriteUnit, favoriteCharacter, favoriteSong, id_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const updateUserQuery = 
        `UPDATE Users
        SET birthdate = ?, displayBirthday = ?
        WHERE id = ?`;

    const profileValues = [
        newProfileData.description,
        newProfileData.twitchLink,
        newProfileData.twitterLink,
        newProfileData.instagramLink,
        newProfileData.malLink,
        newProfileData.anilistLink,
        newProfileData.favUnit,
        newProfileData.favCharacter,
        newProfileData.favSong,
        newProfileData.id_user
    ];

    const userValues = [
        newProfileData.birthdate,
        newProfileData.displayBirthday,
        newProfileData.id_user
    ];

    try{
        await new Promise((resolve, reject) =>{
            connection.query(createProfileQuery, profileValues, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });

        await new Promise((resolve, reject) =>{
            connection.query(updateUserQuery, userValues, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });

        return;
    } catch(error){
        throw error;
    }
}

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

// Fonction pour insérer une chanson dans la BDD
async function postSong(songData){
    const query =
        `INSERT INTO Songs (id, title, cover, songAudio, type, easyLevel, easyNotes, normalLevel, normalNotes, hardLevel, hardNotes, expertLevel, expertNotes, masterLevel, masterNotes, appendLevel, appendNotes, 
            bpm, arranger, composer, lyricist, mv, mv2dLink, mv3dLink, id_unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        songData.id,
        songData.title,
        songData.cover,
        songData.songAudio,
        songData.type,
        songData.easyLevel,
        songData.easyNotes,
        songData.normalLevel,
        songData.normalNotes,
        songData.hardLevel,
        songData.hardNotes,
        songData.expertLevel,
        songData.expertNotes,
        songData.masterLevel,
        songData.masterNotes,
        songData.appendLevel,
        songData.appendNotes,
        songData.bpm,
        songData.arranger,
        songData.composer,
        songData.lyricist,
        songData.mv,
        songData.mv2dLink,
        songData.mv3dLink,
        songData.id_unit
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


// Fonctions de type PUT
// Fonction pour modifier un profil utilisateur
async function updateUserProfile(userID, profileData){
    const updateProfileQuery = 
        `UPDATE User_Profiles
        SET description = ?, twitchProfile = ?, twitterProfile = ?, instagramProfile = ?, myanimelistProfile = ?, anilistProfile = ?, favoriteUnit = ?, favoriteCharacter = ?, favoriteSong = ?
        WHERE id_user = ?`;

    const updateUserQuery = 
        `UPDATE Users
        SET birthdate = ?, displayBirthday = ?
        WHERE id = ?`;

    const profileValues = [
        profileData.description,
        profileData.twitchLink,
        profileData.twitterLink,
        profileData.instagramLink,
        profileData.malLink,
        profileData.anilistLink,
        profileData.favUnit,
        profileData.favCharacter,
        profileData.favSong,
        userID
    ];

    const userValues = [
        profileData.birthdate,
        profileData.displayBirthday,
        userID
    ];

    try{
        await new Promise((resolve, reject) =>{
            connection.query(updateProfileQuery, profileValues, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });

        await new Promise((resolve, reject) =>{
            connection.query(updateUserQuery, userValues, (error, results) =>{
                if(error){
                    reject(error);
                } else{
                    resolve(results);
                }
            });
        });

        return;
    } catch(error){
        throw error;
    }
}


module.exports = { getUserByNickname, getUserByEmail, getUserProfileByID, getAllUnitsWithMembers, getCharacterByID, filterCharacters, getAllSongs, getSongByID, filterSongs, searchSongs, getAllCards, get4StarsCards, getCardByID, filterCards, createUser, createUserProfile, postCharacter, postSong, postCard, updateUserProfile };