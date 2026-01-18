import Link from "next/link"
import { ArrowRight, CheckCircle2, FileSpreadsheet, XCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <Zap className="h-4 w-4 fill-blue-700" />
            <span>Powering your data with Gemini AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Turn your spreadsheets into <br className="hidden md:block" />
            <span className="text-blue-600">actionable intelligence.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            InsightEngine connects your raw sales data to a powerful AI agent. 
            Upload your history, ask plain English questions, and get strategic advice instantly.
          </p>
        </div>
      </section>

      {/* 2. THE PROCESS (Diagram) */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">How the magic happens</h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gray-200 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 bg-gray-50 p-4 rounded-xl">
            <div className="h-16 w-16 bg-white border shadow-sm rounded-2xl flex items-center justify-center">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">1. Upload CSV</h3>
              <p className="text-gray-500 text-sm mt-1">Export your orders from Shopify, Stripe, or Excel and drop the file here.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 bg-gray-50 p-4 rounded-xl">
            <div className="h-16 w-16 bg-white border shadow-sm rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600 fill-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. AI Parsing</h3>
              <p className="text-gray-500 text-sm mt-1">Our AI maps your columns automatically. No need to rename "Amt" to "Amount".</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 bg-gray-50 p-4 rounded-xl">
            <div className="h-16 w-16 bg-white border shadow-sm rounded-2xl flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. Ask & Discover</h3>
              <p className="text-gray-500 text-sm mt-1">"Show me sales trends." <br/> "Why did revenue drop in May?"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DATA GUIDELINES (The "Contract") */}
      <section className="px-4 max-w-4xl mx-auto mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* DO's */}
          <Card className="border-green-100 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                Accepted Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-start text-sm text-green-900">
                <span className="font-bold">•</span>
                <span>File types: <strong>.CSV</strong> or <strong>.JSON</strong> only.</span>
              </div>
              <div className="flex gap-2 items-start text-sm text-green-900">
                <span className="font-bold">•</span>
                <span>Must include a <strong>Header Row</strong> (e.g., Date, Price, Item).</span>
              </div>
              <div className="flex gap-2 items-start text-sm text-green-900">
                <span className="font-bold">•</span>
                <span>Max file size: <strong>4MB</strong> (approx 10,000 rows).</span>
              </div>
            </CardContent>
          </Card>

          {/* DON'Ts */}
          <Card className="border-red-100 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                Avoid These
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-start text-sm text-red-900">
                <span className="font-bold">•</span>
                <span>Password protected Excel files.</span>
              </div>
              <div className="flex gap-2 items-start text-sm text-red-900">
                <span className="font-bold">•</span>
                <span>Merged cells or images inside the sheet.</span>
              </div>
              <div className="flex gap-2 items-start text-sm text-red-900">
                <span className="font-bold">•</span>
                <span>Sensitive PII (Credit card numbers, SSNs).</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="text-center px-4">
        <h3 className="text-xl font-medium mb-6">Ready to upload your first dataset?</h3>
        <div className="flex justify-center gap-4">
           {/* This will eventually link to /upload */}
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/login">
              Log In / Sign Up
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}