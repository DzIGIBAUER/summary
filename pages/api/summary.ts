// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import rateLimit from 'express-rate-limit'
import urlExist from "url-exist"

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { OpenAI } from "langchain"
import { PuppeteerWebBaseLoader } from "langchain/document_loaders"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { loadSummarizationChain } from "langchain/chains"

import chromium  from '@sparticuz/chromium-min';
var { Readability } = require('@mozilla/readability');
var { JSDOM } = require('jsdom');

const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 })

const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })


const applyMiddleware = (middleware: (arg0: any, arg1: any, arg2: (result //nextjs.org/docs/api-routes/introduction
    : any) => void) => void) => (request: any, response: any) => {
  new Promise((resolve, reject) => {
    middleware(request, response, result =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })
}

const getId = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseServerClient = createServerSupabaseClient({req, res})
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()
  
  return user!.id
}

export const getRateLimitMiddlewares = ({
  limit = 5,
  windowMs = 60 * 1000
} = {}) => [
  rateLimit({ keyGenerator: getId, windowMs, max: limit, message: { error: "Too Many Requests"}, legacyHeaders: false, standardHeaders: true }),
]

const middlewares = getRateLimitMiddlewares()

async function applyRateLimit(request: NextApiRequest, response: NextApiResponse) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map(middleware => middleware(request, response))
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const supabaseServerClient = createServerSupabaseClient({req, res})
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()
  
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' })
    return
  }
  
  if (!user) {
    res.status(403).send({ error: 'Please log in first' })
    return
  }

  await applyRateLimit(req, res)
  
  const { url } = req.body
  
  if (!url) {
    res.status(400).send({ error: 'Missing \'url\' field' })
    return
  }

  try {
    new URL(url)
  } catch (e) {
    res.status(400).send({ error: 'Field \'url\' is not a valid URL' })
    return
  }

  if (!await urlExist(url)) {
    res.status(400).send({ error: 'Could not scrape data from given URL. Check if it\'s valid.' })
    return
  }


  let p = new PuppeteerWebBaseLoader(url, {
    gotoOptions: { waitUntil: 'networkidle2' },
    launchOptions: {
      args: chromium.args,
      executablePath: await chromium.executablePath("https://github.com/Sparticuz/chromium/releases/download/v112.0.2/chromium-v112.0.2-pack.tar"),
      headless: chromium.headless
    }
  })


  const dom = new JSDOM(await p.scrape())

  const article = new Readability(dom.window.document).parse();

  if (!article.textContent) {
    res.status(400).send({ error: 'Could not load webpage data' })
    return
  }

  const docs = await textSplitter.createDocuments(await textSplitter.splitText(article.textContent))

  const chain = loadSummarizationChain(model)

  const response = await chain.call({
    input_documents: docs.slice(0, 10)
  })

  res.status(200).json(response)
}
