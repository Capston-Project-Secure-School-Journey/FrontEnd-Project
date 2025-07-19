<script lang="ts" setup>
import { SCHOOL_ROUTE, ADMIN_ROUTE } from "~/constants/route";
import parallaxImg from "~/public/parallax_1.png";
import parallaxImg2 from "~/public/parallax_2.jpeg";
import parallaxImg3 from "~/public/parallax_3.jpeg";
import carousel1 from "~/public/carousel/carousel_1.png";
import carousel2 from "~/public/carousel/carousel_2.png";
import carousel3 from "~/public/carousel/carousel_3.png";
import carousel4 from "~/public/carousel/carousel_4.png";
import carousel5 from "~/public/carousel/carousel_5.png";
import carousel6 from "~/public/carousel/carousel_6.png";
definePageMeta({
  layout: "default",
  name: "School Security and Safety in Transportation",
});

const navigate = (screen: string) => {
  navigateTo({ path: screen });
};
</script>
<template>
  <div class="h-screen">
    <v-parallax :src="parallaxImg" class="w-full">
      <div class="position-absolute w-100 h-100 bg-black opacity-80" />
      <div
        class="position-absolute h-100 w-100 d-flex align-center justify-center"
      >
        <v-container>
          <v-row>
            <v-col class="d-none d-md-block"></v-col>
            <v-col class="d-flex flex-column ga-2">
              <div class="typewriter text-right">
                <span
                  class="text-h4 text-md-h3 font-weight-bold text-white text-uppercase overflow-hidden"
                  style="line-height: 1.4; text-align: right"
                >
                  HỆ THỐNG QUẢN LÝ <br />
                  HÀNH TRÌNH ĐƯA ĐÓN HỌC SINH AN TOÀN
                </span>
              </div>

              <v-btn
                variant="text"
                color="white"
                :onclick="() => navigate(SCHOOL_ROUTE.LOGIN)"
                >Đăng nhập quản lý</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
  </div>
  <div class="h-screen">
    <v-parallax :src="parallaxImg2" class="w-full">
      <div class="position-absolute w-100 h-100 bg-black opacity-80" />
      <div
        class="position-absolute h-100 w-100 d-flex align-center justify-center"
      >
        <v-container class="h-100">
          <v-row class="h-100">
            <v-col class="d-flex flex-column justify-center ga-4">
              <span class="text-h3 text-white">Vấn đề</span>
              <v-divider
                :thickness="8"
                color="yellow"
                opacity="0.5"
                class="w-50 problem-divide"
              ></v-divider>
              <div class="typewriter">
                <span class="text-h4 text-white"
                  >Bạn đang gặp các khó khăn trong việc theo dõi con mình khi
                  tới trường?</span
                >
              </div>
            </v-col>
            <v-col>
              <div class="h-100 d-flex align-content-space-around flex-wrap">
                <div class="d-flex flex-md-row ga-4 problem-item pa-2">
                  <span class="text-h2 text-white font-weight-bold">1</span>
                  <span class="text-h5 text-white"
                    >Bất cập về thời gian, không có điều kiện để đưa đón học
                    sinh bạn đúng giờ.</span
                  >
                </div>
                <div class="d-flex flex-md-row ga-4 problem-item pa-2">
                  <span class="text-h2 text-white font-weight-bold">2</span>
                  <span class="text-h5 text-white"
                    >Học sinh của bạn hạn chế về kỹ năng và độ tuổi để có thể tự
                    di chuyển.</span
                  >
                </div>
                <div class="d-flex flex-md-row ga-4 problem-item pa-2">
                  <span class="text-h2 text-white font-weight-bold">3</span>
                  <span class="text-h5 text-white"
                    >Tham gia giao thông một cách an toàn đôi khi trở thành nỗi
                    lo lắng của phụ huynh như bạn.</span
                  >
                </div>
                <div class="d-flex flex-md-row ga-4 problem-item pa-2">
                  <span class="text-h2 text-white font-weight-bold">4</span>
                  <span class="text-h5 text-white"
                    >Xảy ra các sự việc thương tâm vì sự thiếu trách nhiệm của
                    bậc quản lý.</span
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
  </div>
  <div class="h-screen">
    <v-parallax :src="parallaxImg3" class="w-full">
      <div class="position-absolute w-100 h-100 bg-black opacity-80" />
      <div
        class="position-absolute h-100 w-100 d-flex align-center justify-center"
      >
        <v-container class="h-100">
          <v-row class="h-100">
            <v-col class="fill-height">
              <v-carousel
                hide-delimiters
                class="fill-height"
                show-arrows="hover"
                cycle
                hide-delimiter-background
              >
                <v-carousel-item
                  rounded="lg"
                  :src="carousel1"
                ></v-carousel-item>
                <!-- <v-carousel-item :src="carousel2"></v-carousel-item>
                <v-carousel-item :src="carousel3"></v-carousel-item>
                <v-carousel-item :src="carousel4"></v-carousel-item>
                <v-carousel-item :src="carousel5"></v-carousel-item>
                <v-carousel-item :src="carousel6"></v-carousel-item> -->
              </v-carousel>
            </v-col>

            <v-col class="d-flex flex-column justify-center ga-4">
              <span class="text-h3 text-white">Giải pháp</span>
              <v-divider
                :thickness="8"
                color="yellow"
                opacity="0.5"
                class="w-50 problem-divide"
              ></v-divider>
              <div class="typewriter">
                <span class="text-h4 text-white"
                  >Tại sao nên chọn chúng tôi?</span
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
  </div>
</template>
<style>
.v-responsive.v-img.v-parallax.v-parallax--active {
  height: 100%;
}

.typewriter span {
  border-right: 0.15em solid orange;
  animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: orange;
  }
}

.problem-item {
  transition: background-color 0.3s;
  cursor: pointer;
}

.problem-divide:hover {
  border-color: #2386c7;
}

.problem-item:hover {
  background-color: #2386c7;
  border-radius: 5px;
}
</style>
