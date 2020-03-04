export const DialogOptions = [
    {
        prop: "partsTypeName",
        label: "类型名称",
        type: "text",
        span: 12,
        offset: 12,
        pull: 12
    },
    {
        prop: "remark",
        label: "备注",
        type: "text",
        span: 24
    },
    {
        prop: 'fields',
        type: 'slot'
    }
];


export const FormOptions = [
    {
        prop: "partsTypeName",
        label: "类型名称",
        type: "text",
        clearable: true
    },
    {
        prop: "createTime",
        label: "安装时间",
        type: "daterange",
        clearable: true
    }
]