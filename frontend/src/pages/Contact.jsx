import React, { useRef } from "react";
import { assets } from "../assets/assets_frontend/assets";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef();
  const imgRef = useRef();
  const contentRef = useRef();

  useGSAP(() => {
    // Animate entire section fade-in
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Image slides from left
    gsap.fromTo(
      imgRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Text slides from right
    gsap.fromTo(
      contentRef.current.children,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={sectionRef} className="mt-24 shadow-xl px-5 md:px-0 pb-4 rounded-md">
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>CONTACT US</p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-20 mb-28 text-sm">
        {/* Image */}
        <div
          ref={imgRef}
          className="w-full   md:w-[40%] md:max-w-[360px] shadow-2xl flex-1 rounded-md overflow-hidden"
        >
          <img
            src={assets.contact_image}
            alt="contact_img"
            className="w-full md:h-[360px] mx-auto"
          />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex flex-col justify-center items-start gap-6"
        >
          <p className="font-semibold text-gray-600 text-lg">Our OFFICE</p>
          <p className="text-gray-500">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className="text-gray-500">
            Tel: (415) 555-0132 <br />
            Email: support@medlink.com
          </p>
          <p className="font-semibold text-lg text-gray-600">
            Careers at MEDLINK
          </p>
          <p className="text-gray-600">
            Learn more about our teams and job openings.
          </p>
          <button className="px-8 py-4 border border-gray-800 font-medium hover:bg-black hover:text-white transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
