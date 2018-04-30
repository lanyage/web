var material_publish = {
    init : function() {
        material_publish.funcs.renderTable();

        //display and show
        var presoma_table = $('#presoma_table');   //取到金驰622表的id
        var lithium_table = $('#lithium_table');   //取到天齐碳酸锂的id号
        if (material_publish.material_type === 0) {
            presoma_table.show();
            lithium_table.hide();
        }
        else {
            presoma_table.hide();
            lithium_table.show();
        }

        var out = $('#_24page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('_24page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    , material_type: 0   // choose material type: 0-personma, 1-lithium
    , pageSize: 0
    , currId: null  // current chosen Id
    , funcs: {
        renderTable: function () {
            /** 获取所有记录 */
            var status = $('#status').val()
            if (material_publish.material_type === 0) {
                //通过状态编码查询-分页
                $.post(home.urls.rawPresoma.getAllByStatusCodeByPage(), {
                    page: 0,
                    statusCode: status
                }, function (result) {
                    // display and hide
                    var presoma_table = $('#presoma_table');
                    var lithium_table = $('#lithium_table');
                    presoma_table.show();
                    lithium_table.hide();

                    var presomas = result.data.content
                    const $tbody = $("#presoma_table").children('tbody')
                    material_publish.funcs.renderHandlerPresoma($tbody, presomas)
                    material_publish.pageSize = result.data.content.length

                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: '_24page'    
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj, first) {
                            if (!first) {
                                console.log('不是首次,可以执行')
                                var status = $('#status').val()
                                $.post(home.urls.rawPresoma.getAllByStatusCodeByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit,
                                    statusCode: status
                                }, function (result) {
                                    var presomas = result.data.content //获取数据
                                    const $tbody = $("#presoma_table").children('tbody')
                                    material_publish.funcs.renderHandlerPresoma($tbody, presomas)
                                    material_publish.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            }
            else {
                // display and show
                $.post(home.urls.rawLithium.getAllByStatusCodeByPage(), {
                    page: 0,
                    statusCode: status
                }, function (result) {
                    var presoma_table = $('#presoma_table');
                    var lithium_table = $('#lithium_table');
                    presoma_table.hide();
                    lithium_table.show();

                    var lithiums = result.data.content
                    const $tbody = $("#lithium_table").children('tbody')
                    material_publish.funcs.renderHandlerLithium($tbody, lithiums)
                    material_publish.pageSize = result.data.content.length

                    
                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem:  '_24page'
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj, first) {
                            if (!first) {
                                console.log('不是首次,可以执行')
                                var status = $('#status').val()
                                $.post(home.urls.rawLithium.getAllByStatusCodeByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit,
                                    statusCode: status
                                }, function (result) {
                                    var lithiums = result.data.content //获取数据
                                    const $tbody = $("#lithium_table").children('tbody')
                                    material_publish.funcs.renderHandler($tbody, lithiums)
                                    material_publish.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            }

            // 追加刷新事件
            var refreshBtn = $('#model-li-hide-refresh-24');
            $("#raw_batch_number_input").val('');  //刷新时清除搜索框中的文本
            material_publish.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件
            // 追加搜索事件
            var searchBtn = $('#model-li-hide-search-24');
            material_publish.funcs.bindSearchEventListener(searchBtn);
            // 追加状态下拉框事件
            var statusSelect = $('#model-li-hide-select-24');
            material_publish.funcs.bindSelectEventListener(statusSelect);
            // 追加类别选择事件
            var presomaSelect = $('#select-presoma');
            var lithiumSelect = $('#select-lithium');
            material_publish.funcs.selectPresoma(presomaSelect);
            material_publish.funcs.selectLithium(lithiumSelect);
        },

         /**
         * 金弛622前驱体选择标签事件
         * @param presomaSelect
         */
        selectPresoma: function (presomaSelect) {
            presomaSelect.off('click');
            presomaSelect.on('click', function () {
                console.log("presomaSelect");
                var select_presoma = $('#select-presoma');
                var select_lithium = $('#select-lithium');
                select_presoma.html("金弛622");
                select_presoma.removeClass("label_not_selected").addClass("label_selected");
                select_lithium.html("<a href='#'>天齐碳酸锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                material_publish.material_type = 0;
                material_publish.funcs.renderTable();
            })
        },

        /**
         * 碳酸锂选择标签事件
         * @param lithiumSelect
         */
        selectLithium: function (lithiumSelect) {
            lithiumSelect.off('click');
            lithiumSelect.on('click', function () {
                console.log("lithiumSelect");
                var select_presoma = $('#select-presoma');
                var select_lithium = $('#select-lithium');
                select_presoma.html("<a href='#'>金弛622</a>");
                select_presoma.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("天齐碳酸锂");
                select_lithium.removeClass("label_not_selected").addClass("label_selected");
                material_publish.material_type = 1;
                material_publish.funcs.renderTable();
            })
        },

          /**
         * 渲染presoma-已完成
         * @param $tbody
         * @param presomas
         */
        renderHandlerPresoma: function ($tbody, presomas) {
            $tbody.empty()
            presomas.forEach(function (e) {
                var status = $('#status').val()
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='dep_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.publisher ? e.publisher.name : null) + "</td>" +
                    "<td>" + (new Date(e.testDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.insideCode) + "</td>" +
                    "<td>" + (new Date(e.productDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.number) + "</td>" +
                    "<td>" + (e.judge ? e.judge.name : null) + "</td>" +

                    "<td>" + e.c1 + "</td>" +
                    "<td>" + e.c2 + "</td>" +
                    "<td>" + e.c3 + "</td>" +
                    "<td>" + e.c4 + "</td>" +
                    "<td>" + e.c7 + "</td>" +
                    "<td>" + e.c10 + "</td>" +
                    "<td>" + e.c16 + "</td>" +
                    "<td>" + e.c17 + "</td>" +
                    "<td>" + e.c18 + "</td>" +
                    "<td>" + e.c19 + "</td>" +
                    "<td>" + e.c20 + "</td>" +
                    "<td>" + e.c21 + "</td>" +
                    "<td>" + e.c22 + "</td>" +
                    "<td>" + e.c23 + "</td>" +
                    "<td>" + e.c24 + "</td>" +
                    "<td>" + e.c25 + "</td>" +
                    "</tr>"
                )
            })
        },

        /**
         * 渲染lituium-已完成
         * @param $tbody
         * @param lithiums
         */
        renderHandlerLithium: function ($tbody, lithiums) {
            $tbody.empty()
            lithiums.forEach(function (e) {
                var status = $('#status').val()
                $tbody.append(
                    "<tr >" +

                    "<td><input type='checkbox' class='dep_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.publisher ? e.publisher.name : null) + "</td>" +
                    "<td>" + (new Date(e.testDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +

                    "<td>" + (new Date(e.productDate).Format('yyyy/MM/dd')) + "</td>" +    
                    "<td>" + (e.judge ? e.judge.name : null) + "</td>" +
                    "<td>" + (e.number) + "</td>" +
                    "<td>" + e.c1 + "</td>" +
                    "<td>" + e.c2 + "</td>" +
                    "<td>" + e.c3 + "</td>" +
                    "<td>" + e.c4 + "</td>" +
                    "<td>" + e.c5 + "</td>" +
                    "<td>" + e.c6 + "</td>" +
                    "<td>" + e.c7 + "</td>" +
                    "<td>" + e.c8 + "</td>" +
                    "<td>" + e.c9 + "</td>" +
                    "<td>" + e.c10 + "</td>" +
                    "<td>" + e.c11 + "</td>" +
                    "<td>" + e.c12 + "</td>" +
                    "<td>" + e.c13 + "</td>" +
                    "<td>" + e.c14 + "</td>" +
                    "<td>" + e.c15 + "</td>" +
                    "<td>" + e.c16 + "</td>" +
                    "<td>" + e.c17 + "</td>" +
                    "</tr>"
                )
            })
        },

         /**
         * 刷新事件-已完成
         * @param refreshBtn
         */
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () { 
                
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    }) 
                    material_publish.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
               
            })
        },

        /**
         * 搜索事件-已完成
         * @param searchBtn
         */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var raw_batch_number = $('#raw_batch_number_input').val()   //读取搜索的value值
                console.log(raw_batch_number)
                var status = $('#status').val()  //读取选择框的值
                $.post(material_publish.material_type === 0 ? home.urls.rawPresoma.getByLikeBatchNumberByPage() : home.urls.rawLithium.getByLikeBatchNumberByPage(), {
                    batchNumber: raw_batch_number,   //厂家批号
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var raws = result.data.content //获取数据
                    var status = $('#status').val()
                    if (material_publish.material_type === 0) {
                        const $tbody = $("#presoma_table").children('tbody')
                        material_publish.funcs.renderHandlerPresoma($tbody, raws)
                    }
                    else {
                        const $tbody = $("#lithium_table").children('tbody')
                        material_publish.funcs.renderHandlerLithium($tbody, raws)
                    }
                    layui.laypage.render({
                        elem: '_24page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(material_publish.material_type === 0 ? home.urls.rawPresoma.getByLikeBatchNumberByPage() : home.urls.rawLithium.getByLikeBatchNumberByPage(), {
                                    batchNumber: raw_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var raws = result.data.content //获取数据
                                    if (material_publish.material_type === 0) {
                                        const $tbody = $("#presoma_table").children('tbody')
                                        material_publish.funcs.renderHandlerPresoma($tbody, raws)
                                    }
                                    else {
                                        const $tbody = $("#lithium_table").children('tbody')
                                        material_publish.funcs.renderHandlerLithium($tbody, raws)
                                    }
                                    material_publish.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

         /**
         * 监听状态下拉选框-已完成
         * @param statusSelect
         */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                material_publish.funcs.renderTable()
            })
        },

    }
}
