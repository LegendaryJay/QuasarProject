<template>
  <q-layout view="hhh LpR fff">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Spirit Tree Mod <small>[Edit mode]</small>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
          <category-component-item
              v-for="(category, index) in dataController.categories.usedCategories()"
              :category="category"
              :key="index"
              :active="category.id === currentCategory.id"
              @set-category-page="changePageById"
              @up="() => dataController.categories.swapPositions(category, dataController.categories.usedCategories()[index - 1])"
              @down="() => dataController.categories.swapPositions(category, dataController.categories.usedCategories()[index + 1])"
              @edit="editCategory"
              @delete="removeCategory(category)"
              :disable-up="index === 0"
              :disable-down="index===(dataController.categories.usedCategories().length - 1)"
          />

          <category-component-item
              v-if="dataController.features.itemsWithoutCategory().length"
              :category="{title:'[Undefined]', id:-1}"
              :active=" currentCategory.id === -1"
              @set-category-page="changePageById(-1)"
          >
          </category-component-item>

        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="./assets/tree.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <div class="text-weight-bold">Features</div>
        </div>
      </q-img>
    </q-drawer>
    <FeatureComponent
        :features="currentPageContents"
        :feature-controller="dataController.features"
        :categories="dataController.categories.items()"
        :page-category="currentCategory"
        :next-category="dataController.categories.usedCategories()[RelativePageNumber(1)]"
        :is-last-page="isLastPage"
        @go-to-next-page="relativeChangePage(1)"
        @delete="removeFeature"
        :editFeature="editFeature"
    />

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>This is the bottom!</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>

import {computed, ref} from "vue";
import FeatureComponent from "@/components/FeatureComponent";
//import CategoryComponentItem from "@/components/CategoryComponentItem";
import {useQuasar} from "quasar";
import DialogueBox from "@/components/DialogueBox/DialogueBox";
import CategoryInput from "@/components/DialogueBox/CategoryInput";
import FeatureInput from "@/components/DialogueBox/FeatureInput";
import {Category, Feature, FeatureDataController} from '@/components/appData'
import CategoryComponentItem from "@/components/CategoryComponentItem";

const dataController = new FeatureDataController()
dataController.features
    .add(new Feature(
        'New Challenge to Minecraft!',
        "You are now a guardian spirit here to watch over a spirit tree! It is your job to care" +
        " for and grow the spirit tree to becomes a monument amongst trees! \n" +
        "\n" +
        "This mod turns every player into a dryad who, after choosing a tree to protect, binds them to " +
        "the tree. Wandering too far away will deplete a player's air while being close to the tree will " +
        "fill it back up.",
        0,
        0,
        0,
    ))
    .add(
        new Feature(
            'Choosing the tree',
            "When a player joins, they will start in ghost form. In order to get out of ghost form," +
            "a player must chose a tree by punching it and accepting the chat prompt. " +
            "\n\n" +
            "Once chosen, a player is then given a few saplings to start and must then grow the tree by hand.",
            0,
            1,
            1,
        )
    )
    .add(
        new Feature(
            'Growing Stick',
            "To grow the tree, the player must add only logs that are descended from the original" +
            "tree. Saplings from the player's spirit tree will glow and be specially named. When planted, " +
            "these trees will produce logs that glow when picked up by the guardian player. " +
            "\n\n" +
            "Using logs or saplings from other trees will not grow your spirit tree, though they can be used " +
            "as decoration. Placed logs that are part of the spirit tree will pulse when holding a Log or " +
            "sappling from the tree.",
            2,
            2,
            2,
        )
    )
    .add(
        new Feature(
            'Home upgrade: Reach',
            "This upgrade allows a player to go farther from the tree by two blocks per level." +
            "\n\n" +
            "Requirements: A tree must have at least 200 blocks for this upgrade to unlock. It costs one enderpearl," +
            "one magmablock, and 10 experience levels per upgrade with a max of 3 upgrades",
            1,
            3,
            0,
        )
    )

dataController.categories
    .add(
        new Category(
            'Core Gameplay',
            0,
            0,
        )
    )
    .add(
        new Category(
            'Upgrades',
            1,
            1,
        )
    )
const usedCategories = computed(() => dataController.categories.usedCategories())
const index = ref(0)
const isLastPage = computed(() => index.value === (usedCategories.value.length - 1))


const clampPage = function (value) {
  return Math.min(Math.max(value, -1), usedCategories.value.length - 1)
}
const RelativePageNumber = function (offsetAmount) {
  return clampPage(index.value + offsetAmount)
}
const indexToCategory = function (i) {
  return i > -1 ? usedCategories.value[clampPage(i)] : {
    id: -1,
    title: '[undefined]'
  }
}
const relativeChangePage = function (changeAmount) {
  index.value = clampPage(index.value + changeAmount)
}
const changePageById = function (id) {
  index.value = (id === -1 ? -1 : usedCategories.value.map(category => category.id).indexOf(id))
}
const pageContents = function (index) {
  return index !== -1 ? dataController.features.itemsByCategory(indexToCategory(index).id) : dataController.features.itemsWithoutCategory()
}

const currentCategory = computed(() => indexToCategory(index.value))
const currentPageContents = computed(() => pageContents(index.value))

export default {
  components: {
    FeatureComponent,
    CategoryComponentItem
    //FeatureComponent,
  },
  mounted() {
  },
  setup() {
    const $q = useQuasar()

    function generalRemove(item, controllerSource) {
      $q.dialog({
        component: DialogueBox,
        componentProps: {
          title: "Delete Confirmation",
          message: 'Are you sure that you want to delete "' + item.title + '"?',
          cancelActive: true,
          confirmText: "Delete"
        }
      }).onOk(() => {
        controllerSource.remove(item)
      })
    }

    function removeFeature(item) {
      generalRemove(item, dataController.features)
    }

    function removeCategory(item) {
      generalRemove(item, dataController.categories)
    }

    //////////////////////////////////////////

    function generalEdit(item, component, controllerSource) {
      const newItem = {...item}
      $q.dialog({
        component: component,
        componentProps: {
          title: "Edit " + item.type,
          cancelActive: true,
          confirmText: "Save Changes",
          item: newItem,
          onSave: () => controllerSource.save(item, newItem),
          categories: dataController.categories.items(),
        }
      })
    }

    function editFeature(item) {
      generalEdit(item, FeatureInput, dataController.features)
    }

    function editCategory(item) {
      alert("edit " + item)
      generalEdit(item, CategoryInput, dataController.categories)
    }

    //////////////////////////////////////////

    function generalAdd(item, component, controllerSource) {
      $q.dialog({
        component: component,
        componentProps: {
          title: "Add New " + item.type,
          cancelActive: true,
          confirmText: "Save " + item.type,
          item: item,
          onSave: () => controllerSource.add(item),
          categories: dataController.categories.items(),
        }
      })
    }

    function addFeature() {
      generalAdd(new Feature(), FeatureComponent, dataController.features)
    }

    function addCategory() {
      generalAdd(new Feature(), CategoryInput, dataController.categories)
    }

    return {
      dataController,

      index,
      isLastPage,
      clampPage,
      RelativePageNumber,
      indexToCategory,
      relativeChangePage,
      changePageById,
      pageContents,


      currentCategory,
      currentPageContents,

      editCategory,
      addCategory,
      removeCategory,

      editFeature,
      addFeature,
      removeFeature,
    }
  },
}
</script>