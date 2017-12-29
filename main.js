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
    //gl.drawArrays(gl.POINTS, 0, 1);
    animate();

}


function animate() {
    requestAnimationFrame(animate);
    drawScene();
}
  

//var newVertices = []; 
var index = 0;
//生成点
function buildPoint(){
    if(index<200){
        var currentVertices = [-1+0.01*index,-1+0.01*index,0.0];//console.log(newVertices);
        index += 1;
    }else{
        index = 0;
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





