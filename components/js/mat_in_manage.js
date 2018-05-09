var mat_in_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        mat_in_manage.funcs.renderTable()
        /** 需要给刷新按钮和搜索按钮绑定点击事件 */
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.materialIn.getAllByPage(), {}, function (res) {
                var $tbody = $("#material_in_table").children('tbody')
                var items = res.data.content
                mat_in_manage.funcs.fillData1($("#model-li-select-48"),items)
                mat_in_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                mat_in_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'material_in_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            $.post(home.urls.materialIn.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#material_in_table").children('tbody')
                                mat_in_manage.funcs.renderHandler($tbody, items)
                                mat_in_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#material_in_page').css('padding-left', '37%')
            })



             // 追加刷新事件
             var refreshBtn = $('#model-li-hide-refresh-48');
             mat_in_manage.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件

             /** 追加搜索事件 */
           var searchBtn = $('#model-li-hide-search-48');
           mat_in_manage.funcs.bindSearchEventListener(searchBtn);
       
        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            console.log(items)
            items.forEach(function (e) {
                // $('#dep_checkAll').prop('checked', false)
                console.log(e.code)
                var content = (
                    "<tr>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.supplier ? e.supplier.name : null) + "</td>" +
                    "<td>" + (e.date) + "</td>" +
                    "<td>" + (e.creatTime) + "</td>" +
                    "<td>" + (e.createUser ? e.createUser.name : null) + "</td>" +
                    "<td><a href='#' class='detail' id='detail-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_in_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            mat_in_manage.funcs.bindDetailClick(detailBtns)
        }
        ,fillData1: function(select,items){
            console.log(items)
            select.empty()
            items.forEach(function (e) {
                console.log(e)
                select.append(
                    "<option>"+(e.supplier ? e.supplier.name : null)+"</option>" 
                )
            })     
            
        }
        ,fillData: function(table,items) {
            
            console.log(items)
            $("#batchNumber").text(items.batchNumber)
            $("#name").text(items.name)
            $("#productor").text(!items.supplier?null:items.supplier.name)
            $("#number").text(!items.number?'无':items.number)
            $("#date").text(items.date)
            $("#creatUser").text(items.createUser?items.createUser.name:'无')
            $("#creatTime").text(items.date)
            var godownEntries = items.godownEntries
            var $tbody = $('#down_table').children('tbody')
            $tbody.empty() //清空表格
            godownEntries.forEach(function(ele) {
                console.log(ele)
                $tbody.append(
                    "<tr>"+
                    " <td>"+(ele.code)+"</td>"+
                    "<td>"+(ele.batchNumber)+"</td>"+
                    "<td>"+(!ele.unit?'kg':ele.unit)+"</td>"+
                    "<td>"+(!ele.weight?0:ele.weight)+"</td>"
                )
            }) 
        }
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                console.log($(this).attr('id'))
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.materialIn.getAllByCode(), {
                    code: codeNumber
                   
                }, function (result) {
                    var items = result.data//获取数据
                //点击的时候需要弹出一个模态框
                mat_in_manage.funcs.fillData($("#detail_modal"),items)  //将获取的数据传到#detail_modal中
                layer.open({
                    type: 1,
                    title: '原料入库单',
                    content: $("#detail_modal"),
                    area: ['800px', '430px'],
                    btn: ['打印', '返回'],
                    offset: "auto",
                    closeBtn:0,
                    yes: function (index) {
                        //点击确定之后必须打印当前表单,推荐第三方插件 printthis.js todo
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        })
    }
        
        /** 全选逻辑 */
        , checkboxEventBinding: function () {
            var selectAllBox = $('#mat_in_checkAll')
            mat_in_manage.funcs.bindSelectAll(selectAllBox)
            var dep_checkboxes = $('.mat_in_checkbox')
            mat_in_manage.funcs.disselectAll(dep_checkboxes, selectAllBox)
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change').on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.mat_in_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        , disselectAll: function (dep_checkboxes, selectAllBox) {
            dep_checkboxes.off('change')
            dep_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.mat_in_checkbox:checked').length === $("#material_in_table").children('tbody').children('tr').length) {

                    selectAllBox.prop('checked', true)
                }
            })
        }
        /** $全选逻辑结束$ */

         /** $全选逻辑结束$ */
             /**
         * 刷新事件-已完成
         * @param refreshBtn
         */
        ,bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () { 
                
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    }) 
                    mat_in_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
               
            })
        }

      
      

       
          /** 搜索事件 */
          ,bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var status = $('#model-li-select-48').val()
                console.log(status)
                $.post(home.urls.materialIn.getAllByPage(), {
                    code: status,
                }, function (result) {
                    var items = result.data //获取数据
                    var status = $('#model-li-select-48').val()
                    const $tbody = $("#material_in_table").children('tbody')
                    mat_in_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'material_in_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.materialIn.getAllByPage(), {
                                    code: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var manage = result.data.content //获取数据
                                    const $tbody = $("#material_in_table").children('tbody')
                                    mat_in_manage.funcs.renderHandler($tbody, items)
                                    mat_in_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}