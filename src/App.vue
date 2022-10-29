-
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
              v-for="(category, index) in pageInfo.pages.value"
              :category="category"
              :key="index"

              :index = index
              :page-info="pageInfo"
              :edit-commands="dialogController"
              @swap="(a, b) => dataController.categories.swapItemsByIndex(a, b)"
          />

          <category-component-item
              v-if="dataController.features.itemsWithoutCategory().length"
              :page-info="pageInfo"

              :category="{title:'[Undefined]', id:-1}"
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
        :page-info="pageInfo"
        :edit-commands="dialogController"
        @swap="(a, b) => dataController.features.swapItems(a, b)"
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
import {useQuasar} from "quasar";
import DialogueBox from "@/components/DialogueBox/DialogueBox";
import CategoryInput from "@/components/DialogueBox/CategoryInput";
import FeatureInput from "@/components/DialogueBox/FeatureInput";

import CategoryComponentItem from "@/components/CategoryComponentItem";
import {ELEMENT_TYPE, importData} from "@/components/scripts/appdata";

const dataController = importData()

const typeDirector = {}
typeDirector[ELEMENT_TYPE.CATEGORY] = {
  controller: dataController.categories,
  component: CategoryInput
}
typeDirector[ELEMENT_TYPE.FEATURE] = {
  controller: dataController.features,
  component: FeatureInput
}


export default {
  components: {
    FeatureComponent,
    CategoryComponentItem
  },
  setup() {
    const DialogController = function () {
      const $q = useQuasar()
      this.remove = function (item) {
        $q.dialog({
          component: DialogueBox,
          componentProps: {
            title: "Delete Confirmation",
            message: 'Are you sure that you want to delete "' + item.title + '"?',
            cancelActive: true,
            confirmText: "Delete"
          }
        }).onOk(() => {
          typeDirector[item.type].controller.remove(item)
        })
      }

      this.edit = function (item) {
        const newItem = {...item}
        $q.dialog({
          component: typeDirector[item.type].component,
          componentProps: {
            title: "Edit " + item.type,
            cancelActive: true,
            confirmText: "Save Changes",
            item: newItem,
            onSave: () => typeDirector[item.type].controller.save(item, newItem),
            categories: dataController.categories.items(),
          }
        })
      }

      this.add = function (item) {
        $q.dialog({
          component: typeDirector[item.type].component,
          componentProps: {
            title: "Add New " + item.type,
            cancelActive: true,
            confirmText: "Save " + item.type,
            item: item,
            onSave: () => typeDirector[item.type].controller.add(item),
            categories: dataController.categories.items(),
          }
        })
      }
    }
    const dialogController = new DialogController()

    const PageInfo = function () {
      //Pages
      this.pages = computed(() => dataController.categories.usedCategories())
      this.pageCount = computed(() => this.pages.value.length)

      //Current Page
      this.index = ref(0)
      this.currentCategory = computed(() => this.indexToCategory(this.index.value))
      this.currentPageContents = computed(() => this.pageContents(this.index.value))
      this.isLastPage = computed(() => this.index.value === (this.pageCount.value - 1))

      //Change Page
      this.changePage = function (page) {
        this.index.value = page
      }
      this.changePageById = function (id) {
        let category = this.pages.value.find(category => category.id === id)
        this.index.value = this.pages.value.indexOf(category)
      }

      //Main methods
      this.indexToCategory = function (i) {
        return i > -1 ? this.pages.value[i] : dataController.defaultCategory
      }
      this.pageContents = (index) => {
        return index !== -1 ? dataController.features.itemsByCategory(this.indexToCategory(index).id) : dataController.features.itemsWithoutCategory()
      }

      //clamp
      this.clampToPage = (value) => {
        return Math.min(Math.max(value, -1), this.pageCount.value - 1)
      }

    }
    const pageInfo = new PageInfo()

    return {
      dataController,

      typeDirector,
      dialogController,
      pageInfo,
    }
  },
}
</script>