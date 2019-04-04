let express = require("express"),
    mongoose = require("mongoose"),
    axios = require("axios"),
    cheerio = require("cheerio"),
    db = require("../models");

module.exports = function(app) {
    // route for scraping new articles
    app.get("/api/scrape", function (req, res) {
        axios.get("http://www.floridasportsman.com/fishing/inshore-fishing/").then(function(response) {
            let $ = cheerio.load(response.data);
            $($(".listingResult.small").get().reverse()).each(function(i, element) {
                let result = {};
                result.title = $(this).find(".article-name").text().trim();
                result.url = $(this).find("a").attr("href");
                result.summary = $(this).find("p.synopsis").text().trim();
                result.img = $(this).find(".image-remove-reflow-container img").attr("data-src") ? $(this).find(".image-remove-reflow-container img").attr("data-src") : "https://vanilla.futurecdn.net/creativebloq/media/img/missing-image.svg";
                if (result.title !== "") {
                    // Create a new Article using the `result` object built from scraping
                    db.Article.create(result).then(function(dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
                    // db.Article.create(result, function(error, data) {
                    //     console.log(data);
                    // });
                }
            });
            // after scraping new articles rediect to homepage to display all articles
            // res.send("Scrape Complete");
            res.redirect("/");
        });
    });

    // route for saving articles
    app.get("/api/save/:id", function (req, res) {
        // res.send('id: ' + req.params.id);
        db.Article.findByIdAndUpdate(req.params.id, {saved: true}, {new: true}).then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
            res.json(err);
        });
    });

    // route for saving articles
    app.get("/api/unsave/:id", function (req, res) {
        // res.send('id: ' + req.params.id);
        db.Article.findByIdAndUpdate(req.params.id, {saved: false}, {new: true}).then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
            res.json(err);
        });
    });

    // route for saving article notes
    app.post("/api/notes/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body).then(function(dbNote) {
            console.log(dbNote);
            return db.Article.findByIdAndUpdate(req.params.id, {$push: { notes: dbNote._id }}, { new: true });
        })
        .then(function(dbArticle) {
            // res.json(dbArticle);
            res.redirect("/notes/" + req.params.id );
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // route for deleting arrticle notes
    app.post("/api/notes/:articleId/:noteId", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.findByIdAndRemove(req.params.noteId).then(function(dbNote) {
            console.log(dbNote);
            return db.Article.findByIdAndUpdate(req.params.articleId, {$pull: { notes: req.params.noteId }}, { new: true });
        })
        .then(function(dbArticle) {
            // res.json(dbArticle);
            res.redirect("/notes/" + req.params.articleId );
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

};