export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Aegis Engineering Reliability Platform API",
    version: "1.0.0",
    description:
      "REST API documentation for Aegis: telemetry monitoring, microservices mesh, RAG vector store, autonomous ReAct AI agent, and remediation playbooks.",
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
      description: "Local Development API Server",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Check API Health Status",
        responses: {
          "200": {
            description: "API server is online and healthy.",
          },
        },
      },
    },
    "/system/status": {
      get: {
        summary: "Retrieve System Component Diagnostics",
        responses: {
          "200": {
            description: "Live component diagnostic status for API, WebSocket, RAG vector store, and AI engine.",
          },
        },
      },
    },
    "/rag/search": {
      post: {
        summary: "Execute 1536-dim Vector Similarity Search",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: { type: "string", example: "Postgres connection pool exhaustion" },
                  topK: { type: "number", example: 3 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Ranked document vector matches with cosine similarity confidence scores.",
          },
        },
      },
    },
    "/ai/investigate": {
      post: {
        summary: "Trigger Autonomous ReAct AI Incident Investigation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  targetIncidentCode: { type: "string", example: "INC-8092" },
                  targetServiceName: { type: "string", example: "auth-identity-svc" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Investigation completed with ReAct reasoning traces, hypotheses ranking, and source citations.",
          },
        },
      },
    },
    "/remediation/actions": {
      get: {
        summary: "List Active Remediation Playbook Actions",
        responses: {
          "200": {
            description: "Array of queued and executed mitigation actions.",
          },
        },
      },
      post: {
        summary: "Queue New Remediation Action",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  incidentId: { type: "string", example: "INC-8492" },
                  serviceName: { type: "string", example: "payment-checkout-svc" },
                  actionType: { type: "string", example: "rollback_deployment" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Remediation action created with safety guardrail risk flags.",
          },
        },
      },
    },
  },
};
