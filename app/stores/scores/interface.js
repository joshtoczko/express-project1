var dynamoDb = require('./dynamoDb')
const userModel = require('../../core/models/user');

/**
 * Gets score for user from data store
 * @param {String} user 
 * @returns {number} score
 */
exports.getScores = function (user, response) {
    userModel.verify(user);
    dynamoDb.getScores(user.userName, response);
}