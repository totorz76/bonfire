import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";
import './PostsSlider.css';

function PostsSlider({ posts }) {
  return (
    <div className="max-w-3xl mx-auto mb-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 5000 }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="bg-[#121212] border border-[#2A2A2A] p-6 rounded-xl text-center">
              {post.image && (
                <img
                  src={`http://localhost:8000${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-[#E25822]">{post.title}</h2>
              <p className="text-gray-300 mt-2">{post.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PostsSlider;
