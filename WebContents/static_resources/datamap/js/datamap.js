
var treeColorSet = [ '#59bba5', '#d96bb6', '#f37553', '#f5b474', '#f2b82f', '#d04a26', '#69b9d3', '#8560e3'
					,'#d67144', '#76c97b', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff', '#4c72ff'];

var treeBrmColors = {};
var keywordParams = {b1: null, b2: null};

var last_data = null;
var last_opt = null;


function go_searchData(brm_level3_nm){
	location.href = "/search/dataSearch?keyword=" + brm_level3_nm;
}


$(function(){
	go_search();
});

function go_search(){
	
	var searchVal = $("#searchVal").val();
	
	var params;
	if(cf_isEmpty(searchVal)){
		params = {};
	} else {
		params = {searchVal : searchVal};
	}
	cf_ajax("/search/dataMap/getData", params, go_searchCB);
}

function go_searchCB(rslt){	
	draw_main_treemap(rslt);
	if(!cf_isEmpty(rslt.searchVal)){
//		convertRelationGraphData_internal(rslt);
		convertRelationGraphData_external(rslt);
	}
}

function draw_main_treemap(rslt) {		// 분류체계 초기조회
	
	var brm_list = rslt.rslt_data_total;

	var brm_data = {};
	for(var i=0; i<brm_list.length; i++) {
	    var o = brm_list[i];
	    
	    var child_obj = {
			name: o.brm_level2_nm,
			value: Number(o.count),
		};
		
	    var brm1 = o.brm_level1_nm;
	    var tmp_child;
	    if (brm1 in brm_data) {
			tmp_child = brm_data[brm1]['children'].getElementFirst("name", child_obj.name);
			if(tmp_child == null){
	       		brm_data[brm1]['children'].push(child_obj)
			} else {
				tmp_child.value += child_obj.value;
			}
	    } else {
	        brm_data[brm1] = {
				name: brm1, 
				children: [child_obj],
			}
	    }
	}
//	console.log(brm_data);
	var tree_data = [];
	tree_data = Object.keys(brm_data).map(function(e) { return brm_data[e]; });
//	console.log(tree_data);
	// 중앙의 차트를 구현
	draw_treemap({name: "treemap", children: tree_data}, rslt);
	// 사이드의 트리맵을 구현
	draw_treenavi(tree_data, rslt);
}
		
function draw_treemap(data) {
    $('#treemap').empty();
    
	var el_treemap = $('#treemap').get(0);
    var tr_width = el_treemap.clientWidth;
    var tr_height = el_treemap.clientHeight;

    var tr_root = d3.hierarchy(data);
    tr_root
        .sum(function (d) {
            return d.value;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

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
	
			if(d.data.colorIdx !== undefined){
				return treeColorSet[d.data.colorIdx];
			} else {
	    		var colorIdx = i % treeColorSet.length;
	        	d.colorIdx = colorIdx;
	        	treeBrmColors[d.data.name] = colorIdx;
	            return treeColorSet[colorIdx];
			}
	
        })
        .attr("opacity", function(d, i) {
    		return 1.0;
        })
        .on("click", function (d) {
			go_searchData(d.data.name);
        })

    var tooltip = d3.select(".content")
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
            var x_offset = $('#treemap').offset().left;
            var y_offset = $('#treemap').offset().top;
            return tooltip
            	.style("left", d.x0 + x_offset + "px")
            	.style("top", d.y0 + y_offset + "px")
                .text((d.data.name ? d.data.name : "미분류") + " : " + d.data.value.numformat())
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

    g.filter(function (d) {
        return d.depth == 1;
    }).each(function (d, i) {
    	var per = (d.value / tr_root.value * 100).toFixed(1);
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
           .attr("dy", "0.8em")
           .on("click", function () {
				if(!d.data.children){
					go_searchData(d.data.name);
				}
	        })

    	if(0 == nameArray.length){	//자르지 않은 분류명
    		d3.select("#t"+i)
              .append("tspan")
              .attr("x", d.x0 + 3)
              .attr("dy", "0.8em")
              .attr("font-size", font_size + "px")
              .attr("class", "node-label")
              .attr("fill", "#ffffff")
              .attr("opacity", 1)
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
                  .attr("fill", "#ffffff")
                  .attr("opacity", 1)
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
          .attr("fill", "#ffffff")
          .attr("opacity", 1)
          .text(per + '%');
    })
}


function draw_treenavi(tree_data, rslt){
	var treenavi_data = makeTreeData(tree_data);
	var treedata = tree_data;

	for(var i=0; i<treedata.length; i++){
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
	        	click_on_brm(brm1, brm2, rslt);
	        }
		});
}


function click_on_brm(brm1, brm2, rslt){
	
	var brm_list = rslt.rslt_data_total.getElementList("brm_level1_nm",brm1);
	brm_list =brm_list.getElementList("brm_level2_nm",brm2);
	
	brm_list = brm_list.slice(0, 40); // 최대 40개까지만 표현한다.
	
	colorIdx = treeBrmColors[brm1];
	
	// loadingStart("contents");
	var tree_data = [];
    for(var i=0; i<brm_list.length; i++) {
    	var o = brm_list[i];
        tree_data.push({
            name: o.brm_level3_nm,
            value: Number(o.count),
            cnt: Number(o.count),
            colorIdx: colorIdx
        });
    }
    draw_treemap({name: "treemap", children: tree_data}, rslt);
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
			//expand_selected_onload : false
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

var _simulation_int;
var _link_int;
var _node_int;
var _svg_movement_int;
var _svg_int;
function convertRelationGraphData_internal(rslt) {

	var nodes = [];
	var links = [];
	var brm_list = rslt.rslt_data_internal;
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
		brm_level1_nm : "",
		brm_level2_nm : "",
		brm_level3_nm : "",
	}	
	nodes.push(item);
	
	// 1레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.brm_level1_nm) continue;
		tmpLvNm = o.brm_level1_nm;
		
		lv1 = nodes
			.getElementFirst("brm_level1_nm", o.brm_level1_nm);
		if(lv1 == null){
			++id;
			item = {
				title : o.brm_level1_nm,
				id : id,
				level : 1,
				brm_level1_nm : o.brm_level1_nm,
				brm_level2_nm : "",
				brm_level3_nm : "",
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
		
		if(tmpLvNm === o.brm_level2_nm) continue;
		tmpLvNm = o.brm_level2_nm;
		
		lv2 = nodes
			.getElementList("brm_level1_nm", o.brm_level1_nm)
			.getElementFirst("brm_level2_nm", o.brm_level2_nm);
		if(lv2 == null){
			
			upId = nodes
				.getElementFirst("brm_level1_nm", o.brm_level1_nm)
				.id;
			
			++id;
			item = {
				title : o.brm_level2_nm,
				id : id,
				level : 2,
				brm_level1_nm : o.brm_level1_nm,
				brm_level2_nm : o.brm_level2_nm,
				brm_level3_nm : "",
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
		
		if(tmpLvNm === o.brm_level3_nm) continue;
		tmpLvNm = o.brm_level3_nm;
		
		lv3 = nodes
			.getElementList("brm_level1_nm", o.brm_level1_nm)
			.getElementList("brm_level2_nm", o.brm_level2_nm)
			.getElementFirst("brm_level3_nm", o.brm_level3_nm);
		if(lv3 == null){
			
			upId = nodes
				.getElementList("brm_level1_nm", o.brm_level1_nm)
				.getElementFirst("brm_level2_nm", o.brm_level2_nm)
				.id;
			
			++id;
			item = {
				title : o.brm_level3_nm,
				id : id,
				level : 3,
				brm_level1_nm : o.brm_level1_nm,
				brm_level2_nm : o.brm_level2_nm,
				brm_level3_nm : o.brm_level3_nm,
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

	var el_treemap_int = $('#treemap_int').get(0);

	$(el_treemap_int).empty();
	if(_simulation_int) _simulation_int.stop();

	var _svgWidth_int = Math.max($('#treemap_int').width());
	var _svgHeight_int = Math.max($('#treemap_int').height());

	_simulation_int = d3.forceSimulation()
					.force("link", d3.forceLink().id(function(d) {return d.id;}).strength(0.5))
					.force("charge", d3.forceManyBody().strength(-200))
					.force("collision", d3.forceCollide(50).strength(0.35))
					.force('radial', d3.forceRadial(function(d) {
						var radial;
						 	if(d.level === 0){
						 		radial = 0;
							} else if(d.level === 1){
								radial = 100;
							} else if(d.level === 2){
								radial = 300;
							} else if(d.level === 3){
								radial = 500;
							}
						return radial;
					  }, _svgWidth_int * 0.5, _svgHeight_int * 0.5))
					.force('center', d3.forceCenter().x(_svgWidth_int * 0.5).y(_svgHeight_int * 0.5))
					.on('tick', ticked_int);

	_svg_int = d3.select(el_treemap_int).append("g").attr("class", "canvas");
	_svg_movement_int = "scale(0.7561092920321959)";
	_svg_int.attr("transform", _svg_movement_int);
	
	var _zoom_int = d3.zoom().scaleExtent([0.4, 5]).on("start", zoomstart_int).on("zoom", zoomed_int).on("end", zoomend_int);

	var _container_int = d3.select(el_treemap_int)
	 			   .attr("width", _svgWidth_int)
	 			   .attr("height", _svgHeight_int)
	 			   .style("background-color", "#ffffff")
	 			   .call(_zoom_int)
	 			   .on("dblclick.zoom", null);


	var _color_int = d3.scaleOrdinal(d3.schemeCategory20);

	var _drag_int = d3.drag().on("start", dragstarted_int).on("drag", dragged_int).on("end", dragended_int);

	// filters 그림자 효과 추가
	var defs_int = _container_int.append("defs");
	var filter_int = defs_int.append("filter").attr("id", "drop-shadow").attr("height", "150%");
	filter_int.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
	filter_int.append("feOffset").attr("in", "blur").attr("dx", 1).attr("dy", 8).attr("result", "offsetBlur");
	var feMerge_int = filter_int.append("feMerge");
	feMerge_int.append("feMergeNode").attr("in", "offsetBlur");
	feMerge_int.append("feMergeNode").attr("in", "SourceGraphic");

	$('#treemap_int').find('g.canvas').empty();

	/*************************** 링크 처리 start ***************************/

	_link_int = _svg_int.append("g").selectAll(".link").data(links, function(d) { return d.target; });

	var linkEnter_int = _link_int.enter().append("line")
							.attr("class", "link");
	
	linkEnter_int.filter(function (d) { return true;})
			 .attr("stroke", function(d) {
				 var result;
				 if(d.lvl == 1){
					 result = "#bcaee1";
				 } else if(d.lvl == 2){
					 result = "#f7cca2";
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

	_link_int = linkEnter_int.merge(_link_int);

	/*************************** 링크 처리 end ***************************/

	_node_int = _svg_int.append("g").selectAll(".node").data(nodes, function(d) { return d.id; });

	var nodeEnter_int = _node_int.enter().append("g").attr("class", "node")
						.attr("transform",_svg_movement_int)
						.on("click", nClick_int)
						.on("mouseover", mouseover_int)
						.on("mouseout", mouseout_int)
						.call(_drag_int);

	// 검색어/1레벨/2레벨 적용
	nodeEnter_int.filter(function (d) { return (d.level != 3) ? true : false;})
		 	 .append("polygon")
		  	 .attr('points', getHexagonSize_int(44, 38))
		 	 .attr('fill', function (d) {
					if(d.level == 0){
						return "#5d3cb6";
					} else if(d.level == 1){
						return "#F6871C";
					} else if(d.level == 2){
						return "brown";
					}
				})
		 	 .style("stroke", function (d) {
					if(d.level == 0){
						return "#bcaee1";
					} else if(d.level == 1){
						return "#f7cca2";
					} else if(d.level == 2){
						return "orange";
					}
				})
		 	 .style("stroke-width", "4px")
		 	 .style("stroke-opacity", "1");

	// 3레벨 적용
	nodeEnter_int.filter(function (d) { return (d.level == 3) ? true : false;})
			 .append("circle")
			 .attr("r", "24px")
			 .attr('fill', "#4bd3cb")
			 .style("stroke", "#000000")
			 .style("stroke-width", "1.5px")
			 .style("stroke-opacity", "0");

	// 타이틀
//	nodeEnter_int.append("title").text(function(d) { return d.title; })
	nodeEnter_int.append("text").text(function(d) { return d.title; })

	// 초기 조회 시 disable 효과 적용(검색어관련 데이터)

	_node_int = nodeEnter_int.merge(_node_int);

	/*************************** 노드 처리 end ***************************/
	
	_simulation_int.nodes(nodes);
	_simulation_int.force("link").links(links);

}

function nClick_int(d) {
	
	if(d.level == 3){
		go_searchData(d.title);
	}
}
	
function getHexagonSize_int(wid, hei){
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
function dragstarted_int(d) {
	if (!d3.event.active){
		_simulation_int.alphaTarget(0.3).restart()
	}
}

function dragged_int(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended_int(d) {
  if (!d3.event.active) {
	  _simulation_int.alphaTarget(0);
  }

  d.fx = undefined;
  d.fy = undefined;
}

function zoomstart_int(d) {
	_svg_int.attr("transform", _svg_movement_int);
}

function zoomed_int(d) {
	var ratio = d3.event.transform.k;
	if (ratio > 5)
		ratio = 5;
	if (ratio < 0.1)
		ratio = 0.1;

	_svg_int.attr("transform", d3.event.transform);

	
	if(ratio > 0.6){
		d3.selectAll('g.node > text').style('display', '')
	}
	if(ratio > 2.3){
		d3.selectAll('g.node > .node-title').text(function(d) { return d.title});
	}
}

function zoomend_int(d) {
	_svg_movement_int = _svg_int.attr("transform");
}

//눈금 이동별 좌표계산
function ticked_int() {
	_node_int.attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
	/*_node.attr("cx", function(d) { return d.x; })
      	 .attr("cy", function(d) { return d.y; });*/

	_link_int.attr("x1", function(d) {
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

function mouseover_int(d) {
	if(d.level === 3){
		/*d3.select(this).selectAll("text").transition()
	      .attr("font-size", "13px");*/
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "27px";
		});
	}
}

function mouseout_int(d) {
	if(d.level === 3){
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "16px";
		});
	}
}


///////////////////////////////////////////////////////////////////////////////



var _simulation_ext;
var _link_ext;
var _node_ext;
var _svg_movement_ext;
var _svg_ext;
function convertRelationGraphData_external(rslt){

	var nodes = [];
	var links = [];
	var brm_list = rslt.rslt_data_external;
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
		brm_level1_nm : "",
		brm_level2_nm : "",
		brm_level3_nm : "",
	}	
	nodes.push(item);
	
	// 1레벨 등록하기
	tmpLvNm = "";
	for(var i=0; i<brm_list.length; i++){
		o = brm_list[i];
		
		if(tmpLvNm === o.brm_level1_nm) continue;
		tmpLvNm = o.brm_level1_nm;
		
		lv1 = nodes
			.getElementFirst("brm_level1_nm", o.brm_level1_nm);
		if(lv1 == null){
			++id;
			item = {
				title : o.brm_level1_nm,
				id : id,
				level : 1,
				brm_level1_nm : o.brm_level1_nm,
				brm_level2_nm : "",
				brm_level3_nm : "",
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
		
		if(tmpLvNm === o.brm_level2_nm) continue;
		tmpLvNm = o.brm_level2_nm;
		
		lv2 = nodes
			.getElementList("brm_level1_nm", o.brm_level1_nm)
			.getElementFirst("brm_level2_nm", o.brm_level2_nm);
		if(lv2 == null){
			
			upId = nodes
				.getElementFirst("brm_level1_nm", o.brm_level1_nm)
				.id;
			
			++id;
			item = {
				title : o.brm_level2_nm,
				id : id,
				level : 2,
				brm_level1_nm : o.brm_level1_nm,
				brm_level2_nm : o.brm_level2_nm,
				brm_level3_nm : "",
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
		
		if(tmpLvNm === o.brm_level3_nm) continue;
		tmpLvNm = o.brm_level3_nm;
		
		lv3 = nodes
			.getElementList("brm_level1_nm", o.brm_level1_nm)
			.getElementList("brm_level2_nm", o.brm_level2_nm)
			.getElementFirst("brm_level3_nm", o.brm_level3_nm);
		if(lv3 == null){
			
			upId = nodes
				.getElementList("brm_level1_nm", o.brm_level1_nm)
				.getElementFirst("brm_level2_nm", o.brm_level2_nm)
				.id;
			
			++id;
			item = {
				title : o.brm_level3_nm,
				id : id,
				level : 3,
				brm_level1_nm : o.brm_level1_nm,
				brm_level2_nm : o.brm_level2_nm,
				brm_level3_nm : o.brm_level3_nm,
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

	var el_treemap_ext = $('#treemap_ext').get(0);

	$(el_treemap_ext).empty();
	if(_simulation_ext) _simulation_ext.stop();

	var _svgWidth_ext = Math.max($('#treemap_ext').width());
	var _svgHeight_ext = Math.max($('#treemap_ext').height());

	_simulation_ext = d3.forceSimulation()
					.force("link", d3.forceLink().id(function(d) {return d.id;}).strength(0.5))
					.force("charge", d3.forceManyBody().strength(-200))
					.force("collision", d3.forceCollide(50).strength(0.35))
					.force('radial', d3.forceRadial(function(d) {
						var radial;
						 	if(d.level === 0){
						 		radial = 0;
							} else if(d.level === 1){
								radial = 100;
							} else if(d.level === 2){
								radial = 300;
							} else if(d.level === 3){
								radial = 500;
							}
						return radial;
					  }, _svgWidth_ext * 0.5, _svgHeight_ext * 0.5))
					.force('center', d3.forceCenter().x(_svgWidth_ext * 0.5).y(_svgHeight_ext * 0.5))
					.on('tick', ticked_ext);

	_svg_ext = d3.select(el_treemap_ext).append("g").attr("class", "canvas");
	_svg_movement_ext = "translate(150,50)scale(1)";
	_svg_ext.attr("transform", _svg_movement_ext);
	
	var _zoom_ext = d3.zoom().scaleExtent([0.4, 5]).on("start", zoomstart_ext).on("zoom", zoomed_ext).on("end", zoomend_ext);

	var _container_ext = d3.select(el_treemap_ext)
	 			   .attr("width", _svgWidth_ext)
	 			   .attr("height", _svgHeight_ext)
	 			   .style("background-color", "#ffffff")
	 			   .call(_zoom_ext)
	 			   .on("dblclick.zoom", null);


	var _color_ext = d3.scaleOrdinal(d3.schemeCategory20);

	var _drag_ext = d3.drag().on("start", dragstarted_ext).on("drag", dragged_ext).on("end", dragended_ext);

	// filters 그림자 효과 추가
	var defs_ext = _container_ext.append("defs");
	var filter_ext = defs_ext.append("filter").attr("id", "drop-shadow").attr("height", "150%");
	filter_ext.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
	filter_ext.append("feOffset").attr("in", "blur").attr("dx", 1).attr("dy", 8).attr("result", "offsetBlur");
	var feMerge_ext = filter_ext.append("feMerge");
	feMerge_ext.append("feMergeNode").attr("in", "offsetBlur");
	feMerge_ext.append("feMergeNode").attr("in", "SourceGraphic");

	$('#treemap_ext').find('g.canvas').empty();

	/*************************** 링크 처리 start ***************************/

	_link_ext = _svg_ext.append("g").selectAll(".link").data(links, function(d) { return d.target; });

	var linkEnter_ext = _link_ext.enter().append("line")
							.attr("class", "link");
	
	linkEnter_ext.filter(function (d) { return true;})
			 .attr("stroke", function(d) {
				 var result;
				 if(d.lvl == 1){
					 result = "#bcaee1";
				 } else if(d.lvl == 2){
					 result = "#f7cca2";
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

	_link_ext = linkEnter_ext.merge(_link_ext);

	/*************************** 링크 처리 end ***************************/

	_node_ext = _svg_ext.append("g").selectAll(".node").data(nodes, function(d) { return d.id; });

	var nodeEnter_ext = _node_ext.enter().append("g").attr("class", "node")
						.attr("transform",_svg_movement_ext)
						.on("click", nClick_ext)
						.on("mouseover", mouseover_ext)
						.on("mouseout", mouseout_ext)
						.call(_drag_ext);

	// 검색어/1레벨/2레벨 적용
	nodeEnter_ext.filter(function (d) { return (d.level != 3) ? true : false;})
		 	 .append("polygon")
		  	 .attr('points', getHexagonSize_ext(44, 38))
		 	 .attr('fill', function (d) {
					if(d.level == 0){
						return "#5d3cb6";
					} else if(d.level == 1){
						return "#F6871C";
					} else if(d.level == 2){
						return "brown";
					}
				})
		 	 .style("stroke", function (d) {
					if(d.level == 0){
						return "#bcaee1";
					} else if(d.level == 1){
						return "#f7cca2";
					} else if(d.level == 2){
						return "orange";
					}
				})
		 	 .style("stroke-width", "4px")
		 	 .style("stroke-opacity", "1");

	// 3레벨 적용
	nodeEnter_ext.filter(function (d) { return (d.level == 3) ? true : false;})
			 .append("circle")
			 .attr("r", "24px")
			 .attr('fill', "#4bd3cb")
			 .style("stroke", "#000000")
			 .style("stroke-width", "1.5px")
			 .style("stroke-opacity", "0");

	// 타이틀
//	nodeEnter_ext.append("title").text(function(d) { return d.title; })
	nodeEnter_ext.append("text").text(function(d) { return d.title; })

	// 초기 조회 시 disable 효과 적용(검색어관련 데이터)

	_node_ext = nodeEnter_ext.merge(_node_ext);

	/*************************** 노드 처리 end ***************************/
	
	_simulation_ext.nodes(nodes);
	_simulation_ext.force("link").links(links);
	
	
}

function nClick_ext(d) {
	
	if(d.level == 3){
		go_searchData(d.title);
	}
}
	
function getHexagonSize_ext(wid, hei){
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
function dragstarted_ext(d) {
	if (!d3.event.active){
		_simulation_ext.alphaTarget(0.3).restart()
	}
}

function dragged_ext(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended_ext(d) {
  if (!d3.event.active) {
	  _simulation_ext.alphaTarget(0);
  }

  d.fx = undefined;
  d.fy = undefined;
}

function zoomstart_ext(d) {
	_svg_ext.attr("transform", _svg_movement_ext);
}

function zoomed_ext(d) {
	var ratio = d3.event.transform.k;
	if (ratio > 5)
		ratio = 5;
	if (ratio < 0.1)
		ratio = 0.1;

	_svg_ext.attr("transform", d3.event.transform);

	
	if(ratio > 0.6){
		d3.selectAll('g.node > text').style('display', '')
	}
	if(ratio > 2.3){
		d3.selectAll('g.node > .node-title').text(function(d) { return d.title});
	}
}

function zoomend_ext(d) {
	_svg_movement_ext = _svg_ext.attr("transform");
}

//눈금 이동별 좌표계산
function ticked_ext() {
	_node_ext.attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
	/*_node.attr("cx", function(d) { return d.x; })
      	 .attr("cy", function(d) { return d.y; });*/

	_link_ext.attr("x1", function(d) {
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

function mouseover_ext(d) {
	if(d.level === 3){
		/*d3.select(this).selectAll("text").transition()
	      .attr("font-size", "13px");*/
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "27px";
		});
	}
}

function mouseout_ext(d) {
	if(d.level === 3){
		d3.select(this).selectAll("text").transition().attr("font-size", function(dd, i) {
			return "16px";
		});
	}
}