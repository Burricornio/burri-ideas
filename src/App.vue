<template>
  <!-- Main container -->
  <div class="container mx-auto p-4">
    <!-- Remove idea modal -->
    <teleport to="body">
      <RemoveIdea
        v-if="isModalActive"
        :name="ideaToRemove.name"
        @remove-cancel="isModalActive = !isModalActive"
        @remove-ok="removeIdea"
      />
    </teleport>
    <!-- Main box -->
    <div class="w-full bg-gray-100 shadow-lg p-4 rounded-lg">
      <h1 class="mb-5 text-4xl text-center">Burri ideas</h1>
      <!-- Add idea -->
      <AddIdea
        :user="user"
        @do-login="doLogin"
        @do-logout="doLogout"
        @add-idea="addIdea"
      />
      <!-- End of add idea-->
      <transition-group name="list-complete">
        <AppIdea
          v-for="idea in ideas"
          :key="idea.createdAt"
          :idea="idea"
          :user="user"
          @vote-idea="voteIdea"
          @remove-idea="showRemoveIdeaModal"
          class="idea"
        />
      </transition-group>
    </div>
    <!-- End of main box -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue'
import AppIdea from '@/components/AppIdea.vue'
import AddIdea from '@/components/AddIdea.vue'
import { auth, firebase, db } from '@/firebase'

const RemoveIdea = defineAsyncComponent(
  () => import('@/components/RemoveIdea.vue')
)

interface Idea {
  name: string
  user: string
  userName: string
  votes: number
  createdAt: number
  id: string
}

export default defineComponent({
  name: 'App',
  components: {
    AppIdea,
    AddIdea,
    RemoveIdea
  },
  setup() {
    // USERS
    let user = ref()

    auth.onAuthStateChanged(async (auth) => {
      let userVotes

      if (auth) {
        user.value = auth
        userVotes = db
          .collection('votes')
          .doc(user.value.uid)
          .onSnapshot((doc) => {
            if (doc) {
              let document = doc.data()

              if (document) {
                if ('ideas' in document) {
                  user.value.votes = document.ideas
                }
              }
            }
          })
      } else {
        user.value = null
        userVotes && userVotes()
      }
    })

    const doLogin = async () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      try {
        await auth.signInWithPopup(provider)
      } catch (error) {
        console.error(error)
      }
    }

    const doLogout = async () => {
      try {
        await auth.signOut()
      } catch (error) {
        console.error(error)
      }
    }

    // IDEAS
    const ideas = ref()

    const isModalActive = ref(false)

    let ideaToRemove: { name: string; id: string } = { name: '', id: '' }

    db.collection('ideas')
      .orderBy('votes', 'desc')
      .onSnapshot(
        (snapshot) => {
          const newIdeas: Idea[] = []

          snapshot.docs.forEach((doc) => {
            let { name, user, userName, votes, createdAt } = doc.data()
            let id = doc.id

            newIdeas.push({
              name,
              user,
              userName,
              votes,
              createdAt,
              id
            })
          })
          ideas.value = newIdeas
        },
        (error) => console.log(error)
      )

    const addIdea = async (data) => {
      try {
        await db.collection('ideas').add({
          name: data.value,
          user: user.value.uid,
          userName: user.value.displayName,
          createdAt: Date.now(),
          votes: 0
        })
      } catch (error) {
        console.log(error)
      }
    }

    const voteIdea = async ({ id, type }) => {
      try {
        await db
          .collection('ideas')
          .doc(id)
          .update({
            votes: firebase.firestore.FieldValue.increment(type ? 1 : -1)
          })

        await db
          .collection('votes')
          .doc(user.value.uid)
          .set(
            {
              ideas: firebase.firestore.FieldValue.arrayUnion(id)
            },
            { merge: true }
          )
      } catch (error) {
        console.log(error)
      }
    }

    const showRemoveIdeaModal = ({ name, id }) => {
      ideaToRemove.name = name
      ideaToRemove.id = id
      isModalActive.value = true
    }

    const removeIdea = async () => {
      try {
        await db.collection('ideas').doc(ideaToRemove.id).delete()
        ideaToRemove = {
          name: '',
          id: ''
        }
        isModalActive.value = false
      } catch (error) {
        console.error('error')
      }
    }

    return {
      ideas,
      isModalActive,
      ideaToRemove,
      user,
      doLogin,
      doLogout,
      addIdea,
      voteIdea,
      showRemoveIdeaModal,
      removeIdea
    }
  }
})
</script>

<style>
.idea {
  @apply bg-gray-200;
  transition: all 0.8s ease;
}

.idea:nth-of-type(1) {
  @apply bg-blue-500;
}

.idea:nth-of-type(2) {
  @apply bg-blue-400;
}
.idea:nth-of-type(3) {
  @apply bg-blue-300;
}
.idea:nth-of-type(4) {
  @apply bg-blue-200;
}
.idea:nth-of-type(5) {
  @apply bg-blue-100;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}

.list-complete-move {
  transition: transform 0.3s ease;
}

.user-actions {
  @apply mt-2 text-center;
}

.user-actions a {
  font-weight: bold;
  text-decoration: underline;
}
</style>
