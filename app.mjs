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

//Εύρεση τωρινής ημερομηνίας και ώρας
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
//Χρειάζεται για το χειρισμό των αιτημάτων που έρχονται με POST
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
//Ενεργοποίηση συνεδρίας
app.use(airportSession);

//Εδώ καθορίζεται ο τύπος του User, αν είναι δηλαδή Admin ή Απλός User ή και μη-εγγεγραμμένος User. Παίζει ρόλο στο τι θα φαίνεται στη σελίδα.
app.use((req, res, next) => {
    try{
        if(req.session.loggedUserId[1]){
            res.locals.adminId=req.session.loggedUserId[0];
        }else{
            res.locals.userId = req.session.loggedUserId[0];
        }
        res.locals.both = req.session.loggedUserId;
        next();
    }catch{
        next();
    }
})




//Προκειμένου να παίρνουμε τα scripts ,τα styles και τις εικόνες από το φάκελο public 
app.use(express.static('public'))
//Χρήση των views
app.engine('hbs',exphbs.engine({
    defaultLayout: 'layout',
    extname: 'hbs'
}));
//και ορίζουμε πως θα χρησιμοποιήσουμε τη μηχανή template με όνομα 'hbs'
app.set('view engine', 'hbs');


//Αρχική σελίδα της ιστοσελίδας μας το main-page.
app.route('/').get((req, res) => { res.redirect('/main-page') });

//Αρχική σελίδα απλού χρήστη.
app.get('/main-page',(req,res)=>{
    res.render('main-page',{
        style:'style-main-page.css',
        script:'main.js',
        layout:'layout-main-page'
    })
})

//Αρχική σελίδα διαχειριστή
app.get('/main-page-admin',(req,res)=>{
    res.render('main-page-admin',{
        style:'style-main-page-admin.css',
        script:'main.js',
        layout:'layout-main-page'
    })
})
//Λινκ από το οποίο παίρνουμε τις γενικές πληροφορίες της αρχικής σελίδας με βάση τον τίτλο
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
//Λινκ επεξεργασίας κειμένων αρχικής σελίδας 
app.put('/edit_text',(req,res)=>{
    const text = req.body;
    const date = getDateTime();
    let admin_id=res.locals.adminId
    model.editInfo(text,date,admin_id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})
//Λινκ από το οποίο παίρνουμε αεροπορική εταιρεία με βάση το όνομα
app.get('/airlines/:name',(req,res)=>{
    let name = req.params.name;
    model.getAirline(name,(err,data)=>{
        if(err){
            return console.error(err.message);
        }
        res.json(data);
    })
})

//Λινκ από το οποίο παίρνουμε τις αεροπορικές εταιρείες με βάση το γράμμα από το οποίο ξεκινάμε (User)
app.get('/companies/:letter',(req,res)=>{
    let letter=req.params.letter;
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
//Λινκ από το οποίο παίρνουμε τις αεροπορικές εταιρείες με βάση το γράμμα από το οποίο ξεκινάμε (Admin)
app.get('/companies-admin/:letter',(req,res)=>{
    let letter=req.params.letter;
    model.getAirlinebyletter(letter,(err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render('companies-admin',{
            style:'companies-admin.css',
            script:'companies-admin.js',
            layout:'layout',
            airlines:rows
        })
    })
})
//Λινκ από το οποίο παίρνουμε αεροπορική εταιρεία με βάση το κωδικό ΙΑΤΑ
app.get('/airline_name/:iata',(req,res)=>{
    let iata = req.params.iata;
    model.getAirlineName(iata,(err,data)=>{
        if(err){
            return console.error(err.message);
        }
        res.json(data);
    })
})
//Λινκ από το οποίο ενημερώνουμε τα στοιχεία μιας αεροπορικής εταιρείας 
app.put('/airlines_edit',(req,res)=>{
    const airline=req.body;
    const date = getDateTime();
    let id=res.locals.adminId
    model.editAirline(airline,date,id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
            res.redirect('/companies/A');
        }
    })
})
//Λινκ από το οποίο διαγράφουμε μια αεροπορική εταιρείας 
app.delete('/airlines_delete',(req,res)=>{
    const airline=req.body;
    const date = getDateTime();
    let id = res.locals.adminId;
    model.deleteAirline(airline,date,id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})
//Λινκ από το οποίο δημιουργούμε μια αεροπορική εταιρεία
app.post('/new_airline',(req,res)=>{
    const airline=req.body;
    const date = getDateTime();
    let id=res.locals.adminId;
    model.insertAirline(airline,date,id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.redirect('/main-page-admin');
        }
    })
});

//Λινκ από το οποίο παίρνουμε τη σημερινή ημερομηνία και τις επόμενες 3 ημερομηνίες
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
//Λινκ από το οποίο παίρνουμε τις πτήσεις όταν ο χρήστης συμπληρώσει τη φόρμα
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

//Λινκ από το οποίο παίρνουμε τα μαγαζια του αεροδρομίου
app.get(`/shops`,(req,res)=>{
    res.render('shops',{
        style:'shops.css',
        script:'shops.js',
        layout:'layout'
    })
})

//Λινκ από το οποίο παίρνουμε τις ανακοινώσεις
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
//Λινκ από το οποίο παίρνουμε τις ανακοινώσεις με βάση το id.
app.get('/announcements/id/:id',(req,res)=>{
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
//Λινκ από το οποίο παίρνουμε τις ανακοινώσεις με βάση τη προτεραιότητα που έχει δώσει ο χρήστης
app.get('/announcements/search',(req,res)=>{
    const priority = req.query.priority;
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

//Λινκ από το οποίο παίρνουμε τις ανακοινώσεις (Admin)
app.get('/announcements-admin',(req,res)=>{
    model.getAnnouncements((err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements-admin',{
                style:'announcements-admin.css',
                script:'announcements.js',
                layout:'layout',
                announcements:data
            })
        }
    })
})
//Λινκ από το οποίο παίρνουμε τις ανακοινώσεις με βάση τη προτεραιότητα που έχει δώσει ο χρήστης (Admin)
app.get('/announcements-admin/search',(req,res)=>{
    const priority = req.query.priority;
    model.getAnnouncementsByPriority(priority,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements-admin',{
                style:'announcements-admin.css',
                script:'announcements.js',
                layout:'layout',
                announcements:data
            })
        }
    })
})
//Λινκ από το οποίο παίρνουμε τις ανακοινώσεις με βάση το id. (Admin)
app.get('/announcements-admin/id/:id',(req,res)=>{
    model.getAnnouncementById(req.params.id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.render('announcements-admin',{
                style:'announcements-admin.css',
                script:'announcements.js',
                layout:'layout',
                announcements:data
            })
        }
    })
})
//Λινκ από το οποίο ο Admin δημιουργεί μια νέα ανακοίνωση 
app.post('/create_announcement',(req,res)=>{
    const text = req.body;
    const date = getDateTime();
    let id=res.locals.adminId;
    model.createAnnouncement(text,id,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
})

//Λινκ από το οποίο παίρνουμε τις αφίξεις
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
//Λινκ από το οποίο παίρνουμε τις αναχωρίσεις
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
//Λινκ από το οποίο κάνει ο χρήστης εγγραφή
app.post('/sign-up/done', function (req, res) {
    model.insertUser(req.body.username,req.body.password,req.body.fname,req.body.lname,req.body.age,req.body.gender,req.body.mail,req.body.number,req.body.country,false,(err,rows)=>{
    if(err){
        return console.error(err.message);
    }
    res.redirect('/main-page')
    });
})
//Λινκ από το οποίο ο χρήστης κάνει αποσύνδεση οπότε και σταματάει το session
app.get('/log-out',function(req,res){
    req.session.destroy();
    res.redirect('/');
})
//Λινκ από το οποίο ο χρήστης κάνει login και καθορίζεται αν ο χρήστης ειαι User ή Admin, ενώ αν τα στοιχεία που έβαλε είναι λάθος, εμφανίζεται μύνημα λάθους
app.post('/log-in/done', function (req, res) {
    model.getUserByUsername(req.body.username,(err,user)=>{     
        if(err){
            return console.error(err.message);
        }
        if (user == undefined) {
            res.render('main-page',{
                style:'style-main-page.css',
                script:'main.js',
                layout:'layout-main-page',
                message: 'Δε βρέθηκε αυτός ο χρήστης' });
        }else if(user.is_admin==true){
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (match) {
                    req.session.loggedUserId = [user.username, user.is_admin];
                    const redirectTo = req.session.originalUrl || "/main-page-admin";
                    res.redirect(redirectTo);
                }else {
                    res.render("main-page",{
                        style:'style-main-page.css',
                        script:'main.js',
                        layout:'layout-main-page',
                        message: 'Δε βρέθηκε αυτός ο χρήστης', message: 'Ο κωδικός πρόσβασης είναι λάθος' })
                }
            })
        }
        else {
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (match) {
                    req.session.loggedUserId = [user.username, user.is_admin];
                    const redirectTo = req.session.originalUrl || "/main-page";
                    res.redirect(redirectTo);
                }else {
                    res.render("main-page",{
                        style:'style-main-page.css',
                        script:'main.js',
                        layout:'layout-main-page',
                        message: 'Ο κωδικός πρόσβασης είναι λάθος' })
                }
            })
        }
    });
})



export { app as Airport};