<script>
import NoteComponent from './components/NoteComponent.vue';
  export default{
    data(){
      return {
        data: [],
        content: ''
      }
    },
    components: {
      NoteComponent
    },
    methods:{
      getNotes(){
        fetch('/api/notes')
        .then(res => res.json())
        .then(data => {
          this.data = data.sort((a, b) => b.changed - a.changed)
        })
      },
      async createNote(){
        let timestamp = new Date().getTime()
        await fetch('/api/notes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                markdown: this.content,
                coordinateX: 0,
                coordinateY: 0,
                archived: 0,
                changed: timestamp
              })
            })
        this.content = ''
      }
    },
    mounted(){
      this.getNotes()  
    }
  }
</script>

<template>
  <div class="mb-20 flex flex-col">
    <NoteComponent @update="getNotes()" v-for="note in data" :note="note" ></NoteComponent>
    <div class="fixed bottom-0 border border-solid border-black w-full h-16 shadow-md decoration-none">
      <textarea class="p-2 h-full w-full resize-none" v-model="this.content"></textarea>
      <button class="text-xs absolute top-2 right-2" @click="createNote">Save</button>
    </div>
  </div>
</template>
