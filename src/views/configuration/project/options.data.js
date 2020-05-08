export const DialogOptions = [
    {
        prop: "projectName",
        label: "项目名称",
        type: "text",
        span: 12
    },
    {
        prop: "areaId",
        label: "项目区域",
        type: "cascader",
        emitPath: false,
        checkStrictly: true,
        span: 12,
        options: []
    },
    {
        prop: "longitude",
        label: "经度",
        type: "text",
        span: 12, 
        click: true,
        append: 'el-icon-map-location',
    },
    {
        prop: "latitude",
        label: "纬度",
        type: "text",
        span: 12, 
        click: true,
        append: 'el-icon-map-location',
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
        prop: "projectName",
        label: "项目名称",
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