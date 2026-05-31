/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Edit2, RotateCcw, Loader2 } from "lucide-react";
import { updateTemplate, resetTemplates } from "@/app/actions";

export function TemplateList({ templates }: { templates: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] min-h-[300px]">
        <p className="text-gray-900 font-bold text-base tracking-tight">No templates found</p>
        <p className="text-gray-400 text-xs mt-1 max-w-sm leading-relaxed">
          Your quote follow-up messaging is empty. Initialize standard templates to get started.
        </p>
        <button 
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const res = await resetTemplates();
              if (res?.error) toast.error(res.error);
              else toast.success("Templates initialized.");
            });
          }}
          className="mt-6 rounded-full bg-[#F26522] hover:bg-[#e05a1a] text-white font-bold text-[12px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Initialize Templates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Dynamic Placeholder Guide banner */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="space-y-1">
          <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">
            Personalization Placeholders
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
            Insert these tags into your follow-up templates. QuoteChaser automatically replaces them with real customer details and your profile settings configuration during delivery.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {["{{customer_name}}", "{{service}}", "{{sender_name}}", "{{business_name}}"].map((tag) => (
            <span key={tag} className="text-[11px] font-mono font-bold text-gray-600 bg-gray-50 border border-gray-200/50 px-2.5 py-1 rounded-lg">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main actions bar */}
      <div className="flex justify-end">
        <button 
          disabled={isPending}
          onClick={() => {
            if (!confirm("Are you sure? This will overwrite all your custom templates with the original default templates.")) return;
            startTransition(async () => {
              const res = await resetTemplates();
              if (res?.error) toast.error(res.error);
              else toast.success("Templates reset to defaults.");
            });
          }}
          className="rounded-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-4 h-9 border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          )}
          Reset to Defaults
        </button>
      </div>

      {/* Templates cards list */}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            isEditing={editingId === template.id}
            onEdit={() => setEditingId(template.id)}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ 
  template, 
  isEditing, 
  onEdit, 
  onCancel 
}: { 
  template: any, 
  isEditing: boolean, 
  onEdit: () => void, 
  onCancel: () => void 
}) {
  const [isPending, startTransition] = useTransition();
  
  async function handleSave(formData: FormData) {
    startTransition(async () => {
      const res = await updateTemplate(formData);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Template saved!");
      onCancel();
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-6 sm:p-8 flex flex-col justify-between min-h-[300px]">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-4">
          <h3 className="font-bold text-gray-950 text-[14px] sm:text-[15px] tracking-tight">{template.name}</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#F26522] bg-[#F26522]/5 border border-[#F26522]/10 uppercase tracking-wider shrink-0">
            {template.timing_label}
          </span>
        </div>
        
        {isEditing ? (
          <form action={handleSave} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={template.id} />
            <textarea
              name="body"
              defaultValue={template.body}
              className="w-full min-h-[160px] p-4 text-[13px] font-mono bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200/80 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-gray-800 resize-none leading-relaxed"
              required
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button 
                type="button" 
                onClick={onCancel} 
                disabled={isPending}
                className="rounded-full bg-white hover:bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider px-4 h-9 border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="rounded-full bg-[#F26522] hover:bg-[#e05a1a] text-white font-bold text-[11px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : null}
                <span>{isPending ? "Saving..." : "Save Template"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full min-h-[160px] p-4 text-[13px] font-mono bg-gray-50/30 border border-gray-150 rounded-lg text-gray-600 whitespace-pre-wrap leading-relaxed">
              {template.body}
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button 
                onClick={onEdit}
                className="rounded-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-4 h-9 border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Template</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
