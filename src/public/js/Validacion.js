const formulario=document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');
console.log("hola")

const expresiones={
    usuario: /[A-Za-z0-9\-_"][A-Za-z0-9\-_"]{4,16}$/,
    email:/^[a-zA-Z0-9\-._]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    contraseña: /[A-Za-z0-9\-_?"][A-Za-z0-9\-_"]{4,100}$/,
    apm: /[A-Za-z"][A-Za-z"]{4,20}$/,
    nombre: /[A-Za-z"][A-Za-z"]{4,16}$/,
      //texto:/^[a-zA-Z0-9\_\-]{4,16}$/
}



const campos = {
	usuario: false,
	password: false,
	nombre: false,
    email:false
}
const validarFormulario=(e)=>{
    id_pregunta=e.target.id
    
    switch (e.target.id){
        case "usuario":
            valor="usuario";
            
            Validar(expresiones.usuario , e.target , e.target.id , valor )

          break;
        case "password":
            valor="password";
            Validar(expresiones.contraseña,e.target,e.target.id,valor)
            
        break;
        case "nombre":
            valor="nombre";
            Validar(expresiones.nombre,e.target,e.target.id,valor)
        break;
        case "apellido_materno":
            valor="apellido_materno";
            Validar(expresiones.nombre,e.target,e.target.id,valor)
        break;
        case "apellido_paterno":
            valor="apellido_paterno";
            Validar(expresiones.nombre,e.target,e.target.id,valor)
        break;
        case "Email1":
            valor="email"
            console.log(expresiones.email,e.target,e.target.id,valor)
            Validar(expresiones.email,e.target,e.target.id,valor)
        break;
        
    }
} 

inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});
const Validar=(expresiones, input, campo, valor)=>{
    console.log(valor)
    if(expresiones.test(input.value)){
        div=document.getElementById(campo)
        console.log(campo)
        div.classList.add('correcto');
        try{div.classList.remove('incorrecto');}catch(a){}
        try{div.classList.remove("border-danger");}catch(a){}
        div.classList.add("border-success");
        campos[valor]=true
        console.log(campos)
        console.log(campos.usuario)

    }else{
        console.log(valor)
        div=document.getElementById(campo)
        try{div.classList.remove('correcto');}catch(a){}
        div.classList.add('incorrecto');
        try{div.classList.remove("border-success");}catch(a){}
        div.classList.add("border-danger");
        campos[campo]=false;
        console.log("Else")
        console.log(campos)
        console.log(campos.usuario)
      }
    }
inputs.forEach((input) => {
    
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});
function validateForm(){
    if(campos.usuario && campos.nombre && campos.apellido_materno && campos.apellido_paterno && campos.email){
        console.log("error")
        return true;
}else{
    return false
}
}