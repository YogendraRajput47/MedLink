import React, { useRef } from "react";
import { assets } from "../assets/assets_frontend/assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const About = () => {
  const topRef = useRef();
  const imgRef = useRef();
  const paraRef = useRef();
  const whyHeadingRef = useRef();
  const whyCardsRef = useRef();

  useGSAP(() => {
    // Top section
    gsap.fromTo(
      topRef.current,
      { opacity: 0, x: -100 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: topRef.current,
          start: "top 70%",
        },
      }
    );

    // Image
    gsap.fromTo(
      imgRef.current,
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 1.5, delay: 0.5 }
    );

    // Paragraphs
    const text = paraRef.current.querySelectorAll(".para");
    gsap.fromTo(
      text,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 1.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: paraRef.current,
          start: "top 80%",
        },
      }
    );

    // Why Choose Us heading
    gsap.fromTo(
      whyHeadingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: whyHeadingRef.current,
          start: "top 80%",
        },
      }
    );

    // Why Choose Us cards
    const cards = whyCardsRef.current.querySelectorAll(".why-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: whyCardsRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={topRef} className="mt-24 shadow-2xl px-10 pb-20 rounded-lg">
      <div className="text-center text-2xl pt-10 text-gray-500 font-medium">
        <p>ABOUT US</p>
      </div>

      <div className="mt-10 flex flex-col md:flex-row gap-12">
        <img
          ref={imgRef}
          src={assets.about_image}
          alt="about_img"
          className="w-full md:w-[360px] md:h-[360px] shadow-xl rounded-md "
        />
        <div
          ref={paraRef}
          className="flex flex-col justify-center gap-6 md:w-full text-sm text-gray-600 "
        >
          <p className="para">
            Welcome to Medlink, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Medlink, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className="para">
            Medlink is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Medlink is here to support you every step of the
            way.
          </p>
          <b className="text-gray-800 para">Our Vision</b>
          <p className="para">
            Our vision at Medlink is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div ref={whyHeadingRef} className="text-xl mt-10">
        <p className="uppercase">Why Choose Us</p>
      </div>

      <div ref={whyCardsRef} className="flex flex-col md:flex-row mt-4">
        <div className="why-card border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer hover:scale-105 hover:border-none">
          <b>Efficiency:</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="why-card border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer hover:scale-105 hover:border-none">
          <b>Convenience:</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="why-card border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer hover:scale-105 hover:border-none">
          <b>Personalization:</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
