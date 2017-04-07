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

// Mongoose stuff ===========================================
// connect to our mongoDB database
mongoose.connect('mongodb://localhost:27017/txsthack');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("MongoDb Connected.");
});

// Schemas ===========================================

var Schema = mongoose.Schema;
// var userSchema = new Schema({
//     name: String,
//     email: String,
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     admin: Boolean,
//     imageuri: String,
//     following: [{ type: String }]
// });

// var User = mongoose.model('User', userSchema);

// var postSchema = new Schema({
//     username: { type: String, required: true },
//     body: { type: String, required: true },
//     num_likes: Number,
//     users_with_like: [{ type: String }],
//     createdOn: Date,
//     isactive: Boolean
// });

// var Post = mongoose.model('Post', postSchema);

// API Endpoints ===========================================
// Profile ==============================================
app.post('/userInfo', function (req, res) {
    if (req.body.userOwnsPage && req.body.userOwnsPage == "true") {
        User.findOne({ username: req.body.username }, 'username email name imageuri', function (err, user) {

            if (user === null) {
                var response = {
                    status: 500,
                    error: 'User not found, please sign in.'
                }
                res.end(JSON.stringify(response));
                return;
            }

            var isMatch = true; // false by default
            // if(req.body.token !== null)
            // {
            //     isMatch = bcrypt.compareSync(user.username + user.password, req.body.token);
            // }

            if (isMatch) {
                var userInfo = {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    imageuri: user.imageUri
                };

                res.send(JSON.stringify(userInfo));
            }
            else {
                var response = {
                    status: 501,
                    error: 'User token was incorrect please signin again.'
                }
                res.end(JSON.stringify(response));
            }
        });
    }
    // User is guest, hide personal data
    else {
        User.findOne({ username: req.body.username }, 'username name imageuri', function (err, user) {

            if (user === null) {
                var response = {
                    status: 500,
                    error: 'Requested user not found.'
                }
                res.end(JSON.stringify(response));
            }
            else {
                var userInfo = {
                    name: user.name,
                    username: user.username,
                    imageuri: user.imageUri
                };
                res.send(JSON.stringify(userInfo));
            }
        });
    }
});


// Server Start ==========================================

app.listen(port);
console.log("Server is now listening on port: " + port);

exports = module.exports = app;