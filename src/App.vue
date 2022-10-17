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
              v-for="(category, index) in filteredCategoryList"
              :category="category"
              :key="index"
              :active="category.id === pageCategory.id"
              @set-category-page="setCategoryPage"
              @up="categoryRelativeSwap(index, -1)"
              @down="categoryRelativeSwap(index, 1)"
              @edit="editCategory(category)"
              @delete="categoryDelete"
              :disable-up="index === 0"
              :disable-down="index===(filteredCategoryList.length - 1)"
          >
          </category-component-item>
          <category-component-item
              v-if="featureList.some(x => x.category === -1)"
              :category="{title:'[undefined]', id:-1}"
              :active="-1 === pageCategory.id"
              @set-category-page="setCategoryPage"
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
        :features="pageContents"
        :categories="filteredCategoryList"
        :page-category="pageCategory"
        :next-page="nextPage"
        @go-to-next-page="goToNextPage"
        @swapRelativePositions="featureRelativeSwap"
        @delete="featureDelete"

    >

    </FeatureComponent>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>This is the bottom!</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
  <q-btn @click="deleteDialog('',()=>{})"/>
</template>

<script>

import {ref, computed, reactive} from "vue";
import FeatureComponent from "@/components/FeatureComponent";
import CategoryComponentItem from "@/components/CategoryComponentItem";
import {useQuasar} from "quasar";
import DialogueBox from "@/components/DialogueBox/DialogueBox";
import CategoryInput from "@/components/DialogueBox/CategoryInput";


const sortByPosition = function (a, b) {
  return a.position - b.position
}

const featureList = reactive([
  {
    title: 'New Challenge to Minecraft!',
    id: 0,
    position: 0,
    category: 0,
    img: "",
    description: "You are now a guardian spirit here to watch over a spirit tree! It is your job to care" +
        " for and grow the spirit tree to becomes a monument amongst trees! \n" +
        "\n" +
        "This mod turns every player into a dryad who, after choosing a tree to protect, binds them to " +
        "the tree. Wandering too far away will deplete a player's air while being close to the tree will " +
        "fill it back up."
  },
  {
    title: 'Choosing the tree',
    id: 1,
    position: 1,
    category: 0,
    img: "",
    description: "When a player joins, they will start in ghost form. In order to get out of ghost form," +
        "a player must chose a tree by punching it and accepting the chat prompt. " +
        "\n\n" +
        "Once chosen, a player is then given a few saplings to start and must then grow the tree by hand."
  },
  {
    title: 'Growing Stick',
    id: 2,
    position: 2,
    category: 2,
    img: "",
    description: "To grow the tree, the player must add only logs that are descended from the original" +
        "tree. Saplings from the player's spirit tree will glow and be specially named. When planted, " +
        "these trees will produce logs that glow when picked up by the guardian player. " +
        "\n\n" +
        "Using logs or saplings from other trees will not grow your spirit tree, though they can be used " +
        "as decoration. Placed logs that are part of the spirit tree will pulse when holding a Log or " +
        "sappling from the tree."
  },
  {
    title: 'Home upgrade: Reach',
    id: 3,
    position: 0,
    category: 1,
    img: "",
    description: "This upgrade allows a player to go farther from the tree by two blocks per level." +
        "\n\n" +
        "Requirements: A tree must have at least 200 blocks for this upgrade to unlock. It costs one enderpearl," +
        "one magmablock, and 10 experience levels per upgrade with a max of 3 upgrades"
  },
])

const categoryList = reactive([
  {
    id: 0,
    title: 'Core Gameplay',
    position: 0
  },
  {
    id: 1,
    title: 'Upgrades',
    position: 1
  },
])

const undefinedCategory =
    {
      id: -1,
      title: "[undefined]",
      position: 0
    }


const filteredCategoryList = computed(() => categoryList.filter(cat => featureList.some(x => x.category === cat.id)).sort(sortByPosition))
const filteredFeatureList = computed(() => featureList.sort(sortByPosition))

const relativePageNumber = ref(0)

function getPageCategory(pageIndex) {
  if (pageIndex >= filteredCategoryList.value.length) {
    return {id: -100, title: "Download Now!"}
  } else if (pageIndex < 0) {
    return undefinedCategory
  }
  return filteredCategoryList.value[pageIndex]
}

const pageCategory = computed(() => getPageCategory(relativePageNumber.value))

const pageContents = computed(() => filteredFeatureList.value.filter(x => x.category === pageCategory.value.id))


function setHomelessToUndefined() {
  featureList.filter(x => categoryList.map(cat => cat.id).indexOf(x.category) === -1).forEach(feat => feat.category = -1);
}

const nextPage = computed(
    () => getPageCategory(relativePageNumber.value + 1)
)

function setCategoryPage(pageIndex) {
  relativePageNumber.value = pageIndex
}

function goToNextPage() {
  if (nextPage.value.id === -100) {
    alert("Downloading...")
  } else {
    setCategoryPage(relativePageNumber.value + 1)
  }
}

function featureRelativeSwap(index, offset) {
  let itemA = pageContents.value[index]
  let itemB = pageContents.value[index + offset]
  swapPositions(itemA, itemB)
}

function categoryRelativeSwap(index, offset) {
  let itemA = filteredCategoryList.value[index]
  let itemB = filteredCategoryList.value[index + offset]
  swapPositions(itemA, itemB)
}

function swapPositions(itemA, itemB) {
  let tempA = itemA.position
  itemA.position = itemB.position
  itemB.position = tempA
}



function reassessPagePositions() {
  if (pageContents.value.length === 0) return
  for (let i = 0; i < pageContents.value.length; i++) {
    const feature = pageContents.value[i]
    feature.position = i
  }
}



export default {
  components: {
    CategoryComponentItem,
    FeatureComponent,
  },
  setup() {
    const $q = useQuasar()

    function deleteDialog(itemName, onDelete) {
      $q.dialog({
        component: DialogueBox,
        componentSlots: {

        },
        // props forwarded to your custom component
        componentProps: {
          title: "Delete Confirmation",
          message: 'Are you sure that you want to delete "' + itemName + '"?',
          cancelActive: true,
          confirmText: "Delete"
          // ...more..props...
        }
      }).onOk(() => {
        onDelete()
      })
    }

    function featureDelete(id) {
      let index = featureList.map((x) => x.id).indexOf(id)

      deleteDialog(featureList[index].title, () => {
        featureList.splice(index, 1);
        reassessPagePositions();
      })
    }

    function categoryDelete(id) {
      let index = categoryList.map((x)=> x.id).indexOf(id)

      deleteDialog(categoryList[index].title, () => {
        categoryList.splice(categoryList.map((x) => x.id).indexOf(id), 1)
        setHomelessToUndefined()
      })
    }

    // function CategoryInputsDialogue(item, onSave) {
    //   const isEditing = Boolean(item.id)
    //   $q.dialog({
    //     component: CategoryInput,
    //     // props forwarded to your custom component
    //     componentProps: {
    //       title: isEditing ? "Editing " + item.name : "Adding New Category",
    //       cancelActive: true,
    //       confirmText: isEditing ? "Save Changes" : "Add Category",
    //       item: item,
    //       // ...more..props...
    //     }
    //   }).onOk(() => {
    //     onSave(item)
    //   })
    // }

    function saveCategoryChanges(category, newCategory){
      category.title = newCategory.title
    }

    function editCategory(item){
      const title = ref(item.title)
      $q.dialog({
        component: CategoryInput,
        // props forwarded to your custom component
        componentProps: {
          title: "Edit Category",
          cancelActive: true,
          confirmText: "Save Changes",
          itemTitle: title,
          // ...more..props...
        },
      }).onOk(() => {
        saveCategoryChanges(item, {...item, title:title.value})
      })

    }

    //
    // function test() {
    //   $q.dialog({
    //     component: DialogueBox,
    //
    //     // props forwarded to your custom component
    //     componentProps: {
    //       title: "thing",
    //       message: 'something',
    //       // ...more..props...
    //     }
    //   }).onOk(() => {
    //     console.log('OK')
    //   }).onCancel(() => {
    //     console.log('Cancel')
    //   }).onDismiss(() => {
    //     console.log('Called on OK or Cancel')
    //   })
    // }

    return {
      categoryList,
      featureList,

      filteredCategoryList,
      filteredFeatureList,
      relativePageNumber,
      pageContents,


      nextPage,
      pageCategory,

      undefinedCategory,


      setCategoryPage,
      goToNextPage,

      featureRelativeSwap,
      featureDelete,

      categoryRelativeSwap,
      categoryDelete,

      //CategoryInputsDialogue,
      editCategory,
    }

  },
  mounted() {
    setHomelessToUndefined()
  },
}
</script>