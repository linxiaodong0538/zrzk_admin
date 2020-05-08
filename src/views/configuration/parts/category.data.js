export const DialogOptions = [
    {
        prop: "parentType",
        label: "部件主类型",
        type: "select",
        span: 12,
        offset: 12,
        pull: 12,
        options: []
    },
    {
        prop: "partsTypeName",
        label: "部件子类名称",
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
        type: 'slot',
        span: 24
    }
];


export const FormOptions = [
    {
        prop: "parentType",
        label: "主类名称",
        type: "select",
        clearable: true,
        filterable: true,
        options: []
    },
    {
        prop: "dateRange",
        label: "创建时间",
        type: "daterange",
        clearable: true
    }
]