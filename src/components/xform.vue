<template>
    <el-form
        :inline="inline"
        :model="form"
        :status-icon="showStatusIcon"
        :rules="rules"
        :label-width="labelWidth || undefined"
        size="small"
        label-position="right"
        ref="form"
        class="form"
    >
        <template v-for="opt in options">
            <!-- <el-col :xs="item.xs || 24" :sm="item.sm || 12" :md="item.md || 8" :lg="item.lg || 6" :xl="item.xl || 6"> -->
            <slot v-if="opt.type==='slot'" :name="opt.prop"></slot>
            <el-form-item v-else :label="opt.label" :prop="opt.prop">
                <el-date-picker
                    v-if="opt.type==='date'"
                    v-model="form[opt.prop]"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="datePickerOptions"
                    :clearable="opt.clearable || false"
                ></el-date-picker>
                <el-date-picker
                    v-model="form[opt.prop]"
                    v-else-if="opt.type==='daterange'"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    :picker-options="rangePickerOptions"
                    :clearable="opt.clearable || false"
                    style="width: 240px;"
                ></el-date-picker>
                <el-time-select
                    v-model="form[opt.prop]"
                    v-else-if="opt.type==='timerange'"
                    :picker-options="{ start: '00:00', step: '01:00', end: '24:00'}"
                    :clearable="opt.clearable || false"
                    style="width: 240px;"
                ></el-time-select>
                <el-input-number
                    v-else-if="opt.type==='number'"
                    v-model="form[opt.prop]"
                    controls-position="right"
                    :controls="false"
                    :placeholder="hasPlaceholder?opt.placeholder||'全部':''"
                    clearable
                    style="width: 240px;"
                >
                    <template slot="append" v-if="opt.append">{{ item['append'] }}</template>
                </el-input-number>
                <el-select
                    v-else-if="opt.options || opt.type === 'select'"
                    v-model="form[opt.prop]"
                    :multiple="opt.multiple || false"
                    collapse-tags
                    :placeholder="hasPlaceholder?opt.placeholder||'全部':''"
                    :clearable="opt.clearable !== undefined?opt.clearable:undefined"
                    :disabled="opt.disabled"
                    style="width: 240px;"
                >
                    <el-option
                        v-for="(item) in opt.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-input
                    v-else
                    v-model="form[opt.prop]"
                    autocomplete="off"
                    :placeholder="hasPlaceholder?opt.placeholder||'全部':''"
                    :type="opt.type==='textarea'?'textarea':undefined"
                    :clearable="opt.clearable !== undefined?opt.clearable:undefined"
                    style="width: 240px;"
                >
                    <template slot="append" v-if="opt.append">{{ item['append'] }}</template>
                </el-input>
            </el-form-item>
            <!-- </el-col> -->
        </template>
        <!-- <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6"> -->
        <slot></slot>
        <!-- </el-col> -->
        <el-form-item>
            <el-button
                v-if="hasSearch"
                class="button"
                type="primary"
                size="mini"
                icon="el-icon-search"
                @click.prevent="submitForm"
            >搜索</el-button>
            <el-button
                v-if="hasReset"
                class="button"
                icon="el-icon-refresh"
                size="mini"
                @click.prevent="resetForm"
            >重置</el-button>
            <!-- <el-button
                v-if="hasExport"
                class="button"
                type="primary"
                icon="el-icon-printer"
                size="small"
                @click.prevent="exportTable()"
            >导出</el-button>-->
            <slot name="button"></slot>
        </el-form-item>
    </el-form>
</template>
<script>
import moment from "moment";
import Treeselect from "@riophae/vue-treeselect";
export default {
    components: { Treeselect },
    props: {
        inline: {
            type: Boolean,
            default: true
        },
        // inline?: boolean;

        showStatusIcon: {
            type: Boolean,
            default: false
        },
        // showStatusIcon?: boolean;
        /**
         * 表格字段
         */
        form: {
            type: Object,
            required: true,
            default: () => ({})
        },
        // form?: object;

        /**
         * 表格数据，示例如下
         */
        //   a = [
        //   {
        //     key: "date",
        //     label: "日期",
        //     type: "date" | "daterange"| "timerange" | "number" //日期或日期范围或数字
        //   },
        //   {
        //     key: "name",
        //     label: "姓名"
        //     placeholder: "" // 默认占位符
        //   },
        //  {
        //     key: "name",
        //     label: "姓名",
        //     type: "number" // 数字框
        //   },
        //  {
        //     key: "name",
        //     label: "姓名",
        //     type: "textarea" // 文本框
        //   },
        //   {
        //     key: "sex",
        //     label: "性别",
        //     multiple: true, //多选或单选
        //     options: [//选项
        //       {
        //         label: "男",
        //         value: "man"
        //       },
        //       {
        //         label: "女",
        //         value: "woman"
        //       }
        //     ]
        //   }
        // ];

        options: {
            type: Array,
            required: true
        },
        // options?: object[];

        /**
 *
 * ``` 
    rules = {
      name: [{ validator: this.validateName, trigger: "blur" }],
      age: [
        { type: "number", message: "请输入数字", trigger: "blur" },
        { required: true, message: "不得为空", trigger: "blur" }
      ]
    };
      validateName(rule: any, value: string, callback: (arg?: any) => any) {
      if (value === "") {
        callback(new Error("不得为空"));
      } else if (value.length >= 4) {
        callback(new Error("太长!"));
      } else {
        callback();
      }
    }
 * ```   
 */
        rules: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // rules?: object;
        // 示例

        // label-width 默认为自适应。
        labelWidth: {
            type: String,
            default: ""
        },
        // labelWidth?: string;

        onQuery: {
            type: Function,
            required: false,
            default: () => {}
        },
        // onQuery?: () => any;

        invalid: {
            type: Function,
            default: () => {
                return false;
            }
        },
        // invalid?: () => any;

        hasPlaceholder: {
            type: Boolean,
            default: true
        },
        // hasPlaceholder?: boolean;

        hasSearch: {
            type: Boolean,
            default: true
        },
        // hasSearch?: boolean;

        hasReset: {
            type: Boolean,
            default: true
        },
        // hasReset?: boolean;

        hasExport: {
            type: Boolean,
            default: false
        },
        // hasExport?: boolean;

        exportOption: {
            type: Object,
            required: false,
            default: () => {
                return {
                    url: "",
                    sheetName: "未命名",
                    params: { date: "2019-01-01" }
                };
            }
        },
        // exportOption!: ExportOption;

        rangePickerOptions: {
            type: Object,
            required: false,
            default: () => {
                return {
                    disabledDate: time => {
                        // return time.getTime() > Date.now();
                    },
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick: picker => {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 7
                                );
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一个月",
                            onClick: picker => {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 30
                                );
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick: picker => {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 90
                                );
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                };
            }
        }
        // rangePickerOptions: any;
    },
    data() {
        return {
            /**
             * 日期选择框
             */
            datePickerOptions: {
                disabledDate: time => {
                    return time.getTime() > Date.now();
                },
                shortcuts: [
                    {
                        text: "今天",
                        onClick: picker => {
                            picker.$emit("pick", new Date());
                        }
                    },
                    {
                        text: "昨天",
                        onClick: picker => {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit("pick", date);
                        }
                    },
                    {
                        text: "一周前",
                        onClick: picker => {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", date);
                        }
                    }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.$emit("callback");
                }
            });
        },

        resetForm() {
            this.$refs["form"].resetFields();
        }

        /**
         * 导出
         */

        // exportTable(params = this.exportOption.params) {
        //     // const type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //     // this.downNewChargeRank(type, params).then(data => {
        //     //     if (data.headers["content-type"] && data.headers["content-type"] === type) {
        //     //         const blob = new Blob([data.data as any], { type });
        //     //         const url = window.URL.createObjectURL(blob);
        //     //         const a = document.createElement("a");
        //     //         document.body.appendChild(a);
        //     //         a.style.display = "none";
        //     //         a.href = url;
        //     //         const t = moment().format("YYYY-MM-DD HH:mm:ss");
        //     //         a.download = `${this.exportOption.sheetName}${t}.xlsx`;
        //     //         a.click();
        //     //         window.URL.revokeObjectURL(url);
        //     //         a.remove();
        //     //     }
        //     // });
        //     this.$emit("excel");
        // }
        // downNewChargeRank(type: string, params: any) {
        //     return this.$axios.get(`${this.exportOption.url}`, {
        //         headers: { Accept: type },
        //         responseType: "arraybuffer",
        //         params
        //     });
        // }
    }
};
/**
 * TODO
 * # 封装说明
 */
</script> 
<style  >
.el-input-number .el-input__inner{
    text-align: left !important;
}
</style>