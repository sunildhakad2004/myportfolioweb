const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { message: "Method not allowed." });
  }

  const allowedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (!allowedOrigin || request.headers.origin !== allowedOrigin) {
    return sendJson(response, 403, { message: "This request is not allowed." });
  }

  const {
    name = "",
    email = "",
    subject = "",
    message = "",
    consent = false,
    website = ""
  } = request.body || {};

  if (website) {
    return sendJson(response, 200, {
      delivered: { email: true, whatsapp: true },
      message: "Thanks. Your message has been received."
    });
  }

  const contact = {
    name: String(name).trim(),
    email: String(email).trim(),
    subject: String(subject).trim(),
    message: String(message).trim()
  };

  if (
    !consent ||
    contact.name.length < 2 || contact.name.length > 100 ||
    !EMAIL_PATTERN.test(contact.email) || contact.email.length > 254 ||
    contact.subject.length < 2 || contact.subject.length > 120 ||
    contact.message.length < 5 || contact.message.length > 2000
  ) {
    return sendJson(response, 400, { message: "Please check the form details and try again." });
  }

  const requiredSettings = [
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "WHATSAPP_ACCESS_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_RECIPIENT_NUMBER",
    "WHATSAPP_TEMPLATE_NAME",
    "PUBLIC_SITE_ORIGIN"
  ];

  if (requiredSettings.some((setting) => !process.env[setting])) {
    return sendJson(response, 503, { message: "Contact delivery is not configured yet." });
  }

  const emailText = [
    `Name: ${contact.name}`,
    `Reply email: ${contact.email}`,
    `Subject: ${contact.subject}`,
    "",
    contact.message
  ].join("\n");

  const whatsappParameters = [contact.name, contact.email, contact.subject, contact.message]
    .map((text) => ({ type: "text", text }));

  const [emailResult, whatsappResult] = await Promise.allSettled([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: ["sunildhakadsd27@gmail.com"],
        reply_to: contact.email,
        subject: `Portfolio message: ${contact.subject}`,
        text: emailText
      })
    }),
    fetch(`https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_RECIPIENT_NUMBER,
        type: "template",
        template: {
          name: process.env.WHATSAPP_TEMPLATE_NAME,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US" },
          components: [{ type: "body", parameters: whatsappParameters }]
        }
      })
    })
  ]);

  const delivered = {
    email: emailResult.status === "fulfilled" && emailResult.value.ok,
    whatsapp: whatsappResult.status === "fulfilled" && whatsappResult.value.ok
  };

  if (!delivered.email && !delivered.whatsapp) {
    console.error("Contact notification delivery failed.");
    return sendJson(response, 502, { message: "We could not deliver your message. Please try again later." });
  }

  return sendJson(response, 200, {
    delivered,
    message: delivered.email && delivered.whatsapp
      ? "Your message was sent to Sunil."
      : "Your message was received, but one notification could not be delivered."
  });
}