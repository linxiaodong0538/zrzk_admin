export const SensorDialogOptions = [
    {
        prop: "sensorType",
        label: "传感器类型",
        type: "select",
        span: 12,
        options: [],
        change: true
    },
    {
        prop: "sensorId",
        label: "传感器名称",
        type: "select",
        span: 12,
        options: [],
        offset: 12,
        pull: 12,
        change: true
    },
    {
        prop: "range",
        // label: "应用范围",
        type: "slot",
        span: 24
    },
    {
        prop: "deviationValue",
        label: "偏差值",
        type: "number",
        span: 12
    },
    {
        prop: "unit",
        label: "单位",
        type: "text",
        span: 12,
        offset: 12,
        pull: 12
    }
];

export const BuiltinDialogOptions = [
    {
        prop: "productFieldName",
        label: "数据名称",
        type: "text",
        span: 24
    },
    {
        prop: "productDataType",
        label: "数据类型",
        type: "select",
        span: 24,
        options: []
    },
    {
        prop: 'measure',
        type: 'slot',
        span: 24
    },
    {
        prop: "value",
        label: "偏差值",
        type: "text",
        span: 24
    },
    {
        prop: "unit",
        label: "单位",
        type: "text",
        span: 24
    }
];



export const FormOptions = [
    {
        prop: "productName",
        label: "产品名称",
        type: "text",
        clearable: true
    },
    {
        prop: "createTime",
        label: "创建时间",
        type: "daterange",
        clearable: true
    }
]

export const SensorTableOptions = [
    { prop: "sensorName", label: "传感器名称" },
    { prop: "sensorType", label: "传感器类型" },
    { prop: "dataName", label: "数据名称" },
    { prop: "dataType", label: "数据类型" },
    { prop: "range", label: "范围", formatter(row, column){ return `${row['minValue']} - ${row['maxValue']}` } },
    { prop: "unit", label: "单位" }
];

export const BuiltinTableOptions = [
    { prop: "productFieldName", label: "数据名称" },
    { prop: "productDataType", label: "数据类型" },
    { prop: "range", label: "范围", formatter(row, column){ return `${row['minValue']} - ${row['maxValue']}` } },
    { prop: "unit", label: "单位" },
];