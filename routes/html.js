let express = require("express"),
    mongoose = require("mongoose"),
    axios = require("axios"),
    cheerio = require("cheerio"),
    exphbs = require("express-handlebars"),
    db = require("../models");

module.exports = function(app) {
    // route home page, grabing all articles
    app.get("/", function (req, res) {
        db.Article.find({}).sort({_id:-1}).populate("notes").then(function(dbArticle) {
            var hbdata = {
                pageTitle: "Scaley Scraper",
                article: dbArticle
            };
            console.log(hbdata);
            res.render("index", hbdata);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
            res.json(err);
        });;
    });

    // route for saved articles page
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).sort({_id:-1}).populate("notes").then(function(dbArticle) {
            var hbdata = {
                pageTitle: "Saved Articles",
                article: dbArticle
            };
            console.log(hbdata);
            res.render("saved", hbdata);
        });
    });

    // route for displaying articles with its corresponding notes
    app.get("/notes/:id", function (req, res) {
        db.Article.findById(req.params.id).populate("notes").then(function(dbArticle) {
            var hbdata = {
                pageTitle: "Add Notes",
                article: dbArticle
            };
            console.log(hbdata);
            res.render("notes", hbdata);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
            res.json(err);
        });
    });

};