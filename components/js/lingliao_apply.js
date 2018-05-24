var lingliao_apply = {
    init: function () {

        /** 渲染表格 */
        lingliao_apply.funcs.renderTable()
        /** 渲染下拉菜单 */
        lingliao_apply.funcs.bindCreatoption()
        //////////////////////////////////
        //bind SelectAll for editModal checkBoxes
        //////////////////////////////////
        var checkedBoxLen = $(".add_checkbox:checked").length
        home.funcs.bindSelectAll($("#add_checkAll"), $(".add_checkbox"), checkedBoxLen, $("#add_modal_table"))


        /////////////////////////////////
        //bind addBtn click
        /////////////////////////////////
        $("#model-li-hide-add-113").click(function () {
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
            //post here to getAll
            $.post(home.urls.lingLiao.getAllByPage(), {}, function (res) {
                //console.log(res.data.content)
                var $tbody = $("#lingliao_apply_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content

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
            //追加搜索事件
            var searchBtn = $('#model-li-hide-search-113')
            lingliao_apply.funcs.bindSearchEventListener(searchBtn)
            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////
            //编辑里面新增按钮事件
            lingliao_apply.funcs.bindAddClick($("#edit_addBtn"))

            //////////////////////////////////
            //bind detailBtn clicks in addModal
            //////////////////////////////////
            lingliao_apply.funcs.bindDetailClickInAddModal($(".addModal_detail"))

            /** 正常申请的事件 */
            var norApplyBtns = $('#model-li-hide-normal_add-113')
            lingliao_apply.funcs.bindNorApplyModel(norApplyBtns)
            /** 紧急申请的事件 */
            var urgApplyBtns = $('#model-li-hide-urgent_add-113')
            lingliao_apply.funcs.bindUrgApplyModel(urgApplyBtns)
            /** 正常申请页面里的新增按钮 */
            var norApplyAddBtns = $('#normal_add_addBtn')
            lingliao_apply.funcs.bindNorApplyAddModel(norApplyAddBtns)
            /** 紧急申请页面里的新增按钮 */
            var urgApplyAddBtns = $('#urgent_add_addBtn')
            lingliao_apply.funcs.bindUrgApplyAddModel(urgApplyAddBtns)
            /** 正常申请页面里的新增页面里的搜索事件 */
            var norApplyAddSearchBtns = $('#addModal_search')
            lingliao_apply.funcs.bindNorApplyAddSearchModel(norApplyAddSearchBtns)
        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            for (var i = 0; i < items.length; i++) {
                e = items[i];
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='lingliao_apply_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.department ? e.department.name : null) + "</td>" +
                    "<td>" + (new Date(e.applyDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.code : null) + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td>" + e.pickingStatus + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (e.code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (e.code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (e.code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
            }


            //console.log(code)


            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            lingliao_apply.funcs.bindDetailClick(detailBtns)
            var editorBtns = $('.editor')
            lingliao_apply.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $('.delete')
            lingliao_apply.funcs.bindDeleteClick(deleteBtns)
            //lingliao_apply.funcs.checkboxEventBinding()
            var checkedBoxLen = $('.lingliao_apply_checkbox:checked').length
            home.funcs.bindSelectAll($("#lingliao_apply_checkAll"), $('.lingliao_apply_checkbox'), checkedBoxLen, $("#lingliao_apply_table"))

            var deleteBatchBtn = $('#model-li-hide-delete-113')
            lingliao_apply.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
        }
        /** 监听下拉菜单的option */
        , bindCreatoption: function () {
            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                $("#processtype").html("<option>请选择流程类型</option>")
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#processtype").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                }
            })
        }

        /** 删除事件 */
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
                        $.post(home.urls.lingLiao.deleteByCode(), {
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
        /** 正常申请事件 */
        , bindNorApplyModel: function (norApplyBtns) {
            norApplyBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '正常申请',
                    content: $("#normal_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#normal_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        /** 正常申请页面里的新增按钮 */
        , bindNorApplyAddModel: function (norApplyAddBtns) {
            norApplyAddBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '正常申请-新增',
                    content: $("#nor_addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#nor_addModal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#nor_addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        /** 正常申请页面里的新增页面里的搜索事件 */

        , bindNorApplyAddSearchModel: function (norApplyAddSearchBtns) {
            norApplyAddSearchBtns.off('click')
            norApplyAddSearchBtns.on('click', function () {
                var status = $('#status').val()
                var process = $('#processtype option:selected').val();
                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                    auditStatus: status,
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getAllByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#lingLiao_page").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
        /** 紧急申请事件 */
        , bindUrgApplyModel: function (urgApplyBtns) {
            urgApplyBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '紧急申请',
                    content: $("#urgent_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#urgent_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        /** 紧急申请页面里的新增按钮 */
        , bindUrgApplyAddModel: function (urgApplyAddBtns) {
            urgApplyAddBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '紧急申请-新增',
                    content: $("#urg_addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#urg_addModal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#urg_addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
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

        /**填充详情表格的弹出表格 */
        , fillData_detail: function (table, items) {

            $.get(home.urls.check.getAll(), {}, function (result) {
                item = result.data
                console.log(item)
                $("#detail_select").html("<option>请选择审批流程</option>");
                item.forEach(function (e) {
                    $("#detail_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })

            })
            var pickingApplies = items.pickingApplies
            var $tbody = $('#detail-table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                //console.log(ele)
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
            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)
            //todo
            $.get(servers.backup() + "check/getAll", {}, function (res) {
                res.data.forEach(function (e, index) {
                    $("#process_type").append(
                        "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                    )
                })
            })
            $("#appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#app_dep").text(userJson.department.name)
            $("#cur_user").text(userJson.name)
        }
        /** 填充编辑按钮的表格 */
        , fillData_editor: function (table, items) {
            $.get(home.urls.check.getAll(), {}, function (result) {
                item = result.data
                console.log(item)
                $("#edit_select").html("<option>请选择审批流程</option>");
                item.forEach(function (e) {
                    $("#edit_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })

            })
            console.log(items)
            var pickingApplies = items.pickingApplies
            var $tbody = $('#edit_modal_table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                //console.log(ele)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='edit_checkbox' value='" + (ele.code) + "'></td>" +
                    " <td>" + (ele.rawType.name) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>"
                )
            })
            //实现全选
            var checkedBoxLen = $('.edit_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_checkAll"), $('.edit_checkbox'), checkedBoxLen, $("#edit_modal_table"))

            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)
            //todo
            $.get(servers.backup() + "check/getAll", {}, function (res) {
                res.data.forEach(function (e, index) {
                    $("#process_type").append(
                        "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                    )
                })
            })
            $("#ed_appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#ed_app_dep").text(userJson.department.name)
            $("#ed_cur_user").text(userJson.name)

        }
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                console.log($(this).attr('id'))
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.lingLiao.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data//获取数据
                    //点击的时候需要弹出一个模态框
                    lingliao_apply.funcs.fillData_editor($("#editor_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#edit_modal"),
                        area: ['800px', '400px'],
                        btn: ['保存', '提交', '返回'],
                        offset: "auto",
                        closeBtn: 0,
                        //保存
                        yes: function (index) {
                            $("#edit_modal").css('display', 'none')
                            layer.close(index)
                        },
                        //提交
                        btn2: function (index) {
                            //var Code = _selfBtn.attr('id').substr(7)
                            var department = _selfBtn.pickingApplies.$.post(home.urls.lingLiao.update(), {
                                code: codeNumber

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
                                $("#edit_modal").css('display', 'none')
                                layer.close(index)
                            })
                        }
                        , btn3: function (index) {
                            $("#edit_modal").css('display', 'none')
                            layer.close(index)
                        }
                    })
                })

            })
        }
        //编辑里面的新增按钮
        , bindAddClick: function (addBtn) {
            addBtn.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
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
                    lingliao_apply.funcs.fillData_detail($("#detail_modal"), items)  //将获取的数据传到#detail_modal中
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
        /** 批量删除事件 */
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.lingliao_apply_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var lingLiaoCodes = []
                            $('.lingliao_apply_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    lingLiaoCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.lingLiao.deleteByBatchCodeBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(lingLiaoCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            lingliao_apply.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                }
                            })
                            layer.close(index)
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        }
        /** 搜索事件 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var status = $('#status').val()
                var process = $('#processtype option:selected').val();
                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                    auditStatus: status,
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    console.log(items)
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#lingLiao_page").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}