export async function onRequestPost(context) {
  try {
    const { email } = await context.request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Notify Adriana
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Impact Player <hi@impact-player.com>',
        to: ['Agelabert@envoltaenergia.com', 'maguirre@envoltaenergia.com'],
        subject: 'Impact Player — Nova inscripció',
        html: `<p style="font-family:sans-serif;color:#121918;">Nou interessat a la llista d'espera:<br><br><strong>${email}</strong></p>`
      })
    });

    // Confirmation to subscriber
    const res2 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Impact Player <hi@impact-player.com>',
        to: email,
        subject: 'You\'re on the list — Impact Player',
        html: `
          <p style="font-family:sans-serif;color:#121918;line-height:1.7;">
            Hi,<br><br>
            Thank you for your interest in <strong>Impact Player</strong>.<br>
            We'll be in touch soon with more information.<br><br>
            — The Impact Player Team<br>
            <span style="color:#888;font-size:12px;">impact-player.com · Barcelona</span>
          </p>
        `
      })
    });

    if (!res2.ok) {
      const err2 = await res2.text();
      console.error('Confirmation email error:', err2);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
