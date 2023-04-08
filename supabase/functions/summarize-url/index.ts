// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/langchain@0.0.48"
import { PuppeteerWebBaseLoader } from "https://esm.sh/langchain@0.0.48/document_loaders"
import { RecursiveCharacterTextSplitter } from "https://esm.sh/langchain@0.0.48/text_splitter"
import { loadSummarizationChain } from "https://esm.sh/langchain@0.0.48/chains"
//import { BaseLanguageModel } from "https://esm.sh/langchain@0.0.48/base_language"

const model = new OpenAI({ modelName: "text-ada-001", temperature: 0 });

const _textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000
})

serve(async (req) => {
  const { url } = await req.json()
  
  const docs = await new PuppeteerWebBaseLoader(url).load()
  // @ts-ignore
  const chain = loadSummarizationChain(model)

  const res = await chain.call({
    input_documents: docs
  })

  console.log(res);

  const data = {
    message: `Hello ${url}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
