import type { Message } from 'ai/react'
import Image from 'next/image'
import React, { useState, useMemo, useEffect } from 'react'
import CommonLayout from './CommonLayout'
import { isValidJson } from '@/utils/helpers'

type DalleLayoutProps = {
  message: Message
}

type DalleResponse = {
  created: number
  data: {
    revised_prompt: string
    url: string
  }[]
}

export default function DalleLayout({ message }: DalleLayoutProps) {
  const isBot = message.role === 'assistant'

  const [imageStatus, setImageStatus] = useState('loading')

  const dalleResponse: DalleResponse = useMemo(() => {
    return isValidJson(message.content) ? JSON.parse(message.content) : { data: [] }
  }, [message.content])

  useEffect(() => {
    if (dalleResponse.data.length > 0) {
      const img = new window.Image()
      img.onload = () => setImageStatus('loaded')
      img.onerror = () => setImageStatus('error')
      img.src = dalleResponse.data[0].url
    }
  }, [dalleResponse.data])

  if (imageStatus === 'error' || dalleResponse.data.length === 0) {
    return (
      <CommonLayout isBotMessage={isBot}>
        <div>Image not available or it was removed</div>
      </CommonLayout>
    )
  }

  return (
    <CommonLayout isBotMessage={isBot}>
      {imageStatus === 'loaded' ? (
        <>
          <div>{dalleResponse.data[0].revised_prompt}</div>

          <Image
            src={dalleResponse.data[0].url}
            alt="Dalle generated image"
            width={500}
            height={500}
          />
        </>
      ) : (
        <div>... image coming ...</div>
      )}
    </CommonLayout>
  )
}
