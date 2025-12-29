import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Resend } from "resend"; // PROMENA 1: Resend umesto SendGrid
import cors from "cors";

require("dotenv").config();

admin.initializeApp();

// PROMENA 2: Resend API key umesto SendGrid
const resendApiKey = process.env.RESEND_API_KEY as string;
// const fromEmail = process.env.FROM_EMAIL || "Nektarika <spredolac87@gmail.com>";
// const supportEmail = process.env.SUPPORT_EMAIL || "spredolac87@gmail.com";
const fromEmail = "Nektarika <info@nektarika.rs>";
const supportEmail = "nektarika.info@gmail.com";

// PROMENA 3: Inicijalizacija Resend
const resend = new Resend(resendApiKey);

// Trigger za novu porudžbinu
export const onOrderCreated = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const orderData = event.data?.data();
    const orderId = event.params.orderId;

    console.log(`Processing new order: ${orderId}`);

    try {
      if (!resendApiKey) throw new Error("Resend API Key missing");

      if (orderData?.userEmail) {
        await sendOrderConfirmationEmail(orderData, orderId);
        console.log(
          `Order confirmation sent for ${orderId} to ${orderData.userEmail}`
        );
      } else {
        console.log(`No email sent for ${orderId} - missing user email`);
      }
    } catch (error) {
      console.error(`Error sending order confirmation for ${orderId}:`, error);
    }
  }
);

// Trigger za ažuriranje porudžbine
export const onOrderUpdated = onDocumentUpdated(
  "orders/{orderId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    const orderId = event.params.orderId;

    console.log(
      `Order ${orderId} updated from ${before?.status} to ${after?.status}`
    );

    if (before?.status !== "shipped" && after?.status === "shipped") {
      try {
        if (!resendApiKey) throw new Error("Resend API Key missing");

        if (after.userEmail) {
          await sendOrderShippedEmail(after, orderId);
          console.log(
            `Order shipped notification sent for ${orderId} to ${after.userEmail}`
          );
        }
      } catch (error) {
        console.error(
          `Error sending shipped notification for ${orderId}:`,
          error
        );
      }
    }
  }
);

// PROMENA 4: Prilagođene funkcije za Resend (bez template-a)
async function sendOrderConfirmationEmail(orderData: any, orderId: string) {
  const orderItemsHtml =
    orderData.items
      ?.map(
        (item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
        item.name || ""
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
        item.quantity || 0
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${
        item.price?.toFixed(2) || "0.00"
      } RSD</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${(
        (item.price || 0) * (item.quantity || 0)
      ).toFixed(2)} RSD</td>
    </tr>
  `
      )
      .join("") || "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Hvala vam na porudžbini!</h1>
      
      <p>Poštovani/a ${orderData.shippingAddress?.fullName || "kupče"},</p>
      
      <p>Vaša porudžbina <strong>#${orderId}</strong> je uspešno primljena.</p>
      
      <h2 style="color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Detalji porudžbine</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th style="padding: 10px; text-align: left;">Proizvod</th>
            <th style="padding: 10px; text-align: center;">Količina</th>
            <th style="padding: 10px; text-align: right;">Cena</th>
            <th style="padding: 10px; text-align: right;">Ukupno</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Dostava:</strong></td>
            <td style="padding: 10px; text-align: right;">${
              orderData.shippingCost?.toFixed(2) || "0.00"
            } RSD</td>
          </tr>
          <tr style="background-color: #f8f8f8;">
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>UKUPNO:</strong></td>
            <td style="padding: 10px; text-align: right;"><strong>${
              orderData.total?.toFixed(2) || "0.00"
            } RSD</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <h3 style="color: #666; margin-top: 30px;">Adresa dostave:</h3>
      <p>
        ${orderData.shippingAddress?.address || ""}<br>
        ${orderData.shippingAddress?.city || ""}<br>
        Tel: ${orderData.shippingAddress?.phone || ""}
      </p>
      
      <p style="margin-top: 30px; color: #666;">
        Datum porudžbine: ${new Date().toLocaleDateString("sr-RS")}
      </p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="text-align: center; color: #999;">
        Imate pitanja? Kontaktirajte nas na ${supportEmail}
      </p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: orderData.userEmail,
    subject: `Porudžbina #${orderId} - Nektarika`,
    html: html,
  });
}

async function sendOrderShippedEmail(orderData: any, orderId: string) {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Vaša porudžbina je poslata! 📦</h1>
      
      <p>Poštovani/a ${orderData.shippingAddress?.fullName || "kupče"},</p>
      
      <p>Obaveštavamo vas da je vaša porudžbina <strong>#${orderId}</strong> poslata!</p>
      
      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Očekivani datum dostave:</h3>
        <p style="font-size: 18px; margin: 5px 0;">
          <strong>${estimatedDelivery.toLocaleDateString("sr-RS", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</strong>
        </p>
      </div>
      
      <h3>Adresa dostave:</h3>
      <p>
        ${orderData.shippingAddress?.address || ""}<br>
        ${orderData.shippingAddress?.city || ""}
      </p>
      
      <p style="margin-top: 30px;">
        Vaša porudžbina će biti dostavljena u narednih 2-3 radna dana.
      </p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="text-align: center; color: #999;">
        Imate pitanja? Kontaktirajte nas na ${supportEmail}
      </p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: orderData.userEmail,
    subject: `Porudžbina #${orderId} je poslata - Nektarika`,
    html: html,
  });
}

// CORS instance
const corsHandler = cors({ origin: "https://nektarika.rs" });

export const sendContactEmail = onRequest({ cors: true }, async (req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
    }

    try {
      if (!resendApiKey) throw new Error("Resend API Key missing");

      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ success: false, error: "All fields are required" });
      }

      // Email koji stiže vama
      await resend.emails.send({
        from: fromEmail,
        to: supportEmail,
        replyTo: email,
        subject: `📩 Nova poruka sa sajta od ${name}`,
        html: `
              <h3>Nova poruka sa sajta</h3>
              <p><strong>Ime:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Poruka:</strong><br/>${message.replace(
                /\n/g,
                "<br/>"
              )}</p>
              <hr>
              <p><small>Kliknite na email adresu iznad da odgovorite korisniku.</small></p>
            `,
      });

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error sending contact email:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Test email
export const testEmail = onRequest({ cors: true }, async (req, res) => {
  try {
    if (!resendApiKey) throw new Error("Resend API Key missing");

    const testEmail = (req.query.email as string) || "spredolac87@gmail.com";

    await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "Test Email from Nektarika",
      html: `<h2>Test Email</h2>
             <p>If you received this email, your setup is working!</p>
             <p>Time sent: ${new Date().toISOString()}</p>`,
    });

    res.status(200).json({ success: true, sentTo: testEmail });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
