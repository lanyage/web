/** 控制室 */
var kongzhishi = {
    labels: [],
    data: [],
    realDataIntervals: [],
    ino: 13,
    timeGap: $('#timeGapInp').val(),
    start1: $('#start1').val(),
    start2: $('#start2').val(),
    end1: $('#end1').val(),
    end2: $('#end2').val(),
    init: function () {
        console.log('init kongzhishi')
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
        // home.funcs.clearIntervals(kongzhishi.realDataIntervals)
        /** 开始间隔30秒获取数据 */
        // kongzhishi.funcs.bindLoadDataEvent()
    },
    funcs: {
        bindSubmitEvent: function (submitBtn) {
            submitBtn.off('click')
            submitBtn.on('click', function () {
                console.log(kongzhishi.ino)
                console.log(kongzhishi.timeGap)
                console.log(kongzhishi.start1)
                console.log(kongzhishi.start2)
                console.log(kongzhishi.end1)
                console.log(kongzhishi.end2)
                if (!kongzhishi.timeGap || !kongzhishi.start1 || !kongzhishi.start2 || !kongzhishi.end1 || !kongzhishi.end2) {
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

        }
    }
}


// /** 创建曲线图 */
// var data = {
//     //折线图需要为每个数据点设置一标签。这是显示在X轴上。
//     /** 横坐标 */
//     labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
//     //数据集（y轴数据范围随数据集合中的data中的最大或最小数据而动态改变的）
//     datasets: [
//         {
//             label: "时间段1能耗值曲线",
//             fill: false,
//             lineTension: 0.1,
//             backgroundColor: "rgba(75,192,192,0.4)",
//             borderColor: "rgba(75,192,192,1)",
//             borderCapStyle: 'butt',
//             borderDash: [],
//             borderDashOffset: 0.0,
//             borderJoinStyle: 'miter',
//             pointBorderColor: "rgba(75,192,192,1)",
//             pointBackgroundColor: "#fff",
//             pointBorderWidth: 5,
//             pointHoverRadius: 5,
//             pointHoverBackgroundColor: "rgba(75,192,192,1)",
//             pointHoverBorderColor: "rgba(220,220,220,1)",
//             pointHoverBorderWidth: 2,
//             pointRadius: 1,
//             pointHitRadius: 10,
//             spanGaps: true,
//             /** 纵坐标 */
//             data: [10, 59, 90, 81, 56, 55, 40, 10, 59, 90, 81, 56, 55, 40, 10, 59, 90, 81, 56, 55, 40, 10, 59, 90] //对象数据
//         },
//         {
//             label: "时间段2能耗值曲线",
//             fill: false,
//             lineTension: 0.1,
//             backgroundColor: "rgba(75,100,192,0.4)",
//             borderColor: "rgba(75,140,192,1)",
//             borderCapStyle: 'butt',
//             borderDash: [],
//             borderDashOffset: 0.0,
//             borderJoinStyle: 'miter',
//             pointBorderColor: "rgba(75,140,192,1)",
//             pointBackgroundColor: "#fff",
//             pointBorderWidth: 5,
//             pointHoverRadius: 5,
//             pointHoverBackgroundColor: "rgba(75,192,192,1)",
//             pointHoverBorderColor: "rgba(220,220,220,1)",
//             pointHoverBorderWidth: 2,
//             pointRadius: 1,
//             pointHitRadius: 10,
//             spanGaps: true,
//             /** 纵坐标 */
//             data: [28, 48, 40, 19, 96, 27, 200, 28, 48, 40, 19, 96, 27, 200, 28, 48, 40, 19, 96, 27, 200, 28, 48, 40]
//         }
//     ]
// };
// var ctx = document.getElementById("myChart").getContext("2d");
// var myChart = new Chart(ctx, {
//     type: 'line',
//     data: data
// })