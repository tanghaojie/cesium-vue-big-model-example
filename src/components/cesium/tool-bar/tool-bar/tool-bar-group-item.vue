<template>
  <div class="tool-bar-group-item">
    <div class="item flex justify-center items-center mx-1 px-3">
      <div
        @click="itemClicked"
        class="item-container flex flex-col justify-center items-center cursor-pointer hover:text-blue-400"
        :class="isActive ? 'text-blue-400' : ''"
      >
        <div class="icon text-5xl">
          <svg-icon :name="iconName" />
        </div>
        <div class="name text-sm text-white">
          <slot></slot>
        </div>
      </div>

      <div
        v-if="dropdown"
        @click.stop="dropdownClicked"
        class="dropdown flex justify-center items-center ml-2 h-full hover:text-blue-400"
        :class="isDropdownActive ? 'text-blue-400' : ''"
      >
        <svg-icon name="arrow-down" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    iconName: {
      type: String,
      default: 'setting'
    },
    active: {
      type: Boolean,
      default: false
    },
    dropdown: {
      type: Boolean,
      default: false
    },
    dropdownActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false,
      isDropdownActive: false
    }
  },
  computed: {},
  watch: {
    active() {
      this.isActive = this.active
    },
    dropdownActive() {
      this.isDropdownActive = this.dropdownActive
    }
  },
  created() {},
  mounted() {
    this.isActive = this.active
    this.isDropdownActive = this.dropdownActive
  },
  methods: {
    dropdownClicked() {
      this.$emit('dropdownClicked')
    },
    itemClicked() {
      this.$emit('itemClicked')
    }
  }
}
</script>
