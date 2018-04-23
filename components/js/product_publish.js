var product_publish = {
    init: function () {
        product_publish.funcs.renderTable()
        var out = $('#_23page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#_23page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {

        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.productPublish.getAllByPage(), {status : 1}, function (result) {
                var records = result.data.content //获取数据
                const $tbody = $("#_23table").children('tbody')
                product_publish.funcs.renderHandler($tbody, records)
                product_publish.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: '_23page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            $.post(home.urls.productPublish.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var records = result.data.content //获取数据
                                const $tbody = $("#_23table").children('tbody')
                                product_publish.funcs.renderHandler($tbody, records)
                                product_publish.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕
        }
        , renderHandler: function ($tbody, records) {
            $tbody.empty() //清空表格
            records.forEach(function (e) {
                console.log(e)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='dep_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.auditor ? e.auditor.name : null) + "</td>" +
                    "<td>" + (new Date(e.auditDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.judge ? e.judge.name : null) + "</td>" +
                    "<td>" + (e.number) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "<td>" + (e) + "</td>" +
                    "</tr>")
            })//$数据渲染完毕

        }
    }
}