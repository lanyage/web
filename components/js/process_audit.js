var process_audit = {
    init: function () {

    }
    , raw_type: 0   // choose material type: 0-personma, 1-lithium
    , pageSize: 0
    , currId: null  // current chosen Id
    , funcs: {
        renderTable: function (){},
        selectPremix:function () {

        },
        selectSize: function () {

        },
        selectLithium: function () {

        },
        selectBuckle: function () {
            
        },
        renderHandlerPremix: function () {
            
        },
        renderHandlerSize: function () {
            
        },
        renderHandlerLithium: function () {
            
        },
        renderHandlerBuckle: function () {
            
        },
        bindRefreshEventListener: function () {
            
        },
        bindSearchEventListener: function () {
            
        },
        bindSelectEventListener: function () {
            
        },
        bindAuditEventListener: function () {
            
        },
        bindDetailEventListener: function () {
            
        },
        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得审核人*/
        getAuditor: function (e) {
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
        getData: function () {
            
        },
        getTablePremix: function () {
            
        },
        getTableSize: function () {
            
        },
        getTableLithium:function () {
            
        },
        getTableBuckle: function () {
            
        },
        bindLeftBtn:function () {
            
        },
        bindRightBtn: function () {
            
        },
        changeTable:function () {
            
        }
    }
}