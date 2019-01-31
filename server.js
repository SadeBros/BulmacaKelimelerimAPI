const express = require('express');
const bodyParser = require('body-parser');

/* Firebase Admin SDK Configuration*/
var admin = require("firebase-admin");
var serviceAccount = require("<Replace with your serviceAccount.json file>");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "<Replace with your url>"
});

var app = express();

// Middlewares !!
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
var defaultDatabase = admin.database();
var ref = defaultDatabase.ref();

// http://localhost:3000/api/words
/* 
	Word-Question pairs...
*/
app.get('/api/all', (req,res) => {


	var wordsAndQuestion = {};

	var defaultDatabase = admin.database();
	var ref = defaultDatabase.ref();

	ref.on('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			var key = childSnapshot.key;
			var val = childSnapshot.val();

			wordsAndQuestion[key] = val;

		});

		res.send(wordsAndQuestion);
	});	
});

// http://localhost:3000/api/words
/* 
	Just words...
*/
app.get('/api/words', (req,res) => {

	var words ={'words': []};
	ref.on('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			var word = childSnapshot.key;

			words.words.push (word);

		});

		res.send(words);
	});	
});

// http://localhost:3000/api/questions
/* 
	Just questions...
*/
app.get('/api/questions', (req,res) => {

	var questions ={'questions': []};
	ref.on('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			var question = childSnapshot.val();

			questions.questions.push (question);

		});

		res.send(questions);
	});	
});


// http://localhost:3000/api/add
// API'ye göndereceğin JSON formatlı veri formatı;
/* 
{
	"key":"kelimeadı",
	"val":"sorusu"
}
*/
app.post('/api/add', (req,res) => {

	var key=req.body.word;
	var val= req.body.question;

	console.log(key + ": " + val);
	var refChild = ref.child(key);
	refChild.set(value);

	res.sendStatus(200);
});


// http://localhost:3000/api/del
/* 
{
	Deletes given key(word)
}
*/
app.post('/api/del', (req,res) => {

	var key=req.body.word;

	console.log(key);

	ref.child(key).remove();

	res.sendStatus(200);
});

// http://localhost:3000/api/random
/* 
{
	Returns Random Word and Question pair
}
*/
app.get('/api/random', (req,res) => {
	var wordsAndQuestion = {};

	var defaultDatabase = admin.database();
	var ref = defaultDatabase.ref();

	ref.on('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			var key = childSnapshot.key;
			var val = childSnapshot.val();

			wordsAndQuestion[key] = val;

		});
	var keys = Object.keys(wordsAndQuestion);
	var answer = keys[ keys.length * Math.random() <<0 ];
	var question = wordsAndQuestion[answer];
	var data = {};
	data[answer] = question;
	res.send(data);
	});	
});


function getAllWord(){
	var wordsAndQuestion = {};

	var defaultDatabase = admin.database();
	var ref = defaultDatabase.ref();

	ref.on('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			var key = childSnapshot.key;
			var val = childSnapshot.val();

			wordsAndQuestion[key] = val;

		});
		return wordsAndQuestion;
	});	
}

const port = process.env.PORT || 3000;

// Replace <Server IP> with your server ip
app.listen(port,'<Server IP>',() =>{
	console.log(`Server is up on port ${port}`);
});


