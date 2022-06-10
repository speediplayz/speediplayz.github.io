function getBlueprintStart(){ return "{\"bodies\":[{\"childs\":["; }
function getBlueprintEnd(){ return "]}],\"version\":4}"; }
function getBlock(x, y, z, l, w, h, c){ return `{"bounds":{"x":${l},"y":${w},"z":${h}},"color":"${c}","pos":{"x":${x},"y":${y},"z":${z}},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3}`; }

function generateCube(){
    let shape = getBlueprintStart();
    shape += getBlock(0, 0, 0, el_cube[5].value, el_cube[6].value, el_cube[7].value, el_cube[8].value);
    shape += getBlueprintEnd();
    document.getElementById("output").innerHTML += ("copied to clipboard" + "<br><br>");
    navigator.clipboard.writeText(shape);
}

function generateSphere(){
    let r = Math.ceil(el_sphere[3].value);
    let shape = getBlueprintStart();
    for(let i = -r; i < r; i++){
        for(let j = -r; j < r; j++){
            for(let k = -r; k < r; k++){
                let dist = Math.sqrt(i*i+j*j+k*k);
                if(dist < r && dist > r-2) shape += getBlock(i, j, k, 1, 1, 1, el_sphere[4].value) + ",";
            }
        }
    }
    shape = shape.slice(0, -1);
    shape += getBlueprintEnd();
    document.getElementById("output").innerHTML += ("copied to clipboard" + "<br><br>");
    navigator.clipboard.writeText(shape);
}

function generateCylinder(){
    let r = Math.ceil(el_cylinder[4].value);
    let h = Math.ceil(el_cylinder[5].value);
    let shape = getBlueprintStart();
    for(let i = -r; i < r; i++){
        for(let j = -r; j < r; j++){
            let dist = Math.sqrt(i*i+j*j);
            if(dist < r && dist > r-2) shape += getBlock(i, j, 0, 1, 1, h, el_cylinder[6].value) + ",";
        }
    }
    shape = shape.slice(0, -1);
    shape += getBlueprintEnd();
    document.getElementById("output").innerHTML += ("copied to clipboard" + "<br><br>");
    navigator.clipboard.writeText(shape);
}

function generateCone(){
    let r = Math.ceil(el_cone[4].value);
    let h = Math.ceil(el_cone[5].value);
    let shape = getBlueprintStart();

    for(let z = 0; z < h; z++){
        let currentRad =  r * (h-z) / h;
        for(let x = -r; x < r; x++){
            for(let y = -r; y < r; y++){
                let dist = Math.sqrt(x*x+y*y);
                if(dist < currentRad && dist > currentRad-2) shape += getBlock(x, y, z, 1, 1, 1, el_cone[6].value) + ",";
            }
        }           
    }

    shape = shape.slice(0, -1);
    shape += getBlueprintEnd();
    document.getElementById("output").innerHTML += ("copied to clipboard" + "<br><br>");
    navigator.clipboard.writeText(shape);
}

function generateImage(){
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = el_image[2].value;

    img.onload = function(){
        let w = img.width;
        let h = img.height;
        let shape = getBlueprintStart();

        imgCanvas.width = w;
        imgCanvas.height = h;

        imgCtx.drawImage(img, 0, 0);

        let data = imgCtx.getImageData(0, 0, w, h).data;

        for(let y = 0; y < h; y++){
            for(let x = 0; x < w; x++){
                let i = (y * h + x) * 4;
                let r = data[i], g = data[i+1], b = data[i+2];
                shape += getBlock(x, 0, -y, 1, 1, 1, getHex(r, g, b)) + ",";
            }
        }

        shape = shape.slice(0, -1);
        shape += getBlueprintEnd();
        document.getElementById("output").innerHTML += ("copied to clipboard" + "<br><br>");
        navigator.clipboard.writeText(shape);
    }
}

function getHex(r, g, b){
    let r0 = Math.floor(r/16);
    let r1 = r - r0 * 16;

    let g0 = Math.floor(g/16);
    let g1 = g - g0 * 16;

    let b0 = Math.floor(b/16);
    let b1 = b - b0 * 16;

    return conv(r0) + "" + conv(r1) + "" + conv(g0) + "" + conv(g1) + "" + conv(b0) + "" + conv(b1);
}

function conv(n){
    if(n < 10) return n.toString();
    switch(n){
        case 10: return "A";
        case 11: return "B";
        case 12: return "C";
        case 13: return "D";
        case 14: return "E";
        case 15: return "F";
    }
    return "0";
}