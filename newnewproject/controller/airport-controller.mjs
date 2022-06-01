// import dotenv from 'dotenv'
// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config();
// }

let model;
model = await import(`../model/heroku-pg/airport-queries.js`);

export function getAnnouncementsRender(req,res){
    model.getAnnouncements(params,(err,data)=>{
        if(err){
            res.send(err);
        }
        else{
            res.render('announcements-static',{announcements:data})
        }
    });
}

export function createAnnouncements(req,res){
    model.createAnnouncement(text,(err,data)=>{
        if(err){
            res.send(err);
        }
        else{
            res.render('announcements-static',{announcements:data})
        }
    });
}

