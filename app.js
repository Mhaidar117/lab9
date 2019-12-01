const express = require("express");
const mysql = require("mysql");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

//routes
app.get("/", async function(req, res){
    
let categories = await getCategories();
let lastNames = await getAuthorNames();

console.log(lastNames);
console.log(categories);

res.render("index",{"categories": categories, "lastNames": lastNames}); //need one for authors
//res.render("index",{"lastNames": lastNames});
});//end root

app.get("/quotes", async function(req, res){
    
    // let keyword = req.query.keyword;
    // console.log(keyword);
    
    let rows = await getQuotes(req.query);
    
res.render("quotes",{"records":rows});

});//end quotes route


app.get("/authorInfo", async function(req, res){
    
    // let keyword = req.query.keyword;
    // console.log(keyword);
    
    
   let rows = await getAuthorInfo(req.query.authorId);
   
   res.send(rows);
   // res.render("Author",{"records":rows});

});//end quotes route

function getAuthorInfo(authorId){
    let conn = dbConnection();
    
      
    return new Promise(function(resolve, reject){
    
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
           
        
           let sql = `SELECT *
                        FROM q_author
                        WHERE authorId = ${authorId}`;
        console.log(sql);
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
            //   res.send(rows);
            conn.end();
            resolve(rows);
           });

         });//connect
         
    });//promise
    
}//get author info


function getQuotes(query){
            let categor = "*";
            let name = "*";
    
             let keyword = query.keyword;
            //  if(query.category != "Select one"){
            //  let categor = query.category;
            //  }
            //  if(query.lastName != "Select one"){
            //  let name = query.lastName;
            //  }

                let conn = dbConnection();
                
            return new Promise(function(resolve, reject){
            
                conn.connect(function(err) {
                   if (err) throw err;
                   console.log("Connected!");
                   
                   let params = [];
                
                   let sql = `SELECT *
                                FROM q_quotes
                                NATURAL JOIN q_author
                                WHERE 
                                quote like '%${keyword}%'`; //string literal ${<something>}
                                
                    if(query.category != "Select one"){
                        sql += " AND category = ?"; //to prevent sql injection use ? rather than quotes
                         params.push(query.category)
                     }
                    if(query.lastName != "Select one"){
                        sql += " AND lastName = ?";
                        params.push(query.lastName)
                    }
                    if(query.sex){
                        sql += " AND sex = ?";
                        params.push(query.sex)
                        
                    }
                    
                    console.log("name: ", query.lastName);
                    console.log("category: ", categor);
                    console.log("SQL:", sql);
                    console.log("sex: ", query.sex);
                    //params.push(query.category)
                   // params.push(query.lastName)
                    
                
                   conn.query(sql, params, function (err, rows, fields) {
                      if (err) throw err;
                    //   res.send(rows);
                    conn.end();
                    resolve(rows);
                   });
        
                 });//connect
                 
            });//promise
    
}//get quotes func.


function getAuthorNames(){
    
            
            let conn = dbConnection();
                
            return new Promise(function(resolve, reject){
            
                conn.connect(function(err) {
                   if (err) throw err;
                   console.log("Connected!");
                
                   let sql = `SELECT DISTINCT lastName
                                FROM q_author
                                ORDER BY lastName`;
                
                   conn.query(sql, function (err, rows, fields) {
                      if (err) throw err;
                    //   res.send(rows);
                    conn.end();
                    resolve(rows);
                   });
        
                 });//connect
                 
            });//promise
    
}//get categories func.

function getCategories(){
    
            

            let conn = dbConnection();
                
            return new Promise(function(resolve, reject){
            
                conn.connect(function(err) {
                   if (err) throw err;
                   console.log("Connected!");
                
                   let sql = `SELECT DISTINCT category
                                FROM q_quotes
                                ORDER BY category`;
                
                   conn.query(sql, function (err, rows, fields) {
                      if (err) throw err;
                    //   res.send(rows);
                    conn.end();
                    resolve(rows);
                   });
        
                 });//connect
                 
            });//promise
    
}//get categories func.

app.get("/dbTest", function(req, res){

        let conn = dbConnection();
        
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = "SELECT * FROM q_author WHERE sex = 'F'";
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              conn.end();
              res.send(rows);
           });

});

});//dbTest

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
console.log("Express server is running...");
});


//values in red must be updated
function dbConnection(){

       let conn = mysql.createConnection({  //anytime you connect to a database, always need these four pieces of info
                     host: "cst336db.space",
                     user: "cst336_dbUser13", //put my own username
              password: "lnyufj",             //my password
               database:"cst336_db13"         //number matches the username
           }); //createConnection
    
    
    return conn;

}



