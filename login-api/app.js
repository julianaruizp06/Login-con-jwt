const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());


// token generado
const TOKEN_KEY = "x4TvnErxRETbVcqaLl5dqMI115eNlp5y";

//fucion que verfica el token 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);
    if(token==null)
        return res.status(401).send("Token requerido");
    jwt.verify(token, TOKEN_KEY, (err, user)=>{
        if(err) return res.status(403).send("Token invalido");
        console.log(user);
        req.user = user;
        next();
    });
}


//peticion post en la que ingresamos los datos del login y si 

app.post("/usuario/login", (req, res)=>{
    const usuario = req.body.usuario;
    const clave = req.body.clave;
    if(usuario=='ejruizp' && clave=='123'){
        const datos = {
            id: "123",
            nombre: "Juliana Ruiz",
            email: "ejruizp06@mail.com",
            codigo: "ABDE456-LK"
        };
        const token = jwt.sign(
            {userId:datos.id, email:datos.email},
            TOKEN_KEY,
            {expiresIn: "2h"}
        );
        let nDatos = {...datos, token};
        res.status(200).json(nDatos);
    }else{
        res.status(400).send("Crendenciales incorrectas");
    }
});

//podemos hacer una peticion get si el token ha sido verificado

app.get("/usuario/:id/ventas", verifyToken, (req, res)=>{
    const datos = [
        {id:1,cliente:"Empresa A",total:2500,fecha:"2022-01-15"},
        {id:2,cliente:"Empresa B",total:2100,fecha:"2022-01-18"},
        {id:3,cliente:"Empresa c",total:200,fecha:"2022-01-23"},
    ];
    res.json(datos);
});

app.listen(3001, ()=>{
    console.log("Servidor iniciado en el puerto 3001");
});