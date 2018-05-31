var mat_out_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        mat_out_manage.funcs.renderTable()
        /** 渲染下拉菜单 */
        mat_out_manage.funcs.bindCreatoption()
        // mat_out_manage.funcs.checkboxEventBinding()
        /** 将分页居中 */
        var out = $('#material_out_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#material_out_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {

        renderTable: function () {
            $.post(home.urls.materialOut.getAllByPage(), {}, function (res) {
                var $tbody = $("#material_out_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content

                mat_out_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                mat_out_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'material_out_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#material_out_page").children('tbody')
                                mat_in_manage.funcs.renderHandler($tbody, items)
                                mat_in_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            // 追加刷新事件
            var refreshBtn = $('#model-li-hide-refresh-50');
            mat_out_manage.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件

            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-50');
            mat_out_manage.funcs.bindSearchEventListener(searchBtn);

        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            for( var i=0;i<items.length;i++){
                e=items[i];
                $tbody.append(
                    "<tr>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.department != null ? e.department.name : null) + "</td>" +
                    "<td>" + (new Date(e.applyDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.code : null) + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td>" + e.pickingStatus + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (e.code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "</tr>"
                )
            }
            
               
               
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            mat_out_manage.funcs.bindDetailClick(detailBtns)
        }

        /** 监听下拉菜单的option */
        , bindCreatoption: function () {
            $.get(home.urls.department.getAll(), {}, function (result) {
                var value = result.data
                $("#depmartment-1").html("<option>请选择领料部门</option>");
                var length = value.length
                for (var i = 0; i < length; i++) {
                    // console.log(value[i].code)
                    var text = value[i].name
                    $("#depmartment-1").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                }
            })
                , $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                $("#depmartment-3").html("<option>请选择流程类型</option>");
                var length = value.length
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#depmartment-3").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                }
            })
        }
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //console.log($(this).attr('id'))
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.materialOut.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data//获取数据

                    mat_out_manage.funcs.fillData($("#detail_modal"), items)   //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '原料出库单',
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
        , fillData: function ($table, items) {

            $.get(servers.backup() + "process/getAll", {}, function (res) {
                items = res.data
                $("#process_type").html("<option>请选择审批流程</option>");
                items.forEach(function(e) {
                    $("#process_type").append(
                        "<option value=" + (e.code) + ">" + (e.name) + "</option>"
                    )
                })
            })
            var pickingApplies = items.pickingApplies
            var $tbody = $('#detail_table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                $tbody.append(
                    "<tr>" +
                    " <td>" + (ele.rawType.code) + "</td>" +
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
            
            $("#appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#app_dep").text(userJson.department.name)
            $("#cur_user").text(userJson.name)
        }
       
        /** $全选逻辑结束$
         * 刷新逻辑
         */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    mat_out_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        /** 搜索事件 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var department = $('#depmartment-1 option:selected').val();
                var status = $('#depmartment-2 option:selected').val()
                var process = $('#depmartment-3 option:selected').val();
                console.log(department)
                console.log(status)
                console.log(process)
                $.post(home.urls.materialOut.getByDepartmentAndProcessManageAndPickingStatusByPage(), {
                    departmentCode: department,
                    pickingStatus: status,
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    var page = result.data
                    const $tbody = $("#material_out_table").children('tbody')
                    mat_out_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'material_out_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.materialout.getAllByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var manage = result.data.content //获取数据
                                    const $tbody = $("#material_out_table").children('tbody')
                                    mat_out_manage.funcs.renderHandler($tbody, items)
                                    mat_out_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
    }
}