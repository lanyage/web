var bowl_abnormal = {
    init: function () {
        bowl_abnormal.funcs.renderTable()
        var out = $('#bowl_abnormal_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#bowl_abnormal_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.bowlAbnormal.getAllByPage(), {}, function (res) {
                var $tbody = $("#bowl_abnormal_table").children('tbody')
                var items = res.data.content
                //console.log(items)
               bowl_abnormal.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                bowl_abnormal.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'bowl_abnormal_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.bowlAbnormal.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#bowl_abnormal_table").children('tbody')
                                bowl_abnormal.funcs.renderHandler($tbody, items)
                                bowl_abnormal.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            bowl_abnormal.funcs.bindAddEvent($('#model_li_hide_add_135'))
            bowl_abnormal.funcs.bindDeleteEvent($('#model_li_hide_delete_135'))

            var refreshBtn = $('#model_li_hide_refresh_135');
            bowl_abnormal.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_135')
            bowl_abnormal.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.bowl_abnormal_checkbox:checked').length
            home.funcs.bindSelectAll($("#bowl_abnormal_checkAll"),$(".bowl_abnormal_checkbox"),checkedBoxLen,$("#bowl_abnormal_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        var i = 1
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='bowl_abnormal_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (new Date(e.date).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.dutyCode?e.dutyCode.name:' ') + "</td>" +
                    "<td>" + (new Date(e.time).Format('yyyy-MM-dd hh:mm:ss')) + "</td>" +
                    "<td>" + (e.bowlCode ? e.bowlCode : ' ') + "</td>" +
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
        })
        bowl_abnormal.funcs.bindDetailEventListener($('.detail'))
        bowl_abnormal.funcs.bindEditorEventListener($('.editor'))
        bowl_abnormal.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.bowl_abnormal_checkbox:checked').length
        home.funcs.bindSelectAll($("#bowl_abnormal_checkAll"),$(".bowl_abnormal_checkbox"),checkedBoxLen,$("bowl_abnormal_table"))
    }

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.bowlAbnormal.getById(),{
                    code:code
                },function (res) {
                    var items = res.data
                    $('#dutyCode').text(items.dutyCode?items.dutyCode.name:' ')
                    $('#Time').text(new Date(items.time).Format('yyyy-MM-dd hh:mm:ss'))
                    $('#bowlCode').text(items.bowlCode)
                    $('#top').text(items.top)
                    $('#bot').text(items.bot)
                    $('#total').text(items.total?items.total:' ')
                    $('#tare').text(items.tare?items.tare:' ')
                    $('#net').text(items.net)
                    $('#difference').text(items.difference?items.difference:' ')
                    $('#addWeight').text(items.addWeight?items.addWeight:' ')
                    $("#reduceWeight").text(items.reduceWeight)
                    $("#operator").text(items.operator?items.operator.name:' ')
                    $("#checker").text(items.checker?items.checker.name:' ')
                    $('#detail_time').text(new Date().Format('yyyy-MM-dd'))    
                    layer.open({
                            type: 1,
                            title: '装钵异常统计详情',
                            content: $("#bowl_abnormal_detail_modal"),
                            area: ['1100px', '250px'],
                            btn: ['返回'],
                            offset: "auto",
                            closeBtn: 0,
                            yes: function (index) {
                                $("#bowl_abnormal_detail_modal").css('display', 'none')
                                layer.close(index)
                            }
                        });
                })
             })
        },
        
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                var code = $(this).attr('id').substr(7)
                $.post(home.urls.bowlAbnormal.getById(),{
                    code:code
                },function (res) {
                    var items = res.data
                    //console.log(items)
                    $('#dutyCode1').empty()
                    
                    //$('#dutyCode1').val(items.dutyCode?items.dutyCode.code:' ')
                    $('#Time1').val(new Date(items.time).Format('yyyy-MM-dd hh:mm:ss'))
                    $('#bowlCode1').val(items.bowlCode)
                    $('#top1').val(items.top)
                    $('#bot1').val(items.bot)
                    $('#total1').val(items.total?items.total:' ')
                    $('#tare1').val(items.tare?items.tare:' ')
                    $('#net1').val(items.net)
                    $('#difference1').val(items.difference?items.difference:' ')
                    $('#addWeight1').val(items.addWeight?items.addWeight:' ')
                    $("#reduceWeight1").val(items.reduceWeight)
                    $("#operator1").append("<option value="+items.operator.code+">"+items.operator.name+"</option>")
                    $("#checker1").append("<option value="+items.checker.code+">"+items.checker.name+"</option>")
                    $('#editor_time').text(new Date().Format('yyyy-MM-dd'))   
                    if(items.dutyCode!=null){
                        $('#dutyCode1').append("<option value="+items.dutyCode.code+">"+items.dutyCode.name+"</option>")
                        $.get(servers.backup()+"duty/getAll",{ },function(result){
                            duty = result.data
                            duty.forEach(function(e){
                                 if(items.dutyCode.code!=e.code){
                                $("#dutyCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                            }
                            })                       
                        })
                    }else{
                        duty.forEach(function(e){
                            $("#dutyCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                        })
                    }
                    $.get(servers.backup()+"user/getAll",{ },function(result){
                        users = result.data
                        users.forEach(function(e){
                            if(items.operator.code!=users.code){
                                $("#operator1").append("<option value="+(e.code)+">"+e.name+"</option>"
                            )
                            }
                            if(items.checker.code!=users.code){
                                $("#checker1").append("<option value="+(e.code)+">"+e.name+"</option>"
                            )
                            }
                            
                        })
                    })
                 layer.open({
                     type:1,
                     title:'编辑装钵异常统计',
                     content:$("#bowl_abnormal_editor_modal"),
                     area: ['1200px', '250px'],
                     btn:['保存','提交','返回'],
                     offset:"auto",
                     closeBtn:0,
                     yes: function(index) {
                        $("#bowl_abnormal_editor_modal").css('display', 'none')
                         var date = items.date
                         var dutyCode = $('#dutyCode1').val()
                         var time = $('#Time1').val()
                         var bowlCode = $('#bowlCode1').val()
                         var top = $('#top1').val()
                         var bot = $('#bot1').val()
                         var total = $('#total1').val()
                         var tare = $('#tare1').val()
                         var net = $('#net1').val()
                         var difference = $('#difference1').val()
                         var addWeight = $('#addWeight1').val()
                         var reduceWeight = $('#reduceWeight1').val()
                         var operator = $('#operator1').val()
                         var checker = $('#checker1').val()
                         var editor_time = $('#editor_time').val()
                         $.post(home.urls.bowlAbnormal.update(),{
                            code:code,
                            date: date,
                            'dutyCode.code': dutyCode,
                            time: time,
                            bowlCode: bowlCode,
                            top: top,
                            bot: bot,
                            total: total,
                            tare: tare,
                            net: net,
                            difference: difference,
                            addWeight: addWeight,
                            reduceWeight: reduceWeight,
                            'operator.code': operator,
                            'checker.code': checker,
                            state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    bowl_abnormal.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                     }
                     ,btn2: function(index) {
                        $("#bowl_abnormal_editor_modal").css('display', 'none')
                        var date = items.date
                        var dutyCode = $('#dutyCode1').val()
                        var time = $('#Time1').val()
                        var bowlCode = $('#bowlCode1').val()
                        var top = $('#top1').val()
                        var bot = $('#bot1').val()
                        var total = $('#total1').val()
                        var tare = $('#tare1').val()
                        var net = $('#net1').val()
                        var difference = $('#difference1').val()
                        var addWeight = $('#addWeight1').val()
                        var reduceWeight = $('#reduceWeight1').val()
                        var operator = $('#operator1').val()
                        var checker = $('#checker1').val()
                        var editor_time = $('#editor_time').val()
                        $.post(home.urls.bowlAbnormal.update(),{
                           code:code,
                           date: date,
                           'dutyCode.code': dutyCode,
                           time: time,
                           bowlCode: bowlCode,
                           top: top,
                           bot: bot,
                           total: total,
                           tare: tare,
                           net: net,
                           difference: difference,
                           addWeight: addWeight,
                           reduceWeight: reduceWeight,
                           'operator.code': operator,
                           'checker.code': checker,
                           state:1
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                           if(result.code === 0) {
                               var time = setTimeout(function(){
                                   bowl_abnormal.init()
                                   clearTimeout(time)
                               },500)
                           }
                            layer.close(index)
                         })
                     }
                     ,btn3: function(index) {
                        $("#bowl_abnormal_editor_modal").css('display', 'none')
                        layer.close(index)
                     }
                 })
                })
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
                         $.post(home.urls.bowlAbnormal.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    bowl_abnormal.init()
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
                $('#dutyCode1').empty()
                $('#Time1').val('')
                $('#bowlCode1').val('')
                $('#top1').val('')
                $('#bot1').val('')
                $('#total1').val('')
                $('#tare1').val('')
                $('#net1').val('')
                $('#difference1').val('')
                $('#addWeight1').val('')
                $("#reduceWeight1").val('')
                $('#editor_time').text(new Date().Format('yyyy-MM-dd')) 
                duty.forEach(function(e){
                    $("#dutyCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                })
                $.get(servers.backup()+"user/getAll",{ },function(result){
                    users = result.data
                    users.forEach(function(e){
                        $("#operator1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                            )
                        $("#checker1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )     
                    })
                })  
                 layer.open({
                     type:1,
                     title:"新增断批异常统计",
                     content:$("#bowl_abnormal_editor_modal"),
                     area: ['1200px', '250px'],
                     btn:['提交','取消'],
                     offset:'auto',
                     closeBtn:0,
                     yes:function(index) {
                         $("#bowl_abnormal_editor_modal").css('display','none')
                         var date = new Date().Format('yyyy-MM-dd')
                         var dutyCode = $('#dutyCode1').val()
                         var time = new Date($('#Time1').val()).Format('yyyy-MM-dd hh:mm:ss')
                         var bowlCode = $('#bowlCode1').val()
                         var top = $('#top1').val()
                         var bot = $('#bot1').val()
                         var total = $('#total1').val()
                         var tare = $('#tare1').val()
                         var net = $('#net1').val()
                         var difference = $('#difference1').val()
                         var addWeight = $('#addWeight1').val()
                         var reduceWeight = $('#reduceWeight1').val()
                         var operator = $('#operator1').val()
                         var checker = $('#checker1').val()
                         var editor_time = $('#editor_time').val()
                         $.post(home.urls.bowlAbnormal.add(),{
                            date: date,
                            'dutyCode.code': dutyCode,
                            time: time,
                            bowlCode: bowlCode,
                            top: top,
                            bot: bot,
                            total: total,
                            tare: tare,
                            net: net,
                            difference: difference,
                            addWeight: addWeight,
                            reduceWeight: reduceWeight,
                            'operator.code': operator,
                            'checker.code': checker,
                            state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    bowl_abnormal.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                     }
                     ,btn2:function(index){
                         $("#bowl_abnormal_editor_modal").css('display','none')
                         layer.close(index)
                     }
                 })
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.bowl_abnormal_checkbox:checked').length === 0) {
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
                             var bowl_abnormal_codes = []
                             $('.bowl_abnormal_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                     bowl_abnormal_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.bowlAbnormal.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(bowl_abnormal_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            bowl_abnormal.init()
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
                     bowl_abnormal.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var bowlCode = $('#input_batch_num').val();
                 $.post(home.urls.bowlAbnormal.getByBowlCodeLikeByPage(), {
                    bowlCode: bowlCode
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#bowl_abnormal_table").children('tbody')
                     bowl_abnormal.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'bowl_abnormal_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.bowlAbnormal.getByBowlCodeLikeByPage(), {
                                    bowlCode: bowlCode,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#bowl_abnormalt_table").children('tbody')
                                     bowl_abnormal.funcs.renderHandler($tbody, items)
                                     bowl_abnormal.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}