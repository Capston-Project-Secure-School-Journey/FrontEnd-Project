<script setup lang="ts">
import { useForm } from "vee-validate";
import Loading from "~/components/common/Loading.vue";
import type { AdminLoginEntity } from "~/entities/admin/auth";
import { schoolLoginSchema } from "~/schemas/school/auth.schema";
import { AdminAuthStore } from "~/stores/admin/auth";

useHead({ title: "Login" });

definePageMeta({
  layout: "guest-school",
  middleware: "auth-guest-admin",
});

const store = AdminAuthStore();
const isLoading = computed(() => store.isLoading);
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schoolLoginSchema,
});

const [username] = defineField("username");
const [password] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  const userLogin: AdminLoginEntity = {
    username: values.username,
    password: values.password,
  };

  await store.login(userLogin);
});
</script>

<template>
  <v-container>
    <Loading v-if="isLoading" />
    <div v-else class="d-flex w-100 h-100 justify-center align-center">
      <div
        class="pa-2 ga-2 d-flex flex-column justify-center align-center container-login w-33"
      >
        <label class="text-h5 font-weight-bold text-primary py-3"
          >Đăng nhập quản trị viên</label
        >
        <v-form
          @submit.prevent="onSubmit"
          class="w-100 d-flex flex-column ga-4"
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
  </v-container>
</template>
<style lang="scss" scoped>
.background-login {
  background-image: url("../assets/images/test1.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.container-login {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
}
</style>
