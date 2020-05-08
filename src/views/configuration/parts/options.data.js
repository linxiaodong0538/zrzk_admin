export const DialogOptions = [
    {
        prop: "partsCode",
        label: "部件编号",
        type: "text",
        span: 12,
    },
    {
        prop: "partsName",
        label: "部件名称",
        type: "text",
        span: 12,
    },
    {
        prop: "parentType",
        label: "部件主类",
        type: "select",
        span: 12,
        options: [],
        change: true
    },
    {
        prop: "partsTypeId",
        label: "部件子类型",
        type: "select",
        span: 12,
        options: [],
        change: true
    },
    {
        prop: "rfid",
        label: "智慧标签",
        type: "text",
        span: 12,
    },
    {
        prop: "areaId",
        label: "区域位置",
        type: "cascader",
        span: 12,
        options: [],
        emitPath: false,
        multiple: false,
        checkStrictly: true 
    },
    {
        prop: "longitude",
        type: "text",
        label: "经度",
        span: 12,
        click: true,
        append: 'el-icon-map-location'
    },
    {
        prop: "latitude",
        type: "text",
        label: "维度",
        span: 12,
        click: true,
        append: 'el-icon-map-location'
    },
    {
        prop: "addr",
        type: "text",
        label: "地址",
        span: 24,
        readonly: true
    },
    {
        prop: "projectIds",
        label: "关联项目",
        type: "select",
        span: 12,
        options: [],
        multiple: true,
        clearable: true
    }
];


export const FormOptions = [
    {
        prop: "projectId",
        label: "所属项目",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "parentType",
        label: "部件主类",
        type: "select",
        clearable: true,
        options: [],
        change: true
    },
    {
        prop: "partsTypeId",
        label: "部件子类",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "partsCode",
        label: "部件编号",
        type: "text",
        clearable: true
    },
    {
        prop: "dateRange",
        label: "安装时间",
        type: "daterange",
        clearable: true
    }
]