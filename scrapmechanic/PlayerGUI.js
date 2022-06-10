document.addEventListener("mousedown", mouseDownEvent);
document.addEventListener("mouseup"  ,   mouseUpEvent);
document.addEventListener("mousemove", mouseMoveEvent);
document.addEventListener("keydown"  ,  keyDownEvent);

// buttons
let buttons = [];
let hovered = [];
let pressed = [];

// sliders
let sliders = [];
let currentSlider;

// textboxes
let forbiddenKeys = ["Tab", "CapsLock", "Shift", "Control", "Alt"];
let textboxes = [];
let currentBox;

// displays
let displays = [];

class Rect{
	
	constructor(ctx, pos, size, color, border, borderWidth, borderColor){
		this.c = ctx;
		this.pos = pos;
		this.size = size;
		this.color = color;
		this.border = border;
		this.borderWidth = borderWidth;
		this.borderColor = borderColor;
	}
	
	checkHover(x, y){
		return x > this.pos.x && x < this.pos.x + this.size.x && y > this.pos.y && y < this.pos.y + this.size.y;
	}
	
	draw(){
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.borderColor;
		this.c.lineWidth = this.borderWidth;
		this.c.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		if(this.border) this.c.strokeRect(this.pos.x + this.borderWidth/2, this.pos.y + this.borderWidth/2, this.size.x - this.borderWidth, this.size.y - this.borderWidth);
	}
}

class Text extends Rect{
	
	constructor(ctx, pos, size, color, border, borderWidth, borderColor, value, font){
        super(ctx, pos, size, color, border, borderWidth, borderColor);
		this.value = value;
		this.font = font == "" ? "30px ui-monospace" : font;
		this.enabled = true;
	}
	
	draw(){
		if(!this.enabled) return;
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.borderColor;
		this.c.lineWidth = this.borderWidth;
		this.c.font = this.font;
		this.c.textBaseline = "top";
		this.c.fillText(this.value, this.pos.x, this.pos.y);
		if(this.border) this.c.strokeText(this.value, this.pos.x, this.pos.y);
	}
}

class Button extends Text{
	
	constructor(ctx, pos, size, defaultColor, hoverColor, pressColor, border, borderWidth, borderColor, value, font, offset, textColor){
        super(ctx, pos, size, defaultColor, border, borderWidth, borderColor, value, font);
        this.offset = offset;
        this.textColor = textColor;
		this.onclick = [];
		this.state = 0;
		this.enabled = true;
		
		this.defaultColor = defaultColor;
		this.hoverColor = hoverColor;
		this.pressColor = pressColor;
		buttons.push(this);
	}
	
	draw(){
		if(!this.enabled) return;
		let color = (this.state == 1 ? this.hoverColor : this.state == 2 ? this.pressColor : this.defaultColor);
        this.c.fillStyle = color;
		this.c.strokeStyle = this.borderColor;
		this.c.lineWidth = this.borderWidth;
		this.c.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		if(this.border) this.c.strokeRect(this.pos.x + this.borderWidth/2, this.pos.y + this.borderWidth/2, this.size.x - this.borderWidth, this.size.y - this.borderWidth);
        
        this.c.fillStyle = this.textColor;
		this.c.font = this.font;
		this.c.textBaseline = "top";
		this.c.fillText(this.value, this.pos.x + this.offset.x, this.pos.y + this.offset.y);
    }
}

class Slider extends Rect{
	
	constructor(ctx, pos, size, color, border, borderWidth, borderColor, fillColor, min, max){
        super(ctx, pos, size, color, border, borderWidth, borderColor);
		this.fillColor = fillColor;
		this.enabled = true;
		
		this.min = min;
		this.max = max;
		this.val = 0.5;
		
		sliders.push(this);
	}
	
	getValue(){
		return this.min + this.val * (this.max-this.min);
	}
	
	draw(){
		if(!this.enabled) return;
        this.c.fillStyle = this.color;
		this.c.strokeStyle = this.borderColor;
		this.c.lineWidth = this.borderWidth;
		this.c.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

        this.c.fillStyle = this.fillColor;
        this.c.fillRect(this.pos.x, this.pos.y, this.size.x * this.val, this.size.y);

        this.c.fillStyle = this.color;
		if(this.border) this.c.strokeRect(this.pos.x + this.borderWidth/2, this.pos.y + this.borderWidth/2, this.size.x - this.borderWidth, this.size.y - this.borderWidth);
	}
}

class Picture extends Rect{
	
	constructor(ctx, pos, size, color, border, borderWidth, borderColor, url){
        super(ctx, pos, size, color, border, borderWidth, borderColor);
		this.url = url;
		this.enabled = false;
		this.img = new Image(this.size.x, this.size.y);
		this.img.src = this.url;
		this.img.onload = async() => {
			this.enabled = true;
			this.draw();
		}
	}
	
	draw(){
		if(!this.enabled) return;
		if(this.img.src != ""){
			this.c.drawImage(this.img, this.pos.x, this.pos.y, this.size.x, this.size.y);
		}
	}
}

class TextBox extends Text{
	
	constructor(ctx, pos, size, color, border, borderWidth, borderColor, value, font, offset, textColor, length){
        super(ctx, pos, size, color, border, borderWidth, borderColor, value, font);
        this.textColor = textColor;
        this.offset = offset;
		this.length = length;
		this.enabled = true;
		
		textboxes.push(this);
	}
	
	draw(){
		if(!this.enabled) return;
        this.c.fillStyle = this.color;
		this.c.strokeStyle = this.borderColor;
		this.c.lineWidth = this.borderWidth;
		this.c.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		if(this.border) this.c.strokeRect(this.pos.x + this.borderWidth/2, this.pos.y + this.borderWidth/2, this.size.x - this.borderWidth, this.size.y - this.borderWidth);
        
        this.c.fillStyle = this.textColor;
		this.c.font = this.font;
		this.c.textBaseline = "top";
		this.c.fillText(this.value, this.pos.x + this.offset.x, this.pos.y + this.offset.y);
	}
}

class Display extends Rect{	
	constructor(ctx, pos, size, color, border, borderWidth, borderColor, elements){
        super(ctx, pos, size, color, border, borderWidth, borderColor);
		this.elements = elements;
		this.enabled = true;
		
		for(let i = 0; i < this.elements.length; i++){
			if(this.elements[i] != null && this.elements[i].pos != null) this.elements[i].pos.add(this.pos);
		}
		
		displays.push(this);
	}
	
	draw(){
		for(let i = 0; i < this.elements.length; i++){
			if(this.elements[i].enabled != null) this.elements[i].enabled = this.enabled;
		}
		if(!this.enabled) return;
		
        if(!this.enabled) return;
        this.c.fillStyle = this.color;
		this.c.strokeStyle = this.borderColor;
		this.c.lineWidth = this.borderWidth;
		this.c.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        this.c.fillStyle = this.color;
		if(this.border) this.c.strokeRect(this.pos.x + this.borderWidth/2, this.pos.y + this.borderWidth/2, this.size.x - this.borderWidth, this.size.y - this.borderWidth);

		for(let i = 0; i < this.elements.length; i++){
			if(this.elements[i].draw != null) this.elements[i].draw();
		}
	}
}

// this relies on there being a canvas object variable
function getCanvasPosition(pX, pY){
	if(typeof canvas == "undefined") return new Vector2(0, 0);
	let rect = canvas.getBoundingClientRect();
	return new Vector2(pX - rect.left, pY - rect.top);
}

function mouseDownEvent(e){
	let pos = getCanvasPosition(e.pageX, e.pageY);
	// buttons
	for(let i = 0; i < hovered.length; i++){
		if(!hovered[i].enabled) continue;
		let hover = hovered[i].checkHover(pos.x, pos.y);
		if(hover && !pressed.includes(hovered[i])){
			
			for(let j = 0; j < hovered[i].onclick.length; j++){
				hovered[i].onclick[j]();
			}
			
			hovered[i].state = 2;
			hovered[i].draw();
			pressed.push(hovered[i]);
		} else if(!hover){
			let j = pressed.indexOf(hovered[i]);
			pressed.splice(j, 1);
		}
	}
	// sliders
	for(let i = 0; i < sliders.length; i++){
		if(!sliders[i].enabled) continue;
		let hover = sliders[i].checkHover(pos.x, pos.y);
		if(hover){
			currentSlider = sliders[i];
			let val = (pos.x - sliders[i].pos.x) / sliders[i].size.x;
			sliders[i].val = val;
			sliders[i].draw();
			break;
		}
	}
	// textboxes
	for(let i = 0; i < textboxes.length; i++){
		if(textboxes[i].checkHover(pos.x, pos.y) && textboxes[i].enabled){
			currentBox = textboxes[i];
			break;
		}
	}
}

function mouseUpEvent(e){
	let pos = getCanvasPosition(e.pageX, e.pageY);
	// buttons
	for(let i = 0; i < pressed.length; i++){
		if(!pressed[i].enabled) continue;
		let hover = pressed[i].checkHover(pos.x, pos.y);
		
		if(hover){
			pressed[i].state = 1;
			pressed[i].draw();
			pressed.splice(i, 1);
		}
	}
	
	// sliders
	currentSlider = null;
}

function mouseMoveEvent(e){
	let pos = getCanvasPosition(e.pageX, e.pageY);
	// buttons
	for(let i = 0; i < buttons.length; i++){
		if(!buttons[i].enabled){
			if(hovered.includes(buttons[i])) { let j = hovered.indexOf(buttons[i]); hovered.splice(j, 1); }
			if(pressed.includes(buttons[i])) { let j = pressed.indexOf(buttons[i]); pressed.splice(j, 1); }
			buttons[i].state = 0;
			continue;
		}
		let hover = buttons[i].checkHover(pos.x, pos.y);
		
		if(hover && !hovered.includes(buttons[i])){
			hovered.push(buttons[i]);
			buttons[i].state = 1;
		} else if (!hover && hovered.includes(buttons[i])){
			let j = hovered.indexOf(buttons[i]);
			hovered.splice(j, 1);
			buttons[i].state = 0;
		}
        // causes flickering on displays
		// buttons[i].draw();
	}
	
	// sliders
	if(currentSlider != null){
		if(!currentSlider.checkHover(pos.x, pos.y) || !currentSlider.enabled){
			currentSlider = null;
		} else {
			let val = (pos.x - currentSlider.pos.x) / currentSlider.size.x;
			currentSlider.val = val;
			currentSlider.draw();
		}
	}
}

function keyDownEvent(e){
	// textboxes
	if(currentBox != null && currentBox.enabled){
		if(forbiddenKeys.includes(e.key) ) return;
		if(e.key == "Escape" || e.key == "Enter"){
			currentBox = null;
			return;
		}
		if(e.key == "Backspace"){
			if(currentBox.value.length == 0) return;
			let text = currentBox.value;
			text = text.substring(0, text.length - 1);
			currentBox.value = text;
			currentBox.draw();
			return;
		}
		if(e.key == "v" && e.ctrlKey){
			let clip = navigator.clipboard.readText();
			clip.then(x => {
				if(currentBox.value.length + x.length > currentBox.length) return;
				currentBox.value += x;
				currentBox.draw();
			});
			return;
		}
		if(currentBox.value.length >= currentBox.length) return;
		currentBox.value += e.key;
		currentBox.draw();
	}
}