//로컬,운영 전역 변수(연결) _ 분기점 
console.log("서비스환경 :  "+runEnv);
if(runEnv=="prod"){
	//해양경찰청 서버-개발환경(내부운영서버)
	//XDSERVER
	var XDServerURL = "http://10.29.10.201:28080";
	var XDServerPORT= 28089;
	var KCG_BUILD_URL = "http://10.29.10.201:28080";
	//GEOSERVER
	var GeoserverURL = '/geoserver/kcg/';
	var GeoserverWMS = '/geoserver/kcg/wms?';
	var GeoserverWORKSPACE = "/geoserver/kcg/ows?";
	//프록시 중요 (운영서버에서 HTTP 무시함)
	var proxy = "/use/gisAnal/proxy?URL=";
}else{	
	//브이월드 서버-개발환경(로컬)
	//XDSERVER
	var XDServerURL = "http://xdworld.vworld.kr:8080";
	var XDServerPORT= 8080;
	var KCG_BUILD_URL = "http://121.78.158.27:8080"
	//GEOSERVER
	var GeoserverURL = 'http://121.78.158.27:8099/geoserver/kcg/';
	var GeoserverWMS = 'http://121.78.158.27:8099/geoserver/kcg/wms?';
	var GeoserverWORKSPACE = "http://121.78.158.27:8099/geoserver/kcg/ows?";
	//프록시
	var proxy = "/static_resources/gis/Engine/proxy.jsp?url="
}	