var product_in_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        product_in_manage.funcs.renderTable()
       
        /** 需要给刷新按钮和搜索按钮绑定点击事件 */
        /** 将分页居中 */
        var out = $('#product_in_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_in_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    
    },

funcs: {
    renderTable: function () {
        $.post(home.urls.productIn.getAllByPage(), {}, function (res) {
            var $tbody = $("#product_in_table").children('tbody')
            var items = res.data.content
            console.log(items)
            product_in_manage.funcs.renderHandler($tbody, items)
            /** 渲染表格结束之后 */
            product_in_manage.pageSize = res.data.content.length //该页的记录数
            var page = res.data //分页json
            /** 分页信息 */
            layui.laypage.render({
                elem: 'product_in_page'
                , count: 10 * page.totalPages//数据总数
                /** 页面变化后的逻辑 */
                , jump: function (obj, first) {
                    if (!first) {
                        console.log('不是首次,可以执行')
                        $.post(home.urls.productIn.getAllByPage(), {
                            page: obj.curr - 1,
                            size: obj.limit
                        }, function (result) {
                            var items = result.data.content //获取数据
                            const $tbody = $("#product_in_table").children('tbody')
                            product_in_manage.funcs.renderHandler($tbody, items)
                            product_in_manage.pageSize = result.data.content.length
                        })
                    }
                }
            })
            $('#product_in_page').css('padding-left', '37%')
        })

         // 追加刷新事件

         var refreshBtn = $('#model-li-hide-refresh-49');
         product_in_manage.funcs.bindRefreshEventListener(refreshBtn);

       /**   追加搜索事件*/
       var searchBtn = $('#model-li-hide-search-49');
       product_in_manage.funcs.bindSearchEventListener(searchBtn); 
   
    },

    renderHandler: function ($tbody, items) {
       // $tbody.empty() //清空表格
        console.log(items)
        items.forEach(function (e) {
            // $('#dep_checkAll').prop('checked', false)
            console.log(e.code)
            var content = (
                "<tr>" +
                "<td>" + (e.code) + "</td>" +
                "<td>" + (e.batchNumber) + "</td>" +
                "<td>" + (e.department ? e.department.name : null) + "</td>" +
                "<td>" + (e.payTime) + "</td>" +
                "<td>" + (e.status) + "</td>" +
                "<td><a href='#' class='detail' id='detail-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                "</tr>"
            )
            $tbody.append(content)
        })
        // /** 绑定全选事件 */
        // mat_in_manage.funcs.checkboxEventBinding()
        /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
        var detailBtns = $(".detail")
        product_in_manage.funcs.bindDetailClick(detailBtns)
    },

     bindDetailClick: function (detailBtns) {
        detailBtns.off('click').on('click', function () {
            console.log(1)
         console.log($(this).attr('id'))
           var _selfBtn = $(this)
           var codeNumber = _selfBtn.attr('id').substr(7)
         $.post(home.urls.productIn.getByCode(),{
               code:codeNumber
           },function(result) {
               var items = result.data  //获取数  /** */
           
            //点击的时候需要弹出一个模态框
           //product_in_manage.funcs.fillData($("#detail_modal"),items)  //将获取的数据传到#detail_modal中
            layer.open({
                type: 1,
                title: '成品入库详情',
                content: $("#detail_modal"),
                area: ['800px', '430px'],
                btn: [' 返回'],
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
  
       },

    
    /** 刷新事件 */
    bindRefreshEventListener: function (refreshBtn) {
        refreshBtn.off('click')
        refreshBtn.on('click', function () {
            console.log('AAAAAAAAAAAAAAAAAAAAAAaa')
            var index = layer.load(2, {offset: ['40%', '58%']});
            var time = setTimeout(function () {
                layer.msg('刷新成功', {
                    offset: ['40%', '55%'],
                    time: 700
                })
                product_in_manage.init()
                layer.close(index)
                clearTimeout(time)
            }, 200)
        })
    },

    fillData: function(table,items) {
            
        //  console.log(items)
          $("#batchNumber").text(items.batchNumber?items.batchNumber:'无')
          $("#model").text(items.model?items.model:'null')
          $("#department").text(!items.department?null:items.department.name)
          $("#weight").text(items.weight)
          $("#payer").text(items.payer)
          $("#godowner").text(items.godowner)
          $("#payTime").text(items.payTime)
          $("#godownTime").text(items.godownTime)
         /** $("#batchNumber").text('12345')
          $("#model").text('1')
          $("#department").text('部门')
          $("#weight").text('22')
          $("#payer").text('张安')
          $("#godowner").text('李四')
          $("#payTime").text('2017-10-20')
          $("#godownTime").text('2018-01-01')*/
          var productGodown = items.productGodown
          var $tbody = $('#down_table').children('tbody')
          $tbody.empty() //清空表格
          godownEntries.forEach(function(ele) {
           //   console.log(ele)
              $tbody.append(
                  "<tr>"+
                  " <td>"+(ele.code)+"</td>"+
                  "<td>"+(ele.batchNumber)+"</td>"+
                  "<td>"+(!ele.unit?'kg':ele.unit)+"</td>"+
                  "<td>"+(!ele.weight?0:ele.weight)+"</td>"+
                  " <td>"+(ele.status)+"</td>"
              )
          }) 
      },

          /** 搜索事件 */
          bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var statusVal = $('#model-li-hide-select-49').val()
                console.log(statusVal)
                $.post(home.urls.productIn.getByStatusByPage(), {
                    status: statusVal,
                }, function (result) {
                    var page = result.data
                    var items = result.data.content //获取数据
                 //   console.log(items)
                    var code = $('#model-li-hide-select-49').val()
                    const $tbody = $("#product_in_table").children('tbody')
                    product_in_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'product_in_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productIn.getByStatusByPage(), {
                                    status: statusVal,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                   // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#product_in_table").children('tbody')
                                    product_in_manage.funcs.renderHandler($tbody, items)
                                    product_in_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

}
}