<template>
  <div>
    <svg-icon icon-class="download" @click="handleDownload"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYi',
  data() {
    return {
      url: 'http://www.baidu.com'
    }
  },
  methods: {
    handleDownload() {
      window.open(this.url)
    }
  }
}
</script>