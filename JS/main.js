document.onmousemove = moveEvent;

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");

let imgCanvas = document.getElementById("img");
let imgCtx = imgCanvas.getContext("2d");

let img = new Image();
img.crossOrigin = "Anonymous";
img.src = "https://steamuserimages-a.akamaihd.net/ugc/98349535606942829/A061B4B921243C2CF7608D1C53BAD46530C0605E/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false";

img.onload = function(){
	imgCtx.drawImage(img, 0, 0);
}

let squares = [new Square(new Vector2(19, 19), new Vector2(512, 512), "rgb(128,128,128)")];
squares[0].draw();

function moveEvent(e){
	let p = getMousePos(e);
	let x = p.x;
	let y = p.y;
	for(let i = 0; i < squares.length; i++){
		let hover = squares[i].checkHover(x, y);
		if(hover){
			squares[i].draw();
			let size = squares[i].size.x/2;
			if(size <= 2) return;
			
			let pos = squares[i].pos;
			squares.splice(i, 1);
			i--;
			
			let tl = new Square(Vector2.add(pos, new Vector2(0   , 0   )), new Vector2(size, size), randColor());
			let tr = new Square(Vector2.add(pos, new Vector2(size, 0   )), new Vector2(size, size), randColor());
			let bl = new Square(Vector2.add(pos, new Vector2(0   , size)), new Vector2(size, size), randColor());
			let br = new Square(Vector2.add(pos, new Vector2(size, size)), new Vector2(size, size), randColor());
			
			tl.color = getColor(tl);
			tr.color = getColor(tr);
			bl.color = getColor(bl);
			br.color = getColor(br);
			
			squares.push(tl);
			squares.push(tr);
			squares.push(bl);
			squares.push(br);
			
			return;
		}
	}
}

function getMousePos(e){
	let rect = canvas.getBoundingClientRect();
	return new Vector2(e.clientX - rect.left, e.clientY - rect.top);
}

function getColor(s){
	let pos = Vector2.subtract(s.pos, new Vector2(19, 19));
	let size = s.size;
	
	let imgData = imgCtx.getImageData(pos.x, pos.y, size.x, size.y);
	
	let r = 0, g = 0, b = 0;
	let n = 0;
	
	for(let i = 0; i < imgData.data.length; i += 4){
		r += imgData.data[i+0];
		g += imgData.data[i+1];
		b += imgData.data[i+2];
		n += 255;
	}
	
	let rA = Math.floor((r/n)*255);
	let gA = Math.floor((g/n)*255);
	let bA = Math.floor((b/n)*255);
	
	return `rgb(${rA},${gA},${bA})`;
}

function randColor(){
	let r = Math.floor(Math.random() * 256);
	let g = Math.floor(Math.random() * 256);
	let b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`;
}