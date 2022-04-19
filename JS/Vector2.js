class Vector2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	calculatePolar(){
		this.length = Math.sqrt((this.x*this.x)+(this.y*this.y));
		this.theta = Math.atan2(this.y, this.x);
	}
	
	calculateCartesian(){
		this.x = this.length * Math.cos(this.theta);
		this.y = this.length * Math.sin(this.theta);
	}
	
	setCartesian(x, y){
		this.x = x;
		this.y = y;
		this.calculatePolar();
	}
	
	setPolar(length, theta){
		this.length = length;
		this.theta = theta;
		this.calculateCartesian();
	}
	
	rotate(theta){
		this.theta += theta;
		this.calculateCartesian();
	}
	
	extend(length){
		this.length += length;
		this.calculateCartesian();
	}
	
	clone(){
		return new Vector2(this.x, this.y);
	}
	
	distance(to){
		return Math.sqrt((to.x-this.x)*(to.x-this.x)+(to.y-this.y)*(to.y-this.y));
	}
	
	multiply(scale){
		this.length *= scale;
		this.calculateCartesian();
	}
	
	divide(scale){
		this.length /= scale;
		this.calculateCartesian();
	}
	
	add(v){
		this.x += v.x;
		this.y += v.y;
		this.calculatePolar();
	}
	
	subtract(v){
		this.x += v.x;
		this.y += v.y;
		this.calculatePolar();
	}
	
	normalize(){
		this.length = 1;
		this.calculateCartesian();
	}
	
	equals(v) {
		return this.x == v.x && this.y == v.y;
	}
	
	//statics
	
	static normalized(v) { return Vector2.fromPolar(1, v.theta); }
	static fromPolar(length, theta) { return new Vector2(length * Math.cos(theta), length * Math.sin(theta)); }
	static add(v1, v2) { return new Vector2(v1.x + v2.x, v1.y + v2.y); }
	static subtract(v1, v2) { return new Vector2(v1.x-v2.x, v1.y-v2.y); }
	static multiply(v, scale) { return new Vector2(v.x * scale, v.y * scale); }
	static divide(v, scale) { return new Vector2(v.x / scale, v.y / scale); }
	static dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y; }
	static distance(v1, v2) { return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x)+(v1.y-v2.y)*(v1.y-v2.y)); }
	static angleToRadian(a) { return a * Math.pi / 180; }
	static radianToAngle(a) { return a * 180 / Math.pi; }
}