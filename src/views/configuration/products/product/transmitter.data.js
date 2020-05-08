export const DialogOptions = [
    {
        prop: "productFieldName",
        label: "数据标识",
        type: "text",
        span: 24
    },
    {
        prop: "productFieldNameCn",
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
        prop: "value",
        label: "数据值",
        type: "text",
        span: 24
    }
];


export const FormOptions = [
    {
        prop: "areaName",
        label: "产品名称",
        type: "text",
        clearable: true
    },
    {
        prop: "areaCode",
        label: "创建时间",
        type: "daterange",
        clearable: true
    }
]