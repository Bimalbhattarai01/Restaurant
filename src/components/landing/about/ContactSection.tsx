// components/ContentSection.js
import Image from "next/image";

interface ContactSectionProps {
  title: string;
  semi_title?: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  content?: string;
  sub_content?: string;
  mini_title?: string;
  mini_content?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  semi_title,
  subtitle,
  imageSrc,
  imageAlt,
  content,
  sub_content,
  mini_title,
  mini_content,
}) => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-30 px-2">
        {/* Image Section */}
        <div className="flex-1 mr-8 h-full w-full">
          <Image
            src={imageSrc} // Dynamic image source
            alt={imageAlt ?? title} // Ensure alt is always a string for Next/Image
            width={1200}
            height={1200}
            className="rounded-lg h-full "
          />
        </div>

        {/* Text Section */}
        <div className="flex-2 text-gray-800">
          <h3 className="text-[#A12900] text-3xl font-playfair font-medium mb-2 text-right">
            {title} {/* Dynamic title */}
          </h3>
          <h2 className="text-[#A0522D] text-4xl md:text-5xl font-playfair font-semibold mb-6 text-right">
            {semi_title}
          </h2>
          <p className="text-right font-inter leading-relaxed mb-10">
            {content} {/* Dynamic paragraph */}
          </p>

          {subtitle && (
            <section className="mb-6">
              <h3 className="text-[#A12900] text-3xl font-playfair font-medium mb-2 text-right">
                {subtitle} {/* Dynamic subtitle */}
              </h3>
              <p className="text-right font-inter leading-relaxed mb-10">
                {sub_content}{" "}
                {/* You can modify this to accept another content prop for each section */}
              </p>
              <h3 className="text-[#A12900] text-3xl font-playfair font-medium mb-2 text-right ">
                {mini_title} {/* Dynamic subtitle */}
              </h3>
               <p className="text-right font-inter leading-relaxed ">
                {mini_content}{" "}
                {/* You can modify this to accept another content prop for each section */}
              </p>
              
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
