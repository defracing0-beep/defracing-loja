# DeFracing - Projeto de teste do Checkout Pro

## Como usar no Vercel

1. Suba estes arquivos no GitHub.
2. No Vercel, abra o projeto.
3. Vá em **Settings > Environment Variables**.
4. Crie estas variáveis:

- `MP_ACCESS_TOKEN` = seu Access Token de produção do Mercado Pago
- `SITE_URL` = URL atual do site na Vercel  
  Exemplo: `https://defracing-loja.vercel.app`

5. Faça um novo deploy.

## Importante
- Não coloque o Access Token dentro do GitHub.
- O repositório está público: deixe o token só nas variáveis do Vercel.
- O item atual é um pedido de teste de R$ 10,00.
- Para trocar nome e valor, edite `api/create-preference.js`.

## Páginas
- `/` = formulário e botão do checkout
- `/success` = pagamento aprovado
- `/pending` = pagamento pendente
- `/failure` = pagamento não concluído
