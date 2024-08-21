const Listing = require("../models/listing.js") ;
const {fetchWithTimeout} = require("../middleware.js");

module.exports.index = async (req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
  }

module.exports.formRender = (req, res) => {
    res.render("./listing/new.ejs");
  } ;

module.exports.showForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash(
      "error",
      "You're trying to find the listing no longer exists !"
    );
    res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
  try {
  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename} ;

  const addCoordinate = async (place) => {
    
        const response = await fetchWithTimeout(`https://photon.komoot.io/api/?q=${encodeURIComponent(place)}&limit=1`);
        const data = await response.json();
        newListing.geometry = {
          type: 'Point', 
          coordinates: data.features[0].geometry.coordinates
        };
      }
      
      await addCoordinate(req.body.listing.location); 
      
      
      await newListing.save();
      req.flash("success", "New Listing Created !!");
      res.redirect("/listings");
    } catch (error) {
        req.flash("error","Give proper map location");
        res.redirect("/listings/new") ;
    }
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash(
        "error",
        "You're trying to edit the listing no longer exists !"
      );
      res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url ;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250") ;

    res.render("./listing/edit.ejs", { listing ,originalImageUrl});
  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...listing });

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.image = {url, filename} ;
      await updatedListing.save() ;
    }

    req.flash("success", "Listing Edited !!");
    res.redirect(`/listings/`);
  } ;

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !!");
    res.redirect("/listings");
  } ;


