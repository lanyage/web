/** 外轨线控制 */
var _24hours = {
    labels: [],
    data: [],
    realDataIntervals : [],
    ino : 13,
    //
    init: function () {
        /** chart.js全局动画 */
        Chart.defaults.global.animation = {
            duration : 0,
            //easeInOutBack
            easing : 'easeInOutCirc',
        }

        _24hours.funcs.bindSelectChangeEvent($('#model-li-hide-13-select'))
        _24hours.funcs.bindClearInterval()
        /** 初始化的图表 */
        _24hours.funcs.loadDataAndRender()
        home.funcs.clearIntervals(_24hours.realDataIntervals)
        /** 开始间隔30秒获取数据 */
        _24hours.funcs.bindLoadDataEvent()
    },
    funcs: {
        bindClearInterval : function() {
            $('#menu3-li-13').on('click', function() {
                home.funcs.clearIntervals(_24hours.realDataIntervals)
                _24hours.funcs.bindLoadDataEvent()
            })
            $('.menus2').off('click')
            $('.menus2').on('click', function() {
                home.funcs.clearIntervals(_24hours.realDataIntervals)
            })
            $('.menus1').off('click')
            $('.menus1').on('click', function() {
                home.funcs.clearIntervals(_24hours.realDataIntervals)
            })
        },
        bindLoadDataEvent : function() {
            _24hours.realDataIntervals.push(setInterval(function() {
                _24hours.funcs.loadDataAndRender()
            },30000))
        },
        bindSelectChangeEvent: function (select) {
            select.on('change', function () {
                _24hours.ino = $(this).val()
                _24hours.funcs.loadDataAndRender()
                console.log('_24hours.ino', _24hours.ino)
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
            _24hours.data = []
            _24hours.labels = []
            data.forEach(function (e) {
                _24hours.data.push(e.ivalue)
                _24hours.labels.push(e.ihour)
            })
        },
        loadDataAndRender: function () {
            $.get(home.urls.energyMonitor.load24HoursData(), {
                ino: _24hours.ino,
                curDateTime: new Date().getTime()
            }, function (result) {
                _24hours.funcs.fillLabelsAndData(result.data)
                _24hours.funcs.createChart(_24hours.labels, _24hours.data)
            })
        }
    }
}