<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <x-form
                    :options="formOptions"
                    :form="formData"
                    :rules="formRules"
                    labelWidth="68px"
                    @callback="search"
                ></x-form>

                <x-table
                    :options="options"
                    :data="models"
                    :loading="loading"
                    :hasReset="true"
                    :isSelectable="true"
                    :isPaging="true"
                    :pagination="pagination"
                    @page-change="search"
                    @selection-change="select"
                ></x-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { XTable, XForm, XTree, XDialog, XOrg } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions } from "./history.data";
import { FieldDataRules } from "@/dtos/constants";

export default {
    components: { XTable, XForm, XTree, XDialog, XOrg },
    name: "configuration-parts-history",
    props: {
        data: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    watch: {
        data(val) {
            console.log(":id", val);
            this.search();
        }
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 弹出层标题
            title: "",
            // 日期范围
            dateRange: [],
            /** 部件大类 */
            clusterOptions: [],
            /** 自定义字段 */
            fields: [],
            fieldDataRules: FieldDataRules,
            partsTypeOptions: [],
            operators: [],
            current: {
                node: {},
                areaId: undefined,
                groupId: undefined
            },
            cache: {
                areas: {},
                categories: {},
                parentType: {}
            },
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label"
            },
            /** form ^ */
            /** 查询参数 */
            formData: {
                oprName: undefined
            },
            formOptions: FormOptions,
            formRules: {},
            categories: [],
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "title", label: "操作动作" },
                { prop: "content", label: "操作描述" },
                {
                    prop: "images",
                    label: "图片",
                    image: true,
                    multiple: true
                },
                { prop: "remark", label: "备注" },
                { prop: "oprName", label: "用户" },
                { prop: "oprTime", label: "时间" }
            ],
            models: [],
            /** 操作记录 */
            histories: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                partsName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                partsCode: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                partsTypeId: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "blur"
                    }
                ],
                areaId: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "change"
                    }
                ]
            },
            dialogVisible: false,
            /** dialog $ */
            // 表单校验
            rules: {
                userName: [
                    {
                        required: true,
                        message: "用户名称不能为空",
                        trigger: "blur"
                    }
                ],
                nickName: [
                    {
                        required: true,
                        message: "用户昵称不能为空",
                        trigger: "blur"
                    }
                ],
                areaId: [
                    {
                        required: true,
                        message: "归属部门不能为空",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "用户密码不能为空",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                phonenumber: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.$parts.getUserList().then(({ rows }) => {
            this.operators = rows.map(x => ({
                label: x,
                value: x
            }));
            let node = this.formOptions.find(x => x.prop === "oprName");
            if (node) node.options = this.operators;
        });

        this.search();
    },
    methods: {
        /** 查询用户列表 */
        search() {
            let start =
                this.formData.dateRange && this.formData.dateRange[0]
                    ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
                    : undefined;
            let end =
                this.formData.dateRange && this.formData.dateRange[1]
                    ? moment(this.formData.dateRange[1]).format("YYYY-MM-DD")
                    : undefined;
            let params = Object.assign({}, this.formData, {
                pageNum: this.pagination.index,
                pageSize: this.pagination.size,
                page: this.pagination.index,
                partsId: this.data.partsId,
                beginTime: start,
                endTime: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$parts.getPartsLogList(params).then(({ rows, total }) => {
                this.loading = false;
                this.models = rows.map(x => {
                    x.images = x.partsImgList.map(i => i.img);
                    return x;
                });
                this.pagination.all = total;
            });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick({ category, data }) {
            this.current.areaId = data.id;
            this.search();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.partsId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleView(data) {
            this.isDetailVisible = true;
            this.$parts.get({ id: data.partsId }).then(res => {
                this.current.node = res.data;
            });
        },
        /** 查看操作记录 */
        handleHistory(data) {
            this.isHistoryVisible = true;
            this.$parts.get({ id: data.partsId }).then(res => {
                this.current.node = res.data;
            });
        },
        /** 新增按钮操作 */
        handleAdd(t) {
            this.dialogForm = {
                areaId: this.current.areaId
            };
            this.dialogVisible = true;
            this.title = "新增";
        },
        pick({ point }) {
            this.dialogForm["longitude"] = point.lng;
            this.dialogForm["latitude"] = point.lat;
        },
        select(v) {
            console.log("select", v);
            this.handleSelectionChange(v);
        },
        change({ category, value }) {
            if (category === "partsTypeId") {
                this.$partstype.getFields({ id: value }).then(({ rows }) => {
                    this.fields = rows;
                });
            }
            if (category === "parentType") {
                this.$partstype
                    .search({ parentType: value })
                    .then(({ rows }) => {
                        console.log("test", rows, arguments[0]);
                        // this.dialogRules = Object.assign(
                        //     {},
                        //     this.dialogRules,
                        //     this.fields.reduce(
                        //         (p, c) => (
                        //             (p[c.partsFieldName] = this.fieldDataRules[
                        //                 c.dataType
                        //             ]),
                        //             p
                        //         ),
                        //         {}
                        //     )
                        // );
                        // console.log('rules', this.rules)
                    });
            }
        },
        mapping(row, column, index) {
            let result = "";
            const property = column.property;
            if (property === "partsImgList") {
            }
            return result;
        }
    }
};
</script>