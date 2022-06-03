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



app.engine('hbs',exphbs.engine({
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

app.get('/main-page',(req,res)=>{
    res.render('main-page',{
        style:'style-main-page.css',
        script:'main.js',
        layout:'layout-main-page'
    })
})

app.get('/main-page-admin',(req,res)=>{
    res.render('main-page-admin',{
        style:'style-main-page-admin.css',
        script:'main.js',
        layout:'layout-main-page-admin'
    })
})

app.get('/text/:titlos',(req,res)=>{
    const title = req.params.titlos;
    model.getText(title,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})

app.put('/edit_text',(req,res)=>{
    const text = req.body;
    console.log(text,req.body);
    model.editInfo(text,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})


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

app.get('/companies-admin/:letter',(req,res)=>{
    let letter=req.params.letter;
    console.log(letter=req.params.letter);
    model.getAirlinebyletter(letter,(err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('companies-admin',{
            style:'companies-admin.css',
            script:'companies-admin.js',
            layout:'layout-admin',
            airlines:rows
        })
    })
})

app.get('/airline_name/:iata',(req,res)=>{
    let iata = req.params.iata;
    model.getAirlineName(iata,(err,data)=>{
        if(err){
            return console.error(err.message);
        }
        res.json(data);
    })
})

app.put('/airlines_edit',(req,res)=>{
    const airline=req.body;
    console.log(airline);
    model.editAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
            res.redirect('/companies/A');
        }
    })
})

app.delete('/airlines_delete',(req,res)=>{
    const airline=req.body;
    model.deleteAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})

app.post('/new_airline',(req,res)=>{
    const airline=req.body;
    model.insertAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
});


app.get('/flights/arrivals',(req,res)=>{
    model.addFlightFrom((err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('flights',{
            style:'flights.css',
            script:'flights.js',
            layout:'layout',
            flights:rows
        })
    res.render('flights',{
        style:'flights.css',
        script:'flights.js',
        layout:'layout'
    })
    })
})

app.get('/flights/departures',(req,res)=>{
    model.addFlightTo((err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('flights',{
            style:'flights.css',
            script:'flights.js',
            layout:'layout',
            flights2:rows
        })
    res.render('flights',{
        style:'flights.css',
        script:'flights.js',
        layout:'layout'
    })
    })
})

app.get('/flights-admin',(req,res)=>{
    res.render('flights-admin',{
        style:'flights-admin.css',
        script:'flights.js',
        layout:'layout-admin'
    })
})


app.get(`/shops`,(req,res)=>{
    res.render('shops',{
        style:'shops.css',
        script:'shops.js',
        layout:'layout'
    })
})

app.get(`/shops-admin`,(req,res)=>{
    res.render('shops',{
        style:'shops.css',
        script:'shops.js',
        layout:'layout-admin'
    })
})


app.get('/announcements',(req,res)=>{
    model.getAnnouncements((err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements',{
                style:'announcements.css',
                script:'announcements.js',
                layout:'layout',
                announcements:data
            })
        }
    })
})

app.get('/announcements/id/:id',(req,res)=>{
    // console.log(req.query);
    model.getAnnouncementById(req.params.id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('show-announcement',{
                style:'announcements.css',
                script:'announcements.js',
                layout:'layout',
                announcements:data
            })
        }
    })
})

app.get('/announcements/search',(req,res)=>{
    const priority = req.query.priority;
    console.log(priority);
    model.getAnnouncementsByPriority(priority,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements',{
                style:'announcements.css',
                script:'announcements.js',
                layout:'layout',
                announcements:data
            })
        }
    })
})


app.get('/announcements-admin',(req,res)=>{
    model.getAnnouncements((err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements-admin',{
                style:'announcements-admin.css',
                script:'announcements.js',
                layout:'layout-admin',
                announcements:data
            })
        }
    })
})

app.get('/announcements-admin/search',(req,res)=>{
    const priority = req.query.priority;
    console.log(priority);
    model.getAnnouncementsByPriority(priority,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements-admin',{
                style:'announcements-admin.css',
                script:'announcements.js',
                layout:'layout-admin',
                announcements:data
            })
        }
    })
})

app.get('/announcements-admin/id/:id',(req,res)=>{
    // console.log(req.query);
    model.getAnnouncementById(req.params.id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements-admin',{
                style:'announcements-admin.css',
                script:'announcements.js',
                layout:'layout-admin',
                announcements:data
            })
        }
    })
})

app.post('/create_announcement',(req,res)=>{
    const text = req.body;
    console.log(text);
    model.createAnnouncement(text,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})




// app.get('/announcements/',(req,res)=>{
//     console.log(req.query)
//     // model.getAnnouncementsStart(0,10,(err,data) =>{
//     //     if(err){
//     //         return console.error(err.message);
//     //     }
//     //     else{
//     //         res.render('announcements',{
//     //             style:'announcements.css',
//     //             script:'announcements.js',
//     //             layout:'layout',
//     //             announcements:data
//     //         })
//     //     }
//     // })
// })


// app.get('/get_announcement/:id',(req,res)=>{
//     const params = req.body;
//     console.log(params);
//     model.getAnnouncements((err,data) =>{
//         if(err){
//             return console.error(err.message);
//         }        
//         else{
//             res.json(data);
//         }
//     })
// })







export { app as Airport};