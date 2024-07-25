/**
 * 국가데이터맵 공용 기능 Js
 */
$(document).ready(function() {

	// 데이터맵 및 확장맵 관련 전역변수
	var _svg;
	var _simulation;
	var _svg_movement = '';
	var _svgWidth;
	var _svgHeight;

	var _drag;
	var _zoom;
	var _color;
	var _node;
	var _link;
	var _container;

	var _brmCls2Nm =""; //2020-05-20 트리맵 접속용 2차분류체계 전역변수 추가
	var _schDocId;		//검색어 고유ID
	var _extYn;			//전체연결 전역변수
	var _openDataYn;	//개방여부 전역변수
	var ifClicked = false;

	var timeout = null;	//데이터맵 확인용

	var relWords = ""; //확장검색 관련 전역변수

	// 확장맵 관련 전역변수
	var _treemap;
	var _root;
	var i = 0;
	var _margin = {top: 50, right: 120, bottom: 50, left: 40};
	var _cWidth;
	var _cHeight;
	var _startHeight = 550;
    var _treeHeight = _startHeight;

	// 메인 트리메뉴 컬러셋
	/*var treeColorSet = [ '#59bba5', '#d96bb6', '#f37553', '#f5b474', '#f2b82f', '#d04a26', '#69b9d3', '#8560e3'
        				,'#d67144', '#76c97b', '#4c72ff', '#9092c7', '#49b56a', '#faa138', '#a6e160', '#69ab4c', '#7ad3bf'];*/
    var treeColorSet = [ '#59bba5', '#d96bb6', '#f37553', '#f5b474', '#f2b82f', '#d04a26', '#69b9d3', '#8560e3'
						,'#d67144', '#76c97b', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff'];

	var treeBrmColors = {};
	var keywordParams = {b1: null, b2: null};

	/**
	 * 필요 option 설정
	 */
	function initialize() {

		var control = {};

		return control;
	}

	dm.control = initialize(); // control 초기화(1번만 실행되도록 함)

	/**
	 * 입력한 텍스트로 그래프를 그릴 데이터를 조회한다.(데이터맵)
	 */
	dm.srchRelationGraphMap = function(searchTxt, extYn) {

		$("#detail-section-1").removeClass("on");	//데이터 상세 닫기

		var offset = $("#input-keyword").offset();
        $('html, body').animate({scrollTop : offset.top}, 400);	//화면 스크롤링

		if("" == searchTxt || null == searchTxt || "undefiend" == searchTxt){
			alert("검색어를 입력해 주세요.");
			$("#input-keyword").focus();
			return false;
		}

		//전체 데이터연결 버튼 초기화
		offYn = $(".off > label").css("z-index");
		if(extYn === "N"){	//off
			if(offYn === "0"){	//open
				$("#onOffBtn").trigger("click");
			}
		}else{	//on
			if(offYn === "1"){	//open
				$("#onOffBtn").trigger("click");
			}
		}

		//var openDataYn = $(".search-area select").val();	// YZ : 개방목록, N : 보유목록, Y : 개방데이터,  Z : 개방예정데이터
		_openDataYn = "Y";	// YZ : 개방목록, N : 보유목록, Y : 개방데이터,  Z : 개방예정데이터

		/*var openYnLi = $('.open-yn ul li');
		for(var i=0; i<openYnLi.length; i++){
			var stat = openYnLi.eq(i).hasClass("on");
			if(stat){
				if(i == 0){	//전체
					openDataYn = "YZ";
				}else if(i == 1){	//개방
					openDataYn = "Y";
				}else if(i == 2){	//예정
					openDataYn = "Z";
				}
				break;
			}
		}*/

		var operator = $(".select-and-or").val();	//조회조건 : and / or
		if(operator == "AND"){
			operator = "and";
		}else{
			operator = "or";
		}

		var params;
		var url;
		if("" == relWords){

			// TODO: 이부분 url작업만 남음
			url = '/tcs/eds/ndm/relationWordList.do';
			// url = '/els/relationWordList.do';

			params = {
				keyword		 : searchTxt,
				openDataYn	 : _openDataYn,
				operator	 : operator,
				extYn		 : extYn,
				brmCls2Nm	 : _brmCls2Nm
			};
		}else{
			url = '/tcs/eds/ndm/relationExtWordList.do';
			params = {
				keyword		 : searchTxt,
				openDataYn	 : _openDataYn,
				extYn		 : extYn,
				relWords	 : relWords,
				brmCls2Nm	 : _brmCls2Nm
			};
		}

		loadingStart("contents");
		
		
		
		var result =  relationWordListData;
		
		loadingStop("contents");
		var data = result;

		$('.btn-reset').show();				//초기화
		$('.btn-move').show();				//필터기능 안보기
		$('.filter-section .tit-area .tit').text("필터"); 	//필터영역 타이틀
		$('.slider-area').show();			//데이터 연관도
		$('#tree_jstree_div').hide();
		$('.chk-area.brm').show();			//분류체계 영역
		$('.chk-area.org').show();			//기관명 영역
		$('.box-radio').hide();				//확장맵용 분류체계 영역
		$('.slider-area').show();			//데이터 연관도 영역

		$("#treemap_div").show();	//d3 영역
		$("#guide-Info-area1").hide();
		$("#guide-Info-area2").show();
		$("#guide-Info-area3").hide();
		$("#table-Info-area").hide();
		$("#allDataRadioBtn").show();
		$("#zoomArea").show();

		$('#treemap_div').attr("style", "height:800px;");

		$(".data-word02").show();
		//개방데이터만 표출하도록 주석처리 2020-07-14
		//$(".open-yn").show();

		$(".more-search").show();
		$( ".data-slider" ).slider( "value", 1 );

		$( "#extend-search-layer .close-modal" ).trigger("click");

		svg_movement = "";

		data.resultMsg.sort(byDocId);

		convertRelationGraphData(data.resultMsg, params);

		function byDocId(a, b) {

			if("N" == _openDataYn){
				if (a.docId > b.docId)
					return -1;
				if (a.docId < b.docId)
					return 1;
				if (a.mtaTblId > b.mtaTblId)
					return -1;
				if (a.mtaTblId < b.mtaTblId)
					return 1;
			}else{
				if (a.docId > b.docId)
					return -1;
				if (a.docId < b.docId)
					return 1;

			}
			return 0;
		}

	}
	
	
	

	/**
	 * 검색어와 테이블을 화면에 그릴 수 있도록 데이터를 처리한다.
	 */
	function convertRelationGraphData(data, params) {

		var temNodeData = [];
		var nodes = [];
		var links = [];

		var brmList = [], brmListMap = {};
		var orgList = {}, newOrgList = {},  orgSortList = [];

		var qRelCnt = 0, wRelCnt1 = 0, wRelCnt2 = 0, wRelCnt3 = 0, wRelCnt4 = 0, wRelCnt5 = 0;

		_schDocId = "0";	// 검색어 docId="0"

		//링크데이터 세팅
		for (var i = 0; i < data.length; i++) {

			var n = {
					docId : data[i].docId ? data[i].docId : data[i].mtaTblId,
					title : data[i].docTitle ? data[i].docTitle : data[i].mtaTblLnm,
					upId : data[i].linkId,
					source : data[i].docId ? data[i].docId : data[i].mtaTblId,
					target : data[i].linkId,
					nodeScore : data[i].score,
					keyStat : data[i].keyStat,
					openDataYn : data[i].openDataYn,
					brm : getBrmStr(data[i].brmCls1Nm, data[i].brmCls2Nm),
					brmCls1Nm : data[i].brmCls1Nm,
					brmCls2Nm : data[i].brmCls2Nm,
					//active : (data[i].keyStat == "Q" || (data[i].keyStat == "E" && _schDocId == data[i].linkId)) ? true : false,
					active : getLinkActive(data[i].keyStat, data[i].linkId, data[i].brmCls2Nm),	//2020-05-20
					distance : ("Q" == data[i].keyStat) ? 150 : ("W" == data[i].keyStat) ? 300 : 150
				}

			if(params.extYn == "Y"){
				n.active = true;
			}

			links.push(n);
		}

		//표출 건수 count
		for (var i = 0; i < data.length; i++) {
			if("E" == data[i].keyStat){
				if("" != _brmCls2Nm){	//2020-05-20
					if(data[i].brmCls2Nm == _brmCls2Nm){
						if("0" == data[i].linkId) qRelCnt++;
						if("1" == data[i].linkId) wRelCnt1++;
						if("2" == data[i].linkId) wRelCnt2++;
						if("3" == data[i].linkId) wRelCnt3++;
						if("4" == data[i].linkId) wRelCnt4++;
						if("5" == data[i].linkId) wRelCnt5++;
					}
				}else{
					if("0" == data[i].linkId) qRelCnt++;
					if("1" == data[i].linkId) wRelCnt1++;
					if("2" == data[i].linkId) wRelCnt2++;
					if("3" == data[i].linkId) wRelCnt3++;
					if("4" == data[i].linkId) wRelCnt4++;
					if("5" == data[i].linkId) wRelCnt5++;
				}
			}
		}

		// 노드 중복제거 : 기준 docId
		data.forEach(function(item, idx) {
			var linkId;

			if (temNodeData.length == 0) {
				temNodeData.push(item);
	        } else {
	        	var duplicatesFlag = true;
	            for (var j = 0; j < temNodeData.length; j++) {
	            	if (temNodeData[j].openDataYn == "N") {	//보유목록 데이터인 경우
	            		if (null != item.docId && (temNodeData[j].docId == item.docId)) {
		                	//linkId 를 삽입
		                	linkId = temNodeData[j].linkId + "," + item.linkId;
		                	temNodeData[j].linkId = linkId;

		                    duplicatesFlag = false;
		                    break;
		                }
	            		if ("" != item.mtaTblId && (temNodeData[j].mtaTblId == item.mtaTblId)) {
		                	//linkId 를 삽입
		                	linkId = temNodeData[j].linkId + "," + item.linkId;
		                	temNodeData[j].linkId = linkId;

		                    duplicatesFlag = false;
		                    break;
		                }
	            	}else{
	            		if (temNodeData[j].docId == item.docId) {
		                	//linkId 를 삽입
		                	linkId = temNodeData[j].linkId + "," + item.linkId;
		                	temNodeData[j].linkId = linkId;

		                    duplicatesFlag = false;
		                    break;
		                }
	            	}
	            }
	            if (duplicatesFlag) {
	            	temNodeData.push(item);
	            }
	        }
		});

		for (var i = 0; i < temNodeData.length; i++) {	//중복제거된 노드데이터 세팅 and 검색어 고유ID 추출

			var n = {
					id : temNodeData[i].docId ? temNodeData[i].docId : temNodeData[i].mtaTblId,
					name : temNodeData[i].docTitleView ? temNodeData[i].docTitleView : temNodeData[i].mtaTblLnm,
					title : temNodeData[i].docTitle ? temNodeData[i].docTitle : temNodeData[i].mtaTblLnm,
					upId : getLinkIdArray(temNodeData[i].linkId),
					group : getGroupVal(temNodeData[i].keyStat, temNodeData[i].docId, temNodeData[i].linkId),
					orgNm : temNodeData[i].orgNm,
					openDataYn : temNodeData[i].openDataYn,
					keyStat : temNodeData[i].keyStat,
					color : getColorVal(temNodeData[i].keyStat, temNodeData[i].openDataYn, temNodeData[i].score),
					keySchCount : temNodeData[i].keySchCount,
					openDataYn : temNodeData[i].openDataYn,
					nodeScore : temNodeData[i].score,
					round : getRadiusVal(temNodeData[i].keyStat, temNodeData[i].score),
					brm : getBrmStr(temNodeData[i].brmCls1Nm, temNodeData[i].brmCls2Nm),
					brmCls1Nm : temNodeData[i].brmCls1Nm,
					brmCls2Nm : temNodeData[i].brmCls2Nm,
					orgCd : temNodeData[i].orgCd ? temNodeData[i].orgCd : "미분류",
					orgNm : temNodeData[i].orgNm ? temNodeData[i].orgNm : "미분류",
					//active : (temNodeData[i].keyStat == "Q" || (temNodeData[i].keyStat == "E" && -1 != temNodeData[i].linkId.indexOf(_schDocId))) ? true : false,
					active : getNodeActive(temNodeData[i].keyStat, temNodeData[i].linkId, temNodeData[i].brmCls2Nm),	//2020-05-20
					relCount : ("Q" == temNodeData[i].keyStat || "W" == temNodeData[i].keyStat) ?  getNodeCnt(temNodeData[i].docId ? temNodeData[i].docId : temNodeData[i].mtaTblId) : "0"
				}

			if(params.extYn == "Y"){
				n.active = true;
			}

			if(temNodeData[i].keyStat == "Q"){
				$(".result-info p").remove();
				appendHtml = '<p class="txt"><em>“'+params.keyword+'”</em> 에 대해 <em>총 '+temNodeData[i].keySchCount+'건</em>이 검색되었습니다. (관계도맵과 확장맵에서는 최대 30건까지 조회되며, 나머지 데이터는 상세목록탭에서 조회할 수 있습니다.)</p>';
				$(".result-info").append(appendHtml);
			}

			nodes.push(n);

			/* 실행부 */
			if("Q" != temNodeData[i].keyStat && "W" != temNodeData[i].keyStat){
				brmListMap[n.id] = getBrmList(n);
				brmListMap[n.id].forEach(function(s, j) {
					if (!findElement(brmList, s))
						brmList.push(s);
				}); // brm string 생성
				brmList.sort();

				var orgId = n.orgNm + '+' + n.orgCd;
				if (!orgList[orgId]) {
					orgList[orgId] = []; // orgList를 sort해서 넣기
					orgSortList.push(orgId);
				}
			}

		}

		orgSortList.sort().forEach(function(o, i) {
			newOrgList[o] = orgList[o];
		});
		orgList = newOrgList;

		//console.log(nodes);
		//console.log(links);

		dm.control.data = {
			nodes : nodes,
			links : links
		}; // 전체 Node, Link 모음
		dm.control.init = {
			nodes : nodes.slice(),
			links : links.slice()
		}; // 초기 Node, Link 모음

		dm.control.nodes = nodes; // 화면에 그려질 Node, Link 모음
		dm.control.links = links;

		// 검색 직후 filteredTableArray를 nodes(전체)로 초기화
		dm.dataInfoList = {
			table : nodes,
			filteredTableArray : nodes,
			org : orgList,
			brm : brmList
		};

		var tableNum = nodes.length, orgNum = Object.keys(orgList).length, brmNum = (function() {
			var count = 0;
			brmList.forEach(function(s, i) {
				if (s.indexOf('/') == -1)
					count++;
			});
			return count;
		}());
		// 검색요약 만들기

		dm.dataInfoList.count = {
			org : orgNum,
			brm : brmNum,
			table : tableNum
		};

		orgListGroupCnt("R"); // 검색기관(org) 출력하기
		brmListGroupCnt("R"); // 분류체계(brm) 출력하기

		drawRelationSvgArea(dm.control);


		function getLinkIdArray(linkId) {
			var linkIdArray = [];
			linkIdArray = linkId.split(",");
			return linkIdArray;
		}

		function getGroupVal(keyStat, docId, linkId) {
			var result;
			if((keyStat == "Q" || keyStat == "E") && -1 != linkId.indexOf("0")){
				return result = 0;
			}

			for(var i=1; i<6; i++){
				if(docId == i || linkId == i){
					result = i;
					break;
				}
			}

			return result;
		}

		// keyStat과 score에 따른 node의 색상 배정
		function getColorVal(keyStat, openDataYn, score) {
			switch (keyStat) {
				case 'Q':
					return "#5d3cb6";
				case 'W':
					return "#F6871C";
				case 'E':
					if(openDataYn === "Z"){	//개방 예정
						if (score == 1)
							return "#f2d1e8";
						else if (score ==2)
							return "#eea4d7";
						else
							return "#e882c8";
					}else{
						if (score == 1)
							return "#b7edea";
						else if (score == 2)
							return "#81e0da";
						else
							return "#4bd3cb";
					}
				default:
					return "#b7edea";
			}
		}

		// 노드 반지름 계산
		function getRadiusVal(keyStat, score) {
			if(keyStat == "Q"){
				return "38px";
			}else if(keyStat == "W"){
				return "34px";
			}else if(keyStat == "E"){
				if(score == 1)
					return "16px";
				else if(score == 2)
					return "20px";
				else
					return "24px";
			}
		}

		// 데이터 docId 중복제거
		function removeDuplicates(arr) {
	        var tempArr = [];
	        for (var i = 0; i < arr.length; i++) {
	            if (tempArr.length == 0) {
	                tempArr.push(arr[i]);
	            } else {
	                var duplicatesFlag = true;
	                for (var j = 0; j < tempArr.length; j++) {
	                    if (tempArr[j].docId == arr[i].docId) {
	                        duplicatesFlag = false;
	                        break;
	                    }
	                }
	                if (duplicatesFlag) {
	                    tempArr.push(arr[i]);
	                }
	            }
	        }
	        return tempArr;
	    }

		// 분류체계1 + 분류체계2 string
		function getBrmStr(brmCls1Nm, brmCls2Nm) {
			var brmStr = "";

			if(!brmCls1Nm)
				return "미분류";

			if(brmCls2Nm){
				brmStr = brmCls1Nm + "/" + brmCls2Nm;
			}else{
				brmStr = brmCls1Nm;
			}

			return brmStr;
		}

		function getBrmList(d) { // 분류체계1 + 분류체계2 List string
			var brmList = [], str = "";
			for (var i = 1; i <= 2; i++) {
				var brm = d['brmCls' + i + 'Nm'];
				if (brm) { // brm 존재하면
					str += (brm + '/');
					if (!findElement(brmList, str))
						brmList.push(str.slice(0,-1));
				} else {
					if (i == 1)
						brmList.push('미분류');
					break;
				}
			}
			return brmList;
		}

		function getNodeCnt(docId) {
			if("0" == docId){
				return qRelCnt;
			}else if("1" == docId){
				return wRelCnt1;
			}else if("2" == docId){
				return wRelCnt2;
			}else if("3" == docId){
				return wRelCnt3;
			}else if("4" == docId){
				return wRelCnt4;
			}else if("5" == docId){
				return wRelCnt5;
			}else{
				return 0;
			}
		}

		function getLinkActive(keyStat, linkId, brmCls2Nm) {	//2020-05-20 분류체계 확인 펑션 추가
			var result = false;

			if(keyStat == "Q"){
				result = true;
			}

			if(keyStat == "E" && _schDocId == linkId){
				if("" != _brmCls2Nm){
					if(brmCls2Nm == _brmCls2Nm){
						result = true;
					}
				}else{
					result = true;
				}
			}

			return result;
		}

		function getNodeActive(keyStat, linkId, brmCls2Nm) {	//2020-05-20 분류체계 확인 펑션 추가
			var result = false;

			if(keyStat == "Q"){
				result = true;
			}

			if(keyStat == "E" && -1 != linkId.indexOf(_schDocId)){
				if("" != _brmCls2Nm){
					if(brmCls2Nm == _brmCls2Nm){
						result = true;
					}
				}else{
					result = true;
				}
			}

			return result;
		}


	}
	
	
	
	
	
	
	
	

	/**
	 * svg 영역을 비우고 초기화 한다
	 */
	function drawRelationSvgArea(control){

		//기능별 영역 표출
		$('#tab-menu').show();	//상단 탭메뉴
		$('#guide-Info-area1').hide();
		$('#guide-Info-area2').show();
		$('#zoomArea').show();

		var el_treemap = $('#treemap').get(0);

		$(el_treemap).empty();
		if(_simulation) _simulation.stop();

		_svgWidth = Math.max($('#treemap_div').width());
		_svgHeight = Math.max($('#treemap_div').height());

		_simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) {return d.id;}).strength(0.5))
						.force("charge", d3.forceManyBody().strength(-200))
						.force("collision", d3.forceCollide(50).strength(0.35))
						/*.force("link", d3.forceLink().id(function(d) {return d.id;}).distance(function(d) {return d.distance;}).strength(1))
						.force("charge", d3.forceManyBody().strength(-120))
						.force("collision", d3.forceCollide(40).strength(0.20))*/
						.force('radial', d3.forceRadial(function(d) {
							var radial;
							 	if(d.keyStat === "Q"){
							 		radial = 0;
								}else if(d.keyStat === "W"){
									radial = 300;
								}
							 	if(d.keyStat === "E" && -1 != d.upId.indexOf("0")){	//검색어를 바라보는 메타데이터
							 		radial = 100;
							 	}
							 	if(d.keyStat === "E" && -1 == d.upId.indexOf("0")){	//연관검색어를 바라보는 메타데이터
							 		radial = 500;
							 	}
							return radial;
						  }, _svgWidth * 0.5, _svgHeight * 0.5))
						.force('center', d3.forceCenter().x(_svgWidth * 0.5).y(_svgHeight * 0.5))
						.on('tick', ticked);

		_zoom = d3.zoom().scaleExtent([0.4, 5]).on("start", zoomstart).on("zoom", zoomed).on("end", zoomend);

		_container = d3.select(el_treemap)
		 			   .attr("width", "100%")
		 			   .attr("height", "800px")
		 			   .style("background-color", "#ffffff")
		 			   .call(_zoom)
		 			   .on("dblclick.zoom", null);

		_svg = d3.select(el_treemap).append("g").attr("class", "canvas");

		_color = d3.scaleOrdinal(d3.schemeCategory20);

		_drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);

		//초기 줌거리 조정
		//_svg.transition().call(_zoom.scaleBy, 0.8);

		// filters 그림자 효과 추가
		var defs = _container.append("defs");
		var filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "150%");
		filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
		filter.append("feOffset").attr("in", "blur").attr("dx", 1).attr("dy", 8).attr("result", "offsetBlur");
		var feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode").attr("in", "offsetBlur");
		feMerge.append("feMergeNode").attr("in", "SourceGraphic");

		//눈금 이동별 좌표계산
		function ticked() {
			_node.attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
			/*_node.attr("cx", function(d) { return d.x; })
		      	 .attr("cy", function(d) { return d.y; });*/

			_link.attr("x1", function(d) {
				return d.source.x;
				})
			 	 .attr("y1", function(d) {
			 		 return d.source.y;
			 		 })
			 	 .attr("x2", function(d) {
			 		 return d.target.x;
			 		 })
			 	 .attr("y2", function(d) {
			 		 return d.target.y;
			 		 });
		}

		function dragstarted(d) {
			if (!d3.event.active){
				_simulation.alphaTarget(0.3).restart()
			}
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) {
			  _simulation.alphaTarget(0);
		  }

		  d.fx = undefined;
		  d.fy = undefined;
		}

		function zoomstart(d) {
			_svg.attr("transform", _svg_movement);
		}

		function zoomed(d) {
			var ratio = d3.event.transform.k;
			if (ratio > 5)
				ratio = 5;
			if (ratio < 0.1)
				ratio = 0.1;

			_svg.attr("transform", d3.event.transform);

			setVizByRatio(ratio);
		}

		function setVizByRatio(ratio) {
			//if (_nodes.length > 100) {
			//노출 조정
			ratio > 0.6 ? d3.selectAll('g.node > text').style('display', '')
					    : d3.selectAll('g.node > text').style('display',function(d) {return d.keyStat == "E" ? 'none': ''});

			ratio > 2.3 ? d3.selectAll('g.node > .node-title').text(function(d) {
							if(d.keyStat == "E"){
								return d.name;
							}else{
					    		return d.title;
					    	}
						})
					    : d3.selectAll('g.node > .node-title').text(function(d) {
					    	if(d.keyStat == "E"){
					    		return getText(d);
					    	}else{
					    		return d.title;
					    	}
					    });

		}

		function zoomend(d) {
			_svg_movement = _svg.attr("transform");
		}

		var _nodes = control.nodes;
		var _links = control.links;

		$('g.canvas').empty();

		/*************************** 링크 처리 start ***************************/

		_link = _svg.append("g").selectAll(".link").data(_links, function(d) { return d.target.id; });

		var linkEnter = _link.enter().append("line")
							 .attr("class", "link")
							 .on("click", lClick);

		//검색어, 연관어
		linkEnter.filter(function (d) { return d.keyStat == "Q" || d.keyStat == "W";})
		 		 .style("stroke", "#dce3f0")
		 		 .attr("stroke-width", "3px");
		/*//메타데이터
		linkEnter.filter(function (d) { return d.keyStat == "E";})
				 .attr("class", function(d) {
					 var result;
					 if(d.nodeScore == 1){
						 result = "link lvl1";
					 }else if(d.nodeScore == 2){
						 result = "link lvl2";
					 }else{
						 result = "link lvl3";
					 }
					 return result;
				  })
				  .attr("stroke-width", "2px")
				  .style("visibility", function(d) { return d.active == true ? "visible" : "hidden";});*/

		//메타데이터
		linkEnter.filter(function (d) { return d.keyStat == "E";})
				 .attr("class", function(d) {
					 var result;
					 if(d.target == "0"){
						 result = "link lvl1";
					 }else if(d.target == "1" || d.target == "2" || d.target == "3"){
						 result = "link lvl2";
					 }else{
						 result = "link lvl3";
					 }
					 return result;
				  })
				  .attr("stroke-width", function(d) {
					 var result;
					 if(d.target == "0" || d.target == "1" || d.target == "2" || d.target == "3"){
						 result = "1.5px";
					 }else{
						 if(d.nodeScore == 1){
							 result = "1.5px";
						 }else if(d.nodeScore == 2){
							 result = "2px";
						 }else{
							 result = "2.5px";
						 }
					 }
					 return result;
				  })
				  .style("visibility", function(d) { return d.active == true ? "visible" : "hidden";});

		_link = linkEnter.merge(_link);

		/*************************** 링크 처리 end ***************************/

		/*************************** 노드 처리 start ***************************/

		_node = _svg.append("g").selectAll(".node").data(_nodes, function(d) { return d.id; });

		var nodeEnter = _node.enter().append("g").attr("class", "node")
							 .on("click", nClick)
							 .on("dblclick", dblclick)
							 .on("mouseover", mouseover)
							 .on("mouseout", mouseout)
							 .call(_drag);

		// 검색어, 연관어 적용
		nodeEnter.filter(function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? true : false;})
			 	 .append("polygon")
				 .attr("brm", function(d) { return d.brm;})
				 .attr("org", function(d) { return d.orgCd;})
			  	 .attr('points', getHexagonSize(44, 38))
			 	 .attr('fill', function (d) { return d.color;})
			 	 .style("stroke", function (d) { return d.keyStat == "Q" ? "#bcaee1" : "#f7cca2";})
			 	 .style("stroke-width", "4px")
			 	 .style("stroke-opacity", function(d){return d.active == true ? "1" : "0";});

		// 데이터 적용
		nodeEnter.filter(function (d) { return (d.keyStat != "Q" && d.keyStat != "W") ? true : false;})
				 .append("circle")
				 .attr("docid", function(d) { return d.id;})
				 .attr("brm", function(d) { return d.brm;})
				 .attr("org", function(d) { return d.orgCd;})
				 .attr("r", function (d) { return d.round;})
				 .attr('fill', function (d) { return d.color;})
				 .attr('active', function (d) { return d.active;})
				 //.attr("class","btn-open-detail-section")
				 //.style("stroke", function (d) { return d.openDataYn == "Z" ? "#c455a1" : "#1e9c95";})
				 .style("stroke", "#000000")
				 .style("stroke-width", "1.5px")
				 .style("stroke-opacity", "0");

		// 개방데이터 다운로드 icon
		nodeEnter.filter(function(d) { return d.openDataYn == 'Y';})
		 		 .append("image")
		 		 .attr("xlink:href", function(d) { return "images/biz/ndm/ico/icon_ffff.png";})
		 		 .attr("x", function(d) { return getIconPosX(d);})
		 		 .attr("y", function(d) { return getIconPosY(d);})
		 		 .attr("width", function(d) { return getIconWiHe(d);})
		 		 .attr("height", function(d) { return getIconWiHe(d);});

		// 타이틀
		nodeEnter.append("title").text(function(d) { return d.title; })

		// 제목 text 태그 추가
		nodeEnter.append("text")
				 .attr("class", "font-mg")	//폰트 : 맑은고딕
				 .attr("class", "node-title")	//폰트 : 맑은고딕
				 .attr("dy", function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? -4 : 0;} )
				 .attr('x', 0).attr('y', 0)
				 .attr('text-anchor', "middle")
				 //.attr('font-weight', function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? "bold" : "regular";})
				 .attr('font-weight', "bold")
				 .attr("font-size", getNameFontSize)
				 //.attr('fill', function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? "#fafafa" : "#333333";})
				 .attr('fill', function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? "#eeeeee" : "#333333";})
				 .style("stroke-width", "0px")
				 .text(function(d) { return getText(d); });

		// 검색건수 text 태그 추가
		nodeEnter.filter(function (d) { return d.keyStat == "Q" || d.keyStat == "W";})
				 .append("text")
				 .attr("class", "font-mg")	//폰트 : 맑은고딕
				 .attr("class", "node-count")	//폰트 : 맑은고딕
				 .attr("dy", 13)
				 .attr('x', 0).attr('y', 0)
				 .attr('text-anchor', "middle")
				 .attr('font-weight', "regular")
				 .attr("font-size", "9px") //12px -> 9px
				 .attr('fill', "#fafafa")
				 .style("stroke-width", "0px")
				 .text(function(d) {
					 var result
					 var count;
					 if("" != d.keySchCount){
						 count = Number(d.keySchCount);
						 //if(count > 30){
							 result = d.relCount + "/"+d.keySchCount + "건"
						 //}else{
							 //result = d.relCount + "건";
						 //}
					 }
					 return result;
				 });

		// 기관명 text 태그 추가
		nodeEnter.filter(function (d) { return d.keyStat == "E";})
				 .append("text")
				 .attr("class", "font-mg")	//폰트 : 맑은고딕
				 .attr("class", "node-orgnm")	//폰트 : 맑은고딕
				 .attr("dy", 13)
				 .attr('x', 0).attr('y', 0)
				 .attr('text-anchor', "middle")
				 .attr('font-weight', "bold")
				 .attr("font-size", "9px")
				 .attr('fill', "#333333")
				 .style("stroke-width", "0px")
				 .text(function(d) { return "(" + d.orgNm + ")"; });

		// 초기 조회 시 disable 효과 적용(검색어관련 데이터)
		//nodeEnter.attr("style", function(d) {if((_schDocId != d.upId && d.keyStat == "E") && d.active != true) return "visibility:hidden"; });
		nodeEnter.attr("style", function(d) {if(d.keyStat == "E" && d.active != true) return "visibility:hidden"; });
		//nodeEnter.attr("style", function(d) {if(d.active == false) return "visibility:hidden"; });

		_node = nodeEnter.merge(_node);

		/*************************** 노드 처리 end ***************************/

		/*************************** 노드 처리 end ***************************/
		d3.select("svg").on("click", function() {
			if(ifClicked){
				return;
			}

		    _node.transition(500).style('fill-opacity', 1).style("filter", "none");
		    _node.filter(function (d) { return d.keyStat == "E" }).style('stroke-opacity', 0);

		    _link.filter(function (d) { return d.keyStat == "E" })
		    	 .transition(500)
		    	 .attr("class", function(d) {
					 var result;
					 if(d.target.id == "0"){
						 result = "link lvl1";
					 }else if(d.target.id == "1" || d.target.id == "2" || d.target.id == "3"){
						 result = "link lvl2";
					 }else{
						 result = "link lvl3";
					 }
					 return result;
				  })
				 .attr("stroke-width", function(d) {
					 var result;
					 if(d.target.id == "0" || d.target.id == "1" || d.target.id == "2" || d.target.id == "3"){
						 result = "1.5px";
					 }else{
						 if(d.nodeScore == 1){
							 result = "1.5px";
						 }else if(d.nodeScore == 2){
							 result = "2px";
						 }else{
							 result = "2.5px";
						 }
					 }
					 return result;
				  })
		    	 .style("stroke-opacity", 1);

		    _link.filter(function (d) {
		    	return d.keyStat == "Q" || d.keyStat == "W" })
		    	 .transition(500)
		    	 .attr("stroke-width", "3px")
		    	 .style("stroke", "#dce3f0");

		    $(".detail-section").removeClass('on');
		    ifClicked = false;
		});
		/*************************** 노드 처리 end ***************************/


		_simulation.nodes(_nodes);
		_simulation.force("link").links(_links);
		//_simulation.restart();


		// 검색어, 연관어 도형 좌표 설정
		function getHexagonSize(wid, hei){
			var harfLen = wid/1.8;

			// '-44,0 -25,38 25,38 44,0 25,-50 -25,-50'
			location1 = -wid+","+0;
			location2 = -harfLen+","+hei;
			location3 = harfLen+","+hei;
			location4 = wid+","+0;
			location5 = harfLen+","+(-hei);
			location6 = -harfLen+","+(-hei);
			var result = location1.concat(" ", location2, " ", location3, " ", location4, " ", location5, " ", location6);

			return result;
		}

		// 키워드, 연관어, 데이터 별 글자크기
		function getNameFontSize(d){
			var fontSize;
			if(d.keyStat == "Q"){
				fontSize = "16px";
			}else if(d.keyStat == "W"){
				fontSize = "14px";
			}else{
				fontSize = "11px";
			}
			return fontSize;
		}

		function getText(d) {
			var str = d.name ? d.name : d.title;
			return str.length > 8 ? str.substring(0, 8) + '..'
					: str;
		}

		function getIconWiHe(d) {
			var result;
			if(d.nodeScore == 1){
				result = 9;
			}else if(d.nodeScore == 2){
				result = 11;
			}else{
				result = 13;
			}
 			return result;
		}

		function getIconPosX(d) {
			var result;
			if(d.nodeScore == 1){
				result = -4;
			}else if(d.nodeScore == 2){
				result = -5;
			}else{
				result = -6;
			}
 			return result;
		}

		function getIconPosY(d) {
			var result;
			if(d.nodeScore == 1){
				result = -17;
			}else if(d.nodeScore == 2){
				result = -21;
			}else{
				result = -26;
			}
 			return result;
		}

		//데이터맵 노드 클릭 이벤트(노드 클릭이벤트 이전에 svg 클릭이벤트 우선 실행됨)
		function nClick(d) {

			clearTimeout(timeout);

		    timeout = setTimeout(function() {

				var active = d.active;	// 활성화 여부
				var dataDetail = $("#detail-section-1").hasClass('on');	//데이터 상세영역 열려있는 여부 (true : 열림, false : 닫힘)

				ifClicked = false;

				if(d.keyStat == 'Q'){	// 검색어 선택시

					if(dataDetail == true){	//데이터를 선택하여 상세페이지가 나와있는 경우
						//1.모든 노드가 보이도록
						//2.데이터 노드만 외곽선 제거
						//3.모든 선이 보이도록
						//4.상세페이지 close
						_node.transition(500).style('fill-opacity', 1);
					    _node.filter(function (dd) { return dd.keyStat == "E" }).style('stroke-opacity', 0);
					    _link.transition(500).attr("stroke-width", "1px").style("fill-opacity", 1).style("stroke-opacity", 1).style("stroke", function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? "#dce3f0" : "#eeeeee";});
					    $("#detail-section-1").removeClass('on');
					}else{
						if(active){	//데이터 노드들이 active 되어 있다면
							//1.연관검색어를 제외한 검색어와 연관되어 있는 데이터 노드 강조
							//2.검색어와 연관되어 연관검색어 노드 투명도 적용
							//3.이외 노드들은 투명도 적용
							_node.filter(function (dd) {
									return (dd.id === d.id || -1 != dd.upId.indexOf(d.id) || -1 != d.upId.indexOf(dd.id)) && dd.keyStat != "W";
									})
							 	 .transition(500).style("fill-opacity", 1).style("filter", "url(#drop-shadow)");
							_node.filter(function (dd) { return (dd.id === d.id || -1 != dd.upId.indexOf(d.id) || -1 != d.upId.indexOf(dd.id)) && dd.keyStat == "W";})
							 	 .transition(500).style("fill-opacity", 1);
							_node.filter(function (dd) { return (dd.id != d.id && -1 == dd.upId.indexOf(d.id) && -1 == d.upId.indexOf(dd.id)) && dd.keyStat == "E";})
								 .transition(500).style("fill-opacity", 0.5);
							//1.연관검색어를 제외한 검색어와 연관되어 있는 라인 강조
							//2.검색어와 연관되어 연관검색어 라인 투명도 적용
							//3.이외 라인들은 투명도 적용
							_link.filter(function (dd) {return dd.source.id === d.id || dd.target.id === d.id;})
								 .transition(500).attr("stroke-width", "3px").style("stroke", "#aaaaaa").style("stroke-opacity", 1);
							_link.filter(function (dd) {return (dd.source.id === d.id || dd.target.id === d.id) && dd.keyStat == "W";})
							 	 .transition(500).style("stroke", "#eeeeee").style("stroke-opacity", 0.5);
							_link.filter(function (dd) {return dd.source.id != d.id && dd.target.id != d.id;})
								 .transition(500).style("stroke", "#eeeeee").style("stroke-opacity", 0.5);
							//_link.filter(function (dd) {return dd.source.id === d.id || dd.target.id === d.id;}).transition(500).style("stroke-width", "3px").style("stroke", "#aaaaaa").style("stroke-opacity", 1);
						}
					}

				}else if(d.keyStat == 'W'){	// 연관검색어 선택시
					if(dataDetail == true){	//데이터를 선택하여 상세페이지가 나와있는 경우
						//1.모든 노드가 보이도록
						//2.데이터 노드만 외곽선 제거
						//3.모든 선이 보이도록
						//4.상세페이지 close
						_node.transition(500).style('fill-opacity', 1);
					    _node.filter(function (dd) { return dd.keyStat == "E" }).style('stroke-opacity', 0);
					    _link.transition(500).attr("stroke-width", "1px").style("fill-opacity", 1).style("stroke-opacity", 1).style("stroke", function (d) { return (d.keyStat == "Q" || d.keyStat == "W") ? "#dce3f0" : "#eeeeee";});
					    $("#detail-section-1").removeClass('on');
					}else{
						if(active){ //데이터 노드들이 active 되어 있다면
							//1.연관검색어와 관계되어 있는 검색어 노드를 제외한 모든 데이터 노드 강조
							//2.이외 모든 노드 투명도 적용
							_node.filter(function (dd) { return (dd.id === d.id || -1 != dd.upId.indexOf(d.id) || -1 != d.upId.indexOf(dd.id))})
							 	 .transition(500).style("fill-opacity", 1).style("filter", "url(#drop-shadow)");
							_node.filter(function (dd) { return dd.id != d.id && -1 == dd.upId.indexOf(d.id) && -1 == d.upId.indexOf(dd.id);})
								 .transition(500).style("fill-opacity", 0.5);
							//1.연관검색어와 관계되어 있는 모든 라인 강조
							//2.이외 라인들은 투명도 적용
							_link.filter(function (dd) {return dd.source.id != d.id && dd.target.id != d.id;})
								 .transition(500).style("stroke", "#eeeeee").style("stroke-opacity", 0.5);
							_link.filter(function (dd) {return (dd.source.id === d.id || dd.target.id === d.id) && dd.active == true;})
								 .transition(500).attr("stroke-width", "3px").style("stroke", "#aaaaaa").style("stroke-opacity", 1);
						}
					}
				}else if(d.keyStat == 'E'){	// 데이터 선택시
					//전체화면 여부 조건 추가(2020.05.07)
					var wDoc = window.document;
					if(!wDoc.fullscreenElement && !wDoc.mozFullScreenElement && !wDoc.webkitFullscreenElement && !wDoc.msFullscreenElement) {	//전체화면 이라면
						//1.노드 그림자 효과
						_node.filter(function (dd) { return dd.id === d.id || -1 != dd.upId.indexOf(d.id) || -1 != d.upId.indexOf(dd.id);}).transition(500).style("fill-opacity", 1).style("filter", "url(#drop-shadow)");
						_node.filter(function (dd) { return dd.id != d.id && -1 == dd.upId.indexOf(d.id) && -1 == d.upId.indexOf(dd.id);}).transition(500).style("fill-opacity", 0.5);
						_node.filter(function (dd) { return (dd.id != d.id && -1 == dd.upId.indexOf(d.id) && -1 == d.upId.indexOf(dd.id)) && dd.keyStat === "E";}).transition(500).style("stroke-opacity", 0).style("fill-opacity", 0.5);

						_link.filter(function (dd) { return dd.source.id != d.id && dd.target.id != d.id;}).transition(500)
							 .attr("class", "link lvl3")
							 .style("stroke-opacity", 0.5);
						_link.filter(function (dd) { return dd.source.id === d.id || dd.target.id === d.id;}).transition(500)
							 .attr("class", "link lvl4")
							 .attr("stroke-width", "3px")
							 .style("stroke-opacity", 1);

						// 메타정보 조회
						if(d.openDataYn == "N"){
							dm.searchMetaInfo({
								mtaTblId : d.id,
								openDataYn : d.openDataYn
							});
						}else{
							dm.searchMetaInfo({
								docId : d.id,
								openDataYn : d.openDataYn
							});
						}
					}else{ //전체화면이 아니라면
						alert("전체화면에서는 목록상세정보를 조회할 수 없습니다.");
					}

					//e.preventDefault();
				}

		    }, 140);

		}

		//데이터맵 노드 더블 클릭 이벤트
		function dblclick(d) {

			clearTimeout(timeout);

			if(d.keyStat == 'Q' || d.keyStat == 'W'){	// 검색어 또는 연관검색어 선택시

				if((_svgWidth / 2) > d.x) moveX = d.x+50;
				else moveX = d.x-50;

				if((_svgHeight / 2) > d.y) moveY = d.y+50;
				else moveY = d.y-50;

				var active = d.active ? false : true;	// 활성화여부 확인용
				if(active){
					// node move 효과 추가
					//d3.select(this).transition().attr("transform", "translate("+moveX+", "+moveY+")").transition().attr("transform", "translate("+d.x+", "+d.y+")");
					_node.filter(function (dd) {return dd.id === d.id}).transition().attr("transform", "translate("+moveX+", "+moveY+")").transition().attr("transform", "translate("+d.x+", "+d.y+")");

					_link.filter(function (dd) { return dd.target.id === d.id && (dd.keyStat == "Q" || dd.keyStat == "W")})
					 .transition().attr("x2", moveX).attr("y2", moveY).transition().attr("x2", d.x).attr("y2", d.y);

					_link.filter(function (dd) { return dd.source.id === d.id && (dd.keyStat == "Q" || dd.keyStat == "W")})
						 .transition().attr("x1", moveX).attr("y1", moveY).transition().attr("x1", d.x).attr("y1", d.y);

					_link.filter(function (dd) { return dd.target.id === d.id && dd.keyStat == "E"; })
						 .transition().attr("x1", moveX).attr("y1", moveY).transition().attr("x1", d.x).attr("y1", d.y);
				}

				//노드 표출숨김 처리 and 링크 숨김 처리
				_node.filter(function (dd) {
						var result;
						// 2020-07-28 : YZ 주석처리
						/*if("YZ" == _openDataYn){	//2020-06-09 추가
							if(-1 != dd.upId.indexOf(d.id) && (dd.keyStat == "E")){
								if(active === false){
									_link.filter(function (ddd) {//2개이상 연결된 노드의 라인 숨김처리
										var result;
										if(ddd.source.id == dd.id || ddd.target.id == dd.id){
											ddd.active = active;
											result = true;
										}else{
											result = false;
										}
										return result
										}
									).transition().delay(0).style("visibility", "hidden");
								}

								dd.active = active;
								result = true;
							}else{
								result = false;
							}
						}else {*/
							//if(-1 != dd.upId.indexOf(d.id) && (dd.keyStat == "E") && dd.openDataYn == _openDataYn){	//2020-06-09 수정
							if(-1 != dd.upId.indexOf(d.id) && (dd.keyStat == "E")){	//2020-07-27 수정
								if(active === false){
									_link.filter(function (ddd) {//2개이상 연결된 노드의 라인 숨김처리
										var result;
										if(ddd.source.id == dd.id || ddd.target.id == dd.id){
											ddd.active = active;
											result = true;
										}else{
											result = false;
										}
										return result
										}
									).transition().delay(0).style("visibility", "hidden");
								}

								dd.active = active;
								result = true;

								// 2020-07-28 : 트리맵 진입시 2차분류체계 값의 유무에 따른 result 처리 추가
								if(_brmCls2Nm != ""){
									if(dd.brmCls2Nm == _brmCls2Nm){
										result = true;
									}else{
										result = false;
									}
								}

							}else{
								result = false;
							}
						//}
						return result;
					}
				).transition().delay(active === false ? 0 : 450).style("visibility", active === false ? "hidden" : "visible");
				_node.filter(function (dd) {return dd.id === d.id;}).select("polygon").style("stroke-opacity", active === true ? "1" : "0");

				//링크 표출 처리
				if(active){
					_node.filter(function (dd) {
						if(dd.active == true){	//노드가 표출중
							_link.filter(function (ddd) {	//선택된 키워드의 직접연결 노드들을 표출
								var result;
								//if(ddd.target.id == d.id || (ddd.target.id == dd.id && ddd.source.active == true) || (ddd.source.id == dd.id && ddd.source.active == true)){
								if(ddd.target.id == d.id || (ddd.target.id == dd.id && ddd.source.active == true)){
									// 2020-07-28 : YZ 주석처리
									/*if("YZ" == _openDataYn){	//2020-06-09 수정
										ddd.active = active;
										result = true;
									}else{
										if(ddd.openDataYn == _openDataYn){
											ddd.active = active;
											result = true;
										}
									}*/
									ddd.active = active;
									result = true;

									// 2020-07-28 : 트리맵 진입시 2차분류체계 값의 유무에 따른 result 처리 추가
									if(_brmCls2Nm != ""){
										if(ddd.brmCls2Nm == _brmCls2Nm){
											result = true;
										}else{
											result = false;
										}
									}

								}else{
									result = false;
								}
								return result
								}
							).transition().delay(450).style("visibility", "visible");
						}

						return true;
					});
				}

				d.active = active;

			}

		}

		//데이터맵 노드 마우스오버 이벤트
		function mouseover(d) {
			if(d.keyStat === "E"){
				/*d3.select(this).selectAll("text").transition()
			      .attr("font-size", "13px");*/
				d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
					var result;
					if(i == 0){
						result = "13px";
					}else{
						result = "11px";
					}
					return result;
				});
			}
		}

		//데이터맵 노드 마우스아웃 이벤트
		function mouseout(d) {
			if(d.keyStat === "E"){
				d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
					var result;
					if(i == 0){
						result = "11px";
					}else{
						result = "9px";
					}
					return result;
				});
			}
		}

		//데이터맵 링크 마우스오버 이벤트
		function mouseoverLink(d) {
		  //d3.select(this).transition().duration(200).style("stroke","#f45988").style("stroke-opacity","1");
			d3.select(this).transition().duration(200).style("stroke","#e882c8").style("stroke-opacity","1");
		}

		//데이터맵 링크 마우스아웃 이벤트
		function mouseoutLink(d) {
			d3.select(this).transition().duration(200).style("stroke","#eeeeee");
		}

		//데이터맵 연결정보 호출 이벤트
		function lClick(d) {

			//검색어 및 연관검색어와 연결된 link는 연결정보 표출X
			if(d.upId == 0 || d.upId == 1 || d.upId == 2 || d.upId == 3){
				return;
			}

			var docId = "";
			var sSchKey;
			var tSchKey;
			var sTitle = d.source.title;
			var tTitle = d.target.title;
			var sBrm = d.source.brm;
			var tBrm = d.target.brm;

			docId = d.source.id + "," + d.target.id;

			_node.filter(function(dd) {
				if(-1 != d.source.upId.indexOf(dd.id)){
					if(dd.id == 0 || dd.id == 1 || dd.id == 2 || dd.id == 3){
						sSchKey = dd.title;
					}
				}

				if(-1 != d.target.upId.indexOf(dd.id)){
					if(dd.id == 0 || dd.id == 1 || dd.id == 2 || dd.id == 3){
						tSchKey = dd.title;
					}
				}
				return true;
			});

			// 연결정보 조회
			dm.getConnectInfo({
				docId : docId,
				sTitle : sTitle,
				tTitle : tTitle,
				sBrm : sBrm,
				tBrm : tBrm,
				sSchKey : sSchKey,
				tSchKey : tSchKey
			});

		}

	}

	/**
	 * 입력된 텍스트로 그래프를 그릴 데이터를 조회한다.(확장맵)
	 */
	dm.srchCollapsibleGraphMap = function(searchTxt) {

		$("#detail-section-1").removeClass("on");

		var openDataYn = "Y";	// YZ : 개방목록, N : 보유목록, Y : 개방데이터,  Z : 개방예정데이터

		//개방데이터만 표출하도록 주석처리 2020-07-14
		//var openYnLi = $('.open-yn ul li');	//개방여부 영역
		/*for(var i=0; i<openYnLi.length; i++){
			var stat = openYnLi.eq(i).hasClass("on");
			if(stat){
				if(i == 0){	//전체
					openDataYn = "YZ";
				}else if(i == 1){	//개방
					openDataYn = "Y";
				}else if(i == 2){	//예정
					openDataYn = "Z";
				}
				break;
			}
		}*/

		var operator = $(".select-and-or").val();	//조회조건 : and / or
		if(operator == "AND"){
			operator = "and";
		}else{
			operator = "or";
		}

		var orgYn = $("input[name='radio_extend']:checked").val();	//조회조건 : and / or

		var params = {
				keyword : searchTxt,
				openDataYn : openDataYn,
				operator : operator,
				orgYn : orgYn
			};

		loadingStart("contents");
		post(
				'/tcs/eds/ndm/extendMapList.do',
				params,
				{
					scb: function(result) {
						loadingStop("contents");
	            		var data = eval("("+result+")");
						$("#treemap_div").show();	//d3 영역
						$('#guide-Info-area1').hide();	//분류체계 가이드정보
						$('#guide-Info-area2').hide();	//데이타맵 가이드정보
						$('#guide-Info-area3').show();	//확장맵 가이드정보
						$("#table-Info-area").hide();	//목록정보 영역
						$("#allDataRadioBtn").hide();
						$('#zoomArea').show();			//관계도맵 부가기능 영역
						$('.slider-area').hide();		//데이터 연관도 영역
						$('.box-radio').show();			//확장맵용 분류체계 영역

						//개방데이터만 표출하도록 주석처리 2020-07-14
						//$(".open-yn").show();

						$(".more-search").hide();		//확장검색

						_svg_movement = "";

						convertCollapsibleGraphData(data.resultMsg, params);

					},
					fcb : function(e) {
						loadingStop("contents");
					}
				}
		);

	}

	function convertCollapsibleGraphData(data, params) {

		//console.log(data);

		var nodes = [], converData = [];
		var brmList = [], brmListMap = {};
		var orgList = {}, newOrgList = {},  orgSortList = [];
		var tableDataList = [];

		var nodeQupR = [];
		var nodeWId = [], nodeRId1 = [], nodeRId2 = [], nodeRId3 = [];
		var qNodeCnt = 0, wNodeCnt1 = 0, wNodeCnt2 = 0, wNodeCnt3 = 0;
		//검색어 연관어 표출 count 계산
		for (var i = 0; i < data.length; i++) {
			var node = data[i];
			if("R" == node.keyStat && "0" == node.upId){	//검색어를 바라보는 기업/분류
				nodeQupR.push(node.docId);
			}
			if("W" == node.keyStat){	//연관어 id 추출
				nodeWId.push(node.docId);
			}
		}
		for (var i = 0; i < data.length; i++) {	//연관어를 바라보는 기업/분류
			var node = data[i];
			//if("R" == node.keyStat && -1 != node.upId.indexOf(nodeWId[0])){
			if("R" == node.keyStat && node.upId == nodeWId[0]){
				nodeRId1.push(node.docId);
			}
			//if("R" == node.keyStat && -1 != node.upId.indexOf(nodeWId[1])){
			if("R" == node.keyStat && node.upId == nodeWId[1]){
				nodeRId2.push(node.docId);
			}
			//if("R" == node.keyStat && -1 != node.upId.indexOf(nodeWId[2])){
			if("R" == node.keyStat && node.upId == nodeWId[2]){
				nodeRId3.push(node.docId);
			}
		}
		for (var i = 0; i < data.length; i++) {	//연관어를 바라보는 기업/분류
			var node = data[i];
			if("E" == node.keyStat && -1 != nodeQupR.indexOf(node.upId)){
				qNodeCnt++;
			}
			if("E" == node.keyStat && -1 != nodeRId1.indexOf(node.upId)){
				wNodeCnt1++;
			}
			if("E" == node.keyStat && -1 != nodeRId2.indexOf(node.upId)){
				wNodeCnt2++;
			}
			if("E" == node.keyStat && -1 != nodeRId3.indexOf(node.upId)){
				wNodeCnt3++;
			}
		}


		for (var i = 0; i < data.length; i++) {	//노드데이터 세팅 and 검색어 고유ID 추출

			var n = {
					id : data[i].docId ? data[i].docId : data[i].mtaTblId,
					upId : data[i].upId ? data[i].upId : "",
					name : data[i].docTitle ? data[i].docTitle : data[i].mtaTblLnm,
					keyStat : data[i].keyStat ? data[i].keyStat : "",
					openDataYn : data[i].openDataYn ? data[i].openDataYn : "N",
					orgCd : data[i].orgCd ? data[i].orgCd : "미분류",
					orgNm : data[i].orgNm ? data[i].orgNm : "",
					brmCls1Nm : data[i].brmCls1Nm ? data[i].brmCls1Nm : "",
					brmCls2Nm : data[i].brmCls2Nm ? data[i].brmCls2Nm : "",
					brm : getBrmStr(data[i].brmCls1Nm, data[i].brmCls2Nm),
					keySchCount : data[i].keySchCount,
					relCount : getRelCount(data[i].keyStat, data[i].docId ? data[i].docId : data[i].mtaTblId),
				}
			nodes.push(n);

			/* 실행부 */
			if(("Q" != data[i].keyStat && "W" != data[i].keyStat && "R" != data[i].keyStat) && n.id != "top"){
				brmListMap[n.id] = getBrmList(n);
				brmListMap[n.id].forEach(function(s, j) {
					if (!findElement(brmList, s))
						brmList.push(s);
				}); // brm string 생성
				brmList.sort();

				if(n.orgCd != "미분류"){
					var orgId = n.orgNm + '+' + n.orgCd;
					if (!orgList[orgId]) {
						orgList[orgId] = []; // orgList를 sort해서 넣기
						orgSortList.push(orgId);
					}
				}
			}

		}

		orgSortList.sort().forEach(function(o, i) {
			newOrgList[o] = orgList[o];
		});
		orgList = newOrgList;

		for (var i = 0; i < data.length; i++) {	//중복제거된 노드데이터 세팅 and 검색어 고유ID 추출
			var n = {
					id : data[i].docId ? data[i].docId : data[i].mtaTblId,
					upId : data[i].upId,
					name : data[i].docTitle ? data[i].docTitle : data[i].mtaTblLnm,
					keyStat : data[i].keyStat,
					openDataYn : data[i].openDataYn ? data[i].openDataYn : "N",
					orgCd : data[i].orgCd ? data[i].orgCd : "미분류",
					orgNm : data[i].orgNm,
					brmCls1Nm : data[i].brmCls1Nm,
					brmCls2Nm : data[i].brmCls2Nm,
					brm : getBrmStr(data[i].brmCls1Nm, data[i].brmCls2Nm),
					keySchCount : data[i].keySchCount,
					relCount : getRelCount(data[i].keyStat, data[i].docId ? data[i].docId : data[i].mtaTblId),
				}
			converData.push(n);
		}

		converData = extractData(converData);

		function extractData(data){
			var treeData = [];

			var dataMap = data.reduce(function(map, node) {
				map[node.id] = node;
				return map;
			}, {});

			data.forEach(function(node) {
				// add to parent
				var parent = dataMap[node.upId];
				if (parent) {
					// create child array if it doesn't exist
					(parent.children || (parent.children = []))
						// add node to child array
						.push(node);
				} else {
					// parent is null or missing
					treeData.push(node);
				}
			});

			return treeData;

		}

		function getRelCount(keyStat, id){
			var result;
			if("Q" == keyStat){
				result = qNodeCnt;
			}else if("W" == keyStat){
				if(0 == nodeWId.indexOf(id)){
					result = wNodeCnt1;
				}else if(1 == nodeWId.indexOf(id)){
					result = wNodeCnt2;
				}else if(2 == nodeWId.indexOf(id)){
					result = wNodeCnt3;
				}

			}
			return result;

		}

		dm.control.data = {
			nodes : nodes
		}; // 전체 Node
		dm.control.init = {
			nodes : converData[0],
			orgData : nodes
		}; // 초기 Node, Link 모음

		dm.control.nodes = converData[0]; // 화면에 그려질 Node, Link 모음

		// 검색 직후 filteredTableArray를 nodes(전체)로 초기화
		dm.dataInfoList = {
			table : nodes,
			filteredTableArray : nodes,
			nodes : converData[0],
			org : orgList,
			brm : brmList
		};

		var tableNum = nodes.length, orgNum = Object.keys(orgList).length, brmNum = (function() {
			var count = 0;
			brmList.forEach(function(s, i) {
				if (s.indexOf('/') == -1)
					count++;
			});
			return count;
		}());
		// 검색요약 만들기

		dm.dataInfoList.count = {
			org : orgNum,
			brm : brmNum,
			table : tableNum
		};

		orgListGroupCnt("C"); // 검색기관(org) 출력하기
		brmListGroupCnt("C"); // 분류체계(brm) 출력하기

		drawCollapsibleSvgArea(dm.control);


		// 분류체계1 + 분류체계2 string
		function getBrmStr(brmCls1Nm, brmCls2Nm) {
			var brmStr = "";

			if(!brmCls1Nm)
				return "미분류";

			if(brmCls2Nm){
				brmStr = brmCls1Nm + "/" + brmCls2Nm;
			}else{
				brmStr = brmCls1Nm;
			}

			return brmStr;
		}

		// 분류체계1 + 분류체계2 List string
		function getBrmList(d) {
			var brmList = [], str = "";
			for (var i = 1; i <= 2; i++) {
				var brm = d['brmCls' + i + 'Nm'];
				if (brm) { // brm 존재하면
					str += (brm + '/');
					if (!findElement(brmList, str))
						brmList.push(str.slice(0,-1));
				} else {
					if (i == 1)
						brmList.push('미분류');
					break;
				}
			}
			return brmList;
		}

	}

	/**
	 * svg 영역을 비우고 초기화 한다
	 */
	function drawCollapsibleSvgArea(control){
		var dx = 10, dy = 10;
		_cWidth = Math.max($('#treemap').width()) - (_margin.right + _margin.left);
		_cHeight = Math.max($('#treemap').height()) - (_margin.top + _margin.bottom);

		_simulation.stop();	//d3.force 기능 정지

		var el_treemap = $('#treemap').get(0);
		$(el_treemap).empty();	// svg영역 비우기

		/*_svg = d3.select(el_treemap)
				 .attr("width", _cWidth)
		 		 .attr("height", _cHeight)
		 		 .append("g")
		 		 .call(_zoom);*/

		_container = d3.select(el_treemap)
					   .attr("width", _cWidth)
			 		   .attr("height", _cHeight)
			 		   .call(_zoom)
			 		   .on("dblclick.zoom", null);

		_svg = d3.select(el_treemap).append("g");
		_svg.attr("transform", "translate(150,50)scale(1)");
		_svg_movement = _svg.attr("transform");

		_zoom = d3.zoom().scaleExtent([0.4, 5]).on("start", zoomstart).on("zoom", zoomed).on("end", zoomend);

		_root = d3.hierarchy(control.nodes, function(d) { return d.children; });
		_root.x0 = _cHeight / 2;
		_root.y0 = 0;

		if(null != _root.children && "undefiend" != _root.children){	//자식 노드가 있으면 적용
			_root.children.forEach(collapse);
		}

		update(_root)

		function collapse(d) {
			if(d.children) {
				d._children = d.children
				d._children.forEach(collapse)
				if(d.data.keyStat == "W") {
					d.children = null
				}
			}
		}

		function zoomstart(d) {
			_svg.attr("transform", _svg_movement);
		}

		function zoomed(d) {
			_svg.attr("transform", d3.event.transform);
		}

		function zoomend(d) {
			_svg_movement = _svg.attr("transform");
		}

	}

	function update(source) {

		var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
		childCount(0, _root);

		var newHeight = d3.max(levelWidth) * 35; // 35 pixels per line
		_treemap = d3.tree().size([newHeight, _cWidth]);

		var treeData = _treemap(_root);

		// Compute the new tree layout.
	    var nodes = treeData.descendants();
	    var links = treeData.descendants().slice(1);

	    nodes.forEach(function(d){ d.y = d.depth * 150});

		// ****************** Nodes section ***************************
		_node = _svg.selectAll("g.node").data(nodes, function(d) {return d.id || (d.id = ++i); });

		var nodeEnter = _node.enter().append("g")
							 .attr("class", "node")
							 .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")";})
							 .on("click", cClick);

		// node에 circle 추가
		nodeEnter.append('circle').attr("class", "node")
								  .attr("r", 7.5)
								  .attr("fill", "#fff")
								  .attr("brm", function(d) { return d.data.brm; })
								  .attr("org", function(d) { return d.data.orgCd;})
								  .style("stroke-width", "5px");

		// node에 text 추가
		nodeEnter.append('text').attr("dy", function(d) { return d.data.keyStat === "E" ? 4 : -4;})
							    .attr("x", function(d) { return d.data.keyStat === "E" ? 13 : -13;})
							    .attr("text-anchor", function(d) { return d.data.keyStat === "E" ? "start" : "end";})
							    .attr("class", "font-mg")	//폰트 : 맑은고디
							    .style("font-size", "10px")
							    .style("font-weight", function(d) { return d.data.keyStat === "E" ? "regular" : "bold";})
							    //.text(function(d) { return d.data.name; })
							    .text(function(d) {
							    	var result;
							    	if(d.data.keyStat == "Q" || d.data.keyStat == "W"){
							    		 var count =Number(d.data.keySchCount);
										 //if(count > 30){
											 result = d.data.name + "("+ d.data.relCount +"/"+d.data.keySchCount+")건";
										 //}else{
											 //result = d.data.name + "("+d.data.keySchCount+")건";
										 //}
							    	}else{
							    		result = d.data.name;
							    	}
							    	return result;
							    })
							    .clone(true).lower()
						        .attr("stroke-linejoin", "round")
						        .attr("stroke-width", 3)
						        .attr("stroke", "white");

		var nodeUpdate = nodeEnter.merge(_node)
							  	  .transition()
							  	  .duration(400)
							  	  .attr("transform", function(d) {return "translate(" + d.y + "," + d.x + ")";});

		nodeUpdate.select('circle.node')
				  .attr('r', 7.5)
				  .style("fill", setFillColors)
				  .style("stroke", setStrokeColors)
				  .attr('cursor', 'pointer');

		var nodeExit = _node.exit()
							.transition()
							.duration(400)
							.attr("transform", function(d) {return "translate(" + source.y + "," + source.x + ")";})
							.remove();

		nodeExit.select('circle').attr('r', 1e-6);

	  	nodeExit.select('text').style('fill-opacity', 1e-6);

	 // ****************** links section ***************************
	    _links = _svg.selectAll('path').data(links, function(d) { return d.id; });

	    var linkEnter = _links.enter().insert('path', "g")
	    							  .attr("class", "link")
	    							  .attr('d', d3.linkHorizontal().x(function(d) { return source.y0; }).y(function(d) { return source.x0; }))
	    							  .style("fill","none")
	    							  .style("stroke", setStrokeColors)
	    							  .style("stroke-opacity","0.4")
	    							  .style("stroke-width","1px");

	    var linkUpdate = linkEnter.merge(_links);

	    linkUpdate.transition()
	              .duration(400)
	              .attr('d', function(d){ return diagonal(d, d.parent);});

		//var linkExit = _links.exit().transition(transition).duration(750).attr('d', d3.linkHorizontal().x(function(d) { return source.y; }).y(function(d) { return source.x; })).remove();
	    var linkExit = _links.exit().transition().duration(400).attr('d', d3.linkHorizontal().x(function(d) { return source.y; }).y(function(d) { return source.x; })).remove();

	    nodes.forEach(function(d){
	      d.x0 = d.x;
	      d.y0 = d.y;
	    });

	    //centerNode(_root);

	    d3.select("svg").on("click", function() {
	    	$("#detail-section-1").removeClass("on");
	    	_node.filter(function (d) {
				  if(d.data.keyStat == "E"){
					  d.active = false;
				  }
				  return true;
				  });
	    	_node.filter(function (d) { return d.data.keyStat == "E"}).select('circle').style("fill", "#fff");
	    });

	    function setStrokeColors(d) {
			var result;
			if(d.data.keyStat == "Q"){
				result = "#df6067";
			}else if(d.data.keyStat == "W"){
				result = "#808080";
			}else if(d.data.keyStat == "R"){
				result = "#279edc";
			}else if(d.data.keyStat == "E"){
				result = "#8b5cf3";
			}

			if(d.data.id == "top"){
				result = "#808080";
			}

			return result;
		}

		function setFillColors(d) {
			var result;
			if(d.active == true && d.data.keyStat == "Q"){
				result = "#df6067";
			}else if(d.active == true && d.data.keyStat == "W"){
				result = "#808080";
			}else if(d.active == true && d.data.keyStat == "R"){
				result = "#279edc";
			}else if(d.active == true && d.data.keyStat == "E"){
				result = "#8b5cf3";
			}

			if(d.data.id == "top"){
				result = "#808080";
			}

			return result;
		}

		function diagonal(s, d) {
			var path = "M "+s.y+" "+s.x+" C "+((s.y+d.y)/2)+" "+s.x+", "+((s.y+d.y)/2)+" "+d.x+" "+d.y+" "+d.x;

		    return path
		}

		function cClick(d) {

		  var active = d.active ? false : true;	// 활성화여부 확인용

		  d.active = active;

		  if (d.children) {
			  if (d.depth > 1 && _treeHeight > _startHeight) { // conditions for tree shrinking
				  _treeHeight -= (d.children.length * 25)
				  _treemap.size([_treeHeight, _cWidth])
			  }
			  d._children = d.children;
			  d.children = null;
		  } else {
			  d.children = d._children;
			  if (d.depth > 1 && _treeHeight < _cHeight) { // conditions for tree growth
				  if(d._children != null){
					  _treeHeight += (d._children.length * 25)
					  _treemap.size([_treeHeight, _cWidth])
				  }
			  }
			  d._children = null;
		  }

		  if(d.data.keyStat == "E"){

			  if(active){
				  //메타정보 조회
				  if(d.data.openDataYn == "N"){
					  dm.searchMetaInfo({
						  mtaTblId : d.data.id,
						  openDataYn : d.data.openDataYn
					  });
				  }else{
					  dm.searchMetaInfo({
						  docId : d.data.id,
						  openDataYn : d.data.openDataYn
					  });
				  }
				  _node.filter(function (dd) {
					  if(dd.data.keyStat == "E" && dd.data.id != d.data.id){
						  dd.active = false;
					  }
					  return true;
					  });
				  ifClicked = true;
			  }else{
				  $("#detail-section-1").removeClass('on');
				  ifClicked = false;
			  }
		  }

		  update(d);
		  //centerNode(d)
		}

		function centerNode(source) {

			/*zoomInfo = d3.zoomTransform(_svg.node());
	        x = zoomInfo.x;
	        y = source.x0;
	        y = -source.x0;
	        y = -y * zoomInfo.k + (_cHeight + _margin.top + _margin.bottom) / 2;
	        d3.select('g').transition().duration("400")
	            		  .attr("transform", "translate(" + x + "," + y + ")scale(" + zoomInfo.k + ")")
	            		  .on("zoomend", function(){ _svg.call(_zoom.transform, d3.zoomIdentity.translate(x,y).scale(zoomInfo.k))});
	        _svg_movement = _svg.attr("transform");*/
			t = d3.zoomTransform(_svg.node());
			x = -source.y0;
	        y = -source.x0;

	        var gHeight = Math.max($('#treemap g').height())

	        x = x * t.k + _cWidth / 2;
	        //y = y * zoomInfo.k + _cHeight / 2;
	        y = y * t.k + gHeight / 2;

	        d3.select('svg').transition().duration("400").call(_zoom.transform, d3.zoomIdentity.translate(x,y).scale(t.k));

	        /*d3.select('g').transition().duration("400")
	        			  .attr("transform", "translate(" + x + "," + y + ")scale(" + zoomInfo.k + ")")
	        			  .on("end", function(){ _svg.call(_zoom.transform, d3.zoomIdentity.translate(x,y).scale(zoomInfo.k))});*/
	        			  //.on("end", function(){ _svg.call(_zoom.transform, d3.select('g').translate(x,y).scale(zoomInfo.k))});
	        _svg_movement = _svg.attr("transform");
	    }

	}

	/**
	 * 입력된 텍스트로 목록정보를 그릴 데이터를 조회한다.(목록정보)
	 */
	dm.srchBoardInfoMap = function(searchTxt) {

		$("#detail-section-1").removeClass("on");

		var appendHtml;

		var openDataYn = "Y";	// YZ : 개방목록, N : 보유목록, Y : 개방데이터,  Z : 개방예정데이터

		//개방데이터만 표출하도록 주석처리 2020-07-14
		//var openYnLi = $('.open-yn ul li');	//개방여부 영역
		/*for(var i=0; i<openYnLi.length; i++){
			var stat = openYnLi.eq(i).hasClass("on");
			if(stat){
				if(i == 0){	//전체
					openDataYn = "YZ";
				}else if(i == 1){	//개방
					openDataYn = "Y";
				}else if(i == 2){	//예정
					openDataYn = "Z";
				}
				break;
			}
		}*/


		var operator = $(".select-and-or").val();	//조회조건 : and / or
		if(operator == "AND"){
			operator = "and";
		}else{
			operator = "or";
		}

		var params = {
			keyword 	: searchTxt,
			openDataYn	: openDataYn,
			operator	: operator
			//extYn		: "N"
		};

		loadingStart("contents");
		post(
				'/tcs/eds/ndm/relationWordAllList.do',
				params,
				{
					scb: function(result) {
						loadingStop("contents");
	            		var data = eval("("+result+")");
						$("#treemap_div").hide();	//d3 영역
						$("#guide-Info-area1").hide();
						$("#guide-Info-area2").hide();
						$("#guide-Info-area3").hide();
						$("#table-Info-area").show();
						$("#allDataRadioBtn").hide();
						$("#zoomArea").hide();

						$('.slider-area').hide();		//데이터 연관도 영역
						$('.box-radio').hide();			//확장맵용 분류체계 영역
						//개방데이터만 표출하도록 주석처리 2020-07-14
						//$(".open-yn").show();

						$(".more-search").hide();		//확장검색

						convertBoardInfoData(data.resultMsg, params);

					},
					fcb : function(e) {
						loadingStop("contents");
					}
				});

	}

	/**
	 * 검색어와 테이블을 화면에 그릴 수 있도록 데이터를 처리한다.
	 */
	function convertBoardInfoData(data, params) {

		//console.log(data);

		var temData = [], nodes = [], mKeywordData = [], rKeywordData = [];
		var mKeyword, rKeyword = [];
		var brmList = [], brmListMap = {};
		var orgList = {}, newOrgList = {},  orgSortList = [];

		data.forEach(function(item, idx) {	// 노드 중복제거 : 기준 docId
			if (temData.length == 0) {
				temData.push(item);
	        } else {
	        	var duplicatesFlag = true;
	            for (var j = 0; j < temData.length; j++) {
	                if(temData[j].openDataYn == "N"){
	                	if (null != item.docId && (temData[j].docId == item.docId)) {
		                	duplicatesFlag = false;
		                    break;
		                }
	                	if ("" != item.mtaTblId && (temData[j].mtaTblId == item.mtaTblId)) {
	                	//if (temData[j].mtaTblId == item.mtaTblId) {
		                    duplicatesFlag = false;
		                    break;
		                }
	                }else{
	                	if (temData[j].docId == item.docId) {
		                    duplicatesFlag = false;
		                    break;
		                }
	                }
	            }
	            if (duplicatesFlag) {
	            	temData.push(item);
	            }
	        }
		});

		for (var i = 0; i < temData.length; i++) {	//중복제거된 노드데이터 세팅 and 검색어 고유ID 추출
			var n = {
					id : temData[i].docId ? temData[i].docId : temData[i].mtaTblId,
					name : temData[i].docTitleView ? temData[i].docTitleView : temData[i].mtaTblLnm,
					title : temData[i].docTitle ? temData[i].docTitle : temData[i].mtaTblLnm,
					content : temData[i].docContent,
					upId : temData[i].linkId,
					orgNm : temData[i].orgNm,
					openDataYn : temData[i].openDataYn,
					keyStat : temData[i].keyStat,
					keySchCount : temData[i].keySchCount,
					nodeScore : temData[i].score,
					searchKeyword : temData[i].searchKeywordArray,
					brm : getBrmStr(temData[i].brmCls1Nm, temData[i].brmCls2Nm),
					brmCls1Nm : temData[i].brmCls1Nm,
					brmCls2Nm : temData[i].brmCls2Nm,
					orgCd : temData[i].orgCd ? temData[i].orgCd : "미분류",
					orgNm : temData[i].orgNm,
					apiFileNm : temData[i].apiFileNm,
					apiFileTypeDetail : temData[i].apiFileTypeDetail,
					apiFileUrl : temData[i].apiFileUrl,
					dataTy : temData[i].dataTy
				}
			nodes.push(n);
		}

		for (var i = 0; i < temData.length; i++) {	//중복제거된 노드데이터 세팅 and 검색어 고유ID 추출
			// 메타데이터(keyStat:E) 중 검색어에 관련된 데이터만 추출
			if(temData[i].keyStat == "E" && temData[i].linkId == "0"){

				var n = {
						id : temData[i].docId ? temData[i].docId : temData[i].mtaTblId,
						name : temData[i].docTitleView ? temData[i].docTitleView : temData[i].mtaTblLnm,
						title : temData[i].docTitle ? temData[i].docTitle : temData[i].mtaTblLnm,
						content : temData[i].docContent,
						upId : temData[i].linkId,
						orgNm : temData[i].orgNm,
						openDataYn : temData[i].openDataYn,
						keyStat : temData[i].keyStat,
						keySchCount : temData[i].keySchCount,
						nodeScore : temData[i].score,
						searchKeyword : temData[i].searchKeywordArray,
						brm : getBrmStr(temData[i].brmCls1Nm, temData[i].brmCls2Nm),
						brmCls1Nm : temData[i].brmCls1Nm,
						brmCls2Nm : temData[i].brmCls2Nm,
						orgCd : temData[i].orgCd ? temData[i].orgCd : "미분류",
						orgNm : temData[i].orgNm,
						dataTy : temData[i].dataTy
					}
				mKeywordData.push(n);

				/* 실행부 */
				brmListMap[n.id] = getBrmList(n);
				brmListMap[n.id].forEach(function(s, j) {
					if (!findElement(brmList, s))
						brmList.push(s);
				}); // brm string 생성
				brmList.sort();

				var orgId = n.orgNm + '+' + n.orgCd;
				if (!orgList[orgId]) {
					orgList[orgId] = []; // orgList를 sort해서 넣기
					orgSortList.push(orgId);
				}
			}
		}

		for (var i = 0; i < temData.length; i++) {
			// 메타데이터(keyStat:E) 중 연관검색어에 관련된 데이터만 추출
			if(temData[i].keyStat == "E" && (temData[i].linkId == "1" || temData[i].linkId == "2" || temData[i].linkId == "3" || temData[i].linkId == "4" || temData[i].linkId == "5")){

				var n = {
						id : temData[i].docId ? temData[i].docId : temData[i].mtaTblId,
						name : temData[i].docTitleView ? temData[i].docTitleView : temData[i].mtaTblLnm,
						title : temData[i].docTitle ? temData[i].docTitle : temData[i].mtaTblLnm,
						content : temData[i].docContent,
						upId : temData[i].linkId,
						orgNm : temData[i].orgNm,
						openDataYn : temData[i].openDataYn,
						keyStat : temData[i].keyStat,
						keySchCount : temData[i].keySchCount,
						nodeScore : temData[i].score,
						searchKeyword : temData[i].searchKeywordArray,
						brm : getBrmStr(temData[i].brmCls1Nm, temData[i].brmCls2Nm),
						brmCls1Nm : temData[i].brmCls1Nm,
						brmCls2Nm : temData[i].brmCls2Nm,
						orgCd : temData[i].orgCd ? temData[i].orgCd : "미분류",
						orgNm : temData[i].orgNm,
						dataTy : temData[i].dataTy
					}
				rKeywordData.push(n);

				/* 실행부 */
				brmListMap[n.id] = getBrmList(n);
				brmListMap[n.id].forEach(function(s, j) {
					if (!findElement(brmList, s))
						brmList.push(s);
				}); // brm string 생성
				brmList.sort();

				var orgId = n.orgNm + '+' + n.orgCd;
				if (!orgList[orgId]) {
					orgList[orgId] = []; // orgList를 sort해서 넣기
					orgSortList.push(orgId);
				}
			}
		}

		var rCnt1 = 0, rCnt2 = 0, rCnt3 = 0, rCnt4 = 0, rCnt5 = 0;
		for (var i = 0; i < temData.length; i++) {
			if(temData[i].keyStat == "Q"){
				mKeyword = temData[i].docTitle;
			}

			if(temData[i].keyStat == "W"){
				var n = {
						id : temData[i].docId ? temData[i].docId : temData[i].mtaTblId,
						name : temData[i].docTitle ? temData[i].docTitle : temData[i].mtaTblLnm,
						upId : temData[i].linkId,
						cnt : 0
					}
				rKeyword.push(n);
			}

			if(temData[i].keyStat == "E" && temData[i].linkId == "1"){
				rCnt1++;
			}else if(temData[i].keyStat == "E" && temData[i].linkId == "2"){
				rCnt2++;
			}else if(temData[i].keyStat == "E" && temData[i].linkId == "3"){
				rCnt3++;
			}else if(temData[i].keyStat == "E" && temData[i].linkId == "4"){
				rCnt4++;
			}else if(temData[i].keyStat == "E" && temData[i].linkId == "5"){
				rCnt5++;
			}
		}

		for (var i = 0; i < rKeyword.length; i++) {
			if(rKeyword[i].id === "1"){
				rKeyword[i].cnt = rCnt1;
			}else if(rKeyword[i].id === "2"){
				rKeyword[i].cnt = rCnt2;
			}else if(rKeyword[i].id === "3"){
				rKeyword[i].cnt = rCnt3;
			}else if(rKeyword[i].id === "4"){
				rKeyword[i].cnt = rCnt4;
			}else if(rKeyword[i].id === "5"){
				rKeyword[i].cnt = rCnt5;
			}
		}


		orgSortList.sort().forEach(function(o, i) {
			newOrgList[o] = orgList[o];
		});
		orgList = newOrgList;

		//console.log(mKeywordData);
		//console.log(rKeywordData);

		dm.control.data = {
				nodes : nodes,
				nodes1 : mKeywordData,
				nodes2 : rKeywordData
		}; // 전체 Node

		dm.control.data1 = mKeywordData;
		dm.control.data2 = rKeywordData;
		dm.control.mKeyword = mKeyword;
		dm.control.rKeyword = rKeyword;

		// 검색 직후 filteredTableArray를 nodes(전체)로 초기화
		dm.dataInfoList = {
			table1 : mKeywordData,
			table2 : rKeywordData,
			filteredTableArray1 : mKeywordData,
			filteredTableArray2 : rKeywordData,
			org : orgList,
			brm : brmList
		};

		//var tableNum = nodes.length, orgNum = Object.keys(orgList).length, brmNum = (function() {
		var tableNum1 = mKeywordData.length, tableNum2 = rKeywordData.length, orgNum = Object.keys(orgList).length, brmNum = (function() {
			var count = 0;
			brmList.forEach(function(s, i) {
				if (s.indexOf('/') == -1)
					count++;
			});
			return count;
		}());
		// 검색요약 만들기

		dm.dataInfoList.count = {
			org : orgNum,
			brm : brmNum,
			table1 : tableNum1,
			table2 : tableNum2
		};

		orgListGroupCnt("T"); // 검색기관(org) 출력하기
		brmListGroupCnt("T"); // 분류체계(brm) 출력하기

		appendBoardInfoHtml(dm.control);


		// 분류체계1 + 분류체계2 string
		function getBrmStr(brmCls1Nm, brmCls2Nm) {
			var brmStr = "";

			if(!brmCls1Nm)
				return "미분류";

			if(brmCls2Nm){
				brmStr = brmCls1Nm + "/" + brmCls2Nm;
			}else{
				brmStr = brmCls1Nm;
			}

			return brmStr;
		}

		// 분류체계1 + 분류체계2 List string
		function getBrmList(d) {
			var brmList = [], str = "";
			for (var i = 1; i <= 2; i++) {
				var brm = d['brmCls' + i + 'Nm'];
				if (brm) { // brm 존재하면
					str += (brm + '/');
					if (!findElement(brmList, str))
						brmList.push(str.slice(0,-1));
				} else {
					if (i == 1)
						brmList.push('미분류');
					break;
				}
			}
			return brmList;
		}

	}

	/**
	 * 검색어와 테이블을 화면에 그릴 수 있도록 데이터를 처리한다.
	 */
	function appendBoardInfoHtml(control) {
		$("#detail-section-1").removeClass("on");
		var appendHtml = "";
		var searchKeyword = "";
		var content = "";
		var dataLen1 = control.data1.length;
		var dataLen2 = control.data2.length;
		if(dataLen1 >= 10){
			dataLen1 = 10;
		}

		if(dataLen2 >= 10){
			dataLen2 = 10;
		}

		appendHtml +='	<div class="search-result">';
		appendHtml +='		<div class="title-area sch-word">';
		appendHtml +='			<a href="#">';
		appendHtml +='				<strong>검색어('+ control.data1.length +')</strong>';
		appendHtml +='				<span class="arr"></span>';
		appendHtml +='			</a>';
		appendHtml +='		</div>';
		appendHtml +='		<div class="cont-area">';
		if(control.data1.length != 0){
			appendHtml +='			<div class="button-group">';
			appendHtml +='				<div class="txt-box">';
			appendHtml +='					<span class="txt">'+control.mKeyword+'('+ control.data1.length +'건)</span>';
			appendHtml +='				</div>';
			//appendHtml +='				<a href="#" class="button h32 navy allDataReq">데이터 일괄다운로드</a>';
			appendHtml +='			</div>';
			appendHtml +='			<div class="result-list">';
			appendHtml +='				<ul id="srchUl">';

			for(var i=0; i<dataLen1; i++){
				//데이터 내용 길이 조정
				if(control.data1[i].content.length > 50){
					content = control.data1[i].content.substring(0, 50) + '..';
				}else{
					content = control.data1[i].content;
				}

				appendHtml +='				<li class="btn-open-detail-section" data-docId="'+ control.data1[i].id +'" data-openDataYn="'+ control.data1[i].openDataYn +'">';
				appendHtml +='					<p class="tag-area">';
				if(control.data1[i].brmCls1Nm){
					appendHtml +='						<span class="tag brown">'+ control.data1[i].brmCls1Nm +'</span>';
				}
				appendHtml +='						<span class="tag pink">'+ control.data1[i].orgNm +'</span>';
				if("Z" != control.data1[i].openDataYn && "N" != control.data1[i].openDataYn ){
					//다운로드 구분
					var dataTyStr = "";
					var apiFileTypeDetailStr = "";
					if(null != control.data1[i].dataTy && "" != control.data1[i].dataTy){
						if(control.data1[i].dataTy.trim() == "다운로드"){
							dataTyStr = "다운로드";
						}else{
							dataTyStr = "LINK";
						}
						appendHtml +='					<span class="tag green">'+ dataTyStr +'</span>';
					}
				}
				appendHtml +='					</p>';
				appendHtml +='					<dl>';
				appendHtml +='						<dt><a href="#">' + control.data1[i].name +'</a></dt>';	// 2020-08-31 : class=btn-open-detail-section 제거
				appendHtml +='						<dd title="'+control.data1[i].content+'">';
				appendHtml +='							'+ content +'';
				if("N" != control.data1[i].openDataYn){
					searchKeyword = control.data1[i].searchKeyword.slice(0, 10).join(',');
					appendHtml +='							<p class="keyword" title="'+control.data1[i].searchKeyword+'">키워드 : '+ searchKeyword +'</p>';
				}
				//appendHtml +='							<p class="keyword">키워드 : </p>';
				appendHtml +='						</dd>';
				appendHtml +='					</dl>';
				appendHtml +='				</li>';
			}
			appendHtml +='				</ul>';
			appendHtml +='			</div>';
			appendHtml +='			<div id="srchPageNum" class="pagination">';
			appendHtml +='			</div>';
		}
		appendHtml +='		</div>';

		appendHtml +='		<div class="title-area associate-word">';
		appendHtml +='			<a href="#">';
		appendHtml +='				<strong>연관검색어('+ control.data2.length +')</strong>';
		appendHtml +='				<span class="arr"></span>';
		appendHtml +='			</a>';
		appendHtml +='		</div>';
		appendHtml +='		<div class="cont-area">';
		if(control.data2.length != 0){
			appendHtml +='			<div class="button-group">';
			appendHtml +='				<div class="txt-box">';
			//appendHtml +='					<span class="txt">'+control.rKeyword+'('+ control.data2.length +'건)</span>';
			appendHtml +='					<span class="txt">'
				for(var i=0; i<control.rKeyword.length; i++){
					appendHtml +='				'+ control.rKeyword[i].name +'';
					appendHtml +='				('+ control.rKeyword[i].cnt +'건) ';
				}
			appendHtml +='					</span>';
			appendHtml +='				</div>';
			//appendHtml +='				<a href="#" class="button h32 navy allDataReq">데이터 일괄다운로드</a>';
			appendHtml +='			</div>';
			appendHtml +='			<div class="result-list">';
			appendHtml +='				<ul id="rltdUl">';

				for(var i=0; i<dataLen2; i++){
					if(control.data2[i].content.length > 50){
						content = control.data2[i].content.substring(0, 50) + '..';
					}else{
						content = control.data2[i].content;
					}

					appendHtml +='				<li class="btn-open-detail-section" data-docId="'+ control.data2[i].id +'" data-openDataYn="'+ control.data2[i].openDataYn +'">';
					appendHtml +='					<p class="tag-area">';
					if(control.data2[i].brmCls1Nm){
						appendHtml +='						<span class="tag brown">'+ control.data2[i].brmCls1Nm +'</span>';
					}
					appendHtml +='						<span class="tag pink">'+ control.data2[i].orgNm +'</span>';
					if("Z" != control.data2[i].openDataYn && "N" !=control.data2[i].openDataYn){
						//다운로드 구분
						var dataTyStr = "";
						var apiFileTypeDetailStr = "";
						if(null != control.data2[i].dataTy && "" != control.data2[i].dataTy){
							if(control.data2[i].dataTy.trim() == "다운로드"){
								dataTyStr = "다운로드";
							}else{
								dataTyStr = "LINK";
							}
							appendHtml +='					<span class="tag green">'+dataTyStr+'</span>';
						}
					}
					appendHtml +='					</p>';
					appendHtml +='					<dl>';
					appendHtml +='						<dt><a href="#">' + control.data2[i].name +'</a></dt>';	// 2020-08-31 : class=btn-open-detail-section 제거
					appendHtml +='						<dd title="'+control.data2[i].content+'">';
					appendHtml +='							'+ content +'';
					if("N" != control.data2[i].openDataYn){
						searchKeyword = control.data2[i].searchKeyword.slice(0, 10).join(',');
						appendHtml +='							<p class="keyword" title="'+control.data2[i].searchKeyword+'">키워드 : '+ searchKeyword +'</p>';
					}
					appendHtml +='						</dd>';
					appendHtml +='					</dl>';
					appendHtml +='				</li>';
				}

			appendHtml +='				</ul>';
			appendHtml +='			</div>';
			appendHtml +='			<div id="rltdPageNum" class="pagination">';
			appendHtml +='			</div>';
		}
		appendHtml +='		</div>';
		appendHtml +='	</div>';

		$("#table-Info-area").empty().html(appendHtml);

		var page_viewList1 = Paging(control.data1.length, 10, 10 ,1, "PagingView");
		$("#srchPageNum").empty().html(page_viewList1);

		var page_viewList2 = Paging(control.data2.length, 10, 10 ,1, "PagingView");
		$("#rltdPageNum").empty().html(page_viewList2);

		searchResult();

		function searchResult(){
			var schResult = $('.search-result')
				, title = schResult.find('.title-area')
				, content = schResult.find('.cont-area');

			title.each(function() {
				var trigger = $(this), answer = trigger.next('.cont-area');

				trigger.on('click', function(){
					if ( trigger.hasClass('on') ) {
						trigger.removeClass('on');
						answer.stop().slideUp(200);
					} else {
						title.not(trigger).removeClass('on');
						trigger.addClass('on');

						content.not(answer).stop().slideUp(200);
						answer.stop().slideDown(200);
					}
				});
			});
			$('.sch-word').click();
		};

		//$("#table-Info-area").show();

	}

	//paging
	Paging = function(totalCnt, dataSize, pageSize, pageNo, token) {

		//paging 영역
		totalCnt = parseInt(totalCnt);// 전체레코드수
		dataSize = parseInt(dataSize); // 페이지당 보여줄 데이타수
		pageSize = parseInt(pageSize); // 페이지 그룹 범위 1 2 3 5 6 7 8 9 10
		pageNo = parseInt(pageNo); // 현재페이지
		lastPageNum	= Math.floor((totalCnt-1)/dataSize) + 1;

		var html = new Array();
		if(totalCnt == 0){
			return "";
		}

		// 페이지 카운트
		var pageCnt = totalCnt % dataSize;
		if(pageCnt == 0){
			pageCnt = parseInt(totalCnt / dataSize);
		}else{
			pageCnt = parseInt(totalCnt / dataSize) + 1;
		}

		var pRCnt = parseInt(pageNo / pageSize);
		if(pageNo % pageSize == 0){
			pRCnt = parseInt(pageNo / pageSize) - 1;
		}

		//처음 화살표
		if(pageNo > 1){
			html.push('<a class="control first" href="javascript:void(0);" data-name="first" data-page="1">');
			html.push('first');
			html.push('</a>');
		}/*else{
			html.push('<a class="control first" href="javascript:void(0);">');
			html.push('first');
			html.push('</a>');
		}*/

		//이전 화살표
		if(pageNo > pageSize){
			var s2;
			if(pageNo % pageSize == 0){
				s2 = pageNo - pageSize;
			}else{
				s2 = pageNo - pageNo % pageSize;
			}
			html.push('<a class="control prev" href="javascript:void(0);" data-name="prev" data-page="'+s2+'">');
			html.push('prev');
			html.push("</a>");
		}/*else{
			html.push('<a class="control prev" href="javascript:void(0);">\n');
			html.push('prev');
			html.push('</a>');
		}*/

		//paging Bar
		for(var index=pRCnt * pageSize + 1;index<(pRCnt + 1)*pageSize + 1;index++){
			if(index == pageNo){
				html.push('<strong id="test" class="active">');
				html.push(index);
				html.push('</strong>');
			}else{
				html.push('<a href="javascript:void(0);" data-name="page" data-page="'+index+'">');
				html.push(index);
				html.push('</a>');
			}

			if(index == pageCnt){
				break;
			}
		}

		//다음 화살표
		if(pageCnt > (pRCnt + 1) * pageSize){
			html.push('<a class="control next" href="javascript:void(0);" data-name="next" data-page="'+((pRCnt + 1)*pageSize+1)+'">');
			html.push('next');
			html.push('</a>');
		}/*else{
			html.push('<a class="control next" href="javascript:void(0);">');
			html.push('next');
			html.push('</a>');
		}*/

		//마지막 화살표
		if(pageNo < lastPageNum){
			html.push('<a class="control last" href="javascript:void(0);" data-name="last" data-page="'+lastPageNum+'">');
			html.push('last');
			html.push('</a>');
		}/*else{
			html.push('<a class="control last" href="javascript:void(0);">');
			html.push('last');
			html.push('</a>');
		}*/


		return html.join("");

	}

	/*var goPaging_PagingView = function(cPage){

	}*/

	// 검색어 paging click
	$(document).on('click', '#srchPageNum a', function() {
		var cPage = $(this).data("page");

		boardPageingUpdate(dm.control, "srchTxt", cPage);
	});

	// 연관어 paging click
	$(document).on('click', '#rltdPageNum a', function() {
		var cPage = $(this).data("page");

		boardPageingUpdate(dm.control, "reltTxt", cPage);
	});

	function boardPageingUpdate(control, cType, cPage) {
		$("#detail-section-1").removeClass("on");
		var appendHtml = "";
		var searchKeyword = "";
		var content = "";

		var totalCnt;
		var srhCnt;

		if(cType == "srchTxt"){	//검색어

			totalCnt = control.data1.length;	//전체 데이터 수 ex:50
			srhCnt = cPage * 10;					//
			startCnt = srhCnt - 10;

			for(var i=startCnt; i<srhCnt; i++){
				if(control.data1[i]){
					if(control.data1[i].content.length > 50){
						content = control.data1[i].content.substring(0, 50) + '..';
					}else{
						content = control.data1[i].content;
					}

					appendHtml +='				<li class="btn-open-detail-section" data-docId="'+ control.data1[i].id +'" data-openDataYn="'+ control.data1[i].openDataYn +'">';
					appendHtml +='					<p class="tag-area">';
					if(control.data1[i].brmCls1Nm){
						appendHtml +='						<span class="tag brown">'+ control.data1[i].brmCls1Nm +'</span>';
					}
					appendHtml +='						<span class="tag pink">'+ control.data1[i].orgNm +'</span>';

					if("Z" != control.data1[i].openDataYn && "N" != control.data1[i].openDataYn){
						//다운로드 구분
						var dataTyStr = "";
						var apiFileTypeDetailStr = "";
						if(null != control.data1[i].dataTy && "" != control.data1[i].dataTy){
							if(-1 != control.data1[i].dataTy.trim().indexOf("OPEN") || -1 != control.data1[i].dataTy.trim().indexOf("LINK")){
								dataTyStr = "LINK";
							}else{
								dataTyStr = "다운로드";
							}
							appendHtml +='						<span class="tag green">'+dataTyStr+'</span>';
						}
					}

					appendHtml +='					</p>';
					appendHtml +='					<dl>';
					appendHtml +='						<dt><a href="#">' + control.data1[i].name +'</a></dt>';	// 2020-08-31 : class=btn-open-detail-section 제거
					appendHtml +='						<dd title="'+control.data1[i].content+'">';
					appendHtml +='							'+ content +'';
					if("N" != control.data1[i].openDataYn){
						searchKeyword = control.data1[i].searchKeyword.slice(0, 10).join(',');
						appendHtml +='							<p class="keyword" title="'+control.data1[i].searchKeyword+'">키워드 : '+ searchKeyword +'</p>';
					}
					appendHtml +='						</dd>';
					appendHtml +='					</dl>';
					appendHtml +='				</li>';
				}
			}

			$("#srchUl").empty().html(appendHtml);

			var page_viewList = Paging(control.data1.length, 10, 10, cPage, "PagingView");
			$("#srchPageNum").empty().html(page_viewList);

		}else if(cType == "reltTxt"){	// 연관어

			totalCnt = control.data2.length;	//전체 데이터 수 ex:50
			srhCnt = cPage * 10;					//
			startCnt = srhCnt - 10;

			for(var i=startCnt; i<srhCnt; i++){
				if(control.data2[i]){
					if(control.data2[i].content.length > 50){
						content = control.data2[i].content.substring(0, 50) + '..';
					}else{
						content = control.data2[i].content;
					}

					appendHtml +='				<li class="btn-open-detail-section" data-docId="'+ control.data2[i].id +'" data-openDataYn="'+ control.data2[i].openDataYn +'">';
					appendHtml +='					<p class="tag-area">';
					if(control.data2[i].brmCls1Nm){
						appendHtml +='						<span class="tag brown">'+ control.data2[i].brmCls1Nm +'</span>';
					}
					appendHtml +='						<span class="tag pink">'+ control.data2[i].orgNm +'</span>';

					if("Z" != control.data2[i].openDataYn && "N" != control.data2[i].openDataYn){	//개방예정 및 보유데이터가 아니라면
						//다운로드 구분
						var dataTyStr = "";
						var apiFileTypeDetailStr = "";
						if(null != control.data2[i].dataTy && "" != control.data2[i].dataTy){
							if(-1 != control.data2[i].dataTy.trim().indexOf("OPEN") || -1 != control.data2[i].dataTy.trim().indexOf("LINK")){
								dataTyStr = "LINK";
							}else{
								dataTyStr = "다운로드";
							}
							appendHtml +='						<span class="tag green">'+dataTyStr+'</span>';
						}
					}

					appendHtml +='					</p>';
					appendHtml +='					<dl>';
					appendHtml +='						<dt><a href="#">' + control.data2[i].name +'</a></dt>';	// 2020-08-31 : class=btn-open-detail-section 제거
					appendHtml +='						<dd title="'+control.data2[i].content+'">';
					appendHtml +='							'+ content +'';
					if("N" != control.data2[i].openDataYn){
						searchKeyword = control.data2[i].searchKeyword.slice(0, 10).join(',');
						appendHtml +='							<p class="keyword" title="'+control.data2[i].searchKeyword+'">키워드 : '+ searchKeyword +'</p>';
					}
					appendHtml +='						</dd>';
					appendHtml +='					</dl>';
					appendHtml +='				</li>';
				}
			}

			$("#rltdUl").empty().html(appendHtml);

			var page_viewList = Paging(control.data2.length, 10, 10, cPage, "PagingView");
			$("#rltdPageNum").empty().html(page_viewList);
		}
	}

	// parameter 받아오기
	if(document.location.search){	//파라미터가 존재하는 경우
		$("svg").show();	//d3 영역
		var uri = decodeURI(document.location.search);
		var param = uri.split('=')[1];
		if(null == param || "" == param){
			$('.btn-reset').hide();	//초기화
			$('.btn-move').hide();	//필터기능 안보기
			//개방데이터만 표출하도록 주석처리 2020-07-14
			//$('.open-yn').hide();	//개방여부 영역
			$('.slider-area').hide();	//데이터 연관도
			$('.chk-area.brm').hide();	//분류체계 영역
			$('.chk-area.org').hide();	//기관명 영역

			$('#tab-menu').hide();	//상단 탭메뉴
			$('#guide-Info-area2').hide();	//데이타맵 가이드정
			$('#guide-Info-area3').hide();	//확장맵 가이드정보보
			$("#allDataRadioBtn").hide();
			$('#zoomArea').hide();	//데이타맵 기능버튼
		}else{
			param = param.replace(/\+/gi, " ");
			$("#input-keyword").val(param);
			dm.srchRelationGraphMap(param, "N"); // 함수 어떻게 넘겨주기?
		}
	}else{	//파라미터가 존재하지 않는 경우
		$('.btn-reset').hide();	//초기화
		$('.btn-move').hide();	//필터기능 안보기
		//개방데이터만 표출하도록 주석처리 2020-07-14
		//$('.open-yn').hide();	//개방여부 영역
		$('.slider-area').hide();	//데이터 연관도
		$('.chk-area.brm').hide();	//분류체계 영역
		$('.chk-area.org').hide();	//기관명 영역

		$('#tab-menu').hide();	//상단 탭메뉴
		$('#guide-Info-area2').hide();	//데이타맵 가이드정
		$('#guide-Info-area3').hide();	//확장맵 가이드정보보
		$("#allDataRadioBtn").hide();
		$('#zoomArea').hide();	//데이타맵 기능버튼
	}

	/**
	 * 검색어 입력 후 검색 시
	 */
	$('#btnSearch').on('click',function(e) {
		e.preventDefault();
		$('.tab-filter li').removeClass("on");
		$('.tab-filter li').eq(0).addClass("on");	//관계도맵으로 탭적용
		//개방데이터만 표출하도록 주석처리 2020-07-14
		//$(".open-yn li").removeClass("on");
		//$(".open-yn li").eq(0).addClass("on");	//개방여부 영역 탭이동시 default 전체
		$('#all-check-brm').prop("checked", true);	//분류체계 all check true 처리
		$('#all-check-org').prop("checked", true);	//2020-07-23 기관명 all check true 처리
		_brmCls2Nm = "";							//2020-05-28 트리맵 직접 진입용 2차 분류체계 비우기
		search("r");
	});

	$("#input-keyword").keydown(function(key) {
        if (key.keyCode == 13) {
        	$('.tab-filter li').removeClass("on");
        	$('.tab-filter li').eq(0).addClass("on");	//관계도맵으로 탭적용
        	//개방데이터만 표출하도록 주석처리 2020-07-14
        	//$(".open-yn li").removeClass("on");
    		//$(".open-yn li").eq(0).addClass("on");	//개방여부 영역 탭이동시 default 전체
    		$('#all-check-brm').prop("checked", true);	//분류체계 all check true 처리
    		$('#all-check-org').prop("checked", true);	//2020-07-23 기관명 all check true 처리
    		_brmCls2Nm = "";							//2020-05-28 트리맵 직접 진입용 2차 분류체계 비우기
    		search("r");
        }
    });

	/**
	 * 검색어 명령어 호출
	 */
	function search(type){
		relWords = "";	//확장검색 비우기
		if(type == "r"){	// 관계도맵(Relationship map) 호출
			dm.srchRelationGraphMap($('#input-keyword').val(), "N");
		}else if(type == "c"){	// 확장맵(Collapsible Tree map) 호출
			dm.srchCollapsibleGraphMap($('#input-keyword').val());
		}else if(type == "b"){	// 목록정보(board info) 호출
			dm.srchBoardInfoMap($('#input-keyword').val());
		}

	}

	// 국가데이터맵 - 필터영역 보이고 안보이기
	$(document).on('click', '.map-area .filter-section .btn-move', function(){
		if( $(this).closest('.filter-section').hasClass('off') ){
			$('.filter-section .tit-area .tit').hide();	//필터 타이틀 보이기
			$('#allDataRadioBtn').css('margin-left','100px');
		}
		else {
			$('.filter-section .tit-area .tit').show(); //필터 타이틀 숨기기
			$('#allDataRadioBtn').css('margin-left','');
		}
	});

	/**
	 * 상단 탭메뉴 호출
	 */
	$('.tab-filter li').on('click',function(e) {

		//상세메뉴가 나와있는경우 제거
		ifClicked = false;
		$(this).closest('.map-area').find('.detail-section').removeClass('on');

		//분류체계 all check true 처리
		$('#all-check-brm').prop("checked", true);

		//개방여부 영역 탭이동시 default 전체
		//개방데이터만 표출하도록 주석처리 2020-07-14
		//$(".open-yn li").removeClass("on");
		//$(".open-yn li").eq(0).addClass("on");

		_brmCls2Nm = "";	//2차분류체계 전역변수 초기화

		var idx = $(this).index();
		if(idx === 0){	// 국가데이터맵 탭
			search("r");
		}else if(idx === 1){ // 확장맵 탭
			search("c");
		}else if(idx === 2){ // 목록정보 탭
			search("b")
		}else{
			//console.log("missing tab index : " + idx);
		}
	});

	// 전체화면 in/out 이벤트
	$("#zoomArea .area").on('click', function(){
		var doc = window.document;
		var docEl = document.getElementById("graph-area");

		var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			if(null != requestFullScreen){
				_simulation.stop();
				_svgWidth = Math.max($('#treemap').width(), 500);
		    	//_simulation.force("center", d3.forceCenter((_svgWidth / 2) + 400, _svgHeight / 2 - 20));
				_simulation.force("center", d3.forceCenter(_svgWidth / 2, _svgHeight / 2 - 20));
		    	_zoom.transform(_container, d3.zoomIdentity);
		    	_simulation.restart();
			}
		}else{
			if(null != requestFullScreen){
				_simulation.stop();
		    	_simulation.force("center", d3.forceCenter(_svgWidth / 2, _svgHeight / 2 - 20));
		    	_zoom.transform(_container, d3.zoomIdentity);
		    	_simulation.restart();
			}
		}
	});

	// 전체화면 esc out 이벤트
	$(document).keyup(function(e) {
		if ( e.keyCode == 27) {	//esc key 클릭 시
			var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen;
	        //var event = state ? 'FullscreenOn' : 'FullscreenOff';
	        if(!state){
	        	$("#treemap_div").attr("style", "height:800px");

	        	_simulation.stop();
	    	    _simulation.force("center", d3.forceCenter(_svgWidth / 2, _svgHeight / 2 - 20));
	    	    _zoom.transform(_container, d3.zoomIdentity);
	    	    _simulation.restart();
	        }
		}
	});

	// 국가데이터맵 - 상세영역 닫기
	$(document).on('click', '.map-area .btn-close-detail-section', function(e){
		e.preventDefault();
		$(this).closest('.map-area').find('.detail-section').removeClass('on');

		//상단 메뉴영역 확인하여 처리
		var fli = $('.tab-filter li');
		for(var i=0; i<fli.length; i++){
			var stat = fli.eq(i).hasClass("on");
			if(stat){
				if(i == 0){	//관계도맵

				}else if(i == 1){	//확장맵
					_node.filter(function (d) {
						  if(d.data.keyStat == "E"){
							  d.active = false;
						  }
						  return true;
						  });
					_node.filter(function (d) { return d.data.keyStat == "E"}).select('circle').style("fill", "#fff");
				}else if(i == 2){	//목록정보

				}
				break;
			}
		}

	});

	/**
	 * 버튼 이벤트 함수(zomm in, zoom out, init)
	 */
    d3.select("#zoomin_btn").classed("zoom in", true).on("click", function(){
    	_container.transition().call(_zoom.scaleBy, 1.2);
	});

    d3.select("#zoomout_btn").classed("zoom out", true).on("click", function(){
    	_container.transition().call(_zoom.scaleBy, 0.8);
	});

    d3.select("#init_btn").on("click", function(){
    	_svgWidth = Math.max($('#treemap').width(), 500);
    	_simulation.force("center", d3.forceCenter(_svgWidth / 2, _svgHeight / 2 - 20));
    	_zoom.transform(_container, d3.zoomIdentity);
	});

    /**
	 * 데이터 연관도 slider 이벤트 함수
	 */
    var handle = $('.custom-handle' );
    $('.data-slider').slider({
    	create: function() {
			handle.text( $( this ).slider('value') );
		},
    	range: 'min',
    	min : 1,	// 최소값 (지정하지 않으면 0)
    	max : 3,  // 최대값 (지정하지 않으면 100)
    	value : 1,  // 슬라이더 현재값 (지정하지 않으면 0)
    	step : 0.5,  // 증가하는 단계값 (지정하지 않으면 1)
    	slide : function( event, ui ){ // 슬라이더를 움직일때 실행할 코드
    		// ui.value 는 현재 슬라이더의 값
    		conditionFilter("R", ui.value);
    	}
    });

    /**
	 * 전체 데이터 연결 이벤트 함수
	 */
    d3.select("#bg_radio_on").on("click", function(){
    	_extYn = $(this).val();
    	$('#all-check-brm').prop("checked", true);	//2020-05-28 분류체크 all처리
    	dm.srchRelationGraphMap($('#input-keyword').val(), _extYn);
	});

    d3.select("#bg_radio_off").on("click", function(){
    	_extYn = $(this).val();
    	$('#all-check-brm').prop("checked", true);	//2020-05-28 분류체크 all처리
    	dm.srchRelationGraphMap($('#input-keyword').val(), _extYn);
	});

    /**
	 * 확장맵 확장기준 변경 이벤트
	 */
    $("input[name=radio_extend]").on("change", function(){
    	dm.srchCollapsibleGraphMap($('#input-keyword').val());
    });

    // 개방여부
    //개방데이터만 표출하도록 주석처리 2020-07-14
	/*$(".open-yn > ul > li > a").click(function(e){
		e.preventDefault();
		$(this).closest("li").addClass("on").siblings().removeClass("on");	//선택된 개방여부 강조

		var idx = $(this).closest("li").index();
		if(idx == 0){	//전체
			_openDataYn = "YZ";
		}else if(idx == 1){	//개방
			_openDataYn = "Y";
		}else{	//개방예정
			_openDataYn = "Z";
		}

		//상단 메뉴영역 확인하여 처리
		var fli = $('.tab-filter li');
		for(var i=0; i<fli.length; i++){
			var stat = fli.eq(i).hasClass("on");
			if(stat){
				if(i == 0){	//관계도맵
//					dm.srchRelationGraphMap($("#input-keyword").val(), "N");
					conditionFilter("R");
				}else if(i == 1){	//확장맵
					$('#all-check-brm').prop("checked", true);	//2020-05-28 분류체크 all처리
					dm.srchCollapsibleGraphMap($("#input-keyword").val());
				}else if(i == 2){	//목록정보
					$('#all-check-brm').prop("checked", true);	//2020-05-28 분류체크 all처리
					dm.srchBoardInfoMap($("#input-keyword").val());
				}
				break;
			}
		}
	});*/

    /**
	 * 목록정보 데이터 클릭 이벤트
	 */
    $(document).on("click", ".map-area .btn-open-detail-section", function(e){

    	var openYn = $(this).hasClass('on');
    	if(openYn){
    		$('.map-area .btn-open-detail-section').removeClass('on');
        	$(this).addClass('on');
    	}

		var docId = $(this).attr("data-docId");
		var openDataYn = $(this).attr("data-openDataYn");

		// 메타정보 조회
		if(openDataYn == "N"){
			dm.searchMetaInfo({
				mtaTblId : docId,
				openDataYn : openDataYn
			});
		}else{
			dm.searchMetaInfo({
				docId : docId,
				openDataYn : openDataYn
			});
		}
	});

    /**
	 * 데이터 상세 연결정보 클릭 이벤트
	 */
    $(document).on("click", "#relaDataList ul li > a", function(e){
    	e.preventDefault();

    	var docId = "";
    	var sDocId = $(this).attr("data-sdocId");
    	var tDocId = $(this).attr("data-tdocId");
    	var sSchKey, tSchKey;
    	var sTitle, tTitle;
		var sBrm, tBrm;
		var mKeyTitle, rKeyTitle1, rKeyTitle2, rKeyTitle3;

    	docId = sDocId + "," + tDocId;

    	var nodes = dm.control.data.nodes;

    	var keyWord = [];
    	nodes.forEach(function(item, idx) {
			if(item.id === "0"){
				mKeyTitle = item.title;
			}else if(item.id === "1"){
				rKeyTitle1 = item.title;
			}else if(item.id === "2"){
				rKeyTitle2 = item.title;
			}else if(item.id === "3"){
				rKeyTitle3 = item.title;
			}
		});

    	nodes.forEach(function(item, idx) {
			if(item.id == sDocId){	//시작 노드데이터
				sTitle = item.name;
				sBrm = item.brm;
				if(-1 != item.upId.indexOf("0")){
					sSchKey = mKeyTitle;
				}else if(-1 != item.upId.indexOf("1")){
					sSchKey = rKeyTitle1;
				}else if(-1 != item.upId.indexOf("2")){
					sSchKey = rKeyTitle2;
				}else if(-1 != item.upId.indexOf("3")){
					sSchKey = rKeyTitle3;
				}
			}

			if(item.id == tDocId){	//도착 노드데이터
				tTitle = item.name;
				tBrm = item.brm;
				if(-1 != item.upId.indexOf("0")){
					tSchKey = mKeyTitle;
				}else if(-1 != item.upId.indexOf("1")){
					tSchKey = rKeyTitle1;
				}else if(-1 != item.upId.indexOf("2")){
					tSchKey = rKeyTitle2;
				}else if(-1 != item.upId.indexOf("3")){
					tSchKey = rKeyTitle3;
				}
			}
		});

    	// 연결정보 조회
		dm.getConnectInfo({
			docId : docId,
			sTitle : sTitle,
			tTitle : tTitle,
			sBrm : sBrm,
			tBrm : tBrm,
			sSchKey : sSchKey,
			tSchKey : tSchKey
		});

    });

    /**
	 * 데이터 상세 관계도 확장 클릭 이벤트
	 */
    /*$("#detail-section-1 p>a").on("click", function(){
    	$('#data-relation-layer').modal({
			escapeClose: false,
			clickClose: true
		});
    });*/

    /**
	 * 확장검색 클릭 이벤트
	 */
    $(".more-search").on("click", function(){

    	var keyword = $('#input-keyword').val();

    	if("" == keyword || null == keyword || "undefiend" == keyword){
    		alert("검색어를 입력해 주세요.");
    		$('#input-keyword').focus();
    		return false;
    	}

    	// 확장검색 목록 조회
		dm.relationList({
			keyword	: keyword
		});
    });

    /**
	 * 확장검색 목록 조회
	 */
	dm.relationList = function(params) {

		loadingStart("contents");
		post(
				'/tcs/eds/ndm/relationList.do',
				params,
				{
					scb: function(result) {
						loadingStop("contents");
	            		var data = eval("("+result+")");
						var pList = data.pList;	//외부포털 목록
						var bList = data.bList;	//빅카인즈 목록
						var lList = data.lList;	//법률정보 목록
						var uList = data.uList;	//사용자로그 목록

						var appendHtml = "";

						//외부포털 목록 표출
						var pUl = $("#extend-search-layer table tbody ul").eq(0);
						pUl.empty()
						if(data.pcnt != 0){
							appendHtml = "";
							var cnt = 1;
							for(var i=0; i<pList.length; i++){
								appendHtml += '<li>';
								appendHtml += '<input type="checkbox" id="chk_'+cnt+'" name="chk_keyword" value="'+pList[i].relKwrdKoNm+'"><label for="chk_'+cnt+'">'+pList[i].relKwrdKoNm+'</label>';
								appendHtml += '</li>';
								cnt++;
								if(i == 8) break;
							}
							pUl.html(appendHtml);
						}else{
							appendHtml = "<li>연관어가 존재하지 않습니다</li>";
							pUl.html(appendHtml);
						}

						//빅카인즈 목록 표출
						var bUl = $("#extend-search-layer table tbody ul").eq(1);
						bUl.empty()
						if(data.bcnt != 0){
							appendHtml = "";
							for(var i=0; i<bList.length; i++){
								appendHtml += '<li>';
								appendHtml += '<input type="checkbox" id="chk_'+cnt+'" name="chk_keyword" value="'+bList[i].relKwrdKoNm+'"><label for="chk_'+cnt+'">'+bList[i].relKwrdKoNm+'</label>';
								appendHtml += '</li>';
								cnt++;
								if(i == 8)
									break;
							}
							bUl.html(appendHtml);
						}else{
							appendHtml = "<li>연관어가 존재하지 않습니다</li>";
							bUl.html(appendHtml);
						}

						//법률정보 목록 표출
						var lUl = $("#extend-search-layer table tbody ul").eq(2);
						lUl.empty()
						if(data.lcnt != 0){
							appendHtml = "";
							for(var i=0; i<lList.length; i++){
								appendHtml += '<li>';
								appendHtml += '<input type="checkbox" id="chk_'+cnt+'" name="chk_keyword" value="'+lList[i].relKwrdKoNm+'"><label for="chk_'+cnt+'">'+lList[i].relKwrdKoNm+'</label>';
								appendHtml += '</li>';
								cnt++;
								if(i == 8)
									break;
							}
							lUl.html(appendHtml);
						}else{
							appendHtml = "<li>연관어가 존재하지 않습니다</li>";
							lUl.html(appendHtml);
						}

						//사용자로그 목록 표출
						var uUl = $("#extend-search-layer table tbody ul").eq(3);
						uUl.empty()
						if(data.ucnt != 0){
							appendHtml = "";
							for(var i=0; i<uList.length; i++){
								appendHtml += '<li>';
								appendHtml += '<input type="checkbox" id="chk_'+cnt+'" name="chk_keyword" value="'+uList[i].relKwrdKoNm+'"><label for="chk_'+cnt+'">'+uList[i].relKwrdKoNm+'</label>';
								appendHtml += '</li>';
								cnt++;
								if(i == 8)
									break;
							}
							uUl.html(appendHtml);
						}else{
							appendHtml = "<li>연관어가 존재하지 않습니다</li>";
							uUl.html(appendHtml);
						}

						$('#extend-search-layer').modal({
				    		escapeClose: false,
				    		clickClose: true
				    	});
					},
					fcb : function(e) {
						loadingStop("contents");
					}
				});
		return false;
    }

	/**
	 * 확장검색 키워드 선택 이벤트
	 */
    $(document).on("click", "input[name=chk_keyword]", function(){
    	var chkedLen = $("input[name=chk_keyword]:checked").size();
    	if(chkedLen > 5){
    		alert("확장 검색할 키워드는 5개까지 선택 가능합니다.");
    		$(this).attr("checked", false);
    		return false;
    	}
    });

    /**
	 * 확장검색 조회 버튼 클릭 이벤트
	 */
    $("#extend-search-layer .layer-contents .button-group a").on("click", function(e){
    	e.preventDefault();
    	var chkedLen = $("input[name=chk_keyword]:checked").size();
    	var cnt = 0;

    	if(chkedLen < 1){
    		alert("확장 검색할 키워드를 선택해 주세요.");
    		return false;
    	}else{
    		$('input[name=chk_keyword]:checked').each(function() {
    			if(cnt == 0){
    				relWords = this.value;
    			}else{
    				relWords += "," + this.value;
    			}
    			cnt++;
    		});

    		dm.srchRelationGraphMap($("#input-keyword").val(), "N");
    	}
    });

    /**
	 * 데이터 일괄제공 클릭 이벤트
	 */
    $(document).on('click', '.allDataReq', function(e) {
    	e.preventDefault();

    	var metaList = dm.control.data.nodes;

    	dm.metaDataAllDownList(metaList);

    });

    /**
	 * 컬럼정보 클릭 이벤트
	 */
    $("#columnInfoOpen").on('click', function(e) {
    	e.preventDefault();

    	var mtaTblId = $(this).attr("data-mtatblid");	//메타데이터 ID
    	var prsnInfoYn = $("#label-1").val();	//개인정보여부
    	var encTrgYn = $("#label-2").val();	//암호화여부
    	var openDataYn = $("#label-3").val();	//공개비공개 여부

    	// 연결정보 조회
		dm.metaDataDetailColList({
			mtaTblId	: mtaTblId,
			prsnInfoYn	: prsnInfoYn,
			encTrgYn	: encTrgYn,
			openDataYn	: openDataYn
		});

    });

	/**
	 * 검색기관(org) 출력하기
	 */
	function orgListGroupCnt(type) {
		$('#org_jstree_div')
				.jstree("destroy")
				.jstree(makeOrgJson())
				/*
				 * .on("changed.jstree", function (e, data){
				 * 전체선택 컨트롤 if(data.action == 'deselect_node' &&
				 * $('#all-check-org').prop("checked"))
				 * $('#all-check-org').prop("checked", false);
				 * if(data.action == 'select_node' &&
				 * $(this).jstree("get_top_selected").length -
				 * $(this).jstree("get_undetermined") ==
				 * $('#orgCnt').text())
				 * $('#all-check-org').prop("checked", true);
				 *
				 * conditionFilter(); })
				 */
				.on(
						"select_node.jstree",
						function(e, data) {
							/* 전체선택 컨트롤 */
							if (e.type == 'select_node' && $(this).jstree("get_top_selected").length - $(this).jstree("get_undetermined") == dm.dataInfoList.count.org)
								$('#all-check-org').prop("checked", true);
							conditionFilter(type);
						}).on(
						"deselect_node.jstree",
						function(e, data) {
							/* 전체선택 컨트롤 */
							if (e.type == 'deselect_node' && $('#all-check-org').prop("checked"))
								$('#all-check-org').prop("checked", false);
							conditionFilter(type);
						})
				.on("hover_node.jstree", function(e, data) { // 기관별 하이라이팅 해주기
					var orgId = data.node.original.meta;
					orgFilter(orgId);
				}).on("dehover_node.jstree", function(e, data) { // 기관별 하이라이팅 해제해주기
					orgFilter('');
				})

		function orgFilter(orgId) {
			var orgCd = orgId.split('+')[0];
			var deptCd = orgId.split('+')[1];
			if (orgId) {
				$('g > circle').removeClass('select-item');
				var $o = $('g > circle[org="' + orgCd + '"]');
				$o.addClass('select-item');
			} else {
				$('g > circle').removeClass('select-item');
				$('g > circle').parent('.node').removeClass('select-item-opacity');
			}
		}
	}

	/**
	 * 분류체계(brm) 출력하기
	 */
	function brmListGroupCnt(type) {
		$('#brm_jstree_div')
				.jstree("destroy")
				.jstree(makeBrmJson())
				/*
				 * .on("changed.jstree", function (e, data) {
				 * 전체선택 컨트롤 if(data.action == 'deselect_node' &&
				 * $('#all-check-brm').prop("checked"))
				 * $('#all-check-brm').prop("checked", false);
				 * if(data.action == 'select_node' &&
				 * ($(this).jstree("get_top_selected").length -
				 * $(this).jstree("get_undetermined")) ==
				 * $('#brmCnt').text())
				 * $('#all-check-brm').prop("checked", true);
				 *
				 * conditionFilter(); })
				 */
				.on(
						"select_node.jstree",
						function(e, data) {
							/* 전체선택 컨트롤 */
							if (e.type == 'select_node' && ($(this).jstree("get_top_selected").length - $(this).jstree("get_undetermined")) == dm.dataInfoList.count.brm)
								$('#all-check-brm').prop("checked", true);
							conditionFilter(type);
						}).on(
						"deselect_node.jstree",
						function(e, data) {
							/* 전체선택 컨트롤 */
							if (e.type == 'deselect_node' && $('#all-check-brm').prop("checked")) {
								$('#all-check-brm').prop("checked", false);
							}
							conditionFilter(type);
						})
				.on("hover_node.jstree", function(e, data) { // brm별 하이라이팅 해주기
					var brmId = data.node.original.meta;
					brmFilter(brmId);
				}).on("dehover_node.jstree", function(e, data) { // 기관별 하이라이팅 해제해주기
					brmFilter(''); // 빈 문자열을 넣으면 해제
				})

		function brmFilter(brmId) { // brm 하이라이팅 하는 함수
			if (brmId) {
				$('g > circle').removeClass('select-item');
				// $('g >
				// circle').parent('.node').addClass('select-item-opacity');
				$('g > circle').each(function(i) {
					var $o = $(this);
					if ($o.attr("brm").indexOf(brmId) != -1) {
						$o.addClass('select-item');
					}
				});
			} else {
				$('g > circle').removeClass('select-item');
			}
		}
	}

	function makeOrgJson() {
		var data = [];
		for ( var org in dm.dataInfoList.org) {// 1741000+행정안전부:
												// ["범정부EA포털"]
			var tree = makeTree(org, dm.dataInfoList.org[org]);
			data.push(tree);
		}

		return makeTreeData(data);

		function makeTree(org, dep) {
			var orgName = org.split('+')[0], orgId = org
					.split('+')[1];
			var leaf = {
				"text" : orgName,
				"state" : {
					selected : true,
				},
				"meta" : orgId,
			// "children" : makeDep()
			}

			function makeDep() {
				var depChild = [], nonDeptChild = [];
				dep.forEach(function(o, i) {
					var leaf = {
						"text" : o,
						"meta" : orgId + '+' + o
					}

					if (o == "미분류") {
						nonDeptChild.push(leaf);
						return;
					}
					depChild.push(leaf);
				})
				return depChild.concat(nonDeptChild);
			}
			return leaf;
		}
	}

	function makeBrmJson() {
		var brmListMap = [];
		var data = [], nonBrmLeaf;
		dm.dataInfoList.brm.forEach(function(brm, i) {
			var tree = makeTree(brm)
			if (tree != false) {
				if (tree.text == "미분류") {
					nonBrmLeaf = tree;
					return;
				}
				data.push(tree)
			}
			;
		});
		data.push(nonBrmLeaf);

		// 2020-05-20 처리후 전역변수(2차분류체계) 비움
		// 2020-07-28 주석처리
		//_brmCls2Nm = "";

		return makeTreeData(data);

		function makeTree(brm) {
			if (brmListMap[brm])
				return false;

			brmListMap[brm] = brm;
			var parentDepth = brm.split('/').length;
			var item = brm.split('/')[parentDepth - 1];
			//2020-05-20 분류체계 구분 start
			var selectedYn = true;
			if(_brmCls2Nm != ""){
				if(item != _brmCls2Nm){	//2차분류체계 전역변수 추가 _brmCls2Nm
					$('#all-check-brm').prop("checked", false);
					selectedYn = false;
				}
			}
			//2020-05-20 분류체계 구분 end

			var leaf = {
				"text" : item,
				"meta" : brm,
				"state" : {
					//selected : true, //2020-05-20
					selected : selectedYn,
				},
				"children" : makeChild(brm),
			}
			return leaf;

			function makeChild(d) {
				var children = [];
				if (childCnt(brm) > 1) {
					dm.dataInfoList.brm
							.forEach(function(o, i) {
								var childDepth = o.split('/').length;
								if (o.indexOf(brm) != -1
										&& (parentDepth + 1) == childDepth) {
									children.push(makeTree(o));
								}
							});
				}
				return children;
			}

			function childCnt(p) {
				var num = 0;
				dm.dataInfoList.brm.forEach(function(o, i) {
					if (o.indexOf(p) != -1)
						num++;
				});
				return num;
			}
		}
	}

	function makeTreeData(data) {
		var treeJson = {
			"core" : {
				"mulitple" : true,
				"animation" : 100,
				"check_callback" : true,
				"themes" : {
					// "variant": "medium",
					"icons" : false,
					"dots" : false
				},
				"data" : data,
				expand_selected_onload : false
			},

			"checkbox" : {
				"keep_selected_style" : false,
				"three_state" : true,
				"whole_node" : true
			},

			// injecting plugins
			"plugins" : [ "checkbox", "changed", "wholerow" ]
		}
		return treeJson;
	}

	/**
	 * 분류체계 또는 기관명 all-check 선택 시 event
	 */
	$('input.all-check').change(function() {
			var $this = $(this), id = $(this).attr('id'), std = id.split('-')[2];
			$(this).prop("checked") ? $('#' + std + '_jstree_div').jstree("select_all") : $('#' + std + '_jstree_div').jstree("deselect_all");
			var fli = $('.tab-filter li');
			for(var i=0; i<fli.length; i++){
				var stat = fli.eq(i).hasClass("on");
				if(stat){
					if(i == 0){
						conditionFilter("R");
					}else if(i == 1){
						conditionFilter("C");
					}else if(i == 2){
						conditionFilter("T");
					}
					break;
				}
			}

			//
	});

	function conditionFilter(type, relationVal) {
		_brmCls2Nm = "";	// 2020-07-28 : 트리맵에서 가지고온 2차분류정보 비우기
		$("#detail-section-1").removeClass('on');	//상세페이지 닫음

		var selectedOrgArray = [], selectedBrmArray = [];
		$('#org_jstree_div').jstree("get_selected", true)
				.forEach(function(o, i) {
					selectedOrgArray.push(o.original.meta);
				});

		$('#brm_jstree_div').jstree("get_selected", true)
				.forEach(function(o, i) {
					selectedBrmArray.push(o.original.meta);
				});

		var filteredTableArray = [];
		var filteredTableArray1 = [];
		var filteredTableArray2 = [];

		if(type == "R"){	//관계도맵
			dm.dataInfoList.table.forEach(function(o, i) {
				// org와 brm에 대해서 필터 테이블리스트 만들기
				// if(selectedOrgArray.indexOf(o.orgCd+'+'+o.operDeptNm)
				// != -1 // 조건이 둘다 맞는 경우
				if(null != relationVal && "undefined" != relationVal){
					if ((selectedOrgArray.indexOf(o.orgCd) != -1 && selectedBrmArray.indexOf(o.brm) != -1) && o.nodeScore >= relationVal) {
						filteredTableArray.push(o);
					}
				}else{
					if (selectedOrgArray.indexOf(o.orgCd) != -1 && selectedBrmArray.indexOf(o.brm) != -1) {
						filteredTableArray.push(o);
					}
				}
			});
			dm.dataInfoList.filteredTableArray = filteredTableArray;
		}else if(type == "C"){	//확장맵
			dm.dataInfoList.table.forEach(function(o, i) {

				if (o.keyStat == "E"){
					if (selectedOrgArray.indexOf(o.orgCd) != -1 && selectedBrmArray.indexOf(o.brm) != -1) {
						filteredTableArray.push(o);
					}
				}else{
					filteredTableArray.push(o);
				}
			});
			dm.dataInfoList.filteredTableArray = filteredTableArray;
		}else if(type == "T"){
			dm.dataInfoList.table1.forEach(function(o, i) {	//검색어
				// org와 brm에 대해서 필터 테이블리스트 만들기
				// if(selectedOrgArray.indexOf(o.orgCd+'+'+o.operDeptNm)
				// != -1 // 조건이 둘다 맞는 경우
				if (o.id != "top"){
					if (selectedOrgArray.indexOf(o.orgCd) != -1 && selectedBrmArray.indexOf(o.brm) != -1) {
						filteredTableArray1.push(o);
					}
				}else{
					filteredTableArray1.push(o);
				}
			});
			dm.dataInfoList.filteredTableArray1 = filteredTableArray1;

			dm.dataInfoList.table2.forEach(function(o, i) {	//검색어
				// org와 brm에 대해서 필터 테이블리스트 만들기
				// if(selectedOrgArray.indexOf(o.orgCd+'+'+o.operDeptNm)
				// != -1 // 조건이 둘다 맞는 경우
				if (o.id != "top"){
					if (selectedOrgArray.indexOf(o.orgCd) != -1 && selectedBrmArray.indexOf(o.brm) != -1) {
						filteredTableArray2.push(o);
					}
				}else{
					filteredTableArray2.push(o);
				}
			});
			dm.dataInfoList.filteredTableArray2 = filteredTableArray2;
		}


		//makeFilteredData(dm.control, type);
		makeFilteredData(type);

	}

	/**
	 * 노드 선택 필터 필터 조건
	 * 1. 선택한 노드와 연결된 노드는 모두 보여야 한다.
	 * 2. 노드(테이블 노드)를 선택하였을때 키워드가 연결된 것이 보여야 한다.
	 * 3. 선택된 노드가 없으면 조회된 모든 노드가 보이지는 것이 아닌 키워드와 연결된 테이블 노드만 보여야 한다.( 초기 조회 환경 )
	 */
	//function makeFilteredData(control, type) {
	function makeFilteredData(type) {
		// we'll keep only the data where filterned nodes are the source or target
		var newNodes = [], newLinks = [];
		var resultNodes = [];
		var qActive, wActive1, wActive2, wActive3, wActive4, wActive5;
		var relCountQ = 0, relCountW1 = 0, relCountW2 = 0, relCountW3 = 0, relCountW4 = 0, relCountW5 = 0;

		if(type == "R"){ //관계도맵

			for (var i = 0; i < dm.control.data.nodes.length; i++) {
				var node = dm.control.data.nodes[i];
				if("0" == node.id && true == node.active){
					qActive = true;
				}else if("1" == node.id && true == node.active){
					wActive1 = true;
				}else if("2" == node.id && true == node.active){
					wActive2 = true;
				}else if("3" == node.id && true == node.active){
					wActive3 = true;
				}
			}

			//데이터 세팅
			for (var i = 0; i < dm.control.data.nodes.length; i++) {
				var node = dm.control.data.nodes[i];

				//분류체계 및 기업 체크여부 필터조건에 맞는 노드를 제외
				if (isFTAElement(node)){
					if(null == _openDataYn || "YZ" == _openDataYn){	// 전체데이터 조회
						if("E" == node.keyStat){
							if(-1 != node.upId.indexOf("0")){	//검색어관련 표출중인 count 계산
								relCountQ++;
								if(true == qActive)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("1")){	//연관어1관련 표출중인 count 계산
								relCountW1++;
								if(true == wActive1)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("2")){	//연관어2관련 표출중인 count 계산
								relCountW2++;
								if(true == wActive2)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("3")){	//연관어3관련 표출중인 count 계산
								relCountW3++;
								if(true == wActive3)
									node.active =true;
							}
						}else{
							node.active =false;
						}
						newNodes.push(node);
					}else if("Y" == _openDataYn){	// 개방데이터만 조회
						if("E" == node.keyStat && "Y" == node.openDataYn){
							if(-1 != node.upId.indexOf("0")){	//검색어관련 표출중인 count 계산
								relCountQ++;
								if(true == qActive)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("1")){	//연관어1관련 표출중인 count 계산
								relCountW1++;
								if(true == wActive1)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("2")){	//연관어2관련 표출중인 count 계산
								relCountW2++;
								if(true == wActive2)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("3")){	//연관어3관련 표출중인 count 계산
								relCountW3++;
								if(true == wActive3)
									node.active =true;
							}
							newNodes.push(node);
						}
//						newNodes.push(node);
					}else if("Z" == _openDataYn){	// 개방예정데이터만 조회
						if("E" == node.keyStat && "Z" == node.openDataYn){
							if(-1 != node.upId.indexOf("0")){	//검색어관련 표출중인 count 계산
								relCountQ++;
								if(true == qActive)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("1")){	//연관어1관련 표출중인 count 계산
								relCountW1++;
								if(true == wActive1)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("2")){	//연관어2관련 표출중인 count 계산
								relCountW2++;
								if(true == wActive2)
									node.active =true;
							}
							if(-1 != node.upId.indexOf("3")){	//연관어3관련 표출중인 count 계산
								relCountW3++;
								if(true == wActive3)
									node.active =true;
							}
							newNodes.push(node);
						}
//						newNodes.push(node);
					}
				}else{
					//검색어와 연관검색어는 노드에 추가
					if(node.keyStat === "Q" || node.keyStat === "W"){
						newNodes.push(node);
					}
				}
			}

			//검색어관련 표출중인 count 저장
			for (var i = 0; i < newNodes.length; i++) {
				if("Q" == newNodes[i].keyStat && "0" == newNodes[i].id){	//검색어
					newNodes[i].relCount = relCountQ;
				}
				if("W" == newNodes[i].keyStat){
					if("1" == newNodes[i].id){	//연관어1
						newNodes[i].relCount = relCountW1;
					}else if("2" == newNodes[i].id){	//연관어2
						newNodes[i].relCount = relCountW2;
					}else if("3" == newNodes[i].id){	//연관어3
						newNodes[i].relCount = relCountW3;
					}
				}
			}

			for (var i = 0; i < dm.control.data.links.length; i++) {
				var link = dm.control.data.links[i];
//				if (newNodes.indexOf(link.source) != -1 && newNodes.indexOf(link.target) != -1) // 둘다 선택된 테이블일 때
//					newLinks.push(link);
				if(_extYn == "Y"){
					if (newNodes.indexOf(link.source) != -1 && newNodes.indexOf(link.target) != -1) // 둘다 선택된 테이블일 때
						newLinks.push(link);
				}else{

					for (var j = 0; j < newNodes.length; j++) {
						if(newNodes[j].id == link.docId){
							if(newNodes[j].active == true){
								link.active = true;
								newLinks.push(link);
							}else{
								link.active = false;
								newLinks.push(link);
							}
//							newLinks.push(link);
						}
					}
				}
			}

			dm.control.links = newLinks;
			dm.control.nodes = newNodes;

			drawRelationSvgArea(dm.control);
		}else if(type == "C"){ //확장맵
			// 자식값이 존재하면 제거 처리
			if(dm.control.data.nodes[0].children){
				dm.control.data.nodes.forEach(function(d) {
					if(d.children){
						delete d.children
					}
				});
			}

			// 검색어 연관어 count 계산 처리
			var nodeQupR = [];
			var nodeWId = [], nodeRId1 = [], nodeRId2 = [], nodeRId3 = [];
			for (var i = 0; i < dm.control.data.nodes.length; i++) {
				var node = dm.control.data.nodes[i];
				if("R" == node.keyStat && "0" == node.upId){	//검색어를 바라보는 기업/분류
					nodeQupR.push(node.id);
				}

				if("W" == node.keyStat){	//연관어 id 추출
					nodeWId.push(node.id);
				}
			}

			for (var i = 0; i < dm.control.data.nodes.length; i++) {	//연관어를 바라보는 기업/분류
				var node = dm.control.data.nodes[i];
				if("R" == node.keyStat && -1 != node.upId.indexOf(nodeWId[0])){
					nodeRId1.push(node.id);
				}
				if("R" == node.keyStat && -1 != node.upId.indexOf(nodeWId[1])){
					nodeRId2.push(node.id);
				}
				if("R" == node.keyStat && -1 != node.upId.indexOf(nodeWId[2])){
					nodeRId3.push(node.id);
				}
			}

			for (var i = 0; i < dm.control.data.nodes.length; i++) {
				var node = dm.control.data.nodes[i];

				if (isFTAElement(node)) {
					if("E" == node.keyStat){
						if(-1 != nodeQupR.indexOf(node.upId)){	//검색어관련 표출중인 count 계산
							relCountQ++;
						}
						if(-1 != nodeRId1.indexOf(node.upId)){	//연관어1관련 표출중인 count 계산
							relCountW1++;
						}
						if(-1 != nodeRId2.indexOf(node.upId)){	//연관어2관련 표출중인 count 계산
							relCountW2++;
						}
						if(-1 != nodeRId3.indexOf(node.upId)){	//연관어3관련 표출중인 count 계산
							relCountW3++;
						}
					}
					newNodes.push(node);
				}
			}

			//검색어관련 표출중인 count 저장
			for (var i = 0; i < newNodes.length; i++) {
				if("Q" == newNodes[i].keyStat){	//검색어
					newNodes[i].relCount = relCountQ;
				}
				if("W" == newNodes[i].keyStat){
					if(nodeWId[0] == newNodes[i].id){	//연관어1
						newNodes[i].relCount = relCountW1;
					}else if(nodeWId[1] == newNodes[i].id){	//연관어2
						newNodes[i].relCount = relCountW2;
					}else if(nodeWId[2] == newNodes[i].id){	//연관어3
						newNodes[i].relCount = relCountW3;
					}
				}
			}

			// 확정형 데이터맵에 맞추어 데이터 제가공
			resultNodes = extractData(newNodes);

			dm.control.nodes = resultNodes[0];

			drawCollapsibleSvgArea(dm.control);

		}else if(type == "T"){ //목록정보
			var newNodes1 = [], newNodes2 = [];

			for (var i = 0; i < dm.control.data.nodes1.length; i++) { //검색어
				var node = dm.control.data.nodes1[i];
				//분류체계 및 기업 체크여부 필터조건에 맞는 노드를 제외
				if (isFTAElement1(node)){
					newNodes1.push(node);
				}
			}

			function isFTAElement1(node) {
				for (var i = 0; i < dm.dataInfoList.filteredTableArray1.length; i++) {
					var o = dm.dataInfoList.filteredTableArray1[i];
					if (o.id === node.id)
						return true;
				}
				return false;
			}

			for (var i = 0; i < dm.control.data.nodes2.length; i++) { //연관검색어
				var node = dm.control.data.nodes2[i];

				//분류체계 및 기업 체크여부 필터조건에 맞는 노드를 제외
				if (isFTAElement2(node)){
					newNodes2.push(node);
				}
			}

			function isFTAElement2(node) {
				for (var i = 0; i < dm.dataInfoList.filteredTableArray2.length; i++) {
					var o = dm.dataInfoList.filteredTableArray2[i];
					if (o.id === node.id)
						return true;
				}
				return false;
			}

			dm.control.data1 = newNodes1;
			dm.control.data2 = newNodes2;

			appendBoardInfoHtml(dm.control);
		}

		function isFTAElement(node) {
			for (var i = 0; i < dm.dataInfoList.filteredTableArray.length; i++) {
				var o = dm.dataInfoList.filteredTableArray[i];
				if (o.id === node.id)
					return true;
			}
			return false;
		}

		function extractData(newNodes){
			var treeData = [];

			var dataMap = newNodes.reduce(function(map, node) {
				map[node.id] = node;
				return map;
			}, {});

			newNodes.forEach(function(node) {
				// add to parent
				var parent = dataMap[node.upId];
				if (parent) {
					// create child array if it doesn't exist
					(parent.children || (parent.children = []))
						// add node to child array
						.push(node);
				} else {
					// parent is null or missing
					treeData.push(node);
				}
			});

			return treeData;

		}
	}

	function findElement(l, o) {
		return l.indexOf(o) == -1 ? false : true;
	}



	var main_tree_map = (function () {

		var tree_data = null;
		var showing_keyword = false;
		var last_data = null;
		var last_opt = null;

		function numberWithCommas(x) {
			return x.toString().replace(
					/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		var line_color = "rgb(128,128,128)";

        $('#treemap').css('background-color', 'white');
        var el_treemap = $('#treemap').get(0);

        function go_search(keyword) {
            $('#input-keyword').val(keyword);
            search("r");
        }

        function clear_treemap() {
            $('svg').empty();
            $('.treemap-tooltip').remove();
        }

        function draw_treemap(data, no_autosum) {
            clear_treemap();

            if(data) {
            	last_data = data;
            	last_opt = no_autosum ? true : false;
            } else {
            	data = last_data;
            	no_autosum = last_opt;
            }

            $('#btn-treemap-back').toggle(showing_keyword);

            var tr_root = d3.hierarchy(data);
            tr_root
                .sum(function (d) {
                    return d.value;
                })
                .sort(function (a, b) {
                    return b.height - a.height || b.value - a.value;
                });

            var tr_width = el_treemap.clientWidth,
            	tr_height = el_treemap.clientHeight;

            var treemap = d3.treemap()
                .size([tr_width, tr_height])
                .padding(1)
                .round(true);

            treemap(tr_root);

            var g = d3.select(el_treemap)
                .selectAll(".node")
                .data(tr_root.descendants())
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x0 + "," + (d.y0) + ")";
                });

           	var min_alpha = 0.3;

            g.filter(function (d) {
                return d.depth == 1;
            }).append("rect")
                .attr("width", function (d) {
                    return d.x1 - d.x0;
                })
                .attr("height", function (d) {
                    return d.y1 - d.y0;
                })
                .attr("fill", function (d, i) {
                	if(showing_keyword) {
                		return treeColorSet[d.data.colorIdx];
                	} else {
                		var colorIdx = i % treeColorSet.length;
                    	d.colorIdx = colorIdx;
                    	treeBrmColors[d.data.name] = colorIdx;
                        return treeColorSet[colorIdx];
                	}
                })
                .attr("opacity", function(d, i) {
                	if(showing_keyword) {
                		var d_alpha = ((tr_root.children.length - i) / (tr_root.children.length / (1.0 - min_alpha))) + min_alpha;
                		return d_alpha;
                	} else {
                		return 1.0
                	}
                });

            if(showing_keyword) {
                g.filter(function(d) {
                    return d.depth == 1;
                }).selectAll('rect')
                .on("click", function(d) {
                    var click_keyword = d.data.name;
                    go_search(click_keyword);
                });
            }

            //var tooltip = d3.select(".map_right")
            //var tooltip = d3.select(".graph-area")
            //var tooltip = d3.select(".graph-section")
            var tooltip = d3.select(".container")
                .append("div")
                .attr("class", "treemap-tooltip")
                .style("background", "#575757")
                .style("padding", "3px")
                .style("pointer-events", "none")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("z-index", "100")
                .style("font-size", "18px")
                .style("color", "white")
                .text("");

            g.filter(function (d) {
                return d.depth > 1;
            }).append("rect")
                .attr("width", function (d) {
                    return d.x1 - d.x0;
                })
                .attr("height", function (d) {
                    return d.y1 - d.y0;
                })
                .style("fill-opacity", 0)
                .attr("stroke-width", 3)
                .attr("stroke", 'white')
                .attr("stroke-opacity", 0.1)
                .attr("class", "treemap-rect-2")
                .on("mouseover", function (d, i) {
                    // d3.select(this)
                    //     .attr('stroke', 'rgb(255,0,0)');
                    var x_offset = $('#treemap').offset().left;
                    var y_offset = $('#treemap').offset().top;
                    return tooltip
                    	//.style("left", d.x0 + x_offset + 2 + "px")
                    	//.style("left", d.x0 + 2 + "px")
                    	.style("left", d.x0 + x_offset + "px")
                    	//.style("top", d.y0 + 270 + 2 + "px")
                    	.style("top", d.y0 + y_offset + "px")
                        .text((d.data.name ? d.data.name : "미분류") + " : " + numberWithCommas(d.data.value))
                        .style("visibility", "visible");
                })
                .on("mouseout", function (d) {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", function (d) {
                	$(".treemap-tooltip").hide();
                	var jsonNodes = $('#tree_jstree_div').jstree(true).get_json('#', { flat: true });
                	jsonNodes.forEach(function(o, i){
                		var node = $('#tree_jstree_div').jstree('get_node', o.id);
                		if(node.parent != '#' &&  node.original.parent == d.parent.data.name && (d.data.name ? node.text == d.data.name : node.text == '미분류')){
            				$('#tree_jstree_div').jstree('open_node', node.parent);
            				$('#tree_jstree_div').jstree('deselect_all');
            				$('#tree_jstree_div').jstree('select_node', node.id);
                		}
                	})
                })

            var svg = d3.select("svg");
            var maxPer;

            g.filter(function (d) {
                return d.depth == 1;
            }).each(function (d, i) {
            	var per = no_autosum ? d.value : (d.value / tr_root.value * 100).toFixed(1);
            	var font_size = Math.min(((d.x1 - d.x0) + (d.y1 - d.y0)) /12, (d.y1 - d.y0)/2);

            	var lenLimit = Math.floor((d.x1 - d.x0)/font_size);
            	var nameLen = d.data.name.length;
            	var forCnt = Math.ceil((nameLen/lenLimit));
            	var name = d.data.name;
            	var nameArray = [];

            	if(lenLimit < nameLen){
            		var startIdx = 0;
	            	var endIdx = lenLimit;
	            	for(var j=0; j<forCnt; j++){
	            		nameArray.push(name.substring(startIdx, endIdx));
	            		startIdx = startIdx + endIdx;
	            		endIdx = endIdx + lenLimit;
	            	}
            	}

            	var d_alpha = ((tr_root.children.length - i) / (tr_root.children.length / (1.0 - min_alpha))) + min_alpha;
            	var alpha = 1 - d_alpha;

            	svg.append("text")
            	   .attr("id", "t"+i)
                   .attr("text-anchor", "start")
                   .attr("x", d.x0 + 3)
                   .attr("y", d.y0 + 6)
                   .attr("dy", "0.8em");
                   //.style("fill", "rgba(41, 41, 41, 0.75)")

            	if(0 == nameArray.length){	//자르지 않은 분류명
            		d3.select("#t"+i)
                      .append("tspan")
                      .attr("x", d.x0 + 3)
                      .attr("dy", "0.8em")
                      .attr("font-size", font_size + "px")
                      .attr("class", "node-label")
                      .attr("fill", (true == no_autosum && d_alpha < 0.6) ? "#000000" : "#ffffff")
                      .attr("opacity", (true == no_autosum && d_alpha < 0.6) ? alpha : 1)
                      .style("font-weight", "600")
                      .style("white-space", "normal")
                      .text(d.data.name);
            	}else{
            		nameArray.forEach(function(item, idx) {	//자른 분류명
            			if(0 != item.length){	//문자열이 존재하면
            			d3.select("#t"+i)
                          .append("tspan")
                          .attr("x", d.x0 + 3)
                          .attr("dy", idx == 0 ? "0.8em" : "1em")
                          .attr("font-size", font_size + "px")
                          .attr("class", "node-label")
                          .attr("fill", (true == no_autosum && d_alpha < 0.6) ? "#000000" : "#ffffff")
                          .attr("opacity", (true == no_autosum && d_alpha < 0.6) ? alpha : 1)
                          .style("font-weight", "600")
                          .style("white-space", "normal")
                          .text(item);
            			}
					});
            	}

            	var font_size2 = ((d.x1 - d.x0) + (d.y1 - d.y0)) /13;
            	d3.select("#t"+i)
                  .append("tspan")
                  .attr("x", d.x0 + 3)
                  .attr("dy", "1em")
                  .attr("font-size", font_size2 + "px")
                  .attr("text-anghor", "end")
                  .attr("class", "node-label")
                  .attr("fill", (true == no_autosum && d_alpha < 0.6) ? "#000000" : "#ffffff")
                  .attr("opacity", (true == no_autosum && d_alpha < 0.6) ? alpha : 1)
                  .text(per + '%');

            	/*var per = no_autosum ? d.value : (d.value / tr_root.value * 100).toFixed(1);
            	var font_size = Math.min(get_font_size(d.x1 - d.x0, d.y1 - d.y0, d.data.name.length), (d.y1 - d.y0)/2);

                svg.append("text")
                    .attr("text-anchor", "start")
                    .attr("x", d.x0 + 3)
                    //.attr("y", d.y0 + 3)
                    .attr("y", d.y0 + 9)
                    .attr("dy", ".8em")
                    .attr("font-size", font_size + "px")
                    .attr("text-anghor", "start")
                    .attr("class", "node-label")
                    //.style("fill", "rgba(41, 41, 41, 0.75)")
                    .attr("fill", "#ffffff")
                    .style("font-weight", "600")
                    .text(d.data.name);

                var per_size = Math.min(get_font_size(d.x1 - d.x0, d.y1 - d.y0, 5), font_size);
                svg.append("text")
                    .attr("text-anchor", "start")
                    .attr("x", d.x0 + 3)
                    .attr("y", d.y0 + font_size + (per_size - 3 < 0 ? 1 : (per_size - 3)) + 2)
                    .attr("font-size", per_size - 3 < 0 ? 1 : (per_size - 3) + "px")
                    .attr("text-anghor", "end")
                    .attr("class", "node-label")
                    //.style("fill", "rgba(41, 41, 41, 0.75)")
                    .attr("fill", "#ffffff")
                    .style("font-weight", "600")
                    //.text(numberWithCommas(d.value));
                    .text(per + '%');*/
            })
        }

        function get_font_size(w, h, n) {
            var s = n > 0 ? (w / n) * 0.8 : 0;
            var font_size = showing_keyword ? (s > 45 ? 45 : s) : (s > 90 ? 90 : s);

            if(font_size > h * 0.9) font_size = h * 0.9;
            return font_size;
        }

        function draw_main_treemap() {		// 분류체계 초기조회
            showing_keyword = false;
            loadingStart("contents");


			var result = treemapListData;			

    		loadingStop("contents");
    		var data = result;

    		var brm_list = data.resultMsg;	// to-be
    		brm_list.sort();
    		var brm_data = {};
            for(var i=0; i<brm_list.length; i++) {
                var o = brm_list[i];	// to-be
                var brm1 = o.brmCls1Nm, brm2 = o.brmCls2Nm, v = Number(o.count); // to-be
                var child_obj = {name: brm2, value: v};
                if (brm1 in brm_data) {
                    brm_data[brm1]['children'].push(child_obj)
                } else {
                    brm_data[brm1] = {name: brm1, children: [child_obj]}
                }
            }
            console.log(brm_data);
            tree_data = Object.keys(brm_data).map(function(e) { return brm_data[e]; });
            console.log(tree_data);
            // 중앙의 차트를 구현
            draw_treemap({name: "treemap", children: tree_data});
			// 사이드의 트리맵을 구현
            draw_treenavi(tree_data);
        }

        function draw_keyword_treemap(b1, b2) {	// 분류체계 상세조회
        	showing_keyword = true;
        	colorIdx = treeBrmColors[b1];
        	if('' == b2 || null == b2) b2 = '미분류';
        	loadingStart("contents");
        	post('/els/treemapDetail.do', {"brmCls1Nm":b1, "brmCls2Nm":b2, "dataSe":"O", "apiPath":"treemapDetail", "size":"200"}, { // to-be... 보여지는 그리드가 너무 이상해서 size=200 박혀있음.
        		scb: function(result) {
        			loadingStop("contents");
        			var data = eval("("+result+")");
        			var keyword_list = data.resultMsg.slice(0, 40);
        			var out_list = [];
        	        for(var i=0; i<keyword_list.length; i++) {
        	        	var o = keyword_list[i];
        	            out_list.push({
        	                name: o.keyword,
        	                value: Number(o.percentage),
        	                cnt: Number(o.count),
        	                colorIdx: colorIdx
        	            });
        	        }

                    _brmCls2Nm = b2; //2020-05-20 2차 분류체계 전역변수에 저장
        	        draw_treemap({name: "treemap", children: out_list}, true);
					keywordParams = {
						b1: b1,
						b2: b2
					};
        	        /*history.pushState(null, null, location.href);
        	        window.onpopstate = function() {
        	        	history.go(1);
						draw_main_treemap();
					}*/
        		},
        		fcb:function(e) {
        			loadingStop("contents");
        		}
        	});
        }

        $('#btn-treemap-back').click(draw_main_treemap);

        draw_main_treemap();

        $(window).resize(function() {
        	//if ($('#treemap_div').is(':visible')) {
        	if ($('#guide-Info-area1').is(':visible')) {
        		draw_treemap();
        	}
        });

      	//첫화면으로 이동
	  	$('#btn_datamap_main').click(function() {
	    	if($('#treemap_div').css('display') == 'none'){
	    		$('.map_num').hide();
	    		$('.map_tree').hide();
	    		$('.map_show').hide();
	    		$('#map_div svg').empty();

	    		$('#treemap_div').show();
	    		draw_treemap();
	    		$('.map_tree.t').show();
	    		$('#input-keyword').val('');
	    	}
	    	else{
	    		location.reload();
	    	}
	   	});

        return {
        	tree_data: tree_data,
        	showing_keyword: showing_keyword,
        	draw_keyword_treemap: draw_keyword_treemap
        }
    })();

	function click_on_brm(brm1, brm2) {
		main_tree_map.draw_keyword_treemap(brm1, brm2);
	}

	function draw_treenavi(tree_data){
		var treenavi_data = makeTreeData(tree_data);
		var treedata = treenavi_data.core.data;

		for(var i=0; i<treedata.length; i++){
			treedata[i].text = '';
			treedata[i].text = treedata[i].name;
			for(var j=0; j<treedata[i].children.length; j++){
				treedata[i].children[j].text = '';
				treedata[i].children[j].parent = treedata[i].text;
				treedata[i].children[j].text = treedata[i].children[j].name ? treedata[i].children[j].name : '미분류';
			}
		}

		treenavi_data.plugins.splice(0, 1);

		$('#tree_jstree_div')
		.jstree("destroy")
		.jstree(treenavi_data)
		.on("select_node.jstree", function(e, data){
			if (data.node.children.length > 0) { // parent일 때는 open close만
				// 하위메뉴의 opened 여부로 데이터 표출 수정 : 2020-07-27 HHS
				if(data.node.state.opened){ // 하위메뉴가 열려있다면
					$('#tree_jstree_div').jstree(true).toggle_node(data.node);
				}else{
					$('#tree_jstree_div').jstree('close_all'); //tree 모두 닫기
					$('#tree_jstree_div').jstree(true).toggle_node(data.node);
				}
                //$('#tree_jstree_div').jstree(true).deselect_node(data.node);
                //$('#tree_jstree_div').jstree(true).toggle_node(data.node);
            }else{
            	var brm1 = data.node.original.parent;
            	var brm2 = data.node.original.name;
            	click_on_brm(brm1, brm2);
            }
		});
	}

	function makeTreeData(data) {
		var treeJson = {
			"core" : {
				"mulitple" : true,
				"animation" : 100,
				"check_callback" : true,
				"themes" : {
					// "variant": "medium",
					"icons" : false,
					"dots" : false
				},
				"data" : data,
				expand_selected_onload : false
			},

			"checkbox" : {
				"keep_selected_style" : false,
				"three_state" : true,
				"whole_node" : true
			},

			// injecting plugins
			"plugins" : [ "checkbox", "changed", "wholerow" ]
		}
		return treeJson;
	}

	/**
	 * 검색어 입력에 대한 자동완성 호출
	 */
	$('#input-keyword').keyup(function(e) {
		var $keyword = $(this).val();
		switch (e.which) {
		case 13: // enter
		case 27: // ESC
			if (dm.autoCompReq) {
				dm.autoCompReq.abort();
				dm.autoCompReq = null;
			}
			$('.auto-keyword-list').hide();
			break;
		case 37: // left
		case 39: // right
			break;
		case 38: // up
		case 40: // down
			if ($('.auto-keyword-list').css('display') == 'none') // 자동완성 리스트가 안보일 때 return
				return;
			var idx = 0;
			$('#keyword-list li').each(function(i, o) {
				if ($(o).hasClass('kc')) {
					idx = i + 1;
					$(o).removeClass('kc');
				}
			});

			e.which == 38 ? idx-- : idx++;
			if ($('#keyword-list li').length < idx) {
				idx = 1;
			} else if (idx <= 0) {
				idx = $('#keyword-list li').length;
			}
			// 스크롤 위치 변경
			$('#keyword-list').scrollTop(0);
			$('#keyword-list').scrollTop(0.55 + (idx - 1) * 40); // 스크롤 방식 변경

			// focus 및 데이터 표시
			$('#keyword-list li:nth-child('+ idx + ')').addClass('kc'); // 선택 표시
			$('#input-keyword').val($('#keyword-list li:nth-child('+ idx+ ')').data().keyword);
			break;
		default:
			if ($keyword.length > 0) {
				dm.getAutoComplate($keyword);
			} else {
				$('.auto-keyword-list').hide();
			}
			break;
		}
	});

	var clickScroll = false;
	/**
	 * 자동 완성 숨기기
	 */
	$('#input-keyword').on('blur',function(e) {
		if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) { // IE일때...
			if(clickScroll) {
				$('.auto-keyword-list').show();
			}else{
				$('.auto-keyword-list').hide();
			}
			clickScroll = false;
			$('.auto-keyword-list').focus();
		} else
			$('.auto-keyword-list').hide();
	});

	/**
	 * 자동완성 항목 선택 + 마지막 글자 나오는 버그 수정
	 */
	$('#keyword-list').on('mousedown', function(e) { // scrollBar 클릭했을 때
		clickScroll = true; // ***
	});

	$('#keyword-list').on('mouseup click', 'li', function(e) {
		$('#input-keyword').val('').val($(this).data().keyword);
		if (e.type == 'click') {
			$('.auto-keyword-list').hide();
		} else {
			return false;
		}
	});

	/**
	 * mouse hover만 표시가 되어야 하므로 키보드 커서로 Class 준 것을 제거
	 */
	$('#keyword-list').on('mousemove', 'li', function(e) {
		$('#input-keyword').val('').val($(this).data().keyword);
		$('#keyword-list li.kc').removeClass('kc');
	});

	/**
	 * 자동완성 조회
	 */
	dm.getAutoComplate = function(keyword) {
		if (dm.autoCompReq) {
			dm.autoCompReq.abort();
			dm.autoCompReq = null;
		}

		var keyword = $('#input-keyword').val();			// 검색어
		//var openDataYn = $(".search-area select").val();	// YZ : 개방목록, N : 보유목록
		var openDataYn = "YZ";	// YZ : 개방목록, N : 보유목록

//		dm.autoCompReq = post('/tcs/eds/ndm/autoCompleteWord.do', {
//			keyword : keyword,
//			openDataYn : openDataYn
//
//		}, {
//			scb: function(result) {
//				var data = eval("("+result+")");
//				$('.auto-keyword-list').show();
//				$('#keyword-list').scrollTop(0); // 새로 검색할 때
//													// scroll
//													// 올려주기
//				if (dm.callbackAutoComplate) {
//					dm.callbackAutoComplate(data.resultMsg);
//				}
//			},
//			fcb : function(e) {
//			}
//		}, "N");
	}

	/**
	 * 자동완성 Callback
	 */
	dm.callbackAutoComplate = function(info) {

		dm.autoCompReq = null;
		var $ul = $('#keyword-list');
		$ul.empty();

		var items = info;
		if(items){
			items.forEach(function(o) {
				var $li = $('<li>').data({keyword : o['text']});
				var $btn = $('<button>').html(o['text']).appendTo($li);
				$li.appendTo($ul);
			});
		}else{
			$('.auto-keyword-list').hide(); // 0개일 경우 div 숨기기
		}
	}

	/**
	 * 메타정보 조회
	 */
	dm.searchMetaInfo = function(params) {

		loadingStart("contents");
		post('/tcs/eds/ndm/metaDataDetail.do', params, {
			scb: function(result) {
				var data = eval("("+result+")");
				if (dm.callbackMetaInfo) {
					dm.callbackMetaInfo(data ? data : {
						message : '조회된 메타정보가 없습니다.'
					});
				}
				loadingStop("contents");
			},
			fcb : function(e) {
				loadingStop("contents");
			}
		});

	}

	/**
	 * 메타정보 Callback
	 */
	dm.callbackMetaInfo = function(info) {

		//console.log(info);

		var $table;
		var meta;
		var docIdStrArray = "";
		var openHoldColListArray = "";

		meta = info.resultMsg[0];

		if(meta.openDataYn == "Z"){	//개방 예정 데이터
			var $table = $('#detail-section-1 .row-table table').eq(0);
			var $td = $table.find('td');

			//분류체계명 가공
			var brmStr = "";
			var brmCls1Nm = meta.brmCls1Nm;
			var brmCls2Nm = meta.brmCls2Nm;

			if(brmCls1Nm){
				if(brmCls1Nm.indexOf("/") !== "-1"){
					brmCls1Nm = brmCls1Nm.replace(/\//g,"");
				}
				brmStr += brmCls1Nm;
				if(brmCls2Nm){
					if(brmCls2Nm.indexOf("/") !== "-1"){
						brmCls2Nm = brmCls2Nm.replace(/\//g,"");
					}
					brmStr += ' > ';
					brmStr += brmCls2Nm;
				}
			}else{
				brmStr += "미분류";
			}
			//개방여부 가공
			var dataSetOpenStr = "";
			if(meta.datasetopen == 1){
				dataSetOpenStr = "개방";
			}else{
				dataSetOpenStr = meta.datasetopen + "년 개방예정";
			}

			//다운로드 데이터 타입 가공
			var downLoadDType = "";
			if(meta.listRegistTypeCode.indexOf("OPEN") !== -1){
				downLoadDType = "API";
			}else{
				downLoadDType = meta.listRegistTypeCode;
			}

			// 키워드 가공
			var searchKeyword;
			var searchKeywordStr;
			if(null == meta.searchKeywordArray || "undefiend" == meta.searchKeywordArray){
				searchKeywordStr = "미등록";
			}else{
				searchKeyword = meta.searchKeywordArray;
				searchKeywordStr = searchKeyword.slice(0, 5).join(',');
			}

			var datasetnote = "";
			if(meta.datasetnote.length > 30){
				datasetnote = meta.datasetnote.substring(0, 30) + '..';
			}else{
				datasetnote = meta.datasetnote;
			}

			$td.eq(0).text(brmStr);	//분류체계
			$td.eq(1).text(meta.orgNm);	//기관명
			$td.eq(2).text(datasetnote).attr('title', meta.datasetnote);	//개방목록설명
			$td.eq(3).text(searchKeywordStr).attr('title', searchKeyword);	//키워드
			$td.eq(4).text(meta.listRegistTypeCode);	//등록유형
			$td.eq(5).text(dataSetOpenStr);	//개방여부

			var $tbody = $('#detail-section-1 .col-table table tbody').eq(0).empty();
			var $tr = $('<tr>');
			var tableStr = meta.korTblNm;
			if(meta.korTblNm.length > 13){
				tableStr = meta.korTblNm.substring(0, 13) + '..';
			}
			var columnStr = meta.openHoldColListArray.slice(0, 5).join(',');
			$('<td class="a-l">').text(tableStr).attr('title', meta.korTblNm).appendTo($tr);
			$('<td class="a-l">').text(columnStr).attr('title', meta.openHoldColListArray).appendTo($tr);
			$tr.appendTo($tbody);

			$('#insttCode').val(meta.orgCd);
			$('#insttNm').val(meta.orgNm);
			$('#pblinfoNm').val(meta.datasetnm);
			$('#usePurps').val(meta.openHoldColListArray);

			$('#detail-section-1 .scroll .tit em').text(meta.datasetnm);	//개방목록명
			//$('#detail-section-1 .scroll .tit span').text("DATA").show();	//다운로드 데이터 타입
			$('#detail-section-1 .scroll .tit span').text(downLoadDType).show();	//다운로드 데이터 타입 (수정 : 2020.05.07)
			$('#downBtn').hide();		//다운로드 영역 숨김
			$('#linkBtn').show();		//제공신청 영역 열림
			$('#detail-section-1 .table-title').show();	//보유데이터 영역 노출
			$('#detail-section-1 .col-table').show();	//보유데이터 영역 노출

			//연관목록 검색용 화면 docId 추출
			dm.control.data.nodes.forEach(function(item, idx) {
				if(item.keyStat != "Q" && item.keyStat != "W" && item.keyStat != "R" && item.id != meta.docId && item.id != "top"){	//메타데이터만 사용
					if(docIdStrArray.length == 0){
						docIdStrArray += item.id;
					}else{
						docIdStrArray += "," + item.id;
					}
				}
			});

			if(meta.openHoldColListArray){
				openHoldColListArray = meta.openHoldColListArray.join(",");
				// 메타 연관 목록 조회
				dm.searchMetaRelationList({
					docId : meta.docId,
					openHoldColListArray : openHoldColListArray,
					docIds : docIdStrArray
				});
			}else{
				$("#relaDataList").hide();	//영역 숨김
			}

			$("#detail-section-1").addClass('on');	//상세영역 열기
//
		}else if(meta.openDataYn == "N"){ // 보유데이터
			var $table = $('#detail-section-2 .row-table table').eq(0);
			var $td = $table.find('td');

			var openRsnNm;
			/*var openRsnCd = meta.openRsnCd;
			if(openRsnCd == "01"){	//공개
				openRsnNm = "공개";
			}else {	//비공개(02,03)
				openRsnNm = "비공개";
			}*/

			$td.eq(0).text(meta.orgNm);			//기관명
			$td.eq(1).text(meta.infoSysNm);		//정보시스템명
			$td.eq(2).text(meta.dbNm);			//DB명
			$td.eq(3).text(meta.dbSchNm);		//테이블 소유자
			$td.eq(4).text(meta.mtaTblPnm);		//테이블 영문명
			$td.eq(5).text(meta.mtaTblLnm);		//테이블 한글명
			$td.eq(6).text(meta.tblDescn);		//테이블 설명
			$td.eq(7).text(meta.subjNm);		//업무분류체계
			$td.eq(8).text("비공개");		//공개비공개여부
			$td.eq(9).text(meta.operDeptNm);	//운영부서명
			$td.eq(10).text(meta.crgUserNm);	//담당자명

			$('#detail-section-2 .tit em').text(meta.mtaTblLnm);	//제목 세팅
			$('#columnInfoOpen').attr("data-mtatblid", meta.mtaTblId);	//데이터ID 세팅
			$("#column-info-layer .button-group .blue").attr("data-mtatblid", meta.mtaTblId);	//데이터ID 세팅

			$("#detail-section-2").addClass('on');	//보유데이터 상세영역 열기

		}else{
			var $table = $('#detail-section-1 .row-table table').eq(0);
			var $td = $table.find('td');

			//분류체계명 가공
			var brmStr = "";
			var brmCls1Nm = meta.brmNNm;	//신규분류체계명
			var brmCls2Nm = meta.brmCodeNm;	//분류체계명

			if(brmCls1Nm){
				brmStr += brmCls1Nm;
				if(brmCls2Nm){
					brmStr += ' > ';
					brmStr += brmCls2Nm;
				}
			}else{
				brmStr += "미분류";
			}
			//개방여부
			var dataSetOpenStr = "개방";

			// 키워드 가공
			var searchKeyword;
			var searchKeywordStr;
			if(null == meta.searchKeywordArray || "undefiend" == meta.searchKeywordArray){
				searchKeywordStr = "미등록";
			}else{
				searchKeyword = meta.searchKeywordArray;
				searchKeywordStr = searchKeyword.slice(0, 5).join(',');
			}

			//다운로드 데이터 타입 가공
			var downLoadDType = "";
			if(meta.listRegistTypeCode.indexOf("OPEN") !== -1){
				downLoadDType = "API";
			}else{
				downLoadDType = meta.listRegistTypeCode;
			}

			//다운로드 구분
			var dataTyStr = "";
			var apiFileTypeDetailStr = "";
			var apiFileUrl = "";
			if(meta.dataTy.trim() == "다운로드"){
//				dataTyStr = "다운로드";
				dataTyStr = "바로가기";
				apiFileTypeDetailStr = meta.apiFileTypeDetail;
				apiFileUrl = meta.apiFileUrl;
			}else{
				dataTyStr = "바로가기";
//				apiFileTypeDetailStr = "LINK";
				apiFileTypeDetailStr = meta.apiFileTypeDetail;
				apiFileUrl = meta.detailScrinUrl;
			}

			var docContent = "";
			if(meta.docContent.length > 30){
				docContent = meta.docContent.substring(0, 30) + '..';
			}else{
				docContent = meta.docContent;
			}

			$td.eq(0).text(brmStr);	//분류체계
			$td.eq(1).text(meta.insttNm);	//기관명	2020-05-22 orgNm -> insttNm으로 변경 처리
			$td.eq(2).text(docContent).attr('title', meta.docContent);	//개방목록설명
			$td.eq(3).text(searchKeywordStr).attr('title', searchKeyword);	//키워드
			$td.eq(4).text(meta.listRegistTypeCode);	//등록유형
			$td.eq(5).text(dataSetOpenStr);	//개방여부

			$('#detail-section-1 .scroll .tit em').text(meta.docTitle);	//개방목록명
			//$('#detail-section-1 .scroll .tit span').text(apiFileTypeDetailStr).show();	//다운로드 데이터 타입
			$('#detail-section-1 .scroll .tit span').text(downLoadDType).show();	//다운로드 데이터 타입(수정 : 2020.05.07)
			$('#downBtn').attr("href",apiFileUrl);
			$('#downBtn').text(dataTyStr);
			$('#downBtn').show();	//다운로드 영역 열림
			$('#linkBtn').hide();	//제공신청 영역 숨김

			if(meta.openHoldColListArray){
				var $tbody = $('#detail-section-1 .col-table table tbody').eq(0).empty();
				var $tr = $('<tr>');
				//var tableStr = meta.korTblNm;
				var tableStr = meta.docTitle;
				if(meta.docTitle.length > 13){
					tableStr = meta.docTitle.substring(0, 13) + '..';
				}
				var columnStr = meta.openHoldColListArray.slice(0, 5).join(',');
				$('<td class="a-l">').text(tableStr).attr('title', meta.docTitle).appendTo($tr);
				$('<td class="a-l">').text(columnStr).attr('title', meta.openHoldColListArray).appendTo($tr);
				$tr.appendTo($tbody);
				$('#detail-section-1 .table-title').show();	//보유데이터 영역 숨김
				$('#detail-section-1 .col-table').show();	//보유데이터 영역 숨김
			}else{
				$('#detail-section-1 .table-title').hide();	//보유데이터 영역 숨김
				$('#detail-section-1 .col-table').hide();	//보유데이터 영역 숨김
			}

			dm.control.data.nodes.forEach(function(item, idx) {
				if(item.keyStat != "Q" && item.keyStat != "W" && item.keyStat != "R" && item.id != meta.docId && item.id != "top"){	//메타데이터만 사용
					if(docIdStrArray.length == 0){
						docIdStrArray += item.id;
					}else{
						docIdStrArray += "," + item.id;
					}
				}
			});

			if(meta.openHoldColListArray){
				openHoldColListArray = meta.openHoldColListArray.join(",");
				// 메타 연관 목록 조회
				dm.searchMetaRelationList({
					docId : meta.docId,
					openHoldColListArray : openHoldColListArray,
					docIds : docIdStrArray
				});
			}else{
				$("#relaDataList").hide();	//영역 숨김
			}

			$("#detail-section-1").addClass('on');

		}
	}

	/**
	 * 메타 연관 목록 조회
	 */
	dm.searchMetaRelationList = function(params) {

		post('/tcs/eds/ndm/metaDataRelationList.do', params, {
			scb: function(result) {
				var data = eval("("+result+")");
				var metaList;
				var appendHtml = "";

				if(data.resultCnt != 0){
					metaList = data.resultMsg;

					metaList.forEach(function(item, idx) {
						appendHtml += '<li data-docid="'+ item.docId +'" data-opendatayn="'+ item.openDataYn +'">'
						appendHtml += '<p class="txt">' + item.docTitleView +'</p>';
						appendHtml += '<p class="source">' + item.orgNm +'</p>';
						appendHtml += '<a href="#" class="button" data-sdocid="'+params.docId+'" data-tdocid="'+item.docId+'">연결정보</a>';
						appendHtml += '</li>'
					});

					$("#relaDataList ul").empty().html(appendHtml);
					$("#relaDataList").show();	//영역 표출
				}else{
					$("#relaDataList").hide();	//영역 숨김
				}

			},
			fcb : function(e) {
			}
		});

	}

	/**
	 * 연결정보 목록 마우스오버 이벤트
	 */
	$(document).on('mouseover', '#relaDataList li>p', function() {
		var docId = $(this).parents("li").data("docid");
		$('g > circle').removeClass('select-item');	//우선 제거 처리
		var $o = $('g > circle[docid="' + docId + '"]');
		$o.addClass('select-item');
	});

	$(document).on('mouseout', '#relaDataList li>p', function() {
		var docId = $(this).parents("li").data("docid");
		$('g > circle').removeClass('select-item');
	});

	/**
	 * 연결정보 목록 마우스클릭 이벤트
	 */
	$(document).on('click', '#relaDataList li>p', function(e) {
		var docId = $(this).parents("li").data("docid");
		var openDataYn = $(this).parents("li").data("opendatayn");
		var upId;

		//상단 메뉴영역 확인하여 처리
		var fli = $('.tab-filter li');
		for(var i=0; i<fli.length; i++){
			var stat = fli.eq(i).hasClass("on");
			if(stat){
				if(i == 0){	//관계도맵
					$('g > circle').removeClass('select-item');
					_node.filter(function (d) { return d.id != docId && d.keyStat == "E";}).transition(500).style('fill-opacity', 0.5).style("filter", "none");
					_node.filter(function (d) { return d.id == docId || -1 != d.upId.indexOf(docId);}).transition(500).style("fill-opacity", 1).style("filter", "url(#drop-shadow)");
					_link.filter(function (d) {
						if(d.source.id == docId || d.target.id == docId){
							_node.filter(function (dd) {return dd.id == d.source.id || dd.id == d.target.id;}).transition(500).style("fill-opacity", 1).style("filter", "url(#drop-shadow)");
						}
						return true;
						}
					);
					_link.filter(function (d) { return d.source.id != docId && d.target.id != docId;}).transition(500).attr("class", "link lvl3").style("stroke-opacity", 0.5);
					_link.filter(function (d) { return d.source.id == docId || d.target.id == docId;}).transition(500).attr("class", "link lvl4").attr("stroke-width", "3px").style("stroke-opacity", 1);
				}else if(i == 1){	//확장맵
					_node.filter(function (d) { if(d.data.keyStat == "E"){ d.active = false; } return true; });
					_node.filter(function (d) { return d.data.keyStat == "E"}).select('circle').style("fill", "#fff");
					_node.filter(function (d) { return d.data.keyStat == "E" && d.data.id == docId}).select('circle').style("fill", "#8b5cf3");
				}else if(i == 2){	//목록정보
					$(".btn-open-detail-section").removeClass("on");
					$(".btn-open-detail-section").each(function() {
						var listId = $(this).data("docid");
						if(docId == listId){
							$(this).addClass("on");
						}
					});
				}
				break;
			}
		}


		// 메타정보 조회
		if(openDataYn == "N"){
			dm.searchMetaInfo({
				mtaTblId : docId,
				openDataYn : openDataYn
			});
		}else{
			dm.searchMetaInfo({
				docId : docId,
				openDataYn : openDataYn
			});
		}

	});

	/**
	 * 메타 연관 데이터를 조회(연결팝업)
	 */
	dm.getConnectInfo = function(paramData) {

		var $table = $('#data-info-layer .row-table table').eq(0);
		var $td = $table.find('td');
		var $tr = $table.find('tr');

		$td.eq(0).text(paramData.sTitle);		//소스 타이틀
		$td.eq(1).text(paramData.tTitle);		//타겟 타이틀
		//분류체계 영역 처리
		$tr.eq(2).empty();
		var $th = $('<th scope="row">').text("연결분류체계").appendTo($tr.eq(2));
		$th.appendTo($tr.eq(2));
		if(paramData.sBrm == paramData.tBrm){	//분류체계가 같으면 1칸으로 표출
			var $tdSBrm = $('<td colspan="2">').text(paramData.sBrm).appendTo($tr.eq(2));
			$tdSBrm.appendTo($tr.eq(2));
		}else{
			var $tdSBrm = $('<td>').text(paramData.sBrm).appendTo($tr.eq(2));
			var $tdTBrm = $('<td>').text(paramData.tBrm).appendTo($tr.eq(2));
			$tdSBrm.appendTo($tr.eq(2));
			$tdTBrm.appendTo($tr.eq(2));
		}
		//검색어 영역 처리
		$tr.eq(3).empty();
		$th = $('<th scope="row">').text("검색어").appendTo($tr.eq(3));
		$th.appendTo($tr.eq(3));
		if(paramData.sSchKey == paramData.tSchKey){	//검색어가 같으면 1칸으로 표출
			var $tdSKey = $('<td colspan="2">').text(paramData.sSchKey).appendTo($tr.eq(3));
			$tdSKey.appendTo($tr.eq(3));
		}else{
			var $tdSKey = $('<td>').text(paramData.sSchKey).appendTo($tr.eq(3));
			var $tdTKey = $('<td>').text(paramData.tSchKey).appendTo($tr.eq(3));
			$tdSKey.appendTo($tr.eq(3));
			$tdTKey.appendTo($tr.eq(3));
		}

		//연결 항목 조회
		var params = {
			docId	 : paramData.docId
		};

		post(
				'/tcs/eds/ndm/metaDataLink.do',
				params,
				{
					scb: function(result) {
	            		var data = eval("("+result+")");

						var metaList = data.resultMsg;
						var appendStr = "";

						var $div = $("#data-info-layer div .word-group");
						$div.empty();
						if(metaList.length != 0){	//데이터가 존재하면
							metaList.forEach(function(item, idx) {
								var $span = $('<span>').html(item['key']).appendTo($div);
							});
						}

						$('#data-info-layer').modal({
							escapeClose: false,
							clickClose: true
						});

					},
					fcb : function(e) {
					}
				});
		return false;
	}

	/**
	 * 메타데이터 일괄다운로드 목록 조회
	 */
	dm.metaDataAllDownList = function(metaList) {

		var tbody = $("#data_all_get_request table tbody");

		var appendHtml = "";
		var cnt = 1;
		var brmStr = "";
		var orgNmStr = "";
		metaList.forEach(function(item, idx) {
			if("0" != item.id && "1" != item.id && "2" != item.id && "3" != item.id){ //검색어와 연관어 데이터는 제외

				brmStr = item.brm;
				//brmStr.length > 7 ? brmStr.substring(0, 8) + '..' : brmStr;
				if(item.brm.length > 6){
					brmStr = brmStr.substring(0, 6) + '..';
				}
				orgNmStr = item.orgNm;
				//orgNmStr.length > 7 ? orgNmStr.substring(0, 8) + '..' : orgNmStr;
				if(item.orgNm.length > 6){
					orgNmStr = orgNmStr.substring(0, 6) + '..';
				}

				appendHtml += '<tr>';
				appendHtml += '<td>'+ cnt +'</td>';
				appendHtml += '<td class="a-l">'+ item.name +'</td>';
				appendHtml += '<td title="'+item.brm+'">'+ brmStr +'</td>';
				appendHtml += '<td title="'+item.orgNm+'">'+ orgNmStr+'</td>';
				if("" != item.apiFileTypeDetail && null != item.apiFileTypeDetail && "undefiend" != item.apiFileTypeDetail){
					appendHtml += '<td>'+ item.apiFileTypeDetail+'</td>';
				}else{
					appendHtml += '<td> - </td>';
				}

				if("" != item.dataTy && null != item.dataTy && "null" != item.dataTy){
					appendHtml += '<td>'+ item.dataTy +'</td>';
					if("다운로드" == item.dataTy.trim()){
						appendHtml += '<td><input type="checkbox" name="downLinksChk" value="'+item.apiFileUrl+'"></td>';
					}else{
						appendHtml += '<td> - </td>';
					}
				}else{
					appendHtml += '<td> - </td>';
					appendHtml += '<td> - </td>';
				}

				appendHtml += '</tr>';
				cnt++;
			}
		});

		tbody.empty().html(appendHtml);

		$('#data_all_get_request').modal({
    		escapeClose: false,
    		clickClose: true
    	});
	}

	$(document).on('click', '#checkAll', function() {
        if($("#checkAll").prop("checked")){
            //input태그의 name이 chk인 태그들을 찾아서 checked옵션을 true로 정의
            $("input[name=downLinksChk]").prop("checked",true);
            //클릭이 안되있으면
        }else{
            //input태그의 name이 chk인 태그들을 찾아서 checked옵션을 false로 정의
            $("input[name=downLinksChk]").prop("checked",false);
        }
    });

	/**
	 * 메타데이터 일괄다운로드 버튼 클릭 이벤트
	 */
	$(document).on('click', '#data_all_get_request button', function(e) {
		e.preventDefault();
    	var chkedLen = $("input[name=downLinksChk]:checked").size();
    	var url = "";
    	var urlList = [];

    	if(chkedLen < 1){
    		alert("다운로드 받을 데이터를 선택해 주세요.");
    		return false;
    	}else{
    		$('input[name=downLinksChk]:checked').each(function() {
    			urlList.push(this.value);
    		});

    		if (navigator.msSaveBlob) {                //익스플로러면..
    			for(var i=0; i<urlList.length; i++){
        			url = urlList[i];
                    setTimeout(function() {
                    	location.href = url;
                    }, 1000);
        		}
            }else{	//이외
            	for(var i=0; i<urlList.length; i++){
        			url = urlList[i];
        			$('<iframe></iframe>').hide().attr('src', url).appendTo($('body')).load(function() {
        				var that = this;
                        setTimeout(function() {
                            $(that).remove();
                        }, 1000);
                    });
        		}
            }

    	}
	});

	/**
	 * 메타데이터 컬럼정보 조회 버튼 클릭 이벤트
	 */
	$("#column-info-layer .button-group .blue").on('click', function(e) {
		e.preventDefault();

    	var mtaTblId = $(this).attr("data-mtatblid");	//메타데이터 ID
    	var prsnInfoYn = $("#label-1").val();	//개인정보여부
    	var encTrgYn = $("#label-2").val();	//암호화여부
    	var openDataYn = $("#label-3").val();	//공개비공개 여부

    	// 연결정보 조회
		dm.metaDataDetailColList({
			mtaTblId	: mtaTblId,
			prsnInfoYn	: prsnInfoYn,
			encTrgYn	: encTrgYn,
			openDataYn	: openDataYn
		});

	});

	/**
	 * 메타데이터 컬럼정보 초기화 버튼 클릭 이벤트
	 */
	$("#column-info-layer .button-group .navy").on('click', function(e) {
		e.preventDefault();

    	var prsnInfoYn = $("#label-1").val("N");	//개인정보여부
    	var encTrgYn = $("#label-2").val("N");	//암호화여부
    	var openDataYn = $("#label-3").val("N");	//공개비공개 여부

    	$("#column-info-layer table tbody").empty();

	});

	/**
	 * 메타데이터 컬럼정보 목록 조회
	 */
	dm.metaDataDetailColList = function(params) {

		post(
				'/tcs/eds/ndm/metaDataDetailCol.do',
				params,
				{
					scb: function(result) {
	            		var data = eval("("+result+")");
						var metaList = data.resultMsg;
						var tbody = $("#column-info-layer table tbody");

						var appendHtml = "";
						var cnt = 1;
						metaList.forEach(function(item, idx) {

							var prsnInfoYn = item.prsnInfoYn;	//개인정보 여부
							if(prsnInfoYn == "Y"){
								prsnInfoYn = "예";
							}else{
								prsnInfoYn = "아니오";
							}

							var encTrgYn = item.encTrgYn;	//개인정보 여부
							if(encTrgYn == "Y"){
								encTrgYn = "예";
							}else{
								encTrgYn = "아니오";
							}

							var openDataYn = item.openDataYn;	//개인정보 여부
							if(openDataYn == "Y"){
								openDataYn = "예";
							}else{
								openDataYn = "아니오";
							}

							appendHtml += '<tr>';
							appendHtml += '<td>'+ cnt +'</td>';
							appendHtml += '<td class="a-l">'+ item.mtaColPnm +'</td>';
							appendHtml += '<td class="a-l">'+ item.mtaColLnm +'</td>';
							appendHtml += '<td class="a-l">'+ item.colDescn+'</td>';
							appendHtml += '<td>'+ item.dataType+'</td>';
							appendHtml += '<td>'+ prsnInfoYn+'</td>';
							appendHtml += '<td>'+ encTrgYn +'</td>';
							appendHtml += '<td>'+ openDataYn +'</td>';
							appendHtml += '</tr>';
							cnt++;
						});

						tbody.empty().html(appendHtml);


						$('#column-info-layer').modal({
				    		escapeClose: false,
				    		clickClose: true
				    	});
					},
					fcb : function(e) {
					}
				});
		return false;
	}

});