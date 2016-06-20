(() => {
  const jwtStrategy = require("passport-jwt").Strategy;
  const jwtExtract = require("passport-jwt").ExtractJwt;

  const mongoose = require("mongoose");
  let User = mongoose.model('User');

  module.exports = (passport) => {
    var opts = {};
    opts.secretOrKey = process.env.JWT_SECRET;
    opts.jwtFromRequest = jwtExtract.fromAuthHeader();

    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({id: jwt_payload.id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
  }

})()
