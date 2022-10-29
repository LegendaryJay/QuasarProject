<script>
import FeatureComponentItem from "@/components/FeatureComponentItem";
import {computed} from "vue";

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
    } )
    return {
      features,
      nextCategory,
    }
  },

}
</script>

<template>
  <q-page-container>
    <h3 class="text-h3 q-my-sm q-mt-md q-mx-md text-center text-bold"> {{ pageInfo.currentCategory.value.title}} </h3>
    <FeatureComponentItem
        v-for="(feature, index) in features"
        :key="index"
        :feature="feature"
        @up="$emit('swap', feature, features[index - 1])"
        @down="$emit('swap', feature, features[index + 1])"
        @edit="() => editCommands.edit(feature)"
        @delete="() => editCommands.remove(feature)"
        :disable-down="index===(features.length-1)"
        :disable-up="index===0"
    >
    </FeatureComponentItem>
    <div class="q-pa-md text-center row justify-center items-center">
      <q-btn v-on:click="pageInfo.isLastPage.value ? console.log('Downloading...') : pageInfo.changePageById(nextCategory.id)" color="primary" class="full-width"
             :label="pageInfo.isLastPage.value ? 'Download Now' : nextCategory.title"/>
    </div>
  </q-page-container>
</template>


<style>
</style>