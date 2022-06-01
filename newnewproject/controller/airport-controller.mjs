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

export async function getAirlinesByLetter(req,res){
    model.getAirlinebyletter(letter,(err,rows) => {
        if(err){
            return console.error(err.message);
        }
        res.render(rows);
    })
}

export async function editAirlineInfo(req,res){
    model.editAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
}

export async function deleteAirline(req,res){
    model.deleteAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
}
  
export async function AddAirline(req,res){
    model.insertAirline(airline,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
}

export async function getText(req,res){
    model.insertText(title,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
}

export async function editText(req,res){
    const text = req.body;
    model.editText(text,(err,data) =>{
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(data);
        }
    })
}




