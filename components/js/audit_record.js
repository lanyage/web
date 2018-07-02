var audit_record = {
    init: function () {
        audit_record.funcs.renderTable()
        var out = $('#audit_record_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#audit_record_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.audit.getAllByPage(), {}, function (res) {
                var $tbody = $("#audit_record_table").children('tbody')
                var items = res.data.content
                //console.log(items)
               audit_record.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                audit_record.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'audit_record_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.audit.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#audit_record_table").children('tbody')
                                audit_record.funcs.renderHandler($tbody, items)
                                audit_record.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            audit_record.funcs.bindAddEvent($('#model_li_hide_add_28'))
            audit_record.funcs.bindDeleteEvent($('#model_li_hide_delete_28'))

            var refreshBtn = $('#model_li_hide_refresh_28');
            audit_record.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_28')
            audit_record.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.audit_record_checkbox:checked').length
            home.funcs.bindSelectAll($("#audit_record_checkAll"),$(".audit_record_checkbox"),checkedBoxLen,$("#audit_record_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        var i = 1
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='audit_record_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.equipmentCode ? e.equipmentCode.name : ' ') + "</td>" +
                    "<td>" + (new Date(e.auditTime).Format('yyyy-MM-dd hh:mm:ss')) + "</td>" +
                    "<td>" + (e.dutyCode?e.dutyCode.name:' ') + "</td>" +
                    "<td>" + (e.confirm) + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
            //console.log(e.confirm)
            if(e.confirm === 1){
                $("#editor-"+(code)+"").removeClass("editor").addClass("disableHref")
               // $("#editor-"+(code)+"").parent('td')
                $("#delete-"+(code)+"").removeClass("delete").addClass("disableHref")
               // $("#delete-"+(code)+"").parent('td').addClass("disableHref")
            }
        })
        audit_record.funcs.bindDetailEventListener($('.detail'))
        audit_record.funcs.bindEditorEventListener($('.editor'))
        audit_record.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.audit_record_checkbox:checked').length
        home.funcs.bindSelectAll($("#audit_record_checkAll"),$(".audit_record_checkbox"),checkedBoxLen,$("audit_record_table"))
    }

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.audit.getByCode(),{
                    code:code
                },function (res) {
                    var items = res.data
                    $('#dutyCode').text(items.dutyCode?items.dutyCode.name:' ')
                    $('#auditorTime').text(new Date(items.auditTime).Format('yyyy-MM-dd hh:mm:ss'))
                    $('#equipmentCode').text(items.equipmentCode? items.equipmentCode.name : ' ')
                    $('#leftUp').text(items.leftUp)
                    $('#rightUp').text(items.rightUp)
                    $('#center').text(items.center)
                    $('#leftDown').text(items.leftDown)
                    $('#rightDown').text(items.rightDown)
                    $('#judgement').text(items.judgment)
                    $('#confirm').text(items.confirm)
                    $('#leftDown').text(items.leftDown)
                    $('#auditorCode').text(items.auditorCode?items.auditorCode.name:' ')
                    $('#confirmCode').text(items.confirmorCode?items.confirmorCode.name:' ')
                    $("#confirmTime").text(new Date(items.confirmTime).Format("yyyy-MM-dd hh:mm:ss"))
                        layer.open({
                            type: 1,
                            title: '核称记录详情',
                            content: $("#detail_modal"),
                            area: ['450px', '580px'],
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
        },
        
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                var code = $(this).attr('id').substr(7)
                $.post(home.urls.audit.getByCode(),{
                    code:code
                },function (res) {
                    var items = res.data
                   // $('#dutyCode1').val(items.dutyCode?items.dutyCode.code:' ')
                    $('#auditorTime1').val(new Date(items.auditTime).Format('yyyy-MM-dd hh:mm:ss'))
                   // $('#equipmentCode1').val(items.equipmentCode?items.equipmentCode.name:'')
                    $('#leftUp1').val(items.leftUp)
                    $('#rightUp1').val(items.rightUp)
                    $('#center1').val(items.center)
                    $('#leftDown1').val(items.leftDown)
                    $('#rightDown1').val(items.rightDown)
                    $('#judgement1').val(items.judgment)
                    $('#confirm1').val(items.confirm)
                    $('#leftDown1').val(items.leftDown)
                    $("#confirmTime1").val(new Date(items.confirmTime).Format("yyyy-MM-dd hh:mm:ss"))
                    $('#dutyCode1').append("<option value="+items.dutyCode.code+">"+items.dutyCode.name+"</option>")
                    $('#equipmentCode1').append("<option value="+items.equipmentCode.code+">"+items.equipmentCode.name+"</option>")

                    $.get(servers.backup()+"duty/getAll",{},function(result){
                        var duty = result.data
                        duty.forEach(function(e){
                            if(e.code!=items.dutyCode.code){
                                 $("#dutyCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                            }
                        })
                    })
                    $.get(servers.backup()+"electronicBalance/getAll",{},function(result){
                       var duty = result.data
                       duty.forEach(function(e){
                        if(e.code!=items.equipmentCode.code){
                            $("#equipmentCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                        }
                       })
                   })

                    if(items.auditorCode!=null){
                         $('#auditorCode1').append("<option value="+items.auditorCode.code+">"+items.auditorCode.name+"</option>")
                         $.get(servers.backup()+"user/getAll",{ },function(result){
                            var users = result.data
                            users.forEach(function(e){
                                if(items.auditorCode.code!=users.code){
                                    $("#auditorCode1").append(
                                    "<option value="+(e.code)+">"+e.name+"</option>"
                                )
                                }
                            })
                        })
                    }else{
                        $.get(servers.backup()+"user/getAll",{ },function(result){
                            var users = result.data
                            users.forEach(function(e){
                                    $("#auditorCode1").append(
                                    "<option value="+(e.code)+">"+e.name+"</option>"
                                )
                            })
                        })
                    }

                    if(items.confirmCode!=null){
                        $('#confirmCode1').append("<option value="+items.confirmCode.code+">"+items.confirmCode.name+"</option>")
                        $.get(servers.backup()+"user/getAll",{ },function(result){
                           var users = result.data
                           users.forEach(function(e){
                               if(items.confirmCode.code!=users.code){
                                   $("#confirmCode1").append(
                                   "<option value="+(e.code)+">"+e.name+"</option>"
                               )
                               }
                           })
                       })
                   }else{
                       $.get(servers.backup()+"user/getAll",{ },function(result){
                           var users = result.data
                           users.forEach(function(e){
                                   $("#confirmCode1").append(
                                   "<option value="+(e.code)+">"+e.name+"</option>"
                               )
                           })
                       })
                   }
                   
                 layer.open({
                     type:1,
                     title:'编辑核称记录',
                     content:$("#editor_modal"),
                     area: ['450px', '580px'],
                     btn:['保存','提交','返回'],
                     offset:"auto",
                     closeBtn:0,
                     yes: function(index) {
                        $("#editor_modal").css('display', 'none')
                         var dutyCode = $('#dutyCode1').val()
                         var auditorTime = new Date($('#auditorTime1').val())
                         var equipmentCode = $('#equipmentCode1').val()
                         var leftUp = $('#leftUp1').val()
                         var rightUp = $('#rightUp1').val()
                         var center = $('#center1').val()
                         var leftDown = $('#leftDown1').val()
                         var rightDown = $('#rightDown1').val()
                         var judgement = $('#judgement1').val()
                         var confirm = $('#confirm1').val()
                         var confirmTime = new Date($('#confirmTime1').val())
                         var auditorCode = $('#auditorCode1').val()
                         var confirmCode = $('#confirmCode1').val()
                         $.post(home.urls.audit.update(),{
                            code:code,
                            //auditTime: auditorTime,
                            'dutyCode.code': dutyCode,
                            'equipmentCode.code': equipmentCode,
                            leftUp: leftUp,
                            rightUp: rightUp,
                            center: center,
                            leftDown: leftDown,
                            rightDown: rightDown,
                            judgment: judgement,
                            confirm: 0,
                            //confirmTime:confirmTime,
                            'auditorCode.code': auditorCode,
                            'confirmorCode.code': confirmCode,
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    audit_record.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                     }
                     ,btn2: function(index) {
                        $("#editor_modal").css('display', 'none')
                        var dutyCode = $('#dutyCode1').val()
                         var auditorTime = new Date($('#auditorTime1').val())
                         var equipmentCode = $('#equipmentCode1').val()
                         var leftUp = $('#leftUp1').val()
                         var rightUp = $('#rightUp1').val()
                         var center = $('#center1').val()
                         var leftDown = $('#leftDown1').val()
                         var rightDown = $('#rightDown1').val()
                         var judgement = $('#judgement1').val()
                         var confirm = $('#confirm1').val()
                         var confirmTime = new Date($('#confirmTime1').val())
                         var auditorCode = $('#auditorCode1').val()
                         var confirmCode = $('#confirmCode1').val()
                         $.post(home.urls.audit.update(),{
                            code:code,
                            auditTime: auditorTime,
                            'dutyCode.code': dutyCode,
                            'equipmentCode.code': equipmentCode,
                            leftUp: leftUp,
                            rightUp: rightUp,
                            center: center,
                            leftDown: leftDown,
                            rightDown: rightDown,
                            judgment: judgement,
                            confirm: 1,
                            confirmTime:confirmTime,
                            'auditorCode.code': auditorCode,
                            'confirmorCode.code': confirmCode,
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    audit_record.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                     }
                     ,btn3: function(index) {
                        $("#editor_modal").css('display', 'none')
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
                         $.post(home.urls.audit.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    audit_record.init()
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
                 $('#auditorTime1').val('')
                 $('#equipmentCode1').empty()
                 $('#leftUp1').val('')
                 $('#rightUp1').val('')
                 $('#center1').val('')
                 $('#leftDown1').val('')
                 $('#rightDown1').val('')
                 $('#judgement1').val('')
                 $('#confirm1').val('')
                 $('#leftDown1').val('')
                 $("#confirmTime1").val('')
                 $('#auditorCode1').empty()
                 $('#confirmCode1').empty()
                 $.get(servers.backup()+"duty/getAll",{},function(result){
                     var duty = result.data
                     duty.forEach(function(e){
                        $("#dutyCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                     })
                 })
                 $.get(servers.backup()+"electronicBalance/getAll",{},function(result){
                    var duty = result.data
                    duty.forEach(function(e){
                       $("#equipmentCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                    })
                })
                 $.get(servers.backup()+"user/getAll",{ },function(result){
                    var users = result.data
                    users.forEach(function(e){
                            $("#auditorCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                            $("#confirmCode1").append("<option value="+(e.code)+">"+e.name+"</option>")
                    })
                })
                 layer.open({
                     type:1,
                     title:"新增核称记录",
                     content:$("#editor_modal"),
                     area: ['450px', '580px'],
                     btn:['提交','取消'],
                     offset:'auto',
                     closeBtn:0,
                     yes:function(index) {
                         $("#editor_modal").css('display','none')
                         var dutyCode = $('#dutyCode1').val()
                         //var auditorTime = $('#auditorTime1').val()
                         var equipmentCode = $('#equipmentCode1').val()
                         var leftUp = $('#leftUp1').val()
                         var rightUp = $('#rightUp1').val()
                         var center = $('#center1').val()
                         var leftDown = $('#leftDown1').val()
                         var rightDown = $('#rightDown1').val()
                         var judgement = $('#judgement1').val()
                         var confirm = $('#confirm1').val()
                         var confirmTime = new Date().getTime()
                         var auditorCode = $('#auditorCode1').val()
                         var confirmCode = $('#confirmCode1').val()
                         $.post(home.urls.audit.add(),{
                            //code:code,
                            //auditorTime: auditorTime,
                            'dutyCode.code': dutyCode,
                            'equipmentCode.code': equipmentCode,
                            leftUp: leftUp,
                            rightUp: rightUp,
                            center: center,
                            leftDown: leftDown,
                            rightDown: rightDown,
                            judgment: judgement,
                            confirm: 0,
                            //confirmTime:confirmTime,
                            'auditorCode.code': auditorCode,
                            'confirmorCode.code': confirmCode,
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    audit_record.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })    
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
                 if($('.audit_record_checkbox:checked').length === 0) {
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
                             var audit_record_codes = []
                             $('.audit_record_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                     audit_record_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.audit.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(audit_record_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            audit_record.init()
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
                     audit_record.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var equipmentCode = $('#input_batch_num').val();
                 $.post(home.urls.audit.getByBatchNumberLikeByPage(), {
                    equipmentCode: equipmentCode
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#audit_record_table").children('tbody')
                     audit_record.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'audit_record_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.audit.getByBatchNumberLikeByPage(), {
                                    equipmentCode
                                    : equipmentCode,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#audit_recordt_table").children('tbody')
                                     audit_record.funcs.renderHandler($tbody, items)
                                     audit_record.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}