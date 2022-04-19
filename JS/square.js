class Square{
	
	constructor(pos, size, color){
		this.pos = pos
		this.size = size;
		this.color = color;
	}
	
	checkHover(x, y){
		return x >= this.pos.x && x <= this.pos.x + this.size.x && y >= this.pos.y && y <= this.pos.y + this.size.y;
	}
	
	draw(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
}