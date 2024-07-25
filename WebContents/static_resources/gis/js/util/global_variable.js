//로컬,운영 전역 변수(연결) _ 분기점 
console.log("서비스환경 :  "+runEnv);
console.log("로그인권한 : "+gisAuth);
if(runEnv=="prod"){
	//해양경찰청 서버-개발환경(내부운영서버)
	//XDSERVER
	var XDServerURL = "https://map.kcg.go.kr:28080";
	var XDServerPORT= 28080;
	var KCG_BUILD_URL = "https://map.kcg.go.kr:28080";
	//GEOSERVER
	var GeoserverURL = 'https://map.kcg.go.kr:28080/geoserver/kcg/';
	var GeoserverWMS = 'https://map.kcg.go.kr:28080/geoserver/kcg/wms?';
	var GeoserverWORKSPACE = "https://map.kcg.go.kr:28080/geoserver/kcg/ows?";
	//프록시 중요 (운영서버에서 HTTP 무시함)
	var proxy = "";
	//태블로 주소
	var tableauURL = 'https://bi.kcg.go.kr/';
	var tableauContrast = '_0&#47;1';
	var tableauCoastAccident = '_16418012533700&#47;2';
	var tableauOrganization = '_16418011636080/1?';
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
	//태블로 주소
	var tableauURL = 'https://public.tableau.com/';
	var tableauContrast = '_16378260749800&#47;1';
	var tableauCoastAccident = 'test_16378893080620&#47;1_2_';
	var tableauOrganization = '_16371225819130&#47;1';
}	