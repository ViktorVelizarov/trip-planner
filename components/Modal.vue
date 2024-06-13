<template>
    <div v-if="isVisible" class="modal-overlay " @click.self="closeModal">
      <div class="modal-container ">
        <div class="modal-header">
          <h2 class="modal-title"></h2>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-content bg-gray-100">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: false,
        default: ''
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-container {
    background-color: white;
    width: 80%;
    max-width: 600px;
    max-height: 90vh; /* Ensure the modal fits within the viewport */
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #f1f1f1;
    border-bottom: 1px solid #ddd;
  }
  
  .modal-title {
    margin: 0;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .modal-content {
    padding: 16px;
    overflow-y: auto; /* Add a scrollbar for the content */
    flex: 1; /* Allow the content to grow and shrink */
  }
  </style>
  