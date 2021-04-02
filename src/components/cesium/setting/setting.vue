<template>
  <div
    class="setting bg-black bg-opacity-60 w-full h-full flex justify-center items-center"
    @click.stop="close"
  >
    <div class="s-container bg-gray-600 p-5 rounded-lg" @click.stop>
      <div class="header flex justify-between items-center">
        <div class="title text-white text-lg flex-auto text-center font-bold">
          设置
        </div>
        <a-button
          shape="circle"
          icon="close-circle"
          class="close flex-0 bg-gray-600 text-white"
          @click.native="close"
        />
      </div>

      <div class="option flex flex-wrap mt-5">
        <div
          v-for="(item, index) in options"
          :key="index"
          class="item h-9 flex items-center"
        >
          <div class="text text-white">{{ item.text }}</div>
          <div class="op ml-5">
            <a-switch
              :checked="cesiumOptions[item.key]"
              @change="checked => optionChange(item.key, checked)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('cesium/cesium', {
      cesiumOptions: state => state.options
    })
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
      this.$store.dispatch('utils/layout/settingShown', false)
    },
    optionChange(key, checked) {
      this.cesiumOptions[key] = checked
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  .s-container {
    .option {
      --op-width: 500;
      width: calc(var(--op-width) * 1px);

      .item {
        width: calc(var(--op-width) * 0.5px);
        .text {
          width: calc(var(--op-width) * 0.25px);
        }
      }
    }
  }
}
</style>
