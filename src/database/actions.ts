const sequalize = require('sequelize');

//!WARNING This connection string is here just for evaluation purposes to production is necessary to move to a environment variable
const database = new sequalize('mysql://admin:restaurant@restaurant.c4iulrsbmpko.us-east-2.rds.amazonaws.com:3306/restaurant'); 
//!WARNING This connection string is here just for evaluation purposes to production is necessary to move to a environment variable

export const get = async (sentence, parameters) => {
    return await database.query(sentence, 
    { replacements: parameters, type: database.QueryTypes.SELECT });
}

export const create = async (sentence, parameters) => {
    return await database.query(sentence, 
        { replacements: parameters, type: database.QueryTypes.INSERT });
}

export const update = async (sentence, parameters) => {
    return await database.query(sentence, 
        { replacements: parameters, type: database.QueryTypes.UPDATE });
}

export const deleteQuery = async (sentence, parameters) => {
    return await database.query(sentence, 
        { replacements: parameters, type: database.QueryTypes.DELETE });
}
