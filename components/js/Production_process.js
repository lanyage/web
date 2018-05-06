var Production_process = {
    
    init:function(){

        Production_process.funcs.renderTable();
        Production_process.funcs.hideTable();

        var out = $('#_25page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#_25page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    , process_type: 0   // choose material type: 0-premix, 1-size, 2-lithium, 3-buckle
    , pageSize: 0
    , currId: null  // current chosen Id

    ,funcs : {

         /**
         * 页面渲染-已完成
         */
        renderTable: function () {
            Production_process.funcs.hideTable();
            console.log(Production_process.process_type);
            var status = $('#status').val()
            // POST
            $.post(Production_process.funcs.chooseUrl(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var process = result.data.content;
                var $tbody = $(Production_process.funcs.chooseTable()).children('tbody');
                Production_process.pageSize = result.data.content.length;
                Production_process.funcs.chooseHandler($tbody, process);

                var page = result.data;
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: '_25page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行');
                            var status = $('#status').val();
                            $.post(Production_process.funcs.chooseUrl(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var process = result.data.content;//获取数据
                                var $tbody = $(Production_process.funcs.chooseTable()).children('tbody');
                                Production_process.pageSize = result.data.content.length;
                                Production_process.funcs.chooseHandler($tbody, process);
                            })
                        }
                    }
                })
            });

            // 追加刷新事件
            Production_process.funcs.bindRefreshEventListener($('#model-li-hide-refresh-25'));//追加刷新事件
            // 追加搜索事件
            Production_process.funcs.bindSearchEventListener($('#model-li-hide-search-25'));
            // 追加状态下拉框事件
            Production_process.funcs.bindSelectEventListener($('#model-li-hide-select-25'));
            // 追加类别选择事件
            Production_process.funcs.selectPremix($('#select-premix'));
            Production_process.funcs.selectSize($('#select-size'));
            Production_process.funcs.selectLithium($('#select-lithium'));
            Production_process.funcs.selectBuckle($('#select-buckle'));
        },

          /**
         * 四个选择标签响应函数-已完成
         */
        selectPremix: function (premixSelect) {
            premixSelect.off('click');
            premixSelect.on('click', function () {
                console.log("premixSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("预混");
                select_premix.removeClass("label_not_selected").addClass("label_selected");
                select_size.html("<a href='#'>粉碎粒度</a>");
                select_size.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("<a href='#'>粉碎总锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                select_buckle.html("<a href='#'>粉碎SSA</a>");
                select_buckle.removeClass("label_selected").addClass("label_not_selected");
                Production_process.process_type = 0;
                Production_process.funcs.renderTable();
            })
        },
        selectSize: function (sizeSelect) {
            sizeSelect.off('click');
            sizeSelect.on('click', function () {
                console.log("sizeSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("<a href='#'>预混</a>");
                select_premix.removeClass("label_selected").addClass("label_not_selected");
                select_size.html("粉碎粒度");
                select_size.removeClass("label_not_selected").addClass("label_selected");
                select_lithium.html("<a href='#'>粉碎总锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                select_buckle.html("<a href='#'>粉碎SSA</a>");
                select_buckle.removeClass("label_selected").addClass("label_not_selected");
                Production_process.process_type = 1;
                Production_process.funcs.renderTable();
            })
        },
        selectLithium: function (lithiumSelect) {
            lithiumSelect.off('click');
            lithiumSelect.on('click', function () {
                console.log("lithiumSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("<a href='#'>预混</a>");
                select_premix.removeClass("label_selected").addClass("label_not_selected");
                select_size.html("<a href='#'>粉碎粒度</a>");
                select_size.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("粉碎总锂");
                select_lithium.removeClass("label_not_selected").addClass("label_selected");
                select_buckle.html("<a href='#'>粉碎SSA</a>");
                select_buckle.removeClass("label_selected").addClass("label_not_selected");
                Production_process.process_type = 2;
                Production_process.funcs.renderTable();
            })
        },
        selectBuckle: function (buckleSelect) {
            buckleSelect.off('click');
            buckleSelect.on('click', function () {
                console.log("premixSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("<a href='#'>预混</a>");
                select_premix.removeClass("label_selected").addClass("label_not_selected");
                select_size.html("<a href='#'>粉碎粒度</a>");
                select_size.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("<a href='#'>粉碎总锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                select_buckle.html("粉碎SSA");
                select_buckle.removeClass("label_not_selected").addClass("label_selected");
                Production_process.process_type = 3;
                Production_process.funcs.renderTable();
            })
        },

        /**
         * 四个表格渲染函数-需要修改
         * @param $tbody
         */
        renderHandlerPremix: function ($tbody, premix) {
            $tbody.empty();
            premix.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                    "<td style='color:black'>"+ e.operation +"</td>"+
                    "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                    "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy/MM/dd'))  +"</td>"+
                    "<td style='color:black'>"+ e.batchNumber +"</td>"+
                    "<td style='color:black'></td>"+
                    "<td style='color:black'>"+e.lithiumSoluble +"</td>"+
                    "<td style='color:black'>"+ e.supplier +"</td>"+
                    "<td style='color:black'>"+ e.pc1 +"</td>"+
                    "<td style='color:black'>"+ e.pc2 +"</td>"+
                    "<td style='color:black'>"+ e.pc3 +"</td>"+
                    "<td style='color:black'>"+ e.pc4 +"</td>"+
                    "<td style='color:black'>"+ e.pc5 +"</td>"+
                    "<td style='color:black'>"+ e.pc6 +"</td>"+
                    "<td style='color:black'>"+ e.pc7 +"</td>"+
                    "<td style='color:black'></td>"+
                    "</tr>"
                )
            });
        },
        renderHandlerSize: function ($tbody, size) {
            $tbody.empty();
            size.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                    "<td style='color:black'>"+ e.operation +"</td>"+
                        "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                        "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy/MM/dd'))  +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ e.furnaceNum +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                        "<td style='color:black'>"+ e.pc4 +"</td>"+
                        "<td style='color:black'>"+ e.pc5 +"</td>"+
                        "<td style='color:black'>"+ e.pc6 +"</td>"+
                        "<td style='color:black'>"+ e.pc7 +"</td>"+
                        "<td style='color:black'>"+ e.pc8 +"</td>"+
                        "<td style='color:black'>"+ e.pc9 +"</td>"+
                        "<td style='color:black'>"+ e.pc10 +"</td>"+
                        "<td style='color:black'>"+ e.pc10 +"</td>"+
                    "</tr>"
                )
            });
        },
        renderHandlerLithium: function ($tbody, lithium) {
            $tbody.empty();
            lithium.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                       "<td style='color:black'>"+ e.operation +"</td>"+
                       "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                       "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy/MM/dd'))  +"</td>"+
                       "<td style='color:black'>"+ e.batchNumber +"</td>"+
                       "<td style='color:black'>"+ e.pc1 +"</td>"+
                       "<td style='color:black'>"+ e.pc2 +"</td>"+
                       "<td style='color:black'>"+ e.pc3 +"</td>"+
                       "<td></td>"+
                       "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy/MM/dd'))  +"</td>"+
                       "<td style='color:black'>"+ e.batchNumber +"</td>"+
                       "<td style='color:black'>"+ e.pc1 +"</td>"+
                       "<td style='color:black'>"+ e.pc2 +"</td>"+
                       "<td style='color:black'>"+ e.pc3 +"</td>"+
                    "</tr>"
                )
            });
        },
        renderHandlerBuckle: function ($tbody, buckle) {
            $tbody.empty();
            buckle.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='process-audit-" + (e.code) + "'>" +
                    "<td style='color:black'>"+ e.operation +"</td>"+
                        "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                        "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy/MM/dd'))  +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ e.furnaceNum +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                    "</tr>"
                )
            });
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
                    Production_process.init()
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
                var process_batch_number = $('#product_batch_number_input').val()
                console.log(process_batch_number)
                var status = $('#status').val()
                $.post(Production_process.funcs.chooseUrlSearch(), {
                    batchNumber: process_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var process = result.data.content //获取数据
                    var status = $('#status').val()
                    const $tbody = $(Production_process.funcs.chooseTable()).children('tbody')
                    Production_process.funcs.chooseHandler($tbody, process)
                    layui.laypage.render({
                        elem: '_25page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(Production_process.funcs.chooseUrlSearch(), {
                                    batchNumber: process_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var process = result.data.content //获取数据
                                    const $tbody = $(Production_process.funcs.chooseTable()).children('tbody')
                                    Production_process.funcs.chooseHandler($tbody, process)
                                    Production_process.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

         /**
         * 隐藏/显示表格
         */
        hideTable: function () {
            var premix_table = $('#premix_table');
            var size_table = $('#size_table');
            var lithium_table = $('#lithium_table');
            var buckle_table = $('#buckle_table');
            switch (Production_process.process_type) {
                case 0:
                    premix_table.show();
                    size_table.hide();
                    lithium_table.hide();
                    buckle_table.hide();
                    break;
                case 1:
                    premix_table.hide();
                    size_table.show();
                    lithium_table.hide();
                    buckle_table.hide();
                    break;
                case 2:
                    premix_table.hide();
                    size_table.hide();
                    lithium_table.show();
                    buckle_table.hide();
                    break;
                case 3:
                    premix_table.hide();
                    size_table.hide();
                    lithium_table.hide();
                    buckle_table.show();
                    break;
            }
        },


        chooseUrl: function () {
            switch (Production_process.process_type) {
                case 0:
                    return home.urls.processPremix.getAllByStatusCodeByPage();
                case 1:
                    return home.urls.processSize.getAllByStatusCodeByPage();
                case 2:
                    return home.urls.processLithium.getAllByStatusCodeByPage();
                case 3:
                    return home.urls.processBuckle.getAllByStatusCodeByPage();
            }
        },

         /**
         * 更新表格
         * @returns {string}
         */
        chooseTable: function () {
            switch (Production_process.process_type) {
                case 0:
                    return "#premix_table";
                case 1:
                    return "#size_table";
                case 2:
                    return "#lithium_table";
                case 3:
                    return "#buckle_table";
            }
        },

        /**
         * 监听状态下拉选框-已完成
         * @param statusSelect
         */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                Production_process.funcs.renderTable()
            })
        },

        chooseUrlSearch: function () {
            switch (Production_process.process_type) {
                case 0:
                    return home.urls.processPremix.getByLikeBatchNumberByPage();
                case 1:
                    return home.urls.processSize.getByLikeBatchNumberByPage();
                case 2:
                    return home.urls.processLithium.getByLikeBatchNumberByPage();
                case 3:
                    return home.urls.processBuckle.getByLikeBatchNumberByPage();
            }
        },

        chooseHandler: function ($tbody, process) {
            switch (Production_process.process_type) {
                case 0:
                    Production_process.funcs.renderHandlerPremix($tbody, process);
                    break;
                case 1:
                    Production_process.funcs.renderHandlerSize($tbody, process);
                    break;
                case 2:
                    Production_process.funcs.renderHandlerLithium($tbody, process);
                    break;
                case 3:
                    Production_process.funcs.renderHandlerBuckle($tbody, process);
                    break;
            }
        }
       
    }
}