import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState, useContext } from "react";
import AlertGradientDemo from "../../alert/alert-06";
import TimerProgress from "../../progress/progress-01";
import registerContext from "@/store/register-context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTP_TIMER_SECONDS = 180;

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const TwoFactorAuthForm = () => {
  const [otp, setOtp] = useState("");
  const [otpAlert, setOtpAlert] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TIMER_SECONDS);
  const [timerRun, setTimerRun] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const {registerState} = useContext(registerContext);
  const navigate = useNavigate();

  useEffect(() => {
    setSecondsLeft(OTP_TIMER_SECONDS);

    const intervalId = setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds <= 1) {
          clearInterval(intervalId);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerRun]);

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (otp.length < 6) {
      setOtpAlert({
        id: 1,
        title: "Invalid OTP",
        description: "Please enter a 6 digit otp.",
        type: "error",
      });
      return;
    }

    setOtpAlert(null);

    const payload = {
      email: registerState.email,
      otp,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/verifyOtp",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.user?.verified) {
        setOtpAlert({
          id: 1,
          title: "Email verified",
          description:
            response.data?.message ||
            "Your account has been verified successfully.",
          actionText: "Proceed to login",
          onAction: () => navigate("/login"),
          type: "success",
          fullscreen: true,
        });
      }
    } catch (error) {
      setOtpAlert({
        id: 1,
        title: "Incorrect OTP",
        description:
          error?.response?.data?.message ||
          "Please enter a valid 6 digit OTP.",
        type: "error",
      });
    }
  };

  const handleResendOtp = async () => {
    if (!isOtpExpired || isResending) {
      return;
    }

    setIsResending(true);

    try {
      await axios.post(
        "http://localhost:3000/api/auth/resendOtp",
        { email: registerState.email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setOtp("");
      setOtpAlert({
        id: 1,
        title: "OTP resent",
        description: "A fresh OTP has been sent to your email address.",
        type: "success",
      });
      setTimerRun((currentRun) => currentRun + 1);
    } catch (error) {
      setOtpAlert({
        id: 1,
        title: "Resend failed",
        description:
          error?.response?.data?.message ||
          "We could not resend the OTP right now.",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  const isOtpExpired = secondsLeft === 0;
  const otpProgress = ((OTP_TIMER_SECONDS - secondsLeft) / OTP_TIMER_SECONDS) * 100;
  const otpMinuteLabel = isOtpExpired
    ? "OTP expired"
    : `OTP expires in ${Math.ceil(secondsLeft / 60)} minute${Math.ceil(secondsLeft / 60) === 1 ? "" : "s"}`;
  return (
    <section
      className="bg-foreground dark:bg-background min-h-screen relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        {/* Outer big circle */}
        <div
          className="absolute left-1/1 top-0 h-650 w-650 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Inner circle */}
        <div
          className="absolute left-1/1 top-0  h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground dark:bg-background" />
      </div>
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        {otpAlert && <AlertGradientDemo alerts={[otpAlert]} />}
        <Card className="px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <a href="">
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-black.svg"
                  alt="shadcnspace"
                  className="dark:hidden h-10 w-10" />
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-white.svg"
                  alt="shadcnspace"
                  className="hidden dark:block h-10 w-10" />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Verify One-Time Password
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Please enter the code sent to {registerState.email} to complete the registration process.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleOtpSubmit}>
              <FieldGroup className="gap-6">
                <div className="flex flex-col items-center gap-4">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    minLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    id="otp"
                    required>
                    <InputOTPGroup
                      className="gap-1 *:data-[slot=input-otp-slot]:rounded-xl *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:size-9">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <TimerProgress
                    progress={otpProgress}
                    title={otpMinuteLabel}
                    trailingLabel={isOtpExpired ? "Expired" : formatTime(secondsLeft)}
                    showAction={false}
                  />

                  <Field className="gap-6">
                    <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                      Didn&apos;t get the code?{" "}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResendOtp}
                        disabled={!isOtpExpired || isResending}
                        className="h-auto p-0 font-medium text-card-foreground no-underline! cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                        {isResending ? "Resending..." : "Resend code"}
                      </Button>
                    </FieldDescription>
                    <Button
                      type="submit"
                      size={"lg"}
                      className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer">
                      Confirm
                    </Button>
                  </Field>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TwoFactorAuthForm;
