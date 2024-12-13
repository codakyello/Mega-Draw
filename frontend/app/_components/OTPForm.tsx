import { Box, Button as ChakraButton, Text } from "@chakra-ui/react";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import OTPInput from "@/app/_components/OTPInput";
import { resendOtp, verifyOtp } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";

// Define prop types
interface OtpFormProps {
  email: string;
  setStep: (step: (prevStep: number) => number) => void;
}

const OTP_EXPIRES = 5 * 60;

const OtpForm: React.FC<OtpFormProps> = ({ email, setStep }) => {
  const router = useRouter();
  const { login, setToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [time, setTimer] = useState(OTP_EXPIRES);
  const [otp, setOtp] = useState("");

  const min = `${Math.floor(time / 60)}`.padStart(2, "0");
  const sec = `${time % 60}`.padStart(2, "0");

  // Set OTP expiration countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((time) => {
        if (time > 0) {
          return time - 1;
        } else {
          clearInterval(timer);
          return 0; // Set timer to 0
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (time < 1) return toast.error("OTP has expired");
    setLoading(true);

    const res = await verifyOtp(email, otp);

    if (res.status !== "error") {
      login(res.data.user);
      setToken(res.token);
      router.push("/dashboard");
    } else {
      if (res.message === "fetch failed")
        toast.error("Bad Internet connection");
      else toast.error(res.message);
    }

    setLoading(false);
  }

  async function handleResend() {
    if (time > 1) return;

    // resend OTp

    setOtp("");
    setLoading(true);
    const res = await resendOtp(email);
    if (res.status !== "error") {
      setTimer(OTP_EXPIRES);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  }
  return (
    <Box className="flex p-5 bg-[var(--color-grey-50)] gap-[3.2rem] flex-col h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[45rem]"
      >
        <Box className="mb-[1.5rem] flex items-center justify-center gap-[1.2rem]">
          <i
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 45 44"
              fill="none"
              color="red"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.89979 11.8469L10.2671 4.3327H35.8229L40.0837 11.7889L41.9533 18.3327H3.04671L4.89979 11.8469Z"
                fill="black"
                stroke="white"
                stroke-width="2.33337"
              />
              <path
                d="M9.66669 12.4997H35.3333V31.1663H9.66669V12.4997Z"
                fill="white"
                stroke="#F4F4F4"
                stroke-width="2.33337"
              />
              <path
                d="M2.66669 16.3059L17.122 27.4254L17.4365 27.6673H17.8333H27.1667H27.5556L27.8667 27.434L41.7825 16.9971L42.3333 16.7217V41.6673H2.66669V16.3059Z"
                fill="black"
                stroke="white"
                stroke-width="2.33337"
              />
              <mask
                id="path-4-outside-1_2565_1202"
                maskUnits="userSpaceOnUse"
                x="9.83203"
                y="14.5"
                width="25"
                height="12"
                fill="black"
              >
                <rect
                  fill="white"
                  x="9.83203"
                  y="14.5"
                  width="25"
                  height="12"
                />
                <path d="M14.9488 22.6279L13.8708 21.8439L14.9208 20.4159L13.2408 19.8559L13.6608 18.5958L15.3269 19.1419V17.3778H16.6569V19.1419L18.3229 18.5958L18.7429 19.8559L17.0769 20.4159L18.1129 21.8439L17.0349 22.6279L15.9849 21.1859L14.9488 22.6279ZM21.4568 22.6279L20.3788 21.8439L21.4288 20.4159L19.7487 19.8559L20.1688 18.5958L21.8348 19.1419V17.3778H23.1648V19.1419L24.8308 18.5958L25.2508 19.8559L23.5848 20.4159L24.6208 21.8439L23.5428 22.6279L22.4928 21.1859L21.4568 22.6279ZM27.9647 22.6279L26.8867 21.8439L27.9367 20.4159L26.2567 19.8559L26.6767 18.5958L28.3427 19.1419V17.3778H29.6727V19.1419L31.3388 18.5958L31.7588 19.8559L30.0927 20.4159L31.1288 21.8439L30.0507 22.6279L29.0007 21.1859L27.9647 22.6279Z" />
              </mask>
              <path
                d="M14.9488 22.6279L13.8708 21.8439L14.9208 20.4159L13.2408 19.8559L13.6608 18.5958L15.3269 19.1419V17.3778H16.6569V19.1419L18.3229 18.5958L18.7429 19.8559L17.0769 20.4159L18.1129 21.8439L17.0349 22.6279L15.9849 21.1859L14.9488 22.6279ZM21.4568 22.6279L20.3788 21.8439L21.4288 20.4159L19.7487 19.8559L20.1688 18.5958L21.8348 19.1419V17.3778H23.1648V19.1419L24.8308 18.5958L25.2508 19.8559L23.5848 20.4159L24.6208 21.8439L23.5428 22.6279L22.4928 21.1859L21.4568 22.6279ZM27.9647 22.6279L26.8867 21.8439L27.9367 20.4159L26.2567 19.8559L26.6767 18.5958L28.3427 19.1419V17.3778H29.6727V19.1419L31.3388 18.5958L31.7588 19.8559L30.0927 20.4159L31.1288 21.8439L30.0507 22.6279L29.0007 21.1859L27.9647 22.6279Z"
                fill="black"
              />
              <path
                d="M14.9488 22.6279L13.5764 24.515L15.4745 25.8954L16.8439 23.9894L14.9488 22.6279ZM13.8708 21.8439L11.9909 20.4616L10.6014 22.3514L12.4984 23.731L13.8708 21.8439ZM14.9208 20.4159L16.8007 21.7981L18.6995 19.2158L15.6587 18.2022L14.9208 20.4159ZM13.2408 19.8559L11.0272 19.118L10.2893 21.3316L12.5029 22.0695L13.2408 19.8559ZM13.6608 18.5958L14.3875 16.3785L12.1814 15.6555L11.4472 17.858L13.6608 18.5958ZM15.3269 19.1419L14.6002 21.3592L17.6602 22.3621V19.1419H15.3269ZM15.3269 17.3778V15.0444H12.9935V17.3778H15.3269ZM16.6569 17.3778H18.9903V15.0444H16.6569V17.3778ZM16.6569 19.1419H14.3235V22.3621L17.3836 21.3592L16.6569 19.1419ZM18.3229 18.5958L20.5365 17.858L19.8024 15.6555L17.5962 16.3785L18.3229 18.5958ZM18.7429 19.8559L19.4864 22.0676L21.6926 21.3261L20.9565 19.118L18.7429 19.8559ZM17.0769 20.4159L16.3334 18.2041L13.3235 19.2158L15.1882 21.7861L17.0769 20.4159ZM18.1129 21.8439L19.4853 23.731L21.3702 22.3602L20.0016 20.4737L18.1129 21.8439ZM17.0349 22.6279L15.1486 24.0014L16.5213 25.8866L18.4073 24.515L17.0349 22.6279ZM15.9849 21.1859L17.8712 19.8124L15.9722 17.2044L14.0899 19.8244L15.9849 21.1859ZM16.3213 20.7408L15.2433 19.9568L12.4984 23.731L13.5764 24.515L16.3213 20.7408ZM15.7507 23.2262L16.8007 21.7981L13.041 19.0336L11.9909 20.4616L15.7507 23.2262ZM15.6587 18.2022L13.9787 17.6422L12.5029 22.0695L14.183 22.6295L15.6587 18.2022ZM15.4545 20.5937L15.8745 19.3337L11.4472 17.858L11.0272 19.118L15.4545 20.5937ZM12.9341 20.8132L14.6002 21.3592L16.0535 16.9245L14.3875 16.3785L12.9341 20.8132ZM17.6602 19.1419V17.3778H12.9935V19.1419H17.6602ZM15.3269 19.7112H16.6569V15.0444H15.3269V19.7112ZM14.3235 17.3778V19.1419H18.9903V17.3778H14.3235ZM17.3836 21.3592L19.0496 20.8132L17.5962 16.3785L15.9302 16.9245L17.3836 21.3592ZM16.1093 19.3337L16.5293 20.5937L20.9565 19.118L20.5365 17.858L16.1093 19.3337ZM17.9995 17.6441L16.3334 18.2041L17.8203 22.6276L19.4864 22.0676L17.9995 17.6441ZM15.1882 21.7861L16.2242 23.2141L20.0016 20.4737L18.9656 19.0457L15.1882 21.7861ZM16.7405 19.9568L15.6625 20.7408L18.4073 24.515L19.4853 23.731L16.7405 19.9568ZM18.9212 21.2544L17.8712 19.8124L14.0986 22.5594L15.1486 24.0014L18.9212 21.2544ZM14.0899 19.8244L13.0538 21.2665L16.8439 23.9894L17.8799 22.5474L14.0899 19.8244ZM21.4568 22.6279L20.0844 24.515L21.9824 25.8954L23.3518 23.9894L21.4568 22.6279ZM20.3788 21.8439L18.4989 20.4616L17.1094 22.3514L19.0063 23.731L20.3788 21.8439ZM21.4288 20.4159L23.3087 21.7981L25.2074 19.2158L22.1667 18.2022L21.4288 20.4159ZM19.7487 19.8559L17.5351 19.118L16.7972 21.3316L19.0109 22.0695L19.7487 19.8559ZM20.1688 18.5958L20.8954 16.3785L18.6893 15.6555L17.9551 17.858L20.1688 18.5958ZM21.8348 19.1419L21.1081 21.3592L24.1682 22.3621V19.1419H21.8348ZM21.8348 17.3778V15.0444H19.5014V17.3778H21.8348ZM23.1648 17.3778H25.4982V15.0444H23.1648V17.3778ZM23.1648 19.1419H20.8314V22.3621L23.8915 21.3592L23.1648 19.1419ZM24.8308 18.5958L27.0445 17.858L26.3103 15.6555L24.1041 16.3785L24.8308 18.5958ZM25.2508 19.8559L25.9943 22.0676L28.2005 21.3261L27.4645 19.118L25.2508 19.8559ZM23.5848 20.4159L22.8414 18.2041L19.8314 19.2158L21.6961 21.7861L23.5848 20.4159ZM24.6208 21.8439L25.9933 23.731L27.8781 22.3602L26.5095 20.4737L24.6208 21.8439ZM23.5428 22.6279L21.6565 24.0014L23.0292 25.8866L24.9152 24.515L23.5428 22.6279ZM22.4928 21.1859L24.3791 19.8124L22.4801 17.2044L20.5978 19.8244L22.4928 21.1859ZM22.8292 20.7408L21.7512 19.9568L19.0063 23.731L20.0844 24.515L22.8292 20.7408ZM22.2586 23.2262L23.3087 21.7981L19.5489 19.0336L18.4989 20.4616L22.2586 23.2262ZM22.1667 18.2022L20.4866 17.6422L19.0109 22.0695L20.6909 22.6295L22.1667 18.2022ZM21.9624 20.5937L22.3824 19.3337L17.9551 17.858L17.5351 19.118L21.9624 20.5937ZM19.4421 20.8132L21.1081 21.3592L22.5615 16.9245L20.8954 16.3785L19.4421 20.8132ZM24.1682 19.1419V17.3778H19.5014V19.1419H24.1682ZM21.8348 19.7112H23.1648V15.0444H21.8348V19.7112ZM20.8314 17.3778V19.1419H25.4982V17.3778H20.8314ZM23.8915 21.3592L25.5575 20.8132L24.1041 16.3785L22.4381 16.9245L23.8915 21.3592ZM22.6172 19.3337L23.0372 20.5937L27.4645 19.118L27.0445 17.858L22.6172 19.3337ZM24.5074 17.6441L22.8414 18.2041L24.3283 22.6276L25.9943 22.0676L24.5074 17.6441ZM21.6961 21.7861L22.7321 23.2141L26.5095 20.4737L25.4735 19.0457L21.6961 21.7861ZM23.2484 19.9568L22.1704 20.7408L24.9152 24.515L25.9933 23.731L23.2484 19.9568ZM25.4291 21.2544L24.3791 19.8124L20.6065 22.5594L21.6565 24.0014L25.4291 21.2544ZM20.5978 19.8244L19.5618 21.2665L23.3518 23.9894L24.3878 22.5474L20.5978 19.8244ZM27.9647 22.6279L26.5923 24.515L28.4903 25.8954L29.8597 23.9894L27.9647 22.6279ZM26.8867 21.8439L25.0068 20.4616L23.6173 22.3514L25.5143 23.731L26.8867 21.8439ZM27.9367 20.4159L29.8166 21.7981L31.7153 19.2158L28.6746 18.2022L27.9367 20.4159ZM26.2567 19.8559L24.043 19.118L23.3052 21.3316L25.5188 22.0695L26.2567 19.8559ZM26.6767 18.5958L27.4034 16.3785L25.1972 15.6555L24.463 17.858L26.6767 18.5958ZM28.3427 19.1419L27.616 21.3592L30.6761 22.3621V19.1419H28.3427ZM28.3427 17.3778V15.0444H26.0093V17.3778H28.3427ZM29.6727 17.3778H32.0061V15.0444H29.6727V17.3778ZM29.6727 19.1419H27.3394V22.3621L30.3994 21.3592L29.6727 19.1419ZM31.3388 18.5958L33.5524 17.858L32.8182 15.6555L30.6121 16.3785L31.3388 18.5958ZM31.7588 19.8559L32.5022 22.0676L34.7084 21.3261L33.9724 19.118L31.7588 19.8559ZM30.0927 20.4159L29.3493 18.2041L26.3394 19.2158L28.2041 21.7861L30.0927 20.4159ZM31.1288 21.8439L32.5012 23.731L34.3861 22.3602L33.0174 20.4737L31.1288 21.8439ZM30.0507 22.6279L28.1644 24.0014L29.5372 25.8866L31.4232 24.515L30.0507 22.6279ZM29.0007 21.1859L30.887 19.8124L28.988 17.2044L27.1057 19.8244L29.0007 21.1859ZM29.3371 20.7408L28.2591 19.9568L25.5143 23.731L26.5923 24.515L29.3371 20.7408ZM28.7666 23.2262L29.8166 21.7981L26.0568 19.0336L25.0068 20.4616L28.7666 23.2262ZM28.6746 18.2022L26.9945 17.6422L25.5188 22.0695L27.1988 22.6295L28.6746 18.2022ZM28.4703 20.5937L28.8903 19.3337L24.463 17.858L24.043 19.118L28.4703 20.5937ZM25.95 20.8132L27.616 21.3592L29.0694 16.9245L27.4034 16.3785L25.95 20.8132ZM30.6761 19.1419V17.3778H26.0093V19.1419H30.6761ZM28.3427 19.7112H29.6727V15.0444H28.3427V19.7112ZM27.3394 17.3778V19.1419H32.0061V17.3778H27.3394ZM30.3994 21.3592L32.0654 20.8132L30.6121 16.3785L28.946 16.9245L30.3994 21.3592ZM29.1251 19.3337L29.5451 20.5937L33.9724 19.118L33.5524 17.858L29.1251 19.3337ZM31.0153 17.6441L29.3493 18.2041L30.8362 22.6276L32.5022 22.0676L31.0153 17.6441ZM28.2041 21.7861L29.2401 23.2141L33.0174 20.4737L31.9814 19.0457L28.2041 21.7861ZM29.7563 19.9568L28.6783 20.7408L31.4232 24.515L32.5012 23.731L29.7563 19.9568ZM31.937 21.2544L30.887 19.8124L27.1144 22.5594L28.1644 24.0014L31.937 21.2544ZM27.1057 19.8244L26.0697 21.2665L29.8597 23.9894L30.8957 22.5474L27.1057 19.8244Z"
                fill="white"
                mask="url(#path-4-outside-1_2565_1202)"
              />
              <path
                d="M27.1667 27.6667H17.8333M27.1667 27.6667L35.3333 21.25L43.5 14.8333M27.1667 27.6667L43.5 42.8333M43.5 14.8333L37.6667 2H8.5L1.5 14.8333M43.5 14.8333V42.8333M17.8333 27.6667L1.5 14.8333M17.8333 27.6667L1.5 42.8333M1.5 14.8333V42.8333M43.5 42.8333H1.5"
                stroke="white"
                stroke-width="2.33337"
              />
            </svg>
          </i>

          <Text fontSize={"2.4rem"} mb={"2rem"} fontWeight={600}>
            Security Verification
          </Text>
        </Box>

        <Text fontSize={"1.6rem"} mb={"3rem"}>
          Enter the code sent to <strong>{email}</strong>
        </Text>
        <Text
          textAlign={"start"}
          mb={"4px"}
          fontWeight={"bold"}
          fontSize={"1.4rem"}
        >
          Authentication code
        </Text>
        <Box className="text-black w-full">
          <OTPInput
            name="otp"
            id="otp"
            value={otp}
            onChange={(value: string) => setOtp(value)}
          />
        </Box>

        <Box
          display={"flex"}
          fontSize={"1.4rem"}
          justifyContent={"space-between"}
          mt={"10px"}
        >
          <Text fontSize="inherit">
            Expires in{" "}
            <span style={{ fontWeight: "bold" }}>
              {min}:{sec}
            </span>
          </Text>
          <button
            disabled={loading || time > 0}
            type="button"
            onClick={handleResend}
          >
            <Text fontSize="1.4rem" fontWeight={"bold"} textDecor={"underline"}>
              Resend
            </Text>
          </button>
        </Box>

        <Button action="submit" className="mt-[3rem] h-[5.5rem]" type="primary">
          <p>{loading ? <SpinnerMini /> : "Continue"}</p>
        </Button>

        <ChakraButton
          onClick={() => setStep((step) => step - 1)}
          h={"5.5rem"}
          mt="2rem"
        >
          <p className="text-[1.6rem]">Back</p>
        </ChakraButton>
      </form>
    </Box>
  );
};

export default OtpForm;
