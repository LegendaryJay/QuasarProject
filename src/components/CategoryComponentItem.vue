<script>
import EditExtendo from "@/components/EditExtendo";
import {computed} from "vue";
export default {
  components: {EditExtendo},
  props: {
    category: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      default: -1
    },
    pageInfo: {
      type: Object,
      required: true,
    },
    editCommands: {
      type:Object,
      default: null
    }
  },
  setup(props) {

    const isActive = computed(() => props.index === props.pageInfo.index.value)
    const changePage = () => props.pageInfo.changePage(props.index)

    return {
      isActive,
      changePage,
    }
  },
}
</script>

<template>
  <q-item v-on:click="changePage" clickable :active="isActive" v-ripple>
    <q-item-section :id="category.id">
      {{ category.title }}
    </q-item-section>
    <edit-extendo
        v-if="editCommands !== null"
        @up="$emit('swap', index, index - 1)"
        @down="$emit('swap', index, index + 1)"
        @edit="() => editCommands.edit(category)"
        @delete="() => editCommands.remove(category)"
        :disable-up="index===0"
        :disable-down="index === pageInfo.pageCount.value -1"
    />

  </q-item>
</template>


<style>
</style>