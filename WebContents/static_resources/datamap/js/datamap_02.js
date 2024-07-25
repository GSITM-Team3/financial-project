
$(document).ready(function ($) {

	$("body").on("click", function (event) {
		if (event.target.className == 'close2' || event.target.className == 'backon') {
			$("#popup_table").hide(); //close버튼 이거나 뒷배경 클릭시 팝업 삭제
			$("#popup_datamap").hide(); //close버튼 이거나 뒷배경 클릭시 팝업 삭제
			$(".backon").hide();
		}
	});

});
				
function go_searchData(idx, mode){
	
	var params = {
		idx : idx,
		mode : mode,
	}
	
	cf_ajax("/search/dataMap/getInfo", params, function(data){
		go_searchDataCB(data, idx, mode)
	})
}

function go_searchDataCB(data, idx, mode){
	
	if(mode == "dateSet"){
		
		$("#dataset_sys_nm").text(data.sys_nm);
		$("#dataset_db_ty_nm").text(data.db_ty_nm);
		$("#dataset_table_eng_nm").text(data.table_eng_nm);
		$("#dataset_table_korean_nm").text(data.table_korean_nm);
		$("#dataset_table_dc").text(data.table_dc);
		$("#dataset_br_dc").text(data.br_dc);
		$("#dataset_hashtag_cn").text(data.hashtag_cn);
		$("#dataset_mngr_nm").text(data.mngr_nm);
		$("#dataset_hive_table_nm").text(data.hive_table_nm);
		$("#dataset_bigdata_gtrn_at").text(data.bigdata_gtrn_at);
		$("#dataset_schdul_applc_at").text(data.schdul_applc_at);
		$("#dataset_gthnldn_mth_code").text(data.gthnldn_mth_code);
		$("#dataset_gthnldn_mth_nm").text(data.gthnldn_mth_nm);
		
		$("#popup_table").show();   //팝업 오픈
		$("body").append('<div class="backon"></div>'); //뒷배경 생성
	} else {
		$("#opendoc_cat_brmnnm").text(data.brmnnm);
		$("#opendoc_cat_brmcodenm").text(data.brmcodenm);
		$("#opendoc_cat_searchkeyword").text(data.searchkeyword);
		$("#opendoc_cat_dataty").text(data.dataty);
		$("#opendoc_doctitle").text(data.doctitle);
		$("#opendoc_doccontent").html(data.doccontent);
		var opendoc_updtdt_viewcount_dncnt = 
			"수정일 : " + data.updtdt + " | 조회수 : " + data.viewcount + " | 다운로드 : " + data.dncnt;
		$("#opendoc_updtdt_viewcount_dncnt").text(opendoc_updtdt_viewcount_dncnt);
		$("#opendoc_brmnnm").text(data.brmnnm);
		$("#opendoc_insttnm").text(data.insttnm);
		$("#opendoc_listregisttypecode").text(data.listregisttypecode);
		$("#opendoc_dncnt").text(data.dncnt);
		$("#opendoc_registdt").text(data.registdt);
		$("#opendoc_updtdt").text(data.updtdt);
		$("#opendoc_searchkeyword").text(data.searchkeywor);
		
		
		$("#popup_datamap").show();   //팝업 오픈
		$("body").append('<div class="backon"></div>'); //뒷배경 생성
	}
	
	
}


$(function(){
	go_search();
});

function go_search(){
	
	var searchVal = $("#searchVal").val().trim();
	
	if(cf_isEmpty(searchVal)) {
		alert("검색어를 입력하세요.");
		return;
	} 
	
	var params = {searchVal : searchVal};
	cf_ajax("/search/dataMap/getData", params, go_searchCB);
}

function go_searchCB(rslt){	
	convertRelationGraphData_dataset(rslt);
	convertRelationGraphData_opendoc(rslt);
}

var _simulation_dataset;
var _link_dataset;
var _node_dataset;
var _svg_movement_dataset;
var _svg_dataset;
var nodeEnter_dataset;
function convertRelationGraphData_dataset(rslt) {

	var nodes = [];
	var links = [];
	var brm_list = rslt.dateSetList;
	var searchVal = rslt.searchVal;
	var o;
	var lv1, lv2, lv3;
	var item;
	var upId;
	var tmpLvNm;
	var nodes = [];
	var links = [];
	
	// 0레벨 등록하기
	var id = -1;
	++id;
	item = {
		title : searchVal.abbreviate(20),
		id : id,
		level : 0,
		lvl_01_nm : "",
		lvl_02_nm : "",
	}	
	nodes.push(item);
	
	// 1레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.lvl_01_nm) continue;
		tmpLvNm = o.lvl_01_nm;
		
		lv1 = nodes
			.getElementFirst("lvl_01_nm", o.lvl_01_nm);
		if(lv1 == null){
			++id;
			item = {
				title : o.lvl_01_nm.abbreviate(20),
				id : id,
				level : 1,
				lvl_01_nm : o.lvl_01_nm,
				lvl_02_nm : "",
			}
			nodes.push(item);
			links.push({
				source : id,
				target : 0,
				lvl : 1,
			})
		}
	}
	
	// 2레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.lvl_02_nm) continue;
		tmpLvNm = o.lvl_02_nm;
		
		lv2 = nodes
			.getElementList("lvl_01_nm", o.lvl_01_nm)
			.getElementFirst("lvl_02_nm", o.lvl_02_nm);
		if(lv2 == null){
			
			upId = nodes
				.getElementFirst("lvl_01_nm", o.lvl_01_nm)
				.id;
			
			++id;
			item = {
				title : o.lvl_02_nm.abbreviate(20),
				id : id,
				level : 2,
				lvl_01_nm : o.lvl_01_nm,
				lvl_02_nm : o.lvl_02_nm,
				idx : o.idx,
			}
			nodes.push(item);
			links.push({
				source : id,
				target : upId,
				lvl : 2,
			})
		}
	}
	
//	console.log(nodes);

	var el_treemap_dataset = $('#treemap_dataset').get(0);

	$(el_treemap_dataset).empty();
	if(_simulation_dataset) _simulation_dataset.stop();

	var _svgWidth_dataset = Math.max($('#treemap_dataset').width());
	var _svgHeight_dataset = Math.max($('#treemap_dataset').height());

	_simulation_dataset = d3.forceSimulation()
					.force("link", d3.forceLink().id(function(d) {return d.id;}).strength(0.5))
					.force("charge", d3.forceManyBody().strength(-200))
					.force("collision", d3.forceCollide(50).strength(0.35))
					.force('radial', d3.forceRadial(function(d) {
						var radial;
						 	if(d.level === 0){
						 		radial = 0;
							} else if(d.level === 1){
								radial = 400;
							} else if(d.level === 2){
								radial = 700;
							}
						return radial;
					  }, _svgWidth_dataset * 0.5, _svgHeight_dataset * 0.5))
					.force('center', d3.forceCenter().x(_svgWidth_dataset * 0.5).y(_svgHeight_dataset * 0.5))
					.on('tick', ticked_dataset);

	_svg_dataset = d3.select(el_treemap_dataset).append("g").attr("class", "canvas");
	
	var _zoom_dataset = d3.zoom().scaleExtent([0.4, 5]).on("start", zoomstart_dataset).on("zoom", zoomed_dataset).on("end", zoomend_dataset);

	d3.select(el_treemap_dataset)
	 			   .attr("width", _svgWidth_dataset)
	 			   .attr("height", _svgHeight_dataset)
	 			   .style("background-color", "#ffffff")
	 			   .call(_zoom_dataset)
	 			   .call(_zoom_dataset.transform, d3.zoomIdentity.translate(150, 50).scale(0.5))
	 			   .on("dblclick.zoom", null);


	$('#treemap_dataset').find('g.canvas').empty();

	/*************************** 링크 처리 start ***************************/

	_link_dataset = _svg_dataset.append("g").selectAll(".link").data(links, function(d) { return d.target; });

	var linkEnter_dataset = _link_dataset.enter().append("line")
							.attr("class", "link");
	
	linkEnter_dataset.filter(function (d) { return true;})
			 .attr("stroke", function(d) {
				 var result;
				 if(d.lvl == 1){
					 result = "#bcaee1";
				 } else if(d.lvl == 2){
					 result = "#f7cca2";
				 }
				 return result;
			  })
			  .attr("stroke-width", function(d) {
				 var result;
				 if(d.lvl == 1){
					 result = "2.5px";
				 } else if(d.lvl == 2){
					 result = "2px";
				 }
				 return result;
			  })
			  .style("visibility", "visible");

	_link_dataset = linkEnter_dataset.merge(_link_dataset);

	/*************************** 링크 처리 end ***************************/

	_node_dataset = _svg_dataset.append("g").selectAll(".node").data(nodes, function(d) { return d.id; });

	var _drag_dataset = d3.drag().on("start", dragstarted_dataset).on("drag", dragged_dataset).on("end", dragended_dataset);
	
	nodeEnter_dataset = _node_dataset.enter().append("g").attr("class", "node")
						.attr("transform",_svg_movement_dataset)
						.on("click", nClick_dataset)
						.on("mouseover", mouseover_dataset)
						.on("mouseout", mouseout_dataset)
						.call(_drag_dataset);

	// 검색어/1레벨 적용
	nodeEnter_dataset.filter(function (d) { return (d.level != 2) ? true : false;})
		 	 .append("polygon")
		  	 .attr('points', getHexagonSize_dataset(44, 38))
		 	 .attr('fill', function (d) {
					if(d.level == 0){
						return "#a1b3d1";
					} else if(d.level == 1){
						return "#fff";
					}
				})
		 	 .style("stroke", function (d) {
					if(d.level == 0){
						return "#0b4094";
					} else if(d.level == 1){
						return "#6a8abd";
					}
				})
		 	 .style("stroke-width", "2px")
		 	 .style("stroke-opacity", "1");

	// 2레벨 적용
	nodeEnter_dataset.filter(function (d) { return (d.level == 2) ? true : false;})
			 .append("circle")
			 .attr("r", "30px")
			 .attr('fill', "#d6dde9")
			 .style("stroke", "#FFFFFF")
			 .style("stroke-width", "1.5px")
			 .style("stroke-opacity", "0");

	// 타이틀
//	nodeEnter_dataset.append("title").text(function(d) { return d.title; })

	nodeEnter_dataset.filter(function (d) { return (d.level == 0) ? true : false;})
		.append("text")
		.attr("dy","-4")
		.attr("x","0")
		.attr("y","0")
		.attr("text-anchor","middle")
		.attr("font-weight","bold")
		.attr("font-size","19px")
		.text(function(d) { return d.title; })

	nodeEnter_dataset.filter(function (d) { return (d.level == 0) ? true : false;})
		.append("text")
		.attr("dy","13")
		.attr("x","0")
		.attr("y","0")
		.attr("text-anchor","middle")
		.attr("font-weight","200")
		.attr("font-size","11px")
		.text(function(d) { return brm_list.length + "건"; })
		
	nodeEnter_dataset.filter(function (d) { return (d.level != 0) ? true : false;})
		.append("text")
		.attr("dy","3")
		.attr("x","0")
		.attr("y","0")
		.attr("text-anchor","middle")
		.text(function(d) { return d.title; })
	

	// 초기 조회 시 disable 효과 적용(검색어관련 데이터)

	_node_dataset = nodeEnter_dataset.merge(_node_dataset);

	/*************************** 노드 처리 end ***************************/
	
	_simulation_dataset.nodes(nodes);
	_simulation_dataset.force("link").links(links);

}

function nClick_dataset(d) {
	
	if(d.level == 2){
		go_searchData(d.idx, "dateSet");
	} else {
//		var up_lvl_01_nm = d.lvl_01_nm
//		nodeEnter_dataset.filter(function (d) { return (d.level == 2 && d.lvl_01_nm == up_lvl_01_nm) ? true : false;})
//				 .append("circle")
//				 .attr("r", "24px")
//				 .attr('fill', "#d6dde9")
//				 .style("stroke", "#FFFFFF")
//				 .style("stroke-width", "1.5px")
//				 .style("stroke-opacity", "0");
	}
}
	
function getHexagonSize_dataset(wid, hei){
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
function dragstarted_dataset(d) {
	if (!d3.event.active){
		_simulation_dataset.alphaTarget(0.3).restart()
	}
}

function dragged_dataset(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended_dataset(d) {
  if (!d3.event.active) {
	  _simulation_dataset.alphaTarget(0);
  }

  d.fx = undefined;
  d.fy = undefined;
}

function zoomstart_dataset(d) {
	_svg_dataset.attr("transform", _svg_movement_dataset);
}

function zoomed_dataset(d) {
	var ratio = d3.event.transform.k;
	if (ratio > 5)
		ratio = 5;
	if (ratio < 0.1)
		ratio = 0.1;

	_svg_dataset.attr("transform", d3.event.transform);

	
	if(ratio > 0.6){
		d3.selectAll('g.node > text').style('display', '')
	}
	if(ratio > 2.3){
		d3.selectAll('g.node > .node-title').text(function(d) { return d.title});
	}
}

function zoomend_dataset(d) {
	_svg_movement_dataset = _svg_dataset.attr("transform");
}

//눈금 이동별 좌표계산
function ticked_dataset() {
	_node_dataset.attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
	/*_node.attr("cx", function(d) { return d.x; })
      	 .attr("cy", function(d) { return d.y; });*/

	_link_dataset.attr("x1", function(d) {
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

function mouseover_dataset(d) {
	if(d.level === 2){
		/*d3.select(this).selectAll("text").transition()
	      .attr("font-size", "13px");*/
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "27px";
		});
	}
}

function mouseout_dataset(d) {
	if(d.level === 2){
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "16px";
		});
	}
}


///////////////////////////////////////////////////////////////////////////////



var _simulation_opendoc;
var _link_opendoc;
var _node_opendoc;
var _svg_movement_opendoc;
var _svg_opendoc;
function convertRelationGraphData_opendoc(rslt){

	var nodes = [];
	var links = [];
	var brm_list = rslt.openDocList;
	var searchVal = rslt.searchVal;
	var o;
	var lv1, lv2, lv3;
	var item;
	var upId;
	var tmpLvNm;
	var nodes = [];
	var links = [];
	
	// 0레벨 등록하기
	var id = -1;
	++id;
	item = {
		title : searchVal,
		id : id,
		level : 0,
		lvl_01_nm : "",
		lvl_02_nm : "",
		lvl_03_nm : "",
	}	
	nodes.push(item);
	
	// 1레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.lvl_01_nm) continue;
		tmpLvNm = o.lvl_01_nm;
		
		lv1 = nodes
			.getElementFirst("lvl_01_nm", o.lvl_01_nm);
		if(lv1 == null){
			++id;
			item = {
				title : o.lvl_01_nm.abbreviate(20),
				id : id,
				level : 1,
				lvl_01_nm : o.lvl_01_nm,
				lvl_02_nm : "",
				lvl_03_nm : "",
			}
			nodes.push(item);
			links.push({
				source : id,
				target : 0,
				lvl : 1,
			})
		}
	}
	
	// 2레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.lvl_02_nm) continue;
		tmpLvNm = o.lvl_02_nm;
		
		lv2 = nodes
			.getElementList("lvl_01_nm", o.lvl_01_nm)
			.getElementFirst("lvl_02_nm", o.lvl_02_nm);
		if(lv2 == null){
			
			upId = nodes
				.getElementFirst("lvl_01_nm", o.lvl_01_nm)
				.id;
			
			++id;
			item = {
				title : o.lvl_02_nm.abbreviate(20),
				id : id,
				level : 2,
				lvl_01_nm : o.lvl_01_nm,
				lvl_02_nm : o.lvl_02_nm,
				lvl_03_nm : "",
			}
			nodes.push(item);
			links.push({
				source : id,
				target : upId,
				lvl : 2,
			})
		}
	}
	
	// 3레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.lvl_03_nm) continue;
		tmpLvNm = o.lvl_03_nm;
		
		lv3 = nodes
			.getElementList("lvl_01_nm", o.lvl_01_nm)
			.getElementList("lvl_02_nm", o.lvl_02_nm)
			.getElementFirst("lvl_03_nm", o.lvl_03_nm);
		if(lv3 == null){
			
			upId = nodes
				.getElementList("lvl_01_nm", o.lvl_01_nm)
				.getElementFirst("lvl_02_nm", o.lvl_02_nm)
				.id;
			
			++id;
			item = {
				title : o.lvl_03_nm.abbreviate(20),
				id : id,
				level : 3,
				lvl_01_nm : o.lvl_01_nm,
				lvl_02_nm : o.lvl_02_nm,
				lvl_03_nm : o.lvl_03_nm,
				idx : o.idx,
			}
			nodes.push(item);
			links.push({
				source : id,
				target : upId,
				lvl : 3,
			})
		}
	}
	
//	console.log(nodes);

	var el_treemap_opendoc = $('#treemap_opendoc').get(0);

	$(el_treemap_opendoc).empty();
	if(_simulation_opendoc) _simulation_opendoc.stop();

	var _svgWidth_opendoc = Math.max($('#treemap_opendoc').width());
	var _svgHeight_opendoc = Math.max($('#treemap_opendoc').height());

	_simulation_opendoc = d3.forceSimulation()
					.force("link", d3.forceLink().id(function(d) {return d.id;}).strength(0.5))
					.force("charge", d3.forceManyBody().strength(-200))
					.force("collision", d3.forceCollide(50).strength(0.35))
					.force('radial', d3.forceRadial(function(d) {
						var radial;
						 	if(d.level === 0){
						 		radial = 100;
							} else if(d.level === 1){
								radial = 250;
							} else if(d.level === 2){
								radial = 350;
							} else if(d.level === 3){
								radial = 500;
							}
						return radial;
					  }, _svgWidth_opendoc * 0.5, _svgHeight_opendoc * 0.5))
					.force('center', d3.forceCenter().x(_svgWidth_opendoc * 0.5).y(_svgHeight_opendoc * 0.5))
					.on('tick', ticked_opendoc);

	_svg_opendoc = d3.select(el_treemap_opendoc).append("g");
	
	var _zoom_opendoc = d3.zoom().scaleExtent([0.4, 5]).on("start", zoomstart_opendoc).on("zoom", zoomed_opendoc).on("end", zoomend_opendoc);

	d3.select(el_treemap_opendoc)
	 			   .attr("width", _svgWidth_opendoc)
	 			   .attr("height", _svgHeight_opendoc)
	 			   .style("background-color", "#ffffff")
	 			   .call(_zoom_opendoc)
	 			   .call(_zoom_opendoc.transform, d3.zoomIdentity.translate(150, 50).scale(0.5))
	 			   .on("dblclick.zoom", null);

	$('#treemap_opendoc').find('g.canvas').empty();

	/*************************** 링크 처리 start ***************************/

	_link_opendoc = _svg_opendoc.append("g").selectAll(".link").data(links, function(d) { return d.target; });

	var linkEnter_opendoc = _link_opendoc.enter().append("line")
							.attr("class", "link");
	
	linkEnter_opendoc.filter(function (d) { return true;})
			 .attr("stroke", function(d) {
				 var result;
				 if(d.lvl == 1){
					 result = "#d7dfec";
				 } else if(d.lvl == 2){
					 result = "#d7dfec";
				 } else if(d.lvl == 3){
					 result = "#eeeeee";
				 }
				 return result;
			  })
			  .attr("stroke-width", function(d) {
				 var result;
				 if(d.lvl == 1){
					 result = "2.5px";
				 } else if(d.lvl == 2){
					 result = "2px";
				 } else if(d.lvl == 3){
					 result = "2px";
				 }
				 return result;
			  })
			  .style("visibility", "visible");

	_link_opendoc = linkEnter_opendoc.merge(_link_opendoc);

	/*************************** 링크 처리 end ***************************/

	_node_opendoc = _svg_opendoc.append("g").selectAll(".node").data(nodes, function(d) { return d.id; });

	var _drag_opendoc = d3.drag().on("start", dragstarted_opendoc).on("drag", dragged_opendoc).on("end", dragended_opendoc);

	var nodeEnter_opendoc = _node_opendoc.enter().append("g").attr("class", "node")
						.attr("transform",_svg_movement_opendoc)
						.on("click", nClick_opendoc)
						.on("mouseover", mouseover_opendoc)
						.on("mouseout", mouseout_opendoc)
						.call(_drag_opendoc);

	// 검색어/1레벨/2레벨 적용
	nodeEnter_opendoc.filter(function (d) { return (d.level != 3) ? true : false;})
		 	 .append("polygon")
		  	 .attr('points', getHexagonSize_opendoc(44, 38))
		 	 .attr('fill', function (d) {
					if(d.level == 0){
						return "#a1b3d1";
					} else if(d.level == 1){
						return "#fff";
					} else if(d.level == 2){
						return "#fff";
					}
				})
		 	 .style("stroke", function (d) {
					if(d.level == 0){
						return "#0b4094";
					} else if(d.level == 1){
						return "#6a8abd";
					} else if(d.level == 2){
						return "#fecd17";
					}
				})
		 	 .style("stroke-width", "2px")
		 	 .style("stroke-opacity", "1");

	// 3레벨 적용
	nodeEnter_opendoc.filter(function (d) { return (d.level == 3) ? true : false;})
			 .append("circle")
			 .attr("r", "30px")
			 .attr('fill', "#d6dde9")
			 .style("stroke", "#9caac2")
			 .style("stroke-width", "1.5px")
			 .style("stroke-opacity", "0");

	// 타이틀
//	nodeEnter_opendoc.append("title").text(function(d) { return d.title; })
	nodeEnter_opendoc.filter(function (d) { return (d.level == 0) ? true : false;})
		.append("text")
		.attr("dy","-4")
		.attr("x","0")
		.attr("y","0")
		.attr("text-anchor","middle")
		.attr("font-weight","bold")
		.attr("font-size","19px")
		.text(function(d) { return d.title; })

	nodeEnter_opendoc.filter(function (d) { return (d.level == 0) ? true : false;})
		.append("text")
		.attr("dy","13")
		.attr("x","0")
		.attr("y","0")
		.attr("text-anchor","middle")
		.attr("font-weight","200")
		.attr("font-size","11px")
		.text(function(d) { return brm_list.length + "건"; })
		
	nodeEnter_opendoc.filter(function (d) { return (d.level != 0) ? true : false;})
		.append("text")
		.attr("x","0")
		.attr("y","0")
		.attr("text-anchor","middle")
		.text(function(d) { return d.title; })

	// 초기 조회 시 disable 효과 적용(검색어관련 데이터)

	_node_opendoc = nodeEnter_opendoc.merge(_node_opendoc);

	/*************************** 노드 처리 end ***************************/
	
	_simulation_opendoc.nodes(nodes);
	_simulation_opendoc.force("link").links(links);
	
	
}

function nClick_opendoc(d) {
	
	if(d.level == 3){
		go_searchData(d.idx, "openDoc");
	}
}
	
function getHexagonSize_opendoc(wid, hei){
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
function dragstarted_opendoc(d) {
	if (!d3.event.active){
		_simulation_opendoc.alphaTarget(0.3).restart()
	}
}

function dragged_opendoc(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended_opendoc(d) {
  if (!d3.event.active) {
	  _simulation_opendoc.alphaTarget(0);
  }

  d.fx = undefined;
  d.fy = undefined;
}

function zoomstart_opendoc(d) {
	_svg_opendoc.attr("transform", _svg_movement_opendoc);
}

function zoomed_opendoc(d) {
	var ratio = d3.event.transform.k;
	if (ratio > 5)
		ratio = 5;
	if (ratio < 0.1)
		ratio = 0.1;

	_svg_opendoc.attr("transform", d3.event.transform);

	
	if(ratio > 0.6){
		d3.selectAll('g.node > text').style('display', '')
	}
	if(ratio > 2.3){
		d3.selectAll('g.node > .node-title').text(function(d) { return d.title});
	}
}

function zoomend_opendoc(d) {
	_svg_movement_opendoc = _svg_opendoc.attr("transform");
}

//눈금 이동별 좌표계산
function ticked_opendoc() {
	_node_opendoc.attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
	/*_node.attr("cx", function(d) { return d.x; })
      	 .attr("cy", function(d) { return d.y; });*/

	_link_opendoc.attr("x1", function(d) {
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

function mouseover_opendoc(d) {
	if(d.level === 3){
		/*d3.select(this).selectAll("text").transition()
	      .attr("font-size", "13px");*/
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "27px";
		});
	}
}

function mouseout_opendoc(d) {
	if(d.level === 3){
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "16px";
		});
	}
}