const express = require("express");
const server = express();

const db = require("./database/db"); //pega o db

//configurar pasta publica
server.use(express.static("public"));

//habilitar o uso do req.body
server.use(express.urlencoded({extended: true}));

//template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


//configurar caminhos da app
server.get("/", (req, res) => {
    return res.render("index.html");
});

server.get("/create-point", (req, res) => {
    req.query; //query string da url
    return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
    req.body; //corpo do formulario
    //inserir dados no db
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ];

    function afterInsertData(err){
        if(err){
            console.log(err);
            return res.send("Erro no cadastro!");
        }
        console.log("Sucess");
        console.log(this);
        return res.render("create-point.html", {saved: true});
    }

    db.run(query, values, afterInsertData);
});

server.get("/search-results", (req, res) => {
    const search = req.query.search;
    if(search == ""){
        return res.render("search-results.html", {total: 0}); //mostrar os dados do db na pagina html

    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err);
        }
        const total = rows.length;
        return res.render("search-results.html", {places: rows, total: total}); //mostrar os dados do db na pagina html
    });
});

//ligar o servidor
server.listen(3000);