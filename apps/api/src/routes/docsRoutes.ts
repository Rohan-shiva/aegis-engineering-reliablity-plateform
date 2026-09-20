import { Router, Request, Response } from "express";
import { openapiSpec } from "../docs/openapiSpec";

const router = Router();

router.get("/docs/openapi.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(openapiSpec);
});

router.get("/docs", (req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Aegis API Specification Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body style="margin:0; background:#0f172a; color:#f8fafc;">
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/v1/docs/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis]
    });
  </script>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
});

export default router;
