import express from 'express'
const app = express()
import cors from 'cors';
// import dotenv from 'dotenv'
// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config();
// }


import * as model from './model/heroku-pg/airport-queries.js'

import exphbs from 'express-handlebars';


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
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
//και τώρα χρησιμοποιούμε αυτές τις διαδρομές

app.engine('hbs', exphbs.engine({
    defaultLayout: 'layout', // το default είναι main, αλλά το "layout" ίσως πιο διαισθητικό
    extname: 'hbs'
}));

app.set('view engine', 'hbs');



app.route('/').get((req, res) => { res.redirect('/main-page') });

// app.get('/companies',(req,res)=>{
//     res.render('companies',{
//         style:'companies.css',
//         script:'companies.js',
//         layout:'layout'
//     })
// })





app.get('/companies/:letter',(req,res)=>{
    let letter=req.params.letter;
    console.log(letter=req.params.letter);
    model.getAirlinebyletter(letter,(err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('companies',{
            style:'companies.css',
            script:'companies.js',
            layout:'layout',
            airlines:rows
        })
        
    })
})




export { app as Airport};