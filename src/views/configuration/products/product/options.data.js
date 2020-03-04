export const DialogOptions = [
    {
        prop: "productTypeId",
        label: "产品类别",
        type: "select",
        span: 12,
        options: [],
        change: true
    },
    {
        prop: "productCode",
        label: "产品编码",
        type: "text",
        span: 12,
    }, 
    {
        prop: "productName",
        label: "产品名称",
        type: "text",
        span: 12
    },
    {
        prop: "manufacturer",
        label: "生产厂家",
        type: "text",
        span: 12,
    },
    {
        prop: "imageUrl",
        label: "产品图片",
        type: "file",
        span: 12,
    },
    {
        prop: "productDescirption",
        label: "产品描述",
        type: "textarea",
        span: 12,
        autosize: { minRows: 5, maxRows: 5}
    },
    {
        prop: "accessProtocol",
        label: "接入协议",
        type: "text",
        span: 12
    },
    {
        prop: "agreementVersionNo",
        label: "版本协议号",
        type: "text",
        span: 12
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