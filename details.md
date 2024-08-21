# packages :
- mongoose
- express
- method-override
- ejs

# Making model
- make a Listing model  that have a basic information about the database that exports the data in the following manner 
```js
const listingSchema =  new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        required:true,
        default:"https://images.unsplash.com/photo-1719937206098-236a481a2b6d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

        set: (v) => v === "" ?  
        "https://images.unsplash.com/photo-1719937206098-236a481a2b6d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price:Number ,
    location:String,
    country:string,
}) ;

```

# make a init folder where we make clean to  out database & add sample datas into it
- Make a folder init then add a data file that holds sample data for it.
- Then by adding the data , it will make database clean & then add some fresh data into it.

# Make some routes for the server side Routes 
- Index route
- Read route 
- Create route 
- Delete route
- Update route


# Creating boilerplate
- In boilerplate code we add the maximize  the common thing we used in which is used almost
```js
//boilerplate.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WanderLust</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="/css/style.css" />

  </head>
  <body>
    <%- include("../includes/navbar.ejs") %>

    <div class="container"><%- body %></div>

    <%- include("../includes/footer.ejs") %>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossorigin="anonymous"
    ></script>
    <script src="/js/script.js"></script>
  </body>
</html>

```


# Styling Files  :
- Navbar
- Footer 
- Styling index.ejs
- Styling edit.ejs


# Passpost.js :
- General we use , this library for authentication & for hashing & salting .

- There are many types of authentication for using of Passport.js , we can use Google login , we can use Local password methods for storing in different Databases .
- so we use these three methods :
>npm i passport<br>
>npm i passport-local<br>
>npm i passport-local-mongoose

- We use passport-local for Local startegy.

# creating our **user** Model :
- In schema we don't write username & password , because it automatically adds the field ,
- If you want to add something more then you have to use other Schema types in the  SChema .
- passport-local-mongoose will add  a username , password , hash & a salt field in the schema or Collection. 
```js
const userSchema = new Schema({
    email:{
        type:String,
        required:true
    } ,
})

userSchema.plugin(PassportLocalMongoose) ;

module.exports = mongoose.model("User",userSchema) ;    
```

- ### Configuring startegy :
> **passport.initialize()**
  - It is used to initialize the passport .
> **passport.session()** :
  - A web application needs  the ability to identify the users as they browse from page to page. A series of requests & responses , each assosiated with the same user named as session .
> **passport.use(new LocalStartegy(User.authenticate))** 

- Generally we use use these things for passport .
```js
app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new LocalStartegy(User.authenticate)) ;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```
  - ### Create a fake user for testing :
  ```js
    app.get("/demo",async(req,res)=>{
      let fakeUser = new User({
          username:"Abhi",
          email:"Abhi@gmail.com"
      })
      let fakeUserRegistered = await User.register(fakeUser,"HelloWorld") ;
      res.send(fakeUserRegistered);
      
    })
  ```
  