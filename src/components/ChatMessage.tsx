import type { Message } from 'ai/react'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CommonLayout from './CommonLayout'
import CopyButton from './CopyButton'

type Props = {
  message: Message
}

function ChatMessage({ message }: Props) {
  const isBot = message.role === 'assistant'

  return (
    <CommonLayout isBotMessage={isBot}>
      <div className="flex flex-col gap-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings with proper hierarchy and spacing
            h1: (props) => (
              <h1
                className="text-3xl font-bold mb-2 break-words text-gray-100 border-b border-gray-600 pb-2"
                {...props}
              />
            ),
            h2: (props) => (
              <h2
                className="text-2xl font-bold mb-2 break-words text-gray-100 border-b border-gray-700 pb-1"
                {...props}
              />
            ),
            h3: (props) => (
              <h3 className="text-xl font-bold mb-1 break-words text-gray-200" {...props} />
            ),
            h4: (props) => (
              <h4 className="text-lg font-semibold mb-1 break-words text-gray-200" {...props} />
            ),
            h5: (props) => (
              <h5 className="text-base font-semibold mb-1 break-words text-gray-300" {...props} />
            ),
            h6: (props) => (
              <h6
                className="text-sm font-semibold mb-1 break-words text-gray-300 uppercase tracking-wide"
                {...props}
              />
            ),

            // Paragraphs with better spacing
            p: (props) => (
              <p className="leading-relaxed text-gray-300 first:mt-0 last:mb-0" {...props} />
            ),

            // Enhanced lists with better spacing and nested support
            ul: (props) => (
              <ul
                className="list-disc mb-2 ml-6 space-y-1 text-gray-300 marker:text-gray-500"
                {...props}
              />
            ),
            ol: (props) => (
              <ol
                className="list-decimal mb-2 ml-6 space-y-1 text-gray-300 marker:text-gray-500 marker:font-semibold"
                {...props}
              />
            ),
            li: (props) => <li className="leading-relaxed pl-2" {...props} />,

            // Enhanced blockquotes with better visual hierarchy
            blockquote: (props) => (
              <blockquote
                className="border-l-4 border-blue-500/50 pl-6 pr-4 my-3 italic text-gray-300 bg-gray-800/40 py-3 rounded-r-lg relative"
                {...props}
              />
            ),

            // Tables with enhanced styling
            table: (props) => (
              <div className="overflow-x-auto my-3 rounded-lg border border-gray-600">
                <table className="min-w-full border-collapse text-sm" {...props} />
              </div>
            ),
            thead: (props) => <thead className="bg-gray-800" {...props} />,
            tbody: (props) => <tbody className="bg-gray-900/50" {...props} />,
            tr: (props) => (
              <tr
                className="border-b border-gray-600 hover:bg-gray-800/30 transition-colors"
                {...props}
              />
            ),
            th: (props) => (
              <th
                className="border-r border-gray-600 px-4 py-3 text-left font-semibold text-gray-100 bg-gray-700 first:border-l-0 last:border-r-0"
                {...props}
              />
            ),
            td: (props) => (
              <td
                className="border-r border-gray-600 px-4 py-3 text-gray-300 leading-relaxed first:border-l-0 last:border-r-0"
                {...props}
              />
            ),

            // Horizontal rule with enhanced styling
            hr: (props) => (
              <hr
                className="my-2 border-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                {...props}
              />
            ),

            // Text formatting with better contrast
            strong: (props) => <strong className="font-bold text-gray-100" {...props} />,
            em: (props) => <em className="italic text-gray-300" {...props} />,

            // Enhanced pre blocks
            pre: (props) => <pre className="whitespace-pre-wrap overflow-x-auto" {...props} />,

            // Enhanced code blocks and inline code
            code: ({ className, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              return (
                <>
                  {match ? (
                    <div className="flex flex-col my-3 rounded-lg overflow-hidden border border-gray-700">
                      <div className="flex items-center justify-between bg-gray-800 text-gray-200 text-xs border-b border-gray-700">
                        <span className="px-4 py-3 font-medium">
                          {className?.split('language-')[1]}
                        </span>
                        <div className="px-2">
                          <CopyButton textToCopy={props.children as string} />
                        </div>
                      </div>
                      <div className="overflow-x-auto p-4 bg-gray-950 text-gray-200 text-sm">
                        <code className="hljs" {...props} />
                      </div>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-800/80 px-2 py-1 rounded text-sm font-mono text-gray-200 border border-gray-700/50"
                      {...props}
                    />
                  )}
                </>
              )
            },

            // Enhanced links with better hover states
            a: (props) => (
              <a
                className="text-blue-400 hover:text-blue-300 hover:underline underline-offset-2 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),

            // Additional elements for completeness
            del: (props) => <del className="line-through text-gray-500" {...props} />,
            sub: (props) => <sub className="text-xs align-sub text-gray-400" {...props} />,
            sup: (props) => <sup className="text-xs align-super text-gray-400" {...props} />,
            mark: (props) => (
              <mark className="bg-yellow-500/20 text-yellow-200 px-1 rounded" {...props} />
            ),
            kbd: (props) => (
              <kbd
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs font-mono text-gray-300"
                {...props}
              />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </CommonLayout>
  )
}

export default memo(ChatMessage)
