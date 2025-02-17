import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

new Swiper(".step-slider", {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 64,
  breakpoints: {
    576: {
      slidesPerView: "auto",
      spaceBetween: 24,
    },
  },
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});
