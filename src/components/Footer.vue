<template>
<div class="container">
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 bg-dark fixed-bottom">
    <p class="col-md-4 mb-0 text-muted">&copy; 2021 The Kimchi Project</p>
  </footer>
</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
.logo {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 16pt;
  user-select: none;
  margin-right: 20px;
  vertical-align: top;

}
footer {
  padding: 10px;
}
</style>

<script>
import { store } from "../store"

export default {
  data: function() {
    return {
      isRevealed: false
    }
  }
}
</script>
