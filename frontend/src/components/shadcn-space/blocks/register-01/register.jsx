import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { useState, useContext } from "react";
import axios from "axios";
import AlertGradientDemo from "../../alert/alert-06";
import registerContext from "@/store/register-context";

const registerSchema = z.object({
  username: z.string().min(6, { message: "Username must be at least 6 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});


const RegisterForm = () => {
  const [errors, setErrors] = useState({});
  const [registerAlert, setRegisterAlert] = useState(null);
  const navigate = useNavigate();
  const { updateRegisterContext } = useContext(registerContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    if (!registerSchema.safeParse(data).success) {
      const error = registerSchema.safeParse(data).error.flatten().fieldErrors;
      setErrors(error);
      return;
    }

    setErrors({});
    setRegisterAlert(null);
    let response;
    try {
      response = await axios.post("http://localhost:3000/api/auth/register", data, {
        headers: {
          "Content-type": "application/json"
        }
      });
    } catch (error) {
      setRegisterAlert({
        id: 1,
        title: "Registration failed",
        description:
          error?.response?.data?.message ||
          "Something went wrong while creating your account.",
        type: "error",
      });
      return;
    }

    updateRegisterContext(data);
    navigate("/verifyOtp");

  }
  return (
    <section
      className="bg-foreground dark:bg-background min-h-screen relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        <div
          className="absolute left-1/1 top-0 h-650 w-650 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute left-1/1 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground dark:bg-background" />
      </div>
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        {registerAlert && <AlertGradientDemo alerts={[registerAlert]} />}
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative">
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
                Signup to Drawkitect
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Signup to your account now
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={(event) => handleSubmit(event)}>
              <FieldGroup className="gap-6">
                {/* <Field className="flex justify-center">
                  <Button
                    variant="outline"
                    type="button"
                    className="text-sm text-medium text-card-foreground gap-2 cursor-pointer dark:bg-background rounded-lg h-9 shadow-xs">
                    <img
                      src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
                      alt="google icon"
                      className="h-4 w-4" />
                    Sign up with Google
                  </Button>
                </Field> */}
                {/* <FieldSeparator
                  className="*:data-[slot=field-separator-content]:bg-card text-sm text-muted-foreground bg-transparent">
                  <span className="px-4">or sign up with</span>
                </FieldSeparator> */}

                <div className="flex flex-col gap-4">
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="username" className="text-sm text-muted-foreground font-normal">
                      Username*
                    </FieldLabel>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      required
                      className="dark:bg-background shadow-xs h-9" />
                    {errors.username && <p className="text-xs text-red-500">{errors.username[0]}</p>}
                  </Field>
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="email" className="text-sm text-muted-foreground font-normal">
                      Email*
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@demo.com"
                      required
                      className="dark:bg-background shadow-xs h-9" />
                    {errors.email && <p className="text-xs text-red-500">{errors.email[0]}</p>}
                  </Field>
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="password" className="text-sm text-muted-foreground font-normal">
                      Password*
                    </FieldLabel>

                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="dark:bg-background shadow-xs h-9" />
                    {errors.password && <p className="text-xs text-red-500">{errors.password[0]}</p>}
                  </Field>
                </div>

                <Field className="gap-4">
                  <Button
                    type="submit"
                    size={"lg"}
                    className="rounded-lg cursor-pointer h-10 hover:bg-primary/80">
                    Sign up
                  </Button>
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-card-foreground no-underline!">Sign In</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegisterForm;
