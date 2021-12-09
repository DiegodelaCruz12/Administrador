const express=require('express');
const router=express.Router();
const pool =require('../database');
const helpers=require('../lib/helpers');
const moment = require('moment');
const nodemailer = require("nodemailer");
const { json } = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const secretKey = '9070N_C0_see?#';
const bcrypt = require('bcrypt');

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

  
router.get('/verifyToken',(req,res)=>{
    let token = req.query;
    console.log("ruta de verificacion");
    /*
    try {
        
        const resultadoT = jwt.decode( req.headers.token, secretKey);
        //console.log(JSON.parse(JSON.stringify(resultadoT)));
    
        console.log(resultadoT);
        res.status(200).json(resultadoT);
    } catch (Err) {
        console.log(Err);
    }
*/
if (!token) {
    res.status(401).json();
    console.log('El token es nulo');
    }

    //token = token.replace('Bearer ', '')

    jwt.verify(token, secretKey, function(err, token) {
    if (err) {
        console.log('Error: ');
        return res.status(401).json();
    } else {
        console.log('El nuevo token es: '+ token);
        //req.token = token
        //next()
        res.status(202).json(token)
    }
    });
});

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

//Profesor
router.get('/agregarprofesor',(req,res)=>{
    res.render('links/Profesor/agregarprofesor');
//Agregarprofesor
});
router.post('/agregarprofesor',async(req,res)=>{
    const valor=1;
    const{profename,passwordp,nombrep,apmp,appp,fechadenacimientop,emailp}=req.body;
    //Aqui se agregar la contraseña modificada
    const newUser={
        profename,
        passwordp,
        nombrep,
        apmp,
        appp,
        fechadenacimientop,
        emailp,
        valor
    };
    console.log(passwordp)
    pass=newUser.passwordp
    newUser.passwordp=await helpers.encryptPassword(passwordp);
    const rows=await pool.query('SELECT * FROM profesores WHERE profename=?',[profename]);
    
    try{
    if(rows[0].profename==profename){
        console.log("error1")  
     }
}catch(error){
    console.log("hola")
    
    await pool.query('INSERT INTO profesores SET ?',[newUser]);   
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
        to:newUser.emailp,
        subject:"NUEVA CUENTA CREADA",
        html:`<p>Tu usuario es ${newUser.profename}</p>
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


    valor1=1
    const usuarios=await pool.query('SELECT * FROM profesores WHERE valor=?',[valor1]);
    res.render('links/Profesor/gestionprofesor',{usuarios}); 
};
});
//gestion profesores


router.get('/gestionprofesor',async(req,res)=>{
    valor1=1
    const usuarios=await pool.query('SELECT * FROM profesores WHERE valor=?',[valor1]);
    res.render('links/Profesor/gestionprofesor',{usuarios}); 
});
//Metodo eliminar profesor
router.get('/eliminarprofesor/:id_profe',async(req,res)=>{
    const{id}=req.params;
    id_profe=req.params.id_profe
    console.log(id_profe)
    await pool.query('DELETE FROM profesores WHERE id_profe=?',[id_profe]);
    valor1=1
    const usuarios=await pool.query('SELECT * FROM profesores WHERE valor=?',[valor1]);
    res.render('links/Profesor/gestionprofesor',{usuarios}); 
})

//Metodo editar profesor
router.get('/editarprofesor/:id_profe',async(req,res)=>{
    id_profe=req.params.id_profe;
    const usuarios=await pool.query('SELECT * FROM profesores WHERE id_profe=?',[id_profe]);
    usuarios[0].fechadenacimientop=formatDate(usuarios[0].fechadenacimientop)
    res.render('links/Profesor/modificarprofesor',{usuarios});
});
router.post('/modificarprofesor/:id_profe',async(req,res)=>{
    valor=1
    const{id}=req.params;
    const{profename,passwordp,nombrep,apmp,appp,fechadenacimientop,emailp}=req.body;
    //Aqui se agregar la contraseña modificada
    const newUser={
        profename,
        passwordp,
        nombrep,
        apmp,
        appp,
        fechadenacimientop,
        emailp,
        valor
    };
    newUser.passwordp=await helpers.encryptPassword(passwordp);
    id_profe=req.params.id_profe;
    await pool.query('UPDATE profesores set ? WHERE id_profe=?',[newUser,id_profe])
    console.log(newUser.emailp)
    valor1=1
    const usuarios=await pool.query('SELECT * FROM profesores WHERE valor=?',[valor1]);
    res.render('links/Profesor/gestionprofesor',{usuarios});
})




//Usuario
// Metodo get agregarusuario

router.post('/signin', async(req, res)=>{

    const { usuario, contraseña } = req.body;
    const row = await pool.query(`SELECT * FROM usuarios WHERE usuario='${usuario}'`);

    console.log(row);
    if (row.length == 0) {

        const message = 'No existe el usuario';
        res.status(404).json(message);
        console.log(message);
    }else{
        let message  ='existe el usuario';
        let resultadoL = {message, row}
        console.log(message);
    
        let alumno = JSON.parse(JSON.stringify(row[0]));
        const passp = contraseña;
        console.log(row[0]);
        console.log('Estoy comparando para=> '+contraseña+' y ' + alumno.contraseña  );
        bcrypt.compare(passp , alumno.contraseña , function( error ,  resultado ){
        //console.log(JSON.parse(JSON.stringify(resultadoT)));

            if(resultado){
                let tokenReadyL = generateToken(row);
                console.log('Este es el token de login: ' + tokenReadyL);
                message  ='Se encontro al usuario exitosamente!';
                console.log('existe el usuario');
                const resultadoL = {message, row, tokenReadyL};
                res.status(200).json(resultadoL);

            }else{

                message  ='No existe el usuario';
                console.log('No existe el usuario');
                
                res.status(404).json(resultadoL);
            }
        });
        /*
            console.log('existe el usuario');
            res.status(200)
            */
    }

})

router.post('/signinp', async(req, res)=>{

    const { usernamep, passwordp } = req.body;
    const row = await pool.query(`SELECT * FROM profesores WHERE profename='${usernamep}'`);

    console.log(row);
    if (row.length == 0) {

        const message = 'No existe el profesor';
        res.status(404).json(message);
        console.log(message);
    }else{
        let message  ='existe el profesor';
        let resultadoL = {message, row}
        console.log(message);
    
        let profe = JSON.parse(JSON.stringify(row[0]));
        const passp = passwordp;
        console.log(row[0]);
        console.log('Estoy comparando para=> '+passwordp+' y ' + profe.passwordp  );
        bcrypt.compare(passp , profe.passwordp , function( error ,  resultado ){
        //console.log(JSON.parse(JSON.stringify(resultadoT)));

            if(resultado){
                let tokenReadyL = generateToken(row);
                console.log('Este es el token de login: ' + tokenReadyL);
                message  ='Se encontro al usuario exitosamente!';
                console.log('existe el usuario');
                const resultadoL = {message, row, tokenReadyL};
                res.status(200).json(resultadoL);

            }else{

                message  ='No existe el usuario';
                console.log('No existe el usuario');
                
                res.status(404).json(resultadoL);
            }
        });
        /*
            console.log('existe el usuario');
            res.status(200)
            */
    }

})

router.post('/signinA', async(req, res)=>{

    const { usernamea, passworda } = req.body;
    const row = await pool.query(`SELECT * FROM admin WHERE AdminN='${usernamea}'`);

    console.log(row);
    if (row.length == 0) {

        const message = 'No existe el admin';
        res.status(404).json(message);
        console.log(message);
    }else{
    
        let admin = row[0];
        const passp = passworda;
        console.log(row[0]);
        console.log('Estoy comparando para=> '+passworda+' y ' + admin.passwordA  );
        bcrypt.compare(passp , admin.passwordA , function( error ,  resultado ){
        //console.log(JSON.parse(JSON.stringify(resultadoT)));

            if(resultado){
                let tokenReadyL = generateToken(admin);
                console.log('Este es el token del admin ' + tokenReadyL);
                message  ='Se encontro al usuario exitosamente!';
                console.log('existe el usuario');
                const resultadoL = {message, admin, tokenReadyL};
                res.status(200).json(resultadoL);

            }else{

                message  ='No existe el usuario';
                console.log('No existe el usuario');
                
                res.status(404).json(resultadoL);
            }
        });
        /*
            console.log('existe el usuario');
            res.status(200)
            */
    }

})

router.get('/agregarusuario',(req,res)=>{
    res.render('links/Usuario/agregarusuario');

});
//Post agregarusuario
router.post('/agregarusuario',async(req,res)=>{

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
    const usuarios=await pool.query('SELECT * FROM usuarios WHERE valor=?',[valor2]);
    res.render('links/Usuario/gestionusuarios',{usuarios});
});


router.post('/agregarusuarioLog',async(req,res)=>{

    console.log('entro a la ruta log');
    const valor=2;
    console.log(valor)
    const{usuario,contraseña,name,apellidop,apellidom,fechaNac,email}=req.body;
    const nombre  = name;
    const app = apellidop;
    const apm = apellidom;
    const fechadenacimiento = fechaNac;
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
    console.log(name);
    const rows =await pool.query('SELECT * FROM usuarios WHERE usuario=?',[usuario]);
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
    const row = await pool.query('SELECT * FROM usuarios WHERE usuario=?',[usuario]);
    const Usu = row;

    console.log(row[0]);
    console.log('--------------');
    console.log(row[0].id_usuario);
    let tokenReady = generateToken(row[0]);
    console.log('token: '+ tokenReady);
    const respuesta = {tokenReady,Usu};
    res.status(202).json(respuesta);
});



//Metodo gestionusuario
router.get('/gestionusuarios',async(req,res)=>{
    valor2=2
    const usuarios=await pool.query('SELECT * FROM usuarios WHERE valor=?',[valor2]);
    res.render('links/Usuario/gestionusuarios',{usuarios});
});


//Metodo editar usuario con id
router.get('/editarusuario/:id_usuario',async(req,res)=>{
    id_usuario=req.params.id_usuario;
    const usuarios= await pool.query('SELECT * FROM usuarios WHERE id_usuario=?',[id_usuario]);
    usuarios[0].fechadenacimiento=formatDate(usuarios[0].fechadenacimiento)
    res.render('links/Usuario/modificarusuario',{usuarios});
    console.log(usuarios)    
});
//Metodo modificar usuario
router.post('/modificarusuario/:id_usuario',async(req,res)=>{
    valor=2
    const{id}=req.params;
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
    newUser.contraseña=await helpers.encryptPassword(contraseña);
    await pool.query('UPDATE usuarios set ? WHERE id_usuario=?',[newUser,id_usuario])

    valor2=2
    const usuarios=await pool.query('SELECT * FROM usuarios WHERE valor=?',[valor2]);
    res.render('links/Usuario/gestionusuarios',{usuarios});

})
//Metodo eliminar usuario por id
router.get('/eliminarusuario/:id_usuario',async(req,res)=>{
    const{id}=req.params;
    id_usuario=req.params.id_usuario
    console.log(id_usuario)
    await pool.query('DELETE FROM usuarios WHERE id_usuario=?',[id_usuario]);
    valor2=2
    const usuarios=await pool.query('SELECT * FROM usuarios WHERE valor=?',[valor2]);
    res.render('links/Usuario/gestionusuarios',{usuarios});
})
module.exports=router;