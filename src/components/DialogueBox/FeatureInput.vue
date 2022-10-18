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
              :model-value="item.title"
              @update:model-value="(value) => {item.title=value}"
              label="Title"/>
        </div>
        <div class="q-py-md q-pb-xl ">
          <q-btn-dropdown color="primary" :label="'Category [' + categories?.find(x=> x.id === item.category)?.title + ']'">
            <q-list>
              <template v-for="(category, index) in categories" :key="index">
                <q-item clickable v-close-popup @click="item.category = category.id">
                  <q-item-section>
                    <q-item-label :class="category.id === item.category ? 'text-bold' : ''">{{ category.title + (category.id === item.category ? " (Current)" : "") }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </div>

        <div class="q-py-md">
          <q-input
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
        <q-btn color="grey" label="Cancel" @click="onCancelClick" v-if="cancelActive"/>
        <q-btn color="primary" :label="confirmText" @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {useDialogPluginComponent} from 'quasar'

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


      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        props.onSave()
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel
    }
  }
}
</script>