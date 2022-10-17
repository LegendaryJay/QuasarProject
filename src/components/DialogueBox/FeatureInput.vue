<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section v-if="title">
        <div class="text-h6 text-bold">{{ title }}</div>
      </q-card-section>

      <q-card-section class="text-body2" v-if="message">
        {{ message }}
      </q-card-section>
      <slot></slot>

      <q-card-section v-if="isCategory">
        <q-input v-model="itemCopy.value.title" @input="handleInput" label="Title" />
      </q-card-section>

      <!--      <q-card-section v-if="isFeature">-->
      <!--        <q-input v-model="itemCopy." @input="handleInput" label="Title" />-->
      <!--        <div class="q-pa-md">-->
      <!--          <q-btn-dropdown color="primary" label="Dropdown Button">-->
      <!--            <q-list>-->
      <!--              <template v-for="(category, index) in categories" :key="index" >-->
      <!--                <q-item clickable v-close-popup @click="onDropdownSelect(category.id)">-->
      <!--                  <q-item-section>-->
      <!--                    <q-item-label>{{category.title}}</q-item-label>-->
      <!--                  </q-item-section>-->
      <!--                </q-item>-->
      <!--              </template>-->
      <!--            </q-list>-->
      <!--          </q-btn-dropdown>-->
      <!--        </div>-->

      <!--        <div class="q-pa-md" style="max-width: 300px">-->
      <!--          <q-input-->
      <!--              v-model="text"-->
      <!--              filled-->
      <!--              type="textarea"-->
      <!--          ></q-input>-->
      <!--        </div>-->
      <!--      </q-card-section>-->
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
import {ref} from "vue";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
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
    isCategory: {
      type: Boolean,
      default:false,
    },
    isFeature: {
      type: Boolean,
      default:false,
    },
    item: {
      type: Object,
    },
    categories: Array,
    // ...your custom props
  },


  emits: [
    'update:item',
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],

  setup(props, {emit}) {

    const handleInput = ()=> emit('update:item',itemCopy.value)

    const itemCopy = ref(props.item)

    function onDropdownSelect(id){
      itemCopy.value.category = id
      handleInput()
    }

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

      itemCopy,
      handleInput,

      onDropdownSelect,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
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