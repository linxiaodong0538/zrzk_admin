<template>
  <div class="xny-region">
    <div class="region">
      <div class="box-header">
        <div class="tabBackground" :class="{tabBackgrounddefault:fla==0}" @click="region">区域</div>
        <div class="tabBackground2" :class="{tabBackgrounddefault:fla==1}" @click="coverGroup">分组</div>
      </div>
      <div v-show="fla == 0" class="regionList">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div v-show="fla == 1" class="regionList">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick1"
          />
        </div>
      </div>
    </div>
    <div class="xny-search">
      <!-- v-model="deptName" -->
      <div class="xny-cover">
        <div class="xny-Manhole">
          <span class="coverList">井盖编号:</span>
          <el-input placeholder="井盖编号" size="small" class="Manhole" v-model="coverNumber" />
          <span class="coverList">创建时间:</span>
          <el-input placeholder="创建时间" size="small" class="Manhole" v-model="coverNumber" />
          <span class="coverList">所属项目:</span>
          <el-select v-model="value" placeholder>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              size="small"
              class="Manhole"
            ></el-option>
          </el-select>
          <!-- @click="handleQuery" -->
          <!-- -->
          <el-button type="primary" icon="el-icon-search" size="mini" class="coverSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>
      </div>
      <div class="coverForm">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:dict:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:dict:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:dict:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:dict:export']"
            >导出</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="井盖编号" align="center" prop="deviceCode" />
          <el-table-column label="所在区域" align="center" prop="areaName" />
          <el-table-column label="所在分组" align="center" prop="deviceGroupName" />
          <el-table-column label="经度" align="center" prop="longitude" />
          <el-table-column label="纬度" align="center" prop="latitude" />
          <el-table-column
            label="关联设备"
            align="center"
            prop="ralDeviceNum"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <!-- <el-table-column label="关联设备" align="center" prop="" width="180">
            <el-table-column label="创建时间" align="center" prop="" width="180">-->
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:dict:edit']"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <el-dialog :title="title" :visible.sync="open" width="700px">
          <xnycoveradd :id="management.id" :label="management.label" @cancel="cancel"></xnycoveradd>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import xnycoveradd from "./coveradd";
import {
  region,
  coverForm,
  wellGroup
} from "@/api/system/cover/coverManagement";
import { treeselect } from "@/api/system/dept";
export default {
  components: {
    xnycoveradd
  },
  data() {
    return {
      fla: 0,
      // 部门树选项
      deptOptions: [],
      deptOptions: [],

      defaultProps: {
        children: "children",
        label: "label"
      },
      //井盖编号
      coverNumber: "",
      //创建时间
      creationTime:"",
      options: [
        {
          value: "1",
          label: "所有"
        },
        {
          value: "2",
          label: "项目5"
        },
        {
          value: "3",
          label: "项目6"
        },
        {
          value: "4",
          label: "项目4"
        },
        {
          value: "5",
          label: "项目3"
        }
      ],
      value: "所有",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 井盖管理数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: "",
        dictType: "",
        status: ""
      },
      //新增区域传参
      management: {
        id: "",
        label: ""
      },
      //分组传参
      managementGrouping: {
        id: "",
        label: ""
      },
    };
  },

  mounted() {
    //区域
    this.getTreeselect();
    //井盖表格所有数据
    this.getList();

    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 区域 */
    getTreeselect() {
      region().then(response => {
        this.deptOptions = response.data;
           this.management.id = this.deptOptions[0].id
        this.management.label = this.deptOptions[0].label
        console.log( this.management.id );
        
      });
    },
    //区域
    region() {
      this.fla = 0;
      region().then(response => {
        this.deptOptions = response.data;
        this.management.id = this.deptOptions[0].id
        this.management.label = this.deptOptions[0].label
      });
    },
    // 分组
    coverGroup() {
      this.fla = 1;
      wellGroup().then(response => {
        this.deptOptions = response.data;
        this.managementGrouping.id = this.deptOptions[0].id;
      this.managementGrouping.label = this.deptOptions[0].label;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.management.id = data.id;
      this.management.label = data.label;
   
      this.getList();
    },
    handleNodeClick1(data) {
      this.queryParams.deptId = data.id;
      
      this.managementGrouping.id = data.id;
      this.managementGrouping.label = data.label;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      //   this.dateRange = [];
      //   this.resetForm("queryForm");
      //   this.handleQuery();
    },
    //表单

    /** 查询井盖管理 */
    getList() {
      //  //井盖编号
      // coverNumber: "",
      // //创建时间
      // creationTime:"",
      let areaId =  this.management.id;
      let deviceGroupId = this.managementGrouping.id
      let coverNumber = this.coverNumber
      let creationTime = this.creationTime
      this.loading = true;
    
      coverForm(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          // console.log(response);
          this.typeList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增井盖";
    },
    //关闭新增按钮
    cancel(val) {
      this.open = val;
      this.reset();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // console.log(selection);

      this.ids = selection.map(item => item.dictId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids;
      // console.log(dictId);

      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典类型";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$confirm(
        '是否确认删除字典编号为"' + dictIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delType(dictIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportType(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss" scoped>
// F3F3F4
.xny-region {
  height: calc(100vh - 84px);
  width: 100%;
  background-color: #f3f3f4;
}
.region {
  float: left;
  width: 210px;
  min-height: calc(100vh - 84px);
  background-color: #fff;
}
.box-header {
  width: 100%;
  height: 42px;
  padding: 12px 10px 2px 15px;
  .tabBackground,
  .tabBackground2 {
    float: left;
    font-size: 13px;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-right: 10px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
    padding-left: 10px;
  }
}
.tabBackgrounddefault {
  background-color: #e5e5e5;
  border: 1px solid #e5e5e5;
  color: white;
  cursor: pointer;
}
.regionList {
  border-top: 1px solid #e5e5e5;
  margin-top: 15px;
}
.head-container {
  margin-left: 15px;
  margin-top: 15px;
}
.xny-search {
  float: left;
  width: calc(100% - 210px);
}
.xny-cover,
.coverForm {
  margin-left: 15px;
  margin-right: 20px;
  margin-top: 10px;
  padding: 5px 15px 13px 15px;
  background-color: #fff;
  border-radius: 8px;
  font-size: 13px;
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
//表单
.coverForm {
}
//新增井盖
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