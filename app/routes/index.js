var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');


var Users = require('../models/Users');
var ImagePost = require('../models/ImagePost')

var multer = require('multer');
var passport = require('passport');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
                    cb(null, './app/uploads/');
                },
    filename: (req, file, cb) => {
                    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                }
})



var fileFilter = (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    if(extension !== 'png' && extension !== 'jpeg' && extension !== 'gif'){
        console.log(extension);
        return cb(null, false);
    }
    cb(null, true);
}



var upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fieldSize: 25 * 1024 * 1024 }

});




router.post('/addPost', upload.single('ImageUpload'), async (req, res) => {
    let object = {};
  //  object.ImageTags = Array.isArray(req.body.ImageTags) ? req.body.ImageTags : [req.body.ImageTags];
    object.ImageDesc = req.body.ImageDesc;
    object.ImageTitle = req.body.Title;
    object.Contributor = req.body.Contributor;
    object.LikedBy = [];
    object.Comments = [];
    if(req.body.FinalImage.startsWith("data:")) {
        object.ImageLink = '/upl/' + req.file.filename;

        
        var data = await new ImagePost(object);
        await data.save((err,toSave)=> {
            if(err) return res.send("error saving to database");
            res.redirect('/'+ toSave.slug);
        });
        
        
        
        
    } else {
        object.ImageLink = req.body.ImageSource
        var data = await new ImagePost(object);
        await data.save((err,data)=> {
            if(err) return res.send("error saving to database" + err);
            res.redirect('/'+ data.slug);
        });
    }
    
    
  //  res.send(req.body)
})


router.post('/editPost', upload.single('ImageUpload'), async (req, res) => {
    let object = {};
 //   object.ImageTags = Array.isArray(req.body.ImageTags) ? req.body.ImageTags : [req.body.ImageTags];
    object.ImageDesc = req.body.ImageDesc;
    object.ImageTitle = req.body.Title;
    object.Contributor = req.body.Contributor;
    object.LikedBy = [];
    object.Comments = [];
    if(req.file && req.body.FinalImage.startsWith("data:")) {
        object.ImageLink = '/upl/' + req.file.filename;
    } else if(req.body.ImageSource!=='') {
        object.ImageLink = req.body.ImageSource
    } else {
        object.ImageLink = req.body.FinalImage

    }
    ImagePost.findOneAndUpdate({slug: req.body.slugForEdit, Contributor:req.user.username}, object, (err, docs) => {
            if(err) return res.redirect("/my");
            res.redirect("/" +req.body.slugForEdit);
        })
})


router.post('/delete/:slug', async (req, res)=> {
    ImagePost.findOne({slug:req.params.slug}, (err, doc) => {
        if(err) return res.send("error" + err)
        if(doc.Contributor === req.user.username) {
            doc.remove((err) => {
                if(err) return res.send("error" + err)
                res.redirect('/my');
            })
        } else {
            res.redirect('/my')
        }
    })
});

router.post('/LikePost', async (req, res) => {
    if(!req.user || req.user.username !== req.body.username) return res.end();
    let slug = req.body.slugForLike, user = req.user.username;
    ImagePost.findOne({slug}, async (err, doc) => {
        if(err) return res.redirect('/');
        if(!doc.LikedBy.includes(req.user.username)){
            doc.LikedBy.push(user);
            await doc.save((err, newDoc) => {
                if(err) return res.redirect('/');
                res.redirect(req.body.currentRoute)

            });
        } else {
            doc.LikedBy.splice(doc.LikedBy.indexOf(user), 1)
            await doc.save((err, newDoc) => {
                if(err) return res.redirect('/');
                res.redirect(req.body.currentRoute)

            });
        }
    })
});

router.post('/CommentPost', async(req, res) => {
    if(!req.user || req.user.username !== req.body.username) return res.end();
    let slug = req.body.slugForLike, user = req.user.username;
    let NewComment = {
        CommentContent: req.body.CommentContent,
        CommentAuthor: user,
        OC: req.body.OC
    }
    ImagePost.findOneAndUpdate({slug}, {$push: {Comments: NewComment}}, (err, doc) => {
        if(err) return res.redirect('/');
        res.redirect('/'+slug)
    })
});

router.post('/DeleteComment', async(req, res) => {
   if(!req.user || req.user.username !== req.body.username) return res.redirect(req.body.currentRoute);
    let slug = req.body.slugForLike, id=req.body.CommentID, user = req.user.username ;
    
    await ImagePost.findOneAndUpdate({slug}, 
        {$pull: {'Comments': {_id: id, 
                                $or: [{CommentAuthor:user}, {OC:user}] }}},
        (err, doc) => {
            if(err) return res.redirect(req.body.currentRoute)
            res.redirect(req.body.currentRoute);
    })
    
    
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/?error=Login unsuccessful. Please try again.'}), (req,res) => {
    res.redirect("/")
})

router.get('/tw', passport.authenticate('twitter'))

router.get('/twitter', passport.authenticate('twitter', {failureRedirect : '/'}),  (req,res, next) => {
     res.redirect("/my");
})

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
    if(err) return res.redirect('/')
    res.redirect('/'); //Inside a callback… bulletproof!
  });
})


router.post('/signup', async (req,res) => {
    var data = await new Users({username: req.body.username, password: req.body.password})
    data.save((err, user) => {
        if(err) return res.send("error" + err)
        req.login (user, (err) => {
            if(err) return console.log(err);
            res.redirect("/")
        })
    })
    
    
    
})

router.get('/userdata/:user', (req, res) => {
    
    Users.findOne({username:req.params.user} , (err, docs) => {
        if(err) return res.send("err" + err);
        return res.send(docs);
    })
    
    
});

router.get('/b/', (req,res) => res.send("cunt") );

router.get('/session', (req, res) => res.send(req.session))
router.get('/headers', (req, res) => res.send(req.headers))
router.get('/passport', (req, res) => res.send(req.user))
router.post('/testpost', (req,res) => res.send(req.body))

router.get('*', (req, res) => {
    
    ImagePost.find({}).sort({id: -1}).exec((err, data) => {
        if(err) return res.send("Error at "+err);
        let dataToRender = {
            data : data,
            title: "All Posts"
        }
        res.render('index', {
            dataToRender: dataToRender,
            isLoggedIn: req.user || {},
            error: req.query.error
        });
    })
    
    
});

module.exports = router;