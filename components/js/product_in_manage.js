var product_in_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        product_in_manage.funcs.renderTable()
        product_in_manage.funcs.getPage()
        /** 需要给刷新按钮和搜索按钮绑定点击事件 */
    },

funcs: {
    renderTable: function () {
        $.post(home.urls.productIn.getAllByPage(), {}, function (res) {
            var $tbody = $("#product_inlib_table").children('tbody')
            var items = res.data.content
           
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
                            const $tbody = $("#product_inlib_table").children('tbody')
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
         mat_in_manage.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件

         /** 追加搜索事件 */
       var searchBtn = $('#model-li-hide-search-49');
       mat_in_manage.funcs.bindSearchEventListener(searchBtn);
   
    }
}
}