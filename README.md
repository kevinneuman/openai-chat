# <img alt="Logo" src="https://github.com/kevinneuman/openai-chat/blob/main/public/icons/logo16.png" style="width: 16px; height: auto;"> openai-chat

A cost-effective, mobile-first chat UI, designed with OpenAI API, Next.js, and Tailwind CSS, uses credits for a cheaper alternative to costly subscriptions.

## Getting Started

First, create a

```
.env.local
```

file in the root and add [your API key](https://platform.openai.com/account/api-keys) to it

Also if you plan to use document query (RAG) feature add [vercel blob storage token](https://vercel.com/docs/storage/vercel-blob)

```
OPENAI_API_KEY=<key>
BLOB_READ_WRITE_TOKEN=<token>
```

_**Note:**_ API key and blob token can also be provided from UI but it's much less secure

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
