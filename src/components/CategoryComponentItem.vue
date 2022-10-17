<script>
import EditExtendo from "@/components/EditExtendo";

export default {
  components: {EditExtendo},

  props: {
    category: {
      type: Object,
      required: true,
    },
    active: Boolean,
    disableUp: Boolean,
    disableDown: Boolean,
  },
  emits: ['set-category-page', 'up', 'down', 'delete', "edit"],
  setup() {

    return {
    }
  },


}
</script>

<template>
  <q-item v-on:click="$emit('set-category-page', category.id)" clickable :active="active" v-ripple>
    <q-item-section :id="category.id">
      {{ category.title }}
    </q-item-section>
    <edit-extendo
        v-if="category.id !== -1"
        @up="$emit('up')"
        @down="$emit('down')"
        @edit="$emit('edit')"
        @delete="$emit('delete', category.id)"
        :disable-down="disableDown"
        :disable-up="disableUp"
    />

  </q-item>
</template>


<style>
</style>