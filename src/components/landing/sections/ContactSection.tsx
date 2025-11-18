"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ContactFormFields {
  name: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  time: string;
  message: string;
}

const initialFormState: ContactFormFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  date: "",
  time: "",
  message: "",
};

export default function ContactSection() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          reservationDate: formData.date,
          reservationTime: formData.time,
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Thanks! We will reach out shortly.");
      setFormData(initialFormState);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-[url('/Hero.svg')] bg-cover bg-center bg-no-repeat py-24">
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
        <p className="font-playfair text-lg">Reserve Now</p>

        <h2 className="text-4xl md:text-5xl font-playfair font-semibold mb-10 tracking-wide">
          Secure your Table Now
        </h2>

        <div className="grid md:grid-cols-2 gap-0 bg-white/95 rounded-xl overflow-hidden shadow-2xl">

          {/* ---------- LEFT FORM ---------- */}
          <div className="p-10 text-gray-800">
            <h3 className="text-3xl font-playfair font-semibold text-[#A73419] mb-3">
              Contact Us
            </h3>

            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              At Almado Fado Al Fama, every dish is a note, and every evening
              tells a story. Inspired by the haunting melodies of Portugal.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
                />

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject (Optional)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
                />

                <div className="flex gap-2">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
                  />
                </div>
              </div>

              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#BF1E2E]"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#BF1E2E] text-white py-3 rounded-md font-medium hover:bg-[#a31a25] transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          {/* ---------- RIGHT INFO CARD ---------- */}
          <div className="bg-[#F9F9F9] p-12 flex flex-col justify-center items-center text-center text-gray-800">
            <h3 className="text-3xl font-playfair font-semibold text-[#A73419]">
              Contact <span className="italic text-[#BF1E2E]">Us</span>
            </h3>

            <p className="text-[#BF1E2E] font-medium mt-6 text-sm">
              Booking Request
            </p>
            <p className="text-xl font-semibold text-gray-800">
              +977-9007665236
            </p>

            <img src="/Logo.png" alt="logo" className="w-20 my-6 opacity-70" />

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-[#A73419]">Location:</span>{" "}
                Random, Location
              </p>
              <p>
                <span className="font-semibold text-[#A73419]">Booking:</span>{" "}
                +977-9007665236
              </p>
              <p>
                <span className="font-semibold text-[#A73419]">Email:</span>{" "}
                abcde@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
