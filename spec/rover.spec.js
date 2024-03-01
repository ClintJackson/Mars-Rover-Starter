const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!

  it ("constructor sets position and default values for mode and generatorWatts", function(){
    let testRover = new Rover(100);
    expect(testRover.mode).toBe("NORMAL");
    expect(testRover.generatorWatts).toBe(110);
  });

  it("response returned by receiveMessage contains the name of the message", function(){
    let commands =[new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let testRover = new Rover (100);
    expect(testRover.receiveMessage(message).message).toBe(message.name);
  });
  it ("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let testRover = new Rover (100);
    expect(testRover.receiveMessage(message).results.length).toEqual(message.commands.length);
  });

  it("responds correctly to the status check command", function(){
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message("Test message", commands);
    let testRover = new Rover(100);
     let testRoverStatus = {
      mode: testRover.mode,
      generatorWatts: testRover.generatorWatts,
      position: testRover.position
    };
    
    let response = testRover.receiveMessage(message);
    let roverStatus = response.results.find(result => result.roverStatus).roverStatus; /*gets into the actual roverStatus object.  
    Can then use it for easier expect statements comparing the values in key:values to what's returned by testRover.(whatever key).
    .find array method returns "truthy" if it finds "roverStatus" and returns that path, which can then be accessed via .roverStatus. 
    */
    expect(response.results).toEqual(
      expect.arrayContaining([expect.objectContaining({roverStatus: expect.objectContaining(testRoverStatus)})]));
    
    
    expect(roverStatus.mode).toEqual(testRover.mode);
    expect(roverStatus.generatorWatts).toEqual(testRover.generatorWatts);
    expect(roverStatus.position).toEqual(testRover.position);
    
  });

  it("responds correctly to the mode change command", function(){
    let commands = [new Command('STATUS_CHECK'), ("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("confirming low_power", commands);
    let testRover = new Rover(100);

    let response = testRover.receiveMessage(message);
    
    let roverStatus = response.results.find(result => result.roverStatus).roverStatus;
    
    //let roverResultsCompleted = response.results.find(result => result.completed).completed;
    
    let testLowPower = [new Command("MODE_CHANGE", "LOW_POWER")];
    let secondMessage = new Message("confirming updated values", testLowPower);
    let response2 = testRover.receiveMessage(secondMessage);
    let secondRoverResult = response2.results.find(results => results.completed).completed;
    expect(secondRoverResult).toEqual(true);
    expect(testRover.mode).toBe("LOW_POWER");
    
    let testNormalMode = [new Command("MODE_CHANGE", "NORMAL")];
    let thirdMessage = new Message("confirming update to NORMAL", testNormalMode);
    let response3 = testRover.receiveMessage(thirdMessage);
    let thirdRoverResult = response3.results.find(results => results.completed).completed;
    expect(thirdRoverResult).toEqual(true);
    expect(testRover.mode).toBe("NORMAL");
  })
});
