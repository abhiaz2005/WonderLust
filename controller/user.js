const User =  require("../models/user.js") ;

module.exports.signupFormRender = (req,res)=>{
    res.render("./user/signup.ejs");
};

module.exports.signupUser = async(req,res)=>{
    try{
        let {username,password,email} = req.body ;
        const newUser = new User({username,email}) ;
        let registeredUser = await User.register(newUser,password) ;    
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err) ;
            }
            req.flash("success","Welcome to WonderLust") ;
            res.redirect("/listings") ;
        })
    }catch(e){
        req.flash("error",e.message) ;
        res.redirect("/signup") ;
    }
} ;

module.exports.loginUserRenderer = (req, res) => {
    res.render("./user/login.ejs");
} ;

module.exports.loginUser = async (req,res)=>{
    req.flash("success","Welcome to WonderLust!!");
    let redirectUrl =  res.locals.redirectUrl || "/listings"  ;
    res.redirect(redirectUrl) ;
} ;

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err) ;
        }
        req.flash("success","You are Logged Out!!");
        res.redirect("/listings") ;
    });
} ;