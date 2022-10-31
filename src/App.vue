-
<template>
  <q-layout view="hhh LpR fff">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Spirit Tree Mod <small v-if="editMode">[Edit mode]</small>
        </q-toolbar-title>
        <q-toggle
            v-model="editMode"
            icon="edit"
            color="accent"
        />
      </q-toolbar>


    </q-header>

    <q-drawer
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
    >
      <q-scroll-area class="drawer" style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list>
          <category-component-item
              v-for="(category, index) in pageInfo.pages.value"
              :category="category"
              :key="index"

              :index=index
              :page-info="pageInfo"
              :edit-commands="dialogController"
              :edit-mode="editMode"
              @swap="(a, b) => dataController.categories.swapItemsByIndex(a, b)"
          />

          <category-component-item
              v-if="editMode & dataController.features.itemsWithoutCategory().length > 0"
              :page-info="pageInfo"

              :category="dataController.defaultCategory()"
          >
          </category-component-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="./assets/tree.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <div class="text-weight-bold">Features</div>
        </div>
      </q-img>
      <q-page-sticky
          v-if="editMode"
          position="bottom-right" :offset="[10, 10]">
        <q-btn
            fab
            icon="add"
            color="accent"
            padding="xs"
            @click="dialogController.add(ELEMENT_TYPE.CATEGORY)"
        />
      </q-page-sticky>
    </q-drawer>
    <FeatureComponent
        :edit-mode="editMode"
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

import FeatureComponent from "@/components/FeatureComponent";
import {useQuasar} from "quasar";
import DialogueBox from "@/components/DialogueBox/DialogueBox";
import CategoryInput from "@/components/DialogueBox/CategoryInput";
import FeatureInput from "@/components/DialogueBox/FeatureInput";

import CategoryComponentItem from "@/components/CategoryComponentItem";
import {Category, ELEMENT_TYPE, Feature, importData, PageInfo} from "@/components/scripts/appdata";
import {ref} from "vue";

const dataController = importData()

const typeDirector = {}
typeDirector[ELEMENT_TYPE.CATEGORY] = {
  controller: dataController.categories,
  component: CategoryInput,
  newItem: () => new Category()
}
typeDirector[ELEMENT_TYPE.FEATURE] = {
  controller: dataController.features,
  component: FeatureInput,
  newItem: () => new Feature()
}


export default {
  components: {
    FeatureComponent,
    CategoryComponentItem
  },
  setup() {
    const editMode = ref(false)
    const DialogController = function () {
      const $q = useQuasar()
      $q.dark.set(true)
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

      this.add = function (itemType) {
        const item = typeDirector[itemType].newItem()
        $q.dialog({
          component: typeDirector[itemType].component,
          componentProps: {
            title: "Add New " + itemType,
            cancelActive: true,
            confirmText: "Save " + itemType,
            item: item,
            onSave: () => typeDirector[itemType].controller.add(item),
            categories: dataController.categories.items(),
          }
        })
      }
    }



    return {
      dataController,
      typeDirector,

      ELEMENT_TYPE,
      editMode,
      pageInfo: new PageInfo(dataController, editMode),
      dialogController: new DialogController()
    }
  },
}
</script>

<style lang="scss">
.drawer {
  background-color: $feature;
}
</style>