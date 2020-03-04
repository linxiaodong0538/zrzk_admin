export const DialogOptions = [
    {
        prop: "areaCode",
        label: "区域编码",
        type: "text",
        span: 12
    },
    {
        prop: "parentId",
        label: "上级区域",
        type: "cascader",
        clearable: true,
        span: 12,
        options: []
    },
    {
        prop: "areaName",
        label: "区域名称",
        type: "text",
        span: 12,
    },
    {
        prop: "areaAddr",
        label: "区域地址",
        type: "textarea",
        span: 24,
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
        prop: "areaName",
        label: "区域名称",
        type: "text",
        clearable: true,
        options: []
    },
    {
        prop: "areaCode",
        label: "区域编码",
        type: "text",
        clearable: true
    },
    {
        prop: "areaAddr",
        label: "区域地址",
        type: "text",
        clearable: true
    }
]