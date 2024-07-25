//쉐이프파일 자바스크립트로 GEOJSON 변환 shapeToGeojson('/static_resources/gis/data/tb.zip','EUC-KR',5179 )
function shapeToGeojson(shpURL, encoding,epsg){
loadshp({
    url: shpURL, // zip파일로 넣어주세요.
    encoding: encoding ,  
    EPSG:epsg  // 기본 3857
}, function(geojson) {
   console.log(geojson);
   if(geojson.features[0].geometry.type=='Point'&&onedata.features[0].geometry.type=='MultiPoint'){
	   
	   
   }else if(geojson.features[0].geometry.type=='LineString'){
	   createPOLYLINELayer('testL');
	   for(i=0;i<geojson.features.length;i++){ 
	          var data = geojson.features[i].geometry.coordinates;
	          for(l=0;l<data.length;l++){
	                  createLine('testL',data);
	              }
	       }
   }else if(geojson.features[0].geometry.type=='Polygon'){
	   createPOLYGONLayer('testG');
       for(i=0;i<geojson.features.length;i++){
    	   var data = geojson.features[i].geometry.coordinates;
           for(j=0;j<data.length;j++){
           var lis=[];
           lis[j]=[data[j][0],data[j][1],15];
               }
           var layer = createPOLYGONLayer('testG');
           createPolygon(layer, 'testG' ,lis, new Module.JSColor(100,100, 0, 100), new Module.JSColor(255,0, 0, 10));
           }
       }          
   
});
}