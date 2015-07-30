var fsm = require("state.js");

// create the state machine model elements
var model = new fsm.StateMachine("model").setLogger(console);
var initial = new fsm.PseudoState("initial", model, fsm.PseudoStateKind.Initial);
var stateA = new fsm.State("stateA", model);
var stateB = new fsm.State("stateB", model);
var stateC = new fsm.State("stateC", model);

var pitch = new fsm.State("pitch", model);
var riskOK = new fsm.State("riskOK", model);
var draft = new fsm.State("draft", model);
var rejected = new fsm.State("rejected", model);

var states = {pitch, riskOK, draft, rejected};

riskOK.entry(function(){
  console.log(`Update ${instance.name} db state to riskOK`);
});

draft.entry(function(){
  console.log(`Update ${instance.name} db state to draft`);
});

rejected.entry(function(){
  console.log(`Update ${instance.name} db state to rejected`);
});

// Create the state machine model transitions
pitch.to(riskOK).when(function (message) {
  if (message.transition === "submit" ) {
    if (message.user === "editor") {
      return true;
    }
  }
});

riskOK.to(draft).when(function (message) {
  if (message.transition === "accept" ) {
    if (message.user === "admin") {
      return true;
    } else {
      console.log(`User ${message.user} has insufficient privileges for ${message.transition}`);
    }
  }
});

riskOK.to(rejected).when(function (message) {
  if (message.transition === "reject" ) {
    if (message.user === "admin") {
      return true;
    } else {
      console.log(`User ${message.user} has insufficient privileges for ${message.transition}`);
    }
  }
});

// HERE STARTS THE ARTICLE ACTION

// create a state machine instance
var instance = new fsm.StateMachineInstance("article_foo");

var stateFromDB = "pitch";

// Load initial state
initial.to(states[stateFromDB]);

// initialise the model and instance
fsm.initialise(model, instance);

// send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
fsm.evaluate(model, instance, {user: "editor", transition: "submit"});
fsm.evaluate(model, instance, {user: "editor", transition: "accept"});
fsm.evaluate(model, instance, {user: "admin", transition: "accept"});

