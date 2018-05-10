var material_publish = {
    init : function() {
        material_publish.funcs.renderTable();

        //display and show
        //var arr=new Array();
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
                    $('_24page').css('padding-left', '37%')
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
                                    material_publish.funcs.renderHandlerLithium($tbody, lithiums)
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
                    "<tr id='material-publish-" + (e.code) + "'>" +
                    "<td>" + material_publish.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + material_publish.funcs.getPublisher(e.publisher) + "</td>" +
                    "<td>" + material_publish.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.insideCode + "</td>" +
                    "<td>" + material_publish.funcs.formatDate(e.productDate) + "</td>" +
                    "<td>" + e.number + "</td>" +
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
            var auditBtns = $('.audit')
            var detailBtns = $('.detail')
            material_publish.funcs.bindPublishEventListener(auditBtns)
            material_publish.funcs.bindDetailEventListener(detailBtns)
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
                    "<tr id='material-publish-" + (e.code) + "'>" +
                    "<td>" + material_publish.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + material_publish.funcs.getPublisher(e.publisher) + "</td>" +
                    "<td>" + material_publish.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +

                    "<td>" + material_publish.funcs.formatDate(e.productDate) + "</td>" +
                    "<td>" + (e.judge ? e.judge.name : null) + "</td>" +
                    "<td>" + e.number + "</td>" +
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
            var auditBtns = $('.audit')
            var detailBtns = $('.detail')
            material_publish.funcs.bindPublishEventListener(auditBtns)
            material_publish.funcs.bindDetailEventListener(detailBtns)
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

      /**
         * 审核按钮-已完成
         * @param auditBtns
         */
        bindPublishEventListener: function (auditBtns) {
            auditBtns.off('click')
            auditBtns.on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(6)
                material_publish.currId = "material-publish-" + code
                $.post( material_publish.material_type === 0 ? home.urls.rawPresoma.getByCode() : home.urls.rawLithium.getByCode(), {code: code}, function (result) {
                    console.log("发布" + code)
                    var raw = result.data
                    layer.open({
                        type: 1,
                        content:  material_publish.funcs.getData(raw),
                        area: ['550px', '700px'],
                        btn: ['确认发布', '取消'],
                        offset: 'auto', // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function () {
                            console.log("提交发布" + code);
                            $.post( material_publish.material_type === 0 ? home.urls.rawPresoma.updatePublishByCode() : home.urls.rawLithium.updatePublishByCode(), {
                                code: code,
                                publisherCode: home.user.code,     // 此处需要读取用户编号
                                statusCode: 2
                            }, function (result) {
                                if (result.code == 0) {
                                    // 成功
                                    console.log("发布成功" + code);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "审核成功" + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            material_publish.funcs.renderTable();
                                        }
                                    });
                                } else {
                                    // 失败
                                    console.log("发布失败" + result.message);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "失败<br>" + result.message + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            material_publish.funcs.renderTable();
                                        }
                                    });
                                }
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                    material_publish.funcs.bindLeftBtn($('#model-li-hide-left-24'));
                    material_publish.funcs.bindRightBtn($('#model-li-hide-right-24'));
                })
            })
        },

        /**
         * 查看按钮事件-已完成
         * @param detailBtns
         */
        bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(6)
                material_publish.currId = "material-publish-" + code
                $.post(material_publish.material_type === 0 ? home.urls.rawPresoma.getByCode() : home.urls.rawLithium.getByCode(), {code: code}, function (result) {
                    console.log("查看" + code)
                    var raw = result.data
                    layer.open({
                        type: 1,
                        content:material_publish.funcs.getData(raw),
                        area: ['550px', '700px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    })
                    material_publish.funcs.bindLeftBtn($('#model-li-hide-left-24'));
                    material_publish.funcs.bindRightBtn($('#model-li-hide-right-24'));
                })
            })
        },


        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得审核人*/
        getPublisher: function (e) {
            if (e == null) {
                return "无";
            }
            else {
                return e.name;
            }
        },

        /**
         * 操作图标
         * @param status    状态码
         * @param code      产品编码
         * @returns {string}
         */
        getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        },

        getData: function (raw) {
            var data =
                "<div id='auditModal'>" +
                "<div class='arrow_div_left'>" +
                "<span id='model-li-hide-left-24'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                "</div>" +
                "<div class='arrow_div_right'>" +
                "<span id='model-li-hide-right-24'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                "</div>";
            if (material_publish.material_type === 0) {
                data += material_publish.funcs.getTablePresoma(raw);
            }
            else {
                data += material_publish.funcs.getTableLithium(raw);
            }
            return data;
        },

        /**
         * presoma表格-已完成
         * @param presoma
         * @returns {string}
         */
        getTablePresoma: function (presoma) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + presoma.batchNumber + "</td> <td>" + material_publish.funcs.formatDate(presoma.testDate) + "</td> <td>" + presoma.number + "</td> <td>" + (presoma.judge?presoma.judge.name:'无') + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + presoma.status.name + "</td> <td>" + material_publish.funcs.getPublisher(presoma.auditor) + "</td> <td></td> <td></td></tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>控制采购标准-2016-11-21</td> <td>2017.07.01采购标准</td> <td>" + presoma.batchNumber + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>振实密度(g/cm3)</td> <td>&ge;2.0</td> <td></td> <td>" + presoma.c1 + "</td></tr>" +
                "<tr> <td colspan='2'>水分(ppm)</td> <td>&le;1.0</td> <td></td> <td>" + presoma.c2 + "</td></tr>" +
                "<tr> <td colspan='2'>SSA(m2/g)</td> <td>4.0~7.0</td> <td></td> <td>" + presoma.c3 + "</td></tr>" +
                "<tr> <td colspan='2'>pH值</td> <td>7.0~9.0</td> <td></td> <td>" + presoma.c4 + "</td></tr>" +
                "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>&ge;2.5</td> <td></td> <td></td> <td>" + presoma.c5 + "</td></tr>" +
                "<tr> <td>D10</td> <td>&ge;5.0</td> <td></td> <td>" + presoma.c6 + "</td></tr>" +
                "<tr> <td>D50</td> <td>9.8~10.5</td> <td></td> <td>" + presoma.c7 + "</td></tr>" +
                "<tr> <td>D90</td> <td>&le;22</td> <td></td> <td>" + presoma.c8 + "</td></tr>" +
                "<tr> <td>D99</td> <td>&le;35</td> <td></td> <td>" + presoma.c9 + "</td></tr>" +
                "<tr> <td colspan='2'>筛上物</td> <td>&le;0.3</td> <td></td> <td>" + presoma.c10 + "</td></tr>" +
                "<tr> <td rowspan='5'>磁性物质检测(ppb)</td> <td>Fe</td> <td></td> <td></td> <td>" + presoma.c11 + "</td></tr>" +
                "<tr> <td>Ni</td> <td></td> <td></td> <td>" + presoma.c12 + "</td></tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + presoma.c13 + "</td></tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + presoma.c14 + "</td></tr>" +
                "<tr> <td>总量</td> <td>&le;100</td> <td></td> <td>" + presoma.c15 + "</td></tr>" +
                "<tr> <td colspan='2'>Ni+Co+Mn(%)</td> <td>60~64</td> <td>19.7&plusmn;0.5</td> <td>" + presoma.c16 + "</td></tr>" +
                "<tr> <td colspan='2'>Co(%)</td> <td>12.2~13.0</td> <td></td> <td>" + presoma.c17 + "</td></tr>" +
                "<tr> <td colspan='2'>Mn(%)</td> <td>11.6~12.2</td> <td></td> <td>" + presoma.c18 + "</td></tr>" +
                "<tr> <td colspan='2'>Ni(%)</td> <td>37.6~38.8</td> <td></td> <td>" + presoma.c19 + "</td></tr>" +
                "<tr> <td colspan='2'>Na(ppm)</td> <td>&le;120</td> <td></td> <td>" + presoma.c20 + "</td></tr>" +
                "<tr> <td colspan='2'>Mg(ppm)</td> <td>&le;100</td> <td></td> <td>" + presoma.c21 + "</td></tr>" +
                "<tr> <td colspan='2'>Ca(ppm)</td> <td>&le;100</td> <td></td> <td>" + presoma.c22 + "</td></tr>" +
                "<tr> <td colspan='2'>Fe(ppm)</td> <td>&le;50</td> <td></td> <td>" + presoma.c23 + "</td></tr>" +
                "<tr> <td colspan='2'>Cu(ppm)</td> <td>&le;50</td> <td></td> <td>" + presoma.c24 + "</td></tr>" +
                "<tr> <td colspan='2'>Cd(ppm)</td> <td>&le;20</td> <td></td> <td>" + presoma.c25 + "</td></tr>" +
                "<tr> <td colspan='2'>Zn(ppm)</td> <td>&le;40</td> <td></td> <td>" + presoma.c26 + "</td></tr>" +
                "<tr> <td colspan='2'>S(ppm)</td> <td>&le;1000</td> <td>&le;1300</td> <td>" + presoma.c27 + "</td></tr>" +
                "<tr> <td colspan='2'>Cl-(%)</td> <td>&le;0.03</td> <td></td> <td>" + presoma.c28 + "</td></tr>" +
                "<tr> <td colspan='2'>Zr(ppm)</td> <td></td> <td></td> <td>" + presoma.c29 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },

        /**
         * lithium表格-已完成
         * @param lithium
         * @returns {string}
         */
        getTableLithium: function (lithium) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + lithium.batchNumber + "</td> <td>" + material_publish.funcs.formatDate(lithium.testDate) + "</td> <td>" + lithium.number + "</td> <td>" + lithium.judge.name + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + lithium.status.name + "</td> <td>" + material_publish.funcs.getPublisher(lithium.publisher) + "</td> <td></td> <td></td></tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td><td colspan='2'>原料技术标准<td>" + lithium.batchNumber + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>水分(%)</td> <td>&le;0.25</td> <td>&le;0.25</td> <td>" + lithium.c1 + "</td></tr>" +
                "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>D1</td> <td></td> <td></td> <td>" + lithium.c2 + "</td></tr>" +
                "<tr> <td>D10</td> <td></td> <td></td> <td>" + lithium.c3 + "</td></tr>" +
                "<tr> <td>D50</td> <td>3~7</td> <td>3~7</td> <td>" + lithium.c4 + "</td></tr>" +
                "<tr> <td>D90</td> <td>&le;30</td> <td>&le;30</td> <td>" + lithium.c5 + "</td></tr>" +
                "<tr> <td>D99</td> <td></td> <td></td> <td>" + lithium.c6 + "</td></tr>" +
                "<tr> <td colspan='2'>筛上物</td> <td>&le;0.3</td> <td>&le;0.3</td> <td>" + lithium.c7 + "</td></tr>" +
                "<tr> <td rowspan='5'>磁性物质检测(ppb)</td> <td>Fe</td> <td></td> <td></td> <td>" + lithium.c8 + "</td></tr>" +
                "<tr> <td>Ni</td> <td></td> <td></td> <td>" + lithium.c9 + "</td></tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + lithium.c10 + "</td></tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + lithium.c11 + "</td></tr>" +
                "<tr> <td>总量</td> <td>&le;800</td> <td>&le;500</td> <td>" + lithium.c12 + "</td></tr>" +
                "<tr> <td colspan='2'>Li2CO3(%)</td> <td>&ge;18.66</td> <td>&ge;18.66</td> <td>" + lithium.c13 + "</td></tr>" +
                "<tr> <td colspan='2'>Na(ppm)</td> <td>&le;250</td> <td>&le;250</td> <td>" + lithium.c14 + "</td></tr>" +
                "<tr> <td colspan='2'>Mg(ppm)</td> <td>&le;80</td> <td>&le;80</td> <td>" + lithium.c15 + "</td></tr>" +
                "<tr> <td colspan='2'>Ca(ppm)</td> <td>&le;50</td> <td>&le;50</td> <td>" + lithium.c16 + "</td></tr>" +
                "<tr> <td colspan='2'>Fe(ppm)</td> <td>&le;10</td> <td>&le;10</td> <td>" + lithium.c17 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },

        bindLeftBtn: function (leftBtn) {
            leftBtn.off('click');
            leftBtn.on('click', function () {
                console.log("左");
                var $table = $(material_publish.material_type === 0 ? '#presoma_table' : '#lithium_table');
                var firstId = $([0]).attr('id');
                console.log(firstId);
                if (firstId != material_publish.currId) {
                    var prevCode = $('#' + material_publish.currId).prev('tr').attr('id').substr(17);
                    console.log(prevCode);
                    $.post(material_publish.material_type === 0 ? home.urls.rawPresoma.getByCode() : home.urls.rawLithium.getByCode(), {code: prevCode}, function (result) {
                        material_publish.currId = "material-publish-" + prevCode;
                        var raw = result.data;
                        const $div = $("#div_table");
                        material_publish.funcs.changeTable($div, raw);
                    })
                }
                else {
                    console.log("First one");
                    layer.msg('已经是页面第一项', {
                        time: 1000
                    })
                }
            })
        },

        bindRightBtn: function (rightBtn) {
            rightBtn.off('click');
            rightBtn.on('click', function () {
                console.log("右"); 
                var $table = $(material_publish.material_type === 0 ? '#presoma_table' : '#lithium_table');
                var raws1 = $table.children('tbody').children('tr').length-1;
                var lastId = $($table.children('tbody').children('tr')[raws1]).attr('id');
                console.log(lastId);
                if (lastId != material_publish.currId) {
                    var nextCode = $('#' + material_publish.currId).next('tr').attr('id').substr(17);
                    console.log(nextCode);
                    $.post(material_publish.material_type === 0 ? home.urls.rawPresoma.getByCode() : home.urls.rawLithium.getByCode(), {code: nextCode}, function (result) {
                        material_publish.currId = "material-publish-" + nextCode;
                        var raw = result.data;
                        const $div = $("#div_table");
                        material_publish.funcs.changeTable($div, raw);
                    })
                }
                else {
                    console.log("Last one");
                    layer.msg('已经是页面最后一项', {
                        time: 1000
                    })
                }
            })
        },

        /**
         * 更新表
         * @param $div
         * @param raw
         */
        changeTable: function ($div, raw) {
            $div.empty();
            $div.append(material_publish.material_type === 0 ? material_publish.funcs.getTablePresoma(raw) : material_publish.funcs.getTableLithium(raw));
        }


    }
}
