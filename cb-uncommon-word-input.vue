<template>
  <div class="cb-uncommon-word-input cb-input cb-field cb-form-item" :id="id" :data-id="id">
    <div class="cb-field-label" v-if="label&&type!=='textarea'">
      <i class="cb-field-required-icon cb-icon cb-icon-require" v-if="required"></i><span>{{label}}</span>
    </div>
    <input
      v-if="type!=='textarea'"
      :id="inputId"
      ref="input"
      type="text"
      :name="name"
      :value="p_value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      @input="onInputChange"
      @blur="onInputBlur"
      @focus="onInputFocus"
      class="cb-input-input"/>
    <textarea
      v-if="type==='textarea'"
      ref="input"
      :id="inputId"
      type="textarea"
      :name="name"
      :value="p_value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      @input="onInputChange"
      @blur="onInputBlur"
      @focus="onInputFocus"
      class="cb-input-textarea">
    </textarea>
    <div class="cb-uncommon-word-input-keyboard-container" :class="type==='textarea'?'keyboard-container-textarea':'keyboard-container-input'" @click="showKeyboard()">
      <i class="iconfont icon-jianpan"></i>
      <div class="tips">生僻字</div>
    </div>
    <div class="cb-uncommon-word-input-mask" v-show="maskShow" @click="hideKeyboard()"></div>
    /// #if (!production)
    <cb-input style="display: none"></cb-input>
    /// #endif
  </div>
</template>

<script>
  import tools from '@cbframework/plugins/tools/tools'
  import propSync from '@cbframework/utils/mixins/propsync'
  import CBInput from '@cbframework/components/common/cb-input/cb-input'
  import UncommonWordMixins from './cb-uncommon-word-mixins'

  export default {
    mixins: [UncommonWordMixins, propSync],
    //必须叫cb-input，否则form组件不生效
    componentName: CBInput.componentName,
    props: {
      //name值
      name: String,
      //value值，用于双向数据绑定
      value: {
        type: String
      },
      //输入框标题
      label: String,
      //类型
      type: {
        type: String,
        default: 'text'
      },
      //占位符
      placeholder: {
        type: String,
        default: '请输入'
      },
      //最大输入长度
      maxlength: {
        type: String
      },
      //必输属性
      required: {
        type: Boolean
      },
      //禁用属性
      disabled: {
        type: Boolean
      },
      //表单校验用正则表达式
      formPattern: {
        type: String
      },
      //表单验证提示信息
      formMessage: {
        type: String
      }
    },
    async beforeMount() {
      this.emitFormItemEvent(this.p_value)
      await this.getTokenTidFun()
      await this.getLoadJs(this.uncommonWordInfo.url + '/' + this.uncommonWordInfo.path + '/js/fzKeyboard.js', this.initUncommonWordKeyBoardInput)
    },
    beforeDestroy() {
      this.hideKeyboard()
      this.uncommonWordKeyBoardInput = null
    },
    data() {
      return {
        //必须叫cb-input，否则form组件不生效
        id: tools.generateComponentId(CBInput.componentName),
        inputId: tools.generateComponentId('cb-uncommon-word-input'),
        //生僻字键盘对象
        uncommonWordKeyBoardInput: null,
        //遮罩显示
        maskShow: false
      }
    },
    methods: {
      onInputChange($event) {
        this.p_value = $event.target.value
        this.$emit('change', this.p_value)
        this.$emit('input', this.p_value)
        this.emitFormItemEvent(this.p_value)
      },
      onInputBlur($event) {
        this.$emit('blur', $event.target.value)
      },
      onInputFocus($event) {
        this.$emit('focus', $event.target.value)
      },
      emitFormItemEvent(value) {
        this.$bus.emit('_$form-item-change', {
          id: this.$data.id,
          props: this.$props,
          data: this.$data,
          type: this.type,
          value: value
        })
      },
      showKeyboard() {
        if (this.uncommonWordKeyBoardInput) {
          this.uncommonWordKeyBoardInput.show()
        }
      },
      hideKeyboard() {
        if (this.uncommonWordKeyBoardInput) {
          this.uncommonWordKeyBoardInput.hide()
        }
      },
      initUncommonWordKeyBoardInput() {
        let _this = this
        this.uncommonWordKeyBoardInput = new window.FzKeyboard(('#' + this.inputId), {
          domainUrl: this.uncommonWordInfo.url,
          contextPath: '/srf',
          tid: this.uncommonWordInfo.tid,
          token: this.uncommonWordInfo.token,
          onlyUncc: false,
          drag: false,
          hideAnimate: false,
          css: 'cb-uncommon-word-input-keyboard',
          events: {
            show() {
              _this.maskShow = true
            },
            hide() {
              _this.maskShow = false
            },
            inputComplet(str) {
              _this.p_value = str
              _this.$emit('change', str)
              _this.$emit('input', str)
              _this.emitFormItemEvent(str)
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .cb-uncommon-word-input-mask {
    position: fixed;
    z-index: 5000 !important;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: transparent;
  }

  .cb-uncommon-word-input-keyboard {
    z-index: 5001 !important;

    .css-_style_historyFonts-3aIP9 {
      color: #colors[primary];
    }

    .css-_style_confirm-2Xptz {
      background: #colors[primary];
    }

    p {
      margin: 0 !important;
    }
  }

  .ios {
    .safe-areas({ .cb-uncommon-word-input-keyboard {
      bottom: constant(safe-area-inset-bottom);
      bottom: env(safe-area-inset-bottom);
    } });
  }

  .cb-uncommon-word-input {
    position: relative;
    .cb-input-input, .cb-input-textarea {
      padding-right: 45px !important;
      text-align: left;
      border: 0;
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      min-height: 34px;
      width: 100%;
      color: @font-color-content;
    }
    .cb-input-textarea{
      min-height: 60px;
    }
    &-keyboard-container {
      position: absolute;
      width: 45px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: @font-color-subsidiary;

      &.keyboard-container-textarea {
        right: 0;
        top: 0;
        bottom: 0;
        justify-content: flex-end;

      }

      &.keyboard-container-input {
        right: 0;
        bottom: 0;
        justify-content: center;
      }

      .iconfont {
        font-size: 1.5rem;
        margin: -4px 0 -5px 0;
        color: #colors[primary];
      }

      .tips {
        font-size: 0.75rem;
      }
    }
  }

</style>
