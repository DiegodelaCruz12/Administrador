const express=require('express');
const router=express.Router();
const pool=require('../database');
const helpers=require('../lib/helpers');
const moment = require('moment');
const nodemailer = require("nodemailer");


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


    res.redirect('/gestionprofesor') 
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
    res.redirect('/gestionprofesor') 
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
    res.redirect('/gestionprofesor') 
})
router.get('/gestiocuestionarios',async(req,res)=>{

})














//Usuario
// Metodo get agregarusuario
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
    res.redirect('/gestionusuarios')
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
    const usuarios=await pool.query('SELECT * FROM usuarios WHERE id_usuario=?',[id_usuario]);
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

    
    res.redirect('/gestionusuarios')

})
//Metodo eliminar usuario por id
router.get('/eliminarusuario/:id_usuario',async(req,res)=>{
    const{id}=req.params;
    id_usuario=req.params.id_usuario
    console.log(id_usuario)
    await pool.query('DELETE FROM usuarios WHERE id_usuario=?',[id_usuario]);
    
    res.redirect('/gestionusuarios')
})
module.exports=router;