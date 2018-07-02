var kiln_Order = {
    init: function () {
        kiln_Order.funcs.renderTable()
        var out = $('#kiln_Order_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#kiln_Order_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.kilnOrder.getAllByPage(), {}, function (res) {
                var $tbody = $("#kiln_Order_table").children('tbody')
                var items = res.data.content
               // console.log(items)
                kiln_Order.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                kiln_Order.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'kiln_Order_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.kilnOrder.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#kiln_Order_table").children('tbody')
                                kiln_Order.funcs.renderHandler($tbody, items)
                                kiln_Order.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            kiln_Order.funcs.bindDetailEventListener($('.detail'))

            kiln_Order.funcs.bindAddEvent($('#model_li_hide_add_27'))
            kiln_Order.funcs.bindDeleteEvent($('#model_li_hide_delete_27'))

            var refreshBtn = $('#model_li_hide_refresh_27');
            kiln_Order.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_27')
            kiln_Order.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.kiln_Order_checkbox:checked').length
            home.funcs.bindSelectAll($("#kiln_Order_checkAll"),$(".kiln_Order_checkbox"),checkedBoxLen,$("#kiln_Order_table"))

        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
           // console.log(items)
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='kiln_Order_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.kilnCode?e.kilnCode:'null') + "</td>" +
                    "<td>" + (e.effectiveDate?e.effectiveDate:'') + "</td>" +
                    "<td>" + (e.compileTime?new Date(e.compileTime).Format('yyyy-MM-dd'):'')+ "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
                if(e.state === true){
                    $("#editor-"+(code)+"").removeClass("editor").addClass("disableHref")
                    $("#delete-"+(code)+"").removeClass("delete").addClass("disableHref")
                }
                kiln_Order.funcs.bindDetailEventListener($('.detail'))
                kiln_Order.funcs.bindEditorEventListener($('.editor'))
                kiln_Order.funcs.bindDeleteEventListener($('.delete'))
               
                var checkedBoxLen = $('.kiln_Order_checkbox:checked').length
                home.funcs.bindSelectAll($("#kiln_Order_checkAll"),$(".kiln_Order_checkbox"),checkedBoxLen,$("#kiln_Order_table"))

            })

        }

        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.kilnOrder.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#detail_modal")
                    kiln_Order.funcs.fill_detail_data(div,items)
                })
                layer.open({
                    type: 1,
                    title: '窑炉工艺单详情',
                    content: $("#detail_modal"),
                    area: ['900px', '560px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        },
        fill_detail_data: function(div,items){
            $("#code").text(items.code?items.code:'')
            $("#kilnCode").text(items.kilnCode?items.kilnCode:'')
            $("#effectiveDate").text(items.effectiveDate?items.effectiveDate:'')
            $("#compactor").text(items.compactor?items.compactor.name:'')
            $("#compileTime").text(items.compileTime?new Date(items.compileTime).Format('yyyy-MM-dd hh:mm:ss'):'null')
            
            $("#exhaust").text(items.exhaust?items.exhaust:'')
            $("#exhaustType").text(items.exhaustType?items.exhaustType:'')
            $("#exhaustWeight").text(items.exhaustWeight?items.exhaustWeight:'')
            $("#exhaustTop").text(items.exhaustTop?items.exhaustTop:'')
            $("#exhaustBottom").text(items.exhaustBottom?items.exhaustBottom:'')
            $("#note").text(items.note?items.note:'')
            var kilnParameters = items.kilnParameters
            $tbody = $("#kilnParameter_table").children('tbody')
            $tbody.empty()
            var i = 1
            kilnParameters.forEach(function(e){
                $tbody.append(
                    "<tr>"+
                    "<td>"+(i++)+"</td>"+
                    "<td>"+e.temRange+"</td>"+
                    "<td>"+e.length+"</td>"+
                    "<td>"+e.targetTem+"</td>"+
                    "<td>"+e.topTem+"</td>"+
                    "<td>"+e.midTem+"</td>"+
                    "<td>"+e.botTem+"</td>"+
                    "</tr>"
                )
            })
            
        },
        bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.kilnOrder.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#editor_modal")
                   // console.log(items)
                    kiln_Order.funcs.fill_editor_data(div,items)
                layer.open({
                    type:1,
                    title:'新增工艺单',
                    content:$("#editor_modal"),
                    area:['900px','560px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                        $("#editor_modal").css('display', 'none')
                       // var Code = $("#code").val()
                        var kilnCode = $("#kilnCode1").val()
                        var effectiveDate = $("#effectiveDate1").val()
                        var compileTime = new Date($("#compileTime1").val()).getTime()
                        var compactor = $("#compactor1").val()
                        var exhaust = $("#exhaust1").val()
                        var exhaustType = $("#exhaustType1").val()
                        var exhaustWeight = $("#exhaustWeight1").val()
                        var exhaustTop = $("#exhaustTop1").val()
                        var exhaustBottom = $("#exhaustBottom1").val()
                        var note = $("#note1").val()
                        var kilnParameters = []
                        console.log(code)
                       $(".newLine").each(function(){
                           var e = $(this).children('td')
                           kilnParameters.push(
                               {
                                code:e.eq(0).children('input').val(),
                                kilnOrder:{code:code},
                                temRange:e.eq(1).children('input').val(),
                                length:e.eq(2).children('input').val(),
                                targetTem:e.eq(3).children('input').val(),
                                topTem:e.eq(4).children('input').val(),
                                midTem:e.eq(5).children('input').val(),
                                botTem:e.eq(6).children('input').val()
                               }
                           )
                       })
                        var data = {
                            code:code,
                            kilnCode:kilnCode,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            effectiveDate:effectiveDate,
                            compileTime:compileTime,
                            compactor:{code:compactor},
                            state:0,
                            kilnParameters:[]
                        }
                        data.kilnParameters = kilnParameters
                        console.log(data)
                        $.ajax({
                            url:home.urls.kilnOrder.update(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function(){
                                        kiln_Order.init()
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
                    ,btn2: function(index) {
                        $("#editor_modal").css('display', 'none')
                        var Code = $("#code").val()
                        var kilnCode = $("#kilnCode1").val()
                        var effectiveDate = $("#effectiveDate1").val()
                        var compileTime = new Date($("#compileTime1").val()).getTime()
                        var compactor = $("#compactor1").val()
                        var exhaust = $("#exhaust1").val()
                        var exhaustType = $("#exhaustType1").val()
                        var exhaustWeight = $("#exhaustWeight1").val()
                        var exhaustTop = $("#exhaustTop1").val()
                        var exhaustBottom = $("#exhaustBottom1").val()
                        var note = $("#note1").val()
                        var kilnParameters = []
                       $(".newLine").each(function(){
                           var e = $(this).children('td')
                           kilnParameters.push(
                               {
                                code:e.eq(0).children('input').val(),
                                kilnOrder:{code:Code},
                                temRange:e.eq(1).children('input').val(),
                                length:e.eq(2).children('input').val(),
                                targetTem:e.eq(3).children('input').val(),
                                topTem:e.eq(4).children('input').val(),
                                midTem:e.eq(5).children('input').val(),
                                botTem:e.eq(6).children('input').val()
                               }
                           )
                       })
                       console.log(kilnParameters)
                        var data = {
                            code:code,
                            kilnCode:kilnCode,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            effectiveDate:effectiveDate,
                            compileTime:compileTime,
                            compactor:{code:compactor},
                            state:1,
                            kilnParameters:[]
                        }
                        data.kilnParameters = kilnParameters
                        console.log(data)
                        $.ajax({
                            url:home.urls.kilnOrder.update(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function(){
                                        kiln_Order.init()
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
                    ,btn3: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        })
        kiln_Order.funcs.add_line($("#button")) 
        }
        ,fill_editor_data: function(div,items){
            $("#compactor1").empty()
            
            $("#compactor1").append("<option value="+(items.compactor?items.compactor.code:'')+">"+(items.compactor?items.compactor.name:'')+"</option>")
            $("#code1").val(items.code?items.code:'')
            $("#kilnCode1").val(items.kilnCode?items.kilnCode:'')
            $("#effectiveDate1").val(items.effectiveDate?items.effectiveDate:'')
            $("#compileTime1").val(items.compileTime?new Date(items.compileTime).Format('yyyy-MM-dd hh:mm:ss'):'null')

            $("#exhaust1").val(items.exhaust?items.exhaust:'')
            $("#exhaustType1").val(items.exhaustType?items.exhaustType:'')
            $("#exhaustWeight1").val(items.exhaustWeight?items.exhaustWeight:'')
            $("#exhaustTop1").val(items.exhaustTop?items.exhaustTop:'')
            $("#exhaustBottom1").val(items.exhaustBottom?items.exhaustBottom:'')
            $("#note1").val(items.note?items.note:'')

            $.get(servers.backup()+'user/getAll',{},function(result){
                var user = result.data
                user.forEach(function(e){
                    if(items.compactor.code!=e.code){
                        $("#compactor1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                })
            })

            var kilnParameters = items.kilnParameters
            $tbody = $("#kilnParameter_table1").children('tbody')
            $tbody.empty()
           // console.log(kilnParameters)
           var i = 1
            kilnParameters.forEach(function(e){
                $tbody.append(
                    "<tr class='newLine'>"+
                    "<td>"+(i++)+"</td>"+
                    "<td><input type='text' value="+e.temRange+" /></td>"+
                    "<td><input type='text' value="+e.length+" /></td>"+
                    "<td><input type='text' value="+e.targetTem+" /></td>"+
                    "<td><input type='text' value="+e.topTem+" /></td>"+
                    "<td><input type='text' value="+e.midTem+" /></td>"+
                    "<td><input type='text' value="+e.botTem+" /></td>"+
                    "<td><button class='Delete' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                )
            })
            kiln_Order.funcs.bindDelete($('.Delete'))
        }
        ,bindDelete:function(btns){
            btns.off('click').on('click',function(){
                 $(this).parent('td').parent('tr').remove()
                 var length = 1
                 $('.newLine').each(function(e){
                     $(this).children('td').eq(0).text(length++)
                 })
            })
           
        }
        ,add_line:function(buttons){
            buttons.off('click').on('click',function(){
                $tbody = $("#kilnParameter_table1").children('tbody')
                var length = $("#kilnParameter_table1 tbody tr").length+1
                $tbody.append(
                    "<tr class='newLine'>"+
                    "<td>"+(length)+"</td>"+
                    "<td><input type='text' /></td>"+
                    "<td><input type='text' /></td>"+
                    "<td><input type='text' /></td>"+
                    "<td><input type='text' /></td>"+
                    "<td><input type='text' /></td>"+
                    "<td><input type='text' /></td>"+
                    "<td><button class='Delete' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                ) 
                kiln_Order.funcs.bindDelete($('.Delete'))
            })
           
        }
        ,bindDeleteEventListener:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                var _this = $(this)
                layer.open({
                    type:1,
                    title:'删除',
                    content:"<h5 style='text-align:center;padding-top:8px'>确认要删除该记录吗?</h5>",
                    area:['180px','130px'],
                    btn:['确认','取消'],
                    offset:['40%','55%'],
                    yes:function(index) {
                        var Code = _this.attr('id').substr(7)
                        $.post(home.urls.kilnOrder.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    kiln_Order.init()
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
        ,bindAddEvent:function(addBtn){
            addBtn.off('click').on('click',function(){
                $("#compactor1").empty()
            
                $("#code1").val('')
                $("#kilnCode1").val('')
                $("#effectiveDate1").val('')
                $("#compileTime1").val('')
    
                $("#exhaust1").val('')
                $("#exhaustType1").val('')
                $("#exhaustWeight1").val('')
                $("#exhaustTop1").val('')
                $("#exhaustBottom1").val('')
                $("#note1").val('')
    
                $.get(servers.backup()+'user/getAll',{},function(result){
                    var user = result.data
                    user.forEach(function(e){
                            $("#compactor1").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                layer.open({
                    type:1,
                    title:"新增工艺单",
                    content:$("#editor_modal"),
                    area:['900px','700px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {
                        $("#editor_modal").css('display','none')
                        var code = $("#code1").val()
                        var kilnCode = $("#kilnCode1").val()
                        var effectiveDate = $("#effectiveDate1").val()
                        var compileTime = new Date($("#compileTime1").val()).getTime()
                        var compactor = $("#compactor1").val()
                        var exhaust = $("#exhaust1").val()
                        var exhaustType = $("#exhaustType1").val()
                        var exhaustWeight = $("#exhaustWeight1").val()
                        var exhaustTop = $("#exhaustTop1").val()
                        var exhaustBottom = $("#exhaustBottom1").val()
                        var note = $("#note1").val()
                        var kilnParameters = []
                       $(".newLine").each(function(){
                           var e = $(this).children('td')
                           kilnParameters.push(
                               {
                                code:e.eq(0).children('input').val(),
                                kilnOrder:{code:code},
                                temRange:e.eq(1).children('input').val(),
                                length:e.eq(2).children('input').val(),
                                targetTem:e.eq(3).children('input').val(),
                                topTem:e.eq(4).children('input').val(),
                                midTem:e.eq(5).children('input').val(),
                                botTem:e.eq(6).children('input').val()
                               }
                           )
                       })
                       console.log(kilnParameters)
                        var data = {
                            code:code,
                            kilnCode:kilnCode,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            effectiveDate:effectiveDate,
                            compileTime:compileTime,
                            compactor:{code:compactor},
                            state:0,
                            kilnParameters:[]
                        }
                        data.kilnParameters = kilnParameters
                        console.log(data)
                        $.ajax({
                            url:home.urls.kilnOrder.add(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function(){
                                        kiln_Order.init()
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
                    ,btn2:function(index){
                        $("#editor_modal").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEvent:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                if($('.kiln_Order_checkbox:checked').length === 0) {
                    layer.msg('您还没有选中任何数据!',{
                        offset:['40%','55%'],
                        time:700
                    })
                }
                else {
                    layer.open({
                        type:1,
                        title:'批量删除',
                        content:"<h5 style='text-align: center;padding-top: 8px'>您确认要删除所有记录吗?</h5>",
                        area:['190px','130px'],
                        btn:['确认','取消'],
                        offset:['40%','55%'],
                        yes:function(index){
                            var kiln_Order_codes = []
                            $('.kiln_Order_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    kiln_Order_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(kiln_Order_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            kiln_Order.init()
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
                        } ,
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
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
                    kiln_Order.init()
                    $('#input_batch_num').val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var kilnCode = $('#input_batch_num').val()
                $.post(home.urls.kilnOrder.getByKilnCodeLikeByPage(), {
                    kilnCode: kilnCode
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#kiln_Order_table").children('tbody')
                    kiln_Order.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'kiln_Order_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.kilnOrder.getByKilnCodeLikeByPage(), {
                                    kilnCode: kilnCode,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#kiln_Order_table").children('tbody')
                                    kiln_Order.funcs.renderHandler($tbody, items)
                                    kiln_Order.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}