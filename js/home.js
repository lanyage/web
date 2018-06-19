var home = {
    urls: {
        energyMonitor: {
            load24HoursData: function () {
                return servers.backup() + 'energyReadData/getByInoAndCurDateTime'
            },
            loadFenshiduibiData: function () {
                return servers.backup() + 'energyReadData/getByInoAndStartDateTimeAndEndDateTime'
            }
        },
        processPremix: {//预混
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processPremix/getAllByStatusCodeByPage'
            },
            getAll: function () {
                return servers.backup() + 'processPremix/getAll'
            },
        },
        processSize: {//粒度
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processSize/getAllByStatusCodeByPage'
            },
            getAll: function () {
                return servers.backup() + 'processSize/getAll'
            },
        },
        processLithium: {//总锂
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processLithium/getAllByStatusCodeByPage'
            },
            getAll: function () {
                return servers.backup() + 'processLithium/getAll'
            },
        },
        processBuckle: {//扣电
            getAllBysuffatusCodeByPage: function () {
                return servers.backup() + 'processBuckle/getAllByStatusCodeByPage'
            },
            getAll: function () {
                return servers.backup() + 'processBuckle/getAll'
            },
        },

        fileUpload: {
            getAllFileType: function () {
                return servers.backup() + 'fileUpload/getAllFileType'
            },
            open: function () {
                return servers.backup() + 'fileUpload/open'
            },
            submit: function () {
                return servers.backup() + 'fileUpload/submit'
            }
        },
        menus: {
            getAllMenu1: function () {
                return servers.backup() + 'menu1/getAll'
            },
            getAllMenu2: function () {
                return servers.backup() + 'menu2/getAll'
            },
            getAllMenu3: function () {
                return servers.backup() + 'model/getAll'
            },
            deleteMenu1ByCode: function () {
                return servers.backup() + 'menu1/deleteByCode'
            },
            deleteMenu2ByCode: function () {
                return servers.backup() + 'menu2/deleteByCode'
            },
            deleteMenu3ByCode: function () {
                return servers.backup() + 'model/deleteByCode'
            },
            updateMenu1ByCode: function () {
                return servers.backup() + 'menu1/updateNameAndPath'
            },
            updateMenu2ByCode: function () {
                return servers.backup() + 'menu2/updateName'
            },
            updateMenu3ByCode: function () {
                return servers.backup() + 'model/updateName'
            },
            getMenu1ByCode: function () {
                return servers.backup() + 'menu1/getByCode'
            },
            getMenu2ByCode: function () {
                return servers.backup() + 'menu2/getByCode'
            },
            getMenu3ByCode: function () {
                return servers.backup() + 'model/getByCode'
            },
            addMenu1: function () {
                return servers.backup() + 'menu1/add'
            },
            addMenu2: function () {
                return servers.backup() + 'menu2/add'
            },
            addMenu3: function () {
                return servers.backup() + 'model/add'
            },
            menu1Shift: function () {
                return servers.backup() + 'menu1/shift'
            },
            menu2Shift: function () {
                return servers.backup() + 'menu2/shift'
            },
            menu3Shift: function () {
                return servers.backup() + 'model/shift'
            },
            listOperations: function () {
                return servers.backup() + 'operation/getAll'
            },
            getOperationsByModel: function () {
                return servers.backup() + 'modelOperation/getByModelCode'
            },
            deleteOperationModel: function () {
                return servers.backup() + 'modelOperation/deleteByModelCodeAndOperationCode'
            },
            updateOperation: function () {
                return servers.backup() + 'operation/update'
            },
            deleteOperation: function () {
                return servers.backup() + 'operation/deleteByCode'
            },
            updateModelOperationBatch: function () {
                return servers.backup() + 'modelOperation/updateBatch'
            },
            addOperation: function () {
                return servers.backup() + 'operation/add'
            },
            getAllModelOperations: function () {
                return servers.backup() + 'modelOperation/getAll'
            }
        },
        reviewprocess: {
            getExamByNameByPage: function () {
                return servers.backup() + 'reviewprocess/getExamByNameByPage'
            },
            addExam: function () {
                return servers.backup() + 'reviewprocess/addExam'
            },
            getExamByCode: function () {
                return servers.backup() + 'reviewprocess/getExamByCode'
            },
            deleteExamByCode: function () {
                return servers.backup() + 'reviewprocess/deleteExamByCode'
            },
            updateExam: function () {
                return servers.backup() + 'reviewprocess/updateExam'
            }
        },
        check: {
            getAllByPage: function () {
                return servers.backup() + 'check/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'check/add'
            },
            update: function () {
                return servers.backup() + 'check/update'
            },
            getByCode: function () {
                return servers.backup() + 'check/getByCode'
            },
            deleteByCode: function () {
                return servers.backup() + 'check/deleteByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'check/getAllByLikeNameByPage'
            },
            getAll: function () {
                return servers.backup() + 'check/getAll'
            }

        },
        rawType: {
            getAllByPage: function () {
                return servers.backup() + 'rawType/getAllByPage'
            },
            getByCode: function () {
                return servers.backup() + 'rawType/getByCode'
            },
            update: function () {
                return servers.backup() + 'rawType/update'
            },
            add: function () {
                return servers.backup() + 'rawType/add'
            }
        },
        department: {
            getAllByPage: function () {
                return servers.backup() + 'department/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'department/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'department/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'department/update'
            },
            getByCode: function () {
                return servers.backup() + 'department/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'department/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'department/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'department/getAll'
            }
        },
        material: {
            getAllByPage: function () {
                return servers.backup() + 'material/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'material/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'material/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'material/update'
            },
            getByCode: function () {
                return servers.backup() + 'material/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'material/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'material/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'material/getAll'
            }
        },
        monitor_online: {
            loadData: function () {
                return servers.backup() + 'monitor/loadData'
            }
        },
        supplyman: {
            getAllByPage: function () {
                return servers.backup() + 'sendEntryHeader/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'sendEntryHeader/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'sendEntryHeader/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'sendEntryHeader/update'
            },
            getByCode: function () {
                return servers.backup() + 'sendEntryHeader/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'supplyInfo/findByCompany'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'sendEntryHeader/deleteByCodeBatch'
            },
            getBySupplierCodeByPage: function () {
                return servers.backup() + 'sendEntryHeader/getBySupplierCodeByPage'
            },
            saveInBatch: function () {
                return servers.backup() + 'supplyInfo/saveInBatch'
            },
            getAllSupplier: function () {
                return servers.backup() + 'supplier/getAll'
            },
            getAllCustomer: function () {
                return servers.backup() + 'supplyInfo/listCustomer'
            },
            getAllBySupplier: function () {
                return servers.backup() + 'sendEntryHeader/getBySupplierCodeByPage'
            },
            getCustomer: function () {
                return servers.backup() + 'customer/getBySupplier'
            }
        },
        firmman: {
            getAllByPage: function () {
                return servers.backup() + 'supplyInfo/listSupplier'
            },
            update: function () {
                return servers.backup() + 'supplyInfo/updateSupplier'
            },
            getByCode: function () {
                return servers.backup() + 'supplyInfo/supplierDetail'
            },
            getAllBySupplierTypeByPage: function () {
                return servers.backup() + 'supplier/getBySupplierTypeByPage'
            },

        },
        staffman: {
            getAllByPage: function () {
                return servers.backup() + 'supplyInfo/listCustomer'
            },
            update: function () {
                return servers.backup() + 'supplyInfo/updateCustomer'
            },
            getByCode: function () {
                return servers.backup() + 'customer/customerDetail'
            },
        },
        companyman: {
            getAllByPage: function () {
                return servers.backup() + 'customer/listSupplier'
            },
            update: function () {
                return servers.backup() + 'customer/updateSupplier'
            },
            getByCode: function () {
                return servers.backup() + 'supplyInfo/supplierDetail'
            },
            getAllsupplierType: function () {
                return servers.backup() + 'supplierType/getAll'
            },
            deleteByCode: function () {
                return servers.backup() + 'supplier/deleteByCode'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'supplier/deleteByBatchCode'
            },
        },
        personman: {
            getAllByPage: function () {
                return servers.backup() + 'customer/listCustomer'
            },
            update: function () {
                return servers.backup() + 'customer/updateCustomer'
            },
            getByCode: function () {
                return servers.backup() + 'customer/customerDetail'
            },
            getAllsupplier: function () {
                return servers.backup() + 'supplier/getAll'
            },
        },
        role: {
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'role/getAllByLikeNameByPage'
            },
            add: function () {
                return servers.backup() + 'role/add'
            },
            update: function () {
                return servers.backup() + 'role/update'
            },
            deleteByCode: function () {
                return servers.backup() + 'role/deleteByCode'
            },
            getByCode: function () {
                return servers.backup() + 'role/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'role/getAll'
            },
            getAllByPage: function () {
                return servers.backup() + 'role/getAllByPage'
            },
            updateRoleModelOperations: function () {
                return servers.backup() + 'role/updateRoleModelOperations'
            },
            getAllRoleModelOperation: function () {
                return servers.backup() + 'role/getAllRoleModelOperation'
            },
            getOperationsByRoleCodeAndModelCode: function () {
                return servers.backup() + 'role/getOperationsByRoleCodeAndModelCode'
            }
        },
        user: {
            add: function () {
                return servers.backup() + 'user/add'
            },
            update: function () {
                return servers.backup() + 'user/update'
            },
            deleteByCode: function () {
                return servers.backup() + 'user/deleteByCode'
            },
            getByCode: function () {
                return servers.backup() + 'user/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'user/getAll'
            },
            getAllByPage: function () {
                return servers.backup() + 'user/getAllByPage'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'user/getAllByLikeNameByPage'
            },
            updateEnable: function () {
                return servers.backup() + 'user/updateEnable'
            },
            updateDepartmentCode: function () {
                return servers.backup() + 'user/updateDepartmentCode'
            },
            updateInteCircCard: function () {
                return servers.backup() + 'user/updateInteCircCard'
            },
            resetPassword: function () {
                return servers.backup() + 'user/resetPassword'
            },
            updatePassword: function () {
                return servers.backup() + 'user/updatePassword'
            },
            login: function () {
                return servers.backup() + 'user/login'
            },
            loginByInteCircCard: function () {
                return servers.backup() + 'user/loginByInteCircCard'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'user/deleteByBatchCode'
            },
            getByDepartmentCodeByPage: function () {
                return servers.backup() + 'user/getByDepartmentCodeByPage'
            },
            updateRoles: function () {
                return servers.backup() + 'user/updateRoles'
            },
            resetAllDefaultPassword: function () {
                return servers.backup() + 'user/resetAllDefaultPassword'
            }
        },
        customer: {
            listSupplier: function () {
                return servers.backup() + 'customer/listSupplier'
            },
            listCustomer: function () {
                return servers.backup() + 'customer/listCustomer'
            },
            updateSupplier: function () {
                return servers.backup() + 'customer/updateSupplier'
            },
            updateCustomer: function () {
                return servers.backup() + 'customer/updateCustomer'
            },
            addCustomer: function () {
                return servers.backup() + 'customer/addCustomer'
            },
            deleteCustomer: function () {
                return servers.backup() + 'customer/deleteCustomer'
            },
            deleteCustomerInBatch: function () {
                return servers.backup() + 'customer/deleteCustomerInBatch'
            },
            resetPassword: function () {
                return servers.backup() + 'customer/resetPassword'
            },
            changePassword: function () {
                return servers.backup() + 'customer/changePassword'
            },
            findByName: function () {
                return servers.backup() + 'customer/findByName'
            },
            login: function () {
                return servers.backup() + 'customer/login'
            },
            customerDetail: function () {
                return servers.backup() + 'customer/customerDetail'
            },
            getAllSuppliers: function () {
                return servers.backup() + 'customer/getAllSuppliers'
            },
            resetAllDefaultPassword: function () {
                return servers.backup() + 'customer/resetAllDefaultPassword'
            }
        },
        manufacturer: {
            getAllByPage: function () {
                return servers.backup() + 'manufacturer/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'manufacturer/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'manufacturer/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'manufacturer/update'
            },
            getByCode: function () {
                return servers.backup() + 'manufacturer/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'manufacturer/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'manufacturer/deleteByBatchCode'
            },
        },
        guideHeader: {
            getAllByPage: function () {
                return servers.backup() + 'guideHeader/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'guideHeader/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'guideHeader/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'guideHeader/update'
            },
            getByCode: function () {
                return servers.backup() + 'guideHeader/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'guideHeader/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'guideHeader/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'guideHeader/getAll'
            },

        },
        archive: {
            getAllByPage: function () {
                return servers.backup() + 'archive/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'archive/add'
            },
            deleteByCode: function () {
                return servers.bcup() + 'archive/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'archive/update'
            },
            getByCode: function () {
                return servers.backup() + 'archive/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'archive/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'archive/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'archive/getAll'
            }

        },
        repair: {
            listApplicationsInPages: function () {
                return servers.backup() + 'equipment/listApplicationsInPages'
            },
            findByFlagInPages: function () {
                return servers.backup() + 'equipment/findByFlagInPages'
            },
            findByApplicationTimeInPages: function () {
                return servers.backup() + 'equipment/findByApplicationTimeInPages'
            },
            findByEquipmentNameInPages: function () {
                return servers.backup() + 'equipment/findByEquipmentNameInPages'
            },
        },
        defaultpassword: {
            getAllByPage: function () {
                return servers.backup() + 'defaultPassword/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'defaultPassword/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'defaultPassword/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'defaultPassword/update'
            },
            getByCode: function () {
                return servers.backup() + 'defaultPassword/getByCode'
            },
            getAllByLikePasswordByPage: function () {
                return servers.backup() + 'defaultPassword/getAllByLikePasswordByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'defaultPassword/deleteByBatchCode'
            },
        },
        evaluation: {
            getAllByPage: function () {
                return servers.backup() + 'evaluation/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'evaluation/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'evaluation/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'evaluation/update'
            },
            getByCode: function () {
                return servers.backup() + 'evaluation/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'evaluation/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'evaluation/deleteByBatchCode'
            },
        },
        bound: {
            getAllByPage: function () {
                return servers.backup() + 'bound/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'bound/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'bound/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'bound/update'
            },
            getByCode: function () {
                return servers.backup() + 'bound/getByCode'
            },
            getAllByCodeLikeByPage: function () {
                return servers.backup() + 'bound/getAllByCodeLikeByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'bound/deleteByBatchCode'
            },
        },
        productline: {
            getAllByPage: function () {
                return servers.backup() + 'productLine/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'productLine/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'productLine/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'productLine/update'
            },
            getByCode: function () {
                return servers.backup() + 'productLine/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'productLine/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'productLine/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'productLine/getAll'
            }
        },
        // material: {
        //     getAllByPage: function () {
        //         return servers.backup() + 'material/getAllByPage'
        //     },
        //     add: function () {
        //         return servers.backup() + 'material/add'
        //     },
        //     deleteByCode: function () {
        //         return servers.backup() + 'material/deleteByCode'
        //     },
        //     update: function () {
        //         return servers.backup() + 'material/update'
        //     },
        //     getByCode: function () {
        //         return servers.backup() + 'material/getByCode'
        //     },
        //     getAllByLikeNameByPage: function () {
        //         return servers.backup() + 'material/getAllByLikeNameByPage'
        //     },
        //     deleteByBatchCode: function () {
        //         return servers.backup() + 'material/deleteByBatchCode'
        //     }
        // },

        materialIn: {
            getAllByPage: function () {
                return servers.backup() + 'godownEntryHeader/getAllByPage'
            },
            getAllByCode: function () {
                return servers.backup() + 'godownEntryHeader/getByCode'
            },
            getByBatchNumber: function () {
                return servers.backup() + 'godownEntryHeader/getByBatchNumber'
            },
            getAllSupplier: function () {
                return servers.backup() + 'supplier/getAll'
            },
            getBySupplierByPage: function () {
                return servers.backup() + 'godownEntryHeader/getBySupplierByPage'
            }
        },
        materialOut: {
            getAllByPage: function () {
                return servers.backup() + 'pickingApplyHeader/getAllByPage'
            },
            getByDepartmentAndProcessManageAndPickingStatusByPage: function () {
                return servers.backup() + 'pickingApplyHeader/getByDepartmentAndProcessManageAndPickingStatusByPage'
            },
            getByCode: function () {
                return servers.backup() + 'pickingApplyHeader/getByCode'
            }

        },
        productIn: {
            getAllByPage: function () {
                return servers.backup() + 'productGodownHeader/getAllByPage'
            },

            getByCode: function () {
                return servers.backup() + 'productGodownHeader/getByCode'
            },
            getByStatusByPage: function () {
                return servers.backup() + 'productGodownHeader/getByStatusByPage'
            },

        },
        productOut: {
            getAllByPage: function () {
                return servers.backup() + 'productSendHeader/getAllByPage'
            },
            getAllrawType: function () {
                return servers.backup() + 'rawType/getAll'
            },
            getByAuditStatusAndRawTypeAndCreateDateByPage: function () {
                return servers.backup() + 'productSendHeader/getByAuditStatusAndRawTypeAndCreateDateByPage'
            },
            deleteByCode: function () {
                return servers.backup() + 'productSendHeader/deleteByCode'
            },
            deleteByCodeBatch: function () {
                return servers.backup() + 'productSendHeader/deleteByCodeBatch'
            },
            getByCode: function () {
                return servers.backup() + 'productSendHeader/getByCode'
            },
            update: function () {
                return servers.backup() + 'productSendHeader/update'
            },
            add: function () {
                return servers.backup() + 'productSendHeader/add'
            },
            getByProductSendHeader: function () {
                return servers.backup() + 'productSendAudit/getByProductSendHeader'
            },

            getDetail: function () {
                return servers.backup() + 'available/getByRawTypeCodeAndBatchNumberLikeByPage'
            },
            updateAuditStatusByCode: function () {
                return servers.backup() + 'productSendHeader/updateAuditStatusByCode'
            }
        },
        plateAudit: {
            getByRawType: function () {
                return servers.backup() + '/lossEntryHeader/getByRawType'
            },
            getAudit: function () {
                return servers.backup() + '/lossEntryHeader/audit'
            },
            getRestAuditorByCode: function () {
                return servers.backup() + '/lossEntryHeader/getRestAuditorByCode'
            }
        },
        plateAlarm: {
            getAllByPage: function () {
                return servers.backup() + '/materialsTotal/getAllByPage'
            },
            getByWarnStatusByPage: function () {
                return servers.backup() + '/materialsTotal/getByWarnStatusByPage'
            },
            getByStatusByPage: function () {
                return servers.backup() + '/materialsTotal/getByStatusByPage'
            }
        },
        productOrder:{
            deleteByIdBatch: function () {
                return servers.backup() + '/productOrder/deleteByIdBatch'
            },
            getAllByPage: function () {
                return servers.backup() + '/productOrder/getAllByPage'
            },
            getByBatchNumberLikeByPage: function () {
                return servers.backup() + '/productOrder/getByBatchNumberLikeByPage'
            },
            deleteByCode: function () {
                return servers.backup() + '/productOrder/deleteByCode'
            },
            getById: function () {
                return servers.backup() + '/productOrder/getById'
            }
        }
        ,
        lingLiao: {
            getAllByPage: function () {
                return servers.backup() + 'pickingApplyHeader/getAllByPage'
            },
            getAll: function () {
                return servers.backup() + 'processManage/getAll'
            },
            deleteByCode: function () {
                return servers.backup() + 'pickingApplyHeader/deleteByCode'
            },
            getByCode: function () {
                return servers.backup() + 'pickingApplyHeader/getByCode'
            },
            getByProcessManageByPage: function () {
                return servers.backup() + 'pickingApplyHeader/getByAuditStatusAndProcessManageByPage'
            },
            update: function () {
                return servers.backup() + 'pickingApplyHeader/update'
            },
            deleteByBatchCodeBatchCode: function () {
                return servers.backup() + 'pickingApplyHeader/deleteByBatchCode'
            },
            getAllrawType: function () {
                return servers.backup() + 'rawType/getAll'
            },
            getDetail: function () {
                return servers.backup() + 'available/getByRawTypeCodeAndBatchNumberLikeByPage'
            },
            add: function () {
                return servers.backup() + 'pickingApplyHeader/add'
            },

        },
        equipment: {
            getAllByPage: function () {
                return servers.backup() + 'equipment/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'equipment/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'equipment/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'equipment/update'
            },
            getByCode: function () {
                return servers.backup() + 'equipment/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'equipment/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'equipment/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'equipment/getAll'
            }
        },
        process: {
            getAllByPage: function () {
                return servers.backup() + 'process/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'process/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'process/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'process/update'
            },
            getByCode: function () {
                return servers.backup() + 'process/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'process/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'process/deleteByBatchCode'
            },
        },
        goods: {
            getAllByPage: function () {
                return servers.backup() + 'goods/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'goods/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'goods/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'goods/update'
            },
            getByCode: function () {
                return servers.backup() + 'goods/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'goods/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'goods/deleteByBatchCode'
            },
        },
        company: {
            getAllByPage: function () {
                return servers.backup() + 'company/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'supplier/add'
            },
            update: function () {
                return servers.backup() + 'company/update'
            },
            getByCode: function () {
                return servers.backup() + 'company/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'company/getAllByLikeNameByPage'
            },
            getAllCompany: function () {
                return servers.backup() + 'company/getAll'
            },
            deleteByCode: function () {
                return servers.backup() + 'supplier/deleteByCode'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'supplier/deleteByBatchCode'
            },
        },
        workshop: {
            getAllByPage: function () {
                return servers.backup() + 'workshop/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'workshop/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'workshop/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'workshop/update'
            },
            getByCode: function () {
                return servers.backup() + 'workshop/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'workshop/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'workshop/deleteByBatchCode'
            },
        },
        indicator: {
            getAllByPage: function () {
                return servers.backup() + 'indicator/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'indicator/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'indicator/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'indicator/update'
            },
            getByCode: function () {
                return servers.backup() + 'indicator/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'indicator/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'indicator/deleteByBatchCode'
            },
            getAll: function () {
                return servers.backup() + 'indicator/getAll'
            },
        },
        duty: {
            getAllByPage: function () {
                return servers.backup() + 'duty/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'duty/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'duty/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'duty/update'
            },
            getByCode: function () {
                return servers.backup() + 'duty/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'duty/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'duty/deleteByBatchCode'
            },
        },
        cycle: {
            getAllByPage: function () {
                return servers.backup() + 'cycle/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'cycle/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'cycle/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'cycle/update'
            },
            getByCode: function () {
                return servers.backup() + 'cycle/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'cycle/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'cycle/deleteByBatchCode'
            },
        },
        processstatus: {
            getAllByPage: function () {
                return servers.backup() + 'process/getAllByPage'
            },
            add: function () {
                return servers.backup() + 'process/add'
            },
            deleteByCode: function () {
                return servers.backup() + 'process/deleteByCode'
            },
            update: function () {
                return servers.backup() + 'process/update'
            },
            getByCode: function () {
                return servers.backup() + 'process/getByCode'
            },
            getAllByLikeNameByPage: function () {
                return servers.backup() + 'process/getAllByLikeNameByPage'
            },
            deleteByBatchCode: function () {
                return servers.backup() + 'process/deleteByBatchCode'
            },
        },
        product: {
            updatePublishByCode: function () {
                return servers.backup() + 'product/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'product/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'product/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'product/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'product/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'product/getByLikeBatchNumberByPage'
            }
        },
        productPublish: {
            getAllByPage: function () {
                return servers.backup() + 'product/getAllByStatusCodeByPage'
            }
            , getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'product/getByLikeBatchNumberByPage'
            }
            , productPublish: function () {
                return servers.backup() + 'product/updatePublishByCode'
            }
        },
        rawPresoma: {
            // 金弛622 前驱体
            updatePublishByCode: function () {
                return servers.backup() + 'rawPresoma/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'rawPresoma/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'rawPresoma/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'rawPresoma/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'rawPresoma/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'rawPresoma/getByLikeBatchNumberByPage'
            }
        },
        rawLithium: {
            // 碳酸锂
            updatePublishByCode: function () {
                return servers.backup() + 'rawLithium/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'rawLithium/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'rawLithium/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'rawLithium/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'rawLithium/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'rawLithium/getByLikeBatchNumberByPage'
            }
        },
        processPremix: {
            // 预混
            updatePublishByCode: function () {
                return servers.backup() + 'processPremix/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'processPremix/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'processPremix/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'processPremix/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processPremix/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'processPremix/getByLikeBatchNumberByPage'
            }
        },
        processSize: {
            // 粉碎粒度
            updatePublishByCode: function () {
                return servers.backup() + 'processSize/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'processSize/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'processSize/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'processSize/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processSize/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'processSize/getByLikeBatchNumberByPage'
            }
        },
        processLithium: {
            // 粉碎总锂
            updatePublishByCode: function () {
                return servers.backup() + 'processLithium/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'processLithium/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'processLithium/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'processLithium/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processLithium/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'processLithium/getByLikeBatchNumberByPage'
            }
        },
        processBuckle: {
            // 扣电
            updatePublishByCode: function () {
                return servers.backup() + 'processBuckle/updatePublishByCode'
            },
            updateAuditByCode: function () {
                return servers.backup() + 'processBuckle/updateAuditByCode'
            },
            getByCode: function () {
                return servers.backup() + 'processBuckle/getByCode'
            },
            getAll: function () {
                return servers.backup() + 'processBuckle/getAll'
            },
            getAllByStatusCodeByPage: function () {
                return servers.backup() + 'processBuckle/getAllByStatusCodeByPage'
            },
            getByLikeBatchNumberByPage: function () {
                return servers.backup() + 'processBuckle/getByLikeBatchNumberByPage'
            }
        }
        , operation: {
            getAll: function () {
                return servers.backup() + 'operation/getAll'
            }
        }
    }
    ,bowlAbnormal:{
        getAllByPage: function () {
            return servers.backup() + 'bowlAbcount/getAllByPage'
        },
        add: function () {
            return servers.backup() + 'bowlAbcount/add'
        },
        deleteByCode: function () {
            return servers.backup() + 'bowlAbcount/deleteByCode'
        },
        update: function () {
            return servers.backup() + 'bowlAbcount/update'
        },
        getByBowlCodeLikeByPage: function () {
            return servers.backup() + 'bowlAbcount/getByBowlCodeLikeByPage'
        },
        deleteByIdBatch: function () {
            return servers.backup() + 'bowlAbcount/deleteByIdBatch'
        },
        getById: function () {
            return servers.backup() + 'bowlAbcount/getById'
        }
    }
    ,casketSampling:{
        deleteByIdBatch: function () {
            return servers.backup() + 'bowlSampling/deleteByIdBatch'
        },
        getAllByPage: function () {
            return servers.backup() + 'bowlSampling/getAllByPage'
        },
        getByBowlCodeLikeByPage: function () {
            return servers.backup() + 'bowlSampling/getByBowlCodeLikeByPage'
        },
        deleteByCode: function () {
            return servers.backup() + 'bowlSampling/deleteByCode'
        },
        getById: function () {
            return servers.backup + 'bowlSampling/getById'
        },
        add: function () {
            return servers.backup() + 'bowlSampling/add'
        },
        deleteByIdBatch: function () {
            return servers.backup() + 'bowlSampling/deleteByIdBatch'
        },
    }
    ,screenCheck:{
        deleteByIdBatch: function () {
            return servers.backup() + 'screenCheck/deleteByIdBatch'
        },
        getAllByPage: function () {
            return servers.backup() + 'ingredientsRecord/getAllByPage'
        },
        getByBowlCodeLikeByPage: function () {
            return servers.backup() + 'screenCheck/getByBowlCodeLikeByPage'
        },
        deleteByCode: function () {
            return servers.backup() + 'screenCheck/deleteByCode'
        },
        getById: function () {
            return servers.backup + 'screenCheck/getById'
        },
        add: function () {
            return servers.backup() + 'screenCheck/add'
        },
        deleteByIdBatch: function () {
            return servers.backup() + 'screenCheck/deleteByIdBatch'
        },
    }
    /** start */
    , menu3Clicks: null  //所有的一级菜单点击栏
    , menu2Clicks: null  //所有的二级菜单点击栏
    , menu1Clicks: null  //所有的三级菜单点击栏
    , menu3s: []
    , menu2s: []
    , menu1s: []
    , WI1s: []
    , WI2s: []
    , WI3s: []
    , WI4s: []
    , TI1s: []
    , TI2s: []
    , RI1s: []
    , RI2s: []
    , _41s: []
    , _43s: []
    , _44s: []
    , Ss: []
    , Tms: []
    , LXJB: []
    , LXJA: []
    , Tibs: []
    , Tias: []
    , Afs: []
    , Bfs: []
    , menu1Wrapper: null
    , menu2Wrapper: null
    , monitor_data: null
    , realdata_interval: []
    , singlePage_interval: []
    , user: null
    , operations: []
    /** end */
    /**
     *  初始化函数
     * @param userJson  session中存储的用户信息
     * @param menu1Wrapper 用来包装一级菜单的块
     * @param menu2Wrapper 用来包装二级菜单的块
     * @hides 代表所有三级菜单点击后显示的内容的id
     */
    , init: function (userJson, menu1Wrapper, menu2Wrapper) {
        /** 头像显示事件绑定 */
        // home.funcs.bindClickEventForAvatar($('#user-info-hover'), $("#hover-body"))
        home.menu1Wrapper = menu1Wrapper
        home.menu2Wrapper = menu2Wrapper

        /** 获取session用户信息 */
        const user = userJson
        home.user = userJson
        var roles = user.roles //获取用户角色
        $("#currentUser").text(home.user.name + " ")
        $('#user-id').text(user.code)

        var menu1codes = []//用户一级菜单去重
        var menu2codes = []//用于二级菜单去重

        /** 遍历用户的角色,从何获取一二三级菜单,填充home.menu1s,home.menu2s,home.menu3s */
        roles.forEach(function (element) {//遍历所有roles
            /**遍历用户的三级菜单*/
            element.models.forEach(function (ele) {
                home.menu3s.push(ele)
                var menu1code = ele.menu1.code
                var menu2code = ele.menu2.code
                /**去重menu1*/
                if (menu1codes.indexOf(menu1code) == -1) {
                    menu1codes.push(menu1code)
                    home.menu1s.push(ele.menu1)
                }
                /**去重menu2*/
                if (menu2codes.indexOf(menu2code) == -1) {
                    menu2codes.push(menu2code)
                    home.menu2s.push(ele.menu2)
                }
            })
        })
        /** $$$ 此处已经获取到用户的所有的一级菜单，二级菜单，三级菜单,分别存储在数组munu1s, menu2s, models中,无重复 $$$*/
        /** 给一级菜单进行排序,通过一级菜单的rank进行排序 */
        home.menu1s.sort(function (a, b) {
            return a.rank - b.rank
        })

        /** 遍历一级菜单,然后给一级菜单的容器填充一级菜单,并且给selected菜单添加样式 */
        home.menu1s.forEach(function (element, index) {
            var path = element.path
            if (path.indexOf('10') > -1)
                home.menu1Wrapper.append("<li id='menu1-li-" + (element.code) + "'class='menu1-tab-bar'><div class='fl'><img src='../" + (path) + "' alt='' width='25px' height='25px' style='position:relative;top: -2px;left: 10px;'></div><a href='#'>" + home.menu1s[index].name + "</a></li>", null)
            else {
                home.menu1Wrapper.append("<li id='menu1-li-" + (element.code) + "'class='menu1-tab-bar'><div class='fl'><img src='../" + (path) + "' alt='' width='20px' height='20px' style='position:relative;top: -2px;left: 10px;'></div><a href='#'>" + home.menu1s[index].name + "</a></li>", null)
            }
        })
        /** ########这里是记录123级菜单的关键,########*/
        /** ########这里是记录123级菜单的关键,########*/
        /** ########这里是记录123级菜单的关键,########*/
        /** ########这里是记录123级菜单的关键,########*/

        //
        var selectedMenu1 = localStorage.getItem('selectedMenu1') || $(home.menu1Wrapper.children('li')[0]).attr('id').substr(9)   //选中的一级菜单ID 默认为1
        var selectedMenu2 = localStorage.getItem('selectedMenu2') || null //选中的二级菜单ID
        var selectedMenu3 = localStorage.getItem('selectedMenu3') || null  //选中三级菜单ID
        /** ########这里是记录123级菜单的关键,########*/
        /** ########这里是记录123级菜单的关键,########*/
        /** ########这里是记录123级菜单的关键,########*/
        /** ########这里是记录123级菜单的关键,########*/

        /** 给选中的一级菜单追加默认selected类标签,也就是默认样式 */
        $('#menu1-li-' + selectedMenu1).addClass('li-selected')
        home.menu1Clicks = home.menu1Wrapper.children('.menu1-tab-bar')
        /** 绑定一级菜单点击事件 */
        home.funcs.bindClickAndMouseEventForMenu1s()
        /** 给selected状态的一级菜单设置默认状态,包括填充2级菜单、给其所有的二级菜单追加三级菜单和绑定事件*/
        var selectedMenu1Code = $('.li-selected').attr('id').substr(9)
        /**获取selected状态的一级菜单的二级菜单*/
        var menu2ToSelected = home.funcs.getMenu2ListByMenu1Code(selectedMenu1Code)
        /** 填充二级菜单并且携带3级菜单 */
        home.funcs.appendMenu2sToWrapperAndCarryModels(menu2ToSelected)

        /** 绑定退出登录时间 */
        var $exit = $('#exit')
        home.funcs.handleLogout($exit)
    }//$init()
    , funcs: {
        /** 给一级菜单绑定点击事件 */
        bindClickAndMouseEventForMenu1s: function () {
            home.menu1Clicks.on('mouseenter', function () {
                $(this).addClass('blue')
            }).on('mouseleave', function () {
                $(this).removeClass('blue')
            }).on('click', function () {
                /** 首先清除interval */
                home.funcs.clearIntervals(home.realdata_interval)
                /** 点击二级菜单必须要把所有的展示框移除 */
                $('.display-component-container').remove()

                /** 记住当前一级菜单 */
                localStorage.setItem('selectedMenu1', $(this).attr('id').substr(9))
                localStorage.setItem('selectedMenu2', null)
                localStorage.setItem('selectedMenu3', null)

                /** 首先将上一次selected的标签移除样式,然后给当前点击元素追加样式 */
                $('.menus1 .li-selected').removeClass('li-selected')
                $('#menu1-li-' + localStorage.getItem('selectedMenu1')).addClass('li-selected')

                /** 通过一级菜单的code获取二级菜单 */
                const menu1code = localStorage.getItem('selectedMenu1')
                var menu2ToSelf = home.funcs.getMenu2ListByMenu1Code(menu1code)

                /** 将二级菜单填充到框内并且给2级菜单都绑定弹出3级菜单的事件 */
                home.funcs.appendMenu2sToWrapperAndCarryModels(menu2ToSelf)
            })//$().on
        },

        /** 通过一级菜单的code获取其下的所有二级菜单 */
        getMenu2ListByMenu1Code: function (selectedMenu1Code) {
            var menu2ToMenu1 = home.menu2s.filter(function (ele) {
                return ele.menu1.code == selectedMenu1Code
            })
            menu2ToMenu1.sort(function (a, b) {
                return a.rank - b.rank
            }) //一级菜单排序
            return menu2ToMenu1
        }

        /** 将二级菜单填充到二级菜单的容器 */
        , appendMenu2sToWrapperAndCarryModels: function (Menu2List) {
            /** 首先清空menu2wrapper的内容 */
            home.menu2Wrapper.empty()
            /** 开始填充2级菜单 */
            Menu2List.forEach(function (element, index) {
                home.menu2Wrapper.append(
                    "<div id='menu2-li-" + (element.code) + "' class='menu2-tab-bar'>" +
                    "<li class='menu2-tab-bar-item'>" +
                    "<i class='fa fa-caret-right'></i> &nbsp" +
                    "<a href='#'>" + Menu2List[index].name + "</a>" +
                    "</li>" +
                    "</div>" +
                    "<div id='menu2-li-hide-" + (element.code) + "'class='hide models'>" +
                    "<ul></ul>" +
                    "</div>", null)
            })
            /** 当前一级菜单下的所有的2级菜单 */
            home.menu2Clicks = $('.menu2-tab-bar')
            var selectedMenu2Code = localStorage.getItem('selectedMenu2')//用的二级菜单保存记录,如果有点击过2级菜单,此处就有值,否则为null
            /** 如果记录了用户的二级菜单,执行下面的逻辑 */
            if (selectedMenu2Code != null && localStorage.getItem('selectedMenu3') != 'null') {
                var selectedTabBarId = 'menu2-li-' + selectedMenu2Code
                var selectedTabBarItem = $('#' + selectedTabBarId) //二级菜单
                selectedTabBarItem.next().removeClass('hide')//三级菜单显示
                selectedTabBarItem.find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down')//todo
                var Menu3List = home.menu3s.filter(function (ele) {
                    return ele.menu2.code == selectedMenu2Code
                })
                Menu3List.sort(function (a, b) {
                    return a.rank - b.rank
                })

                var modelWrapper = selectedTabBarItem.next().children('ul')
                modelWrapper.empty()
                Menu3List.forEach(function (element, index) {
                    modelWrapper.append("<li id='menu3-li-" + (element.code) + "' class='menu3-tab-bar whiteFontMenu3'><a href='#'>" + Menu3List[index].name + "</a></li>", null)
                })
                $('#menu3-li-' + localStorage.getItem('selectedMenu3')).addClass('chosenMenu3')
                /** 三级菜单都添加完毕,需要把后面html加载进来*/
                var path = "../components/html/" + localStorage.getItem('selectedMenu3') + ".html"
                var $right = $('.right')
                /** 加载页面,之后也要显示实时数据 */
                $right.load(path)
                /** 页面上刷新时实时数据显示 */
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/

                if (localStorage.getItem('selectedMenu2') == '3') {
                    var signal = Number(localStorage.getItem('selectedMenu3'))
                    switch (signal) {
                        case 5 :
                            (function () {
                                /** 页面重新加载的时候会立马加载数据，然后开启interval */
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render0()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 6 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render1()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 7 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render2()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 8 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render3()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 9 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render4()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 10 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render5()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 11 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render6()
                                    })
                                }, 1000))
                            })();
                            break;
                        case 12 :
                            (function () {
                                home.funcs.renderHandler(signal)
                                home.realdata_interval.push(setInterval(function () {
                                    $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                                        home.funcs.storeData(result)
                                        home.funcs.render7()
                                    })
                                }, 1000))
                            })();
                            break;
                    }
                }

                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/
                /** -------------------------------------------------------------------------------------*/

                /**如果记忆中的二级菜单是在线监视,那么就开始显示实时数据*/
                home.menu3Clicks = modelWrapper.children('li')
                home.funcs.addModelClickEvent()
            }

            /** 初始化的时候给记忆中的二级菜单添加chosenMenu2类 */
            var menu2Id = '#menu2-li-' + localStorage.getItem('selectedMenu2')
            $(menu2Id).addClass('chosenMenu2')

            /** 给所有的二级菜单追加点击事件 */
            home.funcs.addMenu2ClickEvent()
        }
        /** 给2级菜单添加点击事件 */
        , addMenu2ClickEvent: function () {
            /** 先删除所有绑定的事件 */
            home.menu2Clicks.off('click')
            home.menu2Clicks.on('click', function () {
                home.funcs.clearIntervals(home.realdata_interval)
                /** 点击二级菜单必须要把所有的展示框移除 */
                $('.display-component-container').remove()

                /** 以下是2级菜单样式切换逻辑 点击一个关闭其他*/
                localStorage.setItem('selectedMenu2', $(this).attr('id').substr(9))
                localStorage.setItem('selectedMenu3', null)


                var menu2Id = 'menu2-li-' + localStorage.getItem('selectedMenu2')

                if ($('.chosenMenu2').attr('id') !== menu2Id) {
                    $('.chosenMenu2').next().addClass('hide')
                    $('.chosenMenu2').find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right')
                }
                $('.chosenMenu2').removeClass('chosenMenu2')
                $('#' + menu2Id).addClass('chosenMenu2')
                const _this_next = $('#' + menu2Id).next()
                _this_next.attr('class').indexOf('hide') > -1 ?
                    (function () {
                        _this_next.removeClass('hide')
                        $('#' + menu2Id).find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down')
                    })() :
                    (function () {
                        _this_next.addClass('hide')
                        $('#' + menu2Id).find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right')
                    })()


                /** 获取3级菜单wrapper */
                var modelWrapper = _this_next.children('ul')
                /** 二级菜单隐藏的三级菜单的id */
                var menu2HideCode = _this_next.attr('id').substr(14)
                /** 当前二级菜单下所有三级菜单的集合 */
                var Menu3List = home.menu3s.filter(function (ele) {
                    return ele.menu2.code == menu2HideCode
                })
                Menu3List.sort(function (a, b) {
                    return a.rank - b.rank
                })
                /** 填充三级菜单 */
                modelWrapper.empty()
                Menu3List.forEach(function (element, index) {
                    modelWrapper.append("<li id='menu3-li-" + (element.code) + "'  class='menu3-tab-bar whiteFontMenu3'><a href='#'>" + Menu3List[index].name + "</a></li>", null)
                })
                /** $$ 此处3级菜单已经填充完毕 */
                home.menu3Clicks = modelWrapper.children('li')

                /** 追加三级菜单点击事件 */
                home.funcs.addModelClickEvent()
            })
        }

        /** 三级菜单点击事件 */
        , addModelClickEvent: function () {
            $('.layui-laypage').remove()
            home.menu3Clicks.off('click')
            /** 首先加载展示层页面 */
            home.menu3Clicks.on('click', function () {
                $('.chosenMenu3').removeClass('chosenMenu3')
                $(this).addClass('chosenMenu3')
                /** 记录用户点击3级菜单的事件 */
                localStorage.setItem('selectedMenu3', $(this).attr('id').substr(9))
                /** 获取展示框并且展示3级菜单对应的内容 */
                var $right = $('.right')
                var index = localStorage.getItem('selectedMenu3')
                var path = "../components/html/" + index + ".html"
                $right.load(path)
            })
            /** -------------------------------------------------------------------------------------*/
            /** -------------------------------------------------------------------------------------*/
            /** -------------------------------------------------------------------------------------*/
            /** -------------------------------------------------------------------------------------*/
            /** -------------------------------------------------------------------------------------*/
            /** -------------------------------------------------------------------------------------*/
            /** 此处是在线监视模块所需内容,其他开发模块清忽略此内容 */
            if ($(home.menu3Clicks[0]).attr('id').substr(9) == 5) {
                /** 如果说当前二级菜单的第一个三级菜单的id对应的是5,那么就给他们一次绑定点击事件 */
                // console.log('因为menu3Clicks中刚好是在线监视的所有3级菜单模块,所以会在这一块加载数据')
                $(home.menu3Clicks[0]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(0)
                })
                $(home.menu3Clicks[1]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(1)
                })
                $(home.menu3Clicks[2]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(2)
                })
                $(home.menu3Clicks[3]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(3)
                })
                $(home.menu3Clicks[4]).on('click', function () {

                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(4)
                    // console.log('打印所有的可能存在的存值span')
                })
                $(home.menu3Clicks[5]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(5)
                })
                $(home.menu3Clicks[6]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(6)
                })
                $(home.menu3Clicks[7]).on('click', function () {
                    // console.log('点击3级菜单的时候会先清除load-real-data事件,然后再添加load-real-data事件')
                    home.funcs.clearIntervals(home.realdata_interval)
                    // console.log('开始执行load-real-data事件')
                    home.funcs.loadRealData(7)
                })
            }
        }
        , storeData: function (result) {
            home.monitor_data = result.data
            home.WI1s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('WI_1') !== -1
            })
            home.WI2s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('WI_2') !== -1
            })
            home.TI1s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('TI_1') !== -1
            })
            home.RI1s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('RI_1') !== -1
            })
            home.Ss = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('SI') !== -1
            })
            home._41s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('41') === 0
            })
            home._43s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('43') === 0
            })
            home._44s = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('44') === 0
            })
            home.Ss = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('SI') !== -1
            })
            home.Ss = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('SI') !== -1
            })
            home.Tms = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('TM') !== -1
            })
            home.LXJB = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('LXJB') !== -1
            })
            home.LXJA = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('LXJA') !== -1
            })
            home.Tibs = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('TIB') !== -1
            })
            home.Tias = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('TIA') !== -1
            })
            home.Afs = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('AFS') !== -1
            })
            home.Bfs = home.monitor_data.filter(function (ele) {
                return ele.weihao.indexOf('BFS') !== -1
            })
        }
        , renderHandler: function (signal) {
            $.get(home.urls.monitor_online.loadData(), {}, function (result) {
                home.funcs.storeData(result)
                /** 开始打印数据 */
                console.log("signal", signal)
                switch (signal) {
                    case 0 :
                        (function () {
                            home.funcs.render0()
                        })();
                        break;

                    case 1:
                        (function () {
                            home.funcs.render1()
                        })();
                        break;

                    case 2 :
                        (function () {
                            home.funcs.render2()
                        })();
                        break;

                    case 3 :
                        (function () {
                            home.funcs.render3()
                        })();
                        break;
                    case 4 :
                        (function () {
                            home.funcs.render4()
                        })();
                        break;
                    case 5 :
                        (function () {
                            home.funcs.render5()
                        })();
                        break;
                    case 6 :
                        (function () {
                            home.funcs.render6()
                        })();
                        break;
                    case 7 :
                        (function () {
                            home.funcs.render7()
                        })();
                        break;
                }
                /** 可以在此处打印home.WI1s或其他域 */
            })
        }
        , loadRealData: function (signal) {
            home.funcs.renderHandler(signal)
            /** 在开启定时之前,必须要先加载一次 */
            home.realdata_interval.push(setInterval(function () {
                home.funcs.renderHandler(signal)
            }, 1000))
        }
        , render0: function () {
            $("#TI_1001_T")[0].innerHTML = home.TI1s[0].value
            $("#TI_1001_R")[0].innerHTML = home.RI1s[0].value
            $("#TI_1002_T")[0].innerHTML = home.TI1s[1].value
            $("#TI_1002_R")[0].innerHTML = home.RI1s[1].value
            $("#WI_1001_W")[0].innerHTML = home.WI1s[0].value
            $("#WI_1002_W")[0].innerHTML = home.WI1s[1].value
            $("#WI_1003_W")[0].innerHTML = home.WI1s[2].value
            $("#WI_1004_W")[0].innerHTML = home.WI1s[3].value
        }
        , render1: function () {
            $("#TI_1003_T")[0].innerHTML = home.TI1s[2].value
            $("#TI_1003_R")[0].innerHTML = home.RI1s[2].value
            $("#WI_1007_W")[0].innerHTML = home.WI1s[6].value
            $("#41_W136")[0].innerHTML = home._41s[0].value
            $("#41_W148")[0].innerHTML = home._41s[1].value
            $("#41W_W104")[0].innerHTML = home._41s[6].value
            $("#41W_W120")[0].innerHTML = home._41s[9].value
            $("#41W_W108")[0].innerHTML = home._41s[7].value
            $("#41W_W124")[0].innerHTML = home._41s[10].value
            $("#41W_W112")[0].innerHTML = home._41s[8].value
            $("#41W_W128")[0].innerHTML = home._41s[11].value
            $("#41W_W164")[0].innerHTML = home._41s[12].value
            $("#41W_W168")[0].innerHTML = home._41s[13].value
            $("#41_WI1")[0].innerHTML = home._41s[4].value
            $("#41_WI2")[0].innerHTML = home._41s[5].value
        }
        , render2: function () {
            $("#WI_1006_W")[0].innerHTML = home.WI1s[5].value
            $("#TI_1006_T")[0].innerHTML = home.TI1s[5].value
            $("#TI_1006_R")[0].innerHTML = home.RI1s[5].value
            $("#TI_1005_T")[0].innerHTML = home.TI1s[4].value
            $("#TI_1005_R")[0].innerHTML = home.RI1s[4].value
            $("#43_W352_1")[0].innerHTML = home._43s[0].value
            $("#43_W352_2")[0].innerHTML = home._43s[0].value
            $("#43W_W316")[0].innerHTML = home._43s[7].value
            $("#43W_W300")[0].innerHTML = home._43s[3].value
            $("#43W_W320")[0].innerHTML = home._43s[8].value
            $("#43W_W304")[0].innerHTML = home._43s[4].value
            $("#43W_W324")[0].innerHTML = home._43s[9].value
            $("#43W_W308")[0].innerHTML = home._43s[5].value
            $("#43W_W328")[0].innerHTML = home._43s[10].value
            $("#43W_W312")[0].innerHTML = home._43s[6].value
            $("#43_WI1")[0].innerHTML = home._43s[1].value
            $("#43_WI2")[0].innerHTML = home._43s[2].value
        }
        , render3: function () {
            $("#WI_1005_W")[0].innerHTML = home.WI1s[4].value
            $("#44_vd136")[0].innerHTML = home._44s[0].value
            $("#44_vd148")[0].innerHTML = home._44s[1].value
            $("#44RW_vd104")[0].innerHTML = home._44s[6].value
            $("#44RW_vd120")[0].innerHTML = home._44s[9].value
            $("#44RW_vd108")[0].innerHTML = home._44s[7].value
            $("#44RW_vd124")[0].innerHTML = home._44s[10].value
            $("#44RW_vd112")[0].innerHTML = home._44s[8].value
            $("#44RW_vd128")[0].innerHTML = home._44s[11].value
            $("#44RW_vd164")[0].innerHTML = home._44s[12].value
            $("#44RW_vd168")[0].innerHTML = home._44s[13].value
            $("#44_WI1")[0].innerHTML = home._44s[4].value
            $("#44_WI2")[0].innerHTML = home._44s[5].value
        }
        , render4: function () {
            $("#WI_1013_W")[0].innerHTML = home.WI1s[12].value
            $("#TI_1009_T")[0].innerHTML = home.TI1s[8].value
            $("#TI_1009_R")[0].innerHTML = home.RI1s[8].value
        }
        , render5: function () {
            $("#WI_2202b")[0].innerHTML = home.WI2s[1].value
            $("#WI_2202a")[0].innerHTML = home.WI2s[0].value
            $("#WI_2204b")[0].innerHTML = home.WI2s[3].value
            $("#WI_2204a")[0].innerHTML = home.WI2s[2].value
            $("#SI_2203b")[0].innerHTML = home.Ss[1].value
            $("#SI_2203a")[0].innerHTML = home.Ss[0].value
            $("#LXJB_jineiPI")[0].innerHTML = home.LXJB[1].value
            $("#LXJB_qikongPI")[0].innerHTML = home.LXJB[2].value
            $("#LXJB_yangqiFI")[0].innerHTML = home.LXJB[5].value
            $("#LXJA_jineiPI")[0].innerHTML = home.LXJA[1].value
            $("#LXJA_qikongPI")[0].innerHTML = home.LXJA[2].value
            $("#LXJA_yangqiFI")[0].innerHTML = home.LXJA[5].value
            $("#TM_2203b")[0].innerHTML = home.Tms[1].value
            $("#TM_2203a")[0].innerHTML = home.Tms[0].value
            $("#TIB_wuliao")[0].innerHTML = home.Tms[0].value
            $("#TIA_wuliao")[0].innerHTML = home.Tms[0].value
        }
        , render6: function () {
            $("#AFS_VD24")[0].innerHTML = parseFloat(home.Afs[4].value).toFixed(2)
            $("#AFS_VD568")[0].innerHTML = parseFloat(home.Afs[14].value).toFixed(2)
            $("#AFS_VD576")[0].innerHTML = parseFloat(home.Afs[15].value).toFixed(2)
            $("#AFS_VD6")[0].innerHTML = parseFloat(home.Afs[1].value).toFixed(2)
            $("#AFS_VD12")[0].innerHTML = parseFloat(home.Afs[2].value).toFixed(2)
            $("#AFS_VD30")[0].innerHTML = parseFloat(home.Afs[5].value).toFixed(2)
            $("#AFS_VD18")[0].innerHTML = parseFloat(home.Afs[3].value).toFixed(2)
            $("#AFS_VD536")[0].innerHTML = parseFloat(home.Afs[10].value).toFixed(2)
            $("#AFS_VD544")[0].innerHTML = parseFloat(home.Afs[11].value).toFixed(2)
            $("#AFS_VD552")[0].innerHTML = parseFloat(home.Afs[12].value).toFixed(2)
            $("#AFS_VD560")[0].innerHTML = parseFloat(home.Afs[13].value).toFixed(2)
            $("#AFS_VD520")[0].innerHTML = parseFloat(home.Afs[8].value).toFixed(2)
            $("#AFS_VD528")[0].innerHTML = parseFloat(home.Afs[9].value).toFixed(2)
            $("#AFS_VD504")[0].innerHTML = parseFloat(home.Afs[6].value).toFixed(2)
            $("#AFS_VD512")[0].innerHTML = parseFloat(home.Afs[7].value).toFixed(2)
            $("#WI_1009")[0].innerHTML = parseFloat(home.WI1s[8].value).toFixed(2)
            $("#WI_1011")[0].innerHTML = parseFloat(home.WI1s[10].value).toFixed(2)
            $("#WI_1014")[0].innerHTML = parseFloat(home.WI1s[13].value).toFixed(2)
            $("#TI_1007_T")[0].innerHTML = parseFloat(home.TI1s[6].value).toFixed(2)
            $("#TI_1007_R")[0].innerHTML = parseFloat(home.RI1s[6].value).toFixed(2)
        }
        , render7: function () {
            var vd0 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD0';
            })[0]
            var vd24 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD24';
            })[0]
            var vd6 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD6';
            })[0]
            var vd12 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD12';
            })[0]
            var vd30 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD30';
            })[0]
            var vd18 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD18';
            })[0]
            var vd536 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD536';
            })[0]
            var vd544 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD544';
            })[0]
            var vd552 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD552';
            })[0]
            var vd560 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD560';
            })[0]
            var vd520 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD520';
            })[0]
            var vd528 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD528';
            })[0]

            var vd504 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD504';
            })[0]
            var vd512 = home.Bfs.filter(function (e) {
                return e.weihao === 'BFS_VD512';
            })[0]
            var WI_1008_W = home.WI1s.filter(function (e) {
                return e.weihao === 'WI_1008';
            })[0]
            var WI_1010_W = home.WI1s.filter(function (e) {
                return e.weihao === 'WI_1010';
            })[0]
            var WI_1012 = home.WI1s.filter(function (e) {
                return e.weihao === 'WI_1012';
            })[0]
            var TI_1008_T = home.TI1s.filter(function (e) {
                return e.weihao === 'TI_1008';
            })[0]
            var TI_1008_R = home.RI1s.filter(function (e) {
                return e.weihao === 'RI_1008';
            })[0]

            $("#BFS_VD24")[0].innerHTML = parseFloat(vd24.value).toFixed(2)
            $("#BFS_VD0")[0].innerHTML = parseFloat(vd0.value).toFixed(2)
            $("#BFS_VD6")[0].innerHTML = parseFloat(vd6.value).toFixed(2)
            $("#BFS_VD12")[0].innerHTML = parseFloat(vd12.value).toFixed(2)
            $("#BFS_VD30")[0].innerHTML = parseFloat(vd30.value).toFixed(2)
            $("#BFS_VD18")[0].innerHTML = parseFloat(vd18.value).toFixed(2)
            $("#BFS_VD536")[0].innerHTML = parseFloat(vd536.value).toFixed(2)
            $("#BFS_VD544")[0].innerHTML = parseFloat(vd544.value).toFixed(2)
            $("#BFS_VD552")[0].innerHTML = parseFloat(vd552.value).toFixed(2)
            $("#BFS_VD560")[0].innerHTML = parseFloat(vd560.value).toFixed(2)
            $("#BFS_VD520")[0].innerHTML = parseFloat(vd520.value).toFixed(2)
            $("#BFS_VD528")[0].innerHTML = parseFloat(vd528.value).toFixed(2)
            $("#BFS_VD504")[0].innerHTML = parseFloat(vd504.value).toFixed(2)
            $("#BFS_VD512")[0].innerHTML = parseFloat(vd512.value).toFixed(2)
            $("#WI_1008_W")[0].innerHTML = parseFloat(WI_1008_W.value).toFixed(2)
            $("#WI_1010_W")[0].innerHTML = parseFloat(WI_1010_W.value).toFixed(2)
            $("#WI_1012")[0].innerHTML = parseFloat(WI_1012.value).toFixed(2)
            $("#TI_1008_T")[0].innerHTML = parseFloat(TI_1008_T.value).toFixed(2)
            $("#TI_1008_R")[0].innerHTML = parseFloat(TI_1008_R.value).toFixed(2)
        }

        /** 清除intervals */
        , clearIntervals: function (intervals) {
            intervals.forEach(function (e) {
                clearInterval(e)
            })
            intervals.splice(0, home.realdata_interval.length) //清空所有的interval
        }
        /** $$$ok,监视模块代码到此位置, 继续往下 $$$*/
        /** -------------------------------------------------------------------------------------*/
        /** -------------------------------------------------------------------------------------*/
        /** -------------------------------------------------------------------------------------*/
        /** -------------------------------------------------------------------------------------*/
        /** -------------------------------------------------------------------------------------*/
        /** -------------------------------------------------------------------------------------*/


        /** 用户退出登录逻辑 */
        , handleLogout: function ($exit) {
            $exit.on('click', function () {
                /** 清除浏览记录 */
                localStorage.clear()
                /** 清除用户登录信息 */
                $.session.clear()
                /** 返回登录页面 */
                window.location.href = '../login.jsp'
            })
        }//$funcs

        /** 绑定全选事件 */
        , bindSelectAll: function (selectAllBox, subCheckBoxes, checkedBoxLen, $table) {
            selectAllBox.off('change').on('change', function () {
                var status = selectAllBox.prop('checked')
                subCheckBoxes.each(function () {
                    $(this).prop('checked', status)
                })
            })
            subCheckBoxes.off('change').on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && checkedBoxLen.length === $table.children('tbody').children('tr').length) {

                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}