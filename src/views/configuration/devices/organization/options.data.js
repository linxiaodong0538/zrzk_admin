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
        label: "项目",
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
        prop: "deviceCode",
        label: "设备编号",
        type: "text",
        clearable: true
    }
];


export const TreeOptions = [
    {
        prop: "groupName",
        label: "分组名称",
        type: "text",
        span: 12,
    }];
