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
        options: [{label: 'float', value: 'float'},{ label: 'int', value: 'int'},{ label: 'string', value: 'string'}]
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
        prop: "sensorType",
        label: "所属项目",
        type: "select",
        clearable: true,
        options: []
    }, 
    {
        prop: "sensorType",
        label: "部件ID",
        type: "text",
        clearable: true
    },
    {
        prop: "sensorType",
        label: "产品类型",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "sensorType",
        label: "原有设备ID",
        type: "text",
        clearable: true,
    },
    {
        prop: "sensorType",
        label: "更换设备ID",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "sensorName",
        label: "更换时间",
        type: "daterange",
        clearable: true
    }
];

export const TableOptions = [
    { prop: "areaCode", label: "原有设备ID" },
    { prop: "areaName", label: "产品名称" },
    { prop: "areaAddr", label: "更换设备ID" },
    { prop: "areaAddr", label: "更换产品名称" },
    { prop: "areaAddr", label: "部件ID" },
    { prop: "areaAddr", label: "更换时间" },
    { prop: "areaAddr", label: "操作人员" },
];