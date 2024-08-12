const canvas=document.querySelector(".board");
toolbtns=document.querySelectorAll(".tool");
fillColor=document.querySelector("#fill-color");
sizeSlider=document.querySelector("#size-slider");
ColorBtns=document.querySelectorAll(".colors .option");
colorPicker=document.querySelector("#color-picker");
clearCanvas=document.querySelector(".clear-canvas");
saveImage=document.querySelector(".save-img");
undoBtn=document.querySelector(".undo");
redoBtn=document.querySelector(".redo");



ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let undoStack=[];
let redoStack=[];
let lastX;
let lastY;

//undo/redo
function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack
}
//////////////

let prevMouseX, prevMouseY,snapshot;
let isDrawing=false;
let selectedTool="brush";
let brushWidth=5;
let selectedColor="#000";

const setBackGround=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}

window.addEventListener("load",() =>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setBackGround();
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
    // isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
   
    ctx.beginPath();
    // ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

    ctx.lineWidth=brushWidth;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);

   
}


const drawing =(e) =>{
    if(!isDrawing){
        return;
    }
    saveState();
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="brush" || selectedTool==="eraser"){
        //if selected tool is eraser then set strokestyle to white
        //to paint white color to paint on existing canvas,else
        //set the stroke to seletced color
        ctx.strokeStyle=selectedTool==="eraser" ?'#fff':selectedColor
        // ctx.lineTo(e.offsetX, e.offsetY);
        // ctx.stroke();
        // [lastX, lastY] = [e.offsetX, e.offsetY];
    
           
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            // ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
      ;
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


sizeSlider.addEventListener("change",()=> brushWidth=sizeSlider.value); //passing slider value as brush size

ColorBtns.forEach(btn =>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
        console.log(btn.id);
    })
});

colorPicker.addEventListener("change" ,()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
});


clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);//clear canvas
    setBackGround();
});


saveImage.addEventListener("click",()=>{
    const a=document.createElement("a");
    a.download="file.jpeg";
    let url=canvas.toDataURL("image/jpeg;base64")
     a.href=url
     a.click();
     a.remove()
})


undoBtn.addEventListener("click",()=>{
    if (undoStack.length > 0) {
        redoStack.push(canvas.toDataURL());
        let previousState = undoStack.pop();
        let img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
})

redoBtn.addEventListener("click",()=>{
    if (redoStack.length > 0) {
        undoStack.push(canvas.toDataURL());
        let nextState = redoStack.pop();
        let img = new Image();
        img.src = nextState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
})


canvas.addEventListener("mousedown",Startdrawing);
canvas.addEventListener("mousemove",drawing);

canvas.addEventListener("mouseup",function(e){
    isDrawing=false;
})

