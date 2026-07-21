import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import z from "zod"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, api } from "@/store/AuthProvider";
import AlertGradientDemo from "../../alert/alert-06";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginForm = () => {
  const [error, setError] = useState({});
  const [loginAlert, setLoginAlert] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const error = result.error.flatten().fieldErrors;
      setError(error);
      return;
    }
    setError({});
    setLoginAlert(null);
    const payload = {
      "identifier": data.email,
      "password": data.password
    }
    try {
      const response = await api.post("/auth/login", payload);

      if (!response.data.accessToken) {
        setLoginAlert({
          id: 1,
          title: "Incorrect credentials",
          description: response.data?.message || "The email or password you entered is incorrect.",
          type: "error",
        });
        return;
      }

      login(response.data.accessToken, response.data.user);
      navigate("/workspace/home");
    } catch (requestError) {
      setLoginAlert({
        id: 1,
        title: "Incorrect credentials",
        description:
          requestError?.response?.data?.message ||
          "The email or password you entered is incorrect.",
        type: "error",
      });
    }
  }

  return (
    <section
      className="bg-foreground dark:bg-background min-h-screen flex items-center justify-center relative">
      <div
        className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        <div
          className="absolute left-1/1 top-0 h-650 w-650 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute left-1/1 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground dark:bg-background" />
      </div>
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6">
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
                Welcome to Drawkitect
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Login to your account now
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loginAlert && (
              <div className="mb-6">
                <AlertGradientDemo alerts={[loginAlert]} />
              </div>
            )}
            <form onSubmit={(event) => handleSubmit(event)}>
              <FieldGroup className="gap-6">
                {/* <Field className="flex justify-center">
                  <Button
                    variant="outline"
                    type="button"
                    className="text-sm text-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs cursor-pointer">
                    <img
                      src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
                      alt="google icon"
                      className="h-4 w-4" />
                    Sign in with Google
                  </Button>
                </Field>
                <FieldSeparator
                  className="*:data-[slot=field-separator-content]:bg-card text-sm text-muted-foreground bg-transparent">
                  <span className="px-4">or sign in with</span>
                </FieldSeparator> */}

                <div className="flex flex-col gap-4">
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="email" className="text-sm text-muted-foreground font-normal">
                      Email*
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="dark:bg-background h-9 shadow-xs" />
                    {error.email && <p className="text-xs text-red-500">{error.email[0]}</p>}
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
                      className="dark:bg-background h-9 shadow-xs" />
                    {error.password && <p className="text-xs text-red-500">{error.password[0]}</p>}
                  </Field>
                </div>

                {/* <Link to="/forgotPassword" className="flex justify-center text-sm text-card-foreground font-medium text-end">
                  Forgot password?
                </Link> */}

                <Field className="gap-4">
                  <Button
                    type="submit"
                    size={"lg"}
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer">
                    Sign in
                  </Button>
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-medium text-card-foreground no-underline!">Sign Up</Link>
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

export default LoginForm;
