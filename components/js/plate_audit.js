var plate_audit = {
    init: function () {
        plate_audit.funcs.renderTable()
        var out = $('#department_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#department_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.plateAlarm.getAllByPage(), {}, function (res) {
                var $tbody = $("#plate_audit_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                //console.log(items)
                plate_audit.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                plate_audit.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'department_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.plateAlarm.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#plate_audit_table").children('tbody')
                                plate_audit.funcs.renderHandler($tbody, items)
                                plate_audit.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            plate_audit.funcs.bindDetailEventListener($('.plate_detail'))

            var refreshBtn = $('#model-li-hide-refresh-114');
            plate_audit.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model-li-hide-search-114')
            plate_audit.funcs.bindSearchEventListener(searchBtn)

        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            var i = 1
            items.forEach(function (e) {
                var code = e.code
                switch(e.status){
                    case 0:
                        status = '正常';
                        break;
                    case 1:
                        status = '开始盘库';
                        break;  
                    case 2:
                        status = '待审核';
                        break;
                    case 3:
                        status = '已审核';
                        break;    
                }
                var content = (
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.rawType.material.name) + "</td>" +
                    "<td>" + (e.rawType.name) + "</td>" +
                    "<td>" + (e.weight) + "</td>" +
                    "<td>" + status + "</td>" +
                    "<td><a href=\"#\" class='plate_detail' id='detail_" + (e.rawType.code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".plate_detail")
            plate_audit.funcs.bindDetailEventListener(detailBtns)
        }

        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $("#bs_num").text('')
                $("#rawtype").text('')
                $("#rawname").text('')
                $("#plate_num").text('')
                $("#total").text('')
                $("#user").text('')
                $("#audit_status").text('')
                $("#bs_time").text('')
                $("#process").empty()
                $("#curAuditor").text('')
                $("#auditorResult").text('')
                $("#auditorTime").text('')
                $("#note").text('')
                $("#suggestion").val('')
                $.post(home.urls.plateAudit.getByRawType(), {
                    code: code
                }, function (res1) {
                    var items1 = res1.data //获取数据
                    console.log(items1)
                    plate_audit.funcs.fill_detail_data($("#detail_modal"), items1)
                

                layer.open({
                    type: 1,
                    title: '报损单申请审核',
                    content: $("#detail_modal"),
                    area: ['800px', '700px'],
                    btn: ['提交', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        var status = $('input:radio:checked').val()
                        var note = $("#suggestion").val()
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var curAuditorCode = userJson.code
                        var nextAuditorCode = $("#nextman").val()?$("#nextman").val():'-1'
                        $.post(home.urls.plateAudit.audit(),{
                            status : status,
                            note : note,
                            curAuditorCode : curAuditorCode,
                            nextAuditorCode : nextAuditorCode,
                            code : items1.code
                        },function(result){
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    plate_audit.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700          
                          }) 
                        })
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        })
        }
        ,
        fill_detail_data: function(div,items1){
            var total_bs = 0
            $("#bs_num").text(items1.code?items1.code:'')
            $("#rawtype").text(items1.rawType.material?items1.rawType.material.name:'')
            $("#rawname").text(items1.rawType?items1.rawType.name:'')
            $("#plate_num").text(items1.weight?items1.weight:'')
            $("#total").text(total_bs)
            $("#user").text(items1.user?items1.user.name:'')
            $("#audit_status").text(items1.auditStatus)
            $("#nextman").empty()
            $("#bs_time").text(items1.time?new Date(items1.time).Format('yyyy-MM-dd'):'')
            $("#process").append("<option value="+items1.processManage.code+">"+items1.processManage.name+"</option>")
            $.get(home.urls.check.getAll(),{},function(result){
                var process = result.data
                process.forEach(function(e){
                    if(e.code!=items1.processManage.code){
                          $("#process").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                  
                })
            }) 
            var total = 0
            const $tbody = $("#lossEntries").children('tbody')
            $tbody.empty()
            if(items1.lossEntries!=null){
                items1.lossEntries.forEach(function(e){
                    total += (parseFloat(e.weight.toFixed(2)))
                    $tbody.append(
                        "<tr>"+
                        "<td>"+e.code+"</td>"+
                        "<td>"+e.batchNumber+"</td>"+
                        "<td>"+e.weight+"</td>"+
                        "</tr>"
                    ) 
                })
            }
            $("#total").text(total)
            $.post(home.urls.plateAudit.getLossEntryAuditsByLossEntryHeader(),{
                code:items1.code
            },function(result){
                var res = result.data
                res.forEach(function(e){
                    $("#curAuditor").text(e.auditor?e.auditor.name:'')
                    $("#auditorResult").text(e.auditResult?e.auditResult:'')
                    $("#auditorTime").text(e.auditTime?new Date(e.auditTime).Format('yyyy-MM-dd'):'')
                    $("#note").text(e.note?e.note:'')  
                  }) 
                 })
            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)
            var curAuditorCode = userJson.code
            $.post(home.urls.plateAudit.getRestAuditorByCode(),{
                code:items1.code,
                curAuditorCode:curAuditorCode
            },function(result){
                var auditor = result.data
                $("#nextman").empty()
                auditor.forEach(function(e){
                    $("#nextman").append("<option value="+e.code+">"+e.name+"</option>")
                })
                
            })
     
      
        },
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    plate_audit.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var auditStatus = $('#audit_name option:selected').val();
                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                    status: auditStatus
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#plate_audit_table").children('tbody')
                    plate_audit.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'department_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                                    status: auditStatus,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#plate_audit_table").children('tbody')
                                    plate_audit.funcs.renderHandler($tbody, items)
                                    plate_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}