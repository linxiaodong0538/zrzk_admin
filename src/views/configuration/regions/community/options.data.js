export const DialogOptions = [
    {
        prop: "communityCode",
        label: "小区编码",
        type: "text",
        span: 12
    },
    {
        prop: "communityName",
        label: "小区名称",
        type: "text",
        span: 12
    },
    {
        prop: "areaId",
        label: "区域ID",
        type: "cascader",
        span: 12,
        emitPath: false,
        options: []
    },
    {
        prop: "addr",
        label: "地址",
        type: "text",
        span: 12,
    },
    {
        prop: "personNum",
        label: "人数",
        type: "number",
        span: 12,
        placeholder: "请输入用户名称"
    },
    {
        prop: "serviceProvider",
        label: "运营商",
        type: "select",
        span: 12,
        placeholder: "请选择",
        options: [{ label: '移动', value: 1 }, { label: '联通', value: 2 }, { label: '电信', value: 3 }]
    },
    {
        prop: "waterNum",
        type: "number",
        label: "水表数",
        span: 12
    },
    {
        prop: "sort",
        label: "排序",
        type: "number",
        span: 12
    },
    // {
    //     prop: "imgUrl",
    //     label: "图片",
    //     type: "select",
    //     span: 12,
    //     placeholder: "请选择",
    //     options: []
    // },
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
        prop: "communityCode",
        label: "小区编码",
        type: "text",
        clearable: true
    },
    {
        prop: "communityName",
        label: "小区名称",
        type: "text",
        clearable: true
    } 
]