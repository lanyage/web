var plate_manage={
    init: function () {
        plate_manage.funcs.renderTable()

        var out = $('#plate_manage_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#plate_manage_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }
    , funcs: {
        renderTable: function () {
            $.post(home.urls.plateAlarm.getAllByPage(), {}, function (res) {

                var $tbody = $("#lib_manage_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                plate_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                plate_managepageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'plate_manage_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.plateAlarm.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#lib_manage_table").children('tbody')
                                plate_manage.funcs.renderHandler($tbody, items)
                                plate_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            var refreshBtn = $('#model-li-hide-refresh-52');
            plate_manage.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model-li-hide-search-52')
            plate_manage.funcs.bindSearchEventListener(searchBtn)

            plate_manage.funcs.startStock($("#start"))
            plate_manage.funcs.stopStock($("#stop"))

        },
        renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        var i = 1
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                "<td>" + (i++) + "</td>" +
                "<td>" + (e.rawType.material.name) + "</td>" +
                "<td>" + (e.rawType.name) + "</td>" +
                "<td>" + (e.weight) + "</td>" +
                "<td>" + e.status + "</td>" +
                "<td><a href=\"#\" class='detail' id='detail_" + (code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
                "</tr>"
            )
            $tbody.append(content)
        })

        var detailBtns = $(".detail")
        plate_manage.funcs.bindDetailEventListener(detailBtns)

    },
        bindDetailEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                code = $(this).attr('id').substr(7)
                var e = $(this).parent('td').parent('tr').find('td')
                //console.log(e.eq(1).text())
                $('#code').text(code)
                $('#material').text(e.eq(1).text())
                $('#rawType').text(e.eq(2).text())
                $('#weight').text(e.eq(3).text())
                $.get(home.urls.check.getAll(),{},function(result){
                    var process = result.data
                    $("#process").empty()
                    process.forEach(function(e){
                        $("#process").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                var userStr = $.session.get('user')
                var userJson = JSON.parse(userStr)
                $("#user").text(userJson.name)
                $("#status").text('待审核')
                $("#total").text('0')
                $("#time").text(new Date().Format('yyyy-MM-dd'))

                const $tbody = $("#LossEntry").children('tbody')
                $tbody.empty()
                plate_manage.funcs.add($("#button"))

                layer.open({
                    type: 1,
                    title: '报损单申请',
                    content: $("#detail_modal"),
                    area: ['800px', '500px'],
                    btn: ['提交', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        var lossEntries = []
                        var count = $("#LossEntry tbody tr").length
                        var total = parseInt($("#total").text())
                        const $tbody = $("#LossEntry").children('tbody')
                        if(count===0){
                            lossEntries = []
                        } 
                        else{
                            $(".newLine").each(function(){
                                var e1 = $(this).children('td')
                                total += parseInt(e1.eq(2).children('input').val())
                                //console.log(e1.eq(2).children('input').val())
                                
                                lossEntries.push({
                                   // code:e1.eq(0).text(),
                                    batchNumber:e1.eq(1).children('input').val(),
                                    weight:e1.eq(2).children('input').val()
                                }) 
                            })   
                        }
                        var materialsTotalCode = $('#code').text()
                        var rawType = $('#rawType').text()
                        var weight = $('#weight').text()
                        var user = $("#user").text()
                        var processManage = $("#process").val()
                        
                        var data = {
                            materialsTotalCode : materialsTotalCode,
                            weight : weight,
                            lossWeight : total,
                            user : {code:userJson.code},
                            processManage : {code:processManage},
                            lossEntries : lossEntries
                        } 
                        $.ajax({
                            url:home.urls.plateAudit.add(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        plate_manage.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700          
                              })  
                            }                       
                         })
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        },
        add:function(addBtns){
            addBtns.off('click').on('click',function(){
                const $tbody = $("#LossEntry").children('tbody')
                var i = $("#LossEntry tbody tr").length + 1
               // console.log(i)
                $tbody.append(
                    "<tr class='newLine' id='s" + i + "'>"+
                    "<td><input type='text' />"+i+"</td>"+
                    "<td><input type='text' /></td>"+
                    "<td><input type='text'/></td>"+
                    "<td><button class='delete' onclick='plate_manage.funcs.delTab("+(i++)+")' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                )
             })
        }
        ,delTab:function(x){
            $("#s" +(x) + "").remove();
            var count = $("#LossEntry tr").length  
            var i = 1
            $(".newLine").each(function(){
                $(this).children('td').eq(0).text(i++)
            })
        }
        ,startStock:function(buttons){
            buttons.off('click').on('click',function(){
                $.post(servers.backup()+"materialsTotal/startStock",{},function(result){  
                    if(result.code === 0) {
                        var time = setTimeout(function(){
                            plate_manage.init()
                            clearTimeout(time)
                        },500)
                    }
                    layer.msg(result.message,{
                        offset:['40%','55%'],
                        time:700          
                  })             
                })
            })
        }
        ,stopStock:function(buttons){
            buttons.off('click').on('click',function(){
                $.post(servers.backup()+"materialsTotal/endStock",{},function(result){
                    if(result.code === 0) {
                        var time = setTimeout(function(){
                            plate_manage.init()
                            clearTimeout(time)
                        },500)
                    }
                    layer.msg(result.message,{
                        offset:['40%','55%'],
                        time:700          
                  })          
                })
            })
        }
        ,bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    plate_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var auditStatus = $('#lib_manage_name option:selected').val();
                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                    status: auditStatus
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#lib_manage_table").children('tbody')
                    plate_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'plate_manage_page'
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
                                    const $tbody = $("#lib_manage_table").children('tbody')
                                    plate_manage.funcs.renderHandler($tbody, items)
                                    plate_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
    }
}
