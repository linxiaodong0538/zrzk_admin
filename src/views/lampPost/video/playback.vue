<template>
  <div id="app">
    <div>
      <input id="deviceMark" type="hidden" value="deviceLight" />
      <div class="box box-main">
        <div class="box-header">
          <el-card>
            <el-select v-model="matrix" placeholder="请选择" @change="rebind" size="mini">
              <el-option
                v-for="cnt in [1, 2, 3, 4]"
                :key="cnt"
                :label="` ${cnt} x ${cnt} `"
                :value="cnt"
              ></el-option>
            </el-select>
          </el-card>
        </div>
        <div class="ui-layout-content">
          <div class="vcontrol">
            <div class="vtree">
              <h4>监测点</h4>
              <el-tree
                :data="tree"
                :props="treeOptions"
                ref="tree"
                default-expand-all
                @node-click="play"
              />
            </div>
            <div class="vctrl">
              <el-button type="primary" icon="el-icon-full-screen" size="mini" title="全屏"></el-button>
              <el-button type="primary" icon="el-icon-video-play" size="mini" title="开始录像"></el-button>
              <el-button type="primary" icon="el-icon-video-pause" size="mini" title="停止录像"></el-button>
              <el-button type="primary" icon="el-icon-crop" size="mini" title="抓图"></el-button>
              <el-button type="primary" icon="el-icon-files" size="mini" title="路径"></el-button>
            </div>
            <h4 style="margin-top: 10px;">云控制台</h4>
            <div class="vpanel">
              <template v-for="toward in directions">
                <el-button type="primary" :icon="`el-icon-${toward.icon}`" size="mini"></el-button>
              </template>
            </div>
            <div class="vpanel" style="margin-left: 5px;">
              <template v-for="cmd in operations">
                <el-button
                  :style="{ visibility: (cmd.visibility || 'inherit') }"
                  type="primary"
                  :icon="`el-icon-${cmd.icon}`"
                  size="mini"
                  :title="cmd.title || undefined"
                ></el-button>
              </template>
            </div>
            <div class="vsetting">
              <el-row :gutter="3">
                <el-col :span="6">预置点</el-col>
                <el-col :span="12">
                  <el-input v-model="predot" size="mini" placeholder="预置点"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="info" plain @click="setting" size="mini">设置</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="3">
                <el-col :span="12" :offset="6">
                  <el-select v-model="dot" size="mini">
                    <el-option label="1" :value="1">点1</el-option>
                    <el-option label="2" :value="2">点2</el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" plain @click="invoke" size="mini">调用</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div
        class="vbox"
        contextmenu="ctx"
        :style="{ 'grid-template-columns': layout, 'grid-template-rows': layout}"
      >
        <div
          class="camera"
          :class="{ 'active': current && (camera.index == current.index) }"
          v-for="(camera, index) in cubes"
          @click="pin(camera)"
        >#{{ index + 1 }} {{ camera.label }}</div>
      </div>
      <menu type="context" id="ctx">
        <menuitem
          label="菜单1"
          onclick="alert('这是菜单1');"
          icon="http://d.lanrentuku.com/down/gif/gif-0145.gif"
        />
        <menuitem
          label="菜单2"
          onclick="alert('这是菜单2');"
          icon="http://d.lanrentuku.com/down/gif/gif-0161.gif"
        />
      </menu>
    </div>
  </div>
</template>
  <script>
export default {
  data: function() {
    return {
      layout: "",
      visible: false,
      matrix: 2,
      current: null,
      cubes: [],
      tree: [],
      predot: "",
      dot: null,
      loading: false,
      treeOptions: {
        children: "children",
        label: "label"
      },
      directions: [
        { icon: "top-left" },
        { icon: "top" },
        { icon: "top-right" },
        { icon: "back" },
        { icon: "refresh" },
        { icon: "right" },
        { icon: "bottom-left" },
        { icon: "bottom" },
        { icon: "bottom-right" }
      ],
      operations: [
        { icon: "plus" },
        { icon: "search", title: "变倍" },
        { icon: "minus" },
        { icon: "plus" },
        { icon: "view", title: "变焦" },
        { icon: "minus" },
        { icon: "plus", visibility: "hidden" },
        { icon: "top-right", title: "光圈", visibility: "hidden" },
        { icon: "minus", visibility: "hidden" }
      ]
    };
  },
  computed: {},
  methods: {
    range(count, start = 0, step = 1) {
      var arr = [];
      for (let i = start; i < count; i += step) arr.push(i);
      return arr;
    },
    pin(node) {
      this.current = node;
    },
    play(camera) {
      console.log("play ", camera);
      // if (this.current) {
      //     let node = this.current.find(x => x.id === this.current.id);
      //     camera.index = node.index;
      //     this.cubes.splice(camera.index, 1, camera);
      //     this.current = camera;
      //     console.log('cubes', camera, this.cubes);
      // } else {
      //     let node = this.cubes.find(x => x.id === undefined);
      //     if (node) {
      //         camera.index = node.index;
      //         this.cubes.splice(node.index, 1, camera);
      //         console.log('cubes', camera, this.cubes);
      //         if (camera.index == this.cubes.length - 1) {
      //             this.current = camera;
      //         }
      //     }
      // }
      let exist = this.cubes.find(x => x.id === camera.id);
      if (exist) {
        this.current = exist;
        this.$forceUpdate();
        return;
      }

      let node = this.cubes.find(x => x.id === undefined);
      if (node) {
        camera.index = node.index;
      } else {
        camera.index = this.current.index;
      }
      this.cubes.splice(camera.index, 1, camera);
      this.current = camera;
      this.$forceUpdate();
    },
    rebind() {
      this.cubes = [];
      this.cubes = this.range(Math.pow(this.matrix, 2)).map((x, i) => ({
        index: i
      }));
      this.layout = `repeat(${this.matrix}, ${(100 / this.matrix).toFixed(2)}%`;
    },
    refactor(list, parentId = null) {
      var nodes = list.filter(x => x.pId === parentId);
      var remains = list.filter(x => x.pId !== parentId);
      for (let node of nodes) {
        node.label = node.name || node.title;
        node.children = this.refactor(remains, node.id);
      }
      return nodes;
    },
    add() {},
    remove() {},
    invoke() {}
  },
  created() {
    this.rebind();
    fetch("/basedata/area/treeData")
      .then(res => res.json())
      .then(res => {
        this.tree = res;
        var nodes = this.refactor(res, null);
        this.tree = nodes;
        console.log("tree data", nodes);
      });
  }
};
</script>
    <style lang="scss" scoped>
#app {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

#app > div {
  flex: 1 1 auto;
}

#app > div:first-child {
  flex: 0 0 220px;
  min-width: 220px;
}

#app > div:nth-child(2) {
  flex: 1 1 auto;
  background: #0a89e1;
}

.vcontrol {
  height: calc(100vh - 120px);
}

.vcontrol > .vtree {
  clear: both;
}

.vtree .el-tree-node.is-current > .el-tree-node__content .el-tree-node__label {
  color: #1e88e5;
}

.vtree {
  height: 55vh;
  max-height: 55vh;
  margin: 10px auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.vpanel {
  width: 45%;
  display: inline-grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(3, 33.33%);
  grid-template-rows: repeat(3, 33.33%);
}

.vpanel > .el-button {
  padding: 5px;
  margin-left: 0 !important;
  margin: 1px;
}

.vpanel > .el-button > i {
  margin: 3px;
}

.vbox {
  height: 100%;
  display: grid;
  grid-auto-flow: row;
}

.vbox > div.camera {
  height: 100%;
  border: 1px solid #0e122d;
  background: #343434;
}

.vbox > div.camera.active {
  border: 1px solid rgba(5, 224, 247, 1);
}

.vsetting {
  margin-top: 10px;
}

.vsetting > .el-row {
  margin-top: 10px;
}
</style>