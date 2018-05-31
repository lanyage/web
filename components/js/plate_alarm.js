var plate_alarm= {
    pageSize: null,
    init: function () {
        plate_alarm.funcs.renderTable()
        // pro_out_manage.funcs.checkboxEventBinding()
        /** 将分页居中 */
        var out = $('#plate_alarm_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#plate_alarm_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.plateAlarm.getAllByPage(), {}, function (res) {
                var $tbody = $("#inventory_warming_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                //console.log(items)
                plate_alarm.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                plate_alarm.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'plate_alarm_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.plateAlarm.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#plate_alarm_page").children('tbody')
                                plate_alarm.funcs.renderHandler($tbody, items)
                                plate_alarm.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

        },
        renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.rawType.material.name) + "</td>" +
                    "<td>" + (e.rawType.name) + "</td>" +
                    "<td>" + (e.weight) + "</td>" +
                    "<td>" + e.warnStatus + "</td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
        }

    }
}