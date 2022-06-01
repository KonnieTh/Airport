import express from 'express'
const app = express()

// import dotenv from 'dotenv'
// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config();
// }


import exphbs from 'express-handlebars';

app.use(express.urlencoded({ extended: false }));

//Ενεργοποίηση συνεδρίας
// app.use(taskListSession)

// //Σε κάθε request περνάμε στο αντικείμενο locals του response object την τιμή
// //του loggedUserId. Η res.locals.userId είναι προσβάσιμη από το hbs ως `userId`
// //Γενικά όλα τα μέλη του αντικειμένου res.locals είναι προσβάσιμα στη μηχανή template.
// //(http://expressjs.com/en/api.html#res.locals)
// app.use((req, res, next) => {
//     res.locals.userId = req.session.loggedUserId;
//     next();
// })

app.use(express.static('public'))

//Διαδρομές. Αντί να γράψουμε τις διαδρομές μας εδώ, τις φορτώνουμε από ένα άλλο αρχείο
import routes from './routes/airport-app-routes.mjs'
//και τώρα χρησιμοποιούμε αυτές τις διαδρομές
app.use('/', routes);

app.engine('hbs', exphbs.engine({
    defaultLayout: 'layout', // το default είναι main, αλλά το "layout" ίσως πιο διαισθητικό
    extname: 'hbs'
}));

app.set('view engine', 'hbs');

export { app as Airport};