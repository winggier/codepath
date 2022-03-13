/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// console.log("Hello, world!");

//Global Variables
// var pattern = [2, 2, 4, 3, 2, 1, 2, 4, 3, 4, 3, 1, 2, 4, 1, 3, 3, 1, 1, 4, 2, 4, 1, 1, 3, 2];
var psize = 10;
var pattern = 0;
var progress = 0;
var strikes = 3; 


var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 500; //how long to hold each clue's light/sound
var cluePauseTime = 100; //how long to pause in between clues
var nextClueWaitTime = 500; //how long to wait before starting playback of the clue sequence

function startGame(){
    // initialize game variables
    strikes = 3; 
    progress = 0;
    pattern = getPatt(psize);
    gamePlaying = true;
    console.log("Random pattern: " + pattern);
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence()
}

function stopGame(){
    // initialize game variables
    gamePlaying = false;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function lightButton(btn){
  document.getElementById("b"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("b"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  // context.resume()  //?
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won.");
}

function getPatt(size) {
  return Array.from({length: size}, () => Math.ceil(Math.random() * 4));
}

function Monkey() {
  psize = 10;
  clueHoldTime = 800;
  cluePauseTime = 200;
  nextClueWaitTime = 800;
  console.log("Monkey (patterns length 10 and slower) level set");
}

function Human() {
  psize = 20;
  clueHoldTime = 500;
  cluePauseTime = 100;
  nextClueWaitTime = 400;
  console.log("Human (patterns length 20) level set");
}

function God() {
  psize = 40;
  clueHoldTime = 200;
  cluePauseTime = 80;
  nextClueWaitTime = 300;
  console.log("God (patterns length 40 and faster) level set");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(btn == pattern[guessCounter]){
    // console.log("user got: " + pattern[guessCounter]);
    if(guessCounter == progress){
      if(progress == pattern.length - 1) {
        winGame();
      }
      else{
        progress++;
        playClueSequence();
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    strikes--;
    if(strikes == 0) {loseGame();}
    console.log("bad guess.. strike left " + strikes);
    playClueSequence();
  }
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
