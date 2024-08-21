const {reviewSchema,listingSchema } =  require("./schema.js") ;
const ExpressError = require("./utils/ExpressError.js") ;
const Listing =  require("./models/listing.js") ;
const Review =  require("./models/review.js") ;

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in !!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}

module.exports.validateReview =  (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",") ;
        throw new ExpressError(400, errMsg) ;
    }else {
        next() ;
    }
}

module.exports.validateListing =  (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",") ;
        throw new ExpressError(400, errMsg) ;
    }else {
        next() ;
    }
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params ;
    let listing =  await Listing.findById(id) ;
    let currUser =  res.locals.currUser ;
    if(! listing.owner._id.equals(currUser._id)){
        req.flash("error","You are not the owner of the Listing");
        return res.redirect(`/listings/${id}`) ;
    }

    next() ;
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params ;
    let review =  await Review.findById(reviewId) ;
    let currUser =  res.locals.currUser ;
    if(! review.author._id.equals(currUser._id)){
        req.flash("error","You didn't create this review");
        return res.redirect(`/listings/${id}`) ;
    }

    next() ;
}

module.exports.fetchWithTimeout = (url, options, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error("Request timeout")), timeout);
      fetch(url, options).then(
        response => {
          clearTimeout(timeoutId);
          resolve(response);
        },
        err => {
          clearTimeout(timeoutId);
          reject(err);
        }
      );
    });
  };
  