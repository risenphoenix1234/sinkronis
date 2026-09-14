"use client";

import Image from "next/image";
import Reveal from "./Reveal";

const logos = [
  { src: "/publica.png", alt: "Publica" },
  { src: "/amplitude.png", alt: "Amplitude" },
  { src: "/veroxfloor.png", alt: "VeroxFloor" },
  { src: "/rpublica.png", alt: "RPublica" },
  { src: "/amplitude.png", alt: "Amplitude" },
  { src: "/invoice2go.png", alt: "Invoice2Go" },
];

export default function TrustedBusinessesSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-xl text-4xl font-bold leading-tight text-slate-900">
            Trusted by businesses
            <br />
            across Africa.
          </h2>
        </Reveal>

        <Reveal
          delay={150}
          className="mt-12 rounded-xl border border-slate-200 bg-white"
        >
          <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-6">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex h-24 items-center justify-center px-8"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={40}
                  className="h-auto max-h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}