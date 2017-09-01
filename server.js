var express = require('express'),
    cors = require('cors'),
    app = express();

//var router = express.Router();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var Web3 = require('web3');
var Bzz = require('web3-bzz');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(fileUpload());

//session configs
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it


app.use(cookieParser());

app.use(expressSession({
    secret: 'test_session',
    resave: false,
    saveUninitialized: true
}));


//For enabling CORS
app.use(cors());


var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://159.203.116.70:8545"));
    //console.log(web3.net.peerCount);
}

web3.eth.defaultAccount=web3.eth.accounts[0];

var healthcareTemplateContractABI = [{"constant":false,"inputs":[{"name":"quest1","type":"bool"},{"name":"quest2","type":"bool"},{"name":"quest3","type":"bool"},{"name":"quest4","type":"bool"},{"name":"quest5","type":"bool"},{"name":"quest6","type":"bool"}],"name":"addQuestion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"projects","outputs":[{"name":"index","type":"uint256"},{"name":"location","type":"string"},{"name":"coordinator","type":"address"},{"name":"projectDetailHash","type":"string"},{"name":"projectImageHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getProjectByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"questions","outputs":[{"name":"question1","type":"bool"},{"name":"question2","type":"bool"},{"name":"question3","type":"bool"},{"name":"question4","type":"bool"},{"name":"question5","type":"bool"},{"name":"question6","type":"bool"},{"name":"index","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getProjectCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_location","type":"string"},{"name":"_projectDetailHash","type":"string"},{"name":"_projectImageHash","type":"string"}],"name":"addNewProject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getQuestionByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"},{"name":"_coordinator","type":"address"}],"name":"assignCoordinator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index","type":"uint256"},{"indexed":false,"name":"location","type":"string"}],"name":"ProjectCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index","type":"uint256"},{"indexed":false,"name":"coordinator","type":"address"}],"name":"CoordinatorAssigned","type":"event"}];

var healthcareTemplateContractAddress = "0xe481b3b7746bedb7ecc3dac1ec24392829c896ce";

var HealthcareTemplateContract = web3.eth.contract(healthcareTemplateContractABI).at(healthcareTemplateContractAddress);

var bzz = new Bzz('http://localhost:8500');

if(!bzz.currentProvider) {
    bzz.setProvider("http://swarm-gateways.net");
}

app.get('/', function(req, res) {
    res.send("This is the API server developed for Healthcare DApp");
})

app.listen(3003, function() {
    //console.log(bzz.currentProvider);
    console.log('app running on port : 3003');
});

app.get('/getProjectCount', function(req, res) {

    HealthcareTemplateContract.getProjectCount.call(function(err, result) {
        //console.log(result);
        if (!err) {
            res.json({"projectCount":result});
        } else
            res.status(401).json("Error" + err);
    });
});

app.post('/addNewProject', function(req, res) {

    var location = req.body._location;
    var projectDetailHash = req.body._projectDetailHash;
    var projectImageHash = req.body._projectImageHash;

    HealthcareTemplateContract.addNewProject.sendTransaction(location, projectDetailHash, projectImageHash, { from: web3.eth.defaultAccount, gas:4712388}, function(err, result) {
      // console.log(result);
       if (!err) {
           res.end(JSON.stringify(result));
       } else
           res.status(401).json("Error" + err);
   });
});

app.post('/addQuestions', function(req, res) {

    var question1 = req.body._question1;
    var question2 = req.body._question2;
    var question3 = req.body._question3;
    var question4 = req.body._question4;
    var question5 = req.body._question5;
    var question6 = req.body._question6;

    HealthcareTemplateContract.addQuestion.sendTransaction(question1, question2, question3, question4, question5, question6, { from: web3.eth.defaultAccount, gas:4712388}, function(err, result) {
      // console.log(result);
       if (!err) {
           res.end(JSON.stringify(result));
       } else
           res.status(401).json("Error" + err);
   });
});


app.post('/assignCoordinator', function(req, res) {

    var currentIndex = req.body._currentIndex;
    var coordinator = req.body._coordinator;

    HealthcareTemplateContract.assignCoordinator.sendTransaction(currentIndex, coordinator, { from: web3.eth.defaultAccount, gas:4712388}, function(err, result) {
       //console.log(result);
       if (!err) {
           res.end(JSON.stringify(result));
       } else
           res.status(401).json("Error" + err);
   });
});

app.post('/getProjectDetail', function(req, res) {

    var currentIndex = req.body._currentIndex;

    HealthcareTemplateContract.getProjectByIndex.call(currentIndex, function(err, result) {
        //console.log(result);
        if (!err) {
            res.json({"Index":result[0],"Location":result[1],"Coordinator":result[2],"ProjectDetailHash":result[3], "ProjectImageHash":result[4]});
        } else
            res.status(401).json("Error" + err);
    });
});

app.post('/getQuestionByIndex', function(req, res) {

    var currentIndex = req.body._currentIndex;

    HealthcareTemplateContract.getQuestionByIndex.call(currentIndex, function(err, result) {
        //console.log(result);
        if (!err) {
            res.json({"Index":result[0],"Question1":result[1],"Question2":result[2],"Question3":result[3], "Question4":result[4], "Question5":result[5], "Question6":result[6]});
        } else
            res.status(401).json("Error" + err);
    });
});

app.post('/uploadTextData', function(req, res) {

     var text = req.body._text;

     bzz.upload(text).then(function(hash) {
       //console.log("Uploaded text. Address:", hash);
       if(hash) {
         res.json({"address":hash});
       } else {
         res.status(401).json("Error");
       }
     });
});

app.post('/downloadTextData', function(req, res) {

     var hash = req.body._hash;

     bzz.download(hash).then(function(buffer) {
       //console.log("Downloaded text:", buffer.toString());
       if(buffer.toString()) {
         res.json({"text":buffer.toString()});
       } else {
         res.status(401).json("Error");
       }
     });
});

app.post('/uploadProjectData', function(req, res) {

     var projectTitle = req.body._projectTitle;
     var subtitle = req.body._subtitle;
     var description = req.body._description;
     var coordinator = req.body._coordinator;

     var data = {
        projectTitle : projectTitle,
        subtitle : subtitle,
        coordinator: coordinator,
        description : description
     };

     bzz.upload(JSON.stringify(data)).then(function(hash) {
       if(hash) {
         res.json({"address":hash});
       } else {
         res.status(401).json("Error");
       }
     });
});

app.post('/downloadProjectData', function(req, res) {

     var hash = req.body._hash;

     bzz.download(hash).then(function(buffer) {
       if(buffer.toString()) {
         res.end(buffer.toString());
       } else {
         res.status(401).json("Error");
       }
     });
});


app.post('/uploadPhotoData', function(req, res) {

   if (!req.files || req.files.photo == undefined) {
     return res.status(400).send('No photo were uploaded.');
   }
   var photoFile = req.files.photo;
   var fileName = '/Users/leoanbarasanm/Desktop/Photos/' + req.files.photo.name;
   photoFile.mv(fileName, function(err) {
     if (err) {
       return res.status(500).send(err);
     }
     bzz.upload({path:fileName, kind:"file"}).then(function(hash) {
       //console.log("Uploaded photo. Address:", hash);
       if(hash) {
         res.json({"address":hash});
       } else {
         res.status(401).json("Error");
       }
     });
   });
});


app.post('/downloadPhotoData', function(req, res) {
     var hash = req.body._hash;
     bzz.download(hash).then(function(path) {
       console.log(path);
       if(path) {
        // res.download("photo.jpg");
        // res.send(path.toString());
        // res.end();
        res.send(path);
       } else {
         res.status(401).json("Error");
       }
     });
});
