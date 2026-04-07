module.exports = async (req, res) => {
  console.log("Webhook Mercado Pago recebido:", {
    method: req.method,
    query: req.query,
    body: req.body
  });
  res.status(200).json({ ok: true });
};
