const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//const mysqlConection = require('../conection/conection');
const pool=require('../database');
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 10;

const secretKey = '9070N_C0_see?#';

/*
const express=require('express');
const router=express.Router();
const pool=require('../database');
const helpers=require('../lib/helpers');
const moment = require('moment');
const nodemailer = require("nodemailer");
*/

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

function generateToken(user) {

  var u = {
   username: user.username || user.profename || user.adminN,
   id: user.id || user.id_profe || user.id_admin
  }

  return token = jwt.sign(u, secretKey, {
     expiresIn: 60 * 60 * 6 // 12 horas?
      // 60 * 60 * 24 expires in 24 hours
  })
}


router.post('/agregarusuarioLog',async(req,res)=>{

    console.log('entro a la ruta log');
    const valor=2;
    console.log(valor)
    const{usuario,contraseña,nombre,apm,app,fechadenacimiento,email}=req.body;
    const newUser={
        usuario,
        contraseña,
        nombre,
        apm,
        app,
        fechadenacimiento,
        email,
        valor
    };
    
    pass=newUser.contraseña
    newUser.contraseña=await helpers.encryptPassword(contraseña);
    console.log(usuario)
    const rows=await pool.query('SELECT * FROM usuarios WHERE usuario=?',[usuario]);
    try{
        if(rows[0].usuario==usuario){
            console.log("error1")

            res.status(404)
            
        }else{
            
            }
    }catch(error){
        await pool.query('INSERT INTO usuarios SET ?',[newUser]);   
        var transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port: 465,
            secure:true,
            auth:{
                user:'virtualgadgets1@gmail.com',
                pass:'sfnhqrqsoqoxbhfy',
            }
            
        });
        var mailOptions={
            from:'"Virtualgadget" <virtualgadgets1@gmail.com>',
            to:newUser.email,
            subject:"NUEVA CUENTA CREADA",
            html:`<p>Tu usuario es ${newUser.usuario}</p>
            <p>Tu contraseña es es ${pass}</p>
            
            `
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }else{
                console.log("Email enviado")
            }
        })
        }
    valor2=2
    //const usuarios=await pool.query('SELECT * FROM usuarios WHERE valor=?',[valor2]);
    //res.render('links/Usuario/gestionusuarios',{usuarios});

    const Usu = req.body;
    const respuesta = {Usu}

});

router.get('/',(req,res)=>{

    mysqlConection.query('select * from usuarios',(err,rows, fiesds)=>{
        if(err){
            console.log(err);
        }else{
            
            res.status(200).json(rows);
        }
    } )
});

router.get('/verifyToken',(req,res)=>{

    console.log("ruta de verificacion");
    try {
        
        const resultadoT = jwt.decode( req.headers.token, secretKey);
        //console.log(JSON.parse(JSON.stringify(resultadoT)));
    
        console.log(resultadoT);
        res.status(200).json(resultadoT);
    } catch (Err) {
        console.log(Err);
    }

});




router.post('/signup',(req, res)=>{
    let { usuario, contraseña, name, apellidop, apellidom, fechaNac, valor } = req.body;

    contraseña = bcrypt.hashSync( contraseña , saltRounds);

    const Usu = req.body;
    mysqlConection.query(`insert into usuarios(usuario, contraseña, apm, app, fechadenacimiento, valor, nombre) values( '${usuario}'    ,'${contraseña}','${apellidom}','${apellidop}','${fechaNac}',${valor},'${name}' )`,
    (err,rows,fields)=>{

        if(!err){

            let tokenReady = generateToken(Usu);
            //console.log(tokenReady);
            const respuesta = { tokenReady, Usu }
            console.log(JSON.parse(JSON.stringify(Usu)));
            console.log("Se hizo el registro exitosamente");
            //console.log(Usu.usuario + ' y ', Usu.id_usuario);
            res.status(200).json(respuesta);
        }else{
            console.log(err);
        }

    })
}) 
/*
bcrypt . compare ( myPlaintextPassword ,  hash ,  function ( error ,  resultado )  { 
    // result == true 
} ) ; 
*/

router.post('/signin',(req, res)=>{
    const { usuario, contraseña } = req.body;
    mysqlConection.query(`SELECT * FROM usuarios WHERE usuario='${usuario}' `,//and password='${password}
    (err,rows,fields)=>{

        if(!err){
            let message  ='';
            console.log('-----------------------------');
            console.log(JSON.parse(JSON.stringify(rows[0])));
            console.log('-----------------------------');
            let resultadoL = {message, rows}
        
            let alumno = JSON.parse(JSON.stringify(rows[0]));

            //let alumno = Object.keys(rows)
            //console.log(Object.values(rows));

            const passp = contraseña;

            console.log('Estoy comparando para=> '+contraseña+' y ' + alumno.contraseña  );
            bcrypt.compare(passp , alumno.contraseña , function( error ,  resultado ){
            //console.log(JSON.parse(JSON.stringify(resultadoT)));
                
                if(resultado){
                    let tokenReadyL = generateToken(rows);
                    console.log('Este es el token de login: ' + tokenReadyL);
                    message  ='Se encontro al usuario exitosamente!';
                    console.log('existe el usuario');
                    const resultadoL = {message, rows, tokenReadyL}
                    res.status(200).json(resultadoL);

                }else{

                    message  ='No existe el usuario';
                    console.log('No existe el usuario');
                    
                    res.status(404).json(resultadoL);
                    console.log('EL ERROR: '+ err) 
                }
            });
            /*
            if(rows.length==0){
                
                message  ='No existe el usuario';
                console.log('No existe el usuario');
                
                res.status(404).json(resultadoL);
            }else{
                let tokenReadyL = generateToken(rows);
                console.log('Este es el token de login: ' + tokenReadyL);
                message  ='Se encontro al usuario exitosamente!';
                console.log('existe el usuario');
                const resultadoL = {message, rows, tokenReadyL}
                res.status(200).json(resultadoL);
                */
            }else{
                console.log(err);
                }
    })
}) 

router.post('/signinp',(req, res)=>{
    const { usernamep, passwordp } = req.body;
    mysqlConection.query(`SELECT * FROM profesores WHERE profename='${usernamep}' `,//and password='${password}
    (err,rows,fields)=>{

        if(!err){
            let message  ='';
            console.log('-----------------------------');
            console.log(JSON.parse(JSON.stringify(rows[0])));
            console.log('-----------------------------');
            let resultadoL = {message, rows}
        
            let profesor = JSON.parse(JSON.stringify(rows[0]));

            //let alumno = Object.keys(rows)
            //console.log(Object.values(rows));
            try{

                console.log('Estoy comparando para=> '+passwordp+' y ' + profesor.passwordp  );
                bcrypt.compare(passwordp, profesor.passwordp , function( error ,  resultado ){
                //console.log(JSON.parse(JSON.stringify(resultadoT)));
                    
                    if(resultado){
                        

                            let tokenReadyL = generateToken(rows);
                        console.log('Este es el token del profe : ' + tokenReadyL);
                        message  ='Se encontro al profe exitosamente!';
                        console.log('existe el profe');
                        const resultadoL = { rows, tokenReadyL}
                        res.status(200).json(resultadoL);
                        
                        
                        

                    }else{

                        message  ='No existe el profe';
                        console.log('No existe el profe');
                        
                        res.status(404).json(resultadoL);
                        console.log(err) 
                    }

                    
                })

            }catch(err){
                console.log(err);
            }
            /*
            if(rows.length==0){
                
                message  ='No existe el usuario';
                console.log('No existe el usuario');
                
                res.status(404).json(resultadoL);
            }else{
                let tokenReadyL = generateToken(rows);
                console.log('Este es el token de login: ' + tokenReadyL);
                message  ='Se encontro al usuario exitosamente!';
                console.log('existe el usuario');
                const resultadoL = {message, rows, tokenReadyL}
                res.status(200).json(resultadoL);
                */
            }else{
                console.log(err);
                }
    })
}) 



router.post('/signiA',(req, res)=>{
    const { adminN, passwordA } = req.body;
    mysqlConection.query(`SELECT * FROM admin WHERE adminN='${adminN}' `,//and password='${password}
    (err,rows,fields)=>{

        if(!err){
            let message  ='';
            console.log('-----------------------------');
            console.log(JSON.parse(JSON.stringify(rows[0])));
            console.log('-----------------------------');
            let resultadoL = {message, rows}
        
            let administrador = JSON.parse(JSON.stringify(rows[0]));

            //let alumno = Object.keys(rows)
            //console.log(Object.values(rows));

            console.log('Estoy comparando para=> '+passwordA+' y ' + administrador.passwordA  );
            bcrypt.compare(passwordA , administrador.passwordA , function( error ,  resultado ){
            //console.log(JSON.parse(JSON.stringify(resultadoT)));
                
                if(resultado){
                    let tokenReadyL = generateToken(rows);
                    console.log('Este es el token del admin: ' + tokenReadyL);
                    message  ='Se encontro al admin exitosamente!';
                    console.log('existe el admin');
                    const resultadoL = {message, rows, tokenReadyL}
                    res.status(200).json(resultadoL);

                }else{

                    message  ='No existe el admin';
                    console.log('No existe el admin');
                    
                    res.status(404).json(resultadoL);
                    console.log(err) 
                }
            });
            }else{
                console.log(err);
                }
    })
})

module.exports = router;