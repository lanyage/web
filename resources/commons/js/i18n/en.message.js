(function($) {
$.datepicker.setDefaults({
    changeMonth: true,
    changeYear: true,
    showMonthAfterYear:true,
    dateFormat: 'yy-mm-dd',
    buttonImageOnly: true,
    buttonText: "Calendar"
});
		
$.rtls = {
	lang : 'en',	
	language : function(lang){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/system.json?action=change.system.language",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"lang" : lang
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	var url = $(location).attr('href');
        		window.location = url;
			}
		});
	},
	home : 'Home',
	validity : {
		required : function(field){
			return field+" is required.";
		},
		match : function(type, field){
			if(type == 'id'){
				return "ID is in an invalid format.(Alphabet 4 ~ 20 chart)";	
			}else if(type == 'pixels'){
				return "Pixels is in an invalid format.";	
			}else if(type == 'meter'){
				return "Meter is in an invalid format.";	
			}else if(type == 'number'){
				return field+"must be formatted as a number.";	
			}else if(type == 'phone'){
				return field+" is in an invalid format.";	
			}else{
				return field+" is in an invalid format.";	
			}
			return "";
		},
		range : function(start, end, field){
			return field+'must be between '+start+' and '+end+''; 
		},
		check : function(field){
			return field+" checks";
		},
		notequal : function(field1, field2){
			return field1+"/"+field2+" Values don't match.";
		},
		select : function(field){
			return "Selecting "+field+"";
		},
		checkId : function(field, result){
			if(result == 'success'){
				return field+" the available id";	
			}else{
				return field+" duplicate id";	
			}
		}
	},
	menu : [
		{title : 'Management', heading : ['Management'], sub:['User management']},
		{title : 'Tools', heading : ['Tools'], sub:['Floor Plan', 'Zones', 'Movement Tracking','RAP', 'RAP version management', 'Position', 'Settings','OMP Management', 'RAP [outdoor]', 'Pre-build', 'Calibration']},
		{title : 'Dashboard', heading : ['Dashboard'], sub:['RAP', 'TAG', 'System', 'Error', 'RAP [outdoor]', 'Sound Level']},
		{title : 'Statistics', heading : ['Statistics', 'Log'], sub:['System', 'Zone', 'Service', 'User', 'Errors', 'Zone', 'Positioning system', 'Errors', 'Positioning system[outdoor]', 'Playback', 'Sound Level']},
		{title : 'Live Stream', heading : ['Live stream of current floor plan'], sub:[]},
		{title : 'Tag management', heading : ['Tag management'], sub:['Tag issue', 'TAG register']}
	],
	header : function(name){
		return $('.header .manager').html('Hello <span class="name">'+name+'</span> | <a href="javascript:$.rtls.language(\'ko\')">KOREAN</a> | <a href="javascript:$.rtls.language(\'en\')"><b>ENGLISH</b></a> | <a href="/api/index.html"><span style="font-weight: bold;">API Reference</span></a>');
	},
	commons : {
		button : {
			ok : 'OK',
			cancel : 'Cancel',
			add : 'Add',
			mod : 'Mod',
			del : 'Del',
			close : 'Close',
			apply : 'Apply'
		},
		dialog : {
			title : {
				success : 'Success',
				error : 'Error',
				waring : 'Warning',
				ok : 'Confirm'
			}
			
		},
		message : {
			errorsystem : 'System error',
			errorpermission : '<p>Not have access to RTLS System</p><p>Available after login.</p>',
			initconfirm : 'Are you sure you want to initialize the statistical data?',
		}
	},
	main : {
		total : 'Total',
		online : 'Online',
		offline : 'Offline',
		totalChart : {
			title : 'RAP Status',
			online : 'RAP Online', 
			offline : 'RAP Offline',
		},
		masterChart : {
			title : 'MASTER RAP Status',
			online : 'MASTER RAP Online', 
			offline : 'MASTER RAP Offline'
		},
		slaveChart : {
			title : 'SLAVE RAP Status',
			online : 'SLAVE RAP Online', 
			offline : 'SLAVE RAP Offline'
		}
	},
	manager : {
		button : { add :'Register', mod :'Modify', del : 'Delete', idcheck:'Duplicate Check', ok : 'Ok', cancel : 'Cancel'},
		form : {
			id : 'ID',
			password : 'Password',
			passwordRe : 'Confirm Password',
			name : 'Name',
			permission : 'Permissions'
		},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['Num','Class','ID','Name','Permissions','Date','Login time','Modify/Delete'],
			className : ['Admin','Manager'],
			empty : 'No data',
		},
		dialog : {
			title : {add :'User add', mod : 'User mod', del : 'User del'}
		},
		message : {
			addfail : 'Failed to register account info', 
			modfail : 'Failed to modify account info', 
			delfail : 'Failed to delete account info', 
			delconfirm : 'Are you sure you want to delete this account?', 
			loginfail : "<p>ID/Password values don't match.</p>",
			unapproved : '<p>Unauthorized user.</p><p>Available after administrator approval.</p>',
			stopsite : '<p>Suspended service site</p>'
		}
		
	},
	plan : {
		button : { add :'Add', mod :'Modify', del : 'Delete', upload : 'Upload'},
		tool : {pointer : 'Move Tool', distance : 'Distance Measuring', distancePoint : 'Two points Distance Measurement', grid : 'Show grid', ruler : 'Show Rulers', drawing3d : '3D drawing', zone : 'Zone Setting tool', movement : 'Movement Setting Tool',wall : 'Wall Add Tool',barrier : 'Brrier Add Tool'},
		form : {
			planName : 'Map name',
			planSize : 'Map Scale',
			planPixels : 'Ratio',
			isMovement : 'Movement',
			planFile : 'Map image',
			mapFile : 'Map file',
			textureFile : 'Texture file',
			use : 'Use',
			unused : 'Unused',
			del : 'Del',
			type : 'Type',
			name : 'Name',
			size : 'Size',
			sports : 'Sports',
			width : 'Width',
			height : 'Height',
			offset : 'Offset',
		},
		dialog : {
			title : ['Map add']
		},
		message : {
			namedublicate : 'Map name is duplicated.',
			fileexists : 'Map file does not exist.',
			delfail : 'Failed to delete map',
			delconfirm : '<p>Are you sure you want to delete this map?</p>',
			typefail : 'PNG type image format is used only.',
			addsuccess : 'Success.',
			uploadfail : 'Failed to upload file',
			dropzone : 'Drag the file you want to upload here.',
			dropzonemsg : 'The browser does not support multiple upload. Click here to upload individually.'
		}
	},
	zone : {
		button : { add :'Add', mod :'Modify', del : 'Delete', resetting : 'Re-Setting', update : 'Zone Setting update'},
		form : {
			name : 'Zone name',
			file : 'Zone image',
			type : 'Zone type',
			color : 'Zone color',
			safeZone : 'Safety',
			dangerZone : 'Danger'
		},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['Color','Zone name','Zone type'],
			empty : 'No data',
		},
		dialog : {
			title : ['Zone setting add', 'Zone setting modify']
		},
		message : {
			whitecolor : 'White is not available.',
			colorduplicate : 'The color is duplicate.',
			addfail : 'Failed to add zone info',
			fileexists : 'Zone image does not exist.',
			delfail : 'Failed to delete zone info.',
			fileupload : 'Please upload an zone image.',
			uploadfail : 'Failed to upload file',
			typefail : 'PNG type image format is used only.',
			delconfirm : '<p>Are you sure you want to delete this zone info?</p>',
			updateconfirm: '<p>Are you sure you want to apply this zone info?</p>',
			updatefail: '<p>Failed to apply this zone info</p>',
			planover: 'Areas beyond the drawing area can not be set.',
		}
	},
	movement : {
		button : { add :'Add', preview : 'Preview', update : 'Movement setting Update'},
		form : {
			lineBorder : 'Line Border',
		},
		dialog : {
			title : ['Wall add', 'Wall mod', 'Movement node add', 'Movement node del', 'Preview']
		},
		
		message : {
			delconfirm: '<p>Are you sure you want to delete this movement info?</p>',
			updatesuccess : 'Success to apply movement info',
			updatefail : 'Failed to apply movement info',
			updateconfirm : '<p>Are you sure you want to apply this movement info?</p>',
			
		}
	},
	
	device : {
		button : { add :'Add', mod :'Modify', del : 'Delete', modall :'Modify location', config : 'RAP Settings', select : 'Select', cancel : 'Cancel', search : 'Address search'},
		form : {
			point : 'Location',
			height : 'Height',
			isAp : 'AP',
			networkType : 'Network',
			description : 'Note',
			use : 'Use',
			notuse : 'Unused',
			second : 'Sec',
			number : '',
			distance : ' Distance',
			select : 'Select',
			latitude : 'Latitude',
			longitude : 'Longitude',
			signalRatio : 'Signal Ratio',
			signalWeight : 'Signal Weight',
			direction : 'Direction',
			zoneType : 'Zone type',
			zone1D : '1D Zone',
			zone2D : '2D Zone',
			east : 'East', west : 'Weat', south : 'South', north : 'North',
			
			
		},
		status : {normal : 'Normal', fault : 'Fault'},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			empty : 'No data',
		},
		dialog : {
			title : ['Choose RAP', 'RAP Setting', 'Choose Master RAP']
		},
		message : {
			emptyrap : 'No RAP',
			selectrap : 'Choose RAP',
			modsuccess : 'Success to modify',
			modfail : 'Failed to modify',
			modconfirm : 'Do you want to modify the location of all RAP?',
			delfail : ' Failed to delete RAP',
			delconfirm : '<p>Are you sure you want to delete RAP?</p>',
			config : 'RAP Setting',
			configsuccess : 'Success to setting RAP',
			deadrap : 'Disconnected RAP',
			configfail : 'Failed to setting RAP',
			searchaddress : 'Enter the address you want to search.',
			emptydata : 'No data.'	
		}
	},
	rap : {
		button : { add :'Add', use :'Enable', upgrade : 'Remote upgrade', mod : 'Modify', del : 'Delete' },
		form : {
			version : 'Version',
			note : 'Note',
			file : 'Firmware'
			
		},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['Check','Version','Note','Firmware','Date','Modify/Delete'],
			empty : 'No data.',
		},
		dialog : {
			title : ['Firmware add', 'Firmware modify', 'Remote upgrade']
		},
		message : {
			fileexists : 'Firmware file does not exist.',
			uploadfail : 'Failed to upload file',
			version : 'Version info is required.',
			delfail : ' Fail to delete',
			delconfirm : 'Are you sure you want to delete this version info?',
			selectfail : 'Failed to choose version',
			upgradesuccess : 'Success to firmware upgrade',
			upgradefail : 'Failed to firmware upgrade',
			upgradetype : 'Select the type of upgrade',
			uploadfail : 'Failed to upload file',
		}
	},
	position : {
		button : { 
			add :'Add', modall :'Modify location', mod : 'Modify', del : 'Delete', cancel : 'Cancel',
			search : 'Serach', select : 'Select', simulator : 'Simulator', monitoringon : 'Monitoring start', monitoringoff : 'Monitoring stop', clear : 'Log clear' },
		form : {
			name : 'Name',
			point : 'Location',
			description : 'Note',
			time : 'Time',
			tag : 'TAG',
			scale : 'List number',
			neighborhood : 'around',
			number : '',
			algorithm : 'Algorithm',
			all : 'All',
			tdoa : 'TDOA',
			twr : 'TWR',
			latitude : 'Latitude',
			longitude : 'Longitude',
			address : 'Address',
			calibration : 'Calibration',
			uncalibration : 'Uncalibration',
		},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['Check','Version','Note','File name','Date','Modify/Delete'],
			empty : 'No data.',
		},
		log : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['No','Algorithm','TAG','Zone','Location info','Time'],
			empty : 'No data.',
		},
		out : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['No','Algorithm','TAG','Location info','Calibration','GPS Time','Add Time'],
			empty : 'No data.',
		},
		dialog : {
			title : ['Choose TAG', 'Movement']
		},
		message : {
			addfail : ' Failed to add',
			point : 'Fields is required.',
			modsuccess : 'Success to modify',
			modfail : 'Failed to modify',
			modconfirm : 'Do you want to modify the location of all Position',
			delfail : 'Failed to delete',
			delconfirm : 'Are you sure you want to delete this position?',
			tagselect : 'Choose TAG.',
			movementtag : 'Choose TAG.',
			simulator : 'Choose Simulator conditions.[Time, Tag, Algorithm]',
			clearfail : 'Failed to clear historys',
			monitoringfail : 'Failed to monitoring.',
			monitoringonconfirm : 'Start monitoring.',
			monitoringoffconfirm : 'Stop monitoring.',
			logdelconfirm : '<p>Are you sure you want to clear historys?</p>',
			
		}
	},
	config : {
		button : { set : 'Setting', tagselect : 'TAG Choose', search : 'Search'},
		form : {
			algorithm : 'Algorithm',
			speed : 'Speed',
			time : 'Time',
			waitTime : 'Wait Time',
			avgMinCount : 'TOA Min Count',
			baseHeight : 'Base Height',
			isLogInsert : 'RAW Logs',
			use : 'USE',
			notuse : 'UNUSED',
			broadcastTerm : 'Broadcast Term',
			gpsTerm : 'GPS Term',
			uwbTerm : 'UWB Wait Time',
			uwbAct : 'UWB ON/OFF',
			dgpsAct : 'D-GPS ON/OFF',
			uwbBlink : 'UWB Blink Term',
			tdoaRatio : 'TDOA Ratio',
			thresh : 'Correlation coefficient',
			grad : 'Rate',
			angle : 'Degree',
			isSports : 'Sports Mode',
			tagfilter : 'TAG Search',
			ball : 'The ball tag'
		},
		title : {
			uwb : 'UWB Configuration',
			tdoa : 'TDOA Algorithm Configuration',
			gps : 'GPS Configuration',
			server : 'Server Configuration',
			motion : 'Motion Detection Configuration(Sports Mode)',
			tag : 'TAG Choose'
		},
		message : {
			modsuccess : 'Settings successfully saved',
			modfail : 'Failed to setting'
		},
		description : {
			avgMinCount : "Time of arrival (TOA or ToA), sometimes called time of flight (ToF), is the travel time of a UWB radio signal from a single transmitter (TAG) to a remote single receiver (RAP).<br>The system begins its computations only after the number of data sets collected exceeds the \"TOA Min Count\" threshold.<br>If this value is 0, then the system can calculate a tag's position, regardless of the number of TOA data points collected.",
			speed : "If a tag's speed calculated from the positioning data is faster than this 'speed factor', system will discard that positioning data.<br>This speed factor is applied differently according to the tag's movement.<br>If the system determines that a tag is moving, triple the Speed factor is applied in computations.<br>For a sport tracking tag(ball),  this factor will applied by 10 times.",
			time : "If, for example, a tag's blink period is 500 milliseconds and the this factor is 3 seconds, then the system will calculate the position after collecting six sets of TOA data.<br>The time value dictates the sampling interval for computing movement.",
			motion : "This is the threshold value for determining the movement of a tag.<br>If a tag's correlation coefficient and its rate of change of motion is greater than the threshold, system can determine that the tag is moving.<BR>Increasing the two threshold values, the tag's movement is not well detected.",
			baseHeight : 'Reference height of TAG for the positioning calculation',
			ballEuid : 'Use the ball tag euid (after 4 digits)',
			waitTime : 'UWB Data max wait time',
			tdoaRatio : 'Distortion correction setting value of the positioning value',
			angle : 'Angle threshold for checking the linearity of position AP',
		}
	},
	omp : {
		button : { info :'Send', report :'Report', search : 'Search'},
		form : {
			creationTime : 'Creation Time',
			lastModifiedTime : 'Last Modified Time',
			deviceSearch : 'Device Search',
			reportSearch : 'Report Search',
			ompRAPId : 'OMP RAP ID',
			reportTime : 'Report Time',
			modTime : 'Modity Time',
			reportNum : 'Report number',
			reportDate : 'Report Date',
			
			
		},
		list : { 
			top : { addDate : 'Creation Time', modDate : 'Last Modified Time'},
			head : ['Num','RAP Resource ID','RAP Resource URL','Send'],
			empty : 'No data.',
		},
		dialog : {
			title : ['Report']
		},
		message : {
			resetsuccess : 'Success to Reset.',
			resetfail : 'Failed to Reset.',
			reportsuccess : 'Success to Report.',
			reportfail : 'Failed to Report.',
		}
	},
	tag : {
		button : { search :'Search', addall : 'TAG Add', mod : 'Modify', del : 'Delete'},
		status : ['Spare','Issued','Pickup','Repair','Defect', 'Loss'],
		type : ['Fixed','Portable','Card'],
		active : {normal : 'Normal', stop : 'Stop'},
		form : {
			select : 'Select',
			full : 'All',
			search : 'Search',
			tagType : 'TAG Type',
			activeStatus : 'Active Status',
			tagStatus : 'TAG Status',
			serial : 'Serial',
			version : 'Version',
			battery : 'Battery',
			status : 'Status',
			active : 'Active',
			aliveTime : 'Active Time',
			number : '',
			normal : 'Normal',
			low : 'Low',
			excel : 'Excel upload',
			serialnum : 'Serial number',
			type : 'Type',
			blink : 'Blink period'
			
		},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['Num','Type','EUID','Serial','Version','Battery','Status','Alive Time','Modify/Delete'],
			empty : 'No data.',
		},
		dialog : {
			title : ['TAG Add','TAG modify']
		},
		message : {
			addfail : 'Failed to add',
			addexcel : 'Selecting excel file',
			modfail : 'Failed to modify',
			delfail : 'Failed to delete',
			delconfirm : '<p>Are you sure you want to delete this TAG?<p>',
			uploadfail : 'Failed to upload file'
				
		}
		
	},
	system : {
		button : {search : 'Search'},
		chart : {
			title : { cpu : 'CPU usage(%)', memory : 'Memory usage(%)', network : 'Network usage(KB/s)'}
		},
		tab : {day : 'Daily Statistics', month : 'Monthly Statistics', year : 'Yearly statistics'},
		form : {
			date : 'Date',
			year : 'Year',
			month : 'Month'
		},
		
	},
	error : {
		button : {filter : 'TAG Filters', scroll : 'Auto scroll', clear : 'Console clear', search : 'Search', select : 'Select'},
		level : ['Critical', 'Major', 'Minor'],
		type : ['RAP Alive', 'Tag battery', 'Positioning error'],
		ecase : [
		    'Insufficient TOA, TWR', 
		    'The received TDOA value is greater than the distance between the two RAP.', 
		    'The TDOA values are changed suddenly while monitoring variation.',
		    'The TAG movement exceeds the speed limit value from the server.',
		    'Algorithm calculates error',
		    'This error occurs when you have not set the zone',
		    'Map scale over',
		    'Map-matching error',
		    'It occurs when unexpected fault happened during the positioning process. ',
		],
		chart : {
			title : { error : 'Failure rate (%)', success : 'The success rate statistics'}
		},
		form : {
			point : 'Location',
			full : 'All',
			total : 'Total',
			time : 'Time',
			date : 'Date',
			plan : 'MAP',
			tag : 'TAG',
			type : 'Error type',
			level : 'Error level',
			success : 'Success',
			fail : 'Failed',
			count : 'Count',
			number : '',
		},
		log : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>.';},
			head : ['No','Error type','Error level','RAP/TAG','Error case','Date'],
			empty : 'No data.',
		},
		dialog : {
			title : ['TAG Filters','TAG Selecting']
		},
		message : {
			tagselect : 'Choose TAG.',
		}
	},
	history : {
		button : {search : 'Search', select : 'Select'},
		chart : {
			title : { waitTime : 'Wait Time(%)', visitCount : 'Visit Count', network : 'Network useage(KB/s)'}
		},
		tab : {zone : 'Statistics by area', plan : 'Statistics by map'},
		form : {
			time : 'Time',
			tag : 'Tag',
			plan : 'MAP',
			scale : 'List numbers',
			number : '',
			visit : 'visit',
			full : 'ALL',
			hour : ':',
			min : ':',
			sec : ''
		},
		list : { 
			top : function(totalNum){ return 'Total <span class="font_color1 bold">'+totalNum+'</span>.';},
			head : ['No','MAP','TAG','Zone','Wait Time','Create Time'],
			empty : 'No data.',
		},
		dialog : {
			title : ['Selecting TAG']
		},
		message : {
			tagselect : 'Choose TAG.',
		}
	},
	service : {
		button : {search : 'Search', select : 'Select'},
		tab : {success : 'The  success rate statistics', time : 'Hourly Statistics', rap : 'Statistics by RAP'},
		form : {
			date : 'Date',
			plan : 'Map',
			tag : 'TAG',
			full : 'ALL',
			time : 'Hour'
		},
		list : { 
			head : ['No','TAG','Attempts count','Success count','Failed count','Success rate', 'Failed case', 'Total', 'Time'],
			empty : 'No data.',
		},
		dialog : {
			title : ['Selecting TAG']
		},
		message : {
			tagselect : 'Choose TAG.',
		}
	},
	simulator : {
		button : {scroll : 'Auto scroll', simulatoron : 'Start', simulatoroff : 'Stop', simulatorpause : 'Pause', clear : 'Console clear'},
		form : {
			full : 'ALL',
			plan : 'Select Drawing',
			rap : 'Select RAP',
		},
		dialog : {
			title : ['Disconnected server']
		},
		message : {
			disconnected : '<p>Disconnected server.</p>',
			alreadyon : 'Simulator is already running.',
			alreadyoff : 'Simulator is already stop.'
		}
	},
	panel : {
		button : {scroll : 'Auto scroll', monitoring : 'Moitoring', clear : 'Console clear', logclear : 'Logs clear', movement : 'Movement tracking', filter : 'TAG filters'},
		form : {
			full : 'ALL',
			tag : 'Select Tag',
			plan : 'Select Drawing',
			outdoormap : 'GIS Map',
		},
		dialog : {
			title : ['Disconnected server','TAG Filters']
		},
		message : {
			disconnected : '<p>Disconnected Server.</p>',
			clearconfirm : '<p>Are you sure you want to delete the log?</p>',
			clearfail : 'Failed to clear logs.',
			monitoringon : 'Monitoring start',
			monitoringoff : 'Monitoring stop.',
			tagselect : 'Choose TAG.',
			
		}
	},
	user : {
		button : {add :'Issue', delall :'Delete all', mod : 'Modify', del : 'Return', move : 'Move', edit : 'Edit Category', editcancel : 'Edit cancel', search : 'Search', select : 'Select'},
		tab : {tagissued : 'Issued list', tagreturn : 'Return list', user : 'User Statistics', visit : 'Visit Statistics'},
		status : ['Return', 'Issued'],		
		chart : {
			title : { waitTime : 'Wait time(%)', visit : 'Visits'}
		},
		form : {
			full : 'ALL',
			name : 'Name',
			version : 'Version',
			battery : 'Battery',
			man : 'Man',
			woman : 'Woman',
			normal : 'Normal',
			low : 'Low',
			tag : 'TAG',
			alias : 'Alias',
			gender : 'Gender',
			phone : 'Emergency Contact',
			color : 'Color',
			size : 'Size',
			euid : 'TAG',
			select : 'Select',
			date : 'Date',
			user : 'User',
			count : 'visit',
			day : 'day',
			tagfilter : 'TAG Search',
			plan : 'Choose Plan',
		},
		list : { 
			top : function(groupName, totalNum){ return '<span class="font_color1 bold">'+groupName+'</span> Total <span class="font_color1 bold">'+totalNum+'</span> user.';},
			head : ['','TAG','Positioning Plan','Alias','Gender','Contact','Node','Status','Issued time','Return time','Modify/Return'],
			empty : 'No data',
		},
		statistics : { 
			head : ['No','User','Visits','Active Time','Zone','Total'],
		},
		dialog : {
			title : ['Choose TAG', 'TAG Issued','Info modify','Choose category']
		},
		message : {
			tagselect : 'Choose TAG.',
			addfail : ' Failed to issued TAG',
			euidduplicate : 'TAG already is in use by another user.',
			tagnumduplicate : 'TAG number is duplicated.',
			delfail : 'Failed to return TAG',
			delconfirm : 'Are you sure you want to return the tags?',
			delselect : 'Select more than one user.',
			delallconfirm : 'Do you want to return the TAG?',
			userselect : 'Select more than one user.',
			movefail : 'Failed to move users',
			moveselect : 'Choose move category.',
			groupnotempty : '<p>Belonging to the sub-category category.</p>',
			usernotempty : '<p>There are users who belong to the category.</p>',
			groupdelsucccess : '<p>Success to delete category.</p>'
		}
	},
	calibration : {
		button : {add :'Add', analysis :'Radio Analysis', mod : 'Modify', del : 'Delete', init : 'Init', select : 'Select'},
		form : {
			full : 'Full',
			select : 'Select',
			plan : 'Floor Plan',
			point : 'Location',
			barrier : 'Obstacle',
			add : 'Add',
			description : 'Description',
			type : 'Type',
			material : 'Material',
			coordinates : 'Coordinates',
			blockingRate : 'Blocking rate',
			redraw : 'Re-Draw',
			radio : 'Radio',
			radioenvironment : 'Radio environment',
			baudrate : 'Baud rate',
			blockingrate: 'blocking rate',
			verygood : 'Very good',
			good : 'Good',
			poor : 'Poor',
			horizontal : 'Horizontal',
			vertical : 'Vertical',
			height : 'Height',
			isAp : 'AP',
			networkType : 'Network',
			use : 'Use',
			notuse : 'Unused',
			number : '',
			distance : 'distance',
			rapdistance : 'Distance from RAP',
			analysis : 'Radio environment',
			sec : 'sec',
			min : 'min'
		},
		rap : { 
			empty : 'No data',
			emptyrap : 'No data',
			selectrap : 'Choose RAP',
			modsuccess : 'Success to modify',
			modfail : 'Failed to modify',
			delsuccess : 'Success to delete RAP',
			delfail : 'Failed to delete RAP',
			delconfirm : 'Are you sure you want to delete RAP?',
			configsuccess : 'Success to setting RAP',
			deadrap : 'Disconnected RAP',
			configfail : 'Failed to setting RAP'
		},
		barrier : { 
			empty : 'No data',
			influenceempty : 'There is no obstacle to influence.',
			modsuccess : 'Success to modify',
			modfail : 'Failed to modify',
			delsuccess : 'Success to delete obstacle',
			delfail : 'Failed to delete obstacle',
			delconfirm : 'Are you sure you want to delete obstacle?',
			types : ['Wall','Column','Door'],
			materials : ['Wood', 'Iron', 'Ferroconcret', 'Plastic', 'Glass', 'Gypsum board']
		},
		analysis : {
			mappingtag : '<p>Mapping된 Tag가 없습니다.</p><p>각 Sector에 Mapping 후 측정하세요.</p>',
			startconfirm : 'Do you want to start the measurement?',
			stopconfirm : 'Do you want to stop the measurement?',
			initconfirm : 'Are you sure you want to initialize the measured data?',
		},
		
		dialog : {
			title : ['Choose RAP']
		},
		
	},
	playback : {
		form : {
			full : 'All',
			plan : 'Map',
			time : 'Time',
			settime : 'Time Settings',
			tag : 'Tag',
			oclock : "o'clock",
		},
		message : {
			settime : 'Choose a time',
			choosetag : 'Choose the TAG play'
		}
	},
};

})( jQuery );
