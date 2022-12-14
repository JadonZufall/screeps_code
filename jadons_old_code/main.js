const util = require("util");
const memTools = require("memTools");

const towerLogic = require("towerLogic");

const workerRole = require("worker");
const builderRole = require("builder");
const energy_minerRole = require("energy_miner");
const collectorRole = require("collectors");

const TargetWorkers = 3;
const TargetBuilders = 2;
const TargetEnergy_miners = 1;
const TargetCollectors = 2;

var creepCount = 0;
var workerCount = 0;
var builderCount = 0;
var energy_minerCount = 0;
var collectorCount = 0;


// Cleanup memory of dead creeps.
memTools.cleanCreepMem();

var tempTower = Game.getObjectById("9cb1e1c3b4f0398");
tempTower.room.visual.circle(tempTower.pos, {fill: 'transparent', radius: 20, stroke: 'red'});
towerLogic.run(Game.getObjectById("9cb1e1c3b4f0398"));

for (var name in Game.creeps) {
    // Update memory for all creeps currently loaded.
    var targetCreep = Game.creeps[name];
    if (!targetCreep.memory["memoryConfigured"]) {
        // Configures creeps memory.
        memTools.setupCreepMem(targetCreep, targetCreep.memory["role"]);
    }
}

for (var name in Game.rooms) {
    // Itterate over all currently visible rooms.
    var targetRoom = Game.rooms[name];
    if (!targetRoom.memory["memoryConfigured"]) {
        memTools.setupRoomMem(targetRoom);
    }
    else {
        memTools.updateRoomMem(targetRoom);
    }
}

for (var name in Game.creeps) {
    var currentCreep = Game.creeps[name];
    memTools.updateCreepMem(currentCreep);
    creepCount++;
    
    if (currentCreep.memory["role"] == "worker") {
        workerRole.run(currentCreep);
        workerCount++;
    }
    else if (currentCreep.memory["role"] == "builder") {
        builderRole.run(currentCreep);
        builderCount++;
    }
    else if (currentCreep.memory["role"] == "energy_miner") {
        energy_minerRole.run(currentCreep);
        energy_minerCount++;
    }
    else if (currentCreep.memory["role"] == "collector") {
        collectorRole.run(currentCreep);
        collectorCount++;
    }
}


if (workerCount < TargetWorkers) {
    console.log("Spawning Worker");
    let result = Game.spawns["Spawn1"].spawnCreep([MOVE, WORK, CARRY], "worker" + Game.time.toString(), {memory: {"role": "worker", "emptyStore": true}});
}
else if (builderCount < TargetBuilders) {
    let result = Game.spawns["Spawn1"].spawnCreep([MOVE, MOVE, WORK, WORK, CARRY], "builder" + Game.time.toString(), {memory: {"role": "builder", "fullStore": false}});
}
else if (energy_minerCount < TargetEnergy_miners) {
    let result = Game.spawns["Spawn1"].spawnCreep([MOVE, WORK, WORK, WORK, WORK], "energy_miner" + Game.time.toString(), {memory: {"role": "energy_miner"}});
}
else if (collectorCount < TargetCollectors) {
    let result = Game.spawns["Spawn1"].spawnCreep([MOVE, CARRY, CARRY], "collector" + Game.time.toString(), {memory: {"role": "collector", "emptyStore": true}});
}


