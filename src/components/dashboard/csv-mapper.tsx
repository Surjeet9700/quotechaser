/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { importQuotes } from "@/app/actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type FieldMapping = {
  customerName: string;
  contactName: string;
  email: string;
  phone: string;
  service: string;
  amount: string;
  quoteSentOn: string;
  notes: string;
};

const REQUIRED_FIELDS = ["customerName", "service", "amount"];
const FIELD_LABELS: Record<keyof FieldMapping, string> = {
  customerName: "Customer Name",
  contactName: "Contact Name",
  email: "Email Address",
  phone: "Phone Number",
  service: "Service Provided",
  amount: "Quote Amount",
  quoteSentOn: "Date Sent",
  notes: "Notes",
};

export function CsvMapper({
  open,
  onOpenChange,
  showTrigger = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTrigger?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Partial<FieldMapping>>({});
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
          setData(results.data);
          
          // Auto-map where possible
          const autoMap: Partial<FieldMapping> = {};
          const lowerFields = results.meta.fields.map(f => f.toLowerCase());
          
          results.meta.fields.forEach((field) => {
            const lower = field.toLowerCase();
            if (lower.includes("customer") || lower.includes("company")) autoMap.customerName = field;
            else if (lower.includes("contact") || lower.includes("name")) autoMap.contactName = field;
            else if (lower.includes("email")) autoMap.email = field;
            else if (lower.includes("phone")) autoMap.phone = field;
            else if (lower.includes("service") || lower.includes("project")) autoMap.service = field;
            else if (lower.includes("amount") || lower.includes("price") || lower.includes("total")) autoMap.amount = field;
            else if (lower.includes("date") || lower.includes("sent")) autoMap.quoteSentOn = field;
            else if (lower.includes("note")) autoMap.notes = field;
          });
          
          setMapping(autoMap);
        }
      },
      error: (error) => {
        toast.error("Failed to parse CSV: " + error.message);
      }
    });
  }

  function handleImport() {
    // Validate required fields
    for (const req of REQUIRED_FIELDS) {
      if (!mapping[req as keyof FieldMapping]) {
        toast.error(`Please map the required field: ${FIELD_LABELS[req as keyof FieldMapping]}`);
        return;
      }
    }

    const formattedQuotes = data.map((row) => {
      const q: any = {};
      for (const [appField, csvCol] of Object.entries(mapping)) {
        if (csvCol && row[csvCol]) {
          q[appField] = row[csvCol];
        }
      }
      return q;
    });

    startTransition(async () => {
      // Chunk the array to prevent hitting Next.js Server Action 1MB payload limits
      const CHUNK_SIZE = 100;
      let successCount = 0;
      
      for (let i = 0; i < formattedQuotes.length; i += CHUNK_SIZE) {
        const chunk = formattedQuotes.slice(i, i + CHUNK_SIZE);
        const res = await importQuotes(chunk);
        
        if (res?.error) {
          toast.error(`Error on row ${i + 1}: ${res.error}`);
          return;
        }
        successCount += chunk.length;
      }
      
      toast.success(`Successfully imported ${successCount} quotes!`);
      reset();
      onOpenChange(false);
    });
  }

  function reset() {
    setFile(null);
    setHeaders([]);
    setData([]);
    setMapping({});
  }

  return (
    <Sheet open={open} onOpenChange={(val) => {
      if (!val) reset();
      onOpenChange(val);
    }}>
      {showTrigger ? (
        <SheetTrigger render={
          <button className="rounded-md bg-background border border-border hover:bg-muted active:scale-[0.98] text-foreground px-3 h-8 font-medium text-[12px] transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
        } />
      ) : null}
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl bg-background p-4 sm:p-6 sm:rounded-l-3xl border-l border-border">
        
        <SheetHeader className="border-b border-border pb-4 mb-6">
          <SheetTitle className="text-lg font-semibold text-foreground tracking-tight">Import CSV</SheetTitle>
          <SheetDescription className="text-muted-foreground text-[13px] mt-1 leading-relaxed">
            Upload your spreadsheet to seamlessly transition your pipeline into QuoteChaser.
          </SheetDescription>
        </SheetHeader>

        {!file ? (
          <div className="flex flex-col items-center justify-center p-10 border border-dashed border-border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">Upload your CSV file</p>
            <p className="text-[13px] text-muted-foreground mt-1 mb-4 text-center">
              We'll extract the column names so you can match them to our fields.
            </p>
            <label className="rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background font-medium text-[13px] px-4 h-9 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5">
              <span>Select File</span>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <p className="text-[13px] font-medium text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                {file.name}
              </p>
              <p className="text-[12px] text-muted-foreground mt-1">{data.length} rows detected.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Map Columns</h3>
              <div className="grid gap-3">
                {Object.entries(FIELD_LABELS).map(([key, label]) => {
                  const fieldKey = key as keyof FieldMapping;
                  const isRequired = REQUIRED_FIELDS.includes(fieldKey);
                  return (
                     <div key={fieldKey} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-border rounded-md bg-background">
                      <label className="text-[13px] font-medium text-foreground">
                        {label} {isRequired && <span className="text-destructive">*</span>}
                      </label>
                      <select
                        value={mapping[fieldKey] || ""}
                        onChange={(e) => setMapping({ ...mapping, [fieldKey]: e.target.value })}
                        className="w-full sm:w-48 h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground font-medium cursor-pointer"
                      >
                        <option value="">-- Ignore this field --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            <SheetFooter className="border-t border-border pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-md bg-background hover:bg-muted text-foreground font-medium text-[13px] px-4 h-9 border border-border shadow-sm transition-all duration-200 cursor-pointer"
              >
                Start Over
              </button>
              <button
                disabled={isPending}
                onClick={handleImport}
                className="rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background font-medium text-[13px] px-4 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-background" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-background" />
                )}
                <span>{isPending ? "Importing..." : "Confirm Import"}</span>
              </button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
