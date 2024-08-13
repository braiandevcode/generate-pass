const d = document,
    $containerPassword = d.getElementById("pass"),
    $textLengthPass = d.getElementById("pass-length"),
    $rangeElement= d.getElementById("range"),
    $btnGenerate = d.getElementById("btn-generate"),
    allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/=!@#$%^&*()_[]{}|;:,.<>?~';


    const vectorChar = allowedCharacters.split("");
    
// variables globales
let min = 8;
let max = 20;
let pass = "";
let lengthPassword=16;

const generatePassword = (length)=> Math.floor(Math.random() * length);

// FUNCION QUE SE ENCARGA DE EVALUAR QUE METODO ESTAMOS USANDO DEL CLASSLIST
const evaluateMethodClassList = (el, method, nameClass)=>{
    switch(method){
        case "add":
            el.classList.add(nameClass);
            break;
        case "remove":
            el.classList.remove(nameClass);
            break;
        case "toggle":
            el.classList.toggle(nameClass);
        break;
        default:
            console.error("ese metodo no existe");
            break;
    }
}
// FUNCION QUE SE PUEDE UTILIZAR PARA AÑADIR,QUITAR O EVALUAR SI EXISTE  UNA CLASE
const updateAddOrRemoveOrToggleClass = (el, method, ...className)=>{
    if(el){
        if(method && className.length > 0){
            className.forEach(nameClass => evaluateMethodClassList(el, method, nameClass));
            return true;
        }
    }
    return false; 
};

// INICIALIZAR VALORES DE RANGO
const initializeRanges= ()=>{
    $rangeElement.max = max;
    $rangeElement.min = min;
    $rangeElement.value = lengthPassword;
    $textLengthPass.textContent= `Longitud de: ${$rangeElement.value}`;
};

// FUNCION PARA MOSTRAR LONGITUD EN LA INTERFAZ
const showLength = () => $textLengthPass.textContent= `Longitud de: ${lengthPassword}`;

// FUNCION QUE PREVIENE QUE SE MODIFIQUEN CAMBIOS EN LINEA EN EL RANGO
const evaluateValuesRange = (e)=>{
    lengthPassword = parseInt(e.target.value);
    if (lengthPassword > max || lengthPassword < min) {
        $range.setAttribute("disabled", "true");
        $range.max = max;
        $range.min = min;
        e.preventDefault();
    };
};

// EVALUAR A QUE ELEMENTO SE DEBE ORIGINAR EL EVENTO INPUT.
const evaluateHandleInput = (e)=>{
    if(e.target.id === "range"){
        evaluateValuesRange(e);
        showLength();
    };
}

// FUNCION PARA MANEJAR EL EVENTO INPUT
const handleInput = (e)=> evaluateHandleInput(e);

// FUNCION QUE CREA LOS ELEMENTOS
const createModalPassword = ()=>{
    $containerPassword.innerHTML="";
    const template = d.getElementById("template-pass").content;
    const clone = template.cloneNode(true);
    updateAddOrRemoveOrToggleClass(clone.querySelector("div"), "add", "modal-copy", "d-flex", "ai-center", "fd-column")
    updateAddOrRemoveOrToggleClass(clone.querySelector(".modal-copy__container-copy"), "add", "modal-copy", "d-flex", "ai-center", "fd-column", "jc-center")
    updateAddOrRemoveOrToggleClass(clone.querySelector("h3"),"add", "modal-copy__copy-pass", "d-flex", "ai-center", "jc-center");
    clone.querySelector("h3").setAttribute("title", "Copiar");
    updateAddOrRemoveOrToggleClass(clone.querySelector(".message-info"), "add", "d-flex", "ai-center", "jc-center")
    clone.querySelector(".message-info").textContent = "Click sobre contraseña para copiar.";
    clone.querySelector("h3").textContent = pass;
    clone.querySelector("button").textContent="Cancelar";

    $containerPassword.append(clone);
}
const renderModal = ()=> createModalPassword();

const setPasswordCharacter = ()=>{
    for (let i = 0; i < lengthPassword; i++) {
        const generate = generatePassword(allowedCharacters.length);
        pass+=allowedCharacters.charAt(generate);
    };
}

// FUNCION PARA COPIAR CONTRASEÑA EN EL PORTAPAPELES
const copyPassword=(texto)=> {
    navigator.clipboard.writeText(texto)
        .then(() => {
           alert("Contraseña copiada exitosamente!.")
        })
        .catch(err => {
            console.error('Error al copiar el texto: ', err);
        });
}

// FUNCION QUE SE SENCARGA DE EVALUAR DONDE SE ORIGINA EL EVENTO.
const evaluateHandleClick = (e)=>{
    e.preventDefault()
    if(e.target.id === "btn-generate"){
        updateAddOrRemoveOrToggleClass($containerPassword, "remove", "modal--hide");
        updateAddOrRemoveOrToggleClass($btnGenerate, "add", "btn-generate--hide");
        $btnGenerate.setAttribute("disabled", "true");
        setPasswordCharacter(e);
        renderModal();

        // setInterval(()=>{
        //     updateAddOrRemoveOrToggleClass(d.querySelector(".message-info"), "add", "message-info--hide");
        // },5000);
    };
    
    if (e.target.id === "btn-cancel" || e.target.matches(".modal-copy__copy-pass")) {
        updateAddOrRemoveOrToggleClass($containerPassword, "add", "modal--hide");
        updateAddOrRemoveOrToggleClass($btnGenerate, "remove", "btn-generate--hide");
        $btnGenerate.removeAttribute("disabled");
        if (e.target.matches(".modal-copy__copy-pass")) {
            copyPassword(pass);
        }
        pass = "";
    }
}
// FUNCION MANEJADORA PARA EVENTOS DE CLICK
const handleClick = (e)=> evaluateHandleClick(e);

const handleEvent = ()=>{
    // EVENTO DE CLICK
    d.addEventListener("click", handleClick);

    // EVENTO DE INPUT
    d.addEventListener("input", handleInput);
}


const initPage = ()=>{
    initializeRanges();
    handleEvent();
}

d.addEventListener("DOMContentLoaded",initPage)