import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ilustration1 from "../assets/ilustration-1.png";
import ilustration2 from "../assets/ilustration-2.png";
import ilustration3 from "../assets/ilustration-3.png";

const Welcome = () => {
  const slides = [
    {
      title: "Chào mừng đến với Alozola",
      description: "Nền tảng chat hiện đại, kết nối mọi người",
      image: ilustration1,
    },
    {
      title: "Chat nhóm thông minh",
      description: "Tạo nhóm chat dễ dàng, quản lý thành viên hiệu quả",
      image: ilustration2,
    },
    {
      title: "Giao diện thân thiện",
      description: "Trải nghiệm người dùng tuyệt vời với giao diện hiện đại",
      image: ilustration3,
    },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-[90%] w-[90%] max-w-7xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div className="text-center p-4 flex flex-col items-center justify-center h-full">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mb-4 sm:mb-6">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-[250px] sm:max-w-sm md:max-w-md lg:max-w-lg">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Welcome;
