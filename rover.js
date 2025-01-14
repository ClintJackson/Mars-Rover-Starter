const Command = require("./command");
const Message = require("./message");

class Rover {
   constructor(position){
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   }
   receiveMessage(message){
      let response = {
         message: message.name,
         results: [],

      }

      for (let command of message.commands){
         if (command.commandType ==="STATUS_CHECK") {
            response.results.push({
               completed: true,
               roverStatus: {
                  mode: this.mode,
                  generatorWatts: this.generatorWatts,
                  position: this.position
               }
            })
         }else if(command.commandType === "MOVE"){
            if (this.mode === "LOW_POWER") {
                  response.results.push({completed: false});
            } else if(this.mode ==="NORMAL") {
                  this.position = command.value;
                  response.results.push({completed: true});
               } 
         }else if (command.commandType === "MODE_CHANGE") {
            response.results.push({completed: true});
            if (command.value === "LOW_POWER") {
               this.mode = 'LOW_POWER';
               } else if (command.value === "NORMAL") {
                  this.mode = "NORMAL";
               }
            }  
         }
         
      

      return response;
   }
}

module.exports = Rover;

//from studentgrade.specx.js
let rover = new Rover(100); //100 means moving that much
    let commands = [
      new Command('MOVE', 4321),//so rover is moving 4321
      new Command('STATUS_CHECK'), 
       new Command('MODE_CHANGE', 'LOW_POWER'), //input command mode_change, input the new status (low power). if something has low power, it's not going to move. 
         new Command('MOVE', 3579),
      new Command('STATUS_CHECK')
    ];
    let message = new Message('TA power', commands);
    let response = rover.receiveMessage(message);

    /* 
    if you're getting "object" returns, do console logs as 
    console.log(JSON.stringify(response, null, 2));
    */

