//2d 맵사이즈 동적 변경
;(function() {
	$('#map2D').css("height",returnHeights());
	$('#map2D').css("width",returnWidths());
	
	//2D<->3D
	$('.single_btn > button').click( function(){
		/*if($(this).html() == "2D"){
		$(this).html('3D');
		
		$('#canvas').css('visibility','hidden');
		$('#map2D').css('visibility','visible');

		//화면 좌표 이동 3D->2D
		var camera = Module.getViewCamera();
		var vCenter = camera.getCenterPoint();
		var dCenterLon = vCenter.Longitude;
		var dCenterLat = vCenter.Latitude;
		var ZoomLevel= camera.getMapZoomLevel();
		var lonlat =[dCenterLon,dCenterLat];
		var coords = ol.proj.fromLonLat(lonlat); //WGS84 -> EPSG:3857
		map.getView().setCenter(coords); 	//바로이동
		map.getView().setZoom(ZoomLevel+4);
		}else{
		
		$(this).html('2D');
			
		$('#canvas').css('visibility','visible');
		$('#map2D').css('visibility','hidden');
		
		var centerCoor = ol.proj.toLonLat( map.getView().getCenter() );
		var camera = Module.getViewCamera();

		camera.moveLonLat(parseFloat(centerCoor[0]), parseFloat(centerCoor[1]));
		camera.setTilt(90);
		}*/
	});
})();

var map = new ol.Map({
    layers : [vworldMap_2D],
    target : 'map2D',
    view : new ol.View({
        center: ol.proj.fromLonLat([ 127.33184066396302, 36.526024108657095]),       // center 좌표,
        minZoom: 6
    }),
    drawVector : new ol.layer.Vector({
    	//그리기 레이어
		source: new ol.source.Vector({
			wrapX: false,			
		}),
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 152, 149, 0.5)'
			}),
			stroke: new ol.style.Stroke({
				color: '#e82520',
				width: 2
			}),
			image: new ol.style.Circle ({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	  
	})
}) ;

map.on("moveend", function() {
	var zoom = map.getView().getZoom();
	if(zoom <= "6"){
		map.getView().setCenter(ol.proj.transform([128.5, 36], 'EPSG:4326', 'EPSG:3857'));
		map.getView().setZoom("6");
	}
});