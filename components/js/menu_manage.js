var menu_manage = {
    menu1s: [],
    menu2s: [],
    menu3s: [],
    menu1List: null,
    menu2List: null,
    menu3List: null,
    init: function (menu1List, menu2List, menu3List) {
        console.log('init menu manage!')
        /** 渲染一级菜单 */
        menu_manage.menu1List = menu1List
        menu_manage.menu2List = menu2List
        menu_manage.menu3List = menu3List
        menu_manage.funcs.renderMenu1()

        menu1List.on('click', function() {
            menu3List.empty()
        })
    },
    funcs: {
        renderMenu1: function () {
            menu_manage.menu1List.empty()
            $.get(home.urls.menus.getAllMenu1(), {}, function (result) {
                menu_manage.menu1s = result.data
                menu_manage.menu1s.forEach(function (e, index) {
                    if (index == 0)
                        menu_manage.menu1List.append("<li class='item selected' id='menu1-" + (e.code) + "'> " + (e.name) + " &nbsp;&nbsp;<a href='#' id='menu1-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                    else
                        menu_manage.menu1List.append("<li class='item' id='menu1-" + (e.code) + "'> " + (e.name) + " &nbsp;&nbsp;<a href='#' id='menu1-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
                menu_manage.funcs.renderMenu2()
                menu_manage.funcs.bindClickForMenu1s($('#menu1List .item'))
            })
        }, renderMenu2: function () {
            $.get(home.urls.menus.getAllMenu3(), {}, function (result) {
                menu_manage.menu3s = result.data
            })
            $.get(home.urls.menus.getAllMenu2(), {}, function (result) {
                menu_manage.menu2s = result.data
                var menu2ToSelected = menu_manage.funcs.getCurrentMenu2(menu_manage.menu2s, $('.selected').attr('id').substr(6))
                menu_manage.menu2List.empty()
                menu2ToSelected.forEach(function (e) {
                    menu_manage.menu2List.append("<li class='item' id='menu2-" + (e.code) + "'> " + (e.name) + " &nbsp;&nbsp;<a href='#' id='menu2-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu2-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' id='menu2-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' id='menu2-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
                menu_manage.funcs.bindClickForMenu2($('#menu2List .item'))
            })
        }
        , getCurrentMenu2: function (candidates, menu1Code) {
            var menu2ToMenu1 = candidates.filter(function (ele) {
                return ele.menu1.code == menu1Code
            })
            menu2ToMenu1.sort(function (a, b) {
                return a.code - b.code
            }) //一级菜单排序
            return menu2ToMenu1
        }
        , getCurrentMenu3: function (candidates, menu2Code) {
            var menu3ToMenu2 = candidates.filter(function (ele) {
                return ele.menu2.code == menu2Code
            })
            menu3ToMenu2.sort(function (a, b) {
                return a.code - b.code
            })
            return menu3ToMenu2
        }
        , bindClickForMenu1s: function (items) {
            items.off('click')
            items.on('click', function () {
                $('.md4 .selected').removeClass('selected')
                $(this).addClass('selected')
                menu_manage.funcs.renderMenu2()
            })
        }
        , bindClickForMenu2: function (items) {
            items.off('click')
            items.on('click', function () {
                $('.md4 .selected-menu2').removeClass('selected-menu2')
                $(this).addClass('selected-menu2')
                var currentMenu3s = menu_manage.funcs.getCurrentMenu3(menu_manage.menu3s, $(this).attr('id').substr(6))
                menu_manage.menu3List.empty()
                currentMenu3s.forEach(function (e) {
                    menu_manage.menu3List.append("<li class='item' id='menu3-" + (e.code) + "'> " + (e.name) + " &nbsp;&nbsp;<a href='#' id='menu3-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu3-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' id='menu3-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' id='menu3-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
            })
        }
    }
}