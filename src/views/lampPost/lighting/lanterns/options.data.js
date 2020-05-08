export const DialogOptions = [
    {
        prop: "partsTypeId",
        label: "部件类型",
        type: "select",
        span: 12,
        options: [],
        change: true
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
        prop: "projectIds",
        label: "关联项目",
        type: "select",
        span: 12,
        options: [],
        multiple: true,
        clearable: true
    },
    {
        prop: "longitude",
        type: "number",
        label: "经度",
        span: 12,
        click: true
    },
    {
        prop: "latitude",
        type: "number",
        label: "维度",
        span: 12,
        click: true
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
        prop: "productId",
        label: "产品名称",
        type: "select",
        clearable: true,
        options: [],
        change: true
    },
    {
        prop: "deviceCode",
        label: "设备编号",
        type: "text",
        clearable: true
    },
    {
        prop: "onlineStatus",
        label: "在线状态",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "alertStatus",
        label: "报警状态",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "dynamic",
        label: "高级查询",
        type: "xinput",
        clearable: true,
        span: 12,
        options: []
    }
]