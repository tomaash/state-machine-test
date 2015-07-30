var fsm = require("state.js");

// create the state machine model elements
var model = new fsm.StateMachine("model").setLogger(console);
var initial = new fsm.PseudoState("initial", model, fsm.PseudoStateKind.Initial);

var idea = new fsm.State("idea", model);
var pitch = new fsm.State("pitch", model);
var inProgress = new fsm.State("inProgress", model);
var draft = new fsm.State("draft", model);
var content = new fsm.State("content", model);
var reviewed = new fsm.State("reviewed", model);
var scheduled = new fsm.State("scheduled", model);
var published = new fsm.State("published", model);
var takenDown = new fsm.State("takenDown", model);
var rejected = new fsm.State("rejected", model);

var states = {idea, pitch, inProgress, draft, content, reviewed, scheduled, published, takenDown, rejected};

inProgress.entry(function(){
  console.log(`Update ${instance.name} db state to inProgress`);
});

draft.entry(function(){
  console.log(`Update ${instance.name} db state to draft`);
});

rejected.entry(function(){
  console.log(`Update ${instance.name} db state to rejected`);
});

function transition(action) {
  return function(message) {
    // if (typeof message === "string") console.log(message);
    return message === action;
  }
}

idea.to(pitch).when(transition("submitIdea"));
pitch.to(idea).when(transition("fixIdea"));
pitch.to(inProgress).when(transition("approveIdea"));
inProgress.to(draft).when(transition("submitDraft"));
draft.to(content).when(transition("approveDraft"));

content.to(reviewed).when(function(message){
  if (message === "approveLanguage") {
    article.languageOK = true;
    return article.languageOK && article.graphicsOK
  }
})

content.to(reviewed).when(function(message){
  if (message === "approveGraphics") {
    article.graphicsOK = true;
    return article.languageOK && article.graphicsOK
  }
})

// HERE STARTS THE ARTICLE ACTION
var article = {
  id: "article_foo",
  state: "idea",
  languageOK: false,
  graphicsOK: false
}

// create a state machine instance
var instance = new fsm.StateMachineInstance(article.id);

// Load initial state
initial.to(states[article.state]);

// initialise the model and instance
fsm.initialise(model, instance);

var user = "editor";
// send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
fsm.evaluate(model, instance, "submitIdea");
// user = "admin";
fsm.evaluate(model, instance, "approveIdea");
fsm.evaluate(model, instance, "submitDraft");
fsm.evaluate(model, instance, "approveDraft");

// Those 2 any order
fsm.evaluate(model, instance, "approveGraphics");
fsm.evaluate(model, instance, "approveLanguage");


