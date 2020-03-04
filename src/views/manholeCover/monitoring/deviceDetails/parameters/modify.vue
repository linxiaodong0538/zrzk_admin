<template>
  <div class="xny-xinzeng">
    <!-- 添加或修改参数配置对话框 -->

    <div class="coverManagement">
      <span>产品名称:</span>
      <el-select v-model="value" multiple placeholder="请选择" class="ipAddress">
        <el-option
          v-for="item in project"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="coverList">已选择1台设备</span>
      <p>下发参数</p>
      <!-- @selection-change="handleSelectionChange" -->
      <el-table :data="typeList" >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="数据名称" align="center" prop="lanternsName" />
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="gatewayName" class="Manhole" placeholder="请输入内容"></el-input>
             <!-- @click=" historical" -->
            <span class="viewData">填入默认值</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">提 交</el-button>
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </div>
</template>
<script>
import { region } from "@/api/system/dept";
import { treeselect } from "@/api/system/dept";
export default {
  props: ["id", "label"],
  data() {
    return {
      // 部门树选项
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      // 是否显示弹出层
      open: true,
      // 搜索区域
      fla: false,
      //所属项目
      project: [
        {
          value: "1",
          label: "智慧路灯"
        },
        {
          value: "2",
          label: "智慧水务"
        },
        {
          value: "3",
          label: "智慧井盖"
        }
      ],
      value: "",
      typeList: [
        {
          lanternsName: "数据上传间隔" //灯具名称
        }
      ],
      gatewayName: "", //网关名称
      defaultGateway: "", //网关地址
      TCPRegistration: "", //TCP注册包
      controlBox: "", //控制箱编号
      variableRatio: "", //变比
      pollTime: "", //轮询时间
      radio: "1", //是否为NVR
      longitude: "",
      latitude: "",
      screen: "1", //屏幕状态
      device: "1", //设备状态
      locked: "1", //上锁状态
      title: ""
    };
  },
  methods: {
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.$emit("cancel", this.open);
    },
    searchArea() {
      this.fla = true;
      this.title = "新增井盖";
      this.getTreeselect();
    },
    // 搜索区域
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getTreeselect() {
      // region().then(response => {
      //   this.deptOptions = response.data;
      // });
      //部门结构
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    areaClosure() {
      this.fla = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.coverManagement {
  position: relative;
  margin-bottom: 20px;
  span {
    // width: 80px;
    display: inline-block;
    text-align: right;
  }
  .coverList {
    margin-left: 10px;
  }
}
.mechanismTime,
.mechanismTime2 {
  position: absolute;
  width: 40px;
  height: 30px;
  border-left: 0;
  border-radius: 0 4px 4px 0;
}
.mechanismTime {
  left: 243px;
}
.xny-mechanismTime {
  left: 565px;
}
.mechanismTime:hover {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-left: 0;
}
.mechanismTime:focus {
  // border: none;
  border: 1px solid #dcdfe6;
  border-left: 0;
  background-color: #fff;
}
.managementList {
  width: 160px;
}
.xnt-coverList {
  margin-left: 98px;
}
.xny-Manhole {
  margin-top: 10px;
}
.coverList {
  margin-left: 10px;
}
.coverSearch {
  margin-left: 20px;
}
.dialog-footer {
  // float: right;
  text-align: right;
}
.xny-xinzeng {
  margin-left: 40px;
  position: relative;
}
//点击搜索
.layertitle {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.layui-layer-title {
  background: #f8f8f8;
  color: #333;
  font-size: 14px;
  height: 42px;
  line-height: 42px;
  border: none;
  padding: 0 20px 0 20px;
}
.layui-layer-close1 {
  font-size: 17px;
  cursor: pointer;
  float: right;
  line-height: 42px;
}
.treeSearchInput {
  margin-top: 15px;
  margin-left: 30px;
}
.empty {
  width: 120px;
}
.head-container {
  margin-top: 20px;
  margin-left: 30px;
}
.layui-layer-btn {
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.screenState {
  margin-left: 30px;
}
.deviceState {
  margin-left: 92px;
}
//设备id样式
.viewData {
  color: #1c84c6;
  cursor: pointer;
}
.Manhole {
  width: 200px;
  height: 30px;
}
</style>
<style >
.el-input--medium .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.managementList.el-input--small .el-input__inner {
  border-right: 0;
  border-radius: 4px 0 0 4px;
}
.managementList.el-input--small .el-input__inner:focus {
  border: 1px solid #dcdfe6;
  border-right: 0;
}
.el-select > .el-input {
  width: 200px;
}
.ipAddress.el-select > .el-input {
  width: 400px;
}
</style>