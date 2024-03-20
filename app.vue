<template>
  <div>
    <button v-if="loggedIn" class="bg-gray-500  rounded-md m-2 p-2" @click="hangleSignOut"> Sign Out</button>
    <button v-else  class="bg-gray-500  rounded-md m-2 p-2" @click="hangleSignIn"> Sign In</button>
    
  </div>
</template>

<script setup>
const { status, data, signOut , signIn} = useAuth()

const loggedIn = computed(() => status.value ==='authenticated')
async function hangleSignIn(){
  await signIn()
}

async function hangleSignOut(){
  await signOut()
}
</script>