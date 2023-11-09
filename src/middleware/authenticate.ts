import passportJWT from "passport-jwt";
import User from "../models/user.model.js";

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET??'1234567'
};


// lets create our strategy for web token
let middleware = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser(jwt_payload.id);
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
});

const getUser = async (userId:string) => {
    return await User.findOne({
        where: { id: userId },
    });
};

export {middleware}