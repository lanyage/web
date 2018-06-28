var management_handover = {
    init: function () {
        management_handover.funcs.renderTable()
        var out = $('#management_handover_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#management_handover').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '137.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.jobs.getAllByPage(), {page:0}, function (res) {
                console.log(res)
                var $tbody = $("#management_handover_table").children('tbody')
                var items = res.data.content
                management_handover.funcs.renderHandler($tbody, items)
                management_handover.pageSize = res.data.content.length 
                var page = res.data 
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'management_handover_page',
                    count: 10 * page.totalPages,
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.jobs.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content 
                                const $tbody = $("#management_handover_table").children('tbody')
                                management_handover.funcs.renderHandler($tbody, items)
                                management_handover.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            management_handover.funcs.bindAddEvent($('#model_li_hide_add_137'))
            management_handover.funcs.bindDeleteEvent($('#model_li_hide_delete_137'))

            var refreshBtn = $('#model_li_hide_refresh_137');
            management_handover.funcs.bindRefreshEventListener(refreshBtn);


            var checkedBoxLen = $('.management_handover_checkbox:checked').length
            home.funcs.bindSelectAll($("#management_handover_checkAll"),$(".management_handover_checkbox"),checkedBoxLen,$("#management_handover_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='management_handover_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.compilerCode ? e.compilerCode.name: '')+ "</td>" +
                    "<td>" + (e.compileTime ? new Date(e.compileTime).Format('yyyy-MM-dd hh:mm:ss'): '')+ "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
        })
        management_handover.funcs.bindDetailEventListener($('.detail'))
        management_handover.funcs.bindEditorEventListener($('.editor'))
        management_handover.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.management_handover_checkbox:checked').length
        home.funcs.bindSelectAll($("#management_handover_checkAll"),$(".management_handover_checkbox"),checkedBoxLen,$("management_handover_table"))
    }
    

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.jobs.getByCode(),{
                    code:code
                },function(result){
                    var items = result.data
                layer.open({
                    type: 1,
                    title: '新增岗位内容交接',
                    content: $("#jobsHandover"),
                    area: ['700px', '400px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#jobsHandover").css('display', 'none')
                        var handoverType = $("#handover_type").val()
                        var handoverContent = $("#handover_content").val()
                        var handoverStateType = $("#handover_statetype").val()
                        $.post(home.urls.jobsHandover.add(),{
                            'jobsCode.code':code,
                            'handoverType.code':handoverType,
                            'handoverContent.code':handoverContent,
                            'handoverStateType.code':handoverStateType,
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                            })
                            if(result.code===0){
                                var time = setTimeout(function(){
                                    management_handover.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#jobsHandover").css('display', 'none')
                        layer.close(index)
                    }
                });        
             }) 
        })   
        management_handover.funcs.add_line($("#button")) 
        },
        add_line:function(buttons){
            buttons.off('click').on('click',function(){
                $tbody = $("#jobsHandover_table").children('tbody')
                var length = $("#jobsHandover_table tbody tr").length + 1
                $(".jobs_code").empty()
                $(".handover_type").empty()
                $(".handover_content").empty()
                $(".handover_statetype").empty()
                $tbody.append(
                    "<tr class='newLine' id='row"+length+"'>"+
                    "<td>"+length+"</td>"+
                    "<td><select class='jobs_code'></select></td>"+
                    "<td><select class='handover_type'></select></td>"+
                    "<td><select class='handover_content'></select></td>"+
                    "<td><select class='handover_statetype'></select></td>"+
                    "<td><button class='delete' onclick='management_handover.funcs.delTab("+(length)+")' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                )
                $.get(servers.backup()+'jobs/getAllByPage',{},function(result){
                    var res1 = result.data.content
                    res1.forEach(function(e){
                        $(".jobs_code").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                    
                })  
                $.get(servers.backup()+'handoverType/getAll',{},function(result){
                    var res2 = result.data
                    res2.forEach(function(e){
                        $(".handover_type").append("<option value="+e.code+">"+e.name+"</option>")
                    })    
                })  
                $.get(servers.backup()+'handoverContent/getAll',{},function(result){
                    var res3 = result.data
                    res3.forEach(function(e){
                        $(".handover_content").append("<option value="+e.code+">"+e.name+"</option>")
                    }) 
                })  
                $.get(servers.backup()+'handoverStateType/getAll',{},function(result){
                    var res4 = result.data
                    res4.forEach(function(e){
                        $(".handover_statetype").append("<option value="+e.code+">"+e.code+"</option>")
                    }) 
                })  
            })
        }
        ,delTab:function(x){
            $("#row" +(x) + "").remove();
            //var count = $("#jobsHandover_table tr").length  
            var i = 1
            $(".newLine").each(function(){
                $(this).children('td').eq(0).text(i++)
            })
        }
         ,bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                 var code = $(this).attr('id').substr(7) 
                 $.post(home.urls.jobs.getByCode(),{
                     code:code
                 },function(result){
                    items = result.data
                    console.log(items)
                   // $("#compilerCode1").empty()
                    //$("#compilerCode1").append("<option value="+items.compilerCode.code+">"+items.compilerCode.name+"</option>")
                    $.get(servers.backup()+'user/getAll',{},function(result){
                        var user=result.data
                        user.forEach(function(e){
                           if(e.code!=items.compilerCode.code){
                                $("#compilerCode1").append("<option value="+e.code+">"+e.name+"</option>")
                           }
                        })
                    })
                layer.open({
                    type: 1,
                    title: '编辑岗位名称',
                    content: "<div id='addmodal'>"+
                    "<div style='text-align: center;padding-top: 10px;'>"+
                    "<p style='padding: 5px 0px 5px 0px;'>岗位名称:<input type='text' id='name1' value="+items.name+" /></p>"+
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;编制人:<select id='compilerCode1'><option value="+items.compilerCode.code+">"+items.compilerCode.name+"</option></select></p>"+
                    "</div>"+
                    "</div>",
                    area: ['300px', '200px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#management_handover_editor_modal").css('display', 'none')
                        var name = $("#name1").val()
                        var compilerCode = $("#compilerCode1").val()
                        $.post(home.urls.jobs.update(),{
                            code:code,
                            name:name,
                            'compilerCode.code':compilerCode
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     management_handover.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                     ,btn2: function(index) {
                        $("#management_handover_editor_modal").css('display', 'none')
                        layer.close(index)
                     }
                }); 
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
                         $.post(home.urls.jobs.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    management_handover.init()
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
                 $("#name").val('')
                 $("#compilerCode").empty()
                 $.get(servers.backup()+'user/getAll',{},function(result){
                     var user=result.data
                     user.forEach(function(e){
                         $("#compilerCode").append("<option value="+e.code+">"+e.name+"</option>")
                     })
                 })
                layer.open({
                    type: 1,
                    title: '新增岗位名称',
                    content: "<div id='addmodal'>"+
                    "<div style='text-align: center;padding-top: 10px;'>"+
                    "<p style='padding: 5px 0px 5px 0px;'>岗位名称:<input type='text' id='name' /></p>"+
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;编制人:<select id='compilerCode'></select></p>"+
                    "</div>"+
                    "</div>",
                    area: ['300px', '200px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#management_handover_editor_modal").css('display', 'none')
                        var name = $("#name").val()
                        var compilerCode = $("#compilerCode").val()
                        $.post(home.urls.jobs.add(),{
                            name:name,
                            'compilerCode.code':compilerCode
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     management_handover.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#management_handover_editor_modal").css('display','none')
                        layer.close(index)
                    }
                }); 
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.management_handover_checkbox:checked').length === 0) {
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
                             var management_handover_codes=[]
                             $('.management_handover_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    management_handover_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.jobs.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(management_handover_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            management_handover.init()
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
                     management_handover.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
    }
}