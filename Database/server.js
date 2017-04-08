// modules =================================================
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var app = express();

// configuration ===========================================

// set our port
var port = process.env.PORT || 4001;

// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Mongoose stuff ===========================================
// connect to our mongoDB database
mongoose.connect('mongodb://localhost:27017/txsthack');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("MongoDb Connected.");
});

// Schemas ===========================================
var housingSchema = new mongoose.Schema({
    "_id" : String,
    "Project Name" : String,
    "Owner" : String,
    "Developer" : String,
    "Address" : String,
    "Zip Code" : Number,
    "Council District" : Number,
    "Kirwan Opportunity Index" : String,
    "Distance to Bus Stop" : String,
    "Total Units" : Number,
    "Total Affordable Units" : Number,
    "Unit Type" : String,
    "Program" : String,
    "Housing Type" : String,
    "Status" : String,
    "Affordability Start Date" : Date,
    "Affordability Period" : Number,
    "Affordability Expiration Date" : Date,
    "Certification Date" : Date,
    "C of O Date" : Date,
    "Required Amount of Fee in Lieu" : Number,
    "Date Fee in Lieu Received" : Number,
    "Units <= 30% MFI" : Number,
    "Units <= 40% MFI" : Number,
    "Units <= 50% MFI" : Number,
    "Units <= 60% MFI" : Number,
    "Units <= 65% MFI" : Number,
    "Units <= 80% MFI" : Number,
    "Units <= 100% MFI" : Number,
    "Market Rate Units" : Number,
    "City Funded Amount" : Number,
    "% of Funds Leveraged" : Number,
    "CLT" : String,
    "DDB" : String,
    "RNY" : String,
    "MDA" : String,
    "NBG" : String,
    "PUDDA" : String,
    "SMART" : String,
    "TOD" : String,
    "UNO" : String,
    "VMU" : String,
    "Location" : String //"(30.2820072186666, -97.708413721868695)"
});

 var Housing = mongoose.model('Housing', housingSchema);

// API Endpoints ===========================================
// All Points ==============================================
app.get('/getPoints', function (req, res) {
    Housing.find({}, function(err, e){res.send(e);});
});

// Search with filters
app.get('/search', function(req, res) {
    var filters = {};
    if(req.query.zip != undefined)
    {
        filters["Zip Code"] = req.query.zip;
    }
    if(req.query.bus != undefined)
    {
        filters["Distance to Bus Stop"] = req.query.bus;
    }
    if(req.query.dev != undefined)
    {
        filters["Developer"] = new RegExp('^'+req.query.dev+'$', "i");
    }
    if(req.query.type != undefined)
    {
        filters["Unit Type"] = req.query.type;
    }

    Housing.find(filters, function(err, results) {
        res.send(results);
    });        
});

// Server Start ==========================================

app.listen(port);
console.log("Server is now listening on port: " + port);

exports = module.exports = app;