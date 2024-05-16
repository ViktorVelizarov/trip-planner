<template>
    <nav class='sticky h-14 inset-x-0 top-0 z-30 w-full border-b  backdrop-blur-lg transition-all'>
        <div class='flex h-14 items-center justify-between border-b'>
          <div  class='flex flex-row gap-5'>
            <router-link to="/" class="text-3xl font-bold font-madimi ml-3">Vacation Planner</router-link>
        </div>
    </div>   
    </nav>

   <div class="flex w-full  h-screen">
       <slot />
   </div>
</template>


