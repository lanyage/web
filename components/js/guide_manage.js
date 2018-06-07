var guide_manage = {
    init: function () {
        $('.layui-layer-shade').remove()
        guide_manage.funcs.renderTable()
        var out = $('#guide_page').width()
        var time = setTimeout(function () {
                var inside = $('.layui-laypage').width()
                $('#guide_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
                clearTimeout(time)
            }//$init end$50
            , 30)
    }//$init end$
    , pageSize: 0
    , equipments: []
    , images: []
    , funcs: {


        renderTable: function () {
            $.post(home.urls.guideHeader.getAllByPage(), {page: 0}, function (result) {
                var guides = result.data.content //获取数据
                const $tbody = $("#guide_table").children('tbody')
                guide_manage.funcs.renderHandler($tbody, guides)
                guide_manage.pageSize = result.data.content.length
                var page = result.data
                layui.laypage.render({
                    elem: 'guide_page'
                    , count: 10 * page.totalPages
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.guideHeader.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var guides = result.data.content //获取数据
                                const $tbody = $("#guide_table").children('tbody')
                                guide_manage.funcs.renderHandler($tbody, guides)
                                guide_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕


            var addBtn = $("#model-li-hide-add-43")
            guide_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-43')
            guide_manage.funcs.bindRefreshEventLisener(refreshBtn)//追加刷新事件
            var searchBtn = $('#model-li-hide-search-43')
            guide_manage.funcs.bindSearchEventListener(searchBtn)


        },
        clearAddModal: function () {
            $("#tab").empty()
            $("#_2_banci").val('')
            $("#_2_bianhao").val('')
            $("#_2_shengxiaoriqi").val('')
            $("#_2_yeci").val('')
        }
        , bindAddEventListener: function (addBtn) {
            $.get(servers.backup() + "equipment/getAll", {}, function (result) {
                var eqs = result.data;
                guide_manage.equipments = result.data
                var select = $("#equipment_select_2")
                eqs.forEach(function (e) {
                    select.append("<option value='" + (e.code) + "'>" + (e.name + '-巡检指导书') + "</option>")
                })
            })
            $.get(servers.backup() + "user/getAll", {}, function (result) {
                guide_manage.users = result.data
                var bianzhi_select = $("#_2_bianzhi")
                guide_manage.users.forEach(function (e) {
                    bianzhi_select.append("<option value='" + (e.code) + "'>" + (e.name) + "</option>")
                })
                var shenhe_select = $("#_2_shenhe")
                guide_manage.users.forEach(function (e) {
                    shenhe_select.append("<option value='" + (e.code) + "'>" + (e.name) + "</option>")
                })
                var pizhun_select = $("#_2_pizhun")
                guide_manage.users.forEach(function (e) {
                    pizhun_select.append("<option value='" + (e.code) + "'>" + (e.name) + "</option>")
                })
            }),
                addBtn.off('click').on('click', function () {
                    guide_manage.images.splice(0, guide_manage.images.length)            //once you click the add button, you should do clear this thing
                    guide_manage.funcs.clearAddModal()              //clear the add modal
                    layer.open({
                        type: 1,
                        title: '添加',
                        content: $('#edgudiebook_info2'),
                        area: ['900px', '500px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        closeBtn: 0,
                        yes: function (index) {
                            var bianhao = $("#bianhao").val()
                            var eq_code = $("#equipment_select_2").val()
                            var banci = $("#_2_banci").val()
                            var bianhao = $("#_2_bianhao").val()
                            var bianzhi = $("#_2_bianzhi").val()
                            var pizhun = $("#_2_pizhun").val()
                            var shengxiaoriqi = $("#_2_shengxiaoriqi").val()
                            var shenhe = $("#_2_shenhe").val()
                            var yeci = $("#_2_yeci").val()
                            var header = {
                                code: bianhao,
                                name: guide_manage.equipments.filter(function (e) {
                                    return e.code == eq_code
                                })[0].name,
                                num: yeci,
                                edition: banci,
                                effectivedate: shengxiaoriqi,
                                approvercode: {code: pizhun},
                                // archivecode: {},
                                auditorcode: {code: shenhe},
                                compactorcode: {code: bianzhi},
                                guides: [],
                            }
                            var newLines = $('.newLine')            //guiders
                            newLines.each(function () {
                                var _self_sub = $(this).children("td")
                                var xuhao = $(_self_sub[0]).children("input").val()
                                var meirijiandianneirong = $(_self_sub[1]).children("input").val()
                                var jianchabiaozhun = $(_self_sub[2]).children("input").val()
                                var tupian = $(_self_sub[3]).children("input").val()
                                header.guides.push({
                                    content: meirijiandianneirong,
                                    standard: jianchabiaozhun,
                                    imageCode: tupian
                                })
                            })
                            console.log(header)
                            $.ajax({
                                url: home.urls.guideHeader.add(),
                                contentType: 'application/json',
                                data: JSON.stringify(header),
                                type: 'post',
                                success: function (result) {
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                    if ($("#guide_table").children('tbody').children('tr').length < 10) {
                                        guide_manage.funcs.appendRecord($("#guide_table").children('tbody'), result.data)
                                        guide_manage.funcs.bindAll($("#guide_table").children('tbody'))
                                    }
                                    layer.close(index)
                                    $("#edgudiebook_info2").css('display', 'none')
                                }
                            })
                        }, btn2: function (index) {
                            layer.close(index)
                            $("#edgudiebook_info2").css('display', 'none')

                        }
                    })
                })
        }

        //$ bindAddEventListener——end$
        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {

                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var guideCode = _this.attr('id').substr(3)
                        _this.parent('td').parent('tr').remove()
                        $.post(home.urls.guideHeader.deleteByCode(), {code: guideCode}, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })

                        })
                        layer.close(index)
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        }//**$ bindDeleteEventListener_end$


        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var guide_name = $('#guide_name_input').val()
                $.post(home.urls.guideHeader.getAllByLikeNameByPage(), {name: guide_name}, function (result) {
                    var page = result.data
                    var guides = result.data.content //获取数据
                    const $tbody = $("#guide_table").children('tbody')
                    guide_manage.funcs.renderHandler($tbody, guides)
                    layui.laypage.render({
                        elem: 'guide_page'
                        , count: 10 * page.totalPages
                        , jump: function (obj, first) {
                            $.post(home.urls.guideHeader.getAllByLikeNameByPage(), {
                                name: guide_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var guides = result.data.content //获取数据
                                const $tbody = $("#guide_table").children('tbody')
                                guide_manage.funcs.renderHandler($tbody, guides)
                                guide_manage.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$


        , bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click').on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    guide_manage.init()
                    layer.close(index)
                    location.reload();
                    clearTimeout(time)
                }, 200)
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change').on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.gui_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        },
        renderEdit: function (header) {
            $("#bianhao").val(header.code)
            console.log(guide_manage.equipments)
            console.log(header)
            var meName = guide_manage.equipments.filter(function(e) {
                return e.name == header.name
            })
            $("#equipment_select_2").empty()
            $("#equipment_select_2").append("<option value='" + meName[0].code + "'>" + meName[0].name + '-巡检指导书' + "</option>")
            guide_manage.equipments.forEach(function (e) {
               if (e.name != header.name)
                    $("#equipment_select_2").append("<option value='" + e.code + "'>" + e.name + "</option>")
            })

            $("#_2_banci").val(header.edition)
            $("#_2_bianhao").val(header.code)
            $("#_2_yeci").val(header.num)
            $("#_2_shengxiaoriqi").val(header.effectivedate)

            var meComp = guide_manage.users.filter(function(e) {
                return e.code == header.compactorcode.code
            })[0]
            $("#_2_bianzhi").empty()
            $("#_2_bianzhi").append("<option value='"+meComp.code+"'>"+meComp.name+"</option>")
            var meAud = guide_manage.users.filter(function(e) {
                return e.code == header.auditorcode.code
            })[0]

            $("#_2_shenhe").empty()
            $("#_2_shenhe").append("<option value='"+meAud.code+"'>"+meAud.name+"</option>")
            var meAppr = guide_manage.users.filter(function(e) {
                return e.code == header.approvercode.code
            })[0]
            $("#_2_pizhun").empty()
            $("#_2_pizhun").append("<option value='"+meAppr.code+"'>"+meAppr.name+"</option>")

            guide_manage.users.forEach(function(e) {
                if (e.code != header.compactorcode.code)
                    $("#_2_bianzhi").append("<option value='" + e.code + "'>" + e.name + "</option>")
                if (e.code != header.auditorcode.code)
                    $("#_2_shenhe").append("<option value='" + e.code + "'>" + e.name + "</option>")
                if (e.code != header.approvercode.code)
                    $("#_2_pizhun").append("<option value='" + e.code + "'>" + e.name + "</option>")
            })
            //after rendering head, then you should render the tbody
            $("#tab").empty()
            console.log(header.guides)
            header.guides.forEach(function(e) {
                var guide = e
                $("#tab").append(
                    "<tr class='newLine' id='s" + guide.code + "'>" +
                    "<td><input style='text-align: center;' type='text' value='"+guide.code+"'></td>" +
                    "<td><input type='text' value='"+guide.content+"'></td>" +
                    "<td><input type='text' value='"+guide.standard+"'></td>" +
                    "<td><form enctype='multipart/form-data'><input class='upload' type='file' placeholder='上传图片' id='shangchuan_"+guide.code+"'/></form></td>" +
                    "<td><button onclick='delTab(" + guide.code + ")' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                )
                if(guide.imageCode != null) {
                    var parent = $(".upload").parent("form").parent("td")
                    parent[0].innerHTML=''
                    parent.append("<input value='"+guide.imageCode+"' type='hidden'/><img style='width: 100%;height: 100px;' src='"+servers.backup()+'/image/'+guide.imageCode+"'/>")
                }
            })
        }
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                var _self = $(this)
                var headerCode = _self.attr("id").substr(3)
                guide_manage.images.splice(0, guide_manage.images.length)            //once you click the add button, you should do clear this thing
                guide_manage.funcs.clearAddModal()              //clear the add modal
                $.post(home.urls.guideHeader.getByCode(), {code: headerCode}, function (result) {
                    var header = result.data
                    //firstly you need to render the table
                    guide_manage.funcs.renderEdit(header)
                    layer.open({
                        type: 1,
                        title: '添加',
                        content: $('#edgudiebook_info2'),
                        area: ['700px', '500px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        closeBtn: 0,
                        yes: function (index) {
                            var bianhao = $("#bianhao").val()
                            var eq_code = $("#equipment_select_2").val()
                            var banci = $("#_2_banci").val()
                            var bianhao = $("#_2_bianhao").val()
                            var bianzhi = $("#_2_bianzhi").val()
                            var pizhun = $("#_2_pizhun").val()
                            var shengxiaoriqi = $("#_2_shengxiaoriqi").val()
                            var shenhe = $("#_2_shenhe").val()
                            var yeci = $("#_2_yeci").val()
                            var header = {
                                code: bianhao,
                                name: guide_manage.equipments.filter(function (e) {
                                    return e.code == eq_code
                                })[0].name,
                                num: yeci,
                                edition: banci,
                                effectivedate: shengxiaoriqi,
                                approvercode: {code: pizhun},
                                // archivecode: {},
                                auditorcode: {code: shenhe},
                                compactorcode: {code: bianzhi},
                                guides: [],
                            }
                            var newLines = $('.newLine')            //guiders
                            newLines.each(function () {
                                var _self_sub = $(this).children("td")
                                // var xuhao = $(_self_sub[0]).children("input").val()
                                var meirijiandianneirong = $(_self_sub[1]).children("input").val()
                                var jianchabiaozhun = $(_self_sub[2]).children("input").val()
                                var tupian = $(_self_sub[3]).children("input").val()
                                header.guides.push({
                                    content: meirijiandianneirong,
                                    standard: jianchabiaozhun,
                                    imageCode: tupian
                                })
                            })
                            console.log(header)
                            //todo
                            $.ajax({
                                url: home.urls.guideHeader.update(),
                                contentType: 'application/json',
                                data: JSON.stringify(header),
                                type: 'post',
                                success: function (result) {
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                    // if ($("#guide_table").children('tbody').children('tr').length < 10) {
                                    //     guide_manage.funcs.appendRecord($("#guide_table").children('tbody'), result.data)
                                    //     guide_manage.funcs.bindAll($("#guide_table").children('tbody'))
                                    // }
                                    layer.close(index)
                                    $("#edgudiebook_info2").css('display', 'none')
                                }
                            })
                            layer.close(index)
                            $("#edgudiebook_info2").css('display', 'none')
                        }, btn2: function (index) {
                            layer.close(index)
                            $("#edgudiebook_info2").css('display', 'none')

                        }
                    })
                })
            })
        }

        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click').on('click', function () {
                if ($('.gui_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var guideCodes = []
                            $('.gui_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    guideCodes.push({code: $(this).val()})
                                }
                            })
                            guideCodes.forEach(function (e) {
                                $("#de-" + e.code).parent('td').parent('tr').remove()
                            })
                            $.ajax({
                                url: home.urls.guideHeader.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(guideCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                }
                            })
                            layer.close(index)
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        },
        clearDetail: function () {
            $("#eq_name")[0].innerHTML = ''
            $("#bianhao")[0].innerHTML = ''
            $("#banci")[0].innerHTML = ''
            $("#yeci")[0].innerHTML = ''
            $("#bianzhi")[0].innerHTML = ''
            $("#shenpi")[0].innerHTML = ''
            $("#pizhun")[0].innerHTML = ''
            $("#shengxiaoriqi")[0].innerHTML = ''
            $("#detail_tbody").empty()
        },
        renderDetail: function (header) {
            $("#eq_name")[0].innerHTML = (header.name + '-巡检指导书')
            $("#bianhao")[0].innerHTML = (header.code)
            $("#banci")[0].innerHTML = (header.edition)
            $("#yeci")[0].innerHTML = (header.num)
            $("#bianzhi")[0].innerHTML = (header.compactorcode ? header.compactorcode.name : '')
            $("#shenpi")[0].innerHTML = (header.auditorcode ? header.auditorcode.name : '')
            $("#pizhun")[0].innerHTML = (header.approvercode ? header.approvercode.name : '')
            $("#shengxiaoriqi")[0].innerHTML = (header.effectivedate)
        }
        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                /** 弹出一个询问框 */
                var _self = $(this)
                var headerCode = _self.attr("id").substr(5)
                $.post(home.urls.guideHeader.getByCode(), {code: headerCode}, function (result) {
                    var header = result.data
                    guide_manage.funcs.clearDetail(header)          //clear this table first
                    guide_manage.funcs.renderDetail(header)             //render is then
                    var $detail_tbody = $("#detail_tbody")
                    header.guides.forEach(function (e) {
                        $detail_tbody.append(
                            "<tr style='height:80px;'>" +
                            "<td style='width:10%;'>" + e.code + "</td>" +
                            "<td style='width:30%;'>" + e.content + "</td>" +
                            "<td style='width:30%;'>" + e.standard + "</td>" +
                            "<td style='width:30%;'>" +
                            "<img alt='还没上传图片' src='" + servers.backup() + 'image/' + e.imageCode + "' alt='' style='width:150px;height:70px;'/>" +
                            "</td>" +
                            "</tr>"
                        )
                    })
                    layer.open({        //after you having rendered the detail table
                        type: 1,
                        title: '添加',
                        content: $("#gudiebook_info"),
                        area: ['800px', '500px'],
                        btn: ['确认'],
                        offset: 'auto',
                        closeBtn: 0,
                        yes: function (index) {
                            layer.close(index)
                            $("#gudiebook_info").css('display', 'none')
                        }
                    });
                })
            })
        },
        appendRecord: function ($tbody, e) {
            $tbody.prepend(
                "<tr>" +
                "<td><input type='checkbox' class='gui_checkbox' value='" + (e.code) + "'></td>" +
                "<td>" + (e.code) + "</td>" +
                "<td>" + (e.name) + "</td>" +
                "<td>" + (e.effectivedate) + "</td>" +
                "<td>" + (e.compactorcode ? e.compactorcode.name : '') + "</td>" +
                "<td>" + (e.auditorcode ? e.auditorcode.name : '') + "</td>" +
                "<td>" + (e.approvercode ? e.approvercode.name : '') + "</td>" +
                "<td>" + (e.num) + "</td>" +
                "<td><a href='#' class='detailGuide' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                "<td><a href='#' class='editGuide' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                "<td><a href='#' class='deleteGuide' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                "</tr>")
            var len = $tbody.children('tr').length
            if (len > 10)
                $($tbody.children('tr')[len - 1]).remove()
        },        //append all records to the tbody


        bindAll: function ($tbody) {
            var editBtns = $('.editGuide')
            var deleteBtns = $('.deleteGuide')
            var deleteBatchBtn = $('#model-li-hide-delete-43')
            var detailBtn = $('.detailGuide')
            guide_manage.funcs.bindDetailEventListener(detailBtn)
            guide_manage.funcs.bindDeleteEventListener(deleteBtns)
            guide_manage.funcs.bindEditEventListener(editBtns)
            guide_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            home.funcs.bindSelectAll($('#gui_checkAll'), $('.gui_checkbox'), $tbody.children('tr').length, $("#guide_table"))
        }        //bind all event listener

        , renderHandler: function ($tbody, guides) {
            $tbody.empty() //清空表格
            guides.forEach(function (e) {
                $('#gui_checkAll').prop('checked', false)
                guide_manage.funcs.appendRecord($tbody, e)
            })//数据渲染完毕
            guide_manage.funcs.bindAll($tbody)
        }

        , disselectAll: function (gui_checkboxes, selectAllBox) {
            gui_checkboxes.off('change')
            gui_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.gui_checkbox:checked').length === guide_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}