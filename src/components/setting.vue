<template>
  <div class="setting" @click.stop="close">
    <div class="container" @click.stop>
      <div class="header">
        <div class="title">设置</div>
        <a-button
          shape="circle"
          icon="close-circle"
          class="close"
          @click.native="close"
        />
      </div>

      <div class="option">
        <div v-for="(item, index) in options" :key="index" class="item">
          <div class="text">{{ item.text }}</div>
          <div class="op">
            <a-switch
              :checked="current[item.key]"
              @change="checked => optionChange(item.key, checked)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Object
    }
  },
  data() {
    return {
      options: [
        {
          text: '动画组件',
          key: 'animation'
        },
        {
          text: '默认图层选择器',
          key: 'baseLayerPicker'
        },
        {
          text: '全屏按钮',
          key: 'fullscreenButton'
        },
        {
          text: 'geocoder',
          key: 'geocoder'
        },
        {
          text: 'Home按钮',
          key: 'homeButton'
        },
        {
          text: '信息框',
          key: 'infoBox'
        },
        {
          text: '3D/2D选择器',
          key: 'sceneModePicker'
        },
        {
          text: '选取指示器组件',
          key: 'selectionIndicator'
        },
        {
          text: '时间轴',
          key: 'timeline'
        },
        {
          text: '帮助按钮',
          key: 'navigationHelpButton'
        }
      ]
    }
  },
  methods: {
    close() {
      this.$store.dispatch('utils/cesium-setting/settingShown', false)
    },
    optionChange(key, value) {
      this.$emit('optionChange', { key, value })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  background-color: rgba($color: #000000, $alpha: 0.6);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    background-color: white;
    padding: 20px;
    border-radius: 16px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 18px;
        flex: 1 1 auto;
        text-align: center;
      }
      .close {
        flex: 0 0 auto;
      }
    }

    .option {
      --op-width: 400;
      width: calc(var(--op-width) * 1px);
      display: flex;
      flex-wrap: wrap;
      margin-top: 18px;

      .item {
        height: 36px;
        width: calc(var(--op-width) * 0.5px);
        display: flex;
        align-items: center;
        .text {
          width: calc(var(--op-width) * 0.25px);
        }
        .op {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
