const sqlite3 = require("sqlite3").verbose(); //retornar mensagens
const db = new sqlite3.Database("./src/database/database.db"); //cria o objeto q opera no db

module.exports = db;

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            name TEXT,
            address TEXT,
            address2 TEXT,
            state TEXT,
            city, TEXT,
            items TEXT
        );
    `) //crase pra poder fazer quebra de linha (template literals)

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

    const values = [];

    function afterInsertData(err){
        if(err){ //tratar o erro
            return console.log(err);
        }
        console.log("Sucess");
        console.log(this);
    }

    db.run(query, values, afterInsertData); //after() chama a função imediatamente, after chama como um "callback"

    db.all(`SELECT * FROM places`, function(err, rows){
        if(err){
            return console.log(err);
        }
        console.log("Seus registros");
        console.log(rows);   
    });

    // db.run(`DELETE FROM places WHERE id = ?`, [12], function(err){
    //     if(err){
    //         return console.log(err);
    //     }
    //     console.log("Registro deletado"); 
    // });
});
