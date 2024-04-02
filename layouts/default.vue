<template>
    <nav class='sticky h-14 inset-x-0 top-0 z-30 w-full border-b  backdrop-blur-lg transition-all'>
        <div class='flex h-14 items-center justify-between border-b'>
          <div  class='flex flex-row gap-5'>
            <h1 class="text-3xl font-bold font-madimi ml-4"> Vacation Planner</h1>
        </div>
    </div>   
    </nav>

   <div class="flex w-full max-w-[500px] mx-auto h-screen">
       <slot />
   </div>
</template>


