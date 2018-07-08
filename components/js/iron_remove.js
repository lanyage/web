var iron_remove = {
    items: [],
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
    data: [],
    labels1: [23, 0, 1, 2, 18, 19, 20, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22.5],
    //data1: [1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7],
    //data1:[23,10,5],
    data1: [],
    data2: [],
    data3: [],
    byproduct:[],
    init: function () {
        $("#byproductCount").empty()
        $("#table").hide()
        $(".canvas-container").hide()
        $.get(servers.backup() + 'byproduct/getAll', {}, function (result) {
            byproduct = result.data
            $("#byproductCount").append("<option value='-1'>请选择副产品类型</option>")
            byproduct.forEach(function (e) {
                $("#byproductCount").append("<option value=" + e.code + ">" + e.name + "</option>")
                //  iron_remove.indicator.push(e.indicator.code)
            })
        })
        for (var i = 1; i <= 16; i++) {
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
        var year = new Date().getFullYear()
        $("#input_year").empty()
        $("#input_month").empty()
        $("#input_year").append("<option>请选择年份</option>")
        $("#input_month").append("<option>请选择月份</option>")
        for (var i = year - 10; i <= year; i++) {
            $("#input_year").append("<option value=" + i + ">" + i + "</option>")
        }
        for (var i = 1; i <= 12; i++) {
            $("#input_month").append("<option value=" + i + ">" + i + "</option>")
        }
        iron_remove.funcs.bindAddEvent($('#model_li_hide_add_36'))
        var refreshBtn = $('#model_li_hide_refresh_36');
        iron_remove.funcs.bindRefreshEventListener(refreshBtn);
        var searchBtn = $('#model_li_hide_search_36')
        iron_remove.funcs.bindSearchEventListener(searchBtn)
    },

    funcs: {
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click').on('click', function () {
                //$(".canvas-container").hide()
                $("#table").show()
                var year = $('#input_year').val();
                var month = $('#input_month').val();
                var byproductCount = $('#byproductCount').val();
                $.post(home.urls.byproductCount.getByByproductCodeAndYearMonth(), {
                    byproductCode: byproductCount,
                    year: year,
                    month: month
                }, function (result) {
                    var items = result.data //获取数据
                    // console.log(items)
                    //const $tbody = $("#iron_remove_table").children('tbody')
                    iron_remove.funcs.renderHandler(items)
                    iron_remove.funcs.curveShow($('#model_li_hide_picture_36'), items)
                    iron_remove.funcs.tableShow($('#model_li_hide_table_36'), items)
                })
            })
        }
        , renderHandler: function (items) {
            //$tbody.empty() //清空表格
            for (var i = 1; i <= 16; i++) {
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
                if (parseInt(date[2]) < 17) {
                    $("#row1").find('td').eq(date[2]).text(e.batchNumber)
                    $("#row2").find('td').eq(date[2]).text(e.dutyCode ? e.dutyCode.name : ' ')
                    $("#row3").find('td').eq(date[2]).text(e.weight)
                    $("#row4").find('td').eq(date[2]).text(e.proportion)
                    $("#row5").find('td').eq(date[2]).text(e.recorderCode ? e.recorderCode.name : '')
                } else {
                    // console.log(date[2])
                    $("#row11").find('td').eq(date[2] - 16).text(e.batchNumber)
                    $("#row12").find('td').eq(date[2] - 16).text(e.dutyCode ? e.dutyCode.name : ' ')
                    $("#row13").find('td').eq(date[2] - 16).text(e.weight)
                    $("#row14").find('td').eq(date[2] - 16).text(e.proportion)
                    $("#row15").find('td').eq(date[2] - 16).text(e.recorderCode ? e.recorderCode.name : '')
                }

            })
        }
        , bindAddEvent: function (addBtn) {
            addBtn.off('click').on('click', function () {
                $("#batchNumber").val('')
                $("#date").val('')
                $("#dutyCode").empty()
                $("#byproductCode").empty()
                $("#weight").val('')
                $("#proportion").val('')
                var userStr = $.session.get('user')
                var userJson = JSON.parse(userStr)
                $("#rescorderCode").val(userJson.name)
                $.get(servers.backup() + 'duty/getAll', {}, function (result) {
                    var duty = result.data
                    duty.forEach(function (e) {
                        $("#dutyCode").append("<option value=" + e.code + ">" + e.name + "</option>")
                    })
                })
                $.get(servers.backup() + 'byproduct/getAll', {}, function (result) {
                    var res = result.data
                    res.forEach(function (e) {
                        $("#byproductCode").append("<option value=" + e.code + ">" + e.name + "</option>")
                    })
                })
                layer.open({
                    type: 1,
                    title: "新增车间除铁记录",
                    content: $("#add_modal"),
                    area: ['370px', '370px'],
                    btn: ['提交', '取消'],
                    offset: 'auto',
                    closeBtn: 0,
                    yes: function (index) {
                        $("#add_modal").css('display', 'none')
                        var byproductCode = $("#byproductCode").val()
                        var dutyCode = $('#dutyCode').val()
                        var batchNumber = $('#batchNumber').val()
                        var date = $('#date').val()
                        var weight = $('#weight').val()
                        var proportion = $('#proportion').val()
                        //var recorderCode = $('#rescorderCode').val()
                        $.post(home.urls.byproductCount.add(), {
                            'byproductCode.code': byproductCode,
                            'dutyCode.code': dutyCode,
                            'recorderCode.code': userJson.code,
                            batchNumber: batchNumber,
                            date: date,
                            weight: weight,
                            proportion: proportion,
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })

                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    iron_remove.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    }
                    , btn2: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        }
        , tableShow: function (btns, result) {
            btns.off('click').on('click', function () {
                $("table").show()
                $(".canvas-container").hide()
                iron_remove.funcs.renderHandler(result)
            })
        }
        , curveShow: function (btns, result) {
            btns.off('click').on('click', function () {
                $("table").hide()
                $(".canvas-container").show()
                //console.log(result)
                iron_remove.funcs.fillLabelsAndData(result)
               /* $.post("http://218.77.105.241:30080/mes/bound/getByCode", {code: code}, function (res) {
                    for (var i = 1; i <= 31; i++) {
                        iron_remove.data1.push(res.data.upperBound);
                        iron_remove.data2.push(res.data.mean);
                        iron_remove.data3.push(res.data.downBound);
                    }
                    iron_remove.funcs.createChart(iron_remove.labels, iron_remove.data, iron_remove.data1, iron_remove.data2, iron_remove.data3)
                })*/
                var code = $("#byproductCount").val()
                $.post(home.urls.byproduct.getByCode(), {
                    code: code
                }, function (result) {
                    Code = result.data.indicatorCode.code
                    //console.log(Code)
                    $.post(home.urls.bound.getByCode(), {
                        code: Code
                    }, function (result) {
                        var res = result.data
                        for (var i = 1; i <= 31; i++) {
                            iron_remove.data1.push(res.upperBound)
                            iron_remove.data2.push(res.mean)
                            iron_remove.data3.push(res.downBound)
                        }
                        iron_remove.funcs.createChart(iron_remove.labels, iron_remove.data, iron_remove.data1, iron_remove.data2, iron_remove.data3)
                    })
                })
            })
        }
        , fillLabelsAndData: function (data) {
            iron_remove.labels = []
            iron_remove.data = []
            
            data.forEach(function (e) {
                var date = e.date.split('-')
                var num = parseInt(date[2])
                iron_remove.data[num - 1] = e.proportion
            })
            for (var i = 0; i <= 30; i++) {
                if (iron_remove.data[i] != null) {
                    continue;
                } else {
                    iron_remove.data[i] = null
                }
            }
            for (var i = 1; i <= 31; i++) {
                iron_remove.labels.push(i)
            }

            // console.log(iron_remove.data)
            //console.log(iron_remove.data1)
            //console.log(iron_remove.data2)
            //console.log(iron_remove.data3)
        }
        , createChart: function (labels, data, data1, data2, data3) {
            console.log(data);
            console.log(iron_remove.data1);
            console.log(iron_remove.data2);
            console.log(iron_remove.data3);
            var data = {
                //折线图需要为每个数据点设置一标签。这是显示在X轴上。
                /** 横坐标 */
                // labels: [1,2,3,4,5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25",
                //       "26","27","28","29","30","31"],
                labels: labels,
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
                        backgroundColor: "rgba(255, 0, 0,0.8)",
                        borderColor: "rgba(255, 0, 0,1)",
                        pointRadius: 0,
                        data: data1//对象数据
                    },
                    {
                        label: "均限",
                        fill: false,
                        backgroundColor: "rgba(42, 123, 45,0.8)",
                        borderColor: "rgba(42, 123, 45,1)",
                        pointRadius: 0,
                        data: data2//对象数据
                    },
                    {
                        label: "下限",
                        fill: false,
                        backgroundColor: "rgba(255, 18, 231,0.8)",
                        borderColor: "rgba(255, 18, 231,1)",
                        pointRadius: 0,
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
                                labelString: '<%=value%>'
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
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    iron_remove.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
    }
}