<script setup lang="ts">
import { useForm } from "vee-validate";
import Loading from "~/components/common/Loading.vue";
import type { SchoolLoginEntity } from "~/entities/school/auth";

import { schoolLoginSchema } from "~/schemas/school/auth.schema";
import { SchoolAuthStore } from "~/stores/school/auth";

useHead({ title: "Login" });

definePageMeta({
  layout: "guest-school",
  middleware: ["auth-guest-school"],
});

const store = SchoolAuthStore();
const isLoading = computed(() => store.isLoading);
const isSucceed = computed(() => store.isSucceed);
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schoolLoginSchema,
});
const display = ref<boolean>(false);
const errorsApi = computed(() => store.errors);

const [username] = defineField("username");
const [password] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  const schoolLogin: SchoolLoginEntity = {
    username: values.username,
    password: values.password,
  };

  await store.login(schoolLogin);
  if (!isLoading.value && !isSucceed.value && errorsApi.value) {
    display.value = true;
  }
});
</script>

<template>
  <div>
    <v-snackbar id="loginFailed" v-model="display" :location="'top right'">
      {{ errorsApi?.message || "" }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="display = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <Loading v-if="isLoading" />
    <div v-else class="d-flex w-100 h-100 justify-center align-center">
      <div
        class="d-flex flex-column pa-4 ga-2 justify-center align-center container-login w-33"
      >
        <label class="text-h5 font-weight-bold text-primary py-3"
          >Đăng nhập quản trị viên</label
        >
        <v-form
          @submit.prevent="onSubmit"
          class="d-flex flex-column w-100 ga-3"
        >
          <v-text-field
            label="Tên đăng nhập"
            v-model="username"
            name="username"
            class="w-100"
            :rules="[() => errors.username || true]"
          />
          <v-text-field
            label="Mật khẩu"
            v-model="password"
            type="password"
            name="password"
            class="w-100"
            :rules="[() => errors.password || true]"
          />
          <div class="d-flex justify-center">
            <v-btn
              class="mx-2"
              color="primary"
              type="submit"
              @keydown.ctrl.enter="onSubmit"
            >
              Đăng nhập
            </v-btn>
          </div>
        </v-form>
        <v-btn variant="text" class="text-black" href="/"> Trang chủ </v-btn>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.background-login {
  background-image: url("../assets/images/test1.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.container-login {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
}
</style>
