(function($) {
$.datepicker.setDefaults({
    monthNames: ['년 1월','년 2월','년 3월','년 4월','년 5월','년 6월','년 7월','년 8월','년 9월','년 10월','년 11월','년 12월'],
    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    changeMonth: true,
    changeYear: true,
    showMonthAfterYear:true,
    dateFormat: 'yy-mm-dd',
    buttonImageOnly: true,
    buttonText: "달력"
});
$.timepicker.regional['ko'] = {
	timeOnlyTitle: '시간 선택',
	timeText: '시간',
	hourText: '시',
	minuteText: '분',
	secondText: '초',
	millisecText: '밀리초',
	microsecText: '마이크로',
	timezoneText: '표준 시간대',
	currentText: '현재 시각',
	closeText: '닫기',
	timeFormat: 'tt h:mm',
	amNames: ['오전', 'AM', 'A'],
	pmNames: ['오후', 'PM', 'P'],
};
$.timepicker.setDefaults($.timepicker.regional['ko']);		
$.rtls = {
	lang : 'ko',	
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
	home : '홈',
	validity : {
		required : function(field){
			return field+"를 확인하세요.";
		},
		match : function(type, field){
			if(type == 'id'){
				return "아이디 형식이 올바르지 않습니다.(영문숫자 4 ~20)";	
			}else if(type == 'pixels'){
				return "비율 Pixels 형식이 올바르지 않습니다.";	
			}else if(type == 'meter'){
				return "비율 Meter 형식이 올바르지 않습니다.";	
			}else if(type == 'number'){
				return field+"숫자만 입력 가능합니다.";	
			}else if(type == 'phone'){
				return field+" 형식이 올바르지 않습니다.";	
			}else {
				return field+" 형식이 올바르지 않습니다.";	
			}
			return "";
		},
		range : function(start, end, field){
			return field+'는 '+start+'~'+end+'까지 입력 가능합니다.'; 
		},
		check : function(field){
			return field+"를 체크하세요.";
		},
		notequal : function(field1, field2){
			return field1+'와 '+field2+'이 일치 하지 않습니다.';
		},
		select : function(field){
			return field+"를 선택하세요.";
		},
		checkId : function(field, result){
			if(result == 'success'){
				return field+"는 사용가능한 아이디 입니다.";	
			}else{
				return field+"는 중복된 아이디 입니다.";	
			}
		}
	},
	menu : [
		{title : '일반관리', heading : ['일반관리'], sub:['사용자 관리']},
		{title : '구성관리', heading : ['구성관리', 'OMP관리'], sub:['도면등록', '영역등록', '동선등록', 'RAP등록', 'RAP버전관리', '위치등록', '환경등록', 'OMP관리', 'RAP등록[외부]', '사전구축', '측위교정']},
		{title : '상태/장애관리', heading : ['상태/장애관리'], sub:['RAP상태', 'TAG상태', '시스템상태', '장애상태', 'RAP상태[외부]', '소음상태']},
		{title : '통계관리', heading : ['통계관리', '이력관리'], sub:['시스템통계', '영역별통계', '서비스통계', '사용자통계', '장애통계', '영역별이력', '위치측위이력', '장애이력','위치측위이력[외부]','이력재생', '소음통계']},
		{title : '실시간 상황판', heading : ['실시간 상황판'], sub:[]},
		{title : 'TAG관리', heading : ['TAG관리'], sub:['TAG 발급', 'TAG 조회']}
	],
	header : function(name){
		return $('.header .manager').html('<span class="name">'+name+'</span> | <a href="javascript:$.rtls.language(\'ko\');"><b>한국어</b></a> | <a href="javascript:$.rtls.language(\'en\');">영어</a> | <a href="/api/index.html"><span style="font-weight: bold;">API Reference</span></a> ');
	},
	commons : {
		button : {
			ok : '확인',
			cancel : '취소',
			add : '등록',
			mod : '수정',
			del : '삭제',
			close : '닫기',
			apply : '적용'
		},
		dialog : {
			title : {
				success : '성공메세지',
				error : '오류메세지',
				waring : '경고메세지',
				ok : '확인메세지'
			}
			
		},
		message : {
			errorsystem : '시스템 오류 입니다.',
			errorpermission : '<p>접근권한이 없습니다.</p><p>로그인 후 이용 가능합니다.</p>',
			initconfirm : '통계 데이터를 초기화 하시겠습니까?',
		}
	},
	main : {
		total : '전체',
		online : '온라인',
		offline : '오프라인',
		totalChart : {
			title : '기기상태',
			online : '기기 온라인', 
			offline : '기기 오프라인',
		},
		masterChart : {
			title : 'MASTER RAP 상태',
			online : 'MASTER RAP 온라인', 
			offline : 'MASTER RAP 오프라인'
		},
		slaveChart : {
			title : 'SLAVE RAP 상태',
			online : 'SLAVE RAP 온라인', 
			offline : 'SLAVE RAP 오프라인'
		}
	},
	manager : {
		button : { add :'운영자등록', mod :'수정', del : '삭제', idcheck:'중복체크', ok : '확인', cancel : '취소'},
		form : {
			id : '아이디',
			password : '비밀번호',
			passwordRe : '비밀번호확인',
			name : '이름',
			permission : '권한'
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>명이 등록되어 있습니다.';},
			head : ['번호','구분','아이디','성명','권한','등록일','최근접속시간','수정/삭제'],
			className : ['관리자','운영자'],
			empty : '등록된 사용자가 없습니다.',
		},
		dialog : {
			title : {add :'운영자 등록', mod : '운영자 정보 수정', del : '운영자삭제'}
		},
		message : {
			addfail : '사용자 등록 실패', 
			modfail : '사용자 정보수정 실패', 
			delfail : '사용자 삭제 실패', 
			delconfirm : '해당 사용자를 삭제 하시겟습니까?', 
			loginfail : '<p>정보가일치하지 않습니다.</p><p>아이디 비밀번호를 확인하세요.</p>',
			unapproved : '<p>미승인된 사용자입니다.</p><p>관리자 승인후 이용할 수 있습니다.</p>',
			stopsite : '<p>서비스 중지된 사이트 입니다.</p>'
		}
		
	},
	plan : {
		button : { add :'도면등록', mod :'도면수정', del : '도면삭제', upload : '업로드'},
		tool : {pointer : '이동도구', distance : '거리측정', distancePoint : '두지점거리측정', grid : '격자보기', ruler : '눈금자보기', drawing3d : '3D도면전환', zone : '영역설정도구', movement : '동선추적도구',wall : '벽 등록도구', barrier : '장애물 등록 도구'},
		form : {
			planName : '도면설명',
			planSize : '도면크기',
			planPixels : '비율',
			isMovement : '동선추적',
			planFile : '도면이미지',
			mapFile : '도면 파일',
			textureFile : 'Texture 파일',
			use : '사용',
			unused : '미사용',
			del : '삭제',
			type : '유형',
			name : '이름',
			size : '크기',
			sports : '스포츠도면',
			width : '넓이',
			height : '높이',
			offset : 'Offset',
		},
		dialog : {
			title : ['도면 추가']
		},
		message : {
			namedublicate : '도면이름이 중복 되었습니다.',
			fileexists : '도면 파일이 존재 하지 않습니다.',
			delfail : '도면삭제 실패',
			delconfirm : '<p>해당 도면을 삭제 하시겟습니까?</p><p>삭제시 관련정보도 같이 삭제됩니다.</p>',
			typefail : '도면 이미지 형식은 png만 사용 할 수 있습니다.',
			addsuccess : '성공적으로 적용 되었습니다.',
			uploadfail : '도면업로드 실패',
			dropzone : '업로드할 파일을 여기에 드래그하세요.',
			dropzonemsg : '다중업로드를 지원하지 않는 브라우져입니다. 여기를 클릭하셔서 개별로 업로드 하세요.'
		}
	},
	zone : {
		button : { add :'영역이미지등록', mod :'영역정보수정', del : '영역정보삭제', resetting : '재설정', update : '영역설정적용'},
		form : {
			name : '영역이름',
			file : '영역도면이미지',
			type : '영역타입',
			color : '영역색깔',
			safeZone : '안전',
			dangerZone : '위험'
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 영역이 등록되어 있습니다.';},
			head : ['색깔','영역이름','영역타입'],
			empty : '등록된 영역정보가 없습니다.',
		},
		dialog : {
			title : ['영역설정 등록', '영역설정 수정']
		},
		message : {
			whitecolor : '흰색은 영역색깔로 지정할 수 업습니다.',
			colorduplicate : '중복된 영역색깔 입니다.',
			addfail : '영역정보등록 실패',
			fileexists : '도면 파일이 존재 하지 않습니다.',
			delfail : '영역정보삭제 실패',
			fileupload : '영역 이미지를 업로드 하세요.',
			uploadfail : '도면업로드 실패',
			typefail : '도면 이미지 형식은 png만 사용 할 수 있습니다.',
			delconfirm : '<p>해당 도면의 영역 정보를 삭제 하시겟습니까?</p><p>삭제시 관련정보도 같이 삭제됩니다.</p>',
			updateconfirm: '<p>해당 도면의 영역 정보를 적용 하시겟습니까?</p>',
			updatefail: '<p>적용실패</p>',
			planover : '도면영역을 벗어나는 영역은 설정 할수 없습니다.'
			
		}
	},
	movement : {
		button : { add :'동선등록', preview : '미리보기', update : '동선설정적용'},
		form : {
			lineBorder : '라인뚜께',
		},
		dialog : {
			title : ['벽 등록', '벽 수정', '동선 등록', '동선 삭제', '미리보기']
		},
		message : {
			delconfirm: '<p>해당 동선을 삭제 하시겠습니까?</p>',
			updateconfirm: '<p>해당 도면의 동선 정보를 적용 하시겟습니까?</p>',
			updatesuccess: '<p>성공적으로 적용 되었습니다.</p>',
			updatefail: '<p>적용 실패</p>',
		}
	},
	device : {
		button : { add :'기기등록', mod :'수정', del : '삭제', modall :'일괄위치수정', config : '환경설정', select : '선택', cancel : '취소', search : '위치검색' },
		form : {
			point : '좌표',
			height : '높이',
			isAp : 'AP역활',
			networkType : 'Network유형',
			description : 'RAP설명',
			use : '사용',
			notuse : '미사용',
			second : '초',
			number : '개',
			distance : '와의 거리',
			select : '선택',
			latitude : '위도',
			longitude : '경도',
			signalRatio : '신호적용비율',
			signalWeight : '신호가중치',
			direction : '설치방향',
			zoneType : '측위구역',
			zone1D : '1차원 측위구역',
			zone2D : '2차원 측위구역',
			east : '동', west : '서', south : '남', north : '북',
			
		},
		status : {normal : '정상', fault : '장애'},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 RAP이 등록되었습니다.';},
			empty : '등록된 RAP이 없습니다.',
		},
		dialog : {
			title : ['등록RAP 선택', 'RAP환경설정', 'Master RAP 선택']
		},
		message : {
			emptyrap : '미등록 RAP이 없습니다.',
			selectrap : '등록할 RAP를 선택하세요.',
			modsuccess : '정보수정 성공',
			modfail : '정보수정 실패',
			modconfirm : '모든 RAP의 위치를 수정 하시겠습니까?',
			delfail : ' RAP삭제 실패',
			delconfirm : '<p>해당RAP을 삭제 하겟습니까?</p><p>삭제시 관련정보도 같이 삭제됩니다.</p>',
			config : 'RAP 환경설정 중',
			configsuccess : 'RAP 환경설정 성공',
			deadrap : 'RAP이 연결되어 있지 않습니다.',
			configfail : 'RAP 환경설정 실패',
			searchaddress : '검색할 주소를 입력하세요.',
			emptydata : '조회된 정보가 없습니다.'
		}
	},
	rap : {
		button : { add :'등록', use :'사용등록', upgrade : '원격업그레이드', mod : '수정', del : '삭제' },
		form : {
			version : '버전',
			note : '비고',
			file : '펌웨어 이미지'
			
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>버전의 펌웨어가 등록 되었습니다.';},
			head : ['선택','버전','비고','파일명','등록일','수정/삭제'],
			empty : '등록된 버전정보가 없습니다.',
		},
		dialog : {
			title : ['버전 추가', '버전정보 수정', '원격업그레이드']
		},
		message : {
			fileexists : '펌웨어 파일이 존재 하지 않습니다.',
			uploadfail : '이미지 업데이트 실패',
			version : '버전정보를 확인하세요.',
			delfail : ' 버전 삭제 실패',
			delconfirm : '버전을 삭제 하시겠습니까?',
			selectfail : '버전 선택 실패',
			upgradesuccess : '버전 업그레이드 실패',
			upgradefail : '버전 업그레이드 실패',
			upgradetype : '업데이트 방법을 선택 하세요.',
			uploadfail : '펌웨어업로드 실패',
		}
	},
	position : {
		button : { 
			add :'등록', modall :'일괄위치수정', mod : '수정', del : '삭제', cancel : '취소',
			search : '검색', select : '선택', simulator : '시뮬레이터', monitoringon : '이력모니터링', monitoringoff : '이력모니터링중지', clear : '이력초기화' },
		form : {
			name : '구역',
			point : '좌표',
			description : '위치',
			time : '시간선택',
			tag : '태그선택',
			scale : '목록개수',
			neighborhood : '근처',
			number : '개',
			algorithm : '알고리즘선택',
			all : '전체',
			tdoa : 'TDOA',
			twr : 'TWR',
			latitude : '위도',
			longitude : '경도',
			address : '주소',
			calibration : '보정',
			uncalibration : '미보정',
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 위치가 등록되었습니다.';},
			head : ['선택','버전','비고','파일명','등록일','수정/삭제'],
			empty : '등록된 버전정보가 없습니다.',
		},
		log : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 이력이 등록되었습니다.';},
			head : ['번호','알고리즘','태그정보','영역정보','위치정보','인지시간'],
			empty : '등록된 이력이 없습니다.',
		},
		out : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 이력이 등록되었습니다.';},
			head : ['번호','알고리즘','태그정보','측위정보','보정유무','인지시간','등록시간'],
			empty : '등록된 이력이 없습니다.',
		},
		dialog : {
			title : ['TAG 선택', '동선보기']
		},
		message : {
			addfail : ' 등록 실패',
			point : '입력필드 및 좌표를 확인하세요.',
			modsuccess : '정보 수정 성공',
			modfail : '정보 수정 실패',
			modconfirm : '모든 위치를 수정 하시겠습니까?',
			delfail : '위치 삭제 실패',
			delconfirm : '위치를 삭제 하시겟습니까?',
			tagselect : 'TAG를 선택하세요.',
			movementtag : '동선추적할 TAG를 선택 하세요.',
			simulator : '검색조건[시간,태그,알고리즘]을 선택후 실행 하세요.',
			clearfail : '이력초기화실패',
			monitoringfail : '이력 모니터링을 실패.',
			monitoringonconfirm : '이력 모니터링을 시작 합니다.',
			monitoringoffconfirm : '이력 모니터링을 중지 합니다.',
			logdelconfirm : '<p>이력를 초기화 하시겠습니까?</p><p>초기화 시 모든 데이터를 삭제 합니다.<p>',
			
		}
	},
	config : {
		button : { set :'설정', tagselect : '태그선택', search : '검색'},
		form : {
			algorithm : '알고리즘선택',
			speed : '속도계수',
			time : '시간계수',
			waitTime : 'DATA 취합대기시간',
			avgMinCount : 'TOA 취합최소개수',
			baseHeight : '기준높이',
			isLogInsert : 'RAW 이력저장',
			use : '사용',
			notuse : '미사용',
			broadcastTerm : 'TAG Broadcast 주기',
			gpsTerm : 'GPS 수신주기',
			uwbTerm : 'UWB 미인식 대기시간',
			uwbAct : 'UWB ON/OFF',
			dgpsAct : 'D-GPS ON/OFF',
			uwbBlink : 'UWB Blink 주기',
			tdoaRatio : 'TDOA 적용비율',
			thresh : '상관계수',
			grad : '변화율',
			angle : '각도',
			isSports : '스포츠모드',
			tagfilter : '태그검색',
			ball : '공에 사용할 태그'
				
		},
		title : {
			uwb : 'UWB측위 환경설정',
			tdoa : 'TDOA Algorithm 환경설정',
			gps : 'GPS측위 환경설정',
			server : '서버 환경설정',
			motion : '움직임 검출 환경설정(스포츠모드)',
			tag : '태그선택'
		},
		message : {
			modsuccess : '정보 수정 성공',
			modfail : '정보 수정 실패'
		},
		description : {
			avgMinCount : '이동평균을 구할때, 취합 최소갯수 이상의 데이터가 쌓여야 계산을 시작한다.<br>0이면 쌓인 갯수에 상관없이 측위계산을 수행한다.<br>주의할 점은 데이터 취합 최소갯수가 아래의 시간계수와 태그 blink 주기에 따른 평균갯수보다는 반드시 작아야 한다.',
			speed : '측위결과값으로 속도를 계산하여, 속도계수값보다 빨리 움직이면 버린다.<br>속도계수의 적용은 움직임이 있는 경우와 없는 경우가 다르게 적용된다.<br>움직임이 있다고 판단되는 경우에는 기준값이 속도계수 X 3 으로 적용된다.<br>스포츠트래킹의 공으로 지정된 태그는 움직임여부와 상관없이 속도계수 X 10으로 적용된다.',
			time : '전처리과정에서 이동평균을 낼 기간값.<br>예를들어 태그 blink 주기가 500ms이고, 시간계수가 3초이면,6개의 data를 쌓아서 이동평균을 구하게 된다.<br>시간계수가 작아질수록 반응속도는 빨라지지만 측위결과의 편차가 커진다.',
			motion : '회귀분석의 상관계수는 0에 가까우면 자료값들이 상관관계가 없고, 1에 가까우면 상관관계가 매우 높은것임.<br>즉, 상관계수가 threshold 보다 크고, 변화율도 threshold 보다 크면, 움직이고 있다고 판단을 할 수 있음.<BR> 2개의 threshold값을 높이면, 움직임 검출이 잘안되게 되고 낮추면 움직임 검출이 잘되게 됨.',
			baseHeight : '측위계산을 위한 태그의 기준높이',
			ballEuid : '공에 사용할 TAG EUID(뒤 4자리)',
			waitTime : 'UWB DATA 취합시 최대 대기 시간',
			tdoaRatio : '측위값이 밖으로 밀려나거나 안으로 당겨지는 정도를 조정하기 위한 비율 설정값',
			angle : '각 AP위치들의 선형성을 체크 하는 각도 임계값',
		}
	},
	omp : {
		button : { info :'정보요청', report :'주기보고', search : '조회', modall :'일괄위치수정', mod : '수정', del : '삭제' },
		form : {
			creationTime : '생성일시',
			lastModifiedTime : '최근 수정일시',
			deviceSearch : '디바이스조회',
			reportSearch : '보고데이터조회',
			ompRAPId : 'OMP에서 할당된 RAP ID',
			reportTime : '보고일시',
			modTime : '최근수정일',
			reportNum : '보고 번호',
			reportDate : '보고 데이터',
			
			
		},
		list : { 
			top : { addDate : '생성일자', modDate : '마지막수정일자'},
			head : ['번호','RAP 리소스 ID','RAP 리소스 URL','정보요청'],
			empty : '등록된 정보가 없습니다.',
		},
		dialog : {
			title : ['주기보고']
		},
		message : {
			resetsuccess : 'Reset 제어에 성공 하였습니다.',
			resetfail : 'Reset 제어에 실패 하였습니다.',
			reportsuccess : '주기보고 제어에 성공 하였습니다.',
			reportfail : '주기보고 제어에 실패 하였습니다.',
		}
	},
	tag : {
		button : { search :'검색', addall : '태그일괄등록', mod : '수정', del : '삭제'},
		status : ['예비','발급','수거','수리','불량(폐기)', '분실'],
		type : ['고정형','휴대형','카드형'],
		active : {normal : '정상', stop : '정지'},
		form : {
			select : '선택',
			full : '전체',
			search : '검색',
			tagType : '태그종류',
			activeStatus : '활동상태',
			tagStatus : '불출상태',
			serial : '시리얼',
			version : '버전',
			battery : '배터리',
			status : '상태',
			active : '활동',
			aliveTime : '활동시간',
			number : '개',
			normal : '정상',
			low : '부족',
			excel : '엑셀업로드',
			serialnum : '시리얼번호',
			type : '유형',
			blink : 'Blink 주기'
			
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 TAG가 등록 되었습니다.';},
			head : ['번호','종류','EUID','SERIAL','VERSION','BATTERY','상태','최근얼라이브시간','수정'],
			empty : '등록된 태그가 없습니다.',
		},
		dialog : {
			title : ['태그 일괄등록','태그 정보수정']
		},
		message : {
			addfail : '태그 등록 실패',
			addexcel : '등록할 엑셀파일을 확인 하세요.',
			modfail : '태그 정보수정 실패',
			delfail : '태그 삭제 실패',
			delconfirm : '<p>해당 태그를 삭제 하시겟습니까?<p><p style="color:red">삭제시 해당 태그에 관련된 정보도 같이 삭제 됩니다.</p>',
			uploadfail : '업로드 실패'
				
		}
		
	},
	system : {
		button : {search : '검색'},
		chart : {
			title : { cpu : 'CPU 사용량(%)', memory : 'Memory 사용량(%)', network : 'Network 사용량(KB/s)'}
		},
		tab : {day : '일별통계', month : '월별통계', year : '년별통계'},
		form : {
			date : '날짜선택',
			year : '년',
			month : '월'
		},
		
	},
	error : {
		button : {filter : '태그필터', scroll : '자동스크롤', clear : '콘솔초기화', search : '검색', select : '선택'},
		level : ['심각', '경고', '통보'],
		type : ['RAP Alive', 'Tag battery', '측위오류'],
		ecase : [
		    '측위 데이터가 3개 미만 입니다.', 
		    '수신된 TDOA 값이 RAP 간의 거리보다 큽니다.', 
		    '시간에 따른 TDOA 변동율 차이가 많이 납니다.',
		    '태그의 이동 속도가 서버에 설정된 임계값 보다 큽니다.',
		    '모든 알고리듬에서 계산이 되지 않습니다.',
		    '도면에 영역설정이 없습니다.',
		    '측위 결과가 측위 영역을 벗어났습니다.',
		    '맵 매칭에서 영역 위치를 찾지 못하였습니다.',
		    '측위 프로세스 중 예기치 못한 오류가 발생 하였습니다.',
		],
		chart : {
			title : { error : '장애율 (%)', success : '성공율통계'}
		},
		form : {
			point : '위치정보',
			full : '전체',
			total : '전체',
			time : '시간선택',
			date : '날짜선택',
			plan : '도면선택',
			tag : '태그선택',
			type : '장애타입',
			level : '장애등급',
			success : '성공',
			fail : '실패',
			count : '회',
			number : '개',
		},
		log : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 이력이 있습니다.';},
			head : ['번호','장애타입','장애등급','RAP/TAG','원인분석','발생시간'],
			empty : '등록된 이력이 없습니다.',
		},
		dialog : {
			title : ['TAG 필터링','TAG 선택']
		},
		message : {
			tagselect : 'TAG를 선택하세요.',
		}
	},
	history : {
		button : {search : '검색', select : '선택', monitoringoff : '이력모니터링중지', monitoringon : '이력모니터링'},
		chart : {
			title : { waitTime : '머문시간(%)', visitCount : '방문횟수(회)', network : 'Network 사용량(KB/s)'}
		},
		tab : {zone : '영역별통계', plan : '도면별통계'},
		form : {
			time : '시간선택',
			tag : '태그선택',
			plan : '도면선택',
			scale : '목록개수',
			number : '개',
			visit : '회',
			full : '전체',
			hour : '시',
			min : '분',
			sec : '초'
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 이력이 있습니다.';},
			head : ['번호','도면정보','태그정보','영역정보','머무른시간','등록시간'],
			empty : '등록된 이력이 없습니다.',
		},
		dialog : {
			title : ['TAG 선택']
		},
		message : {
			tagselect : 'TAG를 선택하세요.',
		}
	},
	service : {
		button : {search : '검색', select : '선택'},
		chart : {
			title : { success : '머문시간(%)', time : '방문횟수(회)', network : 'Network 사용량(KB/s)'}
		},
		tab : {success : '성공율 통계', time : '시간대별 통계', rap : 'RAP별 통계'},
		form : {
			date : '날짜선택',
			plan : '도면선택',
			tag : '태그선택',
			full : '전체',
			time : '시'
		},
		list : { 
			head : ['번호','태그','시도횟수','성공횟수','실패횟수','성공율', '실패유형', '합계', '시간'],
			empty : '등록된 정보가 없습니다.',
		},
		dialog : {
			title : ['TAG 선택']
		},
		message : {
			tagselect : 'TAG를 선택하세요.',
		}
	},
	simulator : {
		button : {scroll : '자동스크롤', simulatoron : '시뮬레이터시작', simulatoroff : '시뮬레이터중지', simulatorpause : '일시정지',clear : '콘솔초기화'},
		form : {
			full : '전체',
			plan : '도면선택',
			rap : 'RAP 선택',
		},
		dialog : {
			title : ['서버접속해제']
		},
		message : {
			disconnected : '<p>서버와 접속이 끊어졌습니다.</p><p>다시 접속 하십시요.</p>',
			alreadyon : '이미 시뮬레이터가 실행 중입니다.',
			alreadyoff : '이미 시뮬레이터가 중지 되었습니다.'
		}
	},
	panel : {
		button : {scroll : '자동스크롤', monitoring : '이력모니터링', clear : '콘솔초기화', logclear : '로그초기화',movement : '동선추적', filter : '태그필터'},
		form : {
			full : '전체',
			tag : '태그선택',
			plan : '도면선택',
			outdoormap : '외부지도',
		},
		dialog : {
			title : ['서버접속해제','TAG 필터링']
		},
		message : {
			disconnected : '<p>서버와 접속이 끊어졌습니다.</p><p>다시 접속 하십시요.</p>',
			clearconfirm : '<p>이력를 초기화 하시겠습니까?</p><p>초기화 시 모든 데이터를 삭제 합니다.<p>',
			clearfail : '이력 초기화 실패.',
			monitoringon : '이력 모니터링을 시작 합니다.',
			monitoringoff : '이력 모니터링을 중지 합니다.',
			tagselect : 'TAG를 선택하세요.',
			
		}
	},
	user : {
		button : {add :'발급', delall :'일괄반납', mod : '수정', del : '반납', move : '카테고리이동', edit : '카테고리 편집', editcancel : '편집해제', search : '검색', select : '선택'},
		tab : {tagissued : '발급목록', tagreturn : '반납목록', user : '사용자별 통계', visit : '방문통계'},
		status : ['반납', '발급'],		
		chart : {
			title : { waitTime : '머문시간(%)', visit : '방문횟수(회)'}
		},
		form : {
			full : '전체',
			name : '이름',
			version : '버전',
			battery : '배터리',
			man : '남',
			woman : '여',
			normal : '정상',
			low : '부족',
			tag : '태그선택',
			alias : '닉네임',
			gender : '성별',
			phone : '긴급연락처',
			color : '노드색깔',
			size : '노드크기',
			euid : '태그',
			select : '선택',
			date : '날짜선택',
			user : '사용자선택',
			count : '회',
			day : '일',
			tagfilter : '태그검색',
			plan : '측위도면선택',
				
		},
		list : { 
			top : function(groupName, totalNum){ return '<span class="font_color1 bold">'+groupName+'</span>에 총 <span class="font_color1 bold">'+totalNum+'</span>명이 등록되어 있습니다.';},
			head : ['선택','태그정보','측위도면','닉네임','성별','긴급연락처','노드정보','상태','발급시간','반납시간','수정/삭제'],
			empty : '등록된 발급정보가 없습니다.',
		},
		statistics : { 
			head : ['번호','사용자','방문횟수','활동시간','영역','합계'],
		},
		dialog : {
			title : ['TAG 선택', '태그 발급','사용자 정보수정','이동 카테고리 선택']
		},
		message : {
			tagselect : 'TAG를 선택하세요.',
			addfail : ' 발급 실패',
			euidduplicate : '이미 다른사용자가 사용하고 있는 TAG 입니다.',
			tagnumduplicate : '중복된  TAG번호 입니다.',
			delfail : '태그 반납 실패',
			delconfirm : '해당 사용자의 태그를 반납 하시겟습니까?',
			delselect : '반납할 사용자를 1명 이상 선택하세요.',
			delallconfirm : '선택된 사용자의 태그를 반납 하시겟습니까?',
			userselect : '이동할 사용자를 1명 이상 선택하세요.',
			movefail : '사용자 카테고리 이동 실패',
			moveselect : '이동할 카테고리를 선택하세요.',
			groupnotempty : '<p>하위그룹이 있습니다.</p><p>하위그룹 삭제후 다시 시도하세요.</p>',
			usernotempty : '<p>그룹에 속한 사용자가 있습니다.</p><p>그룹에 속한 사용자 이동후 다시 시도하세요.</p>',
			groupdelsucccess : '<p>성공적으로 삭제 되었습니다.</p>'
		}
	},
	calibration : {
		button : {add :'측위교정등록', mod : '수정', del : '삭제', analysis :'전파환경분석', init : '초기화', select : '선택'},
		form : {
			full : '전체',
			select : '선택',
			plan : '도면',
			note : '설명',
			point : '위치',
			barrier : '장애물',
			add : '추가',
			description : '설명',
			type : '종류',
			material : '재질',
			coordinates : '영역좌표',
			blockingRate : '전파차단율',
			redraw : '다시그리기',
			radio : '전파',
			radioenvironment : '전파환경',
			baudrate : '전송율',
			blockingrate: '차단율',
			verygood : '매우좋음',
			good : '좋음',
			poor : '나쁨',
			horizontal : '가로',
			vertical : '세로',
			height : '높이',
			isAp : 'AP역활',
			networkType : '네트워크',
			use : '사용',
			notuse : '미사용',
			number : '개',
			distance : '거리',
			rapdistance : 'RAP과의 거리',
			analysis : '전파환경분석',
			sec : '초',
			min : '분'
				
		},
		list : { 
			top : function(totalNum){ return '총 <span class="font_color1 bold">'+totalNum+'</span>개의 측위교정이 등록되어 있습니다.';},
			head : ['번호','도면','설명','등록일','수정/삭제'],
			empty : '등록된 측위교정이 없습니다.',
		},
		dialog : {
			title : {add :'측위교정 등록', mod : '측위교정 수정', del : '측위교정삭제'}
		},
		message : {
			addfail : '측위교정 등록 실패', 
			modfail : '측위교정 정보수정 실패', 
			delfail : '측위교정 삭제 실패', 
			delconfirm : '해당 측위교정을 삭제 하시겟습니까?', 
		},
		rap : { 
			empty : '등록된 RAP이 없습니다.',
			emptyrap : '미등록 RAP이 없습니다.',
			selectrap : '등록할 RAP를 선택하세요.',
			modsuccess : '정보수정 성공',
			modfail : '정보수정 실패',
			modconfirm : '모든 RAP의 위치를 수정 하시겠습니까?',
			delsuccess : 'RAP삭제 성공',
			delfail : ' RAP삭제 실패',
			delconfirm : '해당RAP을 삭제 하겟습니까?',
			configsuccess : 'RAP 환경설정 성공',
			deadrap : 'RAP이 연결되어 있지 않습니다.',
			configfail : 'RAP 환경설정 실패'
		},
		barrier : { 
			empty : '등록된 장애물이 없습니다.',
			influenceempty : '영향을 주는 장애물이 없습니다.',
			modsuccess : '적용성공',
			modfail : '적용실패',
			delsuccess : '삭제 성공',
			delfail : '삭제 실패',
			delconfirm : '장애물을 삭제 하시겠습니까?',
			types : ['벽','기둥','문'],
			materials : ['목재', '철근', '콘크리트', '플라스틱', '유리', '석고보드']
		},
		analysis : {
			mappingtag : '<p>Mapping된 Tag가 없습니다.</p><p>각 Sector에 Mapping 후 측정하세요.</p>',
			startconfirm : '측정을 시작 하시겠습니까?',
			stopconfirm : '측정을 중지 하시겠습니까?',
			initconfirm : '측정데이터를 초기화 하시겠습니까?',
		},
		
		
	},
	playback : {
		form : {
			full : '전체',
			plan : '도면선택',
			time : '시간선택',
			settime : '시간설정',
			tag : '태그선택',
			oclock : '시',
		},
		message : {
			settime : '설정할 시간 범위를 선택 하세요.',
			choosetag : '재생할 TAG를 선택 하세요'
		}
	},
};

})( jQuery );