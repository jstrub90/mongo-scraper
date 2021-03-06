let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;