const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema=mongoose.Schema({
  name:String
});

const Item=mongoose.model("Item",itemsSchema);

 const item1=new Item({
   name:"Hi!welcome to my todolist website"
 });
 const item2=new Item({
   name:"click the + button to add"
 });
 const item3=new Item({
   name:"click this to delete"
 });
const defaultItems=[item1,item2,item3];

app.get("/",function(req,res){
  let today=new Date();
  let options={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  let day=today.toLocaleString("en-US",options);
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }  else{
          console.log("suceessful");
        }
    });
    res.redirect("/");
  }else{
      res.render("list",{kindofDay:day,newListItem:foundItems});
    }
});
});


app.post("/",function(req,res){
const itemName=  req.body.NewItem;
const item=new Item({
  name:itemName
});
item.save();
res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedId=req.body.checkbox;
  Item.findByIdAndRemove(checkedId,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Sucessfully deleted");
        res.redirect("/");
    }

  });
});

app.listen(3000,function(){
  console.log("Server is connected");
});
