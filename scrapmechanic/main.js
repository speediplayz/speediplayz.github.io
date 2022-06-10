document.addEventListener("keydown", onKeyDownEvent);
document.addEventListener("keyup", onKeyUpEvent);
document.addEventListener("mousemove", onMouseMoveEvent);
document.addEventListener("mousedown", onMouseDownEvent);
document.addEventListener("mouseup", onMouseUpEvent);
window.onload = setup;

// Variables

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");

let imgCanvas = document.getElementById("img");
let imgCtx = imgCanvas.getContext("2d");

let recorder = new CanvasRecorder(canvas, 30);

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

const FPS = 60, FPS_INVERSE = 1000/FPS;
let lastFrame = new Date().getTime(), deltaTime = 0;
let startTime = new Date().getTime(), elapsedTime = startTime;

let keys = [];
let mouse = new V2();
let click = false;

let display = new Display(ctx, new V2(0, 0), new V2(WIDTH, HEIGHT), "rgb(255,128,0)", true, 4, "rgb(0,0,0)", []);

let el_empty = [
	new Text(ctx, new V2(12, 12), new V2(), "rgb(0,0,0)", false, 0, "", "Scrap Mechanic", "45px ui-monospace")
];

let el_cube = [
	new Text(ctx, new V2(12, 12), new V2(), "rgb(0,0,0)", false, 0, "", "Scrap Mechanic", "45px ui-monospace"),
	new Text(ctx, new V2(12, 80), new V2(), "rgb(0,0,0)", false, 0, "", "Length", ""),
	new Text(ctx, new V2(12, 112), new V2(), "rgb(0,0,0)", false, 0, "", "Width", ""),
	new Text(ctx, new V2(12, 144), new V2(), "rgb(0,0,0)", false, 0, "", "Height", ""),
	new Text(ctx, new V2(12, 176), new V2(), "rgb(0,0,0)", false, 0, "", "Color", ""),
	new TextBox(ctx, new V2(174,  80), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "8", "", new V2(5, 1), "rgb(0,0,0)", 4),
	new TextBox(ctx, new V2(174, 112), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "8", "", new V2(5, 1), "rgb(0,0,0)", 4),
	new TextBox(ctx, new V2(174, 144), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "8", "", new V2(5, 1), "rgb(0,0,0)", 4),
	new TextBox(ctx, new V2(174, 176), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "E0E0E0", "", new V2(5, 1), "rgb(0,0,0)", 6),
	new Button(ctx, new V2(12, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Generate", "", new V2(18, 2), "rgb(0,0,0)"),
	new Button(ctx, new V2(164, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Clear", "", new V2(40, 2), "rgb(0,0,0)")
];

let el_sphere = [
	new Text(ctx, new V2(12, 12), new V2(), "rgb(0,0,0)", false, 0, "", "Scrap Mechanic", "45px ui-monospace"),
	new Text(ctx, new V2(12, 80), new V2(), "rgb(0,0,0)", false, 0, "", "Radius", ""),
	new Text(ctx, new V2(12, 112), new V2(), "rgb(0,0,0)", false, 0, "", "Color", ""),
	new TextBox(ctx, new V2(174,  80), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "8", "", new V2(5, 1), "rgb(0,0,0)", 2),
	new TextBox(ctx, new V2(174, 112), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "E0E0E0", "", new V2(5, 1), "rgb(0,0,0)", 6),
	new Button(ctx, new V2(12, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Generate", "", new V2(18, 2), "rgb(0,0,0)"),
	new Button(ctx, new V2(164, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Clear", "", new V2(40, 2), "rgb(0,0,0)")
];

let el_cylinder = [
	new Text(ctx, new V2(12, 12), new V2(), "rgb(0,0,0)", false, 0, "", "Scrap Mechanic", "45px ui-monospace"),
	new Text(ctx, new V2(12, 80), new V2(), "rgb(0,0,0)", false, 0, "", "Radius", ""),
	new Text(ctx, new V2(12, 112), new V2(), "rgb(0,0,0)", false, 0, "", "Height", ""),
	new Text(ctx, new V2(12, 144), new V2(), "rgb(0,0,0)", false, 0, "", "Color", ""),
	new TextBox(ctx, new V2(174,  80), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "8", "", new V2(5, 1), "rgb(0,0,0)", 2),
	new TextBox(ctx, new V2(174, 112), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "16", "", new V2(5, 1), "rgb(0,0,0)", 2),
	new TextBox(ctx, new V2(174, 144), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "E0E0E0", "", new V2(5, 1), "rgb(0,0,0)", 6),
	new Button(ctx, new V2(12, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Generate", "", new V2(18, 2), "rgb(0,0,0)"),
	new Button(ctx, new V2(164, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Clear", "", new V2(40, 2), "rgb(0,0,0)")
];

let el_image = [
	new Text(ctx, new V2(12, 12), new V2(), "rgb(0,0,0)", false, 0, "", "Scrap Mechanic", "45px ui-monospace"),
	new Text(ctx, new V2(12, 80), new V2(), "rgb(0,0,0)", false, 0, "", "URL", ""),
	new TextBox(ctx, new V2(174,  80), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "", "", new V2(5, 1), "rgb(0,0,0)", 1024),
	new Button(ctx, new V2(12, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Generate", "", new V2(18, 2), "rgb(0,0,0)"),
	new Button(ctx, new V2(164, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Clear", "", new V2(40, 2), "rgb(0,0,0)")
];

let el_cone = [
	new Text(ctx, new V2(12, 12), new V2(), "rgb(0,0,0)", false, 0, "", "Scrap Mechanic", "45px ui-monospace"),
	new Text(ctx, new V2(12, 80), new V2(), "rgb(0,0,0)", false, 0, "", "Radius", ""),
	new Text(ctx, new V2(12, 112), new V2(), "rgb(0,0,0)", false, 0, "", "Height", ""),
	new Text(ctx, new V2(12, 144), new V2(), "rgb(0,0,0)", false, 0, "", "Color", ""),
	new TextBox(ctx, new V2(174,  80), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "8", "", new V2(5, 1), "rgb(0,0,0)", 2),
	new TextBox(ctx, new V2(174, 112), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "16", "", new V2(5, 1), "rgb(0,0,0)", 2),
	new TextBox(ctx, new V2(174, 144), new V2(128, 28), "rgb(255,255,255)", true, 2, "rgb(0,0,0)", "E0E0E0", "", new V2(5, 1), "rgb(0,0,0)", 6),
	new Button(ctx, new V2(12, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Generate", "", new V2(18, 2), "rgb(0,0,0)"),
	new Button(ctx, new V2(164, 238), new V2(144, 32), "rgb(128,128,128)", "rgb(96,96,96)", "rgb(64,64,64)", true, 2, "rgb(0,0,0)", "Clear", "", new V2(40, 2), "rgb(0,0,0)")
];

// Main Loop

function clr() { document.getElementById("output").innerHTML = ""; }
function disableAll() {
	el_empty.forEach(x => x.enabled = false);
	el_cube.forEach(x => x.enabled = false);
	el_sphere.forEach(x => x.enabled = false);
	el_cylinder.forEach(x => x.enabled = false);
	el_image.forEach(x => x.enabled = false);
	el_cone.forEach(x => x.enabled = false);
}
function enable(el){
	el.forEach(x => x.enabled = true);
}

function setup(){
	
	el_cube[9].onclick.push(generateCube);
	el_cube[10].onclick.push(clr);

	el_sphere[5].onclick.push(generateSphere);
	el_sphere[6].onclick.push(clr);

	el_cylinder[7].onclick.push(generateCylinder);
	el_cylinder[8].onclick.push(clr);

	el_image[3].onclick.push(generateImage);
	el_image[4].onclick.push(clr);

	el_cone[7].onclick.push(generateCone);
	el_cone[8].onclick.push(clr);

	start();
}

function start(){
	
	let currentTime = new Date().getTime();
	let diff = currentTime - lastFrame;
	
	if(diff >= FPS_INVERSE){
		deltaTime = diff
		
		update();
		
		lastFrame = new Date().getTime();
	}
	elapsedTime = new Date().getTime() - startTime;
	
	requestAnimationFrame(start);
}

function update(){
	let opt = document.getElementById("type").value;
	disableAll();
	switch(opt){
		case "Cube": { display.elements = el_cube; enable(el_cube); } break;
		case "Sphere": { display.elements = el_sphere; enable(el_sphere); } break;
		case "Cylinder": { display.elements = el_cylinder; enable(el_cylinder); } break;
		case "Cone": { display.elements = el_cone; enable(el_cone); } break;
		case "Image": { display.elements = el_image; enable(el_image); } break;
		default: { display.elements = el_empty; enable(el_empty); }
	}

	ctx.clearRect(0,0,WIDTH,HEIGHT);
	display.draw();
}

// Listeners

function onKeyDownEvent(e){
	keys[e.key.toLowerCase()] = true;
}
function onKeyUpEvent(e){
	keys[e.key.toLowerCase()] = false;
}
function onMouseMoveEvent(e){
	mouse = getCanvasPosition(e.pageX, e.pageY);
}
function onMouseDownEvent(e){
	click = true;
}
function onMouseUpEvent(e){
	click = false;
}