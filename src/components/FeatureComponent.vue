<script>
import FeatureComponentItem from "@/components/FeatureComponentItem";
import {computed, ref} from "vue";
import {ELEMENT_TYPE} from "@/components/scripts/appdata";

export default {
  components: {FeatureComponentItem},

  props: {
    pageInfo: {
      type: Object,
      required: true
    },
    editCommands: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
  },
  setup(props) {
    const features = computed(() => props.pageInfo.currentPageContents.value)
    const nextCategory = computed(() => {
      let info = props.pageInfo
      let i = info.index.value
      let nextIndex = info.clampToPage(i + 1)
      return info.indexToCategory(nextIndex)
    })


    const fabPos = ref([20, 80])
    const draggingFab = ref(false)
    return {
      features,
      nextCategory,
      ELEMENT_TYPE,


      fabPos,
      draggingFab,

      moveFab(ev) {
        draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

        fabPos.value = [
          fabPos.value[0] - ev.delta.x,
          fabPos.value[1] - ev.delta.y
        ]
      },
    }
  },

}
</script>

<template>
  <q-page-container>
    <h5 class="text-h4 q-my-sm q-mt-md q-mx-md text-center text-bold">
      {{ pageInfo.currentCategory.value?.title ?? '[Missing]' }} </h5>

    <FeatureComponentItem
        v-for="(feature, index) in features"
        :key="index"
        :feature="feature"
        :edit-mode="editMode"
        @up="$emit('swap', feature, features[index - 1])"
        @down="$emit('swap', feature, features[index + 1])"
        @edit="() => editCommands.edit(feature)"
        @delete="() => editCommands.remove(feature)"
        :disable-down="index===(features.length-1)"
        :disable-up="index===0"
    >
    </FeatureComponentItem>
    <div class="q-pa-md text-center row justify-center items-center">
      <q-btn
          v-on:click="pageInfo.isLastPage.value ? console.log('Downloading...') : pageInfo.changePageById(nextCategory.id)"
          color="primary" class="full-width"
          :label="pageInfo.isLastPage.value ? 'Download Now' : nextCategory.title"/>
    </div>

  </q-page-container>
  <q-page-sticky
      v-if="editMode"
      position="bottom-right" :offset="fabPos">
    <q-btn
        fab
        icon="add"
        color="accent"
        padding="xs"
        @click="editCommands.add(ELEMENT_TYPE.FEATURE)"
        v-touch-pan.prevent.mouse="moveFab"
    />
  </q-page-sticky>
</template>


<style>
</style>