"use client";

import { useState } from "react";
import Papa from "papaparse";
import {
  UploadCloud,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadOrderData } from "@/app/actions/upload-csv";
import { useRouter } from "next/navigation";
import { SelectLabel } from "@radix-ui/react-select";

// 1. Define what fields your database NEEDS
const REQUIRED_FIELDS = [
  { key: "amount", label: "Total Amount ($)", required: true },
  { key: "date", label: "Date (YYYY-MM-DD)", required: true },
  { key: "status", label: "Order Status", required: false },
  { key: "product_name", label: "Product Name", required: false },
  { key: "category", label: "Category", required: false },
];

export default function UploadPage() {
  const router = useRouter();

  // State
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Upload, Step 2: Map
  const [rawFile, setRawFile] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. PARSE CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fileHeaders = results.meta.fields || [];
        const fileData = results.data as any[];

        setHeaders(fileHeaders);
        setRawFile(fileData);

        // Auto-guess mapping (Smart feature)
        const initialMapping: Record<string, string> = {};
        REQUIRED_FIELDS.forEach((field) => {
          // Look for case-insensitive matches (e.g. "Price" matches "amount")
          const match = fileHeaders.find(
            (h) =>
              h.toLowerCase().includes(field.key) ||
              (field.key === "amount" &&
                (h.toLowerCase().includes("price") ||
                  h.toLowerCase().includes("total")))
          );
          if (match) initialMapping[field.key] = match;
        });

        setMapping(initialMapping);
        setStep(2); // Move to mapping step
      },
    });
  };

  // 2. TRANSFORM & UPLOAD
  const handleUpload = async () => {
    setIsUploading(true);
    setStatus(null);

    // Transform raw data using the user's mapping
    // We convert { "Sold_Price": "100" } -> { "amount": "100" }
    const cleanedData = rawFile.map((row) => {
      const newRow: any = {};
      Object.entries(mapping).forEach(([targetKey, sourceHeader]) => {
        if (sourceHeader) {
          newRow[targetKey] = row[sourceHeader];
        }
      });
      return newRow;
    });

    try {
      const result = await uploadOrderData(cleanedData);

      if (result.success) {
        setStatus({
          type: "success",
          message: `Successfully imported ${result.count} orders!`,
        });
        setTimeout(() => router.push("/"), 2000);
      } else {
        setStatus({
          type: "error",
          message: result.message || "Upload failed",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Connection error." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
        <p className="text-gray-500">
          {step === 1
            ? "Upload your CSV file."
            : "Map your columns to our database."}
        </p>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:bg-gray-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium">Click to upload CSV</p>
                <p className="text-sm text-gray-500">Drag and drop supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: MAPPING UI */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Match Columns</CardTitle>
            <CardDescription>
              We found <strong>{rawFile.length} rows</strong>. Please tell us
              which columns match.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {REQUIRED_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="grid sm:grid-cols-2 gap-4 items-center border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {field.label}
                      {field.required && (
                        <span className="text-xs text-red-500 font-normal">
                          (Required)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Target Field</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />

                    {/* Using native select for simplicity, or use ShadCN Select */}
                    {/* <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                    >
                      <option value="">-- Select Column --</option>
                      {headers.map(header => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select> */}
                    <Select
                      // 1. Bind the current value
                      value={mapping[field.key] || ""}
                      // 2. Handle the update (note: Radix gives you the direct value, not an event 'e')
                      onValueChange={(value) =>
                        setMapping({ ...mapping, [field.key]: value })
                      }
                    >
                      {/* 3. Fix width to match original (changed w-[180px] to w-full) */}
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Column --" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {/* Optional: Add an item to clear the selection if needed */}
                          {/* <SelectItem value="unselected">-- Select Column --</SelectItem> */}

                          {headers.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Message */}
            {status && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                  status.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {status.message}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Import Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}