export const DialogOptions = [
    {
        prop:'extProductId',
        label:'协议ID',
        type:"text",
    },
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
        label: "产品编号",
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
        autosize: { minRows: 5, maxRows: 5 }
    },
    {
        prop: "manufacturer",
        label: "生产厂家",
        type: "text",
        span: 12,
    },
    {
        prop: "accessProtocol",
        label: "接入协议",
        type: "select",
        span: 12,
        options: []
    },
    {
        prop: "agreementVersionNo",
        label: "版本协议号",
        type: "text",
        span: 12
    },
    {
        prop: "protocolPlatform",
        label: "应用对接平台",
        type: "select",
        span: 12,
        options: []
    },
    {
        prop: "serviceId",
        label: "服务ID",
        type: "text",
        span: 12
    },
    {
        prop: "serviceMethod",
        label: "服务方法",
        type: "text",
        span: 12
    },
    {
        prop: "offlineTime",
        label: "离线判定时长",
        type: "text",
        span: 12,
        append: '分钟'
    }
];


export const FormOptions = [
    {
        prop: "productCode",
        label: "产品编码",
        type: "text",
        clearable: true
    },
    {
        prop: "productName",
        label: "产品名称",
        type: "text",
        clearable: true
    },
    {
        prop: "dateRange",
        label: "创建时间",
        type: "daterange",
        clearable: true
    }
]