// /**
//  * 主文件，加载图片
//  */
// //http://222.178.118.101:6082/arcgis/rest/services/IMG_MCT/MapServer
// var MapConfig={
//     RootDir:'MapTitles/',
//     ViewHeight:700,
//     ViewWidth:1000,
//     TitlePix:256,
//     Resolution:[
//         156543.03392800014,
//         78271.51696399994,
//         39135.75848200009,
//         19567.87924099992,
//         9783.93962049996,
//         4891.96981024998,
//         2445.98490512499,
//         1222.992452562495,
//         611.4962262813797,
//         305.74811314055756,
//         152.87405657041106,
//         76.43702828507324,
//         38.21851414253662,
//         19.10925707126831,
//         9.554628535634155,
//         4.77731426794937,
//         2.388657133974685,
//         1.1943285668550503,
//         0.5971642835598172,
//         0.29858214164761665
//     ],
//     Scale:[
//         5.91657527591555E8,
//         2.95828763795777E8,
//         1.47914381897889E8,
//         7.3957190948944E7,
//         3.6978595474472E7,
//         1.8489297737236E7,
//         9244648.868618,
//         4622324.434309,
//         2311162.217155,
//         1155581.108577,
//         577790.554289,
//         288895.277144,
//         144447.638572,
//         72223.819286,
//         36111.909643,
//         18055.954822,
//         9027.977411,
//         4513.988705,
//         2256.994353,
//         1128.497176
//     ],
//     FullExtent:{
//         xmin : 1.1375426364947168E7,
//         ymin : 3228781.9094003676,
//         xmax : 1.25586453980519E7,
//         ymax : 3826741.438652759,
//         spatialReference : {
//             wkid : 102100
//         }
//     }
// };
// //$(document).ready(function(){
// window.onload = function(){


//     moveX = 0;
//     moveY = 0;
//     TitlesArry=[];
//     //设置将要现实的地图中心点
//     centerGeoPoint={
//         x:116.337737,
//         y:39.912465
//     };
//     centerGeoPoint=lonlatTomercator(centerGeoPoint);
//     level = 4;
//     //当前窗口显示的范围
//     minX=centerGeoPoint.x-(MapConfig.Resolution[level]*MapConfig.ViewWidth/2);
//     maxX=centerGeoPoint.x+(MapConfig.Resolution[level]*MapConfig.ViewWidth/2);
//     minY=centerGeoPoint.y-(MapConfig.Resolution[level]*MapConfig.ViewHeight/2);
//     maxY=centerGeoPoint.y+(MapConfig.Resolution[level]*MapConfig.ViewHeight/2);
//     //左上角开始的行列号
//     leftTopTitleRow = Math.floor(Math.abs(maxY-MapConfig.FullExtent.ymax)/MapConfig.Resolution[level]/MapConfig.TitlePix);
//     leftTopTitleCol = Math.floor(Math.abs(minX-MapConfig.FullExtent.xmin)/MapConfig.Resolution[level]/MapConfig.TitlePix);
//     //实际地理范围
//     realMinX = MapConfig.FullExtent.xmin+leftTopTitleCol*MapConfig.TitlePix*MapConfig.Resolution[level];
//     realMaxY = MapConfig.FullExtent.ymax-leftTopTitleRow*MapConfig.TitlePix*MapConfig.Resolution[level];

//     //计算左上角偏移像素
//     offSetX = (realMinX-minX)/MapConfig.Resolution[level];
//     offSetY = (maxY-realMaxY)/MapConfig.Resolution[level];
//     //计算瓦片个数
//     xClipNum = Math.ceil((MapConfig.ViewHeight+Math.abs(offSetY))/MapConfig.TitlePix);
//     yClipNum = Math.ceil((MapConfig.ViewWidth+Math.abs(offSetX))/MapConfig.TitlePix);
//     //右下角行列号
//     rightBottomTitleRow = leftTopTitleRow+xClipNum-1;
//     rightBottomTitleCol = leftTopTitleCol+yClipNum-1;
//     realMaxX = MapConfig.FullExtent.xmin+(rightBottomTitleCol+1)*MapConfig.TitlePix*MapConfig.Resolution[level];
//     realMinY = MapConfig.FullExtent.ymax-(rightBottomTitleRow+1)*MapConfig.TitlePix*MapConfig.Resolution[level];
//     //var mapcv = document.getElementById("mapcv");
//     //var myctx = mapcv.getContext("2d");
//     //var beauty = new Image();
//     //beauty.src = "/images/0/240425-121010210J011_01.gif";
//     //myctx.drawImage(beauty, 0, 0);
//     /*for(var i=0;i<xClipNum;i++){
//         for(var j=0;j<yClipNum;j++){
//             var beauty = new Image();
//             //http://t3.tianditu.com/DataServer?T=vec_w&x=202&y=106&l=8
//             //beauty.src = MapConfig.RootDir+level+"/"+(leftTopTitleRow+i)+"/"+(leftTopTitleCol+j)+".jpg";
            
//             //beauty.src = "http://222.178.118.101:6082/arcgis/rest/services/IMG_MCT/MapServer/tile/15/13565/26080";
//             //beauty.src = "/images/0/240425-121010210J011_01.gif";
//             beauty.onload = loadimg(i,j,beauty);
//             beauty.src = "http://t3.tianditu.com/DataServer?T=vec_w&x="+(leftTopTitleCol+j)+"&y="+(leftTopTitleRow+i)+"&l="+level;
//             document.getElementById('img').appendChild(beauty);
//         }
//     }
//     function loadimg(i,j,beauty){console.log(i,j,beauty);
//         var TitleImg={
//             img:null,
//             x:0,
//             y:0
//         };
//         TitleImg.img=beauty;
//         TitleImg.x=offSetX+(j*MapConfig.TitlePix);
//         TitleImg.y=offSetY+(i*MapConfig.TitlePix);
//         TitlesArry.push(TitleImg);
//         myctx.drawImage(TitleImg.img, TitleImg.x, TitleImg.y);
//     }*/
// }
// //});


// function lonlatTomercator(lonlat) {
//     var mercator={x:0,y:0};
//     var x = lonlat.x *20037508.34/180;
//     var y = Math.log(Math.tan((90+lonlat.y)*Math.PI/360))/(Math.PI/180);
//     y = y *20037508.34/180;
//     mercator.x = x;
//     mercator.y = y;
//     return mercator ;
// }