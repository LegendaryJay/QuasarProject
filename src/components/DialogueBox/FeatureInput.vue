<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section v-if="title">
        <div class="text-h6 text-bold">{{ title }}</div>
      </q-card-section>
      <!-- eslint-disable -->
      <q-card-section>
        <div class="q-py-md">
          <q-input
              dark standout bottom-slots
              :model-value="item.title"
              @update:model-value="(value) => {item.title=value}"
              label="Title"/>
        </div>
        <div class="q-py-md q-pb-xl ">
          <q-btn-dropdown
              color="primary"
              outline:white
              :label="'Category: ' + categoryName"
              content-style="background-color: #8A9364"
          >
            <q-list>
              <q-item clickable v-close-popup @click="changeCategoryTo(-1)" :active="isActive(-1)">
                <q-item-section>
                  <q-item-label> None</q-item-label>
                </q-item-section>
              </q-item>
              <template v-for="(category, index) in categories" :key="index">
                <q-item clickable v-close-popup @click="changeCategoryTo(category.id)" :active="isActive(category.id)">
                  <q-item-section>
                    <q-item-label> {{ category.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </div>

        <div class="q-py-md">
          <q-input
              dark standout bottom-slots
              :model-value="item.description"
              @update:model-value="(value) => {item.description=value}"
              label="Description"
              type="textarea"
              autogrow
          ></q-input>
        </div>


      </q-card-section>
      <!-- eslint-enable -->
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="grey-9" label="Cancel" @click="onCancelClick" v-if="cancelActive"/>
        <q-btn color="primary" :label="confirmText" @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {useDialogPluginComponent} from 'quasar'
import {computed, ref} from "vue";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    cancelActive: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: "OK",
    },
    item: {
      type: Object,
      required: true,
    },
    onSave: {
      type: Function,
      required: true,
    },
    categories: {
      type: Array,
      require: true,
    }
    // ...your custom props
  },


  emits: [
    'update:item',
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],

  setup(props) {
    const updateVal = ref(0)
    const update = () => {
      updateVal.value++
    }


    const changeCategoryTo = (id) => {
      update()
      // eslint-disable-next-line vue/no-mutating-props
      props.item.categoryId = id
    }

    const itemCategory = computed(() => {
      updateVal.value
      return props.categories?.find(x => x.id === props.item.categoryId)
    })

    // REQUIRED; must be called inside of setup()
    const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,
      itemCategory,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        props.onSave(),

            // on OK, it is REQUIRED to
            // call onDialogOK (with optional payload)
            onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      update,
      isActive: function (itemId) {
        return itemId === props.item?.categoryId
      },

      categoryName: computed(() => itemCategory.value?.title ?? 'None'),
      changeCategoryTo,
      updateVal,
    }
  }
}
</script>

<style lang="scss">
.q-list--active {
  background-color: $feature;
}
</style>