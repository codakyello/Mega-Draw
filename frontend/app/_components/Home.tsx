/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import RandomizerImage from "@/public/img/Randomizer_monents.png";
import Canonball from "@/public/img/Canonball.png";
import Image from "next/image";
import Button from "./Button";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { useAuth } from "../_contexts/AuthProvider";
import { useRouter } from "next/navigation";

const features = [
  {
    name: "Custom Events",
    description:
      "Individuals and organizations can create and edit events, with organization accounts able to add collaborators for event management.",
  },
  {
    name: "Participants Upload",
    description:
      "With our platform, individuals and organizations can easily upload large volumes of client data in one go, streamlining event participation.",
  },
  {
    name: "Event Analytics",
    description:
      "Automatically tracks event success with detailed insights on participant engagement and prize distribution in a curated dashboard.",
  },

  {
    name: "AI Integrations",
    description:
      " Our new AI feature allows individuals and organisations automatically generate high-resolution images for prizes, enhancing listing quality.",
  },
];

const testimonials = [
  {
    name: "Arinola Egbeyemi",
    title: "CEO, Mimo",
    image: "/img/testimonials/john_doe.png",
    message: "I am delighted that my customers data are kept private.",
  },

  {
    name: "Ife Johnson",
    title: "CEO, Juicyway",
    image: "/img/testimonials/john_doe.png",
    message: "This tool makes it easy to transparently reward our customers.",
  },

  {
    name: "Tomison Ogunbanjo",
    title: "Operations IJGB",
    image: "/img/testimonials/john_doe.png",
    message: "I can run campaigns with thousands of people in one go!!!",
  },

  {
    name: "John Doe",
    title: "CEO, Mimo",
    image: "/img/testimonials/john_doe.png",
    message: "I can run campaigns with thousands of people in one go!!!",
  },
];

export default function Home() {
  const { authenticated, isAuthenticating } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (authenticated) router.push("/dashboard");
  }, [authenticated, router]);

  if (isAuthenticating || authenticated) return null;
  return (
    <Box className="px-[2rem] bg-[var(--color-grey-50)]">
      <NavBar user={null} />

      <header
        style={{ height: "calc(100vh - 10rem)" }}
        className=" relative overflow-hidden p-5 mx-auto flex flex-col items-center justify-center"
      >
        <Box className="flex flex-col items-center text-center justify-center">
          <h1 className="text-[6rem] font-bold leading-[7rem]">
            <span className="block">Manage your giveaways </span>
            <span className="text-[#C5C5C5]">in one simple dashboard</span>
          </h1>

          <p className="text-[1.8rem] text-[#1E1E1E]  mt-[1.6rem] mb-[3.2rem]">
            Unlock in real time, a better way to handle raffel draws.
          </p>
        </Box>

        <Box className="flex justify-center">
          <Link
            href="/signup"
            className="w-[23rem] bg-[var(--color-brand-200)] flex items-center gap-[.5rem] justify-center text-[1.8rem] font-medium h-[5.5rem] border rounded-[10px]"
          >
            Sign Up
            <img src="/img/send.svg" alt="Arrow send" />
          </Link>
        </Box>

        <img
          className="absolute top-[3rem] left-[20rem]"
          src="/img/schedule.svg"
          alt="data"
        />

        <img
          className="absolute left-0 bottom-0"
          src="/img/gift.svg"
          alt="gift"
        />

        <img
          className="absolute right-0 bottom-0"
          src="/img/data.png"
          alt="data"
        />
      </header>

      <section className=" mt-[4.8rem]  text-center">
        <p className="font-medium text-[#474747] mb-[2.4rem]">
          World-class organisations trust Randora
        </p>
        <Box className="flex gap-[4rem] justify-center items-center justfiy-center mx-auto ">
          <img src="/img/logo/mimo.svg" className="h-[3rem]" alt="Client" />
          <img src="/img/logo/ijgb.svg" className="h-[3rem]" alt="Client" />
          <img src="/img/logo/octa.svg" className="h-[3rem]" alt="Client" />
          <img src="/img/logo/juicyway.svg" className="h-[3rem]" alt="Client" />
        </Box>
      </section>

      <section
        id="features"
        className="max-w-[107rem]  mx-auto py-[20rem] flex flex-col gap-[6.4rem]"
      >
        <Box className="flex flex-col md:flex-row justify-between  gap-[4rem]">
          <Box className="w-[40rem] flex flex-col items-start gap-[1.6rem]">
            <p className="font-semibold flex gap-[1rem] pb-[1rem] border-b-[2px] border-b-[#d3d3d361]">
              <img src="/icons/editor_choice.svg" alt="Editors choice" />
              <span>The Randora Platform</span>
            </p>
            <h2 className="font-semibold text-[4rem] leading-[4.8rem]">
              Built for efficient customer relations
            </h2>
          </Box>

          <Box className="w-[48rem] flex flex-col gap-[3rem] items-start">
            <p className="leading-[3.2rem] text-[#767676]">
              Randora is a SaaS platform that helps businesses create memorable
              engagement campaigns while eliminating the administrative
              headaches of traditional giveaways. From automated distribution to
              performance analytics, we make reward programs both fun and
              efficient.
            </p>

            <Link href={"/dashboard"}>
              <Button type="primary">Explore the Platform</Button>
            </Link>
          </Box>
        </Box>

        <Box className="grid justify-center grid-cols-[repeat(auto-fit,_minmax(25rem,_25rem))] gap-[1.7rem]">
          {features.map((feature, index) => (
            <Box
              key={index}
              className="bg-white rounded-[10px] p-[2.4rem] flex flex-col gap-[1.6rem] shadow-[0px_4px_4px_4px_rgba(186,185,255,0.87)]"
            >
              <h3 className="w-[14rem] font-medium leading-[2.4rem]">
                {feature.name}
              </h3>
              <p className="text-[1.3rem] leading-[2.4rem] text-[#2c2c2c]">
                {feature.description}
              </p>
            </Box>
          ))}
        </Box>
      </section>

      <Image
        className="mx-auto w-[130rem]"
        alt="Randomizer Moments"
        src={RandomizerImage}
      />

      <section className="max-w-[107rem] grid grid-cols-1  md:grid-cols-2 items-center  mx-auto py-[30rem]">
        <Box className="flex flex-col items-start gap-[1.6rem]">
          <p className="font-semibold flex gap-[1rem] pb-[1rem] border-b-[2px] border-b-[#d3d3d361]">
            <img src="/icons/editor_choice.svg" alt="Editors choice" />
            <span>The Randora Events</span>
          </p>
          <ul className="text-[5.6rem] font-semibold leading-[7.2rem]">
            <li>Spin the wheel</li>
            <li className="text-[#BAB9FF]">Raffel Draws</li>
            <li>Trivia </li>
          </ul>

          <p className="w-[43rem] text-[#767676]">
            We offer a variety of games to facilitate your giveaway, drive
            engagement, and make the experience truly memorable.
          </p>
        </Box>

        <Image className="ml-auto" src={Canonball} alt="Canonball" />
      </section>

      <section className="max-w-[107rem] overflow-hidden flex flex-col  items-center mx-auto  gap-[10rem]">
        <Box className="grid grid-cols-1 md:grid-cols-2 items-center gap-[2rem]">
          <Box className="flex w-[80%] flex-col gap-[2.4rem] items-start">
            <p className="font-semibold flex gap-[1rem] pb-[1rem] border-b-[2px] border-b-[#d3d3d361]">
              <img src="/icons/editor_choice.svg" alt="Editors choice" />
              <span>The Randora Love</span>
            </p>

            <h2 className="font-semibold text-[4rem] w-[30rem] leading-[4.8rem]">
              The Randora Community
            </h2>
            <p className="leading-[2.5rem] text-[#767676]">
              We’re building a community of individuals and organizations
              passionate about creating impactful engagement campaigns through
              collaboration and innovation.
            </p>

            <Link href={"/signup"}>
              <Button type="primary">Join the Community</Button>
            </Link>
          </Box>

          <img src="/img/big_gift.png" alt="Love" className="ml-auto" />
        </Box>

        <Box className="w-[107rem] flex gap-[1.6rem] items-start overflow-x-scroll no-scrollbar">
          <Box className="flex gap-[1.6rem]">
            {testimonials.map(({ name, title, message }, index) => (
              <Box
                key={index}
                className="bg-[#bab9ff22] border-[.1px] border-[#c6c6c645] backdrop-blur-lg rounded-[20px] py-[2rem] px-[1.5rem] w-[30rem] flex flex-col gap-6"
              >
                <Box className="flex items-center gap-6">
                  {/* <img
      src={image}
      alt={name}
      className="w-20 h-20 rounded-full object-cover"
    /> */}
                  <Box className="flex flex-col">
                    <p className="font-medium">{name}</p>
                    <p className="text-[1.2rem] text-gray-500">{title}</p>
                  </Box>
                </Box>
                <p className="leading-[2rem] text-[1.5rem]">{message}</p>
              </Box>
            ))}
          </Box>
        </Box>
      </section>

      <Box className="h-[80rem] leading-[7rem] flex items-center justify-center rounded-[40px]">
        <h2 className="text-[5.7rem] text-center w-[80rem]">
          <span>Leverage the power </span> of Randora{" "}
          <img className="inline" alt="people" src="/img/people.svg" />
          <span>in real-time, join progress.</span>
        </h2>
      </Box>

      <footer className="relative mx-[2rem] p-[4.8rem] rounded-[5rem] bg-[#bab9ff30] h-[40rem]">
        <Box className="flex flex-col gap-[2rem]">
          <Link href={"/"}>
            <img src="img/logo/randora.svg" alt="logo" />
          </Link>
          <p>8, Adunni street, Ilaje, Bariga, Yaba, Lagos</p>
        </Box>

        <p className="text-[1.4rem] absolute bottom-0 left-[50%] mb-10 translate-x-[-50%] text-[#474747]">
          &copy;Copyright of Randora, {new Date().getFullYear()}.
        </p>
      </footer>
    </Box>
  );
}
