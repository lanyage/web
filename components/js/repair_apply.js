var repair_apply = {

    init: function () {
        /** 获取部门信息分页显示并展示 */
        repair_apply.funcs.renderTable()
    }//$init end$

    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.repair.listApplicationsInPages(), {page: 0}, function (result) {
                var repairs = result.data.content //获取数据
                const $tbody = $("#repair_table").children('tbody')
                repair_apply.funcs.renderHandler($tbody, repairs)
                repair_apply.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'repair_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.repair.listApplicationsInPages(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var repairs = result.data.content //获取数据
                                const $tbody = $("#repair_table").children('tbody')
                                repair_apply.funcs.renderHandler($tbody, repairs)
                                repair_apply.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#repair_page').css('padding-left', '37%')
            })//$数据渲染完毕

            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-44')
            repair_apply.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-44')
            repair_apply.funcs.bindSearchEventListener(searchBtn)
            /** 追加flag搜索事件 */
            var searchbyflagBtn = $('#model-li-hide-searchbyflag-44')
            repair_apply.funcs.bindSearchbyflagEventListener(searchbyflagBtn)//状态刷新事件
            /** 追加time搜索事件 */
            var searchbytimeBtn = $('#model-li-hide-searchbytime-44')
            repair_apply.funcs.bindSearchbytimeEventListener(searchbytimeBtn)//时间刷新事件
            /** 通过名称搜索事件绑定 */
        }

        /** 搜索事件绑定 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var repair_name = $('#repair_name_input').val()
                console.log(repair_name)
                $.post(home.urls.repair.findByEquipmentNameInPages(), {name: repair_name}, function (result) {
                    var page = result.data
                    var repairs = result.data.content //获取数据
                    console.log(repairs)
                    const $tbody = $("#repair_table").children('tbody')
                    repair_apply.funcs.renderHandler($tbody, repairs)
                    layui.laypage.render({
                        elem: 'repair_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.repair.findByEquipmentNameInPages(), {
                                name: repair_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var repairs = result.data.content //获取数据
                                const $tbody = $("#repair_table").children('tbody')
                                repair_apply.funcs.renderHandler($tbody, repairs)
                                repair_apply.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$

        /** 通过状态搜索事件绑定 */
        , bindSearchbyflagEventListener: function () {
            var searchbyflagBtn = $("#model-li-hide-searchbyflag-44")
            searchbyflagBtn.off('change')
            searchbyflagBtn.on('change', function () {
                var code = $(this).val()
                console.log('code')
                $.post(home.urls.repair.findByFlagInPages(), {code: code}, function (result) {
                    var res = result.data
                    layui.laypage.render({
                        elem: 'repair_page'
                        , count: 10 * res.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.repair.findByFlagInPages(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                code: code
                            }, function (result) {
                                var repairs = result.data.content //获取数据
                                const $tbody = $("#repair_table").children('tbody')
                                repair_apply.funcs.renderHandler($tbody, repairs)
                                repair_apply.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$


        /** 通过时间搜索事件绑定 */
        , bindSearchbytimeEventListener: function () {
            var searchbytimeBtn = $("#model-li-hide-searchbytime-44")
            searchbytimeBtn.off('change')
            searchbytimeBtn.on('change', function () {
                var date = $(this).val()
                $.post(home.urls.repair.findByApplicationTimeInPages(), {date: date}, function (result) {
                    var res = result.data
                    layui.laypage.render({
                        elem: 'repair_page'
                        , count: 10 * res.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.repair.findByApplicationTimeInPages(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                date: date
                            }, function (result) {
                                var repairs = result.data.content //获取数据
                                const $tbody = $("#repair_table").children('tbody')
                                repair_apply.funcs.renderHandler($tbody, repairs)
                                repair_apply.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$


        /** 绑定刷新事件 */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    repair_apply.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        /**绑定显示详情事件 */
        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                var code = $(this).attr("id").substr(3)
                $.post(servers.backup() + "equipment/detail", {code: code}, function (result) {
                    var repairs = result.data
                    console.log(repairs)
                    $('#repair_department_input').val(repairs.department ? repairs.department.name : '')
                    $('#repair_equipmentname_input').val(repairs.equipment ? repairs.equipment.name : '')
                    $('#repair_equipmentcode_input').val(repairs.eqArchive ? repairs.eqArchive.code : '')
                    $('#repair_productLine_input').val(repairs.productLine ? repairs.productLine.name : '')
                    $('#repair_duty_input').val(repairs.duty ? repairs.duty.name : '')
                    $('#repair_applicationPerson_input').val(repairs.applicationPerson ? repairs.applicationPerson.name : '')
                    $('#repair_input_appcontact').val(repairs.applicationPerson ? repairs.applicationPerson.Contact : '')
                    $("#repair_applicationTime_input").val(repair_apply.funcs.transformStampToDate(repairs.applicationTime))
                    $("#repair_applicationDescription_input").val(repairs.applicationDescription)
                    $("#repair_orderTime_input").val(repair_apply.funcs.transformStampToDate(repairs.orderTime))
                    $("#repair_finishTime_input").val(repair_apply.funcs.transformStampToDate(repairs.finishTime))
                    repairs.evaluation ? (function () {
                        $("#_" + repairs.evaluation.code).prop("checked", true)
                    })() : null
                    $("#repair_repairmanDescription_input").val(repairs.repairmanDescription)
                    /** 弹出一个询问框 */
                    layer.open({
                        type: 1,
                        title: '添加',
                        content: $('#repair_info'),
                        area: ['900px', '550px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        closeBtn: 0,
                        yes: function (index) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    repair_apply.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                            $("#repair_info").css('display', 'none')
                        },
                        btn2: function (index) {
                            layer.close(index)
                            $("#repair_info").css('display', 'none')
                        }
                    })
                })
            })
        },
        transformStampToDate: function (stamp) {
            var dateArr = []
            var date = new Date(stamp)
            dateArr.push(date.getFullYear())
            dateArr.push(date.getMonth() + 1)
            dateArr.push(date.getDate())
            return dateArr.join('-')
        }
        /** 渲染 */
        , renderHandler: function ($tbody, repairs) {
            $tbody.empty() //清空表格
            repairs.forEach(function (e) {
                $('#rep_checkAll').prop('checked', false)
                $tbody.append(
                    $tbody.append(
                        "<tr>" +
                        "<td>" + (e.flag ? e.flag.name : 'null') + "</td>" +
                        "<td>" + (e.eqArchive ? e.eqArchive.code : 'null') + "</td>" +
                        "<td>" + (e.department ? e.department.name : 'null') + "</td>" +
                        "<td>" + (e.productLine ? e.productLine.code : 'null') + "</td>" +
                        "<td>" + (e.applicationPerson ? e.applicationPerson.name : 'null') + "</td>" +
                        "<td>" + (e.applicationTime ? repair_apply.funcs.transformStampToDate(e.applicationTime) : 'null') + "</td>" +
                        "<td>" + (e.orderTime ? repair_apply.funcs.transformStampToDate(e.orderTime) : 'null') + "</td>" +
                        "<td>" + (e.finishTime ? repair_apply.funcs.transformStampToDate(e.finishTime) : 'null') + "</td>" +
                        "<td><a href='#' class='detailRepair' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                        "</tr>")
                )
            })

            //$数据渲染完毕

            var detaillBtns = $('.detailRepair')
            repair_apply.funcs.bindDetailEventListener(detaillBtns)
        },
        /** 全选逻辑 */
    }
}