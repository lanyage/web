/** 控制室 */
var kongzhishi = {
    labels: [],
    data: [],
    realDataIntervals: [],
    ino: 13,
    //
    init: function () {
        /** 日期控件 */
        layui.use('laydate', function () {
            var laydate = layui.laydate
            laydate.render({
                elem: '#start1',//指定元素
                format: 'yyyy/MM/dd'
            })
            laydate.render({
                elem: '#start2',  //指定元素
                format: 'yyyy/MM/dd'
            })
        })
        /** 数据加载 */
        kongzhishi.funcs.bindSelectChangeEvent($('#model-li-hide-15-select'))
        kongzhishi.funcs.bindClearInterval()
        /** 初始化的图表 */
        kongzhishi.funcs.bindSubmitEvent($('#submitBtn'))
        home.funcs.clearIntervals(kongzhishi.realDataIntervals)
        /** 开始间隔30秒获取数据 */
        // kongzhishi.funcs.bindLoadDataEvent()
    },
    funcs: {
        bindSubmitEvent: function (submitBtn) {
            var select = $('#model-li-hide-15-select')
            var timeGap = $('#timeGapInp')
            var start1 = $('#start1')
            var start2 = $('#start2')
            var end1 = $('#end1')
            var end2 = $('#end2')
            submitBtn.off('click')
            submitBtn.on('click', function () {
                console.log(select.val())
                console.log(timeGap.val())
                console.log(start1.val())
                console.log(start2.val())
                console.log(end1.val())
                console.log(end2.val())
                if (!timeGap.val() || !start1.val() || !start2.val() || !end1.val() || !end2.val()) {
                    alert('您的查询条件还没填写完整!')
                    return
                }
            })
        },
        bindClearInterval: function () {
            $('#menu3-li-15').on('click', function () {
                home.funcs.clearIntervals(kongzhishi.realDataIntervals)
                kongzhishi.funcs.bindLoadDataEvent()
            })
            $('.menus2').off('click')
            $('.menus2').on('click', function () {
                home.funcs.clearIntervals(kongzhishi.realDataIntervals)
            })
            $('.menus1').off('click')
            $('.menus1').on('click', function () {
                home.funcs.clearIntervals(kongzhishi.realDataIntervals)
            })
        },

        bindLoadDataEvent: function () {
            kongzhishi.realDataIntervals.push(setInterval(function () {
                kongzhishi.funcs.loadDataAndRender()
            }, 3000))
        },
        bindSelectChangeEvent: function (select) {
            select.on('change', function () {
                kongzhishi.ino = $(this).val()
                kongzhishi.funcs.loadDataAndRender()
                console.log('kongzhishi.ino', kongzhishi.ino)
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
            kongzhishi.data = []
            kongzhishi.labels = []
            data.forEach(function (e) {
                kongzhishi.data.push(e.ivalue)
                kongzhishi.labels.push(e.ihour)
            })
        },
        loadDataAndRender: function () {

            console.log(select[0])
            console.log(timeGap[0])
            console.log(start1[0])
            console.log(start2[0])
            console.log(end1[0])
            console.log(end2[0])
        }
    }
}