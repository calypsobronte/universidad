//Importar modulo server
const app = require('./config/server');

require('./app/routes/info')(app);

//El server escuchando el puerto
app.listen(app.get('port'), ()=>{
    console.log("Servidor en el puerto", app.get('port'));
})

