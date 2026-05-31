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
        <div className="border-[#F26522]/20 bg-[#F26522]/5 text-[#F26522] rounded-2xl border p-4 text-[13px] font-medium leading-relaxed text-center">
          ✨ We sent you a magic link. Check your inbox to sign in!
        </div>
      )}

      {!state?.success && (
        <form action={formAction}>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                Email Address
              </FieldLabel>
              <Input
                id="email"
                name="email"
                required
                type="email"
                placeholder="you@company.com"
                className="h-11 rounded-full border-gray-200/60 px-5 text-[14px] bg-white/60 focus-visible:bg-white focus-visible:ring-[#F26522]/30 focus-visible:border-[#F26522] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] placeholder:text-gray-300"
              />
            </Field>
            
            <SubmitButton 
              variant="brand"
              className="w-full rounded-full font-bold h-11 mt-2 shadow-md shadow-[#F26522]/20 hover:shadow-lg hover:shadow-[#F26522]/30 transition-all hover:scale-[1.02]"
              icon={<Mail className="w-4 h-4" />}
            >
              Send magic link
            </SubmitButton>

            {devBypassEnabled && (
              <Button
                type="submit"
                formAction={devBypassLogin}
                formNoValidate
                className="w-full bg-gray-900 hover:bg-black text-white rounded-full font-semibold h-11 flex items-center justify-center border-none shadow-sm transition-all duration-300 cursor-pointer hover:scale-[1.02] mt-2"
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
