<template>
  <section class="mb-6">
    <form @submit.prevent="addIdea" class="sm:flex">
      <input
        v-model="idea"
        class="w-full p-3 md:flex-auto"
        type="text"
        required
        placeholder="Add your idea"
      />
      <input
        v-if="user"
        class="w-full p-2 bg-gray-600 text-white md:flex-1"
        type="submit"
        value="Add ideaa"
      />
    </form>
    <p v-if="!user" class="user-actions">
      Please <a @click="doLogin">login</a> first
    </p>
    <p v-else class="user-actions">
      Hi ✋ {{ user.displayName }} <a @click="doLogout">Logout</a>
    </p>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AddIdea',
  emits: ['do-login', 'do-logout', 'add-idea'],
  props: {
    user: {
      type: Object
    }
  },
  setup(props, { emit }) {
    const idea = ref('')

    const doLogin = () => emit('do-login')

    const doLogout = () => emit('do-logout')

    const addIdea = () => {
      emit('add-idea', idea)
      idea.value = ''
    }

    return { idea, doLogin, doLogout, addIdea }
  }
})
</script>
