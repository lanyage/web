var raw_audit = {
    init: function () {
        // display
        raw_audit.funcs.renderTable()

        var presoma_table = document.getElementById("presoma_table");

        // var presoma_table = $('#presoma_table')
        var lithium_table = $('#lithium_table')

        presoma_table.style.display = 'none'
        lithium_table.style.display = 'none'

        var out = $('#raw_audit_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#raw_audit_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            /** 获取所有记录 */
            var status = $('#status').val()
            $.post(home.urls.presoma.getAllByStatusCodeByPage(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var products = result.data.content
                const $tbody = $("#presoma_table").children('tbody')
                raw_audit.funcs.renderHandler($tbody, products)
                raw_audit.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'raw_audit_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            var status = $('#status').val()
                            $.post(home.urls.presoma.getAllByStatusCodeByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var presomas = result.data.content //获取数据
                                const $tbody = $("#presoma_table").children('tbody')
                                raw_audit.funcs.renderHandler($tbody, presomas)
                                raw_audit.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            // /** 追加状态下拉框事件 */
            // var statusSelect = $('#model-li-hide-select-21')
            // raw_audit.funcs.bindSelectEventListener(statusSelect)
            // /** 追加刷新事件 */
            // var refreshBtn = $('#model-li-hide-refresh-21')
            // raw_audit.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            // /** 追加搜索事件 */
            // var searchBtn = $('#model-li-hide-search-21')
            // raw_audit.funcs.bindSearchEventListener(searchBtn)
        }, renderHandler: function ($tbody, presomas) {
            $tbody.empty()
            presomas.forEach(function (e) {
                var status = $('#status').val()
                $tbody.append(
                    "<tr>" +
                    "<td>" + raw_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + raw_audit.funcs.getAuditor(e.auditor) + "</td>" +
                    "<td>" + raw_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.insideCode + "</td>" +
                    "<td>" + raw_audit.funcs.formatDate(e.productDate) + "</td>" +
                    "<td>" + e.number + "</td>" +
                    "<td>" + e.judge.name + "</td>" +
                    "<td>" + e.c1 + "</td>" +
                    "<td>" + e.c2 + "</td>" +
                    "<td>" + e.c3 + "</td>" +
                    "<td>" + e.c4 + "</td>" +
                    "<td>" + e.c7 + "</td>" +
                    "<td>" + e.c10 + "</td>" +
                    "<td>" + e.c16 + "</td>" +
                    "<td>" + e.c17 + "</td>" +
                    "<td>" + e.c18 + "</td>" +
                    "<td>" + e.c19 + "</td>" +
                    "<td>" + e.c20 + "</td>" +
                    "<td>" + e.c21 + "</td>" +
                    "<td>" + e.c22 + "</td>" +
                    "<td>" + e.c23 + "</td>" +
                    "<td>" + e.c24 + "</td>" +
                    "<td>" + e.c25 + "</td>" +
                    "</tr>"
                )
            })
            // var auditBtns = $('.audit')
            // var detailBtns = $('.detail')
            // raw_audit.funcs.bindAuditEventListener(auditBtns)
            // raw_audit.funcs.bindDetailEventListener(detailBtns)
        },
        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得审核人*/
        getAuditor: function (e) {
            if (e == null) {
                return "无";
            }
            else {
                return e.name;
            }
        },

        /** 操作图标 */
        getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        }

    }

}