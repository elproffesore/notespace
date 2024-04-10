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
      handleTab(e){
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            e.target.value = e.target.value.substring(0, start) +
              "\t" + e.target.value.substring(end);

            // put caret at right position again
            e.target.selectionStart =
              e.target.selectionEnd = start + 1;
          }
      },
      editNode(){
        this.editMode = !this.editMode
        this.$nextTick(() => {
          if(this.editMode){
            document.getElementById(this.id).style.height = document.getElementById(this.id).scrollHeight + "px";
          }
        })
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
          this.$emit('update')
        }
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
    <textarea :id="id" v-if="editMode" @keydown="handleTab" class="w-full resize-none box-border" v-model="this.markdown_raw"></textarea>
  </div>
</template>
