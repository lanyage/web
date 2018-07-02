var presintering_record = {
    init: function () {
        presintering_record.funcs.renderTable()
        var out = $('#presintering_record_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#presintering_record_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () 
        {
            $.post(home.urls.presinteringRecord.getAllByPage(), {}, function (res) {
                var $tbody = $("#presintering_record_table").children('tbody')
                var items = res.data.content
                presintering_record.funcs.renderHandler($tbody, items)
                presintering_record.pageSize = res.data.content.length 
                var page = res.data 
                layui.laypage.render({
                    elem: 'presintering_record_page',
                    count: 10 * page.totalPages,
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.presinteringRecord.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content 
                                const $tbody = $("#presintering_record_table").children('tbody')
                                presintering_record.funcs.renderHandler($tbody, items)
                                presintering_record.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            presintering_record.funcs.bindAddEvent($('#model_li_hide_add_30'))
            presintering_record.funcs.bindDeleteEvent($('#model_li_hide_delete_30'))

            var refreshBtn = $('#model_li_hide_refresh_30');
            presintering_record.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_30')
            presintering_record.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.presintering_record_checkbox:checked').length
            home.funcs.bindSelectAll($("#presintering_record_checkAll"),$(".presintering_record_checkbox"),checkedBoxLen,$("#presintering_record_table"))


        },
         renderHandler: function ($tbody,items) {
             $tbody.empty() //清空表格
             items.forEach(function (e) {
                     var code = e.code
                     var content = (
                         "<tr>" +
                         "<td><input type='checkbox' class='presintering_record_checkbox' value='" + (e.code) + "'></td>" +
                         "<td>" + (e.code) + "</td>" +
                         "<td>" + (e.kilnCode?e.kilnCode:'') + "</td>" +
                         "<td>" + (e.sinteringProcess?e.sinteringProcess:'') + "</td>" +
                         "<td>" + e.batchNumber + "</td>" +
                         "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                         "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                         "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                         "</tr>"
                     )
                     $tbody.append(content)
         })
            presintering_record.funcs.bindDetailEventListener($('.detail'))
            presintering_record.funcs.bindEditorEventListener($('.editor'))
            presintering_record.funcs.bindDeleteEventListener($('.delete'))
         }
        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.presinteringRecord.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    $("#kilnCode").text(items.kilnCode)
                    $("#code").text(items.code)
                    $("#batchNumber").text(items.batchNumber)
                    $("#inportNumber1").text(items.inportNumber1)
                    $("#inportNumber2").text(items.inportNumber2)
                    $("#inportNumber3").text(items.inportNumber3)
                    $("#inportNumber4").text(items.inportNumber4)

                    $("#outportNumber1").text(items.outportNumber1)
                    $("#outportNumber2").text(items.outportNumber2)
                    $("#outportNumber3").text(items.outportNumber3)
                    $("#outportNumber4").text(items.outportNumber4)
                    
                    $("#newportNumber1").text(items.newportNumber1)
                    $("#newportNumber2").text(items.newportNumber2)
                    $("#newportNumber3").text(items.newportNumber3)
                    $("#newportNumber4").text(items.newportNumber4) 
                    
                    $("#abaportNumber1").text(items.abaportNumber1)
                    $("#abaportNumber2").text(items.abaportNumber2)
                    $("#abaportNumber3").text(items.abaportNumber3)
                    $("#abaportNumber4").text(items.abaportNumber4)

                    $("#infurnaceTime").text(items.infurnaceTime?new Date(items.infurnaceTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    $("#planTime").text(items.planTime?new Date(items.planTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    $("#outfurnaceTime").text(items.outfurnaceTime?new Date(items.outfurnaceTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    
                    $("#infurnaceOperator1").text(items.infurnaceOperator1?items.infurnaceOperator1.name:'')
                    $("#infurnaceOperator2").text(items.infurnaceOperator2?items.infurnaceOperator2.name:'')
                    $("#infurnaceOperator3").text(items.infurnaceOperator3?items.infurnaceOperator3.name:'')
                    $("#infurnaceOperator4").text(items.infurnaceOperator4?items.infurnaceOperator4.name:'')

                    $("#outfurnaceOperator1").text(items.outfurnaceOperator1?items.outfurnaceOperator1.name:'')
                    $("#outfurnaceOperator2").text(items.outfurnaceOperator2?items.outfurnaceOperator2.name:'')
                    $("#outfurnaceOperator3").text(items.outfurnaceOperator3?items.outfurnaceOperator3.name:'')
                    $("#outfurnaceOperator4").text(items.outfurnaceOperator4?items.outfurnaceOperator4.name:'')
                    
                    $("#assistant").text(items.assistant?items.assistant.name:'')
                })
                layer.open({
                    type: 1,
                    title: '配料记录详情',
                    content: $("#presintering_record_detail_modal"),
                    area: ['1250px', '450px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#presintering_record_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        ,bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                var code = $(this).attr('id').substr(7)
                $.post(home.urls.presinteringRecord.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    $("#infurnaceOperator11").empty()
                    $("#infurnaceOperator21").empty()
                    $("#infurnaceOperator31").empty()
                    $("#infurnaceOperator41").empty()

                    $("#outfurnaceOperator11").empty()
                    $("#outfurnaceOperator21").empty()
                    $("#outfurnaceOperator31").empty()
                    $("#outfurnaceOperator41").empty()
                    
                    $("input[name='process']").each(function(){
                        if($(this).val() == items.sinteringProcess){
                            $(this).prop('checked',true)
                        }
                    })

                    $("#kilnCode1").val(items.kilnCode)
                    $("#code1").val(items.code)
                    $("#batchNumber1").val(items.batchNumber)
                    $("#inportNumber11").val(items.inportNumber1)
                    $("#inportNumber21").val(items.inportNumber2)
                    $("#inportNumber31").val(items.inportNumber3)
                    $("#inportNumber41").val(items.inportNumber4)

                    $("#outportNumber11").val(items.outportNumber1)
                    $("#outportNumber21").val(items.outportNumber2)
                    $("#outportNumber31").val(items.outportNumber3)
                    $("#outportNumber41").val(items.outportNumber4)
                    
                    $("#newportNumber11").val(items.newportNumber1)
                    $("#newportNumber21").val(items.newportNumber2)
                    $("#newportNumber31").val(items.newportNumber3)
                    $("#newportNumber41").val(items.newportNumber4) 
                    
                    $("#abaportNumber11").val(items.abaportNumber1)
                    $("#abaportNumber21").val(items.abaportNumber2)
                    $("#abaportNumber31").val(items.abaportNumber3)
                    $("#abaportNumber41").val(items.abaportNumber4)

                    $("#infurnaceTime1").val(items.infurnaceTime?new Date(items.infurnaceTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    $("#planTime1").val(items.planTime?new Date(items.planTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    $("#outfurnaceTime1").val(items.outfurnaceTime?new Date(items.outfurnaceTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                
                    $("#assistant1").append("<option value="+items.assistant.code+">"+items.assistant.name+"</option>")
               
                    $("#infurnaceOperator11").append("<option value="+items.infurnaceOperator1.code+">"+items.infurnaceOperator1.name+"</option>")
                    $("#infurnaceOperator21").append("<option value="+items.infurnaceOperator2.code+">"+items.infurnaceOperator2.name+"</option>") 
                    $("#infurnaceOperator31").append("<option value="+items.infurnaceOperator3.code+">"+items.infurnaceOperator3.name+"</option>")
                    $("#infurnaceOperator41").append("<option value="+items.infurnaceOperator4.code+">"+items.infurnaceOperator4.name+"</option>")
                   
                    $("#outfurnaceOperator11").append("<option value="+items.outfurnaceOperator1.code+">"+items.outfurnaceOperator1.name+"</option>")
                    $("#outfurnaceOperator21").append("<option value="+items.outfurnaceOperator2.code+">"+items.outfurnaceOperator2.name+"</option>") 
                    $("#outfurnaceOperator31").append("<option value="+items.outfurnaceOperator3.code+">"+items.outfurnaceOperator3.name+"</option>")
                    $("#outfurnaceOperator41").append("<option value="+items.outfurnaceOperator4.code+">"+items.outfurnaceOperator4.name+"</option>")
                
                    $.get(servers.backup()+'user/getAll',{},function(result){
                        var user = result.data
                        user.forEach(function(e){
                            if(items.infurnaceOperator1.code!=e.code){
                                $("#infurnaceOperator11").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.infurnaceOperator2.code!=e.code){
                                $("#infurnaceOperator21").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.infurnaceOperator3.code!=e.code){
                                $("#infurnaceOperator31").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.infurnaceOperator4.code!=e.code){
                                $("#infurnaceOperator41").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.outfurnaceOperator1.code!=e.code){
                                $("#outfurnaceOperator11").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.outfurnaceOperator2.code!=e.code){
                                $("#outfurnaceOperator21").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.outfurnaceOperator3.code!=e.code){
                                $("#outfurnaceOperator31").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.outfurnaceOperator4.code!=e.code){
                                $("#outfurnaceOperator41").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.assistant.code!=e.code){
                                $("#assistant1").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            
                        })
                    })
                layer.open({
                    type:1,
                    title:'编辑预烧记录',
                    content:$("#presintering_record_edtior_modal"),
                    area: ['1250px', '450px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                       $("#presintering_record_edtior_modal").css('display', 'none')
                       var kilnCode = $("#kilnCode1").val()
                       var code = $("#code1").val()
                       var batchNumber = $("#batchNumber1").val()
                       var sinteringProcess = $('input:radio:checked').val()
                       var inportNumber1 = $("#inportNumber11").val()
                       var inportNumber2 = $("#inportNumber21").val()
                       var inportNumber3 = $("#inportNumber31").val()
                       var inportNumber4 = $("#inportNumber41").val()
   
                       var outportNumber1 = $("#outportNumber11").val()
                       var outportNumber2 = $("#outportNumber21").val()
                       var outportNumber3 = $("#outportNumber31").val()
                       var outportNumber4 = $("#outportNumber41").val()
                       
                       var newportNumber1 = $("#newportNumber11").val()
                       var newportNumber2 = $("#newportNumber21").val()
                       var newportNumber3 = $("#newportNumber31").val()
                       var newportNumber4 = $("#newportNumber41").val()
                       
                       var abaportNumber1 = $("#abaportNumber11").val()
                       var abaportNumber2 = $("#abaportNumber21").val()
                       var abaportNumber3 = $("#abaportNumber31").val()
                       var abaportNumber4 = $("#abaportNumber41").val()
   
                       var infurnaceTime = $("#infurnaceTime1").val()
                       var planTime = $("#planTime1").val()
                       var outfurnaceTime = $("#outfurnaceTime1").val()
                   
                       var assistant = $("#assistant1").val()
                       var infurnaceOperator1 = $("#infurnaceOperator11").val()
                       var infurnaceOperator2 = $("#infurnaceOperator21").val()
                       var infurnaceOperator3 = $("#infurnaceOperator31").val()
                       var infurnaceOperator4 = $("#infurnaceOperator41").val()
                  
                       var outfurnaceOperator1 = $("#outfurnaceOperator11").val()
                       var outfurnaceOperator2 = $("#outfurnaceOperator21").val()
                       var outfurnaceOperator3 = $("#outfurnaceOperator31").val()
                       var outfurnaceOperator4 = $("#outfurnaceOperator41").val()
                      
                       
                       $.post(home.urls.presinteringRecord.update(),{
                           code:code,
                           kilnCode:kilnCode,
                           batchNumber:batchNumber,
                           sinteringProcess:sinteringProcess,
                           inportNumber1:inportNumber1,
                           inportNumber2:inportNumber2,
                           inportNumber3:inportNumber3,
                           inportNumber4:inportNumber4,

                           outportNumber1:outportNumber1,
                           outportNumber2:outportNumber2,
                           outportNumber3:outportNumber3,
                           outportNumber4:outportNumber4,

                           newportNumber1:newportNumber1,
                           newportNumber2:newportNumber2,
                           newportNumber3:newportNumber3,
                           newportNumber4:newportNumber4,

                           abaportNumber1:abaportNumber1,
                           abaportNumber2:abaportNumber2,
                           abaportNumber3:abaportNumber3,
                           abaportNumber4:abaportNumber4,

                           infurnaceTime:infurnaceTime,
                           planTime:planTime,
                           outfurnaceTime:outfurnaceTime,
                          
                           'assistant.code':assistant,
                           'infurnaceOperator1.code':infurnaceOperator1,
                           'infurnaceOperator2.code':infurnaceOperator2,
                           'infurnaceOperator3.code':infurnaceOperator3,
                           'infurnaceOperator4.code':infurnaceOperator4,

                           'outfurnaceOperator1.code':outfurnaceOperator1,
                           'outfurnaceOperator2.code':outfurnaceOperator2,
                           'outfurnaceOperator3.code':outfurnaceOperator3,
                           'outfurnaceOperator4.code':outfurnaceOperator4,
                           status:0,
                       },function(result){
                           layer.msg(result.message,{
                               offset:['40%','55%'],
                               time:700
                           })
                           if(result.code===0){
                               var time = setTimeout(function(){
                                   presintering_record.init()
                                   clearTimeout(time)
                               },500)
                           }
                       })
                       layer.close(index)
                    }
                    ,btn2: function(index) {
                       $("#presintering_record_edtior_modal").css('display', 'none')
                       var kilnCode = $("#kilnCode1").val()
                       var code = $("#code1").val()
                       var batchNumber = $("#batchNumber1").val()
                       var sinteringProcess = $('input:radio:checked').val()
                       var inportNumber1 = $("#inportNumber11").val()
                       var inportNumber2 = $("#inportNumber21").val()
                       var inportNumber3 = $("#inportNumber31").val()
                       var inportNumber4 = $("#inportNumber41").val()
   
                       var outportNumber1 = $("#outportNumber11").val()
                       var outportNumber2 = $("#outportNumber21").val()
                       var outportNumber3 = $("#outportNumber31").val()
                       var outportNumber4 = $("#outportNumber41").val()
                       
                       var newportNumber1 = $("#newportNumber11").val()
                       var newportNumber2 = $("#newportNumber21").val()
                       var newportNumber3 = $("#newportNumber31").val()
                       var newportNumber4 = $("#newportNumber41").val()
                       
                       var abaportNumber1 = $("#abaportNumber11").val()
                       var abaportNumber2 = $("#abaportNumber21").val()
                       var abaportNumber3 = $("#abaportNumber31").val()
                       var abaportNumber4 = $("#abaportNumber41").val()
   
                       var infurnaceTime = $("#infurnaceTime1").val()
                       var planTime = $("#planTime1").val()
                       var outfurnaceTime = $("#outfurnaceTime1").val()
                   
                       var assistant = $("#assistant1").val()
                       var infurnaceOperator1 = $("#infurnaceOperator11").val()
                       var infurnaceOperator2 = $("#infurnaceOperator21").val()
                       var infurnaceOperator3 = $("#infurnaceOperator31").val()
                       var infurnaceOperator4 = $("#infurnaceOperator41").val()
                  
                       var outfurnaceOperator1 = $("#outfurnaceOperator11").val()
                       var outfurnaceOperator2 = $("#outfurnaceOperator21").val()
                       var outfurnaceOperator3 = $("#outfurnaceOperator31").val()
                       var outfurnaceOperator4 = $("#outfurnaceOperator41").val()
                      
                       
                       $.post(home.urls.presinteringRecord.update(),{
                           code:code,
                           kilnCode:kilnCode,
                           batchNumber:batchNumber,
                           sinteringProcess:sinteringProcess,
                           inportNumber1:inportNumber1,
                           inportNumber2:inportNumber2,
                           inportNumber3:inportNumber3,
                           inportNumber4:inportNumber4,

                           outportNumber1:outportNumber1,
                           outportNumber2:outportNumber2,
                           outportNumber3:outportNumber3,
                           outportNumber4:outportNumber4,

                           newportNumber1:newportNumber1,
                           newportNumber2:newportNumber2,
                           newportNumber3:newportNumber3,
                           newportNumber4:newportNumber4,

                           abaportNumber1:abaportNumber1,
                           abaportNumber2:abaportNumber2,
                           abaportNumber3:abaportNumber3,
                           abaportNumber4:abaportNumber4,

                           infurnaceTime:infurnaceTime,
                           planTime:planTime,
                           outfurnaceTime:outfurnaceTime,
                          
                           'assistant.code':assistant,
                           'infurnaceOperator1.code':infurnaceOperator1,
                           'infurnaceOperator2.code':infurnaceOperator2,
                           'infurnaceOperator3.code':infurnaceOperator3,
                           'infurnaceOperator4.code':infurnaceOperator4,

                           'outfurnaceOperator1.code':outfurnaceOperator1,
                           'outfurnaceOperator2.code':outfurnaceOperator2,
                           'outfurnaceOperator3.code':outfurnaceOperator3,
                           'outfurnaceOperator4.code':outfurnaceOperator4,
                           status:1,
                       },function(result){
                           layer.msg(result.message,{
                               offset:['40%','55%'],
                               time:700
                           })
                           if(result.code===0){
                               var time = setTimeout(function(){
                                   presintering_record.init()
                                   clearTimeout(time)
                               },500)
                           }
                       })
                       layer.close(index)
                    }
                    ,btn3: function(index) {
                       $("#presintering_record_edtior_modal").css('display', 'none')
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
                        $.post(home.urls.presinteringRecord.deleteByCode(),{
                            code:Code
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code===0){
                                var time = setTimeout(function(){
                                    presintering_record.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index)
                    },
                    btn2: function (index) {
                       layer.close(index)
                   }
                })         
            })
        }
        ,bindAddEvent:function(addBtn){
            addBtn.off('click').on('click',function(){
                $("#assistant1").empty()
                $("#infurnaceOperator11").empty()
                $("#infurnaceOperator21").empty()
                $("#infurnaceOperator31").empty()
                $("#infurnaceOperator41").empty()    

                $("#outfurnaceOperator11").empty()
                $("#outfurnaceOperator21").empty()
                $("#outfurnaceOperator31").empty()
                $("#outfurnaceOperator41").empty()    

                $("#kilnCode1").val('')
                $("#code1").val('')
                $("#batchNumber1").val('')
                $("#inportNumber11").val('')
                $("#inportNumber21").val('')
                $("#inportNumber31").val('')
                $("#inportNumber41").val('')

                $("#outportNumber11").val('')
                $("#outportNumber21").val('')
                $("#outportNumber31").val('')
                $("#outportNumber41").val('')
                    
                $("#newportNumber11").val('')
                $("#newportNumber21").val('')
                $("#newportNumber31").val('')
                $("#newportNumber41").val('') 
                    
                $("#abaportNumber11").val('')
                $("#abaportNumber21").val('')
                $("#abaportNumber31").val('')
                $("#abaportNumber41").val('')

                $("#infurnaceTime1").val('')
                $("#planTime1").val('')
                $("#outfurnaceTime1").val('')
                $.get(servers.backup()+'user/getAll',{},function(result){
                    var user = result.data
                    user.forEach(function(e){
                            $("#infurnaceOperator11").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#infurnaceOperator21").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#infurnaceOperator31").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#infurnaceOperator41").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#outfurnaceOperator11").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#outfurnaceOperator21").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#outfurnaceOperator31").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#outfurnaceOperator41").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#assistant1").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                    
                layer.open({
                    type:1,
                    title:"新增预烧记录",
                    content:$("#presintering_record_edtior_modal"),
                    area: ['1250px', '450px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {
                        $("#presintering_record_edtior_modal").css('display','none')
                        var kilnCode = $("#kilnCode1").val()
                       var code = $("#code1").val()
                       var batchNumber = $("#batchNumber1").val()
                       var sinteringProcess = $('input:radio:checked').val()
                       var inportNumber1 = $("#inportNumber11").val()
                       var inportNumber2 = $("#inportNumber21").val()
                       var inportNumber3 = $("#inportNumber31").val()
                       var inportNumber4 = $("#inportNumber41").val()
   
                       var outportNumber1 = $("#outportNumber11").val()
                       var outportNumber2 = $("#outportNumber21").val()
                       var outportNumber3 = $("#outportNumber31").val()
                       var outportNumber4 = $("#outportNumber41").val()
                       
                       var newportNumber1 = $("#newportNumber11").val()
                       var newportNumber2 = $("#newportNumber21").val()
                       var newportNumber3 = $("#newportNumber31").val()
                       var newportNumber4 = $("#newportNumber41").val()
                       
                       var abaportNumber1 = $("#abaportNumber11").val()
                       var abaportNumber2 = $("#abaportNumber21").val()
                       var abaportNumber3 = $("#abaportNumber31").val()
                       var abaportNumber4 = $("#abaportNumber41").val()
   
                       var infurnaceTime = $("#infurnaceTime1").val()
                       var planTime = $("#planTime1").val()
                       var outfurnaceTime = $("#outfurnaceTime1").val()
                   
                       var assistant = $("#assistant1").val()
                       var infurnaceOperator1 = $("#infurnaceOperator11").val()
                       var infurnaceOperator2 = $("#infurnaceOperator21").val()
                       var infurnaceOperator3 = $("#infurnaceOperator31").val()
                       var infurnaceOperator4 = $("#infurnaceOperator41").val()
                  
                       var outfurnaceOperator1 = $("#outfurnaceOperator11").val()
                       var outfurnaceOperator2 = $("#outfurnaceOperator21").val()
                       var outfurnaceOperator3 = $("#outfurnaceOperator31").val()
                       var outfurnaceOperator4 = $("#outfurnaceOperator41").val()
                      
                       
                       $.post(home.urls.presinteringRecord.add(),{
                          // code:code,
                           kilnCode:kilnCode,
                           batchNumber:batchNumber,
                           sinteringProcess:sinteringProcess,
                           inportNumber1:inportNumber1,
                           inportNumber2:inportNumber2,
                           inportNumber3:inportNumber3,
                           inportNumber4:inportNumber4,

                           outportNumber1:outportNumber1,
                           outportNumber2:outportNumber2,
                           outportNumber3:outportNumber3,
                           outportNumber4:outportNumber4,

                           newportNumber1:newportNumber1,
                           newportNumber2:newportNumber2,
                           newportNumber3:newportNumber3,
                           newportNumber4:newportNumber4,

                           abaportNumber1:abaportNumber1,
                           abaportNumber2:abaportNumber2,
                           abaportNumber3:abaportNumber3,
                           abaportNumber4:abaportNumber4,

                           infurnaceTime:infurnaceTime,
                           planTime:planTime,
                           outfurnaceTime:outfurnaceTime,
                          
                           'assistant.code':assistant,
                           'infurnaceOperator1.code':infurnaceOperator1,
                           'infurnaceOperator2.code':infurnaceOperator2,
                           'infurnaceOperator3.code':infurnaceOperator3,
                           'infurnaceOperator4.code':infurnaceOperator4,

                           'outfurnaceOperator1.code':outfurnaceOperator1,
                           'outfurnaceOperator2.code':outfurnaceOperator2,
                           'outfurnaceOperator3.code':outfurnaceOperator3,
                           'outfurnaceOperator4.code':outfurnaceOperator4,
                           status:0,
                       },function(result){
                           layer.msg(result.message,{
                               offset:['40%','55%'],
                               time:700
                           })
                           if(result.code===0){
                               var time = setTimeout(function(){
                                   presintering_record.init()
                                   clearTimeout(time)
                               },500)
                           }
                       })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#presintering_record_edtior_modal").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEvent:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                if($('.presintering_record_checkbox:checked').length === 0) {
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
                            var presintering_record_codes=[]
                            $('.presintering_record_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    presintering_record_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                               url: home.urls.presinteringRecord.deleteByIdBatch(),
                               contentType: 'application/json',
                               data: JSON.stringify(presintering_record_codes),
                               dataType: 'json',
                               type: 'post',
                               success: function (result) {
                                   if (result.code === 0) {
                                       var time = setTimeout(function () {
                                           presintering_record.init()
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
                    presintering_record.init()
                    $("#input_batch_num").val('')
                    $("#kiln_code").val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        ,bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var batchNumber =  $("#input_batch_num").val()
                var kilnCode = $("#kiln_code").val()
                console.log(batchNumber)
                $.post(home.urls.presinteringRecord.getByKilnCodeAndBatchNumberByPage(), {
                    batchNumber: batchNumber,
                    kilnCode:kilnCode
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#presintering_record_table").children('tbody')
                    presintering_record.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'presintering_record_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.presinteringRecord.getByKilnCodeAndBatchNumberByPage(), {
                                    batchNumber: batchNumber,
                                    kilnCode:kilnCode,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    const $tbody = $("#presintering_record_table").children('tbody')
                                    presintering_record.funcs.renderHandler($tbody, items)
                                    presintering_record.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}
