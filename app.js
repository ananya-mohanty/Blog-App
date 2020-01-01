var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose =  require('mongoose');
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
// title 
// image
// body
// created

//app config
mongoose.connect('mongodb://localhost:27017/blog_app',  { useUnifiedTopology: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//MONGOOSE/MODEL Config
var blogSchema=new mongoose.Schema({
    title: String,
    image : String,
    body: String, 
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// Blog.create({
//     title: "Test Blog",
//     image : "https://pixabay.com/get/54e8d6454952ad14f6da8c7dda793f7f1636dfe2564c704c72287fd2944bc151_340.jpg",
//     body: "hello this is the body",

// });
app.get("/", function(req, res){

    res.redirect("/blogs");

});
//index1 ROUTE
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }

        else{
             
              res.render("index1", {blogs: blogs});
        }

   });
   
   
  
   //res.send("HELLPOOO");
});
//Restful routes
//NEW 
app.get("/blogs/new", function(req, res){

    res.render("new");
});
//CREATE BLOG
app.post("/blogs", function(req, res){
//create blog
//redirect
    req.body.blog.body= req.sanitize(req.body.blog.body);
        Blog.create(req.body.blog, function(err, newBlog){
                if(err)
                {
                    res.render("new");
                }
                else{
                    res.redirect("/blogs");
                }

        });

});

app.get("/blogs/:id", function(req, res){

  Blog.findById(req.params.id, function(err, foundBlog){

    if(err){
        res.redirect("/blog");
    }

    else{
        res.render("show", {blog: foundBlog});
    }

  });

});
//EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
   
    Blog.findById(req.params.id, function(err, foundBlog){

        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit", {blog: foundBlog});
        }
    });

});

//UPDATE

app.put("/blogs/:id", function(req, res){

    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){

        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
    // res.send("UPDATE");
});

//DeLETE

app.delete("/blogs/:id", function(req, res){
//Destroy Blog and redirect
    // res.send("DELETEEEE ROUTE");

    Blog.findByIdAndRemove(req.params.id, function(err){

        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT||3000, function(){
    console.log("The Blog Server has started");
});

