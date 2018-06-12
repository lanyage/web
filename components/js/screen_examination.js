var screen_examination = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        screen_examination.funcs.renderTable()

        /** 将分页居中 */
        var out = $('#screen_examination_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#screen_examination_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)

    },

    funcs: {
        renderTable: function () {
            $.post(home.urls.productIn.getAllByPage(), {}, function (res) {
                var $tbody = $("#screen_examination_table").children('tbody')
                var items = res.data.content
                screen_examination.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                screen_examination.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'screen_examination_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            $.post(home.urls.productIn.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#screen_examination_table").children('tbody')
                                screen_examination.funcs.renderHandler($tbody, items)
                                screen_examination.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#screen_examination_page').css('padding-left', '37%')
            })
        },

        renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='screen_examination_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.department ? e.department.name : null) + "</td>" +
                    "<td>" + (e.payTime) + "</td>" +
                    "<td><a href='#' class='detail' id='detail-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            var checkedBoxLen = $('.screen_examination_checkbox:checked').length
            home.funcs.bindSelectAll($("#screen_examination_checkAll"), $('.screen_examination_checkbox'), checkedBoxLen, $("#lingliao_applyscreen_examination_table"))
           
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
           // screen_examination.funcs.bindDetailClick(detailBtns)
        },

        bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productIn.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data  //获取数  /** */
                    // console.log(items)
                    //点击的时候需要弹出一个模态框
                    screen_examination.funcs.fillData($("#detail_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '成品入库详情',
                        content: $("#detail_modal"),
                        area: ['800px', '430px'],
                        btn: [' 返回'],
                        offset: "auto",
                        closeBtn: 0,
                        yes: function (index) {
                            //点击确定之后必须打印当前表单,推荐第三方插件 printthis.js todo
                            $("#detail_modal").css('display', 'none')
                            layer.close(index)
                        },
                        btn2: function (index) {
                            $("#detail_modal").css('display', 'none')
                            layer.close(index)
                        }
                    })
                })
            })

        },

    }
}