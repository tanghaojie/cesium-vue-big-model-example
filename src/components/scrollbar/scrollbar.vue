<script>
import scrollbarWidth from '../../utils/scrollbar-width'
import Bar from './bar'
import {
  addResizeListener,
  removeResizeListener
} from '../../utils/resize-event'

export default {
  components: { Bar },
  props: {
    barBg: {
      type: String,
      default: 'transparent',
      required: false
    },
    thumbBg: {
      type: String,
      default: 'rgba(144,147,153,.5)',
      required: false
    },
    resize: {
      type: Boolean,
      default: false,
      required: false
    },
    height: {
      type: String,
      default: '100%',
      required: false
    }
  },
  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      wrapStyle: {},
      viewStyle: {}
    }
  },
  computed: {
    wrap() {
      return this.$refs.wrap
    }
  },
  render(h) {
    const gutter = scrollbarWidth()
    if (gutter) {
      const style = this.wrapStyle
      style.marginRight = style.marginBottom = `-${gutter}px`
    }
    const view = h(
      'div',
      {
        class: ['scrollbar-view'],
        style: this.viewStyle,
        ref: 'view'
      },
      this.$slots.default
    )
    const wrap = h(
      'div',
      {
        ref: 'wrap',
        class: 'scrollbar-wrap',
        style: this.wrapStyle,
        on: {
          scroll: this.handleScroll
        }
      },
      [view]
    )

    return h(
      'div',
      {
        class: 'scrollbar',
        style: { height: this.height }
      },
      [
        wrap,
        h(Bar, {
          props: {
            move: this.moveX,
            size: this.sizeWidth,
            barBg: this.barBg,
            thumbBg: this.thumbBg
          }
        }),
        h(Bar, {
          props: {
            vertical: true,
            move: this.moveY,
            size: this.sizeHeight,
            barBg: this.barBg,
            thumbBg: this.thumbBg
          }
        })
      ]
    )
  },
  mounted() {
    this.$nextTick(this.update)
    this.resize && addResizeListener(this.$refs.view, this.update)
  },
  beforeDestroy() {
    this.resize && removeResizeListener(this.$refs.resize, this.update)
  },
  methods: {
    handleScroll() {
      const wrap = this.wrap
      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
    },
    update() {
      const wrap = this.wrap
      if (!wrap) return
      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth
      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollbar {
  position: relative;
  overflow: hidden;
  &:hover {
    .bar {
      opacity: 1;
    }
  }
  .scrollbar-wrap {
    height: 100%;
    overflow-y: scroll;
    .scrollbar-view {
      padding-bottom: 6px;
    }
  }
}
</style>
