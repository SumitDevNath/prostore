"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";

const CredentialsSignInForm = () => {
  return (
    <form>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="my-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password" className="my-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="password"
            required
            defaultValue={signInDefaultValues.password.trim()}
          />
        </div>
        <div>
          <Button className="w-full" variant="default">
            Sign In
          </Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            target="_self"
            className="link"
            children="Sign Up"
          />
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
