import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CustomStrategy } from 'passport-custom';
import passport = require('passport');
import User from '../entity/User/entity';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import config from './../config';
import Invite from '../entity/Invite/entity';

export default async (): Promise<void> => {
    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        const user = await User.findOne({ email: email });

        if (!user) {
            done(new Error('Incorrect Username'), false, { message: 'Incorrect username.' });
            return;
        }

        if (!user.verifyPassword(password)) {
            done(new Error('Incorrect Password'), false, { message: 'Incorrect password.' });
        }

        done(null, user);
    }));

    passport.serializeUser((user: User, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: User['id'], done) => {
        const user = await User.findOne(id);
        done(null, user);
    });

    passport.use('token', new JWTstrategy({
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (jwt_payload, done) => {
        //console.log(JSON.stringify(jwt_payload));
        const user = await User.findOne({ id: jwt_payload.user.id });
        if (!user) {
            done(null, false, { message: 'Invalid Token ' });
        }
        done(null, user);
    }));

    passport.use('response-auth', new CustomStrategy(async (req:any, done) => {
        const response = await Invite.findOne({ accessCode: req.query.accessCode })
            .catch(err => done(err));
        if (!response) {
            done(null, false);
        }
        done(null, response);
    }));
}; 