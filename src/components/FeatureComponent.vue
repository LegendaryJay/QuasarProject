<script>
import FeatureComponentItem from "@/components/FeatureComponentItem";

export default {
  components: {FeatureComponentItem},

  props: {
    features: {
      type: Array,
      required: true,
    },
    isLastPage: {
      type: Boolean,
      required: true,
    },
    nextCategory: {
      type: Object,
      required: true,
    },
    pageCategory: {
      type: Object,
      required: true,
    },
    editFeature: {
      type: Function,
      required: true,
    },
    featureController: {
      type: Object,
      required: true,
    }
  },
  emits: ['delete'],
  setup() {

    return {
    }
  },

}
</script>

<template>
  <q-page-container>
    <h3 class="text-h3 q-my-sm q-mt-md q-mx-md text-center text-bold"> {{pageCategory.title}} </h3>
    <FeatureComponentItem
        v-for="(feature, index) in features"
        :key="index"
        :feature="feature"
        @up="featureController.swapItems(index, featureController.indexOf(features[index - 1]))"
        @down="featureController.swapItems(index, featureController.indexOf(features[index + 1]))"
        @delete="$emit('delete',feature)"
        @edit="editFeature(feature)"
        :disable-down="index===(features.length-1)"
        :disable-up="index===0"
    >
    </FeatureComponentItem>
    <div class="q-pa-md text-center row justify-center items-center">
      <q-btn v-on:click="isLastPage ? {} : $emit('go-to-next-page')" color="primary" class="full-width"
             :label="isLastPage ? 'Download Now' : nextCategory.title"/>
    </div>
  </q-page-container>
</template>


<style>
</style>