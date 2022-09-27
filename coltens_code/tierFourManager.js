/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tierFourManager');
 * mod.thing == 'a thing'; // true
 */
const utils = require("utils");
const ST = require("spawnTemplates");

module.exports = {
    run: function(roomName) {
        let roomsName = roomName;
        let roomMem = Memory["rooms"][roomsName];
        roomMem["damagedBuildings"] = utils.findDamagedBuildingsByRoomName(roomsName);
        
        if (!roomMem["localTrades"]) {
            roomMem["localTrades"] = {};
        }
        
        if (!roomMem["globalTrades"]) {
            roomMem["globalTrades"] = {};
        }
        
        if (Game.rooms[roomsName].find(FIND_HOSTILE_CREEPS).length || Game.rooms[roomsName].find(FIND_HOSTILE_STRUCTURES).length) {
            let spawnResult = ST.meleeLevelSix(roomsName);
        }
    }
};