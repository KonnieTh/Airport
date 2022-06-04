import express from 'express'
const app = express()
import cors from 'cors';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import * as model from './model/heroku-pg/airport-queries.js'
import exphbs from 'express-handlebars';
import airportSession from './app-setup-session.mjs'


function getDateTime(){
    const date = new Date();
    const year = date.getFullYear();
    let month;
    if (date.getMonth()+1<10){
        month = '0' + (date.getMonth()+1);
    }
    else{
        month = date.getMonth()+1;
    }
    let day;
    if (date.getDate()<10){
        day = '0' +date.getDate();
    }
    else{
        day = date.getDate();
    }
    let hours;
    if (date.getHours()<10){
        hours = '0' +date.getHours();
    }
    else{
        hours = date.getHours();
    }
    let minutes;
    if (date.getMinutes()<10){
        minutes = '0' +date.getMinutes();
    }
    else{
        minutes = date.getMinutes();
    }
    let seconds;
    if (date.getSeconds()<10){
        seconds = '0' +date.getSeconds();
    }
    else{
        seconds = date.getSeconds();
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
 
app.use(airportSession);

app.use((req, res, next) => {
    model.getAdmin(req.session.loggedUserId,(err,user)=>{     
        if(err){
            return console.error(err.message);
        }
        if (user == undefined) {
            res.locals.userId = req.session.loggedUserId;
            console.log("USER",res.locals.userId);
        }else{
            res.locals.adminId=req.session.loggedUserId;
            console.log("ADMIN",res.locals.adminId)
        }
    })    
    res.locals.both = req.session.loggedUserId;
    next();
})





app.use(express.static('public'))

app.engine('hbs',exphbs.engine({
    defaultLayout: 'layout',
    extname: 'hbs'
}));

app.set('view engine', 'hbs');



app.route('/').get((req, res) => { res.redirect('/main-page') });

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
        layout:'layout-main-page'
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
    const date = getDateTime();
    model.editInfo(text,date,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})

app.get('/airlines/:name',(req,res)=>{
    let name = req.params.name;
    model.getAirline(name,(err,data)=>{
        if(err){
            return console.error(err.message);
        }
        res.json(data);
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
    const date = getDateTime();
    model.editAirline(airline,date,(err,data) =>{
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
    const date = getDateTime();
    model.deleteAirline(airline,date,(err,data) =>{
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
    const date = getDateTime();
    model.insertAirline(airline,date,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
});


app.get('/flights',(req,res)=>{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var full_date=year + "-" + month + "-" + date;
    let newday1=("0" +(parseInt(date)+1).toString()).slice(-2);
    var full_date1=year + "-" + month + "-" + newday1;
    let newday2=("0" +(parseInt(date)+2).toString()).slice(-2);
    var full_date2=year + "-" + month + "-" + newday2;
    let newday3=("0" +(parseInt(date)+3).toString()).slice(-2);
    var full_date3=year + "-" + month + "-" + newday3;

    model.getAirports((err,rows) => {
        if(err){
            return console.error(err.message);
        }
        model.getAirlines((err2,rows2) => {
            if(err2){
                return console.error(err2.message);
            }
            res.render('flights',{
                style:'flights.css',
                script:'flights.js',
                layout:'layout',
                airports:rows,
                airlines:rows2,
                bool3:true,
                dates:[
                    {date:full_date},
                    {date:full_date1},
                    {date:full_date2},
                    {date:full_date3}
                ]
            })
        })
    })
})

app.post('/flights/done', function (req, res) {
    var {destt}=req.body;
    var des=false;
    var arr=false;
    if(destt===undefined){
        destt=true;
        des=true;
        arr=false;
    }else{
        des=false;
        arr=true;
    }
    model.getRoutes(req.body.user_airline_departure[0],req.body.user_airline_departure[1],req.body.user_arrival_airport,destt,req.body.user_number_of_flight,(err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('flights',{
            style:'flights.css',
            script:'flights.js',
            layout:'layout',
            flights:rows,
            flights2:rows,
            bool2: arr,
            bool:des
        })
    })
});

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
    const date = getDateTime();
    model.createAnnouncement(text,date,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})


app.get('/flights/arrivals',(req,res)=>{
    model.addFlightFrom((err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('flights',{
            style:'flights.css',
            script:'flights.js',
            layout:'layout',
            flights:rows,
            bool:true,
            bool2:false
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
            flights2:rows,
            bool:false,
            bool2:true
        })
    })
})

app.post('/sign-up/done', function (req, res) {
    model.insertUser(req.body.username,req.body.password,req.body.fname,req.body.lname,req.body.age,req.body.gender,req.body.mail,req.body.number,req.body.country,false,(err,rows)=>{
    if(err){
        return console.error(err.message);
    }
    res.redirect('/main-page')
    });
})

app.get('/log-out',function(req,res){
    req.session.destroy();
    res.redirect('/');
})

app.post('/log-in/done', function (req, res) {
    model.getUserByUsername(req.body.username,(err,user)=>{     
        if(err){
            return console.error(err.message);
        }
        if (user == undefined) {
            res.render('main-page', { message: 'Δε βρέθηκε αυτός ο χρήστης' });
        }else if(user.is_admin==true){
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (match) {
                    req.session.loggedUserId = user.username;
                    const redirectTo = req.session.originalUrl || "/main-page-admin";
                    res.redirect(redirectTo);
                }else {
                    res.render("main-page", { message: 'Ο κωδικός πρόσβασης είναι λάθος' })
                }
            })
        }
        else {
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (match) {
                    req.session.loggedUserId = user.username;
                    const redirectTo = req.session.originalUrl || "/main-page";
                    res.redirect(redirectTo);
                }else {
                    res.render("main-page", { message: 'Ο κωδικός πρόσβασης είναι λάθος' })
                }
            })
        }
    });
})


//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένους χρήστες
let checkAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    if (req.session.loggedUserId) {
        console.log("user is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
        //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
        if ((req.originalUrl === "/login") || (req.originalUrl === "/register")) {
            next()
        }
        else {
            //Στείλε το χρήστη στη "/login" 
            console.log("not authenticated, redirecting to /login")
            res.redirect('/login');
        }
    }
}

//Αιτήματα για σύνδεση
//Δείξε τη φόρμα σύνδεσης. Το 1ο middleware ελέγχει αν έχει γίνει η σύνδεση
// app.route('/log-in').get(checkAuthenticated, showLogInForm);

// //Αυτή η διαδρομή καλείται όταν η φόρμα φτάσει με POST και διεκπεραιώνει τη σύνδεση
// app.route('/log-in').post(doLogin);

// //Αποσυνδέει το χρήστη
// app.route('/logout').get(doLogout);

// //Εγγραφή νέου χρήστη
// app.route('/sign-up').get(checkAuthenticated, showRegisterForm);
//FIXME θεωρεί πως POST στο /register ο χρήστης δεν είναι συνδεδεμένος
// app.post('/sign-up', doRegister);

export { app as Airport};