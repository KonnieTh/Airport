import express  from 'express'
const router = express.Router();

// import dotenv from 'dotenv'
// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config();
// }
let appController;
appController = await import(`../controller/airport-controller.mjs`);

router.route('/').get((req, res) => { res.redirect('/main-page') });


router.get('/announcements',(req,res)=>{
    res.render('announcements',{
        style:'announcements.css',
        script:'announcements.js'
    })
})

router.get('/announcements-admin',(req,res)=>{
    res.render('announcements-admin',{
        style:'announcements-admin.css',
        script:'announcements.js'
    })
})

router.get('/main-page',(req,res)=>{
    res.render('main-page',{
        style:'style-main-page.css',
        script:'main.js'
    })
})

router.get('/main-page-admin',(req,res)=>{
    res.render('main-page-admin',{
        style:'style-main-page-admin.css',
        script:'main-admin.js'
    })
})

router.get('/flights',(req,res)=>{
    res.render('flights',{
        style:'flights.css',
        script:'flights.js'
    })
})

router.get('/flights-admin',(req,res)=>{
    res.render('flights-admin',{
        style:'flights-admin.css',
        script:'flights.js'
    })
})

router.get('/shops',(req,res)=>{
    res.render('shops',{
        style:'shops.css',
        script:'shops.js'
    })
})

router.get('/companies-admin',(req,res)=>{
    res.render('companies-admin',{
        style:'companies-admin.css',
        script:'companies-admin.js'
    })
})

router.get('/companies',(req,res)=>{
    res.render('companies',{
        style:'companies.css',
        script:'companies.js'
    })
})


router.post('/anouncements-admin/create_announcement',appController.createAnnouncements);
router.get('/announcements-admin/get_announcements/start/:start/limit/:limit',appController.getAnnouncementsRender);
router.get('/announcements/get_announcements/start/:start/limit/:limit',appController.getAnnouncementsRender);

export default router;

