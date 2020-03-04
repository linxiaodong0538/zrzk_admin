export const DialogOptions = [ 
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
        prop: "dataType",
        label: "数据类型",
        type: "select",
        span: 12,
        options: [{label: 'float', value: 'float'},{ label: 'int', value: 'int'},{ label: 'string', value: 'string'}]
    }, 
    {
        prop: "dataName",
        label: "数据名称",
        type: "text",
        span: 12
    }, 
    {
        prop: "range",
        // label: "量程",
        type: "slot",
        span: 24
    }, 
    {
        prop: "deviationValue",
        label: "偏差值",
        type: "number",
        span: 12,
        offset: 12,
        pull: 12
    }, 
    {
        prop: "unit",
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
        label: "传感器类型",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "sensorName",
        label: "传感器名称",
        type: "text",
        clearable: true
    }
]