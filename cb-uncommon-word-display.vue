<template>
  <div>
    <div :id="id">{{content}}</div>
  </div>
</template>

<script>
  import tools from '@cbframework/plugins/tools/tools'
  import UncommonWordMixins from './cb-uncommon-word-mixins'

  export default {
    mixins: [UncommonWordMixins],
    name: 'cb-uncommon-word-display',
    props: {
      content: String
    },
    data() {
      return {
        id: tools.generateComponentId('cb-uncommon-word-display'),
        uncommonWordDisplayObject: null
      }
    },
    async beforeMount() {
      await this.getTokenTidFun()
      await this.getLoadJs(this.uncommonWordInfo.url + '/' + this.uncommonWordInfo.path + '/js/bundle.js', this.uncommonWordDisplay)
    },
    methods: {
      //生僻字展示
      uncommonWordDisplay() {
        this.uncommonWordDisplayObject = new window.UncommonWordShow(['#' + this.id], {
          domainUrl: this.uncommonWordInfo.url,
          contextPath: '/srf',
          tid: this.uncommonWordInfo.tid,
          token: this.uncommonWordInfo.token,
          onlyUncc: true,
          events: null
        })
      }
    }
  }
</script>

<style lang="less">
</style>
