import session from 'express-session'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

export let airportSession =
    session({
        name: 'airport-session',
        secret: process.env.SESSION_SECRET,
        resave: false, // https://www.npmjs.com/package/express-session#user-content-resave
        saveUninitialized: false, // https://www.npmjs.com/package/express-session#user-content-saveuninitialized
        cookie: {
            maxAge: 1000 * 60 * 60, // 1 ώρα
            sameSite: true,
            // secure: true //Το cookie θα σταλεί μόνο μέσω https. Σε απλό http δε θα λειτουργήσει
        }
    })
export default airportSession;