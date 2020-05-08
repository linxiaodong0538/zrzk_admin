export const DialogOptions = [
    {
        prop: "partsFieldName",
        label: "数据标识",
        type: "text",
        span: 12,
        offset: 12,
        pull: 12
    },
    {
        prop: "partsFieldNameCn",
        label: "数据名称",
        type: "text",
        span: 12
    },
    {
        prop: "dataType",
        label: "数据类型",
        type: "select",
        span: 12,
        options: [],
        offset: 12,
        pull: 12
    },
    {
        prop: "unit",
        label: "单位",
        type: "text",
        span: 12,
    }
];


export const FormOptions = [
    {
        prop: "projectId",
        label: "所属项目",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "deviceId",
        label: "灯杆ID",
        type: "text",
        clearable: true
    },
    {
        prop: "dateRange",
        label: "安装时间",
        type: "daterange",
        clearable: true
    }
]