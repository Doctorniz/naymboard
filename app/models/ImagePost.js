const mongoose = require('mongoose');
var slugify = require('slugify-mongoose');


const Schema = mongoose.Schema;

const commentSchema = new Schema ({
   CommentAuthor: String,
   CommentCreated: {type: Date, default: Date.now},
   CommentContent: String,
   CommentEdited: {type: Date},
   OC: String
});

const imagePostSchema = new Schema ({
   ImageTitle: String,
   Contributor: String,
   ImageLink: String,
   ImageDesc: String,
   ImageTags: Array,
   LikedBy: Array,
   Comments: [commentSchema],
   slug: { type: String, slug: 'ImageTitle', unique: true }
}, {timestamps: true});

imagePostSchema.plugin(slugify);


const ImagePostModel = mongoose.model('imagePosts', imagePostSchema);

module.exports = ImagePostModel;