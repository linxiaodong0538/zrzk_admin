<template>
  <div class="xny-xinzeng">
    <!-- 添加或修改参数配置对话框 -->
    <div class="coverManagement">
      <span>区域名称:</span>
      <el-input placeholder="创建时间" size="small" class="managementList" v-model="label" readonly />
      <el-button icon="el-icon-search" class="mechanismTime" size="small" @click="searchArea"></el-button>
      <span class="xnt-coverList">网关类型:</span>
      <el-select v-model="valueGateway" placeholder>
        <el-option
          v-for="item in gateway"
          :key="item.value"
          :label="item.label"
          :value="item.valueGateway"
          size="small"
          class="Manhole"
        ></el-option>
      </el-select>
    </div>
    <div class="coverManagement">
      <span>网关名称:</span>
      <el-input placeholder size="small" class="Manhole" v-model="gatewayName" />
      <span class="coverList">网关地址:</span>
      <el-input placeholder size="small" class="Manhole" v-model="defaultGateway" />
    </div>
    <div class="coverManagement">
      <span>经度:</span>
      <el-input placeholder size="small" class="Manhole" v-model="longitude" />
      <span class="coverList">纬度:</span>
      <el-input placeholder size="small" class="Manhole" v-model="latitude" />
    </div>
    <div class="coverManagement">
      <span>TCP注册包:</span>
      <el-input placeholder size="small" class="Manhole" v-model="TCPRegistration " />
      <span class="coverList">控制箱编号:</span>
      <el-input placeholder size="small" class="Manhole" v-model="controlBox" />
    </div>
    <div class="coverManagement">
      <span>变比:</span>
      <el-input placeholder size="small" class="Manhole" v-model="variableRatio" />
      <span class="coverList">轮询时间:</span>
      <el-input placeholder size="small" class="Manhole" v-model="pollTime" />
    </div>
    <div class="coverManagement">
      <span>是否加密:</span>
      <el-select v-model="valueEncryption" placeholder>
        <el-option
          v-for="item in encryption"
          :key="item.value"
          :label="item.label"
          :value="item.valueEncryption"
          size="small"
          class="Manhole"
        ></el-option>
      </el-select>
      <span class="coverList">所属项目:</span>
      <el-select v-model="valueProject" placeholder>
        <el-option
          v-for="item in project"
          :key="item.value"
          :label="item.label"
          :value="item.valueProject"
          size="small"
          class="Manhole"
        ></el-option>
      </el-select>
    </div>
    <div class="coverManagement">
      <span>是否报警:</span>
      <el-select v-model="value" placeholder>
        <el-option
          v-for="item in callPolice"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          size="small"
          class="Manhole"
        ></el-option>
      </el-select>
      <span class="coverList">所属分组:</span>
      <el-select v-model="value1" placeholder>
        <el-option
          v-for="item in grouping"
          :key="item.value1"
          :label="item.label"
          :value="item.value1"
          size="small"
          class="Manhole"
        ></el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">关 闭</el-button>
    </div>

    <!-- <el-dialog :title="title" :visible.sync="fla" width="400px"></el-dialog> -->
    <div v-show="fla" class="layertitle">
      <div class="layui-layer-title">
        <span>区域选择</span>
        <i class="el-icon-close layui-layer-close1" @click="areaClosure"></i>
      </div>
      <div class="treeSearchInput">
        <span>关键字：</span>
        <!-- v-model="input"  -->
        <el-input placeholder size="mini" class="empty"></el-input>
        <el-button size="mini">搜索</el-button>
      </div>
      <div class="head-container">
        <el-tree
          :data="deptOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          default-expand-all
        />
      </div>
      <div slot="footer" class="dialog-footer layui-layer-btn">
        <el-button type="primary" size="mini">确 定</el-button>
        <el-button @click="areaClosure" size="mini">关 闭</el-button>
      </div>
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
      //网关类型
      gateway: [
        {
          valueGateway: "1",
          label: "一代网关"
        },
        {
          valueGateway: "2",
          label: "二代网关"
        },
        {
          valueGateway: "3",
          label: "三代网关"
        },
        {
          valueGateway: "4",
          label: "四代网关"
        }
      ],
      valueGateway: "一代网关",
      //是否加密
      encryption: [
        {
          valueEncryption: "1",
          label: "是"
        },
        {
          valueEncryption: "2",
          label: "否"
        }
      ],
      //所属项目
      project: [
        {
          valueProject: "1",
          label: "智慧路灯"
        },
        {
          valueProject: "2",
          label: "智慧水务"
        },
        {
          valueProject: "3",
          label: "智慧井盖"
        }
      ],
      valueProject: "1",
      //是否报警
      callPolice: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      value: "2",
      //所属分组grouping
        grouping: [
        {
          value1: "1",
          label: "分组1"
        },
        {
          value1: "2",
          label: "分组3"
        }
      ],
      value1: "1",
      valueEncryption: "1",
      gatewayName: "", //网关名称
      defaultGateway: "", //网关地址
      TCPRegistration: "", //TCP注册包
      controlBox: "", //控制箱编号
      variableRatio: "", //变比
      pollTime: "", //轮询时间
      longitude: "",
      latitude: "",
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
    width: 80px;
    display: inline-block;
    text-align: right;
  }
  .coverList {
    margin-left: 60px;
  }
}
.mechanismTime {
  position: absolute;
  left: 244px;
  width: 40px;
  height: 30px;
  border-left: 0;
  border-radius: 0 4px 4px 0;
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
  margin-left: 73px;
}
.Manhole {
  width: 200px;
  height: 30px;
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
</style>