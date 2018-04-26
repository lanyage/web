var $layout = null, $innerLayout = null;
var $west = true, $east = true, $south = true;
var Calibration = {
	$id : 'calibration', $isAnalysis : 'false', $map : {},
	$plan : null, $plans : [], $rap : null, $raps : [], $tag : null, $tags : new HashMap(), $beenTags : new HashMap(),
	$barrier : null, $barriers : [], $sectors : [], $sector : null, $syncs : new HashMap(), $sync : null, 
	$dbsectors : [], $expansions : [],
	$tagWorks : new HashMap(), $reportWorks : new HashMap(),
	$radio : {threshold : 10, decrease : 0.2}, 
	$timer : null,
	start : function(planId){
		if(planId != undefined || planId != null){
			this.$plan = {'planId' : planId};
		}else{
			this.$plan = {'planId' : 0};
		}
		
		
		Calibration.$timer = $.timer(Calibration.worker.updateReport);
		Calibration.$timer.set({ time : 5000, autostart : false });
		
		Calibration.ui.layout();
		Calibration.ui.menu();
		Calibration.ui.plan();
		Calibration.ui.map();	
		Calibration.ui.rap();
		Calibration.ui.tag();
		Calibration.ui.barrier();
		Calibration.ui.analysis();
		Calibration.ui.sector();
		Calibration.ui.sync();
		Calibration.notify.init();
	},
	ui : {
		layout : function(){
			$layout = $('body').layout({
				center__paneSelector :  ".outer-layout-center",
				west__paneSelector :	".outer-layout-west",
				east__paneSelector :	".outer-layout-east",
				south__paneSelector :   ".outer-layout-south",
				north__paneSelector :   ".outer-layout-north",
				north__size: 40,
				north__minSize : 40,
				west__size:	200,
				west__minSize : 200,
				east__size:	220,
				east__minSize : 220,
				south__initClosed : true,
				spacing_open : 4,
				spacing_closed:	4,
				south__spacing_closed :	0,
				north__spacing_open:	0,
				north__spacing_closed:	0,
				center__onresize : "$innerLayout.resizeAll",
				west__onclose_end: function(){
					$west = false;
					Calibration.ui.changeLayoutToolbar();
				},
				west__onopen_end: function(){
					$west = true;
					Calibration.ui.changeLayoutToolbar();
				},
				east__onclose_end: function(){
					$east = false;
					Calibration.ui.changeLayoutToolbar();
				},
				east__onopen_end: function(){
					$east = true;
					Calibration.ui.changeLayoutToolbar();
				},
			});
			$innerLayout = $('div.outer-layout-center').layout({
				center__paneSelector:	".inner-layout-center",
				west__paneSelector:		".inner-layout-west",
				east__paneSelector:		".inner-layout-east",
				south__paneSelector:	".inner-layout-south",
				north__paneSelector:	".inner-layout-north",
				west__initClosed :      true,
				east__initClosed :      true,
				north__initClosed :	    true,
				south__size:			200, 
				spacing_open:	4,
				spacing_closed:	4,
				west__spacing_closed:	0,
				east__spacing_closed:	0,
				north__spacing_closed:	0,
				center__onresize_end:function () {  
					var h = $('.outer-layout-center > .inner-layout-center').height();
					$('#viewport-outdoor').css('height', h+'px');
					Calibration.$map.resize();
				},
				south__onclose_end: function(){
					$south = false;
					Calibration.ui.changeLayoutToolbar();
				},
				south__onopen_end: function(){
					$south = true;
					Calibration.ui.changeLayoutToolbar();
				},
			});
			$( "#tabs" ).tabs();
		},
		changeLayoutToolbar : function(){
			if($west && $east && $south){
				$('#but-layout-01').addClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else if($west && $east && !$south){
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').addClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else if($west && !$east && $south){
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').addClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else if(!$west && $east && $south){
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').addClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else if(!$west && !$east && $south){
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').addClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else if($west && !$east && !$south){
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').addClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else if(!$west && $east && !$south){
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').addClass('ui-selected');
				$('#but-layout-08').removeClass('ui-selected');
			}else{
				$('#but-layout-01').removeClass('ui-selected');
				$('#but-layout-02').removeClass('ui-selected');
				$('#but-layout-03').removeClass('ui-selected');
				$('#but-layout-04').removeClass('ui-selected');
				$('#but-layout-05').removeClass('ui-selected');
				$('#but-layout-06').removeClass('ui-selected');
				$('#but-layout-07').removeClass('ui-selected');
				$('#but-layout-08').addClass('ui-selected');
			}
		},
		menu : function(){ // menu 
			var html = '';
			html += '<div id="calibration-toolbar" style="padding:2px 2px 2px 2px; border: 1px solid #dcdcdc;float:left">';
			html += '<ol id="view-selectable">';
			html += '	<li id="but-map" title="Map view" class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_map_on.png"/> Map</li>';
			html += '	<li id="but-report" title="Report view" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_report_off.png"/> Report</li>';
			html += '</ol>';
			html += '</div>';
			html += '<div id="layout-toolbar" style="padding:2px 2px 2px 2px; border: 1px solid #dcdcdc;float:right">';
			html += '<ol id="layout-selectable">';
			html += '	<li id="but-layout-01" title="Layout01" class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_01.png"/></li>';
			html += '	<li id="but-layout-02" title="Layout02" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_02.png"/></li>';
			html += '	<li id="but-layout-03" title="Layout03" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_03.png"/></li>';
			html += '	<li id="but-layout-04" title="Layout04" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_04.png"/></li>';
			html += '	<li id="but-layout-05" title="Layout05" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_05.png"/></li>';
			html += '	<li id="but-layout-06" title="Layout06" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_06.png"/></li>';
			html += '	<li id="but-layout-07" title="Layout07" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_07.png"/></li>';
			html += '	<li id="but-layout-08" title="Layout08" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/layout/icon_layout_08.png"/></li>';
			html += '</ol>';
			html += '</div>';
			$('#menubar').html(html);
			var calibrationToolbar = $('#calibration-toolbar');
			if(calibrationToolbar != undefined){
				calibrationToolbar.find('#but-planning').click(function(e) {
					window.location='/service/calibration.action?pages=service.calibration.planning&planId='+Calibration.$plan.planId;
				});
				calibrationToolbar.find('#but-analyzer').click(function(e) {
					
				});
			}
			var calibrationToolbar = $('#calibration-toolbar');
			if(calibrationToolbar != undefined){
				calibrationToolbar.find('#but-map').click(function(e) {
					$('#viewport-expansion').hide();
					$('#viewport-report').hide();
					$('#viewport').show();
					
					$('#but-map > img').attr('src' , '/resources/commons/images/3d/icon_map_on.png');
					$('#but-map').addClass('ui-selected');
					$('#but-report > img').attr('src' , '/resources/commons/images/3d/icon_report_off.png');
					$('#but-report').removeClass('ui-selected');
				});
				calibrationToolbar.find('#but-report').click(function(e) {
					$('#viewport-report').show();
					$('#viewport').hide();
					$('#viewport-expansion').hide();
					$('#but-map > img').attr('src' , '/resources/commons/images/3d/icon_map_off.png');
					$('#but-map').removeClass('ui-selected');
					$('#but-report > img').attr('src' , '/resources/commons/images/3d/icon_report_on.png');
					$('#but-report').addClass('ui-selected');
					
					var text = $('#viewport-report').text();
					if(text.length == 0) Calibration.report.form();
				});
			}
			var layoutToolbar = $('#layout-toolbar');
			if(layoutToolbar != undefined){
				layoutToolbar.find('#but-layout-01').click(function(e) {
					$layout.open('west');
					$layout.open('east');
					$innerLayout.open('south');
				});
				layoutToolbar.find('#but-layout-02').click(function(e) {
					$layout.open('west');
					$layout.open('east');
					$innerLayout.close('south');
				});
				layoutToolbar.find('#but-layout-03').click(function(e) {
					$layout.open('west');
					$layout.close('east');
					$innerLayout.open('south');
				});
				layoutToolbar.find('#but-layout-04').click(function(e) {
					$layout.close('west');
					$layout.open('east');
					$innerLayout.open('south');
				});
				layoutToolbar.find('#but-layout-05').click(function(e) {
					$layout.close('west');
					$layout.close('east');
					$innerLayout.open('south');
				});
				layoutToolbar.find('#but-layout-06').click(function(e) {
					$layout.open('west');
					$layout.close('east');
					$innerLayout.close('south');
				});
				layoutToolbar.find('#but-layout-07').click(function(e) {
					$layout.close('west');
					$layout.open('east');
					$innerLayout.close('south');
				});
				layoutToolbar.find('#but-layout-08').click(function(e) {
					$layout.close('west');
					$layout.close('east');
					$innerLayout.close('south');
				});
			}
		},
		plan : function(){ //도면선택
			Calibration.$plans = Calibration.get.plans();
			if(Calibration.$plan.planId == 0){
				Calibration.$plan = Calibration.$plans[0];
			}else{
				for(var i=0, len = Calibration.$plans.length; i < len; i++){
					if(Calibration.$plan.planId == Calibration.$plans[i].planId){
						Calibration.$plan = Calibration.$plans[i];
						break;
					}
				}
			}
			Calibration.$dbsectors = Calibration.get.sector();
			var html = '';
			html += '<div class="ui-accordion ui-widget ui-helper-reset">'
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.calibration.form.plan;
			html += '	</h3>';
			html += '</div>';
			html += '<ol id="plans" class="menu-selectable">';
			var planIx = 0;
			for(var i=0; i < Calibration.$plans.length; i++){
    			html += '<li><span class="ui-icon ui-icon-contact" style="float:left"></span> '+Calibration.$plans[i].name+'</li>';
				if(Calibration.$plans[i].planId == Calibration.$plan.planId){
					planIx = i;
				}
			}
			html += '</ol>';
			$('#plan_list').html(html);
			$('ol#plans li').eq(planIx).addClass('ui-selected');
			// 도면 선택 이벤트
			$("#plan_list #plans").selectable({
				stop : function () {
					$( ".ui-selected", this ).each(function() {
						var ix = $("#plan_list #plans li").index(this);
						if(Calibration.$plan.planId !=  Calibration.$plans[ix].planId){
							Calibration.$plan = Calibration.$plans[ix];
							Calibration.notify.close();
							Calibration.ui.map();	
							Calibration.ui.rap();
							Calibration.ui.tag();
							Calibration.ui.barrier();
							Calibration.ui.analysis();
							Calibration.$dbsectors = Calibration.get.sector();
		            		Calibration.ui.sector();
							Calibration.ui.sync();
							Calibration.notify.init();
						}
					});
				}
			});
		},
		rap : function(){ //rap 선택
			Calibration.$raps = Calibration.get.raps();
			var html = '';
			html += '<div class="ui-accordion ui-widget ui-helper-reset">'
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span> RAP';
			html += '	</h3>';
			html += '	<div style="clear:both"></div>';
			html += '</div>';
			html += '<ol id="raps" class="menu-selectable">';
			html += '</ol>';
			$('#rap_list').html(html);
			
			
			if(Calibration.$raps.length == 0){
				$('#rap_list #raps').append("<li class='ui-widget-content' style='height:22px' id='message'>"+$.rtls.calibration.rap.empty+"</li>");
			}else{
				var html = '', network = '', euid = '';
				var x = 0, y =0, z = 0;
				var masters = new Array() , master = {}, master2 = {}, master3 = {};
				$.eachAsync( Calibration.$raps, {
					delay : 1,
					bulk: 0,
					loop : function(ix, item){
						for(var j=0; j < Calibration.$raps.length; j++){
    						if(item.euidMaster == Calibration.$raps[j].euidSrc){
    							master = Calibration.$raps[j];
    						}else if(item.euidMaster2 == Calibration.$raps[j].euidSrc){
    							master2 = Calibration.$raps[j];
    						}else if(item.euidMaster3 == Calibration.$raps[j].euidSrc){
    							master3 = Calibration.$raps[j];
    						}
    					}
						euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
						if(item.networkType == '1') network = 'ethernet';
						else if(item.networkType == '2') network = 'wifi';
						else if(item.networkType == '3') network = 'lte';
						if(item.rcmMode == 1){
							masters.push(item);
							html = "<li class='ui-widget-content' style='height:22px' id='rap_"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_master_20x20.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
							item.marker = '<p id="rap_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-master" title="'+euid+'" type="'+item.rcmMode+'" ';
							item.marker += 'masterId="'+item.rapId+'" masterId2="0"  masterId3="0" ';
							item.marker += 'network="'+network+'" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"></p>';
						}else{
							html = "<li class='ui-widget-content' style='height:22px' id='rap_"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_20x20.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
							item.marker = '<p id="rap_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-slave" title="'+euid+'" type="'+item.rcmMode+'" ';
							item.marker += 'masterId="'+(master == null ? 0 : master.rapId)+'" masterId2="'+(master2 == null ? 0 : master2.rapId)+'" masterId3="'+(master3 == null ? 0 : master3.rapId)+'" ';
							item.marker += 'network="'+network+'" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"></p>';
						}
						item.id = 'rap_'+item.rapId;
						$('#rap_list #raps').append(html);
						Calibration.$map.marker.add(item, true, false, Calibration);
					},
					end : function(){
						// 도면 Master와의 거리 표현
	    				var path = '', text = '', x = 0, y = 0;
	    				var item = {};
	    				for(var i=0; i < Calibration.$raps.length; i++){
	    					item = Calibration.$raps[i];
	    					x = Math.round(item.localX);
	    					y = Math.round(item.localY);
							euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
							if(item.rcmMode == 2){
								text = '';
								for(var j=0; j < masters.length; j++){
			    					if(masters[j].euidSrc == item.euidMaster){
	    								path = 'M'+masters[j].localX+' '+masters[j].localY+'L'+item.localX+' '+item.localY+'Z';
	    								Calibration.$map.draw.line(path, 1, "#FF0000", 'dot', 'rap_line_1_'+item.rapId);
	    							}else if(masters[j].euidSrc == item.euidMaster2){
	    								path = 'M'+masters[j].localX+' '+masters[j].localY+'L'+item.localX+' '+item.localY+'Z';
	    								Calibration.$map.draw.line(path, 1, "#FF0000", 'dot', 'rap_line_2_'+item.rapId);
	    							}else if(masters[j].euidSrc == item.euidMaster3){
	    								path = 'M'+masters[j].localX+' '+masters[j].localY+'L'+item.localX+' '+item.localY+'Z';
	    								Calibration.$map.draw.line(path, 1, "#FF0000", 'dot', 'rap_line_3_'+item.rapId);
	    							}
	    						}
								if(item.masterCount == 1){
									text = item.masterDistance+'m';
								}else if(item.masterCount == 2){
									text = item.masterDistance+'m, '+item.masterDistance2+'m';
								}else if(item.masterCount == 3){
									text = item.masterDistance+'m, '+item.masterDistance2+'m, '+item.masterDistance3+'m';
								}
								
								Calibration.$map.draw.text(x+10, y + 20, euid+"("+text+")", 'rap_text_'+item.rapId, {'font-size':'14px', 'fill':'#000000', 'font-weight':'bold'});
							}else{
								Calibration.$map.draw.text(x, y + 20, euid, 'rap_text_'+item.rapId, {'font-size':'14px', 'fill':'#000000', 'font-weight':'bold'});
							}
	    				}
	    				// RAP 선택 이벤트
						$("#rap_list #raps").selectable({
							stop : function () {
								$( ".ui-selected", this ).each(function() {
									$('li', '#tags').removeClass('ui-selected');
									$('li', '#barriers').removeClass('ui-selected');
									$('li', '#sectors').removeClass('ui-selected');
									$('li', '#syncs').removeClass('ui-selected');
									var marker = Calibration.$map.marker.getItem($(this).attr('id'));
									Calibration.$map.marker.select(marker);
									var item = Calibration.$raps[$("#rap_list #raps li").index(this)];
									Calibration.edit.rap.form(item);
								});
							}
						});
					}
				});
			}
			
		},
		tag : function(){ //tag 선택
			var beenTags = Calibration.get.beenTags();
			for(var i=0, len = beenTags.length; i < len; i++){
				Calibration.$beenTags.put(beenTags[i].euid, beenTags[i]);
			}
			var tags = Calibration.get.tags();
			var html = '';
			html += '<div class="ui-accordion ui-widget ui-helper-reset">'
				html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span> TAG';
			html += '	</h3>';
			html += '	<div style="float:right"> ';
//			html += ' 		<button id="but-tagshow" style="padding: 4px; cursor: pointer;"></button>';
//			html += ' 		<button id="but-taghide" style="padding: 4px; cursor: pointer;"></button>';
			html += '	</div>';
			html += '	<div style="clear:both"></div>';
			html += '</div>';
			html += '<ol id="tags" class="menu-selectable">';
			var tag = {}, euid = '';
			for(var i=0, len = tags.length; i < len; i++){
				tag = tags[i];
				tag.ix = (i+1);
				tag.sector = new HashMap();
				tag.sector.put(tag.sectorX+"_"+tag.sectorY, 1);
				Calibration.$tags.put(tag.euid, tag);
				euid = tag.euid.substring(tag.euid.length-4, tag.euid.length);
				html += "<li class='ui-widget-content' style='height:22px;clear:both' id='tag_"+tag.euid+"'>";
				if(tag.type == 1){
					html += "<img src='/resources/commons/images/map/icon_tag_fixed.png'  style='float:left; padding-right:3px'/> ";	
				}else{
					html += "<img src='/resources/commons/images/map/icon_tag_move.png'  style='float:left; padding-right:3px'/> ";
				}
				html += euid+" [Sector "+tag.sectorX+","+tag.sectorY+"]";
				html += "</li>";
				if(tag.sectorX >=0 && tag.sectorY >= 0){
					if(tag.type == 1){
						tag.marker = '<p id="tag_'+tag.euid+'" name="marker" class="icon-tag-fixed" title="'+euid+'" type="11" sectorX="'+tag.sectorX+'" sectorY="'+tag.sectorY+'"';
						tag.marker += ' localX="'+tag.localX+'" localY="'+tag.localY+'" localZ="'+0+'"></p>';
	        		}else{
	        			tag.marker = '<p id="tag_'+tag.euid+'" name="marker" class="icon-tag-portable" title="'+euid+'" type="12" sectorX="'+tag.sectorX+'" sectorY="'+tag.sectorY+'" ';
	        			tag.marker += ' localX="'+tag.localX+'" localY="'+tag.localY+'" localZ="'+0+'"></p>';
	        		}
					tag.id = 'tag_'+tag.euid;
					Calibration.$map.marker.add(tag, true, true, Calibration);
					Calibration.$map.draw.text(Math.round(tag.localX), Math.round(tag.localY) + 18, euid, 'tag_text_'+tag.euid, {'font-size':'11px', 'fill':'#000000', 'font-weight':'bold'});	
				}
			}
			html += '</ol>';
			$('#tag_list').html(html);
			// 태그 선택 이벤트
			$("#tag_list #tags").selectable({
				stop : function () {
					$( ".ui-selected", this ).each(function() {
						$('li', '#raps').removeClass('ui-selected');
						$('li', '#barriers').removeClass('ui-selected');
						$('li', '#sectors').removeClass('ui-selected');
						$('li', '#syncs').removeClass('ui-selected');
						var marker = Calibration.$map.marker.getItem($(this).attr('id'));
						Calibration.$map.marker.select(marker);
						var ids = $(this).attr('id').split('_');
						var ix = $("#tag_list #tags li").index(this) + 1;
						Calibration.$tag = Calibration.$tags.get(ids[1]);
						Calibration.$tag.ix = ix;
						Calibration.edit.tag.form();
						
						
					});
				}
			});
//			// TAG 도면에 보이기
//			$("#but-tagshow").button({
//				icons: {primary: "ui-icon-image"}, text:false
//			}).click(function() {
//				var tags = Calibration.$tags.values(), euid = '';
//				for(var i=0, len = tags.length; i < len; i++){
//					var tag  = tags[i];
//					Calibration.$map.remove('tag_'+tag.euid)
//					if(tag.ix >=0 && tag.sectorX >=0 && tag.sectorY >= 0){
//						euid = tag.euid.substring(tag.euid.length - 4, tag.euid.length);
//						if(tag.type == 1){
//							tag.marker = '<p id="tag_'+tag.euid+'" name="marker" class="icon-tag-fixed" title="'+euid+'" type="11" sectorX="'+tag.sectorX+'" sectorY="'+tag.sectorY+'"';
//							tag.marker += ' localX="'+tag.localX+'" localY="'+tag.localY+'" localZ="'+0+'"></p>';
//	            		}else{
//	            			tag.marker = '<p id="tag_'+tag.euid+'" name="marker" class="icon-tag-portable" title="'+euid+'" type="12" sectorX="'+tag.sectorX+'" sectorY="'+tag.sectorY+'" ';
//	            			tag.marker += ' localX="'+tag.localX+'" localY="'+tag.localY+'" localZ="'+0+'"></p>';
//	            		}
//						tag.id = 'tag_'+tag.euid;
//						Calibration.$map.marker.add(tag, true, true, Calibration);
//						Calibration.$map.draw.text(Math.round(tag.localX), Math.round(tag.localY) + 18, euid, 'tag_'+tag.euid, {'font-size':'11px', 'fill':'#000000', 'font-weight':'bold'});
//					}
//				}
//				
//			});
			// TAG 도면에 숨기기
//			$("#but-taghide").button({
//				icons: {primary: "ui-icon-minus"}, text:false
//			}).click(function() {
//				var tags = Calibration.$tags.values();
//				for(var i=0, len = tags.length; i < len; i++){
//					var tag  = tags[i];
//					Calibration.$map.remove('tag_'+tag.euid);
//				}
//			});
		},
		barrier : function(){ //장애물
			Calibration.$barriers = Calibration.get.barriers();
			var html = '';
			html += '<div class="ui-accordion ui-widget ui-helper-reset">'
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span> '+$.rtls.calibration.form.barrier;
			html += '	</h3>';
			html += '	<div style="float:right"> ';
			html += ' 		<button id="but-barriershow" style="padding: 4px; cursor: pointer;"></button>';
			html += ' 		<button id="but-barrierhide" style="padding: 4px; cursor: pointer;"></button>';
			html += '	</div>';
			html += '	<div style="clear:both"></div>';
			html += '</div>';
			html += '<ol id="barriers" class="menu-selectable">';
			html += '</ol>';
			$('#barrier_list').html(html);
			// 장애물 보기 버튼
			$("#but-barriershow").button({
				icons: {primary: "ui-icon-image"}, text:false
			}).click(function() {
				Calibration.$map.viewport.children('svg').children().each(function(){
					var id = $(this).attr('id')+'';
					if(id.indexOf('barrier_') != -1){
						$(this).remove();
					}
				});
				var barrier = {}, item = {};
				for(var i=0, len = Calibration.$barriers.length; i < len; i++){
					item = Calibration.$barriers[i];
					var points = item.coordinates.split('|'), p = {}, path = 'M';
        			for(var j=0; j < points.length; j++){
        				p = points[j].split(':');
        				path += p[0]+ ' ' + p[1]+'L';
        			}
        			path = path.substring(0, path.length-1)+'Z';
        			barrier = Calibration.$map.draw.polygon(path, 1, '#000000', 'line', '#F71414', 0.7, 'barrier_'+item.calibrationBarrierId);
        			Calibration.edit.barrier.event(item, barrier);
					
				}
			});
			// 장애물 숨기기
			$("#but-barrierhide").button({
				icons: {primary: "ui-icon-minus"}, text:false
			}).click(function() {
				Calibration.$map.viewport.children('svg').children().each(function(){
					var id = $(this).attr('id')+'';
					if(id.indexOf('barrier_') != -1 || id == 'zpolygon'){
						$(this).remove();
					}
				});
				
			});
			
			if(Calibration.$barriers.length == 0){
				$('#barriers').append("<li class='ui-widget-content' style='height:26px' id='message'>"+$.rtls.calibration.barrier.empty+"</li>")
			}else{
				Calibration.$map.viewport.children('svg').children().each(function(){
					var id = $(this).attr('id')+'';
					if(id.indexOf('barrier_') != -1 || id == 'zpolygon'){
						$(this).remove();
					}
				});
				
				var item = {} ,barrier = {};
				for(var i=0, len = Calibration.$barriers.length; i < len; i++){
					item = Calibration.$barriers[i];
					$('#barriers').append("<li class='ui-widget-content' style='height:26px' id='"+item.calibrationBarrierId+"'><img src='/resources/commons/images/3d/icon_obj_barrier.png'  style='float:left; padding-right:3px'/>"+item.description+"</li>")
					var points = item.coordinates.split('|'), p = {}, path = 'M';
        			for(var j=0; j < points.length; j++){
        				p = points[j].split(':');
        				path += p[0]+ ' ' + p[1]+'L';
        			}
        			path = path.substring(0, path.length-1)+'Z';
        			barrier = Calibration.$map.draw.polygon(path, 1, '#000000', 'line', '#F71414', 0.7, 'barrier_'+item.calibrationBarrierId);
        			Calibration.edit.barrier.event(item, barrier);
				}
			}
			
			$("#barrier_list #barriers").selectable({
				stop : function () {
					$( ".ui-selected", this ).each(function() {
						Calibration.edit.barrier.$mode = '';
						$('li', '#raps').removeClass('ui-selected');
						$('li', '#tags').removeClass('ui-selected');
						$('li', '#sectors').removeClass('ui-selected');
						$('li', '#syncs').removeClass('ui-selected');
						var ix = $("#barrier_list #barriers li").index(this);
						if(Calibration.$barriers.length > 0){
							Calibration.$barrier = Calibration.$barriers[ix];
							Calibration.edit.barrier.form();
							Calibration.edit.barrier.$mode = '';
						}
						
					});
				}
			});
			
		},
		analysis : function(){ //분석 toolbar
			var html = '';
			html += '<div style="padding:6px; color:#000; background-color:#d0d0d0; text-align:center"> ';
			html += '	<span class="ui-icon ui-icon-clock" style="text-align: center;float:left;"></span> <span id="timer">00:00</span>';
			html += '</div>';
			html += '<div style="float:left; padding:4px;"> ';
			html += '	<input type="text" id="time" value="5" style="width: 30px; text-align: center"/>'+$.rtls.calibration.form.min;
			html += '</div>';
			html += '<div style="float:right; padding:4px;"> ';
			html += '	<button id="but-analysis" style="padding: 4px; cursor: pointer;"></button>';
			html += '</div>';
			html += '<div style="clear:both"></div>';
			$('#analysis-toolbar').html(html);
			$("#analysis-toolbar #but-analysis").button({
				icons: {primary: (Calibration.$isAnalysis == "false" ? "ui-icon-play" : "ui-icon-stop")}, text:false
			}).click(function() {
				if(Calibration.$isAnalysis == 'true'){
					Calibration.analysis.stop();
				}else{
					Calibration.analysis.start();
				}
				return false; 
			});
		},
		sector : function(){ // Sector 설정
			Calibration.$sectors = [];
			var countX = Math.ceil(Calibration.util.carcPxToMeter(Calibration.$plan.width));
			var countY = Math.ceil(Calibration.util.carcPxToMeter(Calibration.$plan.height));
			
			var html = '';
			html += '<div id="sector_toolbar" class="ui-accordion ui-widget ui-helper-reset">'
			html += '	<div style="float:right; padding:4px;"> ';
			html += ' 		<button id="but-sector-expansion" style="padding: 4px; cursor: pointer;"></button>';
			html += ' 		<button id="but-sector-clear" style="padding: 4px; cursor: pointer;"></button>';
			html += '	</div>';
			html += '	<div style="clear:both"></div>';
			html += '</div>';
			html += '<ol id="sectors" class="menu-selectable">';
			for(var i=0; i < countX; i++){
            	Calibration.$sectors[i] = new Array(countY);
            	for(var j=0 ; j < countY; j++){
            		Calibration.$sectors[i][j] = {euid : '0000000000000000', tagEuid : '', tagIx : -1, x : i, y : j};
            		html += "<li class='ui-widget-content' style='height:22px;clear:both' id='sector_0000000000000000_"+i+"_"+j+"'>";
					html += "<div id='sector' class='sector-rate' style=''>"+i+","+j+"</div> ";
					html += "<div id='planning' class='sector-rate' style='background-color:#00FF00;color:#000000'>0</div> ";	
					html += "<div id='analysis' class='sector-rate' style='background-color:#FFFFFF;color:#000000'>0</div> ";
					html += "<div id='tag' class='sector-tag' style='color:#000000'></div> ";
					html += "</li>";
            	}
			}
			html += '</ol>';
			$('#sector_list').html(html);
			//측정데이터 확장 버튼			
			$("#but-sector-expansion").button({
				icons: {primary: "ui-icon-arrow-4-diag"}, text:false
			}).click(function() {
				$('#viewport-report').hide();
				$('#viewport').hide();
				$('#viewport-expansion').show();
				Calibration.analysis.expansion();
				return false; 
			});
			// 측정데이터 초기화 버튼
			$("#but-sector-clear").button({
				icons: {primary: "ui-icon-trash"}, text:false
			}).click(function() {
				Calibration.$isAnalysis = 'false';
				Calibration.analysis.clearSector();
				return false; 
			});
			//Sector 선택 이벤트
			$("#sector_list #sectors").selectable({
				stop : function () {
					$( ".ui-selected", this ).each(function() {
						$('li', '#raps').removeClass('ui-selected');
						$('li', '#tags').removeClass('ui-selected');
						$('li', '#barriers').removeClass('ui-selected');
						$('li', '#syncs').removeClass('ui-selected');
						
						var id = $(this).attr('id');
						if(id != undefined && id.indexOf('sector_') != -1){
							var ids = id.split('_');
							Calibration.$sector = Calibration.$sectors[ids[2]][ids[3]];
							Calibration.edit.sector.form();
						}
					});
				}
			});
			
			if(Calibration.$isAnalysis == 'true'){
				Calibration.$timer.play();
			}else{
				Calibration.$timer.stop();
			}
			var size = Calibration.$plan.pixels;
			var loopCount = 0;
			var height = Math.round(Calibration.$plan.height);
			var cx = 0, cy =0, cz = 0, sx = 50, sy = 50, sz = 0, unit = 1;
			var rap  = {}, barriers = [], planning = [], analysiss = [], analysis = {};
			var rapX = 0, rapY = 0, distance = 0, rate = 0, blockingRate = 0, rcount = [0, 0, 0], sumRate = 0;
			var total = 0, success = 0, loss = 0, rxLevel = 0, tagEuid;
			$.eachAsync( Calibration.$sectors, {
				delay : 1,
				bulk: 0,
				loop : function(ix, items){
					$.eachAsync(items, {
						delay : 1,
						bulk: 0,
						loop : function(jx, item){
							cx = (item.x*size + size/2);
							cy = (item.y*size + size/2);
							// planning 분석 데이터 초기화
							rap = {}, barriers = [], planning = [], rapX = 0, rapY = 0, distance = 0, rate = 0, blockingRate = 0, rcount = [0, 0, 0], sumRate = 0;
							for(var i=0, len = Calibration.$raps.length; i < len; i++){
								rap = Calibration.$raps[i];
								rapX = rap.localX;
								rapY = rap.localY;
								// 거리별 감소율
								distance = Calibration.util.carcDistance(rapX, rapY, cx, cy);
								rate = 100; 
								if(distance/100 > Calibration.$radio.threshold){
									rate = 100 / (Calibration.$radio.decrease * (distance/100 - Calibration.$radio.threshold));
									if(rate > 100){
										rate = 100;
									}else{
										rate = parseFloat(rate.toFixed(2));
									}
								}
								// 장애물에 의한 감소율
								blockingRate = 0;
								barriers = Calibration.analysis.getBarriers({'x': cx, 'y': cy},{'x':rapX, 'y': rapY});
								for(var j=0; j < barriers.length; j++){
									blockingRate += barriers[j].blockingRate;
								}
								rate = parseFloat((rate - blockingRate).toFixed(2));
								if(rate < 0) rate = 0;
								
								sumRate += rate;
								if(rate >= 80) rcount[0]++; 
								else if(rate > 50 && rate < 80) rcount[1]++;
								else  rcount[2]++;
								
								sz = rate * 2;
								cz = sz/2 + height;
								planning.push({'rapId' : rap.rapId,'euid' : rap.euidSrc,'distance' : distance,'rate': rate,'blockingRate' : blockingRate,'sz' : sz,'cz' : cz, 'barriers' : barriers});
							}
							rate = parseFloat((sumRate /  Calibration.$raps.length).toFixed(2));
							sz = parseFloat((rate * 2).toFixed(2));
							cz = parseFloat((sz/2 + height).toFixed(2));
							
							item.cx = cx; item.cy = cy; item.cz = cz;
							item.sx = sx; item.sy = sy; item.sz = sz;
							item.rate  = rate;
							item.rcount = rcount;
							item.planning = planning;
							if(rcount[0] >= 3){
								$('#sector_0000000000000000_'+item.x+'_'+item.y+' #planning').text(rate).css('background-color', '#00FF00');
							}else if(rcount[0] + rcount[1] >= 3){
								$('#sector_0000000000000000_'+item.x+'_'+item.y+' #planning').text(rate).css('background-color', '#FFFF00');
							}else{
								$('#sector_0000000000000000_'+item.x+'_'+item.y+' #planning').text(rate).css('background-color', '#FF0000');
							}
							// DB Sector analysis 초기화 
							item.analysis = new HashMap();
							for(var i=0, len = Calibration.$dbsectors.length; i < len; i++){
								analysis = Calibration.$dbsectors[i];
								if(analysis.sectorX == item.x && analysis.sectorY == item.y){
									item.analysis.put(analysis.rapEuid, {
										measureEuid : analysis.measureEuid,
				                        tagEuid : analysis.tagEuid,
				                        totalPacket : analysis.totalPacket,
				                        successPacket : analysis.successPacket,
				                        lossPacket : analysis.lossPacket,
				                        rxLevel : analysis.rxLevel,
				                        localX  : analysis.localX,
				                        localY  : analysis.localY,
				                        maxLocalX  : analysis.maxLocalX,
				                        maxLocalY  : analysis.maxLocalY,
				                        minLocalX  : analysis.minLocalX,
				                        minLocalY  : analysis.minLocalY,
				                        avgLocalX  : analysis.avgLocalX,
				                        avgLocalY  : analysis.avgLocalY,
				                        avgDist  : analysis.avgDist,
				                        minDist  : analysis.minDist,
				                        maxDist  : analysis.maxDist,
				                        isFilter : analysis.isFilter,
				                        startTime : analysis.startTime,
				                        stopTime : analysis.stopTime,
									});
								}
							}
							analysiss = item.analysis.values();
							len = analysiss.length;
							if(len > 0){
								total = 0, success = 0, loss = 0, rxLevel = 0, tagEuid = '';
								var measureEuid = '', avgDist = 0;
								for(var i=0; i < len; i++){
									measureEuid = analysiss[i].measureEuid;
									tagEuid = analysiss[i].tagEuid;
									total += analysiss[i].totalPacket;
									success += analysiss[i].successPacket;
									loss += analysiss[i].lossPacket;
									rxLevel += analysiss[i].rxLevel;
									avgDist = analysiss[i].avgDist;
								}
								rxLevel = parseFloat((rxLevel / len).toFixed(2));
								rate = parseFloat(((success*100)/total).toFixed(2));
								if(rate >= 80){
									$('#sector_0000000000000000_'+item.x+'_'+item.y+' #analysis').text(rate).css('background-color', '#00FF00');
								}else if(rate > 50 && rate < 80){
									$('#sector_0000000000000000_'+item.x+'_'+item.y+' #analysis').text(rate).css('background-color', '#FFFF00');
								}else{
									$('#sector_0000000000000000_'+item.x+'_'+item.y+' #analysis').text(rate).css('background-color', '#FF0000');
								}
								if(measureEuid.length > 0){
									var tag = Calibration.$beenTags.get(measureEuid);
									measureEuid = measureEuid.substring(measureEuid.length-4, measureEuid.length);
									if(tag.type == 1){
										$("#sector_0000000000000000_"+item.x+"_"+item.y+" #tag").html('<img src="/resources/commons/images/map/icon_tag_fixed.png" width="14" height="14" align="absmiddle"/> '+measureEuid);
									}else{
										$("#sector_0000000000000000_"+item.x+"_"+item.y+" #tag").html('<img src="/resources/commons/images/map/icon_tag_move.png" width="14" height="14" align="absmiddle"/> '+measureEuid);
									}
								}else if(tagEuid.length > 0){
									tagEuid = tagEuid.substring(tagEuid.length-4, tagEuid.length);
									$("#sector_0000000000000000_"+item.x+"_"+item.y+" #tag").html(tagEuid).css('padding-top', '6px');
								}
							}
							
							
						},
						end : function(){
							loopCount++;
							if(loopCount >= Calibration.$sectors.length){
								// TAG MAPPING
								var tags = Calibration.$tags.values(), tag = {}, sector = {}, euid = '';
								for(var k=0, len = tags.length; k < len; k++){
									tag = tags[k];
									if(tag.sectorX > -1 && tag.sectorY > -1){
										euid = tag.euid.substring(tag.euid.length-4, tag.euid.length);
						        		if(tag.type == 1){
						        			$("#sector_0000000000000000_"+tag.sectorX+"_"+tag.sectorY+" #tag").html('<img src="/resources/commons/images/map/icon_tag_fixed.png" width="14" height="14" align="absmiddle"/> '+euid);	
						        		}else{
						        			$("#sector_0000000000000000_"+tag.sectorX+"_"+tag.sectorY+" #tag").html('<img src="/resources/commons/images/map/icon_tag_move.png" width="14" height="14" align="absmiddle"/> '+euid);
						        		}
						        		Calibration.$sectors[tag.sectorX][tag.sectorY].tagEuid = tag.euid;
									}
								}
								
							}
							
						}
					});
				},
				end : function(){
					
				}
			});
		},
		sync : function(){ //Wireless Sync 
			$('#sync_list').html('<div id="accordion"></div>');
			Calibration.$syncs.clear();
			var masters = Calibration.get.syncMaster();
			var syncs = Calibration.get.sync();
			if(masters.length == 0){
				var rap = {};
				for(var i=0, len = Calibration.$raps.length; i < len; i++){
					rap = Calibration.$raps[i];
					if(rap.rcmMode == 1){
						masters.push(rap.euidSrc);
					}else if(rap.rcmMode == 2){
						syncs.push({
							calibrationId : 0,
							planId : rap.planId,
							rapEuid : rap.euidSrc,
							masterEuid : rap.euidMaster,
							totalPacket : 0,
							successPacket : 0,
							lossPacket : 0,
							rxLevel : 0,
							syncClock : 0,
							startTime : 0,
							stopTime : 0,
						});	
					}
					
				}
			}
			var html = '', euid = '', sync = {}, rate = 0;
			$.eachAsync( masters, {
				delay : 1,
				bulk: 0,
				loop : function(ix, master){
					euid = master.substring(master.length-4, master.length);
					html = '<h3>'+euid+' Wireless Sync</h3>';
					html += '<div style="padding:0; margin:0">';
					html += '	<div style="float:right">';
					html += '		<button id="but-clear-'+master+'" style="margin: 2px; padding: 4px; cursor: pointer;"></button>';
					html += '	</div>';
					html += '	<ol id="syncs-'+master+'" class="menu-selectable">';
					var datas = new Array(), rap = {}, network = '';
					for(var i=0, len = syncs.length; i < len; i++){
						sync = syncs[i];
						if(sync.masterEuid == master){
							euid = sync.rapEuid.substring(sync.rapEuid.length-4, sync.rapEuid.length);
							rate = parseFloat(((sync.successPacket*100)/sync.totalPacket).toFixed(2));
							html += "<li class='ui-widget-content' style='height:22px;clear:both' id='sync-"+master+"-"+sync.rapEuid+"'>";
							rap == null;
							for(var j=0, jlen = Calibration.$raps.length; j < jlen; j++){
								rap = Calibration.$raps[j];
								if(rap.euidSrc == sync.rapEuid){
									break;
								}
							}
							if(rap != null){
								if(rap.networkType == '1') network = 'ethernet';
								else if(rap.networkType == '2') network = 'wifi';
								else if(rap.networkType == '3') network = 'lte';
								if(rap.rcmMode == 1){
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_master_20x20.png'  style='float:left; padding-right:3px'/>";
								}else if(rap.rcmMode == 2){
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_20x20.png'  style='float:left; padding-right:3px'/>";
								}else if(rap.rcmMode == 3){
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_20x20.png'  style='float:left; padding-right:3px'/>";
								}
							}else{
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_20x20.png'  style='float:left; padding-right:3px'/>";
							}
							
							html += " "+euid+" ";
							if(isNaN(rate)){
								html += "<div id='rate' class='sync-rate' style='background-color:#FFFFFF;color:#000000'>0%</div> ";
							}else{
								if(rate > 80){
									html += "<div id='rate' class='sync-rate' style='background-color:#00FF00;color:#000000'>"+rate+"%</div> ";	
								}else if(rate > 50 && rate < 80){
									html += "<div id='rate' class='sync-rate' style='background-color:#FFFF00;color:#000000'>"+rate+"%</div> ";	
								}else{
									html += "<div id='rate' class='sync-rate' style='background-color:#FF0000;color:#000000'>"+rate+"%</div> ";	
								}	
							}
							
							html += "</li>";
							datas.push(sync);
						}
					}
					html += '	</ol>';
					$('#sync_list #accordion').append(html);
					Calibration.$syncs.put(master, datas);
					$("#accordion #syncs-"+master).selectable({
						stop : function () {
							$( ".ui-selected", this ).each(function() {
								$('li', '#raps').removeClass('ui-selected');
								$('li', '#tags').removeClass('ui-selected');
								$('li', '#sectors').removeClass('ui-selected');
								
								var ids = $(this).attr('id').split('-');
								var datas = Calibration.$syncs.get(ids[1]);
								if(datas != undefined){
									for(var i=0, len = datas.length; i < len; i++){
										if(datas[i].rapEuid == ids[2]){
											Calibration.$sync = datas[i];
											Calibration.edit.sync.form();
											break;
										}
									}
								}
															
							});
						}
					});
					$("#accordion #but-clear-"+master).button({
						icons: {primary: "ui-icon-trash"}, text:false
					}).click(function() {
						Calibration.analysis.clearSync();
					});
				},
				end : function(){
				
				}
			});
			$("#sync_list #accordion" ).accordion({
			      heightStyle: "content"
		    });
			
		},
		map : function(){ // 도면 생성
			Calibration.$map = new Map({
				plan : Calibration.$plan, 
				view : {isRuler : true, isGrid : true, isTool : false},
				tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false, isZone : false, isMovement : false, isBarrier : true, is3D : false},
				isEvent : true,
				target : Calibration
			});
			var html = '<table class="edit-fields">';
			html += '<tr><td class="labels" style="width:70px">横</td><td style="text-align:left;border:1px solid #dcdcdc; padding-left:5px;">'+Calibration.util.carcPxToMeter(Calibration.$plan.width)+"m</td></tr>";
			html += '<tr><td class="labels" style="width:70px">竖</td><td style="text-align:left;border:1px solid #dcdcdc; padding-left:5px;">'+Calibration.util.carcPxToMeter(Calibration.$plan.height)+"m</td></tr>";
			html + "</table>"
			$('#plan_edit').html(html);
			$('#plan_edit').css('padding', '10px');
		},
		
	},
	get : {
		plans : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/plan.json?action=get.plans",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.plans;
				}
			});
			return items;
		},
		raps : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/rap.json?action=get.raps",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId,
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.raps;
				}
			});
			return items;
		},
		tags : function(){ // Mapping된 tag정보 가져오기
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/calibration.json?action=get.calibration.analysis.sector",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId
	         	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.tags;
	            	Calibration.$isAnalysis = data.isAnalysis;
				}
			});
			return items;
		},
		beenTags : function(){ // 현재 발급하여 사용중인 태그와 이전에 발급되었던 태그 목록
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/tag.json?action=get.been.issued.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	         	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.tags;
				}
			});
			return items;
		},
		barriers : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/calibration.json?action=get.calibration.barriers",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId,
	            	"sortName" : 'calibrationBarrierId',
	            	"sortType" : 'ASC',
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.objs;
				}
			});
			return items;
		},
		sync : function(){ // 측정된 Wireless Sync 정보 가져오기
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/calibration.json?action=get.calibration.sync",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId
	         	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.syncs;
				}
			});
			return items;
		},
		syncMaster : function(){ // 측정된 Wireless Sync Master Euid 가져오기
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/calibration.json?action=get.calibration.sync.master",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId
	         	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.masters;
				}
			});
			return items;
		},
		sector : function(){ // 측정된 Sector Sync 정보 가져오기
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/calibration.json?action=get.calibration.sector",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId
	         	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.sectors;
	            	
				}
			});
			return items;
		},
		sectorPositioningAccuracy : function(sectorX, sectorY){ // 측정된 Sector 측위 정밀도 가져오기
			var item = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/calibration.json?action=get.calibration.analysis.positioning.accuracy",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Calibration.$plan.planId,
	            	"sectorX" : sectorX,
	            	"sectorY" : sectorY,
	         	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	item = data;	
				}
			});
			return item;
		},
	},
	edit : { // EDIT 영역
		rap : { 
			form : function(item, localX, localY, localZ){
				Calibration.$rap = item;
				
				var pcnumField = '<select id="pcNumber">';
				for(var i=0; i < 10; i++){
					pcnumField += '<option value="'+i+'">'+i+'</option>';
				}
				pcnumField += '</select>';
				var gainField = '<select id="gain">';
				for(var i=0; i < 35; i++){
					gainField += '<option value="'+i+'">'+i+'</option>';
				}
				gainField += '</select>';
				var groupField = '<select id="group">';
				for(var i=0; i < 256; i++){
					groupField += '<option value="'+i+'">'+i+'</option>';
				}
				groupField += '</select>';
				
				var network = '';
				if(item.networkType == '1') network = 'ethernet';
				else if(item.networkType == '2') network = 'wifi';
				else if(item.networkType == '3') network = 'lte';
				
				
				var html = '';
				html += '<table id="form-mod" class="edit-fields">';
				html += '<tr>';
				html += '    <td style="background-color:#000000">';
				html += '    	<div style="float:left;color:#FFFFFF;font-weight: bold; padding-top:2px;">';
				if(item.rcmMode == 1){
					html += '<img src="/resources/commons/images/map/icon_rap_'+network+'_master_20x20.png"  style="float:left; padding-right:3px; text-align:bottom"/>';
				}else if(item.rcmMode == 2){
					html += '<img src="/resources/commons/images/map/icon_rap_'+network+'_slave_20x20.png"  style="float:left; padding-right:3px; text-align:bottom"/>';
				}else if(item.rcmMode == 3){
					html += '<img src="/resources/commons/images/map/icon_rap_'+network+'_slave_20x20.png"style="float:left; padding-right:3px; text-align:bottom"/>';
				}
				html += '		'+Calibration.$rap.euidSrc+'</div>';
				html += '		<span id="result"></span>';
				html += '		<div style="float:right">';
				html += '    	</div>';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				html += '<table id="form-mod" class="edit-fields">';
				html += '<tr>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.point+'(X)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				if(localX == undefined){
					html += '<span style="padding-left:5px;">'+Calibration.util.carcPxToMeter(item.localX)+'m</span>';
				}else if(localX > 0){
					html += '<span style="padding-left:5px;">'+Calibration.util.carc3DMeterToMeter(localX)+'m</span>';
				}
				html += '    </td>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.point+'(Y)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				if(localY == undefined){
					html += '<span style="padding-left:5px;">'+Calibration.util.carcPxToMeter(item.localY)+'m';
				}else if(localX > 0){
					html += '<span style="padding-left:5px;">'+Calibration.util.carc3DMeterToMeter(localY)+'m';
				}
				html += '    </td>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.height+'(Z)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				if(localZ == undefined){
					html += '<span style="padding-left:5px;">'+Calibration.util.carcPxToMeter(item.localZ)+'m';
				}else if(localX > 0){
					html += '<span style="padding-left:5px;">'+Calibration.util.carc3DMeterToMeter(localZ)+'m';
				}
				html += '    </td>';
				html += '</tr>';
				html += '<tr>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.isAp+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<ol id="isap-selectable" class="horizontal-selectable">';
				if(item.isAP == 'true'){
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.calibration.form.use+' </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.calibration.form.notuse+' </li>';
				}else{
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.calibration.form.use+' </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.calibration.form.notuse+' </li>';
				}
				html += '		</ol>';
				html += '    </td>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.networkType+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<ol id="networktype-selectable" class="horizontal-selectable">';
				if(item.networkType == 1){
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Ethernet </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> WiFi </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> LTE </li>';
				}else if(item.networkType == 2){
					html += '<li class="ui-widget-content" style="cursor:pointer"> Ethernet </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> WiFi </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> LTE </li>';
				}else if(item.networkType == 3){
					html += '<li class="ui-widget-content" style="cursor:pointer"> Ethernet </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> WiFi </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> LTE </li>';
				}else{
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Ethernet </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> WiFi </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> LTE </li>';
				}
				html += '		</ol>';
				html += '    </td>';
				html += '    <td class="labels">* RAP '+$.rtls.calibration.form.description+'</td>';
				html += '    <td style="text-align:left"><span style="padding-left:5px;">'+(item.description != 'null' ? item.description : '')+'</span></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	 <td class="labels">* RCM Mode</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<ol id="rcmmode-selectable" class="horizontal-selectable">';
				if(item.rcmMode == 1){
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Slave </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Tag </li>';	
				}else if(item.rcmMode == 2){
					html += '<li class="ui-widget-content" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Slave </li>';	
					html += '<li class="ui-widget-content" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Tag </li>';
				}else if(item.rcmMode == 3){
					html += '<li class="ui-widget-content" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Slave </li>';	
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Tag </li>';
				}else{
					html += '<li class="ui-widget-content" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Slave </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Tag </li>';
				}
				html += '		</ol>';
				html += '	</td>';
				html += '	<td class="labels">* Master Count</td><td style="text-align:left;border:1px solid #dcdcdc;">'+item.masterCount+' '+$.rtls.calibration.form.number+'</td>';
				html += '	<td class="labels">* Master EUID</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.euidMaster+'</span></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td class="labels">* Master EUID2</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.euidMaster2+'</span></td>';
				html += '	<td class="labels">* Master EUID3</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.euidMaster3+'</span></td>';
				html += '	<td class="labels">* Master EUID4</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.euidMaster4+'</span></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td class="labels">* Master Distance</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.masterDistance+'m</span></td>';
				html += '	<td class="labels">* Master Distance2</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.masterDistance2+'m</span></td>';
				html += '	<td class="labels">* Master Distance3</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.masterDistance3+'m</span></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td class="labels">* Master Distance4</td><td style="text-align:left;border:1px solid #dcdcdc;"><span style="padding-left:5px;">'+item.masterDistance4+'m</span></td>';
				html += '</tr>';
				html += '</table>';
				$("#edit").html(html);
			},
		},
		tag : {
			form : function(){
				var item = Calibration.$tag;
				var html = '';
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td style="background-color:#000000">';
				html += '    	<div style="float:left;color:#FFFFFF;font-weight: bold; padding-top:2px;">';
				if(item.type == 1){
					html += '		<img src="/resources/commons/images/map/icon_tag_fixed.png" style="float:left; padding-right:3px; text-align:bottom"/>';
				}else{
					html += '		<img src="/resources/commons/images/map/icon_tag_move.png" style="float:left; padding-right:3px; text-align:bottom"/>';
				}
				html += '		'+item.euid +'('+item.ix+')';
				html += '		</div>';
				html += '		<span id="result"></span>';
				html += '		<div style="float:right">';
				html += '           <button id="but_tag_mapping">mapping</button>';
				html += '    	</div>';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td class="labels">'+$.rtls.calibration.form.point+'(X)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<input type="text" id="localX" value="'+Calibration.util.carcPxToMeter(item.localX)+'" style="text-aling:center; width:80px"/>m';
				html += '    </td>';
				html += '    <td class="labels">'+$.rtls.calibration.form.point+'(Y)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<input type="text" id="localY" value="'+Calibration.util.carcPxToMeter(item.localY)+'"style="text-aling:center; width:80px"/>m';
				html += '    </td>';
				html += '    <td class="labels"> Sector</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				if(item.sectorX > 0 && item.sectorY > 0){
					html += '	<span style="padding-left:5px;width:80px;" id="mapping_sector">'+item.sectorX+', '+item.sectorY+'</span>';	
				}else{
					html += '	<span style="padding-left:5px;width:80px;" id="mapping_sector">--</span>';
				}
				
				html += '		<button id="but_mapping">Mapping</button>';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				html += '<table id="tab_sector_list" class="edit-list">';
				html += '<thead>';
				html += '<tr>';
				html += '    <th style="width:20px"></td>';
				html += '    <th>Sector</td>';
				html += '    <th>Position</td>';
				html += '    <th>Count</td>';
				html += '</tr>';
				html += '</thead>';
				html += '<tbody>';
				html += '</tbody>';
				html += '</table>';
				$('#edit').html(html);
				
				var keys = Calibration.$tag.sector.keys(), key, sector, count = 0, precount = 10000;
				for(var i=0, len = keys.length; i < len; i++){
					key = keys[i].split('_');
					count = Calibration.$tag.sector.get(keys[i]);
					sector = Calibration.$sectors[key[0]][key[1]];
					html = '<tr>';
					if(key[0] == Calibration.$tag.sectorX && key[1] == Calibration.$tag.sectorY){
						html += '<td><div id="'+key[0]+'_'+key[1]+'" style="width:15px;height:15px;margin:2px;border:1px solid #d1d1d1;background-color:#0000ff"></div></td>';
					}else{
						html += '<td><div id="'+key[0]+'_'+key[1]+'" style="width:15px;height:15px;margin:2px;border:1px solid #d1d1d1;background-color:#ffffff"></div></td>';
					}
					html += '<td>Sector '+key[0]+', '+key[1]+'</td>';	
					html += '<td>'+Calibration.util.carcPxToMeter(sector.cx)+'m x '+Calibration.util.carcPxToMeter(sector.cy)+'m </td>';
					html += '<td>'+count+'</td>';
					html += '</tr>';
					$('#tab_sector_list > tbody').append(html);
					
				}
				// 태그 도면에 매핑
				$('#but_mapping').button({
					icons: {primary: "ui-icon-bookmark"}
				}).click(function() {
					var x = Calibration.$tag.localX, y = Calibration.$tag.localY;
					var mx = Calibration.util.carcPxToMeter(x), my = Calibration.util.carcPxToMeter(y);
					var sectorX = Math.round(mx), sectorY = Math.round(my);
					
					var sector = Calibration.$sectors[sectorX][sectorY];
            		sector.tagEuid = Calibration.$tag.euid;
            		sector.tagIx = Calibration.$tag.ix;
            		Calibration.$tag.sectorX = sectorX;
            		Calibration.$tag.sectorY = sectorY;
            		
    				var euid = Calibration.$tag.euid.substring(Calibration.$tag.euid.length-4, Calibration.$tag.euid.length);
    				if(Calibration.$tag.type == 1){
            			$("#sector_0000000000000000_"+sectorX+"_"+sectorY+" #tag").html('<img src="/resources/commons/images/map/icon_tag_fixed.png" width="14" height="14" align="absmiddle"/> '+euid);	
            			Calibration.$tag.marker = '<p id="tag_'+Calibration.$tag.euid+'" name="marker" class="icon-tag-fixed" title="'+euid+'" type="11" sectorX="'+sectorX+'" sectorY="'+sectorY+'"';
            			Calibration.$tag.marker += ' localX="'+x+'" localY="'+y+'" localZ="'+0+'"></p>';
            		}else{
            			$("#sector_0000000000000000_"+sectorX+"_"+sectorY+" #tag").html('<img src="/resources/commons/images/map/icon_tag_move.png" width="14" height="14" align="absmiddle"/> '+euid);
            			Calibration.$tag.marker = '<p id="tag_'+Calibration.$tag.euid+'" name="marker" class="icon-tag-portable" title="'+euid+'" type="12" sectorX="'+sectorX+'" sectorY="'+sectorY+'" ';
            			Calibration.$tag.marker += ' localX="'+x+'" localY="'+y+'" localZ="'+0+'"></p>';
            		}
    				Calibration.$tag.id = 'tag_'+Calibration.$tag.euid;
					Calibration.$map.marker.add(Calibration.$tag, true, true, Calibration);
					Calibration.$map.draw.text(Math.round(x), Math.round(y) + 18, euid, 'tag_text_'+Calibration.$tag.euid, {'font-size':'11px', 'fill':'#000000', 'font-weight':'bold'});
					
					$('#edit #mapping_sector').html(sectorX+", "+sectorY);
					$('#tab_sector_list > tbody  > tr').each(function() {
            			$(this).find("td:eq(0)").find('div').css('background-color', '#ffffff');
            		    $(this).find("td:eq(0)").find('#'+sectorX+'_'+sectorY).css('background-color', '#0000ff');
            		});
    				return false; 
				});
				// 매핑 태그 서버에 설정
				$('#but_tag_mapping').button({
					icons: {primary: "ui-icon-bookmark"}, text : false,
				}).click(function() {
					var tagEuid = Calibration.$tag.euid;
					var tagType = Calibration.$tag.type;
					var tagIx = Calibration.$tag.ix;
					var sectorX = Calibration.$tag.sectorX;
					var sectorY = Calibration.$tag.sectorY;
					var localX = Calibration.util.carcMeterToPx($('#edit #localX').val());
					var localY = Calibration.util.carcMeterToPx($('#edit #localY').val());
					$.ajax({
						async : false,
						type: 'GET',
						url: "/service/calibration.json?action=set.calibration.analysis.sector",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
			            	'planId' : Calibration.$plan.planId,
			            	'sectorX' : sectorX,
			            	'sectorY' : sectorY,
			            	'tagEuid' : tagEuid,
			            	'localX' : localX,
			            	'localY' : localY,
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		Calibration.$tag.localX = localX;
			            		Calibration.$tag.localY = localY;
			            		$("#edit #result").html("<span style='color:white'>Mapping 성공</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
			            	}
						}
					});
					return false;
				});
				
			},
			
		},
		barrier : { //장애물 편집
			$mode : '',
			form : function(){
				
				var types = $.rtls.calibration.barrier.types;
				var materials = $.rtls.calibration.barrier.materials;
				
				var typeField = '<select id="type">';
				typeField += '<option value="">'+$.rtls.calibration.form.select+'</option>';
				for(var i=0; i < types.length; i++){
					typeField += '<option value="'+types[i]+'">'+types[i]+'</option>';
				}
				typeField += '</select>';
				var materialField = '<select id="material">';
				materialField += '<option value="">'+$.rtls.calibration.form.select+'</option>';
				for(var i=0; i < materials.length; i++){
					materialField += '<option value="'+materials[i]+'">'+materials[i]+'</option>';
				}
				materialField += '</select>';
				
				var html = '';
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td style="background-color:#000000">';
				html += '    	<div style="float:left;color:#FFFFFF;font-weight: bold; padding-top:2px;">';
				html += '		    <img src="/resources/commons/images/3d/icon_obj_barrier.png"style="float:left; padding-right:3px; text-align:bottom"/>';
				if(Calibration.$barrier == null){
					html += '		'+$.rtls.calibration.form.barrier+' '+$.rtls.calibration.form.add;
				}else{
					html += '		'+$.rtls.calibration.form.barrier+' ['+Calibration.$barrier.description+']';
				}
				html += '		</div>';
				html += '		<span id="result"></span>';
				html += '		<div style="float:right">';
				if(Calibration.$barrier == null){
					html += '		<button id="but-add" style="margin: 2px; padding: 4px; cursor: pointer;"></button> ';
				}else{
					html += '		<button id="but-mod" style="margin: 2px; padding: 4px; cursor: pointer;"></button> ';
					html += '		<button id="but-del" style="margin: 2px; padding: 4px; cursor: pointer;"></button> ';
				}
				html += '    	</div>';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.barrier+' '+$.rtls.calibration.form.description+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;" colspan="5"><input type="text" id="description" style="width:90%;" /></td>';
				html += '</tr>';
				html += '<tr>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.barrier+' '+$.rtls.calibration.form.type+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">'+typeField+'</td>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.barrier+' '+$.rtls.calibration.form.material+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">'+materialField+'</td>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.blockingrate+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;"><input type="text" id="blockingRate" value="0" style="width:40px; text-align:right" />%</td>';
				html += '</tr>';
				html += '<tr>';
				html += '    <td class="labels">* '+$.rtls.calibration.form.coordinates+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;" colspan="5"><input type="text" id="coordinates" style="width:90%;" /><button id="but-redraw">다시그리기</button></td>';
				html += '</tr>';
				html += '</table>';
				$('#edit').html(html);
				if(Calibration.$barrier != null){
					$('#type').val(Calibration.$barrier.type);
					$('#material').val(Calibration.$barrier.material);
					$('#blockingRate').val(Calibration.$barrier.blockingRate);
					$('#coordinates').val(Calibration.$barrier.coordinates);
					$('#description').val(Calibration.$barrier.description);
				}
				if(Calibration.$barrier == null){ 
					$("#but-add", '#edit').button({
						icons: {primary: "ui-icon-plus"}, text:false
					}).click(function() {
						Calibration.edit.barrier.mod(0);	
					});
				}else{
					$("#but-mod", '#edit').button({
						icons: {primary: "ui-icon-check"}, text:false
					}).click(function() {
						Calibration.edit.barrier.mod(Calibration.$barrier.calibrationBarrierId);	
					});
					$("#but-del", '#edit').button({
						icons: {primary: "ui-icon-trash"}, text:false
					}).click(function() {
						Calibration.edit.barrier.del(Calibration.$barrier.calibrationBarrierId);
						
					});
				}
				$("#but-redraw", '#edit').button({
					icons: {primary: "ui-icon-arrowrefresh-1-s"}, text:false
				}).click(function() {
					Calibration.edit.barrier.$mode = 'redraw';
					if(Calibration.$barrier == null){
						Calibration.$map.remove('zpolygon');
					}else{
						Calibration.$map.remove('barrier_'+Calibration.$barrier.calibrationBarrierId);	
					}
					
					$('#coordinates').val('');
				});
			},
			mod : function(calibrationBarrierId){
				$.validity.start();
				$.validity.setup({outputMode:"summary" });
				$("#type").require($.rtls.validity.required($.rtls.calibration.form.type));
				$("#material").require($.rtls.validity.required($.rtls.calibration.form.material));
				$("#blockingRate").require($.rtls.validity.required($.rtls.calibration.form.blockingrate)).match("number", $.rtls.validity.match('number', $.rtls.calibration.form.blockingrate));
				$("#coordinates").require($.rtls.validity.required($.rtls.calibration.form.coordinates));
				$("#description").require($.rtls.validity.required($.rtls.calibration.form.description));
				var result = $.validity.end();
				if(result.valid){
					$.ajax({
						async : true,
						type: 'post',
						url: "/service/calibration.json?action=add.calibration.barrier",
						dataType: 'json',
			            data : { 
			            	"calibrationBarrierId" : calibrationBarrierId,
							"planId" : Calibration.$plan.planId,
							"localX" : 0,
							"localY" : 0,
							"localZ" : 0,
							"type" : $("#type").val(),
							"material" : $("#material").val(),
							"blockingRate" : $("#blockingRate").val(),
							"coordinates" : $("#coordinates").val(),
							"description" : $("#description").val()
						},
						beforeSend: function(x) {
						    if(x && x.overrideMimeType) {
						    	x.overrideMimeType("application/json;charset=UTF-8");
						    }
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		$("#edit #result").html("<span style='color:#ffffff'>"+$.rtls.calibration.barrier.modsuccess+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
			            		Calibration.ui.barrier();
			            		Calibration.edit.barrier.$mode = '';
							}else{
								$("#edit #result").html("<span style='color:red'>"+$.rtls.calibration.barrier.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
							}
			        	
						}
					});
					$.validity.clear();
				}else{
					
				}
				
			},
			del : function(calibrationBarrierId){
				$("#dialog-confirm").dialog({
					title : $.rtls.commons.dialog.title.ok,
			        width: "300",
			        bgiframe: true,
			        autoOpen: false,
			        modal: true,
			        resizable: false,
			        position: { my: "center center", at: "center center", of: "#edit" },
			        buttons: [{
			        	text : $.rtls.commons.button.ok,
						click: function() {
							$.ajax({
								async : false,
								type: 'GET',
								url: "/service/calibration.json?action=del.calibration.barrier",
								contentType: "application/json; charset=utf-8",
					            dataType: 'json',
					            data : { 
					            	"calibrationBarrierId" : calibrationBarrierId,
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) { 
					            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
					            },
					            success : function (data) {
					            	if(data.result == 'success'){
					            		$("#result").html("<span style='color:#ffffff'>"+$.rtls.calibration.barrier.delsuccess+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					            		Calibration.$barrier = null;
					            		Calibration.edit.barrier.$mode = '';
					            		Calibration.ui.barrier();
					            		$("#edit").html('');
					            		$("#dialog-confirm").dialog( "close" );
					            	}else{
					            		$("#result").html("<span style='color:red'>"+$.rtls.calibration.barrier.delfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					            	}
					            	
								}
							});
						},
			        },{
			        	text : $.rtls.commons.button.cancel,
						click: function() {
							$( this ).dialog( "close" );
						}
					}],
					open : function(){
						
					},
					close: function() {
						$("#dialog-confirm").empty();
						$("#dialog-confirm").dialog('destroy');
			        }
			        
			    });
				$("#dialog-confirm").append($.rtls.calibration.barrier.delconfirm);
				$('#dialog-confirm').dialog('open');
				
			},
			event : function(item, barrier){
				barrier.mouseover(function(e) {
					if(Calibration.$map.tool.action == 'pointer'){
						barrier.attr('cursor', 'pointer');
						barrier.attr('fill', '#0000ff');
					}else{
						barrier.attr('cursor', 'default');
					}
				}).mouseout(function(e) {
					if(Calibration.$map.tool.action == 'pointer'){
						barrier.attr('cursor', 'pointer');
						barrier.attr('fill', '#F71414');
					}else{
						barrier.attr('cursor', 'default');
					}
				}).mouseup(function(e) {
					if(Calibration.$map.tool.action == 'pointer'){
						$('li', '#raps').removeClass('ui-selected');
						$('li', '#tags').removeClass('ui-selected');
						$('li', '#sectors').removeClass('ui-selected');
						$('li', '#syncs').removeClass('ui-selected');
						$('li', '#barriers').removeClass('ui-selected');
						$('#'+item.calibrationBarrierId, '#barriers').addClass('ui-selected');
						Calibration.$barrier = item;
						Calibration.edit.barrier.form();
					}
				}); 
			}
		},
		sector : { //Sector 편집
			$isFilter : 'false',
			form : function(){
				var item = Calibration.$sector;
				var pa = null;
				if(item.analysis.size() > 0){
					pa = Calibration.get.sectorPositioningAccuracy(item.x, item.y); //정확도	
				}
				
				//console.log(item);
				var html = '';
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td style="background-color:#000000;">';
				html += '    	<div style="float:left;color:#FFFFFF;font-weight: bold; padding-top:4px;">';
				html += '			<div style="width:16px; height:16px; background-color:#ffffff;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
				html += '		    Sector '+item.x+','+item.y +', '+$.rtls.calibration.form.point +' : '+(Calibration.util.carcPxToMeter(item.cx))+'m '+(Calibration.util.carcPxToMeter(item.cy))+'m ';
				html += '		</div>';
				html += '		<span id="result" style="clear:both"></span>';
				html += '		<div style="float:right">';
				if(pa != null && pa.measureEuid != undefined && pa.measureEuid.length > 0 ){
					Calibration.$sector.measureEuid = pa.measureEuid;
					html += '			<button id="but-expansion">扩张</button>';	
				}
				html += '		</div>';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				
				if(pa != null){
					// 정밀도
					html += '<table class="edit-fields">';
					html += '<tr>';
					html += '    <td class="labels" style="width:100px">测定标签</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;" >';
					html += '        <span style="padding-left:5px" id="analysis_tag"></span>';
					html += '    </td>';
					html += '    <td class="labels" style="width:100px">测定位置</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
					html += '        <span style="padding-left:5px" id="analysis_point"></span>';
					html += '    </td>';
					html += '    <td class="labels" style="width:100px">测定时间</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
					html += '        <span style="padding-left:5px" id="analysis_time"></span>';
					html += '    </td>';
					if(pa != null && pa.measureEuid != undefined && pa.measureEuid.length > 0 ){
					html += '    <td class="labels" style="width:100px">范围过滤</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
					html += '        <input id="isFilter" name="isFilter" type="checkbox">';
					html += '    </td>';
					}
					html += '</tr>';
					html += '<tr>';
					html += '    <td class="labels">精密度</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;" colspan="7">';
					html += '        <span style="padding-left:5px" id="analysis_dist"></span>';
					html += '    </td>';
					html += '</tr>';
					html += '<tr>';
					html += '    <td class="labels">误差</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;" colspan="7">';
					html += '        <span style="padding-left:5px" id="analysis_offset"></span>';
					html += '    </td>';
					html += '</tr>';
					html += '</table>';
					
				}
				html += '<table class="edit-list">';
				html += '<tr>';
				html += '	<th style="width:50%">分析预测</th>';
				html += '	<th style="width:50%">分析测定</th>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td style="vertical-align:top">';
				// Planning
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td class="labels" style="width:80px">'+$.rtls.calibration.form.radioenvironment+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;padding-left:4px;">';
				if(item.rcount[0] >= 3){
					html += '	<div style="width:16px; height:16px; background-color:#00FF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
					html += '    '+$.rtls.calibration.form.verygood;	
				}else if(item.rcount[0] + item.rcount[1] >= 3){
					html += '	<div style="width:16px; height:16px; background-color:#FFFF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
					html += '    '+$.rtls.calibration.form.good;	
				}else{
					html += '	<div style="width:16px; height:16px; background-color:#FF0000;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
					html += '    '+$.rtls.calibration.form.poor;	
				}
				html += '    </td>';
				html += '    <td class="labels" style="width:100px">测定成功</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;padding-left:4px;">';
				html += '		 '+item.rate+'%';
				html += '    </td>';
				html += '    <td class="labels" style="width:100px">测定失败</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;padding-left:4px;">';
				html += '		 '+((100 - item.rate).toFixed(2))+'%';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				html += '<table class="edit-list">';
				html += '<tr>';
				html += '	<th>RAP</th>';	
				html += '	<th>'+$.rtls.calibration.form.rapdistance+'</th>';
				html += '	<th>'+$.rtls.calibration.form.baudrate+'</th>';
				html += '	<th>'+$.rtls.calibration.form.blockingrate+'</th>';
				html += '	<th>'+$.rtls.calibration.form.barrier+'</th>';	
				html += '	<th>'+$.rtls.calibration.form.type+'</th>';
				html += '	<th>'+$.rtls.calibration.form.material+'</th>';
				html += '	<th>'+$.rtls.calibration.form.blockingrate+'</th>';
				html += '</tr>';
				var planning = {}, euid = '';
				for(var i=0, len = item.planning.length; i < len; i++){
					planning = item.planning[i];
					euid = planning.euid.substring(planning.euid.length-4, planning.euid.length);
					if(planning.barriers.length == 0){
						html += '<tr>';
						html += '	<td>'+euid+'</td>';	
						html += '	<td>'+Calibration.util.carcPxToMeter(planning.distance)+'m</td>';
						html += '	<td>';
						if(planning.rate >= 80){
							html += '		<div style="width:16px; height:16px; background-color:#00FF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						}else if(planning.rate > 50 && planning.rate < 80){
							html += '		<div style="width:16px; height:16px; background-color:#FFFF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						}else{
							html += '		<div style="width:16px; height:16px; background-color:#FF0000;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						}
						html += '	'+planning.rate+'%</td>';
						html += '	<td>'+((100 - planning.rate).toFixed(2))+'%</td>';
						html += '	<td colspan="4"> '+$.rtls.calibration.barrier.influenceempty+'</td>';
						html += '</tr>';
					}else{
						var barrier = {};
						for(var j=0, blen = planning.barriers.length;  j < blen; j++){
							barrier = planning.barriers[j];
							html += '<tr>';
							if(j == 0){
								html += '	<td rowspan='+blen+'>'+euid+'</td>';	
								html += '	<td rowspan='+blen+'>'+Calibration.util.carcPxToMeter(planning.distance)+'m</td>';
								html += '	<td rowspan='+blen+'>';
								if(planning.rate >= 80){
									html += '		<div style="width:16px; height:16px; background-color:#00FF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
								}else if(planning.rate > 50 && planning.rate < 80){
									html += '		<div style="width:16px; height:16px; background-color:#FFFF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
								}else{
									html += '		<div style="width:16px; height:16px; background-color:#FF0000;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
								}
								html += '	'+planning.rate+'%</td>';
								html += '	<td rowspan='+blen+'>'+((100 - planning.rate).toFixed(2))+'%</td>';
								html += '	<td>'+barrier.description+'</td>';	
								html += '	<td>'+barrier.type+'</td>';
								html += '	<td>'+barrier.material+'</td>';
								html += '	<td>'+barrier.blockingRate+'%</td>';
							}else{
								html += '	<td>'+barrier.description+'</td>';	
								html += '	<td>'+barrier.type+'</td>';
								html += '	<td>'+barrier.material+'</td>';
								html += '	<td>'+barrier.blockingRate+'%</td>';
							}
							html += '</tr>';
						}
					}
				}
				html += '		</table>';
				html += '	</td>';
				html += '	<td style="vertical-align:top">';
				// Analysis
				var analysis = item.analysis, rate = 0;
				var total = 0, success = 0, loss = 0, rxLevel = 0, isFilter = 'false';
				var rapEuid = '';
				if(analysis.size() == 0){
					html += '<center>没有测定的数据</center>'
				}else{
					html += '<table class="edit-fields">';
					html += '<tr>';
					html += '    <td class="labels" style="width:80px">'+$.rtls.calibration.form.radioenvironment+'</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;padding-left:4px;"><span id="analysis_radioenvironment"></span></td>';
					html += '    <td class="labels" style="width:80px">测定成功</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;padding-left:4px;"><span id="analysis_baudrate"></span></td>';
					html += '    <td class="labels" style="width:80px">测定失败</td>';
					html += '    <td style="text-align:left;border:1px solid #dcdcdc;padding-left:4px;"><span id="analysis_blockingrate"></span></td>';
					html += '</tr>';
					html += '</table>';
					html += '<table class="edit-list">';
					html += '<tr>';
					html += '	<th>RAP</th>';	
					html += '	<th>'+$.rtls.calibration.form.baudrate+'</th>';
					html += '	<th>'+$.rtls.calibration.form.blockingrate+'</th>';
					html += '	<th>RX LEVEL</th>';
					html += '</tr>';
					
					var keys = analysis.keys(), data = {};
					var successRate = 0, lossRate = 0;
	                for(var i=0, len = keys.length; i < len; i++){
						rapEuid = keys[i];
						data = analysis.get(rapEuid);
						if(i == 0){
							total = data.totalPacket;
							success = data.successPacket;
							loss = data.lossPacket;
							rxLevel = data.rxLevel;
							isFilter = data.isFilter;
						}
						successRate = parseFloat(((data.successPacket*100)/data.totalPacket).toFixed(2));
						lossRate = parseFloat((100 - successRate).toFixed(2));
						html += '<tr>';
						html += '	<td>'+rapEuid+'</td>';	
						html += '	<td>';
						if(successRate >= 80){
							html += '	<div style="width:16px; height:16px; background-color:#00FF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						}else if(successRate > 50 && successRate < 80){
							html += '	<div style="width:16px; height:16px; background-color:#FFFF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						}else{
							html += '	<div style="width:16px; height:16px; background-color:#FF0000;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						}
						html += '		'+(isNaN(successRate) ? 0 : successRate)+'%';
						html += '	</td>'
						html += '	<td>'+(isNaN(lossRate) ? 0 : lossRate)+'%</td>';
						html += '	<td>'+data.rxLevel.toFixed(2)+' dBm</td>';
						html += '</tr>';
					}
	                rate = parseFloat(((success*100)/total).toFixed(2));
	                
				}
				
				html += '	</td>';
				html += '</tr>';
				html += '</table>';
				$('#edit').html(html);
				
				if(item.analysis.size() > 0){
					// 측위분석결과 확장 버튼 
					$("#but-expansion").button({
						icons: {primary: "ui-icon-arrow-4-diag"}, text:false
					}).click(function() {
						$('#viewport-report').hide();
						$('#viewport').hide();
						$('#viewport-expansion').show();
						Calibration.edit.sector.expansion();
					});
					
					$('input[name="isFilter"]').bootstrapSwitch({
						size : 'small',
						onColor : 'primary',
						animate : true
					}).on('switchChange.bootstrapSwitch', function(event, state) {
						Calibration.edit.sector.$isFilter = state ? "true" : "false";
					});
					$('input[name="isFilter"]').bootstrapSwitch('state', (isFilter == 'true' ? true : false));	
					Calibration.edit.sector.$isFilter = isFilter;
				}
				if(pa != null){
					html = '';
					if(rate >= 80){
						html += '	<div style="width:16px; height:16px; background-color:#00FF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						html += '    '+$.rtls.calibration.form.verygood;	
					}else if(rate > 50 && rate < 80){
						html += '	<div style="width:16px; height:16px; background-color:#FFFF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						html += '    '+$.rtls.calibration.form.good;	
					}else{
						html += '	<div style="width:16px; height:16px; background-color:#FF0000;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
						html += '    '+$.rtls.calibration.form.poor;	
					}
					$('#edit #analysis_radioenvironment').html(html);
					$('#edit #analysis_baudrate').html(rate+'%');
					$('#edit #analysis_blockingrate').html((100-rate).toFixed(2)+'%');
					//정밀도
					if(pa.avgDist == -1){
						$('#edit #analysis_tag').html('--');
						$('#edit #analysis_point').html('--');	
						$('#edit #analysis_time').html('--');	
						$('#edit #analysis_count').html('--');	
						$('#edit #analysis_dist').html('--');
					}else{
						var localX = Calibration.util.carcPxToMeter(pa.localX);
						var localY = Calibration.util.carcPxToMeter(pa.localY);
						var maxLocalX = Calibration.util.carcPxToMeter(pa.maxLocalX);
						var maxLocalY = Calibration.util.carcPxToMeter(pa.maxLocalY);
						var minLocalX = Calibration.util.carcPxToMeter(pa.minLocalX);
						var minLocalY = Calibration.util.carcPxToMeter(pa.minLocalY);
						var avgLocalX = Calibration.util.carcPxToMeter(pa.avgLocalX);
						var avgLocalY = Calibration.util.carcPxToMeter(pa.avgLocalY);
						var maxDist = Calibration.util.carcPxToMeter(pa.maxDist);
						var minDist = Calibration.util.carcPxToMeter(pa.minDist);
						var avgDist = Calibration.util.carcPxToMeter(pa.avgDist);
						var startTime = pa.startTime, stopTime = pa.stopTime;
						
						if(pa.measureEuid != undefined && pa.measureEuid.length > 0){
							$('#edit #analysis_tag').html(pa.measureEuid);	
						}else{
							$('#edit #analysis_tag').html(pa.tagEuid+'(扩张)');
						}
						
						$('#edit #analysis_point').html(localX+'m, '+localY+'m');
						if(startTime != undefined && stopTime != undefined && startTime > 0 && stopTime > 0){
							//console.log(startTime, stopTime);
							$('#edit #analysis_time').html(Calibration.util.time(stopTime - startTime));	
						}else{
							$('#edit #analysis_time').html('-- ~ --');
						}
						
//						$('#edit #analysis_count').html('Total ='+total+', Success = '+success+', Failed : '+loss+'');
						
						var analysisDist = 'MAX = P('+maxLocalX+'m, '+maxLocalY+'m) D('+maxDist+'m)'; 
						analysisDist += ', MIN = P('+minLocalX+'m, '+minLocalY+'m) D('+minDist+'m)'; 
						analysisDist += ', AVG = P('+avgLocalX+'m, '+avgLocalY+'m) D('+avgDist+'m)'; 
						$('#edit #analysis_dist').html(analysisDist);
						
						var analysisOffset = 'MAX = P('+(localX - maxLocalX).toFixed(2)+'m, '+(localY - maxLocalY).toFixed(2)+'m) D('+maxDist+'m)'; 
						analysisOffset += ', MIN = P('+(localX - minLocalX).toFixed(2)+'m, '+(localY - minLocalY).toFixed(2)+'m) D('+minDist+'m)'; 
						analysisOffset += ', AVG = P('+(localX - avgLocalX).toFixed(2)+'m, '+(localY - avgLocalY).toFixed(2)+'m) D('+avgDist+'m)'; 
						$('#edit #analysis_offset').html(analysisOffset);
					}
				}
				
				
			},
			expansion : function(){ //Sector 측정데이터 확장
				Calibration.$expansions = [];
				var item = Calibration.$sector;
				// 확장 point
				var mx = item.x - 5;
				var px = item.x + 5;
				var my = item.y - 5;
				var py = item.y + 5;
				if(mx < 0) mx = 0;
				if(px > Calibration.$sectors.length-1) px = Calibration.$sectors.length - 1;
				if(my < 0) my = 0;
				if(py > Calibration.$sectors[0].length-1) py = Calibration.$sectors[0].length - 1;
				
				
				var analysiss = item.analysis.values(), analysis;
				var size = analysiss.length;
				var total = 0, success = 0, loss = 0, rxLevel = 0;
				for(var j=0; j < size; j++){
                     analysis = analysiss[j];
                     total += analysis.totalPacket;
                     success += analysis.successPacket;
                     loss += analysis.lossPacket;
                     rxLevel += analysis.rxLevel;
				}
				var itemRate = parseFloat(((success*100)/total).toFixed(2));
				
								
				var plan = Calibration.$plan;
				var height = Math.round(Calibration.$plan.height);
				var countX = Math.round(Calibration.util.carcPxToMeter(plan.width));
				var countY = Math.round(Calibration.util.carcPxToMeter(plan.height));
				var width = parseFloat(plan.width);
				var height = parseFloat(plan.height);
				var mapWidth = 792;
				var ratio = mapWidth / width;
				var mapHeight = height * ratio;
				var mapSrc = '/files/plan/map_'+plan.planId+'.png';
				var ratio = mapWidth / width;
				var r = Math.round(parseFloat(plan.pixels) * ratio);
				
				var html = '';
				html += '<div style="text-align:right;width: 250mm;margin:0 auto;">';
				html += '</div>';
				html += '<div id="sector-expansion" class="page">';
				html += '	<h1>Sector '+item.x+', '+item.y+' 展开测定的数据</h1>';
				html += '	<div style="height:10px;"></div>';
				html += '	<div style="float:right">';
				html += '		<button id="but-update">Update</button>';
				html += '		<button id="but-refresh">Refleh</button>';
				html += '	</div>';
				html += '	<div style="clear:both"></div>';
				html += '	<div id="sector-map" style="background-image:url('+mapSrc+'); background-size:'+mapWidth+'px;background-repeat:no-repeat;width:'+mapWidth+'px;height:'+mapHeight+'px; margin:10px 0 10px 0"></div>';
				html += '</div>';
				$('#viewport-expansion').html(html);
				// 확장Sector 업데이트
				$("#sector-expansion #but-update").button({
					icons: {primary: "ui-icon-arrowstop-1-n"}
				}).click(function() {
					Calibration.edit.sector.update(Calibration.$sector, Calibration.$expansions);
				});
				// 새로 갱신 번트
				$("#sector-expansion #but-refresh").button({
					icons: {primary: "ui-icon-refresh"}
				}).click(function() {
					Calibration.edit.sector.expansion();
				});
				//console.log(item);
				
				var paper = new Raphael("sector-map", mapWidth, mapHeight);
				var rects = new Array();
				var tagEuid = '';
				$.eachAsync( Calibration.$sectors, {
					delay : 1,
					bulk: 0,
					loop : function(ix, sectors){
						rects[ix] = new Array();
						$.eachAsync( sectors, {
							delay : 1,
							bulk: 0,
							loop : function(jx, sector){
								var cx = Math.round(parseFloat(sector.cx * ratio) - (r/2));
								var cy = Math.round(parseFloat(sector.cy * ratio) - (r/2));
								paper.text(cx+(r/2), cy+(r/2), sector.x+','+sector.y).attr({'font-size':'10px', 'fill':'#000000', 'font-weight':'normal', 'font-family' : 'Arial'});
								if(sector.analysis.size() > 0){
									analysiss = sector.analysis.values(), analysis;
									size = analysiss.length;
									total = 0, success = 0, loss = 0, rxLevel = 0, tagEuid = '';
									for(var j=0; j < size; j++){
					                     analysis = analysiss[j];
					                     tagEuid = analysis.tagEuid;
					                     total += analysis.totalPacket;
					                     success += analysis.successPacket;
					                     loss += analysis.lossPacket;
					                     rxLevel += analysis.rxLevel;
									}
									var rate = parseFloat(((success*100)/total).toFixed(2));
									if(sector.x == item.x && sector.y == item.y){
										rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#0000ff", "stroke-width": 2, "stroke-opacity": 1, "fill": '#0000ff', "fill-opacity" : 0.5 });	
									}else{
										if(item.measureEuid == tagEuid){
											rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#ff00ff', "fill-opacity" : 0.5 });	
										}else{
											rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#00FF00', "fill-opacity" : 0.5 });
										}
										
									}
								}else{
									rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#ffffff', "fill-opacity" : 0.5 });	
								}
								rects[sector.x][sector.y].node.id = sector.x+'-'+sector.y;
								if(sector.x != item.x || sector.y != item.y){
									// 마우스 이벤트 
									rects[sector.x][sector.y].node.style.cursor = 'pointer';
									rects[sector.x][sector.y].node.onclick = function(event) {
										var id = event.target.getAttribute('id');
										var ids = id.split('-');
										var rect = rects[ids[0]][ids[1]];
										if(Calibration.$expansions.contains(id)){
											var sec = Calibration.$sectors[ids[0]][ids[1]];
											if(sec.analysis.size() > 0){
												var analys = sec.analysis.values(), analy;
												total = 0, success = 0, loss = 0, rxLevel = 0, measureEuid = '';
												for(var j=0; j < analys.length; j++){
													analy = analys[j];
													measureEuid = analy.measureEuid;
													total += analy.totalPacket;
													success += analy.successPacket;
								                }
												var crate = parseFloat(((success*100)/total).toFixed(2));
												if(measureEuid.length > 0){
													rect.animate({'fill' : '#00FF00', "stroke": "#000000", "stroke-width": 0.4}, 100);	
												}else{
													rect.animate({'fill' : '#ffffff', "stroke": "#000000", "stroke-width": 0.4}, 100);
												}
											}else{
												rect.animate({'fill' : '#ffffff', "stroke": "#000000", "stroke-width": 0.4}, 100);	
											}
											
											
											Calibration.$expansions = $.grep(Calibration.$expansions, function(v) {
												return (v !== id);
											});
										}else{
											rect.animate({'fill' : '#FF00ff', "stroke": "#0000ff", "stroke-width": 2}, 100);
											Calibration.$expansions.push(id);
										}
										
								    };	
								}
								
							},
							end : function(){
							}
						});
						
					},
					end : function(){
						
					}
				});
			},
			update : function(sector, expansions){ // 측정데이터 확장 업데이트
				if(expansions.length > 0){
					var exps = '';
					for(var i=0, len = expansions.length; i < len; i++){
						exps += expansions[i]+'|';
					}
					exps = exps.substring(0, exps.length-1);
					$.ajax({
						async : true,
						type: 'post',
						url: "/service/calibration.json?action=update.calibration.analysis",
						dataType: 'json',
			            data : { 
			            	"planId" : Calibration.$plan.planId,
			            	"tagEuid" : sector.tagEuid,
			            	"sectorX" : sector.x,
			            	"sectorY" : sector.y,
			            	"isFilter" : Calibration.edit.sector.$isFilter,
							"expansions" : exps,
							
						},
						beforeSend: function(x) {
						    if(x && x.overrideMimeType) {
						    	x.overrideMimeType("application/json;charset=UTF-8");
						    }
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		Log.dialog($.rtls.commons.dialog.title.ok, '更新成功.', { my: "center center", at: "center center", of: "#viewport-expansion" });
			            		Calibration.$dbsectors = Calibration.get.sector();
			            		Calibration.ui.sector();
			            		Calibration.$expansions = [];
							}else{
								Log.dialog($.rtls.commons.dialog.title.error, '更新失败.', { my: "center center", at: "center center", of: "#viewport-expansion" });
							}
			            	
			        	
						}
					});
				}else{
					Log.dialog($.rtls.commons.dialog.title.waring, '请选择可以更新的 Sector.', { my: "center center", at: "center center", of: "#viewport-expansion" });
				}
				
			},
			checkBarriers : function(x1, y1, x2, y2){ //확장영역에 장애물이 있는지 검출
				var x1 = x1 * 100 + 50;
				var y1 = y1 * 100 + 50;
				var x2 = x2 * 100 + 50;
				var y2 = y2 * 100 + 50;
				var p1 = {x : x1, y : y1};
				var p2 = {x : x2, y : y2};
				var barrier = {};
				var check  = false;
				for(var i=0, len = Calibration.$barriers.length; i < len; i++){
					barrier = Calibration.$barriers[i];
					if(Calibration.analysis.barrierContains(barrier.coordinates, p1, p2)){
						check = true;
						break;
					}
	            }
				return check;
			}
		},
		sync : {
			form : function(){
				var sync = Calibration.$sync;
				var successRate = parseFloat(((sync.successPacket*100)/sync.totalPacket).toFixed(2));
				var lossRate = parseFloat((100-successRate).toFixed(2));
				var rap = {};
				for(var j=0, jlen = Calibration.$raps.length; j < jlen; j++){
					rap = Calibration.$raps[j];
					if(rap.euidSrc == sync.rapEuid){
						break;
					}
				}
				var x = Calibration.util.carcPxToMeter(rap.localX);
				var y = Calibration.util.carcPxToMeter(rap.localY);
				var z = Calibration.util.carcPxToMeter(rap.localZ);
				
				var html = '';
				html += '<table class="edit-fields">';
				html += '<tr>';
				html += '    <td style="background-color:#000000;">';
				html += '    	<div style="float:left;color:#FFFFFF;font-weight: bold; padding-top:4px;">';
				var network = '';
				if(rap.networkType == '1') network = 'ethernet';
				else if(rap.networkType == '2') network = 'wifi';
				else if(rap.networkType == '3') network = 'lte';
				if(rap.rcmMode == 1){
					html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_master_20x20.png'  style='float:left; padding-right:3px'/>";
				}else if(rap.rcmMode == 2){
					html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_20x20.png'  style='float:left; padding-right:3px'/>";
				}else if(rap.rcmMode == 3){
					html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_20x20.png'  style='float:left; padding-right:3px'/>";
				}
				html += '		   '+sync.rapEuid;
				html += '		</div>';
				html += '		<span id="result" style="clear:both"></span>';
				html += '		<div style="float:right">';
				html += '			';
				html += '		</div>';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				
				html += '<table id="form-mod" class="edit-fields">';
				html += '<tr>';
				html += '    <td class="labels"> '+$.rtls.calibration.form.point+'(X)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+x+'m</span>';
				html += '    </td>';
				html += '    <td class="labels"> '+$.rtls.calibration.form.point+'(Y)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+y+'m';
				html += '    </td>';
				html += '    <td class="labels"> '+$.rtls.calibration.form.height+'(Z)</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+z+'m';
				html += '    </td>';
				html += '</tr>';
				html += '<tr>';
				html += '    <td class="labels"> '+$.rtls.calibration.form.radioenvironment+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				if(successRate > 80){
					html += '   <div style="width:16px; height:16px; background-color:#00FF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
		            html += '   '+$.rtls.calibration.form.verygood;   
				}else if(successRate > 50 && successRate < 80){
					html += '   <div style="width:16px; height:16px; background-color:#FFFF00;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
		            html += '    '+$.rtls.calibration.form.good; 
				}else{
					html += '   <div style="width:16px; height:16px; background-color:#FF0000;float:left; margin-left:4px; margin-right:4px; margin-bottom:4px;"></div>';
		            html += '    '+$.rtls.calibration.form.poor; 
				}
				html += '    </td>';
				html += '    <td class="labels"> '+$.rtls.calibration.form.radio+' '+$.rtls.calibration.form.baudrate+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+successRate+'%</span>';
				html += '    </td>';
				html += '    <td class="labels"> '+$.rtls.calibration.form.radio+' '+$.rtls.calibration.form.blockingrate+'</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+lossRate+'%</span>';
				html += '    </td>';
				html += '</tr>';
				html += '<tr>';
				html += '    <td class="labels"> Total Packet</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+sync.totalPacket+'</span>';
				html += '    </td>';
				html += '    <td class="labels"> Success Packet</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+sync.successPacket+'</span>';
				html += '    </td>';
				html += '    <td class="labels"> Loss Packet</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+sync.lossPacket+'</span>';
				html += '    </td>';
				html += '</tr>';
				html += '<tr>';
				html += '    <td class="labels">* RX Level</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+parseFloat(sync.rxLevel).toFixed(2)+'dBm</span>';
				html += '    </td>';
				html += '    <td class="labels">* Sync Clock</td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '		<span style="padding-left:5px;">'+sync.syncClock+'</span>';
				html += '    </td>';
				html += '    <td class="labels"></td>';
				html += '    <td style="text-align:left;border:1px solid #dcdcdc;">';
				html += '    </td>';
				html += '</tr>';
				html += '</table>';
				$('#edit').html(html);
			}
		}
	},
	analysis : {
		start : function(){ //분석시작
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$("#sector_list #time").require($.rtls.validity.required('time')).match("number", $.rtls.validity.match('number', 'time'));
			var result = $.validity.end();
			if(result.valid){
				var time  = parseInt($("#analysis-toolbar #time").val()) * 60 * 1000;
				
				$("#dialog-confirm").dialog({
					title : $.rtls.commons.dialog.title.ok,
			        width: "180",
			        bgiframe: true,
			        autoOpen: false,
			        modal: true,
			        resizable: false,
			        position: { my: "center center", at: "center center", of: ".inner-layout-center" },
			        buttons: [{
			        	text : $.rtls.commons.button.ok,
						click: function() {
							var tags = Calibration.$tags.values();
							var check  = false;
							for(var i=0, len = tags.length; i < len; i++){
								var tag = tags[i];
								if(tag.sectorX >= 0 && tag.sectorY >= 0){
									check = true;
									break;
								}
							}
							if(check){
								$.ajax({
									async : true,
									type: 'get',
									url: "/service/calibration.json?action=start.calibration.analysis",
									contentType: "application/json; charset=utf-8",
						            dataType: 'json',
						            data : { 
										"planId" : Calibration.$plan.planId,
										"time" : time,
									},
									error: function(XMLHttpRequest, textStatus, errorThrown) { 
						            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
						            },
						            success : function (data) {
						            	if(data.result == 'success'){
						            		Calibration.$isAnalysis = 'true';
						    				$('#analysis-toolbar #but-analysis').button("option", { 
						    			        icons: { primary: (Calibration.$isAnalysis == 'false' ? 'ui-icon-play' : 'ui-icon-stop') }
						    			    });
						    				Calibration.$timer.play();
						    				$("#dialog-confirm").dialog( "close" );
										}else{
											$("#dialog-confirm").dialog( "close" );
											
										}
						        	
									}
								});
							}else{
								Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.calibration.analysis.mappingtag, { my: "center center", at: "center center", of: "#dialog-confirm" });
								$("#dialog-confirm").dialog( "close" );
							}
							
						},
			        },{
			        	text : $.rtls.commons.button.cancel,
						click: function() {
							$( this ).dialog( "close" );
						}
					}],
					open : function(){
						
					},
					close: function() {
						$("#dialog-confirm").empty();
						$("#dialog-confirm").dialog('destroy');
			        }
			        
			    });
				$("#dialog-confirm").append($.rtls.calibration.analysis.startconfirm);
				$('#dialog-confirm').dialog('open');
			}
		},
		stop : function(){ //분석중지
			$("#dialog-confirm").dialog({
				title : $.rtls.commons.dialog.title.ok,
		        width: "180",
		        bgiframe: true,
		        autoOpen: false,
		        modal: true,
		        resizable: false,
		        position: { my: "center center", at: "center center", of: ".inner-layout-center" },
		        buttons: [{
		        	text : $.rtls.commons.button.ok,
					click: function() {
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/calibration.json?action=stop.calibration.analysis",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"planId" : Calibration.$plan.planId,
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
				            		Calibration.$isAnalysis = 'false';
				            		$('#analysis-toolbar #but-analysis').button("option", { 
				    			        icons: { primary: (Calibration.$isAnalysis == 'false' ? 'ui-icon-play' : 'ui-icon-stop') }
				    			    });
				            		$('#analysis-toolbar #timer').text("测定中止");
				    				Calibration.$timer.stop();
				            		$("#dialog-confirm").dialog( "close" );
								}else{
									$("#dialog-confirm").dialog( "close" );
									
								}
				        	
							}
						});
					},
		        },{
		        	text : $.rtls.commons.button.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				}],
				open : function(){
					
				},
				close: function() {
					$("#dialog-confirm").empty();
					$("#dialog-confirm").dialog('destroy');
		        }
		        
		    });
			$("#dialog-confirm").append($.rtls.calibration.analysis.stopconfirm);
			$('#dialog-confirm').dialog('open');
		
		},
		carcExpansion : function(){ // 측정데이터 확장 계산
			// 확장영역 초기화
			Calibration.$expansions = new Array(Calibration.$sectors.length);
			var sectors = new Array();
			for(var i=0;  i < Calibration.$sectors.length; i++){
				Calibration.$expansions[i] = new Array(Calibration.$sectors[i].length);
				for(var j=0;  j < Calibration.$sectors[i].length; j++){
					Calibration.$expansions[i][j] = {rate : 0, dist : 0, measureEuid : ''};
					if(Calibration.$sectors[i][j].analysis.size() > 0){
						sectors.push(Calibration.$sectors[i][j]);
					}
				}
			}
			for(var i=0;  i < sectors.length; i++){
				var analysiss = sectors[i].analysis.values();
				var total = 0, success = 0, analysis ={}, avgDist = 0, measureEuid = '';
				for(var j=0; j < analysiss.length; j++){
	                 analysis = analysiss[j];
	                 measureEuid = analysis.measureEuid;
	                 avgDist += analysis.avgDist;
	                 total += analysis.totalPacket;
	                 success += analysis.successPacket;
	                
				}
				var sectorDist = parseFloat((avgDist/analysiss.length).toFixed(2));
				var sectorRate = parseFloat(((success*100)/total).toFixed(1));
				Calibration.$expansions[sectors[i].x][sectors[i].y].rate = sectorRate; //%
				Calibration.$expansions[sectors[i].x][sectors[i].y].dist = sectorDist; //px
				Calibration.$expansions[sectors[i].x][sectors[i].y].measureEuid = measureEuid; 
			}
			//console.log('carc expansion', Calibration.$expansions);
			
		},
		expansion : function(){ //측정데이터 확장
			Calibration.analysis.carcExpansion();
			var plan = Calibration.$plan;
			var height = Math.round(plan.height);
			var countX = Math.round(Calibration.util.carcPxToMeter(plan.width));
			var countY = Math.round(Calibration.util.carcPxToMeter(plan.height));
			var width = parseFloat(plan.width);
			var height = parseFloat(plan.height);
			var mapWidth = 792;
			var ratio = mapWidth / width;
			var mapHeight = height * ratio;
			var mapSrc = '/files/plan/map_'+plan.planId+'.png';
			var ratio = mapWidth / width;
			var r = Math.round(parseFloat(plan.pixels) * ratio);
			
			var html = '';
			html += '<div style="text-align:right;width: 250mm;margin:0 auto;">';
			html += '</div>';
			html += '<div id="sector-expansion" class="page">';
			html += '	<h1>传播测试数据分布</h1>';
			html += '	<div style="height:10px;"></div>';
			html += '	<div style="float:right">';
			html += '		<button id="but-refresh">Refleh</button>';
			html += '	</div>';
			html += '	<div style="clear:both"></div>';
			html += '	<div id="sector-map" style="background-image:url('+mapSrc+'); background-size:'+mapWidth+'px;background-repeat:no-repeat;width:'+mapWidth+'px;height:'+mapHeight+'px; margin:10px 0 10px 0"></div>';
			html += '</div>';
			$('#viewport-expansion').html(html);
			
			$("#viewport-expansion #but-refresh").button({
				icons: {primary: "ui-icon-refresh"}
			}).click(function() {
				Calibration.analysis.expansion();
			});
			
			var paper = new Raphael("sector-map", mapWidth, mapHeight);
			var rects = new Array() , expansion ={};
			$.eachAsync( Calibration.$sectors, {
				delay : 1,
				bulk: 0,
				loop : function(ix, sectors){
					rects[ix] = new Array();
					$.eachAsync( sectors, {
						delay : 1,
						bulk: 0,
						loop : function(jx, sector){
							var cx = Math.round(sector.cx * ratio) - (r/2);
							var cy = Math.round(sector.cy * ratio) - (r/2);
							expansion = Calibration.$expansions[sector.x][sector.y];
							paper.text(cx+(r/2), cy+(r/2), sector.x+','+sector.y).attr({'font-size':'10px', 'fill':'#000000', 'font-weight':'normal', 'font-family' : 'Arial'});
							if(sector.analysis.size() > 0){
								paper.text(cx+(r/2) , cy+(r/2)-12, expansion.rate+'%').attr({'font-size':'10px', 'fill':'#FF0000', 'font-weight':'normal', 'font-family' : 'Arial'});
								paper.text(cx+(r/2) , cy+(r/2)+12, Calibration.util.carcPxToMeter(expansion.dist)+'m').attr({'font-size':'10px', 'fill':'#FF0000', 'font-weight':'normal', 'font-family' : 'Arial'});
								if(expansion.measureEuid != undefined && expansion.measureEuid.length > 0){
									rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#808080", "stroke-width": 1, "stroke-opacity": 0.4, "fill": '#0000ff', "fill-opacity" : 0.3 });
								}else{
									rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#808080", "stroke-width": 1, "stroke-opacity": 0.4, "fill": '#00ff00', "fill-opacity" : 0.3 });	
								}
								
								// 마우스 이벤트 
								rects[sector.x][sector.y].node.style.cursor = 'pointer';
								rects[sector.x][sector.y].node.onclick = function(event) {
									var id = event.target.getAttribute('id');
									var ids = id.split('-');
									Calibration.$sector = Calibration.$sectors[ids[0]][ids[1]];
									Calibration.edit.sector.form();
							    };	
								
							}else{
								rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#808080", "stroke-width": 1, "stroke-opacity": 0.7, "fill": '#ffffff', "fill-opacity" : 0.3 });
//								if(expansion.rate == 0){
//									rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#ffffff', "fill-opacity" : 0.5 });
//								}else{
//									if(expansion.rate >= 80){
//										rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#00FF00', "fill-opacity" : 0.5 });
//									}else if(expansion.rate > 50 && expansion.rate < 80){
//										rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#FFFF00', "fill-opacity" : 0.5 });	
//									}else{
//										rects[sector.x][sector.y] = paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0.4, "stroke-opacity": 1, "fill": '#FF0000', "fill-opacity" : 0.5 });	
//									}
//									paper.text(cx+(r/2), cy+(r/2)+10, expansion.rate+'%').attr({'font-size':'10px', 'fill':'#FF0000', 'font-weight':'normal', 'font-family' : 'Arial'});
//								}
								
							}
							rects[sector.x][sector.y].node.id = sector.x+'-'+sector.y;
						},
						end : function(){
						}
					});
					
				},
				end : function(){
					
				}
			});
		},
		clearSector : function(){ // Sector 측정 데이터 초기화
			$("#dialog-confirm").dialog({
				title : $.rtls.commons.dialog.title.ok,
		        width: "180",
		        bgiframe: true,
		        autoOpen: false,
		        modal: true,
		        resizable: false,
		        position: { my: "center center", at: "center center", of: ".inner-layout-south" },
		        buttons: [{
		        	text : $.rtls.commons.button.ok,
					click: function() {
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/calibration.json?action=clear.calibration.analysis.sector",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"planId" : Calibration.$plan.planId,
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
				            		Calibration.$isAnalysis = "false";
				    				$('#analysis-toolbar #but-analysis').button("option", { 
				    			        icons: { primary: Calibration.$isAnalysis == "false" ? 'ui-icon-play' : 'ui-icon-stop' }
				    			    });
				    				Calibration.$timer.stop();
				    				Calibration.$dbsectors = Calibration.get.sector();
				            		Calibration.ui.sector();
				            		$("#dialog-confirm").dialog( "close" );
								}else{
									$("#dialog-confirm").dialog( "close" );
									
								}
				        	
							}
						});
					},
		        },{
		        	text : $.rtls.commons.button.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				}],
				open : function(){
					
				},
				close: function() {
					$("#dialog-confirm").empty();
					$("#dialog-confirm").dialog('destroy');
		        }
		        
		    });
			$("#dialog-confirm").append($.rtls.calibration.analysis.initconfirm);
			$('#dialog-confirm').dialog('open');
		
		},
		clearSync : function(){ // Wireless sync 측정 데이터 초기화
			$("#dialog-confirm").dialog({
				title : $.rtls.commons.dialog.title.ok,
		        width: "180",
		        bgiframe: true,
		        autoOpen: false,
		        modal: true,
		        resizable: false,
		        position: { my: "center center", at: "center center", of: ".inner-layout-south" },
		        buttons: [{
		        	text : $.rtls.commons.button.ok,
					click: function() {
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/calibration.json?action=clear.calibration.analysis.sync",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"planId" : Calibration.$plan.planId,
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
				            		Calibration.$isAnalysis = "false";
				    				$('#analysis-toolbar #but-analysis').button("option", { 
				    			        icons: { primary: Calibration.$isAnalysis == "false" ? 'ui-icon-play' : 'ui-icon-stop' }
				    			    });
				    				Calibration.$timer.stop();
				    				Calibration.ui.sync();
				            		$("#dialog-confirm").dialog( "close" );
								}else{
									$("#dialog-confirm").dialog( "close" );
									
								}
				        	
							}
						});
					},
		        },{
		        	text : $.rtls.commons.button.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				}],
				open : function(){
					
				},
				close: function() {
					$("#dialog-confirm").empty();
					$("#dialog-confirm").dialog('destroy');
		        }
		        
		    });
			$("#dialog-confirm").append($.rtls.calibration.analysis.initconfirm);
			$('#dialog-confirm').dialog('open');
		},
		rap : function(ap){ //RAP 전파환경분석
			var plan = Calibration.$plan;
			var countX = Math.round(Calibration.util.carcPxToMeter(plan.width));
			var countY = Math.round(Calibration.util.carcPxToMeter(plan.height));
			var width = parseFloat(plan.width);
			var height = parseFloat(plan.height);
			var r = Math.round(plan.pixels);
			
			ap.analysis = new Array(countX);
			// GRAPH 생성
			var rapX = ap.localX;
			var rapY = ap.localY;
			var cx = 0, cy =0, cz = 0, sx = 50, sy = 50, sz = 0, unit = 1, distance = 0, rate = 0, blockingRate = 0;
			var barriers = [], html = '';
			for(var i=0; i < countX; i++){
				ap.analysis[i] = new Array(countY);
				for(var j=0; j < countY; j++){
					cx = Math.round(i * r) + (r/2);
					cy = Math.round(j * r) + (r/2);
					//거리에 의한 전송율 계산 (100 / (de * (d-t))%
					distance = Calibration.util.carcPxToMeter(Calibration.util.carcDistance(rapX, rapY, cx, cy)); //px
					rate = 100; 
					if(distance/100 > Calibration.$radio.threshold){
						rate = 100 / (Calibration.$radio.decrease * (distance/100 - Calibration.$radio.threshold));
						if(rate > 100){
							rate = 100;
						}else{
							rate = parseFloat(rate.toFixed(2));
						}
					}
					
					// 장애물에 의한 차단율 계산
					//console.log('sector', i, j);
					//console.log('target_line', cx+","+(-cy), rapX+","+rapY);
			    	barriers = Calibration.analysis.getBarriers({'x': cx, 'y':cy},{'x':rapX, 'y':rapY});
			    	blockingRate = 0;
					for(var k=0; k < barriers.length; k++){
						blockingRate += barriers[k].blockingRate;
					}
					rate = parseFloat((rate - blockingRate).toFixed(2));
					if(rate < 0) rate = 0;
					// 그래프 그리기
					sz = rate * 2;
					cz = sz/2 + height;
					
					ap.analysis[i][j] = {
						euid : ap.euidSrc,
						x : i, y : j, cx : cx, cy : cy, cz : cz, sx : sx, sy : sy, sz : sz, 
						distance : distance, rate: rate, blockingRate : blockingRate, 
						barriers : barriers 	
					};
					
				}
			}
		},
		getBarriers : function(p1, p2){ //두 타겟지점의 장애물
			var barriers = new Array();
			var barrier = {};
    		for(var i=0; i < Calibration.$barriers.length; i++){
    			barrier = Calibration.$barriers[i];
    			if(Calibration.analysis.barrierContains(barrier.coordinates, p1, p2)){
    				if(!barriers.contains(barrier)){
    					barriers.push(barrier);
    				}
    			}
    		}
			return barriers;
		},
		barrierContains : function(coordinates, p1, p2){ //타겟 두점에 대한 장애물 검출
			// 다각형의 Vertex 구하기
			var coors = coordinates.split('|');
	    	var vertexs = new Array();
	    	var point = {x : 0, y : 0}, coor = [];
	    	for(var i=0; i < coors.length; i++){
	    		point = {x : 0, y : 0};
	    		coor = coors[i].split(':');
		    	point.x = Math.round(coor[0]);
	    		point.y = Math.round(coor[1]);
	    		vertexs.push(point);
	    		
	    	}
	    	//console.log('coordinates', coordinates);
	    	//console.log('vertexs', vertexs);
	    	// 각 선분의 교차점을 검출하여 장애물 영향도 검출
	    	var vp1 = null, vp2 = null;
	    	for(var i=0; i < vertexs.length; i++){ 
	    		if(i == vertexs.length-1){
	    			vp1 = vertexs[i];
	    			vp2 = vertexs[0]
	    		}else{
	    			vp1 = vertexs[i];
		    		vp2 = vertexs[i+1]	
	    		}
	    		if(Calibration.analysis.isIntersection(p1, p2, vp1, vp2)){
	    			return true;
	    		}
	    	}
	    	return false;

	    },
	    isIntersection : function(tp1, tp2, vp1, vp2){ // 두직선의 교점이 있는 체크(점의 좌표 4개)
	    	//console.log(tp1.x+","+tp1.y, tp2.x+","+tp2.y, "==", vp1.x+","+vp1.y, vp2.x+","+vp2.y);

	    	var under = (vp2.y-vp1.y)*(tp2.x-tp1.x)-(vp2.x-vp1.x)*(tp2.y-tp1.y);
	        if(under==0) return false;

	        var _t = (vp2.x-vp1.x)*(tp1.y-vp1.y) - (vp2.y-vp1.y)*(tp1.x-vp1.x);
	        var _s = (tp2.x-tp1.x)*(tp1.y-vp1.y) - (tp2.y-tp1.y)*(tp1.x-vp1.x); 
	        var t = _t/under;
	        var s = _s/under; 

	        if(t<0.0 || t>1.0 || s<0.0 || s>1.0) return false;
	        if(_t==0 && _s==0) return false; 

	        var x = tp1.x + t * (tp2.x-tp1.x);
	        var y = tp1.y + t * (tp2.y-tp1.y);

	        //console.log('교점 : '+x +", "+y, "under="+under, "t="+t, "s="+s);
	        return true;
	    }
		
	},
	report : {
		form : function(){
			var plan = Calibration.$plan;
			var height = Calibration.util.carcPxToMeter(Calibration.$map.height);
			var countX = Math.round(Calibration.util.carcPxToMeter(plan.width));
			var countY = Math.round(Calibration.util.carcPxToMeter(plan.height));
			var width = parseFloat(plan.width);
			var height = parseFloat(plan.height);
			var mapWidth = 792;
			var ratio = mapWidth / width;
			var mapHeight = height * ratio;
			var mapSrc = '/files/plan/map_'+plan.planId+'.png';
			
			var html = '';
			html += '<div style="text-align:right;width: 250mm;margin:0 auto;">';
			html += '	<button id="but-print">Print</button>';
			html += '	<button id="but-refresh">Refleh</button>';
			html += '</div>';
			html += '<div class="printable">';
			html += '<div class="page">';
			html += '	<div style="height:300px"></div>';
			html += '	<h1>UWB RTLS Network Analysis Report</h1>';
			html += '	<div style="height:200px"></div>';
			html += '	<h1>'+$.now().msday()+'</h1>';
			html += '</div>';
			html += '<div class="page">';
			html += '	<h2>1. Coverage Areas</h2>';
			html += '	<table class="report-table">';
			html += '	<thead>';
			html += '	<tr>';
			html += '		<th>Name</th>';
			html += '		<th>Areas</th>';
			html += '	</tr>';
			html += '	</thead>';
			html += '	<tbody>';
			html += '	<tr>';
			html += '		<td>'+plan.name+'</td>';
			html += '		<td>'+Calibration.util.carcPxToMeter(plan.width)+'m x '+Calibration.util.carcPxToMeter(plan.height)+'m </td>';
			html += '	</tr>';
			html += '	</tbody>';
			html += '	</table>';
			html += '	<div style="padding-top:10px"><img src="'+mapSrc+'" width="'+mapWidth+'" height="'+mapHeight+'"/></div>';
			html += '</div>';
			html += '<div class="page">';
			html += '	<h2>2. Survey AP Locations</h2>';
			html += '	<div id="rap-locations" style="background-image:url('+mapSrc+'); background-size:'+mapWidth+'px;background-repeat:no-repeat;width:'+mapWidth+'px;height:'+mapHeight+'px; margin:10px 0 10px 0"></div>';
			html += '	<table id="rap-locations-table" class="report-table">';
			html += '	<thead>';
			html += '	<tr>';
			html += '		<th>EUID</th>';
			html += '		<th>Network</th>';
			html += '		<th>Type</th>';
			html += '		<th>Location</th>';
			html += '	</tr>';
			html += '	</thead>';
			html += '	<tbody>';
			html += '	</tbody>';
			html += '	</table>';
			html += '</div>';
			html += '<div id="wireless-health" class="page">';
			html += '	<h2>3. Wireless Sync Health</h2>';
			html += '</div>';
			html += '<div id="wireless-health-append"></div>';
			html += '<div class="page">';
			html += '	<h2>4. UWB Health</h2>';
			html += '	<h3>4.1 Analysis UWB Health</h2>';
			html += '	<div id="uwb-health-analysis" style="background-image:url('+mapSrc+'); background-size:'+mapWidth+'px;background-repeat:no-repeat;width:'+mapWidth+'px;height:'+mapHeight+'px; margin:10px 0 10px 0"></div>';
			html += '	<table id="positioning-accuracy-table" class="report-table">';
			html += '	<thead>';
			html += '	<tr>';
			html += '		<th>Sector</th>';
			html += '		<th>TAG</th>';
			html += '		<th>Position</th>';
			html += '		<th>Positioning accuracy</th>';
			html += '		<th>Positioning offset</th>';
			html += '	</tr>';
			html += '	</thead>';
			html += '	<tbody>';
			html += '	</tbody>';
			html += '	</table>';
			html += '</div>';
			html += '</div>';
			$('#viewport-report').html(html);
			
			$("#but-print").button({
				icons: {primary: "ui-icon-print"}, text:false
			}).click(function() {
				$(".printable").printThis({
					debug: false,              
					importCSS: true,           
					printContainer: true,      
					loadCSS: "/resources/service/css/calibration.print.css", 
					pageTitle: "",             
					removeInline: false        
				});
		
			});
			$("#but-refresh").button({
				icons: {primary: "ui-icon-refresh"}, text:false
			}).click(function() {
				Calibration.report.form();
			});
			
			setTimeout(function() {
				Calibration.report.reporting();
			}, 10);
			
		},
		reporting : function(){
			Calibration.analysis.carcExpansion();
			var plan = Calibration.$plan;
			var width = plan.width;
			var height = plan.height;
			var mapWidth = 792;
			var ratio = mapWidth / width;
			var mapHeight = height * ratio;
			var mapSrc = '/files/plan/map_'+plan.planId+'.png';
			
			var paperRap = new Raphael("rap-locations", mapWidth, mapHeight);
			var rap = {}, network = '', rapX = 0, rapY=0, masterCount = 0, slaveCount = 0;
			var html = '';
			$.eachAsync( Calibration.$raps, {
				delay : 1,
				bulk: 0,
				loop : function(ix, rap){
					rapX = Math.round(parseFloat(rap.localX) * ratio);
					rapY = Math.round(parseFloat(rap.localY) * ratio);
					
					html = '<tr>';
					html += '	<td>'+rap.euidSrc+'</td>';
					if(rap.networkType == '1'){
						network = 'ethernet';
						html += '<td>Ethernet</td>';
					}else if(rap.networkType == '2'){
						network = 'wifi';
						html += '<td>WiFi</td>';
					}else if(rap.networkType == '3'){
						network = 'lte';
						html += '<td>LTE</td>';
					}
					if(rap.rcmMode == '1'){
						paperRap.image('/resources/commons/images/map/icon_rap_'+network+'_master_20x20.png', rapX, rapY, 20,20);
						html += '<td>Master</td>';
						// Wireless Sync Health
						masterCount++;
						if(masterCount > 1){
							$('#wireless-health-append').append('<div class="page"><h3>3.'+masterCount+' '+rap.euidSrc+'</h3><div id="wireless-health-'+rap.euidSrc+'" style="background-image:url('+mapSrc+'); background-size:'+mapWidth+'px;background-repeat:no-repeat;width:'+mapWidth+'px;height:'+mapHeight+'px; margin:10px 0 10px 0"></div></div>');
						}else{
							$('#wireless-health').append('<h3>3.'+masterCount+'	'+rap.euidSrc+'</h3><div id="wireless-health-'+rap.euidSrc+'" style="background-image:url('+mapSrc+'); background-size:'+mapWidth+'px;background-repeat:no-repeat;width:'+mapWidth+'px;height:'+mapHeight+'px; margin:10px 0 10px 0"></div>');
							var syncHtml = '	<table id="sync-table-'+rap.euidSrc+'" class="report-table">';
							syncHtml += '	<thead>';
							syncHtml += '	<tr>';
							syncHtml += '		<th>EUID</th>';
							syncHtml += '		<th>'+$.rtls.calibration.form.radio+' '+$.rtls.calibration.form.baudrate+'</th>';
							syncHtml += '		<th>'+$.rtls.calibration.form.radio+' '+$.rtls.calibration.form.blockingrate+'</th>';
							syncHtml += '		<th>RX Level</th>';
							syncHtml += '		<th>Sync Clock</th>';
							syncHtml += '	</tr>';
							syncHtml += '	</thead>';
							syncHtml += '	<tbody>';
							syncHtml += '	</tbody>';
							syncHtml += '	</table>';
							$('#wireless-health').append(syncHtml);
							
						}
					}else{
						paperRap.image('/resources/commons/images/map/icon_rap_'+network+'_slave_20x20.png', rapX, rapY, 20,20);
						html += '<td>Slave</td>';
						// AP Serving Areas
						slaveCount++;
					}
					html += '	<td>'+Calibration.util.carcPxToMeter(rap.localX)+'m x '+Calibration.util.carcPxToMeter(rap.localY)+'m, Height : '+Calibration.util.carcPxToMeter(rap.localZ)+'m</td>';
					html += '</tr>';
					$('#rap-locations-table > tbody').append(html);
				},
				end : function(){
					
				}
			});
			
			// Wireless Sync Health & Serving Areas Graph draw
			var r = Math.round(parseFloat(plan.pixels) * ratio);
			$.eachAsync( Calibration.$raps, {
				delay : 1,
				bulk: 0,
				loop : function(ix, rap){
					if(rap.rcmMode == '1'){
						var paper = new Raphael("wireless-health-"+rap.euidSrc, mapWidth, mapHeight);
						// RAP 위치 등록
						for(var i=0, len = Calibration.$raps.length; i < len; i++){
							rapX = Math.round(parseFloat(Calibration.$raps[i].localX) * ratio);
							rapY = Math.round(parseFloat(Calibration.$raps[i].localY) * ratio);
							if(Calibration.$raps[i].networkType == '1'){
								network = 'ethernet';
							}else if(Calibration.$raps[i].networkType == '2'){
								network = 'wifi';
							}else if(Calibration.$raps[i].networkType == '3'){
								network = 'lte';
							}
							if(Calibration.$raps[i].rcmMode == '1'){
								paper.image('/resources/commons/images/map/icon_rap_'+network+'_master_20x20.png', rapX, rapY, 20,20);
							}else{
								paper.image('/resources/commons/images/map/icon_rap_'+network+'_slave_20x20.png', rapX, rapY, 20,20);
							}
						}
						
						// 분석이 없으면 전파분석
						if(rap.analysis == undefined || rap.analysis.length == 0){ 
							Calibration.analysis.rap(rap, false); 
						}
						$.eachAsync( rap.analysis, {
							delay : 1,
							bulk: 0,
							loop : function(jx, analysis){
								var cx =0, cy =0, opacity=0;
								$.eachAsync( analysis, {
									delay : 1,
									bulk: 0,
									loop : function(kx, analysis){
										cx = Math.round((analysis.cx * ratio) - (r/2));
										cy = Math.round((analysis.cy * ratio) - (r/2));
										opacity = parseFloat((analysis.rate / 100).toFixed(2)) - 0.2 ;
										if(analysis.rate >= 80){
											opacity = opacity / 1.5
											paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0, "stroke-opacity": 0, "fill": '#00FF00', "fill-opacity" : opacity });
										}else if(analysis.rate > 50 && analysis.rate < 80){
											paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0, "stroke-opacity": 0, "fill": '#FFFF00', "fill-opacity" : opacity });
										}else{
											paper.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0, "stroke-opacity": 0, "fill": '#FF0000', "fill-opacity" : opacity });	
										}
									},
									end : function(){
										
									}
								});
							},
							end : function(){
								
							}
						});
						// Sync table	
						var syncs = Calibration.$syncs.get(rap.euidSrc), sync, html = '', rate = 0;
						for(var i=0, len = syncs.length; i < len; i++){
							sync = syncs[i];
							rate = parseFloat(((sync.successPacket*100)/sync.totalPacket).toFixed(2));
							html = '<tr>';
							html += '	<td>'+sync.rapEuid+'</td>';
							html += '	<td>'+rate+'%</td>';
							html += '	<td>'+(100 - rate).toFixed(2)+'%</td>';
							html += '	<td>'+sync.rxLevel+'dBm</td>';
							html += '	<td>'+sync.syncClock+'</td>';
							html += '</tr>';
							$('#sync-table-'+rap.euidSrc+' tbody').append(html);
						}
					}
					
				},
				end : function(){
					
				}
			});
		    // UWB Health Graph draw
//			var paperPlanning = new Raphael("uwb-health-planning", mapWidth, mapHeight);
//			$.eachAsync(Calibration.$sectors, {
//				delay : 1,
//				bulk: 0,
//				loop : function(ix, sectors){
//					var opacity = 0, cx = 0, cy = 0;
//					$.eachAsync( sectors, {
//						delay : 1,
//						bulk: 0,
//						loop : function(jx, sector){
//							cx = Math.round(parseFloat(sector.cx) * ratio) - (r/2);
//							cy = Math.round(parseFloat(sector.cy) * ratio) - (r/2);
//							opacity = parseFloat((sector.rate / 100).toFixed(2)) - 0.2;
//							if(sector.rcount[0] >= 3){
//								paperPlanning.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0, "stroke-opacity": 0, "fill": '#00FF00', "fill-opacity" : opacity });
//							}else if(sector.rcount[0] + sector.rcount[1] >= 3){
//								paperPlanning.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0, "stroke-opacity": 0, "fill": '#FFFF00', "fill-opacity" : opacity });
//							}else{
//								paperPlanning.rect(cx, cy, r, r, 0).attr({ "stroke": "#000000", "stroke-width": 0, "stroke-opacity": 0, "fill": '#FF0000', "fill-opacity" : opacity });	
//							}
//						},
//						end : function(){
//							
//						}
//					});
//				},
//				end : function(){
//					
//				}
//			});
			
			var paperAnalysis = new Raphael("uwb-health-analysis", mapWidth, mapHeight);
			var pa = {}, rate = 0, html = '', expansion = {};
			$.eachAsync(Calibration.$sectors, {
				delay : 1,
				bulk: 0,
				loop : function(ix, sectors){
					var opacity = 0, cx = 0, cy = 0;
					$.eachAsync( sectors, {
						delay : 1,
						bulk: 0,
						loop : function(jx, sector){
							cx = Math.round(parseFloat(sector.cx) * ratio) - (r/2);
							cy = Math.round(parseFloat(sector.cy) * ratio) - (r/2);
							expansion = Calibration.$expansions[sector.x][sector.y];
							
							if(expansion.rate != 0){
								paperAnalysis.text(cx+(r/2), cy+(r/2), sector.x+','+sector.y).attr({'font-size':'10px', 'fill':'#000000', 'font-weight':'normal', 'font-family' : 'Arial'});
								paperAnalysis.text(cx+(r/2) , cy+(r/2)-12, expansion.rate+'%').attr({'font-size':'10px', 'fill':'#FF0000', 'font-weight':'normal', 'font-family' : 'Arial'});
								paperAnalysis.text(cx+(r/2) , cy+(r/2)+12, Calibration.util.carcPxToMeter(expansion.dist)+'m').attr({'font-size':'10px', 'fill':'#FF0000', 'font-weight':'normal', 'font-family' : 'Arial'});
								if(expansion.measureEuid != undefined && expansion.measureEuid.length > 0){
									paperAnalysis.rect(cx, cy, r, r, 0).attr({ "stroke": "#808080", "stroke-width": 1, "stroke-opacity": 0.4, "fill": '#0000ff', "fill-opacity" : 0.3 });
								}else{
									paperAnalysis.rect(cx, cy, r, r, 0).attr({ "stroke": "#808080", "stroke-width": 1, "stroke-opacity": 0.4, "fill": '#00ff00', "fill-opacity" : 0.3 });	
								}
								opacity = parseFloat((rate / 100).toFixed(2)) - 0.2 ;
								
								
								if(sector.analysis.size() > 0){
									var item = sector.analysis.values()[0];
									var offsetX = item.localX - item.avgLocalX;
									var offsetY = item.localY - item.avgLocalY;
									
									var itemRate = parseFloat(item.successPacket) * 100 / parseFloat(item.totalPacket); 
									html = '<tr>';
									html += '  <td>'+sector.x+', '+sector.y+'</td>';
									html += '  <td>'+item.tagEuid+'</td>';
									html += '  <td>'+Calibration.util.carcPxToMeter(item.localX)+'m x '+Calibration.util.carcPxToMeter(item.localY)+'m</td>';
									html += '  <td>Rate = '+itemRate.toFixed(2)+'%, Dist = '+Calibration.util.carcPxToMeter(item.avgDist)+'m</td>';
									html += '  <td>'+Calibration.util.carcPxToMeter(offsetX)+'m, '+Calibration.util.carcPxToMeter(offsetY)+'m</td>';
									html += '</tr>';
									$("#positioning-accuracy-table > tbody").append(html);
								}
							}
							
						},
						end : function(){
							
						}
					});
				},
				end : function(){
					
				}
			});
			
			
		}
	},
	callback : {
		rapSelect : function(){ // RAP 선택
			var marker = Calibration.$map.marker.getSelectedItem();
			$('li', '#tags').removeClass('ui-selected');
			$('li', '#sectors').removeClass('ui-selected');
			$('li', '#syncs').removeClass('ui-selected');
			$('li', '#raps').removeClass('ui-selected');
			$('#'+marker.attr('id'), '#raps').addClass('ui-selected');
			
			var ids = marker.attr('id').split('_')
			
			for(var i=0; i < Calibration.$raps.length; i++){
				if(Calibration.$raps[i].rapId == ids[1]){
					Calibration.edit.rap.form(Calibration.$raps[i]);
					break;
				}
			}
		},
		tagSelect : function(){ // 태그선택
			var marker = Calibration.$map.marker.getSelectedItem();
			$('li', '#tags').removeClass('ui-selected');
			$('li', '#sectors').removeClass('ui-selected');
			$('li', '#syncs').removeClass('ui-selected');
			$('li', '#raps').removeClass('ui-selected');
			$('#'+marker.attr('id'), '#tags').addClass('ui-selected');
			var ids = marker.attr('id').split('_')
			for(var i=0; i < Calibration.$tags.length; i++){
				if(Calibration.$tags[i].euid == ids[1]){
					Calibration.$tag = Calibration.$tags[i];
					Calibration.edit.tag.form();
					break;
				}
			}
		},
		tagMod : function(){ //태그 위치 정보 수정
			var marker = Calibration.$map.marker.getSelectedItem();
			var id = marker.attr('id');
			var localX = marker.attr('localX');
			var localY = marker.attr('localY');
			
			var ids = id.split('_');
			Calibration.$tag = Calibration.$tags.get(ids[1]);
			Calibration.$tag.localX = localX;
			Calibration.$tag.localY = localY;
			
			$("#sector_0000000000000000_"+Calibration.$tag.sectorX+"_"+Calibration.$tag.sectorY+" #tag").html('');
			
			var sectorX = Math.round(Calibration.util.carcPxToMeter(localX));
			var sectorY = Math.round(Calibration.util.carcPxToMeter(localY));
			Calibration.$tag.sectorX = sectorX;
    		Calibration.$tag.sectorY = sectorY;
    		if(!Calibration.$tag.sector.containsKey(sectorX+"_"+sectorY)){
    			Calibration.$tag.sector.put(sectorX+"_"+sectorY, 1);	
    		}
    		var euid = Calibration.$tag.euid.substring(Calibration.$tag.euid.length-4, Calibration.$tag.euid.length);
    		if(Calibration.$tag.type == 1){
    			$("#sector_0000000000000000_"+sectorX+"_"+sectorY+" #tag").html('<img src="/resources/commons/images/map/icon_tag_fixed.png" width="14" height="14" align="absmiddle"/> '+euid);	
    		}else{
    			$("#sector_0000000000000000_"+sectorX+"_"+sectorY+" #tag").html('<img src="/resources/commons/images/map/icon_tag_move.png" width="14" height="14" align="absmiddle"/> '+euid);
    		}
    		Calibration.edit.tag.form();
		
		},
		addBarrier : function(polygon, points){
			$('li', '#barriers').removeClass('ui-selected');

			if(Calibration.edit.barrier.$mode != 'redraw'){
				Calibration.$barrier = null;
				Calibration.edit.barrier.$mode = '';
			}
			Calibration.edit.barrier.form();
			
			var p = '';
			for(var i=0; i < points.length; i++){
				p += points[i].x+':'+points[i].y+'|';
			}
			if(p.length > 0){
				p = p.substring(0, p.length - 1);	
			}
			$('#coordinates').val(p);
			Calibration.$map.barrier.points = [];
			
			
		},
		
	},
	worker : {
		tag : function(tagEuid){
			var worker = new Worker('/resources/commons/js/idolink/ido.worker.js');
			worker.onmessage = function(e){
				var data = e.data;
				if(Calibration.$plan.planId == data.planId){
					var x = parseFloat(data.localX);
					var y = parseFloat(data.localY);
					var sectorX = Math.round(Calibration.util.carcPxToMeter(x));
					var sectorY = Math.round(Calibration.util.carcPxToMeter(y));
					var tag = Calibration.$tags.get(data.tagEuid);
					if(tag == undefined){
						tag = {
							euid : data.tagEuid,
							type : data.tagType,
							ix : -1,
							sectorX : -1,
							sectorY : -1,
							localX : x,
							localY : y,
							dist : 0,
							sector : new HashMap()
						};
						tag.sector.put(sectorX+"_"+sectorY, 1);
						Calibration.$tags.put(data.tagEuid, tag);
					}else{
						var count = tag.sector.get(sectorX+"_"+sectorY);
						if(count == undefined){
							count = 1;
						}else{
							count++;
						}
						if(tag.sectorX == -1 && tag.sectorY == -1){
							var cx = (tag.localX + x) / 2;
							var cy = (tag.localY + y) / 2;
							if(!isNaN(cx) && !isNaN(cy)){
								tag.localX = parseFloat(cx.toFixed(2));
								tag.localY = parseFloat(cy.toFixed(2));
							}
						}
						tag.sector.put(sectorX+"_"+sectorY, count);
						// 정밀도 계산
						if(Calibration.$isAnalysis == 'true'){
							var dist = Calibration.util.carcDistance(tag.localX, tag.localY, x, y);
							if(tag.dist == 0 || isNaN(tag.dist)){
								tag.dist = Calibration.util.carcPxToMeter(dist);
							}else{
								dist = (tag.dist + Calibration.util.carcPxToMeter(dist)) / 2;
								tag.dist = parseFloat(dist.toFixed(2));
							}
							//console.log(tag.localX, tag.localY, x, y, dist, tag.dist+'m');
						}
					}
					var keys = tag.sector.keys(), key, count = 0, precount = 0;
					for(var i=0, len = keys.length; i < len; i++){
						count = tag.sector.get(keys[i]);
						if(count > precount){
							key = keys[i];
							precount = count;
						}
					}
					var euid = data.tagEuid.substring(data.tagEuid.length-4, data.tagEuid.length);
					var ixs = [];
					if(tag.sectorX >= 0 && tag.sectorY >= 0){
						ixs = [tag.sectorX, tag.sectorY];
					}else{
						ixs = key.split('_');
					}
					if($('#tags #tag_'+data.tagEuid).exists()){
						var html = '';
						if(data.tagType == 1){
							html += "<img src='/resources/commons/images/map/icon_tag_fixed.png'  style='float:left; padding-right:3px'/> ";	
						}else{
							html += "<img src='/resources/commons/images/map/icon_tag_move.png'  style='float:left; padding-right:3px'/> ";
						}
						html += euid+" [S "+ixs[0]+","+ixs[1]+"]";
						if(Calibration.$isAnalysis == 'true'){
							html += " - "+tag.dist+"m";	
						}
						$('#tags #tag_'+data.tagEuid).html(html);
					}else{
						var html = "<li class='ui-widget-content' style='height:22px;clear:both' id='tag_"+data.tagEuid+"'>";
						if(data.tagType == 1){
							html += "<img src='/resources/commons/images/map/icon_tag_fixed.png'  style='float:left; padding-right:3px'/> ";	
						}else{
							html += "<img src='/resources/commons/images/map/icon_tag_move.png'  style='float:left; padding-right:3px'/> ";
						}
						html += euid+" [S "+ixs[0]+","+ixs[1]+"]";
						if(Calibration.$isAnalysis == 'true'){
							html += " - "+tag.dist+"m";	
						}
						html += "</li>";
						$('#tag_list #tags').append(html);
					}
					
				}
				
			};
			Calibration.$tagWorks.put(tagEuid, worker);
		},
		report : function(rapEuid){
			var worker = new Worker('/resources/commons/js/idolink/ido.worker.js');
			worker.onmessage = function(e){
				var data = e.data;
				if(Calibration.$plan.planId == parseInt(data.planId)){
					// BUTTON CHECK
					Calibration.$isAnalysis = data.isAnalysis;
					$('#analysis-toolbar #but-analysis').button("option", { icons: { primary: (Calibration.$isAnalysis == 'false' ? 'ui-icon-play' : 'ui-icon-stop') }});
					if(data.isAnalysis == 'true'){
						$('#analysis-toolbar #timer').text(Calibration.util.time(parseInt(data.stopTime)));
					}else{
						$('#analysis-toolbar #timer').text('측정완료');
						Calibration.$timer.stop();
					}
					// Sync 측정 데이터 업데이트
					var syncs = data.syncs;
					if(syncs != undefined){
						var sync, syncDatas, syncData;
						for(var i=0, len = syncs.length; i < len; i++){
							sync = syncs[i];
							syncDatas = Calibration.$syncs.get(sync.masterEuid);
							if(syncDatas != undefined){
								syncData = null;
								for(var j=0, jlen = syncDatas.length; j < jlen; j++){
									if(syncDatas[j].rapEuid == data.rapEuid){
										syncData = syncDatas[j];
										break;
									}
								}
								if(syncData != null){
									syncData.totalPacket = sync.totalPacket;
									syncData.successPacket = sync.successPacket;
									syncData.lossPacket = sync.lossPacket;
									syncData.rxLevel = sync.rxLevel;
									syncData.syncClock = sync.syncClock;
								}else{
									sync.rapEuid = data.rapEuid;
									syncDatas.push(sync);
								}
							}else{
								syncDatas = new Array();
								sync.rapEuid = data.rapEuid;
								syncDatas.push(sync);
								Calibration.$syncs.put(sync.masterEuid, syncDatas);
							}
						}
					}
					
					// Sector 측정데이터 업데이트
					var items = data.tags;
					if(items != undefined){
						var item, tag, sector, height = Math.round(Calibration.$map.height), unit = 1
						for(var i=0, len = items.length; i < len; i++){
							item = items[i];
							tag = Calibration.$tags.get(item.tagEuid);
							if(tag != undefined && tag.sectorX > -1 && tag.sectorY > -1){ // tag와 sector가 Mapping이 되어 있으면
								sector = Calibration.$sectors[tag.sectorX][tag.sectorY];
								sector.analysis.put(data.rapEuid, {
									totalPacket : parseInt(item.totalPacket),
									successPacket : parseInt(item.successPacket),
									lossPacket : parseInt(item.lossPacket),
									rxLevel : parseFloat(item.rxLevel),
									startTime : data.startTime,
									stopTime : data.addTime
								});
							}
						}
					}
					
				}
				
			};
			Calibration.$reportWorks.put(rapEuid, worker);
		},
		updateReport : function(){
			// Sync 측정 업데이트
			var masters = Calibration.$syncs.keys();
			$.eachAsync(masters, {
				delay : 50,
				bulk: 0,
				loop : function(ix, master){
					var syncs = Calibration.$syncs.get(master);
					$.eachAsync(syncs, {
						delay : 50,
						bulk: 0,
						loop : function(jx, sync){		
							var rate = parseFloat(((sync.successPacket*100)/sync.totalPacket).toFixed(2));
							if(!isNaN(rate)){
								var rap = {};
								for(var i=0, len = Calibration.$raps.length; i < len; i++){
									if(Calibration.$raps[i].euidSrc == sync.rapEuid){
										rap = Calibration.$raps[i];
										break;
									}
								}
								var x = Calibration.util.carcPxToMeter(rap.localX);
								var y = Calibration.util.carcPxToMeter(rap.localY);
								var z = Calibration.util.carcPxToMeter(rap.localZ);
								
								if(rate >= 80){
									$('#sync-'+sync.masterEuid+'-'+sync.rapEuid+' #rate').css('background-color', '#00FF00').text(rate+'%');
								}else if(rate > 50 && rate < 80){
									$('#sync-'+sync.masterEuid+'-'+sync.rapEuid+' #rate').css('background-color', '#FFFF00').text(rate+'%');
								}else{
									$('#sync-'+sync.masterEuid+'-'+sync.rapEuid+' #rate').css('background-color', '#FF0000').text(rate+'%');
								}
								var euid = sync.rapEuid.substring(sync.rapEuid.length-4, sync.rapEuid.length);
								
								Calibration.$map.draw.getItem('rap_text_'+rap.rapId).attr({text : euid+'('+rate+'%)'});
							}
						},
						end : function(){
							
						}
					});
				},
				end : function(){
					
				}
			});
			// Sector 측정 업데이트
			var tags = Calibration.$tags.values();
			$.eachAsync( tags, {
				delay : 50,
				bulk: 0,
				loop : function(ix, tag){
					if(tag.ix >= 0 && tag.sectorX >=0 && tag.sectorY >= 0){
						var sector = Calibration.$sectors[tag.sectorX][tag.sectorY];
							
						var analysiss = sector.analysis.values(), analysis;
						var size = analysiss.length;
						var total = 0, success = 0, loss = 0, rxLevel = 0;
						for(var j=0; j < size; j++){
							analysis = analysiss[j];
							total += analysis.totalPacket;
							success += analysis.successPacket;
							loss += analysis.lossPacket;
							rxLevel += analysis.rxLevel;
						}
						rxLevel = parseFloat((rxLevel / size).toFixed(2));
						var rate = parseFloat(((success*100)/total).toFixed(2));
						if(!isNaN(rate)){
							if(rate >= 80){
								$('#sector_0000000000000000_'+tag.sectorX+'_'+tag.sectorY+' #analysis').css('background-color', '#00FF00');
							}else if(rate > 50 && rate < 80){
								$('#sector_0000000000000000_'+tag.sectorX+'_'+tag.sectorY+' #analysis').css('background-color', '#FFFF00');
							}else{
								$('#sector_0000000000000000_'+tag.sectorX+'_'+tag.sectorY+' #analysis').css('background-color', '#FF0000');
							}
							$('#sector_0000000000000000_'+tag.sectorX+'_'+tag.sectorY+' #analysis').html(rate);
							var euid = tag.euid.substring(tag.euid.length-4, tag.euid.length);
							Calibration.$map.draw.getItem('tag_text_'+tag.euid).attr({text : euid+'('+rate+'%, '+tag.dist+'m)'});
						}
					}
				},
				end : function(){
				}
			});
		}
	},
	notify : {
		$client : null,
		init : function(){
			var sock = new SockJS('/rtls/sockjs');
		  	Calibration.notify.$client = Stomp.over(sock);
		  	Calibration.notify.$client.debug = null;
		  	Calibration.notify.$client.connect({}, function(frame) {
		  		//console.log("Stomp.sock.connect");
		  		Calibration.notify.$client.subscribe("/queue/position", function(message) {
					var alarm  = $.parseJSON(message.body);
	    			var worker = Calibration.$tagWorks.get(alarm.tagEuid);
	    			if(worker != undefined){
	    				worker.postMessage(alarm);
					}else{
						Calibration.worker.tag(alarm.tagEuid);
					}
		    	});
		  		Calibration.notify.$client.subscribe("/queue/report", function(message) {
					var alarm  = $.parseJSON(message.body);
	    			var worker = Calibration.$reportWorks.get(alarm.rapEuid);
					if(worker != undefined){
						worker.postMessage(alarm);
					}else{
						Calibration.worker.report(alarm.rapEuid);
					}
		    	});
		    });
		    sock.onclose = function(event) {
		    	console.log("Stomp.sock.closed");
		    	
		    };
		 	$(window).bind('beforeunload',function(){
		    	console.log("Stomp.window.beforeunload");
		    	if(Calibration.notify.$client != null){
		    		Calibration.notify.$client.disconnect();
		    	}
		    });

		},
		close : function(){
			if(Calibration.notify.$client != null){
				Calibration.notify.$client.disconnect();
	    	}
		}
	},
	util : {
		carcPxToMeter : function(px){
			var m = (px * Calibration.$plan.meter);
			return parseFloat(m.toFixed(2));
		},
		carcMeterToPx : function(m){
			var p = (m * Calibration.$plan.pixels);
			return parseFloat(p.toFixed(2));
		},
		carcDistance : function(x1, y1, x2, y2){
			var x = parseInt(x1) - parseInt(x2);
			if(x < 0 ) x = x * -1;
			var y = parseInt(y1) - parseInt(y2);
			if(y < 0 ) y = y * -1;
			var fix = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
			return parseFloat(fix.toFixed(2));
		},
		hexToRgbColor : function(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		},
		rgbToHexColor : function(r, g, b) {
		    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
		},
		componentToHex : function(c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		},
		time : function(milliseconds){
			var min = milliseconds / 1000 / 60;
			var r = min % 1;
			var sec = Math.floor(r * 60);
			min = Math.floor(min);
			if(min < 10) min = "0"+min;
			if(sec < 10) sec = "0"+sec;
			return min+":"+sec;
		},
	}
};


