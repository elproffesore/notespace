<script>
  import { marked } from 'marked'
  export default {
    props: {
      note: Object, 
    },
    data(){
      return {
        editMode: false,
        deleteMode: false,
        archiveMode: false,
        id: this.note.noteid,
        changed: this.note.changed,
        markdown_raw: this.note.markdown
      }
    },
    watch:{
      note(value){
        this.id = value.noteid;
        this.changed = value.changed;
        this.markdown_raw = value.markdown
      },
    },
    methods:{
      editNode(){
        this.editMode = !this.editMode
        if(!this.editMode){
          this.deleteMode = false;
          this.archiveMode = false;
          fetch('/api/notes/'+this.id+"/markdown", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              markdown: this.markdown_raw,
              changed: new Date().getTime(),
            })
          })
        }
        this.$emit('update')
      },
      async archiveNote(){
        if(this.archiveMode){
          await fetch('/api/notes/'+this.id+"/archive", {
              method: "PUT"
          })
          this.editMode = false
          this.deleteMode = false;
          this.archiveMode = false;
          this.$emit('update')
        }else{
          this.archiveMode = true;
        }
      },
      async removeNote(){
        if(this.deleteMode){
          await fetch('/api/notes/'+this.id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          this.editMode = false
          this.deleteMode = false;
          this.archiveMode = false;
          this.$emit('update')
        }else{
          this.deleteMode = true;
        }
      }
    },
    computed: {
      markdown(){
        if(!this.editMode){
          return marked(this.markdown_raw ?? "")
        }
      }
    }
  }
</script>
<template>
  <div class="relative border border-solid border-black p-2 m-4 w-auto h-auto">
    <div class="grid grid-cols-2 text-xs">
      <p class="justify-self-start">{{"ID: "+this.id +" – "+ new Date(this.changed).toLocaleDateString() }}</p>
      <div class="justify-self-end flex gap-8">
        <button class="text-right" v-if="editMode"  @click="archiveNote">{{ this.archiveMode ? 'Really?': 'Archive'}}</button>
        <button class="text-right" v-if="editMode"  @click="removeNote">{{ this.deleteMode ? 'Really?': 'Delete'}}</button>
        <button class="text-right" @click="editNode">{{ this.editMode ? 'Save' : 'Edit' }}</button>
      </div>
    </div>
    <p v-if="!editMode" class="text-justify" v-html="this.markdown"></p>
    <textarea v-if="editMode" class="h-full w-full resize-none box-border" rows="100" v-model="this.markdown_raw"></textarea>
  </div>
</template>
