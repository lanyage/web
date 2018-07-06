var iron_remove = {
    items:[],
    labels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
    data: [],
    realDataIntervals: [],
    ino: 13,
    labels1: [23, 0, 1, 2, 18, 19, 20, 14, 15, 16, 17, 18, 19, 20, 21, 22,22.5],
   //data1: [1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7],
   //data1:[23,10,5],
   data1:[],
   data2:[],
   data3:[],
    init: function () {
        iron_remove.funcs.renderTable()
        $("#byproductCount").empty()
        $.get(servers.backup()+'byproduct/getAll',{},function(result){
            byproduct = result.data
            $("#byproductCount").append("<option value='-1'>请选择副产品类型</option>")
            byproduct.forEach(function(e){
                 $("#byproductCount").append("<option value="+e.code+">"+e.name+"</option>")
            }) 
        })  
    },
    
     funcs: {
        renderTable: function () {
            $("select").bind("change",function () {
                var byproductCode = $("#byproductCount").val()
                $(".canvas-container").hide()
                $("#table").show()
                console.log(11)
                $.post(home.urls.byproductCount.getByByproductCodeByPage(), {
                    byproductCode:byproductCode
                }, function (res) {
                    var $tbody = $("#iron_remove_table").children('tbody')
                    items = res.data.content 
                    //console.log(items)
                    iron_remove.funcs.renderHandler($tbody, items)
                    console.log(items)
                    iron_remove.funcs.curveShow($('#model_li_hide_picture_36'),items)
                })
           
            })
            iron_remove.funcs.bindAddEvent($('#model_li_hide_add_36'))
            
           
            var refreshBtn = $('#model_li_hide_refresh_36');
            iron_remove.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_36')
            iron_remove.funcs.bindSearchEventListener(searchBtn)

        }
    , renderHandler: function ($tbody, items) {
        //$tbody.empty() //清空表格
        for(var i=1; i <=16; i++){
            $("#row1").find('td').eq(i).text('')  
            $("#row2").find('td').eq(i).text('')  
            $("#row3").find('td').eq(i).text('') 
            $("#row4").find('td').eq(i).text('')   
            $("#row5").find('td').eq(i).text('')

            $("#row11").find('td').eq(i).text('')  
            $("#row12").find('td').eq(i).text('')  
            $("#row13").find('td').eq(i).text('') 
            $("#row14").find('td').eq(i).text('')   
            $("#row15").find('td').eq(i).text('')
        }

        items.forEach(function (e) {
            var code = e.code
            var date = e.date.split('-')
            if(date[2]<17){
                $("#row1").find('td').eq(date[2]).text(e.batchNumber)  
                $("#row2").find('td').eq(date[2]).text(e.dutyCode?e.dutyCode.name:' ')  
                $("#row3").find('td').eq(date[2]).text(e.weight) 
                $("#row4").find('td').eq(date[2]).text(e.proportion)   
                $("#row5").find('td').eq(date[2]).text(e.recorderCode?e.recorderCode.name:'')   
            }else{
                $("#row11").find('td').eq(date[2]+1).text(e.batchNumber)  
                $("#row12").find('td').eq(date[2]+1).text(e.dutyCode?e.dutyCode.name:' ')  
                $("#row13").find('td').eq(date[2]+1).text(e.weight) 
                $("#row14").find('td').eq(date[2]+1).text(e.proportion)   
                $("#row15").find('td').eq(date[2]+1).text(e.recorderCode?e.recorderCode.name:'')   
            }
  
        })
    }
    ,bindAddEvent:function(addBtn){
        addBtn.off('click').on('click',function(){
            $("#batchNumber").val('')
            $("#date").val('')
            $("#dutyCode").empty()
            $("#weight").val('')
            $("#proportion").val('')
            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)
            $("#rescorderCode").val(userJson.name)
            $.get(servers.backup()+'duty/getAll',{},function(result){
                var duty = result.data
                duty.forEach(function(e){
                    $("#dutyCode").append("<option value="+e.code+">"+e.name+"</option>")
                })
            })
        
             layer.open({
                 type:1,
                 title:"新增车间除铁记录",
                 content:$("#add_modal"),
                 area: ['370px', '370px'],
                 btn:['提交','取消'],
                 offset:'auto',
                 closeBtn:0,
                 yes:function(index) {
                     $("#add_modal").css('display','none')
                     var dutyCode = $('#dutyCode').val()
                     var batchNumber = $('#batchNumber').val()
                     var date = $('#date').val()
                     var weight = $('#weight').val()
                     var proportion = $('#proportion').val()
                     //var recorderCode = $('#rescorderCode').val()
                     $.post(home.urls.byproductCount.add(),{
                        'byproductCode.code':1,
                        'dutyCode.code': dutyCode,
                        'recorderCode.code': userJson.code,
                        batchNumber: batchNumber,
                        date: date,
                        weight: weight,
                        proportion: proportion,
                     },function(result){
                         layer.msg(result.message,{
                             offset:['40%','55%'],
                             time:700
                         })
                        if(result.code === 0) {
                            var time = setTimeout(function(){
                                iron_remove.init()
                                clearTimeout(time)
                            },500)
                        }
                        layer.close(index)
                     })    
                 }
                 ,btn2:function(index){
                     $("#add_modal").css('display','none')
                     layer.close(index)
                 }
             })
         })     
         }
         ,curveShow:function(btns,result){
             btns.off('click').on('click',function(){
                 $("table").hide()
                 $(".canvas-container").show()
                 console.log(result)
                 iron_remove.funcs.fillLabelsAndData(result)
                 iron_remove.funcs.createChart(iron_remove.labels, iron_remove.data,iron_remove.data1,iron_remove.data2,iron_remove.data3)
             
             })
         }
         ,fillLabelsAndData: function (data) {
            iron_remove.data = []
            iron_remove.labels = []
            data.forEach(function (e) {
                var date = e.date.split('-')
                iron_remove.data.push(e.proportion)
                iron_remove.data1.push(20)
                iron_remove.data2.push(15)
                iron_remove.data3.push(10)
                iron_remove.labels.push(date[2])
                iron_remove.data.sort(function(a,b){return a>b})
                iron_remove.labels.sort(function(a,b){return a>b})
            })
            console.log(iron_remove.data)
            console.log(iron_remove.labels)
        }
         ,createChart: function (labels, data,data1,data2,data3) {
            var data = {
                //折线图需要为每个数据点设置一标签。这是显示在X轴上。
                /** 横坐标 */
                //labels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25",
                //         "26","27","28","29","30","31"],
                labels:labels,
                //数据集（y轴数据范围随数据集合中的data中的最大或最小数据而动态改变的）
                datasets: [
                    {
                        label: "副产品比例曲线",
                        fill: false,
                        // steppedLine : false,
                        // lineTension: 0.1,
                        backgroundColor: "rgba(54, 162, 235,0.8)",
                        borderColor: "rgba(54, 162, 235,1)",
                        // borderCapStyle: 'butt',
                        // borderDash: [],
                        // borderDashOffset: 0.0,
                        // borderJoinStyle: 'miter',
                        // pointBorderColor: "rgba(75,192,192,1)",
                        // pointBackgroundColor: "#fff",
                        // pointBorderWidth: 5,
                        // pointHoverRadius: 5,
                        // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        // pointHoverBorderColor: "rgba(220,220,220,1)",
                        // pointHoverBorderWidth: 2,
                        pointRadius: 3,
                        // pointHitRadius: 10,
                        // spanGaps: true,
                        /** 纵坐标 */
                        data: data//对象数据
                    },
                    {
                        label: "上限",
                        fill: false,
                        // steppedLine : false,
                        // lineTension: 0.1,
                        backgroundColor: "rgba(255, 0, 0,0.8)",
                        borderColor: "rgba(255, 0, 0,1)",
                        pointRadius: 3,
                        /** 纵坐标 */
                        data: data1//对象数据
                    },
                    {
                        label: "均限",
                        fill: false,
                        // steppedLine : false,
                        // lineTension: 0.1,
                        backgroundColor: "rgba(42, 173, 232,0.8)",
                        borderColor: "rgba(42, 173, 232,1)",
                        pointRadius: 3,
                        /** 纵坐标 */
                        data: data2//对象数据
                    },
                    {
                        label: "下限",
                        fill: false,
                        // steppedLine : false,
                        // lineTension: 0.1,
                        backgroundColor: "rgba(255, 0, 0,0.8)",
                        borderColor: "rgba(255, 0, 0,1)",
                        pointRadius: 3,
                        /** 纵坐标 */
                        data: data3//对象数据
                    }
                ],
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'day'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            }
                        }]
                    }
                }
            }
            $('.canvas-container').empty();
            $('.canvas-container').append("<canvas id='myChart' style='width: 100%;height: 74%;min-width: 800px;min-height: 500px;'></canvas>")
            var ctx = document.getElementById("myChart").getContext("2d");
            var width = $("#myChart").width()
            var height = $("#myChart").height()
            var myChart = new Chart(ctx, {
                type: 'line',
                data: data
            })
        }
         ,bindRefreshEventListener: function (refreshBtn) {
             refreshBtn.off('click')
             refreshBtn.on('click', function () {
                 var index = layer.load(2, {offset: ['40%', '58%']});
                 var time = setTimeout(function () {
                     layer.msg('刷新成功', {
                         offset: ['40%', '55%'],
                         time: 700
                     })
                     iron_remove.init()
                     $('#input_batch_num').val('')
                     $("table").hide()
                     $(".canvas-container").hide()
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var batchNumber = $('#input_batch_num').val();
                 $.post(home.urls.byproductCount.getByBatchNumberLikeByPage(), {
                    batchNumber: batchNumber
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#iron_remove_table").children('tbody')
                     iron_remove.funcs.renderHandler($tbody, items)
                
                 })
             })
         }

    }
}