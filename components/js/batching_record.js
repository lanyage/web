var batching_record = {
    init: function () {
        batching_record.funcs.renderTable()
        var out = $('#batching_record_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#batching_record_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () 
        {
            $.post(home.urls.plateAlarm.getAllByPage(), {}, function (res) {
                var $tbody = $("#batching_record_table").children('tbody')
                var items = res.data.content
                //console.log(items)
              //  batching_record.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                batching_record.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'batching_record_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.plateAlarm.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                            
                                var items = result.data.content //获取数据
                                const $tbody = $("#batching_record_table").children('tbody')
                                batching_record.funcs.renderHandler($tbody, items)
                                batching_record.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            batching_record.funcs.bindDetailEventListener($('.detail'))
            batching_record.funcs.bindEditorEventListener($('.editor'))
            batching_record.funcs.bindDeleteEventListener($('.delete'))

            batching_record.funcs.bindAddEvent($('#model_li_hide_add_30'))
            batching_record.funcs.bindDeleteEvent($('#model_li_hide_delete_30'))

            var refreshBtn = $('#model_li_hide_refresh_30');
            batching_record.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_30')
            batching_record.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.batching_record_checkbox:checked').length
            home.funcs.bindSelectAll($("#batching_record_checkAll"),$(".batching_record_checkbox"),checkedBoxLen,$("#batching_record_table"))


        }
        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                layer.open({
                    type: 1,
                    title: '预烧记录详情',
                    content: $("#batching_record_detail_modal"),
                    area: ['1100px', '650px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#batching_record_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        ,bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                layer.open({
                    type:1,
                    title:'预烧记录详情',
                    content:$("#batching_record_detail_modal"),
                    area: ['1100px', '650px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                       $("#batching_record_detail_modal").css('display', 'none')
                       layer.close(index)
                    }
                    ,btn2: function(index) {
                       $("#batching_record_detail_modal").css('display', 'none')
                       layer.close(index)
                    }
                    ,btn3: function(index) {
                       $("#batching_record_detail_modal").css('display', 'none')
                       layer.close(index)
                    }
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
                        $.post(home.urls.productOut.deleteByCode(), {
                           code: Code
                       }, function (result) {
                           layer.msg(result.message, {
                               offset: ['40%', '55%'],
                               time: 700
                           })
                           if (result.code === 0) {
                               var time = setTimeout(function () {
                                   pro_out_manage.init()
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
                layer.open({
                    type:1,
                    title:"预烧记录详情",
                    content:$("#batching_record_detail_modal"),
                    area: ['1100px', '650px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {
                        $("#batching_record_detail_modal").css('display','none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#batching_record_detail_modal").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEvent:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                if($('.batching_record_checkbox:checked').length === 0) {
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
                            $('.batching_record_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    batching_record_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                               url: home.urls.productOut.deleteByCodeBatch(),
                               contentType: 'application/json',
                               data: JSON.stringify(batching_record_codes),
                               dataType: 'json',
                               type: 'post',
                               success: function (result) {
                                   if (result.code === 0) {
                                       var time = setTimeout(function () {
                                           batching_record.init()
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
                    batching_record.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        ,bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var auditStatus = $('#audit_name option:selected').val();
                //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                    status: auditStatus
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#batching_record_table").children('tbody')
                    batching_record.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'batching_record_page'
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
                                    const $tbody = $("#batching_record_table").children('tbody')
                                    batching_record.funcs.renderHandler($tbody, items)
                                    batching_record.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}
