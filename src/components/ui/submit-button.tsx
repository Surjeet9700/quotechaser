"use client";

import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  pendingText?: string;
  icon?: ReactNode;
}

export function SubmitButton({ 
  children, 
  pendingText = "Submitting...", 
  icon,
  variant = "default",
  className,
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending || props.disabled}
      variant={variant}
      className={className}
      {...props}
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{pending ? pendingText : children}</span>
    </Button>
  );
}
