<template>
  <div class="xny-region">
    <div class="Navigation">
      <span class="Monitor" :class="{xny_highlight:navBAr==0}" @click="navBAr=0">终端状态</span>
      <span class="History" :class="{xny_highlight:navBAr==1}" @click="navBAr=1">媒体资源</span>
      <span class="History" :class="{xny_highlight:navBAr==2}" @click="navBAr=2">设备分区</span>
      <span class="History" :class="{xny_highlight:navBAr==3}" @click="navBAr=3">定时广播</span>
    </div>
    <div v-if="navBAr==0">
    <terminal></terminal>
    </div>
    <div v-if="navBAr==1">
      <media></media>
    </div>
    <div v-if="navBAr==2">
      <partition></partition>
    </div>
    <div v-if="navBAr==3">
      <timing></timing>
    </div>
  </div>
</template>
<script>
import terminal from './terminal/index'//终端状态
import media from './media/index'//媒体资源
import partition from './partition/index'//设备分区
import timing from './timing/index'//定时广播
export default {
  components: { terminal,media,partition,timing},
  data() {
    return {
   
      //导航栏
      navBAr: 0,
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
.Navigation {
  margin: 5px 0;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background-color: #fff;
  .Monitor,
  .History {
    cursor: pointer;
    display: inline-block;
    padding: 0 15px;
  }
  .Monitor {
    margin-left: 20px;
  }

  //   1890FF
}
// 点击高亮
.xny_highlight {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}


</style>
