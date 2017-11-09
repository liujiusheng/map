// /**
//  * 主文件，加载图片
//  */
// //http://222.178.118.101:6082/arcgis/rest/services/IMG_MCT/MapServer
import MapConfig from './config.js';
var mapcv = document.getElementById("mapcv");
var myctx = mapcv.getContext("2d");
var TitlesArry=[];
var mouseXY = {x:0,y:0};
var mouseDown = false;
mapcv.addEventListener('mousewheel',scroll,false);
mapcv.addEventListener('mousedown',mousedown,false);
mapcv.addEventListener('mouseup',mouseup,false);
mapcv.addEventListener('mousemove',mousemove,false)
function scroll(e){
    e.preventDefault();
    //console.log(e.wheelDelta);
    if(e.wheelDelta>0){
        //向上滚，放大
        MapConfig.level++;
    }else{
        MapConfig.level--;
    }
    myctx.clearRect(0, 0, 5000, 2000);//每次都把画布清理一下才不会造成内存增长
    caculate(MapConfig.level);
}

function mousedown(e){
    mouseDown = true;
    mouseXY = {x:e.x,y:e.y};
}

function mouseup(e){
    if(mouseDown){
        //这个地方处理还有问题，10000只是瞎猜的
        var meter = MapConfig.Resolution[MapConfig.level];
        MapConfig.center.x += (e.x-mouseXY.x)*meter;
        MapConfig.center.y -= (e.y-mouseXY.y)*meter;
        caculate(MapConfig.level);
    }
    mouseDown = false;
}

function mousemove(e){
    if(mouseDown){
        //console.log(e.x,e.y);
    }
}

window.onload = function(){
    //设置将要现实的地图中心点
    MapConfig.center=lonlatTomercator(MapConfig.center);
    caculate(MapConfig.level);
}


//根据级别计算行列号
function caculate(level){
    //当前窗口显示的范围
    var minX=MapConfig.center.x-(MapConfig.Resolution[level]*MapConfig.ViewWidth/2);
    var maxX=MapConfig.center.x+(MapConfig.Resolution[level]*MapConfig.ViewWidth/2);
    var minY=MapConfig.center.y-(MapConfig.Resolution[level]*MapConfig.ViewHeight/2);
    var maxY=MapConfig.center.y+(MapConfig.Resolution[level]*MapConfig.ViewHeight/2);
    //左上角开始的行列号
    var leftTopTitleRow = Math.floor(Math.abs(maxY-MapConfig.FullExtent.ymax)/MapConfig.Resolution[level]/MapConfig.TitlePix);
    var leftTopTitleCol = Math.floor(Math.abs(minX-MapConfig.FullExtent.xmin)/MapConfig.Resolution[level]/MapConfig.TitlePix);
    console.log(leftTopTitleCol,leftTopTitleRow);
    //实际地理范围
    var realMinX = MapConfig.FullExtent.xmin+leftTopTitleCol*MapConfig.TitlePix*MapConfig.Resolution[level];
    var realMaxY = MapConfig.FullExtent.ymax-leftTopTitleRow*MapConfig.TitlePix*MapConfig.Resolution[level];

    //计算左上角偏移像素
    var offSetX = (realMinX-minX)/MapConfig.Resolution[level];
    var offSetY = (maxY-realMaxY)/MapConfig.Resolution[level];
    //计算瓦片个数
    var xClipNum = Math.ceil((MapConfig.ViewHeight+Math.abs(offSetY))/MapConfig.TitlePix);
    var yClipNum = Math.ceil((MapConfig.ViewWidth+Math.abs(offSetX))/MapConfig.TitlePix);
    //右下角行列号
    var rightBottomTitleRow = leftTopTitleRow+xClipNum-1;
    var rightBottomTitleCol = leftTopTitleCol+yClipNum-1;
    //实际地理范围
    var realMaxX = MapConfig.FullExtent.xmin+(rightBottomTitleCol+1)*MapConfig.TitlePix*MapConfig.Resolution[level];
    var realMinY = MapConfig.FullExtent.ymax-(rightBottomTitleRow+1)*MapConfig.TitlePix*MapConfig.Resolution[level];
    
    for(var i=0;i<xClipNum;i++){
        for(var j=0;j<yClipNum;j++){
            loadImg(i,j,level,leftTopTitleCol,leftTopTitleRow);
        }
    }
}


//外部函数
function loadImg(i,j,level,leftTopTitleCol,leftTopTitleRow){
    var beauty = new Image();
    beauty.onload = function(event){
        var TitleImg={
            img:null,
            x:0,
            y:0
        };
        TitleImg.img=beauty;
        TitleImg.x=(j*MapConfig.TitlePix);//offSetX+
        TitleImg.y=(i*MapConfig.TitlePix);//offSetY+
        TitlesArry.push(TitleImg);
        myctx.drawImage(TitleImg.img, TitleImg.x, TitleImg.y);
    };
    beauty.src = "http://t3.tianditu.com/DataServer?T=vec_w&x="+(leftTopTitleCol+j)+"&y="+(leftTopTitleRow+i)+"&l="+level;
}


function lonlatTomercator(lonlat) {
    var mercator={x:0,y:0};
    var x = lonlat.x *20037508.34/180;
    var y = Math.log(Math.tan((90+lonlat.y)*Math.PI/360))/(Math.PI/180);
    y = y *20037508.34/180;
    mercator.x = x;
    mercator.y = y;
    return mercator ;
}


//绘制矩形
function drawRect(myctx){
    myctx.rect(0,0,256,256);
    myctx.stroke();
    myctx.rect(256,0,256,256);
    myctx.stroke();
}