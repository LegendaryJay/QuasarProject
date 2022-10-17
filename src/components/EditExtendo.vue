<template>

    <q-fab
        icon="chevron_left"
        direction="left"
        color="accent"
        padding="xs"
    >
      <q-fab-action v-on:click.stop="$emit('edit')" color="primary" icon="edit" padding="1px"/>
      <q-fab-action
          v-on:click.stop="$emit('up')"
          color="primary"
          icon="arrow_upward"
          padding="1px"
          :disable="disableUp"
      />
      <q-fab-action
          v-on:click.stop="$emit('down')"
          color="primary"
          icon="arrow_downward"
          padding="1px"
          :disable="disableDown"
      />
      <q-fab-action v-on:click.stop="$emit('delete')" color="primary" icon="delete" padding="1px" />
    </q-fab>

</template>

<script>

export default {
  props: {
    disableUp: Boolean,
    disableDown: Boolean,
  },
  emits: ['up', 'down', 'delete', "edit"],
  setup(){
    return{}
  }
}
</script>

<style scoped>

</style>