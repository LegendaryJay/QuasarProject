<script>
import {computed} from "vue";
import FeatureComponentItem from "@/components/FeatureComponentItem";

export default {
  components: {FeatureComponentItem},

  props: {
    features: {
      type: Array,
      required: true,
    },
    pageCategory: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    nextPage: {
      type: Object,
      required: true,
    }
  },
  emits: ['set-category-page', 'go-to-next-page', 'swapRelativePositions', 'delete', "edit"],
  setup(props) {
    const buttonTitle = computed(
        () => typeof props.nextPage === "undefined" ? "Download Now!" : props.nextPage.title
    )
    return {
      buttonTitle,
    }
  },

}
</script>

<template>
  <q-page-container>
    <h3 class="text-h3 q-my-sm q-mt-md q-mx-md text-center text-bold"> {{pageCategory.title}}</h3>
    <FeatureComponentItem
        v-for="(feature, index) in features"
        :key="index"
        :feature="feature"
        @up="$emit('swapRelativePositions',index, -1)"
        @down="$emit('swapRelativePositions',index, 1)"
        @delete="$emit('delete',feature.id)"
        @edit="$emit('edit')"
        :disable-down="index===(features.length-1)"
        :disable-up="index===0"
    >
    </FeatureComponentItem>
    <div class="q-pa-md">
      <q-btn v-on:click="$emit('go-to-next-page')" color="primary" class="full-width"
             :label="buttonTitle"/>
    </div>
  </q-page-container>
</template>


<style>
</style>