if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
let db_url = process.env.ATLAS_URL ; 


const  express  = require("express") ;
const app = express() ;
const path = require("path") ;
const mongoose = require("mongoose") ;
const methodOverride =  require("method-override") ;
const ejsMate = require("ejs-mate") ;
const ExpressError = require("./utils/ExpressError.js") ;
const session =  require("express-session") ;
const MongoStore = require('connect-mongo');
const flash = require("connect-flash") ;
const passport =  require("passport") ;
const LocalStartegy = require("passport-local") ;
const User = require("./models/user.js") ;
const Listing = require("./models/listing.js") ;


const listingRouter =  require("./routes/listing.js") ;
const reviewRouter =  require("./routes/review.js") ;
const userRouter =  require("./routes/user.js") ;

const store = MongoStore.create({
    mongoUrl: db_url,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600 
});
store.on("error",()=>{
    console.log("error in  Mongo Session",err);
})

const sessionOptions  =  {
    store:store  ,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge:  7 * 24 * 60 * 60 * 1000 ,
        httpOnly:true
    }
} 



app.set("view engine","ejs") ;
app.set("views",path.join(__dirname,"views")) ;
app.use(express.static(path.join(__dirname,"public"))) ;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")) ;
app.engine("ejs",ejsMate);



main().then(()=>{
    console.log("DB is connected");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(db_url) ;
}
 


app.use(session(sessionOptions)) ;
app.use(flash()) ;


app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new LocalStartegy(User.authenticate())) ;


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success") ;
    res.locals.error = req.flash("error") ;
    res.locals.currUser = req.user ;
    next();
})

//Router
app.get("/",(req,res)=>{
    res.redirect("/listings") ;
})

//Search listings
app.get("/listings/search",async (req,res)=>{
    let searchedName = req.query.search ;
    let allListing = await Listing.find({country:searchedName})
    if(allListing.length){
        res.render("./listing/index.ejs", { allListing });
    }else{
        req.flash("success","No matched results found") ;
        res.redirect("/listings");
    }

    // console.log(allListing) ;
})

app.use("/listings",listingRouter) ;
app.use("/listings/:id/reviews",reviewRouter) ;
app.use("/",userRouter) ;



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found")) ;
})

app.use((err,req,res,next)=>{
    const {statusCode =  500  ,message = "Something went wrong" } = err ;
    res.status(statusCode).render("error.ejs",{message}) ;
})

app.listen(8080,()=>{
    console.log('APP is listening to the port 8080');
})