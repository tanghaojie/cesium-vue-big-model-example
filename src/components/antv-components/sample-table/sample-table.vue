<template>
  <div
    class="sample-table px-5 py-2 bg-gray-800 bg-opacity-70 pointer-events-auto absolute bottom-0 left-0 right-0"
  >
    <div class="head flex flex-row px-3">
      <div class="title-info flex-auto"></div>
      <div class="operator flex-none">
        <div class="remove" @click="close">
          <a-icon type="close" class="text-white cursor-pointer" />
        </div>
      </div>
    </div>
    <div class="content">
      <div id="sample-table" class="" style="height: 300px;"></div>
    </div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('utils/layout', {
      datas: state => state.sampleTable.datas
    })
  },
  watch: {
    '$store.state.utils.layout.sampleTable.datas': function(n, o) {
      this.c.changeData(n)
    }
  },
  mounted() {
    const c = new Chart({
      container: 'sample-table',
      autoFit: true
    })
    c.data(this.datas)
    c.scale('height', {
      nice: true,
      alias: '高'
    })
    c.axis('index', false)
    c.axis('height', {
      label: {
        formatter: (text, item, index) => {
          return text + '米'
        }
      }
    })
    c.tooltip({
      showTitle: false,
      showCrosshairs: true,
      crosshairs: {
        type: 'x',
        follow: true,
        textBackground: {
          padding: 50
        },
        line: {
          style: {
            fill: 'red'
          }
        }
      },
      showMarkers: true
    })
    c.line()
      .position('index*height')
      .shape('smooth')
    c.render()
    this.c = c
  },
  methods: {
    close() {
      this.$store.dispatch('utils/layout/sampleTable', {
        show: false,
        datas: []
      })
    }
  }
}
</script>
