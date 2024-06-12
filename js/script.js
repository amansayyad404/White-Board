const canvas=document.querySelector(".board");
toolbtns=document.querySelectorAll(".tool");
fillColor=document.querySelector("#fill-color");



ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;


let prevMouseX, prevMouseY,snapshot,
 isDrawing=false;
selectedTool="brush";
brushWidth=5;
window.addEventListener("load",() =>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
})

const DrawRect=(e)=>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
    }
     ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
}

const DrawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((prevMouseX -e.offsetX),2)+ Math.pow((prevMouseY -e.offsetY),2) );
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const DrawTriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevMouseX *2-e.offsetX,e.offsetY);
    ctx.closePath();
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const Startdrawing= (e)=>{
    isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath();
    ctx.lineWidth=brushWidth;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}


const drawing =(e) =>{
    if(!isDrawing){
        return;
    }
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="brush"){
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if(selectedTool==="rectangle"){
        DrawRect(e);
    }
    else if(selectedTool==="circle"){
        DrawCircle(e);
    }
    else{
        DrawTriangle(e);
    }
    
}

toolbtns.forEach(btn => {
    btn.addEventListener("click",() =>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    })
});


canvas.addEventListener("mousedown",Startdrawing);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",function(e){
    isDrawing=false;
})