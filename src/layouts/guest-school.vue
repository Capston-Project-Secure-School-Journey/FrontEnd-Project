<script lang="ts" setup></script>
<template>
  <div class="w-screen h-screen background-login"><slot /></div>
</template>
<style lang="scss" scoped>
.background-login {
  background-image: url("../assets/images/test1.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
