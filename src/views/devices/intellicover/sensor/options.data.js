export const DialogOptions = [
    {
        prop: "areaId",
        type: "text",
        label: "区域",
        span: 12
    },
    {
        prop: "deptId",
        type: "tree",
        span: 12,
        label: "机构",
        options: [],
        placeholder: "请选择归属"
    },
    {
        prop: "projectId",
        type: "text",
        span: 12,
        label: "项目",
    },
    {
        prop: "deviceId",
        type: "text",
        span: 12,
        label: "所属井盖",
    },
    {
        prop: "category",
        type: "text",
        span: 12,
        label: "设备类型",
        placeholder: "请输入用户名称"
    },
    {
        type: "select",
        span: 12,
        label: "型号",
        prop: "productNo",
        placeholder: "请选择",
        options: []
    },
    {
        prop: "sn",
        type: "text",
        label: "设备编号",
        span: 12
    },
    {
        prop: "control",
        type: "text",
        label: "控制器",
        span: 12
    },
    {
        prop: "controlAddr",
        type: "text",
        label: "控制器地址",
        span: 12
    },
    {
        prop: "longitude",
        type: "text",
        label: "经度",
        span: 12
    },
    {
        prop: "latitude",
        type: "text",
        label: "维度",
        span: 12
    },
    {
        prop: "status",
        type: "select",
        span: 12,
        label: "状态",
        placeholder: "请选择",
        options: []
    },
    {
        prop: "deviceGroupId",
        type: "select",
        span: 12,
        label: "分组",
        multiple: true,
        placeholder: "请选择",
        options: []
    },
    {
        type: "textarea",
        span: 24,
        label: "备注",
        prop: "remark",
        placeholder: "请输入内容"
    }
];


export const FormOptions = [
    {
        prop: "deviceTypeId",
        label: "设备类型",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "deviceId",
        label: "设备ID",
        type: "text",
        clearable: true
    },
    {
        prop: "deviceCode",
        label: "井盖编号",
        type: "text",
        clearable: true
    },
    {
        prop: "projectId",
        label: "所属项目",
        type: "select",
        clearable: true,
        options: []
    },
    {
        prop: "status",
        label: "状态",
        type: "select",
        options: []
    },
    {
        prop: "dateRange",
        label: "安装时间",
        type: "daterange",
        clearable: true
    }
]