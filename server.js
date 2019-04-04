let express = require("express"),
    mongoose = require("mongoose"),
    exphbs = require("express-handlebars"),
    app = express();

// Require all models
let db = require("./models");

// setting server port
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//require routes for the application
require("./routes")(app);

app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});