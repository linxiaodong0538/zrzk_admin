export const DialogOptions = [
    {
        prop: "sensorId",
        label: "传感器ID",
        type: "text",
        span: 12
    },
    {
        prop: "sensorName",
        label: "传感器名称",
        type: "text",
        span: 12,
    },
    {
        prop: "sensorType",
        label: "传感器类型",
        type: "select",
        span: 12,
        options: []
    },
    {
        prop: "vendor",
        label: "生产厂家",
        type: "text",
        span: 12,
    },
    {
        prop: "dataType",
        label: "数据类型",
        type: "select",
        span: 24,
        options: [{ label: 'float', value: 'float' }, { label: 'int', value: 'int' }, { label: 'string', value: 'string' }]
    },
    {
        prop: "measure",
        // label: "测量范围",
        type: "slot",
        span: 24
    },
    {
        prop: "areaAddr",
        label: "偏差值",
        type: "text",
        span: 12,
    },
    {
        prop: "areaAddr",
        label: "度量单位",
        type: "text",
        span: 12,
    },
    {
        prop: "remark",
        label: "备注",
        type: "textarea",
        span: 24,
        placeholder: "请输入内容"
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
        prop: "productTypeId",
        label: "产品类型",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "deviceId",
        label: "设备ID",
        type: "text",
        clearable: true
    },
    {
        prop: "partsId",
        label: "部件ID",
        type: "text",
        clearable: true
    },
    {
        prop: "runningState",
        label: "运行状态",
        type: "select",
        clearable: true,
        options: [{ label: '正常', value: '1' }]
    },
    {
        prop: "createTime",
        label: "登记时间",
        type: "daterange",
        clearable: true
    }
];


export const TableOptions = [
    { prop: "deviceCode", label: "设备编码" },
    { prop: "productName", label: "产品名称" },
    { prop: "productTypeName", label: "产品类型" },
    { prop: "partsId", label: "部件ID" },
    { prop: "runningState", label: "运行状态", formatter: () => { } },
    { prop: "createTime", label: "登记时间" }
];