const mongoose = require('mongoose');
const bcrypt = require('bcrypt'), salt = bcrypt.genSaltSync();

const Schema = mongoose.Schema;
const userSchema = new Schema ({
   username: String,
   password: String,
   email: String,
   city: String,
   country: String
}, {timestamps: true});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

   bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            return next();
        });
   
});

userSchema.methods.verifyPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
}




const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;