var waiguixian = {
    labels: [],
    data: [],
    realDataIntervals : [],
    ino : 13,
    //
    init: function () {
        waiguixian.funcs.bindSelectChangeEvent($('#model-li-hide-13-select'))
        waiguixian.funcs.bindClearInterval()
        /** 初始化的图表 */
        waiguixian.funcs.loadDataAndRender()
        home.funcs.clearIntervals(waiguixian.realDataIntervals)
        /** 开始间隔30秒获取数据 */
        waiguixian.funcs.bindLoadDataEvent()
    },
    funcs: {
        bindClearInterval : function() {
            $('#menu3-li-13').off('click')
            $('#menu3-li-13').on('click', function() {
                home.funcs.clearIntervals(waiguixian.realDataIntervals)
                waiguixian.funcs.bindLoadDataEvent()
            })
            $('.menus2').off('click')
            $('.menus2').on('click', function() {
                home.funcs.clearIntervals(waiguixian.realDataIntervals)
            })
            $('.menus1').off('click')
            $('.menus1').on('click', function() {
                home.funcs.clearIntervals(waiguixian.realDataIntervals)
            })
        },
        bindLoadDataEvent : function() {
            waiguixian.realDataIntervals.push(setInterval(function() {
                waiguixian.funcs.loadDataAndRender()
            },3000))
        },
        bindSelectChangeEvent: function (select) {
            select.on('change', function () {
                waiguixian.ino = $(this).val()
                waiguixian.funcs.loadDataAndRender()
                console.log('waiguixian.ino', waiguixian.ino)
            })
        },
        createChart: function (labels, data) {
            var data = {
                //折线图需要为每个数据点设置一标签。这是显示在X轴上。
                /** 横坐标 */
                labels: labels,
                //数据集（y轴数据范围随数据集合中的data中的最大或最小数据而动态改变的）
                datasets: [
                    {
                        label: "能耗值曲线",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        spanGaps: true,
                        /** 纵坐标 */
                        data: data //对象数据
                    }
                ]
            }
            var ctx = document.getElementById("myChart").getContext("2d");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: data
            })
        },
        fillLabelsAndData: function (data) {
            waiguixian.data = []
            waiguixian.labels = []
            data.forEach(function (e) {
                waiguixian.data.push(e.ivalue)
                waiguixian.labels.push(e.ihour)
            })
        },
        loadDataAndRender: function () {
            $.get(home.urls.energyMonitor.loadWaiguixianData(), {
                ino: waiguixian.ino,//todo,这里的话需要传入的是
                curDateTime: new Date().getTime()
            }, function (result) {
                waiguixian.funcs.fillLabelsAndData(result.data)
                waiguixian.funcs.createChart(waiguixian.labels, waiguixian.data)
            })
        }
    }
}