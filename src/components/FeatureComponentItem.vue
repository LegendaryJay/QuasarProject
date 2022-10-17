<script>
//import {computed} from "vue";

import EditExtendo from "@/components/EditExtendo";

export default {
  components: {EditExtendo},
  props: {
    feature: {
      type: Object,
      required: true,
    },
    disableDown: Boolean,
    disableUp: Boolean,
  },
  data() {
    return {}
  },

}
</script>
<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lFf" container style="min-height: 225px" class="shadow-2 rounded-borders">
      <q-header reveal elevated>
        <q-toolbar>
          <q-toolbar-title>
            {{ feature.title }}
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <p style="white-space:pre-wrap;">
            {{ feature.description }}
          </p>

        </q-page>
        <q-page-sticky class="q-pa-xs" position="bottom-right" :offset="[5, 5]">
          <edit-extendo
              @up="$emit('up')"
              @down="$emit('down')"
              @edit="$emit('edit')"
              @delete="$emit('delete')"
              :disable-down="disableDown"
              :disable-up="disableUp"
          >

          </edit-extendo>
        </q-page-sticky>
      </q-page-container>
    </q-layout>

  </div>
</template>


<style>
</style>