import Image from "next/image";
import React from "react";
import { team } from "../../../../lib/data";
import AboutSection from "@/components/landing/about/AboutSection";
import HeroSection from "@/components/landing/about/HeroSection";
import ContactSection from "@/components/landing/about/ContactSection";

export default function AboutPage() {
  return (
    <div className="bg-gray-100 text-gray-800">
      
      <HeroSection/>

      <AboutSection/>

      

      <section className="bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-30 px-2">
        
        <div>
          <h3 className="text-[#A12900] text-3xl font-playfair font-medium mb-2">
            The Taste of Portugal
          </h3>
          <h2 className="text-[#A0522D] text-4xl md:text-5xl font-playfair font-semibold  mb-6">
            Sung Through Fado
          </h2>
          <p className=" text-justify font-inter">
           At Almado Fado Al Fama, every dish is a note, and every evening tells a story.
            Inspired by the haunting beauty of Fado  Portugal’s traditional soul music  we blend heartfelt live performances 
            with the warmth of family-style Portuguese dining.
            Set in the heart of Alfama, Lisbon’s oldest district, our candlelit space invites you to savor the flavors of bacalhau, 
            pastéis de nata, and fine wines while being serenaded by the voice of a fadista and the gentle strum of the guitarra portuguesa.
          </p>
        </div>

        <div className="flex justify-center relative">
          <Image
            src="/images/soup.png"
            alt="Portuguese Soup"
            width={800}
            height={600}
            className="rounded-2xl shadow-md object-cover"
          />
          <Image
            src="/images/leaf.png"
            alt="Leaf Decoration"
            width={120}
            height={120}
            className="absolute -top-8 left-140 rotate-12"
          />
        </div>

      </div>
    </section>

         <div>
      <ContactSection
        title="Live Entertainment with"
        semi_title="Fado Music"
        subtitle="1. Live Entertainment"
        imageSrc="/images/Content.png"
        imageAlt="Fado Music Performance"
        content="Fado (Portuguese pronunciation: [ˈfaðu]; 'destiny, fate') is a music genre
          which can be traced to the 1820s in Lisbon, Portugal, but probably has much earlier
          origins. Fado historian and scholar Rui Vieira Nery states that 'the only reliable
          information on the history of fado was orally transmitted and goes back to the 1820s
          and 1830s at best. But even that information was frequently modified within the
          generational transmission process that made it reach us today.'"
        sub_content="Fado typically employs the Dorian mode or Ionian mode sometimes switching between 
        the two during a melody or verse change. A particular stylistic trait of fado is the use of rubato, 
        where the music pauses at the end of a phrase and the singer holds the note for dramatic effect."
        mini_title="2. Learning with Live Singer"
        mini_content="Fado (Portuguese pronunciation is a music genre which can be traced to the 1820s in Lisbon,
        Portugal, but probably has much earlier origins. Fado historian and scholar Rui Vieira Nery states that 
        the only reliable information on the history of fado was orally transmitted and goes back to the 1820s a
        nd 1830s at best. But even that information was frequently modified within the generational transmission 
        process that made it reach us today."
      />

   
    </div>

     
      <section className="bg-gray-100 text-center py-16 sm:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-orange-700 font-playfair font-semibold mb-8">
        Our Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-6">
        {team.map((member, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="rounded-2xl overflow-hidden shadow-lg mb-4 w-full max-w-xs sm:max-w-[250px]">
              <Image
                src={member.img}
                alt={member.name}
                width={300}
                height={500}
                className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover"
              />
            </div>
            <h3 className="font-inter font-semibold text-lg sm:text-xl text-[#6D213C] mb-1">
              {member.name}
            </h3>
            <p className="text-neutral-700 text-sm sm:text-md">{member.role}</p>
          </div>
        ))}
      </div>
    </section>


    </div>
  );
}
