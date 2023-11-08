import type { Message } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import CopyButton from './CopyButton'

type Props = {
  message: Message
}

export default function ChatMessage({ message }: Props) {
  const isBot = message.role === 'assistant'
  const bgColor = isBot ? 'bg-gray-700' : 'bg-gray-800'
  const nameColor = isBot ? 'text-green-500' : 'text-gray-200'

  return (
    <div className={`flex flex-col gap-2 p-2 w-full rounded ${bgColor}`} key={message.id}>
      <h3 className={`${nameColor} text-sm font-bold`}>{isBot ? 'Bot' : 'You'}</h3>

      <ReactMarkdown
        className="flex flex-col gap-2"
        components={{
          pre: (props) => <pre className="whitespace-pre-wrap" {...props} />,
          code: ({ className, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            return (
              <>
                {match ? (
                  <span className="flex flex-col my-2">
                    <span className="flex items-center justify-between rounded-t-lg bg-gray-900 text-gray-200 text-xs">
                      <span className="p-4">{className?.split('language-')[1]}</span>
                      <CopyButton textToCopy={props.children as string} />
                    </span>

                    <span className="overflow-y-auto p-4 rounded-b-lg bg-neutral-950 text-gray-200 text-sm">
                      <code className="hljs language-javascript" {...props} />
                    </span>
                  </span>
                ) : (
                  <span className="font-mono font-bold text-white">{`'${props.children}'`}</span>
                )}
              </>
            )
          },
          a: (props) => <a className="text-blue-500 hover:underline" {...props} />,
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  )
}
