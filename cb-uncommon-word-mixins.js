import Vue from 'vue'
import vuex from 'vuex'
import CBUncommonWordStore from './cb-uncommon-word-store'

const {mapMutations, mapState} = vuex.createNamespacedHelpers('uncommonWordGlobalState')
let mixin = {
  beforeMount() {
    this.$store.registerModule('uncommonWordGlobalState', CBUncommonWordStore)
  },
  computed: {
    ...mapState(['uncommonWordInfo'])
  },
  methods: {
    ...mapMutations([
      'setUncommonWordTokenTidInfo', 'setUncommonWordState'
    ]),
    //先获取vuex中的数据是否存在，不存在->( web: 获取local数据; app: 获取桥接口中的数据 ) -> 存在 - > 保存到vuex中 - > 不存在 -> 请求前置接口 -> ( web: 存储到local； app: 存储到桥接口) -> 存储到vuex
    getTokenTidFun() {
      return new Promise(async (resolve) => {
        if (this.uncommonWordInfo.stateReady) {
          if (this.uncommonWordInfo.tid) {
            resolve()
          } else {
            this.$bus.on('uncommonWordTokenTidEmit', function () {
              resolve()
            })
          }
        } else {
          /// #if (platform === 'WEB' || platform === 'MP')
          let nowTime = new Date().getTime()
          let uncommonWordContent = this.$CBPlugin.storage.getStorage('uncommonWord')
          if (uncommonWordContent && nowTime < uncommonWordContent.EXPIREDTIME) {
            this.setUncommonWordTokenTidInfo(uncommonWordContent)
            Vue.bus.$emit('uncommonWordTokenTidEmit')
            resolve(uncommonWordContent)
          } else {
            //重新查询
            let result = await this.TokenTidContentRequest()
            resolve()
            this.$CBPlugin.storage.setStorage('uncommonWord', result)
          }
          /// #else
          let getterOthernoOptions = {
            fileName: 'uncommonWordFile',
            key: 'uncommonWord',
            valueType: ''
          }
          let uncommonWordAppContent = await this.$CBNative.setting.getterOtherno(getterOthernoOptions)
          let nowTimeApp = new Date().getTime()
          if (uncommonWordAppContent && nowTimeApp < uncommonWordAppContent.EXPIREDTIME) {
            this.setUncommonWordTokenTidInfo(uncommonWordAppContent)
            Vue.bus.$emit('uncommonWordTokenTidEmit')
            resolve(uncommonWordAppContent)
          } else {
            let resultApp = await this.TokenTidContentRequest()
            resolve()
            let setterOthernoOptions = {
              fileName: 'uncommonWordFile',
              key: 'uncommonWord',
              value: JSON.stringify(resultApp),
              valueType: ''
            }
            await this.$CBNative.setting.setterOtherno(setterOthernoOptions)
          }
          /// #endif
        }
      })
    },
    async TokenTidContentRequest() {
      this.setUncommonWordState(true)
      let requestParams = this.$CBPlugin.api.getRequestParams()
      requestParams.apiName = 'WORDTOKEN'
      let result = await this.$CBPlugin.api.requestAPI(requestParams)
      this.setUncommonWordTokenTidInfo(result)
      Vue.bus.$emit('uncommonWordTokenTidEmit')
      return result
    },
    getLoadJs(url, callback) {
      return new Promise(resolve => {
        let scripts = document.querySelectorAll('script[src = \'' + url + '\']')
        let script = document.createElement('script')
        script.setAttribute('uncommon-word-js-load-state', 'readyState')
        if (scripts.length < 1) {
          script.setAttribute('type', 'text/javascript')
          script.setAttribute('src', url)
          document.body.appendChild(script)
          script.onload = function () {
            script.setAttribute('uncommon-word-js-load-state', 'loaded')
            resolve(callback())
            Vue.bus.$emit('uncommonWordJsLoadedFun')
          }
        } else {
          if (scripts[0].getAttribute('uncommon-word-js-load-state') === 'loaded') {
            resolve(callback())
          } else {
            this.$bus.on('uncommonWordJsLoadedFun', () => {
              if (scripts[0].getAttribute('uncommon-word-js-load-state') === 'loaded') {
                resolve(callback())
              }
            })
          }
        }
      })
    }
  }
}
export default mixin
