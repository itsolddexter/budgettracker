import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const webhookUrl = process.env.WEBHOOK_URL

  if (!webhookUrl) {
    console.error('Webhook URL not configured')
    return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 })
  }

  try {
    const { dexxy, action, amount, description, mode } = await request.json()
    console.log('Received webhook request:', { dexxy, action, amount, description, mode })

    const payload = {
      dexxy,
      action,
      amount,
      description,
      mode
    }

    console.log('Sending payload to webhook:', payload)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received response from webhook:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in webhook route:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to send webhook' }, { status: 500 })
  }
}

