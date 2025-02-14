<script lang="ts" setup></script>
<template>
  <v-container :fluid="true" class="w-screen h-screen background-login"
    ><slot
  /></v-container>
</template>
<style lang="scss" scoped>
.background-login {
  background-image: url("../assets/images/test1.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
