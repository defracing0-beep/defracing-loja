module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const siteUrl = process.env.SITE_URL || "https://defracing-loja.vercel.app";

    if (!accessToken) {
      res.status(500).json({
        error: "Falta configurar a variável MP_ACCESS_TOKEN no Vercel."
      });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const customer = body.customer || {};

    const requiredFields = ["name", "cpf", "email", "zipCode", "street", "number", "city", "state", "whatsapp"];
    const missing = requiredFields.filter((field) => !customer[field]);

    if (missing.length) {
      res.status(400).json({ error: "Campos obrigatórios faltando: " + missing.join(", ") });
      return;
    }

    const preference = {
      items: [
        {
          title: "Pedido de teste DeFracing",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 10
        }
      ],
      back_urls: {
        success: `${siteUrl}/success`,
        pending: `${siteUrl}/pending`,
        failure: `${siteUrl}/failure`
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/webhook`,
      external_reference: `DEFRACING-${Date.now()}`,
      payer: {
        name: customer.name,
        email: customer.email,
        identification: {
          type: "CPF",
          number: String(customer.cpf)
        },
        address: {
          zip_code: String(customer.zipCode),
          street_name: String(customer.street),
          street_number: String(customer.number)
        }
      },
      shipments: {
        cost: 0,
        mode: "not_specified"
      },
      metadata: {
        whatsapp: customer.whatsapp,
        district: customer.district || "",
        city: customer.city,
        state: customer.state
      }
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      res.status(mpResponse.status).json({
        error: mpData.message || "Erro ao criar preferência no Mercado Pago.",
        details: mpData
      });
      return;
    }

    res.status(200).json({
      id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro interno ao criar o checkout.",
      details: String(error.message || error)
    });
  }
};
