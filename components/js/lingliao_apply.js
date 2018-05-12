var lingliao_apply = {
    init: function () {

        /** 渲染表格 */
        lingliao_apply.funcs.renderTable()
        /** 渲染下拉菜单 */
        lingliao_apply.funcs.bindCreatoption()
        //////////////////////////////////
        //bind SelectAll for editModal checkBoxes
        //////////////////////////////////
        var checkedBoxLen =$(".add_checkbox:checked").length
        home.funcs.bindSelectAll($("#add_checkAll"), $(".add_checkbox"),checkedBoxLen,$("#add_modal_table"))
        checkedBoxLen = $('.edit_checkbox:checked').length
        home.funcs.bindSelectAll($("#edit_checkAll"), $('.edit_checkbox'), checkedBoxLen, $("#edit_modal_table"))
        checkedBoxLen = $('.lingliao_apply_checkbox:checked').length
        home.funcs.bindSelectAll($("#lingliao_apply_checkAll"), $('.lingliao_apply_checkbox'), checkedBoxLen, $("#lingliao_apply_table"))

        /////////////////////////////////
        //bind addBtn click
        /////////////////////////////////
        $("#model-li-hide-add-113").click(function() {
            layer.open({
                type: 1,
                title: '编辑',
                content: $("#add_modal"),
                area: ['800px', '400px'],
                btn: ['保存', '提交', '返回'],
                offset: "auto",
                closeBtn: 0,
                yes: function (index) {
                    $("#add_modal").css('display', 'none')
                    layer.close(index)
                }
                , btn2: function (index) {
                    $("#add_modal").css('display', 'none')
                    layer.close(index)
                }
                , btn3: function (index) {
                    $("#add_modal").css('display', 'none')
                    layer.close(index)
                }
            })
            lingliao_apply.funcs.bindAddClick($("#add_addBtn"))
        })
        //////////////////////////////////
        //render table
        //////////////////////////////////
        /** 将分页居中 */
        var out = $('#lingLiao_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#lingLiao_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)

    }
    , funcs: {
        renderTable: function () {
            //post here to getAll     $todo
            $.post(home.urls.lingLiao.getAllByPage(), {}, function (res) {
                //console.log(res.data.content)
                var $tbody = $("#lingliao_apply_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAA')
                //console.log(items)
                lingliao_apply.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                lingliao_apply.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'lingLiao_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#lingLiao_page").children('tbody')
                                lingliao_apply.funcs.renderHandler($tbody, items)
                                lingliao_apply.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            //////////////////////////////////
            //after renderHandler
            //////////////////////////////////

            //bind selectAll

            var checkedBoxLen = $('.addModal_checkbox:checked').length
            home.funcs.bindSelectAll($("#addModal_checkALl"), $('.addModal_checkbox'), checkedBoxLen, $("#addModal_table"))

            //////////////////////////////////
            //bind detailModal
            //////////////////////////////////

            //////////////////////////////////
            //bind editModal
            //////////////////////////////////
            // 追加刷新事件
            var refreshBtn = $('#model-li-hide-refresh-113');
            lingliao_apply.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件

            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////

            lingliao_apply.funcs.bindAddClick($("#edit_addBtn"))

            //////////////////////////////////
            //bind detailBtn clicks in addModal
            //////////////////////////////////
            lingliao_apply.funcs.bindDetailClickInAddModal($(".addModal_detail"))


        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='lingliao_apply_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + e.department.name + "</td>" +
                    "<td>" + (new Date(e.applyDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + e.processManage.code + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td>" + e.pickingStatus + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            lingliao_apply.funcs.bindDetailClick(detailBtns)
            var editorBtns = $('.editor')
            lingliao_apply.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $('.delete')
            lingliao_apply.funcs.bindDeleteClick(deleteBtns)
        }
        /** 监听下拉菜单的option */
        , bindCreatoption: function () {
            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#processtype").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                }
            })
        }
        /** 刷新事件 */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    lingliao_apply.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        , bindDeleteClick: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var Code = _this.attr('id').substr(7)
                        $.post(home.urls.productOut.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    lingliao_apply.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        }
        , bindDetailClickInAddModal: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '详情',
                    content: "<div>todo...</div>",
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        layer.close(index)
                    }
                });
            })
        }
        , bindAddClick: function (addBtn) {
            addBtn.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#addModal"),
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                console.log($(this).attr('id'))
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.lingLiao.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data//获取数据
                    //点击的时候需要弹出一个模态框
                    lingliao_apply.funcs.fillData($("#detail_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '详情',
                        content: $("#detail_modal"),
                        area: ['800px', '400px'],
                        btn: ['返回'],
                        offset: "auto",
                        closeBtn: 0,
                        yes: function (index) {
                            $("#detail_modal").css('display', 'none')
                            layer.close(index)
                        }
                    });
                })
            })
        }
        , fillData: function (table, items) {
            $("#DtaeTime").text((new Date(items.applyDate).Format('yyyy/MM/dd')))
            $("#department").text(items.department.name)
            $("#applyPerson").text(items.user.name)
            console.log(items)
            var pickingApplies = items.pickingApplies
            var $tbody = $('#detail-table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                console.log(ele)
                $tbody.append(
                    "<tr>" +
                    " <td>" + (ele.rawType.name) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>"
                )
            })
        }
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#edit_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存', '提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#edit_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#edit_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#edit_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        }
    }
}