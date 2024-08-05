require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password:'admin',
    database : 'db'
})
connection.connect(function(err){
    if (err) {
        console.error('error connected to mysql', err);
        return;
    }
    console.log('connected to mysql');
})
//products table
app.get("/products",function(req,res){
    connection.query(`SELECT * from products`,function(a,b){
        if(a){
            console.log(a)
        }
        else{
            res.json(b)
        }
    })
})
app.get("/",function(req,res){
    res.sendFile(__dirname+"/addProduct.html")
})
app.post("/addproduct",function(req,res){
    console.log(req.body)
     var newProduct = req.body
     var data = `INSERT INTO products (name, price) VALUES('${newProduct.u1}',${newProduct.u2})`;
     connection.query(data,function(a,b){
         if(a){
             console.log("error in inserting",a)
         }
         else{
             console.log("successfully inserted",b)
         }
    })
})
app.get("/products/:id",function(req,res){
    const productID = req.params.id
    var q = `DELETE FROM products WHERE id=${productID}`
    connection.query(q,function(a,b){
        if(a){
            console.log("Delete Failed")
        }
        else{
            console.log("Deleted...")
        }
    })
})
app.get("/editproduct/:id",function(req,res){
    console.log(req.params.id)
    var q = `SELECT * from products WHERE id=?`;
    connection.query(q,[req.params.id],function(err,data){
        if(err){
            console.log(err)
        }
        else{
            console.log(data)
            if(data.length>0){
                var pr1 = data[0]
                console.log(pr1)
                res.send(
                    `
                    <form action='/editproduct/${req.params.id}' method="POST">
                        <input type="text" name="u1" value="${pr1.name}"/><br><br>
                        <input type="text" name="u2" value="${pr1.price}"/><br><br>
                        <button type="submit">Edit</button><br><br>
                    </form>
                    `
                )
            }
        }
    })
})
app.post("/editproduct/:id",function(req,res){
    console.log(req.body)
    var data = `UPDATE products SET name=?,price=? WHERE id=?`;
    connection.query(data,[req.body.u1, req.body.u2, req.params.id],function(err,result){
        if(err){
            console.log(err)
        }
        else{
            res.send("successfully updated")
        }
    })
})
//users table
app.get("/users",function(req,res){
    connection.query(`SELECT * from users`,function(a,b){
        if(a){
            console.log(a)
        }
        else{
            console.log(b)
        }
    })

})
app.get("/uform",function(req,res){
    res.sendFile(__dirname+"/addUsers.html")
})
app.post("/adduser",function(req,res){
    console.log(req.body)
    var newUser = req.body
    var data = `INSERT INTO users (name, address) VALUES('${newUser.u1}','${newUser.u2}')`;
     connection.query(data,function(a,b){
         if(a){
             console.log("error in inserting",a)
         }
         else{
             console.log("successfully inserted",b)
         }
        })
})
app.get("/edituser/:id",function(req,res){
    var q = `SELECT * from users WHERE id=?`;
    connection.query(q,[req.params.id],function(err,data){
        if(err){
            console.log(err)
        }
        else{
           if(data.length>0){
              var inf= data[0]
              res.send(
                `
                <form action='/edituser/${req.params.id}' method='POST'>
                    <input type='text' name='u1' value='${inf.name}'/><br><br>
                    <input type='text' name='u2' value='${inf.address}'/><br><br>
                    <button type='submit'>EDIT USER</button><br><br>
                </form>
                `
            )
        }
    }
})
})
app.post("/edituser/:id",function(req,res){
    console.log(req.body)
        var data = `UPDATE users SET name=?,address=? WHERE id=?`;
        connection.query(data,[req.body.u1, req.body.u2, req.params.id],function(err,result){
            if(err){
                console.log(err)
            }
            else{
                res.send("updated successfully...")
            }
        })
})
app.get("/users/:id",function(req,res){
    console.log(req.params.id)
    var uID = req.params.id
    var q = `DELETE FROM users WHERE id=${uID}`
    connection.query(q,function(a,b){
        if(a){
            console.log(a)
        }
        else{
            res.send("Deleted..")
        }
    })
})
//create table
app.get("/table",function(req,res){
    var q = `CREATE table employees(id int auto_increment primary key,name varchar(20),designation varchar(10))`;
    connection.query(q,function(a,b){
        if(a){
            console.log(a)
        }
        else{
            console.log(b)
            res.send("Table created succesfully")
        }
    })
})
app.listen(process.env.PORT,function(){console.log(`server is running on port ${process.env.PORT}`)})
