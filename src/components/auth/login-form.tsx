"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { signInWithEmail, devBypassLogin } from "@/app/actions";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";

const initialState = {
  success: false,
  error: "",
};

export function LoginForm({ devBypassEnabled }: { devBypassEnabled: boolean }) {
  const [state, formAction] = useActionState(signInWithEmail, initialState);

  return (
    <div className="space-y-4">
      {state?.error && (
        <div className="border-red-200 bg-red-50 text-red-700 rounded-2xl border p-4 text-xs font-medium leading-relaxed">
          <strong className="font-semibold">Error: </strong>
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="border-[#F26522]/20 bg-[#F26522]/5 text-[#F26522] rounded-2xl border p-4 text-xs font-medium leading-relaxed">
          ✨ We sent you a magic link. Check your inbox to sign in!
        </div>
      )}

      {!state?.success && (
        <form action={formAction}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email Address
              </FieldLabel>
              <Input
                id="email"
                name="email"
                required
                type="email"
                placeholder="you@company.com"
                className="h-10 rounded-full border-gray-200 px-4 text-sm focus-visible:ring-[#F26522]/30 focus-visible:border-[#F26522]"
              />
            </Field>
            
            <SubmitButton 
              variant="brand"
              className="w-full rounded-full font-semibold h-10 mt-2"
              icon={<Mail className="w-4 h-4" />}
            >
              Send magic link
            </SubmitButton>

            {devBypassEnabled && (
              <Button
                type="submit"
                formAction={devBypassLogin}
                formNoValidate
                className="w-full bg-gray-900 hover:bg-black text-white rounded-full font-semibold h-10 flex items-center justify-center border-none shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              >
                Dev Bypass (Login as Demo User)
              </Button>
            )}
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
