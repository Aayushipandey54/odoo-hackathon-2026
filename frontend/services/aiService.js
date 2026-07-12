/**
 * AI Service — Groq-primary engine with robust local mock fallback.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `You are AssetFlow AI, an advanced enterprise workflow assistant integrated into an operational management platform.

You assist developers, operations teams, and executives with highly structured, context-aware, and actionable responses.

RESPONSE BEHAVIOR:
- ALWAYS respond in properly formatted Markdown.
- Use headings (## Topic) to section your response.
- Use bullet points, bold text, and step-by-step breakdowns for clarity.
- Keep responses concise, structured, and highly readable.
- Prioritize ChatGPT-like readability over long unstructured blocks.

strict rules:
- Format cleanly with Markdown.
- No raw or broken markdown markers.
- No long unstructured paragraphs.
- No generic AI phrases.
- No hallucinated data.`;

// Local mock response database based on role quick questions and queries
const getMockResponse = (message, role) => {
  const q = message.toLowerCase();
  
  if (role === 'operations') {
    if (q.includes('latency') || q.includes('bottleneck') || q.includes('slack')) {
      return `## Active Process Bottleneck Alerts

The system has flagged the following pipelines:

*   **API Routing Node B-2:** Latency at **480ms** (exceeds SLA limit of 200ms)
*   **SSO Auth Pipeline:** Queue saturation at **82%**

### Recommended Action Items
1.  **Failover routing:** Trigger dynamic fallback paths.
2.  **Resource scale:** Scale node clusters using CLI options.`;
    }
    return `## Operations Command Center

Operations diagnostics are healthy:
*   **Integrations:** Slack Webhooks, Teams Connector, API Gateways active.
*   **Security:** IAM Policies enforced, SSL active.

*Specify any operational dashboard query you wish to execute.*`;
  }

  if (role === 'executives') {
    if (q.includes('throughput') || q.includes('metrics') || q.includes('report') || q.includes('cost')) {
      return `## Executive Metrics & Performance Report

### System Operations Summary
*   **Average process speed:** **18.4ms** (-4.2ms from last week)
*   **Daily Token Throughput:** **12,480,000** transactions
*   **Uptime SLA Met:** **99.98%** compliance

### Key Actions
*   **Resource efficiency:** Optimization suggestions saved **14%** compute cost.`;
    }
    return `## Executive Report Center

All business unit parameters are in normal bounds.
*   **Active Billing Nodes:** 3 active subscriptions.
*   **Integration Saturation:** SLA targets met.

*Specify any analytical query or report you wish to pull.*`;
  }

  // Default: developers role
  if (q.includes('deploy') || q.includes('workflow')) {
    return `## Deploying Workflows in AssetFlow

Deploy a workflow via CLI or the pipeline interface:

*   **Step 1:** Define the workflow in \`assetflow.yaml\`
*   **Step 2:** Test logic in the local sandbox: \`assetflow dev\`
*   **Step 3:** Deploy to cluster: \`assetflow deploy\`

### Next Steps
Monitor the deployment live in the *Deployment Analytics* dashboard.`;
  }
  if (q.includes('mock') || q.includes('sandbox') || q.includes('setup')) {
    return `## Sandbox Setup

Use our isolated sandbox container to run integrations:

1.  Initialize mock environment: \`assetflow sandbox init\`
2.  Simulate events: \`assetflow sandbox trigger <event-id>\`
3.  Review logs on local port \`8080\`.`;
  }
  if (q.includes('schema') || q.includes('api') || q.includes('error')) {
    return `## API Integration Console

As a developer, you have access to:
*   **Intelligent API Builder:** Direct API path generator.
*   **Automated Testing:** AI-generated integration tests.
*   **Sandbox Environments:** Containerized test cells.

*What setup would you like to initialize?*`;
  }

  return `## Concept Breakdown: ${message}

Here is a quick concept resolution:

1.  **Core Idea:** Enterprise systems perform best when structured. Fragmentation leads to friction.
2.  **Application:** Use **AssetFlow** modules (such as Workflow Builder, Notification Routing, and Sandbox Integrations) to organize your automation stack.
3.  **Next Step:** Check out the *Features* or *Pricing* pages to get started with an active workspace setup.`;
};

// Response Cleaner
const cleanResponse = (text) => {
  if (!text) return "I couldn't generate a response.";
  let cleaned = text.trim();
  if (cleaned.length > 3000) {
    cleaned = cleaned.substring(0, 3000) + '\n\n_[Response trimmed for readability]_';
  }
  return cleaned;
};

/**
 * Send a message to the AI engine.
 */
export const sendMessage = async (message, history = [], role = 'developers', contextData = {}, contextChunks = []) => {
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!groqKey) {
    // Graceful, high-quality local response fallback if no API key is set
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockResponse(message, role));
      }, 1000); // Simulate thinking delay
    });
  }

  let contextStr = `User Role: ${role}\nContext Data: ${JSON.stringify(contextData)}`;
  if (contextChunks.length > 0) {
    contextStr += `\n\nRELEVANT CONTEXT:\n${contextChunks.join('\n---\n')}`;
  }

  const formattedHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : 'user',
    content: msg.text
  }));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: contextStr },
    ...formattedHistory,
    { role: "user", content: message }
  ];

  try {
    return await callGroq(groqKey, messages, GROQ_MODEL);
  } catch (primaryErr) {
    console.warn('Primary model failed, trying fallback:', primaryErr.message);
    try {
      return await callGroq(groqKey, messages, GROQ_FALLBACK_MODEL);
    } catch (fallbackErr) {
      console.warn('Groq API call failed, running local backup generator:', fallbackErr);
      return getMockResponse(message, role);
    }
  }
};

async function callGroq(apiKey, messages, model) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        model,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
        stream: false
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawResponse = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
    return cleanResponse(rawResponse);
  } finally {
    clearTimeout(timeout);
  }
}
