import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { currency, dateLabel, dueDate, nextStage, statusTone } from "@/components/dashboard/utils";
import { QuoteRow } from "@/components/dashboard/types";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function QuotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-[#F9F9F9]">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">All Quotes</h1>
        <p className="text-gray-400 text-sm font-medium mt-1">Every quote you&apos;ve ever tracked in QuoteChaser.</p>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Master List</h2>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">View your entire proposal pipeline history.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.005)] bg-white">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className="text-gray-400 text-[11px] uppercase tracking-wider font-bold h-10">Customer</TableHead>
                <TableHead className="text-gray-400 text-[11px] uppercase tracking-wider font-bold h-10">Service</TableHead>
                <TableHead className="text-gray-400 text-[11px] uppercase tracking-wider font-bold h-10">Amount</TableHead>
                <TableHead className="text-gray-400 text-[11px] uppercase tracking-wider font-bold h-10">Next touch</TableHead>
                <TableHead className="text-gray-400 text-[11px] uppercase tracking-wider font-bold h-10">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-gray-900 font-bold text-[13px] tracking-tight">No quotes found</p>
                      <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                        Your master list is empty. Start adding quotes from the dashboard to track your follow-ups.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                quotes?.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50/50 border-b border-gray-100 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-[13px]">{quote.customer_name}</span>
                        <span className="text-gray-400 text-[11px] mt-0.5 font-medium">{quote.contact_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-52 truncate py-3.5 text-[13px] text-gray-600 font-medium">{quote.service}</TableCell>
                    <TableCell className="py-3.5 text-[13px] font-bold text-gray-900">{currency.format(quote.quote_amount_cents / 100)}</TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-900 font-semibold">{nextStage(quote as QuoteRow).tone}</span>
                        <span className="text-gray-400 text-[11px] mt-0.5 font-medium">
                          {dateLabel(dueDate(quote as QuoteRow))}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize shadow-[0_1px_2px_rgba(0,0,0,0.015)]", statusTone(quote.status))}>
                        {quote.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
