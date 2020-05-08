<template>
    <el-row style="width: 240px;">
        <el-col :span="9">
            <el-select
                class="x-input-factor"
                :multiple="false"
                :filterable="true"
                :clearable="false"
                v-model="form['factor']"
                placeholder="查询条件"
                @change="change({ category: 'factor', value: form['factor'], data: form })"
            >
                <el-option
                    v-for="item in options ||[]"
                    :key="item.key || item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled || undefined"
                ></el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
            <el-select
                class="x-input-factor el-col-6"
                :multiple="false"
                v-model="form['operator']"
                :rules="rules"
                placeholder="算符"
                :style="{ width: '100%' }"
                @change="change({ category: 'operator', value: form['operator'], data: form }) "
            >
                <el-option
                    v-for="item in operators || []"
                    :key="item.key || item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled || undefined"
                ></el-option>
            </el-select>
        </el-col>
        <el-col :span="9">
            <el-input
                v-model="form['value']"
                class="x-input-value"
                @change="change"
                placeholder="值"
            ></el-input>
        </el-col>
    </el-row>
</template>
<script>
import { Loading } from "element-ui";
import { Dynamiter } from "../dtos/dynamiter";

export default {
    name: "x-input",
    model: {
        prop: "form",
        event: "change"
    },
    props: {
        form: {
            type: Dynamiter,
            // required: true,
            default: () =>
                new Dynamiter({
                    factor: "",
                    operator: "=",
                    value: ""
                })
        },
        // data: [],
        options: {
            type: Array,
            // required: true,
            default: () => []
        },
        operators: {
            type: Array,
            // required: ,
            default: () => [
                { label: "大于", value: ">" },
                { label: "小于", value: "<" },
                { label: "等于", value: "=" },
                { label: "大于等于", value: ">=" },
                { label: "小于等于", value: "<=" },
                { label: "包含", value: "like" }
            ]
        }
    },
    data() {
        return {};
    },
    computed: {
        rules() {
            return this.form["value"]
                ? [
                      {
                          required: true,
                          message: "必选",
                          trigger: "change,blur"
                      }
                  ]
                : [];
        }
    },
    methods: {
        callback() {
            this.$emit("ok", this.form);
        },
        handleCurrentChange(index) {
            this.$emit("page-change");
        },
        handleCellClick({ row, column, category, data }) {
            this.$emit("cell-click", { row, column, category, data });
        },
        change(val) {
            this.$emit(
                "change",
                this.form.value && this.form.factor ? this.form : undefined
            );
        }
    }
};
</script>
<style lang="scss" scoped> 
.x-input-factor input {
    padding-left: 5px;
    width: 100%;
}
.x-input-value input {
    padding-right: 5px;
    padding-left: 5px;
}
.el-input--suffix .el-input__inner {
    padding-left: 5px;
}
</style>
<style lang="scss" scoped>
#aaa {
    cursor: pointer;
    color: #1e88e5 !important;
    &:hover {
        color: lightcoral !important;
    }
    &:visited {
        color: darkgoldenrod !important;
    }
    &:active {
        color: red !important;
    }
}
</style>

