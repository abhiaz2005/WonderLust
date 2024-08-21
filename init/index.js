const mongoose =  require("mongoose") ;
const initData = require("./data.js") ;
const Listing =  require("../models/listing.js") ;

main().then(()=>{
    console.log("DB is connected");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://localhost:27017/wonderlust") ;
}

async function initDB(){
    await Listing.deleteMany({}) ;
    initData.data = initData.data.map((obj)=>({...obj,owner:'66af30040e9a4fea57f74321'})) ;
    await Listing.insertMany(initData.data) ;
    console.log("Data was initialized");
}

initDB() ;