import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { senderName, senderPhone, senderEmail, message, recipientEmail, officeName } = await req.json()

  if (!senderName || !message) {
    return NextResponse.json({ error: 'الاسم والرسالة مطلوبان' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY || !recipientEmail) {
    return NextResponse.json({ success: true })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@yourplatform.com',
      to: recipientEmail,
      subject: `رسالة جديدة من ${senderName} عبر موقع ${officeName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #111; border-bottom: 2px solid #eee; padding-bottom: 12px;">رسالة جديدة من موقعك</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 120px;">الاسم</td><td style="padding: 8px 0; font-weight: bold;">${senderName}</td></tr>
            ${senderPhone ? `<tr><td style="padding: 8px 0; color: #666;">الجوال</td><td style="padding: 8px 0;" dir="ltr">${senderPhone}</td></tr>` : ''}
            ${senderEmail ? `<tr><td style="padding: 8px 0; color: #666;">البريد</td><td style="padding: 8px 0;" dir="ltr">${senderEmail}</td></tr>` : ''}
          </table>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="color: #666; margin: 0 0 8px;">الرسالة:</p>
            <p style="color: #111; margin: 0; line-height: 1.8;">${message}</p>
          </div>
        </div>
      `,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل الإرسال، حاول مرة أخرى' }, { status: 500 })
  }
}
