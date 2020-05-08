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
        options: [],
        emitPath: false,
        multiple: false,
        checkStrictly: true
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
        prop: "areaCode",
        label: "区域编码",
        type: "text",
        clearable: true
    },
    {
        prop: "areaName",
        label: "区域名称",
        type: "text",
        clearable: true,
        options: []
    },
    {
        prop: "areaAddr",
        label: "区域地址",
        type: "text",
        clearable: true
    }
]