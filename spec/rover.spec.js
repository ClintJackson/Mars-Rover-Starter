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
    expect(testRover.receiveMessage(message).results.length).toEqual(message.commands.length + 1);
  });

  it("responds correctly to the status check command", function(){
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message("Test message with two commands", commands);
    let testRover = new Rover(100);
    let testRoverStatus = {
      mode: testRover.mode,
      generatorWatts: testRover.generatorWatts,
      position: testRover.position
    };
    let response = testRover.receiveMessage(message);
    expect(response.results).toEqual(
      expect.arrayContaining([expect.objectContaining({roverStatus: expect.objectContaining(testRoverStatus)})]));
  });
});
