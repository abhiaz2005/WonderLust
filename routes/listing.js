const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const passport = require("passport");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const multer  = require('multer') ;
const {storage} = require("../cloudConfig.js") ;
const upload = multer({ storage }) ;

const ListingController = require("../controller/listings.js");

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(ListingController.createListing)
  );
//Create new route
router.get("/new", isLoggedIn, ListingController.formRender);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(ListingController.deleteListing));

//Show route
router.get("/:id", wrapAsync(ListingController.showForm));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.editListing));

module.exports = router;
