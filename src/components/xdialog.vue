<template>
    <el-dialog
        :title="title"
        :visible.sync="isShowing"
        :width="width"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :show-close="showClose"
        :append-to-body="appendToBody"
    >
        <el-form ref="frm" :model="form" :rules="rules" :label-width="labelWidth">
            <el-row>
                <template v-for="(opt, idx) in options">
                    <!-- <el-col v-if="opt.offset" :span="opt.offset?opt.offset:12"><div></div></el-col> -->
                    <el-col
                        :span="opt.span === null?undefined:(opt.span || 12)"
                        :offset="opt.offset"
                        :pull="opt.pull"
                        :push="opt.push"
                        :key="'col'+idx"
                    >
                        <slot v-if="opt.type==='slot'" :name="opt.prop"></slot>
                        <el-form-item
                            v-else
                            :label="opt.label"
                            :prop="opt.prop"
                            :size="opt.size || 'mini'"
                            :rules="opt.rules"
                        >
                            <el-select
                                v-if="opt.type === 'select'"
                                v-model="form[opt.prop]"
                                :multiple="opt.multiple || false"
                                :placeholder="opt.placeholder"
                                :disabled="opt.disabled"
                                :filterable="opt.filterable"
                                :clearable="opt.clearable === undefined?false:opt.clearable"
                                @change="change({ category: opt.prop, value: form[opt.prop], data: opt.options.find(x=>x.value===form[opt.prop]) }) "
                            >
                                <el-option
                                    v-for="item in opt.options"
                                    :key="item.key || item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled || undefined"
                                ></el-option>
                            </el-select>

                            <treeselect
                                v-else-if="opt.type === 'tree'"
                                v-model="form[opt.prop]"
                                :options="opt.options"
                                :placeholder="opt.placeholder"
                                :disabled="opt.disabled"
                            />

                            <el-cascader
                                v-else-if="opt.type=== 'cascader'"
                                v-model="form[opt.prop]"
                                :options="opt.options"
                                :disabled="opt.disabled"
                                :clearable="opt.clearable === undefined?true:opt.clearable"
                                :props="{ value: 'id', multiple:opt.multiple === undefined?false:opt.multiple, emitPath: opt.emitPath === undefined?false:opt.emitPath,
                                    checkStrictly: opt.checkStrictly === undefined?false: opt.checkStrictly
                                  }"
                            ></el-cascader>

                            <el-upload
                                v-else-if="opt.type==='file'"
                                v-model="form[opt.prop]"
                                class="avatar-uploader"
                                :action="opt.action?mapping({ category: 'file', data: opt.action }):uploadImgUrl"
                                :show-file-list="false"
                                :on-success="opt.onSuccess || handleAvatarSuccess"
                                :before-upload="opt.beforeUpload || beforeAvatarUpload"
                                :headers="headers"
                                :data="{ prop: opt.prop }"
                                :disabled="opt.disabled"
                                accept="image/*"
                            >
                                <img
                                    v-if="form[opt.prop]"
                                    :src="form[opt.prop]"
                                    class="avatar"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>

                            <el-date-picker
                                v-else-if="['date', 'datetime'].includes(opt.type)"
                                v-model="form[opt.prop]"
                                :type="opt.type"
                                :placeholder="opt.placeholder"
                                :disabled="opt.disabled"
                                :format="opt.format"
                                :value-format="opt.valueFormat"
                            ></el-date-picker>

                            <el-time-select
                                v-else-if="opt.type === 'time'"
                                v-model="form[opt.prop]"
                                :picker-options="opt.pickerOptions"
                                :placeholder="opt.placeholder"
                                :disabled="opt.disabled"
                            ></el-time-select>

                            <el-switch
                                v-else-if="opt.type === 'switch'"
                                v-model="form[opt.prop]"
                                :disabled="opt.disabled"
                            ></el-switch>

                            <el-radio-group
                                v-else-if="opt.type === 'radio'"
                                v-model="form[opt.prop]"
                                :disabled="opt.disabled"
                            >
                                <el-radio
                                    v-for="item in opt.options"
                                    :key="item.value"
                                    :label="item.value"
                                    :disabled="item.disabled || undefined"
                                >{{ item.label }}</el-radio>
                            </el-radio-group>

                            <el-input-number
                                v-else-if="opt.type==='number'"
                                v-model="form[opt.prop]"
                                :disabled="opt.disabled"
                                :controls="false"
                                :readonly="opt.readonly"
                                @focus="focus({category: opt.prop, value: form[opt.prop], data: form[opt.prop]})"
                            ></el-input-number>

                            <el-input
                                v-else-if="['textarea', 'text', 'email'].includes(opt.type)"
                                :type="opt.type"
                                v-model="form[opt.prop]"
                                :autosize="opt.autosize || undefined"
                                :placeholder="opt.placeholder || undefined"
                                :disabled="opt.disabled"
                                :readonly="opt.readonly"
                                @focus="focus({category: opt.prop, value: form[opt.prop], data: form[opt.prop]})"
                            >
                                <el-button
                                    slot="append"
                                    v-if="opt.append && opt.append.startsWith('el-icon')"
                                    :icon="opt.append || 'el-icon-search'"
                                    @click="focus({category: opt.prop, value: form[opt.prop], data: form[opt.prop]})"
                                ></el-button>
                                <template slot="append" v-else-if="opt.append">{{ opt.append }}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </template>
                <slot v-bind:data="form"></slot>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" size="small">确 定</el-button>
            <el-button @click="cancel" size="small">取 消</el-button>
        </div>
        <slot name="footer"></slot>
    </el-dialog>
</template>
<style scoped>
@import "./xdialog.css";
</style>
<script>
import moment from "moment";
import { Paginator } from "../dtos/paginator";
import Treeselect from "@riophae/vue-treeselect";
import { getToken } from "@/utils/auth";

export default {
    components: { Treeselect },
    props: {
        title: {
            type: String,
            default: ""
        },
        visible: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: false
        },
        showClose: {
            type: Boolean,
            default: true
        },
        inline: {
            type: Boolean,
            default: true
        },
        /**
         * 表格字段
         */
        form: {
            type: Object,
            required: true,
            default: () => ({})
        },
        // form?: object;

        options: {
            type: Array,
            required: true,
            default: () => []
        },
        rules: {
            type: Object,
            default: () => ({})
        },

        // label-width 默认为自适应。
        labelWidth: {
            type: String,
            default: "120px"
        },
        width: {
            type: String,
            default: "720px"
        }
    },
    data() {
        return {
            isShowing: false,
            pager: new Paginator(),
            uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload",
            headers: {
                Authorization: "Bearer " + getToken()
            }
        };
    },
    watch: {
        visible(v) {
            this.isShowing = v;
        },
        isShowing(v) {
            this.$emit("update:visible", v);
        }
    },
    methods: {
        submitForm() {
            this.$refs["frm"].validate(valid => {
                if (valid) {
                    this.$refs["frm"].clearValidate();
                    this.$emit("callback");
                }
            });
        },

        resetForm() {
            this.$refs["frm"].resetFields();
        },
        cancel() {
            this.$emit("update:visible", false);
        },
        change(parameters) {
            this.$emit(`change`, parameters);
        },
        focus(parameters) {
            this.$emit(`focus`, parameters);
        },
        handleAvatarSuccess(res, file) {
            console.log("upload", res, file);
            let { fileName, url } = res;
            console.log("file", res, file);
            this.form["imageUrl"] = url;// fileName; // URL.createObjectURL(file.raw);
            this.$forceUpdate();
        },
        beforeAvatarUpload(file, a) {
            const isImage = file.type.includes("image/");
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isImage) {
                this.$message.error("只接受图片格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isImage && isLt2M;
        },
        mapping({ category, data }) {
            if (category === "file") {
                // console.log(process.env.VUE_APP_BASE_API + data);
                return process.env.VUE_APP_BASE_API + data;
            }
        }
    }
};
/**
 * TODO
 * # 封装说明
 */
</script> 
<style>
.el-input-number .el-input__inner {
    text-align: left !important;
}
.el-input-number,
.el-select,
.el-cascader {
    width: 100%;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 85px;
    height: 85px;
    line-height: 85px;
    text-align: center;
}
.avatar {
    width: 85px;
    height: 85px;
    display: block;
}
</style>