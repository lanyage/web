var product_publish = {
    pageSize: 0,
    status: 1,
    currId: null,
    init: function () {
        product_publish.funcs.renderTable(product_publish.status)
    },
    funcs: {
        renderTable: function (status) {
            /** 获取所有的记录 */
            $.post(home.urls.productPublish.getAllByPage(), {statusCode: status}, function (result) {
                var records = result.data.content //获取数据
                const $tbody = $("#_23table").children('tbody')
                product_publish.funcs.renderHandler($tbody, records)
                product_publish.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: '_23page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.productPublish.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var records = result.data.content //获取数据
                                const $tbody = $("#_23table").children('tbody')
                                product_publish.funcs.renderHandler($tbody, records)
                                product_publish.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#_23page').css('padding-left','37%')
            })//$数据渲染完毕

            /** 追加状态下拉框事件 */
            var statusSelect = $('#model-li-hide-select-23');
            product_publish.funcs.bindSelectEventListener(statusSelect);
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-23');
            product_publish.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-23');
            product_publish.funcs.bindSearchEventListener(searchBtn);
        }
        , renderHandler: function ($tbody, records) {
            $tbody.empty() //清空表格
            records.forEach(function (e) {
                $tbody.append(
                    "<tr id='product-publish-" + (e.code) + "'>" +
                    "<td>" + product_publish.funcs.getIcon(product_publish.status, e.code) + "</i></td>" +
                    "<td>" + (e.publisher ? e.publisher.name : '无') + "</td>" +
                    "<td>" + (new Date(e.testDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.judge ? e.judge.name : '无') + "</td>" +
                    "<td>" + (e.number) + "</td>" +
                    "<td>" + (e.p1) + "</td>" +
                    "<td>" + (e.p2) + "</td>" +
                    "<td>" + (e.p3) + "</td>" +
                    "<td>" + (e.p4) + "</td>" +
                    "<td>" + (e.p7) + "</td>" +
                    "<td>" + (e.p10) + "</td>" +
                    "<td>" + (e.p13) + "</td>" +
                    "<td>" + (e.p19) + "</td>" +
                    "<td>" + (e.p20) + "</td>" +
                    "<td>" + (e.p21) + "</td>" +
                    "<td>" + (e.p22) + "</td>" +
                    "<td>" + (e.p23) + "</td>" +
                    "<td>" + (e.p24) + "</td>" +
                    "<td>" + (e.p34) + "</td>" +
                    "<td>" + (e.p35) + "</td>" +
                    "<td>" + (e.p36) + "</td>" +
                    "</tr>")
            })//$数据渲染完毕

            product_publish.funcs.bindPublishClick()
            product_publish.funcs.bindDetailClick()
        }
        , bindPublishClick: function () {
            $('.publish').off('click').on('click', function () {
                var productCode = $(this).attr('id').substr(8)
                product_publish.currId = 'product-publish-' + productCode
                product_publish.funcs.renderModal()
            })
        }
        , renderModal: function () {
            $.post(home.urls.product.getByCode(), {code: product_publish.currId.substr(16)}, function (res) {
                var product = res.data
                layer.open({
                    type: 1,
                    content: product_publish.funcs.getData(product),
                    area: ['720px', '700px'],
                    btn: ['确认发布', '返回'],
                    offset: 'auto', // ['10%', '40%'],
                    btnAlign: 'c',
                    yes: function () {
                        $.post(home.urls.productPublish.productPublish(), {
                            code: product_publish.currId.substr(16),
                            publisherCode: home.user.code
                        }, function (res) {
                            layer.msg(res.message, {
                                offset: ['40%', '40%'],
                                time: 700
                            })
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
                product_publish.funcs.bindLeftBtn($('#toPrevious'))
                product_publish.funcs.bindRightBtn($('#toNext'))
            })
        }
        , bindLeftBtn: function (btn) {
            btn.off('click').on('click', function () {
                var $table = $("#_23table")
                var firstId = $($table.children('tbody').children('tr')[0]).attr('id')
                if (firstId != product_publish.currId) {
                    var prevCode = $('#' + product_publish.currId).prev('tr').attr('id').substr(16)
                    $.post(home.urls.product.getByCode(), {code: prevCode}, function (res) {
                        product_publish.currId = 'product-publish-' + prevCode
                        var product = res.data
                        const $div = $("#div_table")
                        product_publish.funcs.changeTable($div, product)
                    })
                }
                else {
                    layer.msg('已经是页面第一项', {
                        time: 1000
                    })
                }
            })
        }
        , bindRightBtn: function (btn) {
            btn.off('click').on('click', function () {
                var $table = $("#_23table")
                var rows = $table.children('tbody').children("tr").length - 1
                var lastId = $($table.children('tbody').children('tr')[rows]).attr('id')
                if (lastId != product_publish.currId) {
                    var nextCode = $('#' + product_publish.currId).next('tr').attr('id').substr(16)
                    $.post(home.urls.product.getByCode(), {code: nextCode}, function (res) {
                        product_publish.currId = 'product-publish-' + nextCode
                        var product = res.data
                        const $div = $("#div_table")
                        product_publish.funcs.changeTable($div, product)
                    })
                }
                else {
                    layer.msg('已经是页面最后一项', {
                        time: 1000
                    })
                }
            })
        }
        , bindDetailClick: function () {
            $('.detail').off('click').on('click', function () {
                var _selfBtn = $(this)
                var productCode = _selfBtn.attr('id').substr(6)
                product_publish.currId = "product-publish-" + productCode
                $.post(home.urls.product.getByCode(), {code: productCode}, function (result) {
                    var product = result.data
                    layer.open({
                        type: 1,
                        content: product_publish.funcs.getData(product),
                        area: ['720px', '700px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    })
                    product_publish.funcs.bindLeftBtn($('#toPrevious'))
                    product_publish.funcs.bindRightBtn($('#toNext'))
                })
            })
        }
        /** 监听状态下拉选框 */
        , bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                product_publish.status = $(this).val()
                product_publish.funcs.renderTable(product_publish.status)
            })
        },
        /** 刷新事件 */
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                $('#product_batch_number_input').val('')
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    product_publish.init()
                    $('#product_batch_number_input').val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },
        /** 搜索事件 */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var product_batch_number = $('#product_batch_number_input').val()
                var status = $('#model-li-hide-select-23').val()
                $.post(home.urls.productPublish.getByLikeBatchNumberByPage(), {
                    batchNumber: product_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var products = result.data.content //获取数据
                    var status = $('#model-li-hide-select-23').val()
                    const $tbody = $("#_23table").children('tbody')
                    product_publish.funcs.renderHandler($tbody, products)
                    layui.laypage.render({
                        elem: '_23page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                                    batchNumber: product_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var products = result.data.content //获取数据
                                    const $tbody = $("#_23table").children('tbody')
                                    product_publish.funcs.renderHandler($tbody, products)
                                    product_publish.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
        , getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='publish' id='publish-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        }
        , getData: function (product) {
            return (
                "<a id='toPrevious' class='arrows-l' href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a>" +
                "<a id='toNext' class='arrows-r' href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a>" +
                "<div id='div_table' class='table_scroll' style='padding:0px 30px 0px 30px;'>" +
                product_publish.funcs.getTable(product) +
                "</div>"
            )
        }
        , getTable: function (product) {
            return (
                "<table id='audit_table_inner' class='table_inner' align='center' width='100%'>" +
                "<thead>" +
                " <tr> <td colspan='2'>批号</td><td>检测日期</td> <td>数量(t)</td> <td>判定</td> <td></td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + (product.batchNumber) + "</td><td>" + (new Date(product.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + (product.number) + "</td> <td>" + (product.judge ? product.judge.name : null) + "</td> <td></td> </tr>" +
                " </tbody>" +
                "<thead>" +
                " <tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td> <td></td> </tr>" +
                "</thead>" +
                "<tbody>" +
                " <tr> <td colspan='2'>" + (product.status ? product.status.name : null) + "</td> <td>" + (product.publisher ? product.publisher.name : null) + "</td> <td></td> <td></td> <td></td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>三级控制标准</td> <td>2016-3-2三级控制标准</td> <td>" + (product.batchNumber) + "</td> <td>编辑</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>振实密度(g/cm3)</td><td>≥2.0</td><td>2.3~2.7</td> <td>" + (product.p1) + "</td><td></td></tr>" +
                " <tr> <td colspan='2'>水分（ppm）</td>  <td>≤500</td>  <td>≤200</td>  <td>" + (product.p2) + "</td>  <td></td> </tr>" +
                "<tr> <td colspan='2'>SSA（m2/g）</td> <td>0.20~0.40</td> <td>0.22~0.48</td> <td>" + (product.p3) + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>pH值</td> <td>&le;11.80</td> <td>&le;11.80</td> <td>" + (product.p4) + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Li2CO3（%）</td> <td></td> <td>&le;0.25</td> <td>" + (product.p5) + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>LiOH（%）</td> <td></td> <td>&le;0.20</td> <td>" + (product.p6) + "</td> <td></td> </tr>" +
                "<tr> <td rowspan='5'>粒度（um）</td> <td>D1</td> <td></td> <td>&ge;3.00</td> <td>" + (product.p8) + "</td> <td></td> </tr>" +
                "<tr> <td>D10</td> <td>&ge;6.00</td> <td>&ge;5.00</td> <td>" + (product.p9) + "</td> <td></td> </tr>" +
                "<tr> <td>D50</td> <td>11.00~14.00</td> <td>11.30~13.3</td> <td>" + product.p10 + "</td> <td></td> </tr>" +
                "<tr> <td>D90</td> <td>&le;30.00</td> <td>&le;30.00</td> <td>" + product.p11 + "</td> <td></td> </tr>" +
                " <tr> <td>D99</td> <td></td> <td>&le;40.00</td> <td>" + product.p12 + "</td> <td></td> </tr>" +
                "<tr> <td rowspan='5'>磁性物质检测（ppb）</td> <td>粒度宽度系数</td> <td></td> <td></td> <td>" + product.p13 + "</td> <td></td> </tr>" +
                "<tr> <td>Fe</td> <td></td> <td></td> <td></td> <td></td> </tr>" +
                " <tr> <td>Ni</td> <td></td> <td></td> <td>" + product.p15 + "</td> <td></td> </tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + product.p15 + "</td> <td></td> </tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + product.p17 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>总量</td> <td>&le;50</td> <td>&le;50</td> <td>" + product.p18 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Co（mol%）</td> <td>12.20&plusmn;1.0</td> <td>19.7&plusmn;0.5</td> <td>" + product.p19 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mn（ppm）</td> <td></td> <td>19.9&plusmn;0.5</td> <td>" + product.p20 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ni（ppm）</td> <td></td> <td>60.4&plusmn;0.5</td> <td>" + product.p21 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>Li（%）</td> <td>7.0&plusmn;0.5</td> <td>7.0&plusmn;0.5</td> <td>" + product.p22 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Co （%）</td> <td>12.20&plusmn;1.0</td> <td>12.20&plusmn;1.0</td> <td>" + product.p23 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mn（%）</td> <td>11.4&plusmn;1.0</td> <td>11.4&plusmn;1.0</td> <td>" + product.p24 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ni（%）</td> <td>36.2&plusmn;1.0</td> <td>36.2&plusmn;1.0</td> <td>" + product.p25 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>Na （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + product.p26 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mg （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + product.p27 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ca （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + product.p28 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Fe（ppm）</td> <td>&le;50</td> <td>&le;30</td> <td>" + product.p29 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Cu（ppm）</td> <td>&le;50</td> <td>&le;20</td> <td>" + product.p30 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Zn（ppm）</td> <td>&le;50</td> <td>&le;30</td> <td>" + product.p31 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>S（ppm）</td> <td></td> <td>&le;1500</td> <td>" + product.p32 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Al（ppm）</td> <td></td> <td></td> <td>" + product.p33 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>0.1C放电容量（mAh/g）</td> <td>1000&plusmn;300</td> <td>1000&plusmn;300</td> <td>" + product.p34 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>0.1C首次放电效率（%）</td> <td></td> <td>&ge;177.5</td> <td>" + product.p35 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>1C放电容量（mAh/g）</td> <td></td> <td>&ge;88.0</td> <td>" + product.p36 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>主原料</td> <td></td> <td>&ge;162</td> <td>" + product.p37 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>成品外观、重量抽查结果</td> <td></td> <td></td> <td>" + product.p38 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>产线</td> <td></td> <td></td> <td>" + product.p39 + "</td> <td></td> </tr>" +
                "</tbody>" +
                "</table>"
            )
        },
        changeTable: function ($div, product) {
            $div.empty();
            $div.append(product_publish.funcs.getTable(product));
        }
    }
}