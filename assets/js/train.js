// create a jumbotron to display the train name and destination.
// create a panel to display the current train schedule
// displayde basic spec Train
//  Name, Destination, First Train Time -- in military time, Frequency -- in minutes.
//  display1st train and cod it's spec.


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAhWwyDNGGiGLNSkBQ00fDv4GvUcy5fb1A",
    authDomain: "ucb-trainscheduler.firebaseapp.com",
    databaseURL: "https://ucb-trainscheduler.firebaseio.com",
    projectId: "ucb-trainscheduler",
    storageBucket: "ucb-trainscheduler.appspot.com",
    messagingSenderId: "1028514001643"
  };
  firebase.initializeApp(config);

var dataRef = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";




// Capture Button Click
$("#add-train").on("click", function() {

  // YOUR TASK!!!
  // Code in the logic for storing and retrieving the most recent user.
  // Don't forget to provide initial data to your Firebase database.
  trainName = $("#tName-input").val().trim();
  destination = $("#dest-input").val().trim();
  firstTrainTime = $("#tTime-input").val().trim();
  frequency = $("#frequency-input").val().trim();

  $("#tName-input").val(null);
  $("#dest-input").val(null);
  $("#tTime-input").val("");
  $("#frequency-input").val("");


  // Code for the push
  dataRef.ref().push({

    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  // Don't refresh the page!
  return false;
});



//value 
//child_added
// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")

// .on('value') triggers anytime any of the data changes 

//where as child_added only triggers if a child is added (not modified)
dataRef.ref().on("child_added", function(childSnapshot) {

  var tFrequency = childSnapshot.val().frequency;

  // Time is 3:30 AM
  var firstTime = childSnapshot.val().firstTrainTime;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  

  // Current Time
  var currentTime = moment();
  

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
 
  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
 
  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
 
  // full list of items to the well
  var tr = $("<tr>");
  tr.append("<td>" + childSnapshot.val().trainName)
    .append("<td>" + childSnapshot.val().destination)
    .append("<td>" + childSnapshot.val().frequency)
    .append("<td>" + moment(nextTrain).format("hh:mm A"))
    .append("<td>" + tMinutesTillTrain);

  $("#trainTable").append(tr);

  // Handle the errors
}, function(errorObject) {
  
});
dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(data) {

  // Change the HTML to reflect
  $("#trainName-display").html(data.val().trainName);
  $("#dest-display").html(data.val().destination);
  $("#tTime-display").html(data.val().firstTrainTime);
  $("#frequency-display").html(data.val().frequency);
});
