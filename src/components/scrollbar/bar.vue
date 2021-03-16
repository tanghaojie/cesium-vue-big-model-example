<template>
  <div
    class="bar"
    :class="['is-' + bar.key]"
    :style="{ 'background-color': barBg }"
    @mousedown="clickTrackHandler"
  >
    <div
      ref="thumb"
      class="thumb"
      :style="[
        renderThumbStyle({ size, move, bar }),
        { 'background-color': thumbBg }
      ]"
      @mousedown="clickThumbHandler"
    ></div>
  </div>
</template>

<script>
const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
}

export default {
  props: {
    vertical: Boolean,
    size: String,
    move: Number,
    barBg: {
      type: String,
      default: 'transparent',
      required: false
    },
    thumbBg: {
      type: String,
      default: 'rgba(144,147,153,.5)',
      required: false
    }
  },
  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal']
    },
    wrap() {
      return this.$parent.wrap
    }
  },
  methods: {
    renderThumbStyle({ move, size, bar }) {
      const style = {}
      const translate = `translate${bar.axis}(${move}%)`
      style[bar.size] = size
      style.transform = translate
      style.msTransform = translate
      style.webkitTransform = translate
      return style
    },
    clickTrackHandler(e) {
      const offset = Math.abs(
        e.target.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]
      )
      console.log(offset)
      const thumbHalf = this.$refs.thumb[this.bar.offset] / 2
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100) / this.$el[this.bar.offset]
      this.wrap[this.bar.scroll] =
        (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },
    clickThumbHandler(e) {
      if (e.ctrlKey || e.button === 2) {
        return
      }
      this.startDrag(e)
      this[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] -
          e.currentTarget.getBoundingClientRect()[this.bar.direction])
    },
    startDrag(e) {
      e.stopImmediatePropagation()
      this.cursorDown = true
      document.addEventListener(
        'mousemove',
        this.mouseMoveDocumentHandler,
        false
      )
      document.addEventListener('mouseup', this.mouseUpDocumentHandler, false)
      document.onselectstart = () => false
    },
    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return
      const prevPage = this[this.bar.axis]
      if (!prevPage) return
      const offset =
        (this.$el.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]) *
        -1
      const thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / this.$el[this.bar.offset]
      this.wrap[this.bar.scroll] =
        (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },
    mouseUpDocumentHandler(e) {
      this.cursorDown = false
      this[this.bar.axis] = 0
      document.removeEventListener(
        'mousemove',
        this.mouseMoveDocumentHandler,
        false
      )
      document.onselectstart = null
    }
  },
  destroyed() {
    document.removeEventListener('mouseup', this.mouseUpDocumentHandler, false)
  }
}
</script>

<style lang="scss" scoped>
.bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  opacity: 0;
  border-radius: 4px;
  transition: opacity 0.12s ease-out 0s;
  .thumb {
    border-radius: inherit;
  }
}
.is-horizontal {
  height: 6px;
  left: 2px;
}
.is-vertical {
  width: 6px;
  top: 2px;
}
</style>
