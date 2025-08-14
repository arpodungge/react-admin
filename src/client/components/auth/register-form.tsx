import { Button } from "@client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@client/components/ui/card";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { cn } from "@client/lib/utils";
import { useAuth } from "@client/provider/authProvider";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setToken } = useAuth();
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const handleRegister = () => {
    setLoading(true);
    setError("");
    axios
      .post("/api/auth/register", {
        username,
        fullname,
        password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/auth/login");
      })
      .catch((error) => {
        console.error("Error submitting data:", error.response.data);
        setError("bad request");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registration Form</CardTitle>
          <CardDescription>Please fill out this form to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="fullname">Fullname</Label>
                  <Input
                    id="fullname"
                    type="text"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-destructive text-center text-sm">
                    {error}
                  </p>
                )}

                <Button
                  type="button"
                  className="w-full"
                  disabled={loading}
                  onClick={handleRegister}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <p> Register </p>
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <NavLink
                  className="underline underline-offset-4"
                  to="/auth/login"
                >
                  Sign in
                </NavLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
