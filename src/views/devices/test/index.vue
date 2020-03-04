<template>
  <div>
    <div class="region">
      <div class="box-header">
        <span class="tabBackground">区域</span>
        <span class="tabBackground2">分组</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.region {
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
    display: inline-block;
    font-size: 13px;
    background-color: #e5e5e5;
    padding-top: 7px;
    padding-bottom: 7px;
    border: 1px solid #e5e5e5;
    color: white;
    cursor: pointer;
  }
}
</style>