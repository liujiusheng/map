/**
 * 主文件，加载图片
 */


import MapConfig from './config.js';
import vsShader from './vsShader.js';
import fsShader from './fsShader.js';
import vertices from './geo.js';
var mapcv = document.querySelector("#mapcv");


//用3d打开
var gl = mapcv.getContext("webgl");
render3d(gl);


//3d渲染
function render3d(gl){
    // 设置清除颜色为黑色，不透明
    gl.clearColor(0.05, 0.0, 0.0, 1.0);    
    // 开启“深度测试”, Z-缓存
    gl.enable(gl.DEPTH_TEST); 
    // 设置深度测试，近的物体遮挡远的物体
    gl.depthFunc(gl.LEQUAL); 
    // 清除颜色和深度缓存
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
    var shaderProgram = loadShader();
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
      };

    drawRect(programInfo,vertices);
}

var run = true;
//绘制矩形
function drawRect(programInfo,vertices){
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,fieldOfView,aspect,zNear,zFar);

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix,modelViewMatrix, [-0.0, 0.0, -10.0]); 

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    
    
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    //gl.drawArrays(gl.TRIANGLES, 0, 4);
    animate();

}


function animate() {
        requestAnimationFrame(animate);
        drawScene();
}
  

//var newVertices = []; 
var index = 0;//在每一段里面的索引
var split = 0;//源矩阵的分段起点
var currentVertices = [];
//生成点
function buildPoint(){
    if(split==undefined){
        return;
    }
    var splitlength = vertices/3;
    if(currentVertices.length==0){
        currentVertices = [vertices[split*3],vertices[split*3+1],vertices[split*3+2]];
    }
    var currentPoint = [vertices[split*3],vertices[split*3+1],vertices[split*3+2]];
    var nextPoint = [vertices[(split+1)*3],vertices[(split+1)*3+1],vertices[(split+1)*3+2]];
    var indexCount = Math.floor(Math.sqrt(Math.pow((nextPoint[0]-currentPoint[0]),2)+Math.pow((nextPoint[1]-currentPoint[1]),2))/0.01);

    //x平移
    if(nextPoint[0]>currentPoint[0]){
        var xoffset = 0.01;
    }else if(nextPoint[0]==currentPoint[0]){
        var xoffset = 0;
    }else{
        var xoffset = -0.01;
    }

    //y平移
    if(nextPoint[1]>currentPoint[1]){
        var yoffset = 0.01;
    }else if(nextPoint[1]==currentPoint[1]){
        var yoffset = 0;
    }else{
        var yoffset = -0.01;
    }

    //构造新的数组
    if(index<indexCount){
        var x = currentVertices[0]+xoffset;
        var y = currentVertices[1]+yoffset;
        currentVertices = [x,y,0.0];
        index += 1;
    }else{
        split += 1;
        index = 0;
        if(split>vertices.length/3-1){
            split = 0;
            currentVertices = [];
        }
    }
    return currentVertices;
}


function drawScene() {
    var newVertices = buildPoint();
    if(newVertices){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newVertices), gl.STATIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);
        gl.flush();
    }
}




//加载着色器
function loadShader(){
    var shaderProgram = gl.createProgram();

    var vsShaders = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsShaders,vsShader);
    gl.compileShader(vsShaders);
    gl.attachShader(shaderProgram,vsShaders);

    var fsShaders = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsShaders,fsShader);
    gl.compileShader(fsShaders);
    gl.attachShader(shaderProgram,fsShaders);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    return shaderProgram;
}





