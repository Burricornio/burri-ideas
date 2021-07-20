<template>
  <div class="w-full flex justify-center absolute top-40">
    <article class="w-3/4 p-4 bg-gray-400 shadow-2xl">
      <p class="text-center text-xl">Remove {{ name }}?</p>
      <section class="flex justify-end">
        <button
          @click="$emit('remove-ok')"
          class="p-3 m-1 bg-blue-500 text-white"
        >
          OK
        </button>
        <button @click="$emit('remove-cancel')" class="p-3 m-1 bg-gray-200">
          CANCEL
        </button>
      </section>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RemoveIdea',
  emits: ['remove-ok', 'remove-cancel'],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup() {
    return {}
  }
})
</script>
