import { NextRequest, NextResponse } from "next/server";
import { getZabyServerConfig } from "@/lib/zaby";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, persona = "vedic", messages = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { apiKey, apiOrigin, externalAppId, deploymentId, isConfigured } = getZabyServerConfig();

    if (!isConfigured || !apiKey || !deploymentId) {
      return NextResponse.json(
        {
          error: "Zaby Agent configuration is incomplete in .env",
        },
        { status: 500 }
      );
    }

    // 1. Resolve agent details from deployment ID
    const agentsRes = await fetch(`${apiOrigin}/api/v1/provisioning/agentic-os/agents`, {
      headers: { "x-zaby-api-key": apiKey },
      cache: "no-store",
    });

    if (!agentsRes.ok) {
      throw new Error(`Failed to fetch agents: HTTP ${agentsRes.status}`);
    }

    const agentsData = await agentsRes.json();
    let targetAgentId: string | null = null;
    let workerRuntimeUrl: string | null = null;

    for (const agent of agentsData.items || []) {
      const dep = agent.activeDeployments?.find((d: any) => d.id === deploymentId);
      if (dep) {
        targetAgentId = agent.id;
        if (dep.metadata?.cloudflare?.runtimeUrl) {
          workerRuntimeUrl = dep.metadata.cloudflare.runtimeUrl;
        }
        break;
      }
    }

    if (!targetAgentId) {
      // Default to the first active agent if specific deployment not found
      targetAgentId = agentsData.items?.[0]?.id;
    }

    const encoder = new TextEncoder();

    // 2. If agent has a Cloudflare worker runtime URL, stream via /run/aiui
    if (workerRuntimeUrl && externalAppId) {
      try {
        const tokenRes = await fetch(`${apiOrigin}/api/v1/provisioning/managed-agents/external-apps/${externalAppId}/runtime-tokens`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-zaby-api-key": apiKey,
          },
          body: JSON.stringify({
            deploymentId,
            externalUserId: body.userId || `user-${Date.now()}`,
            channel: "web",
            ttlSeconds: 600,
            maxUses: 50,
          }),
        });

        if (tokenRes.ok) {
          const { token } = await tokenRes.json();
          const workerRes = await fetch(`${workerRuntimeUrl.replace(/\/+$/, "")}/run/aiui`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "text/event-stream",
            },
            body: JSON.stringify({
              input: message,
              persona,
              history: messages.slice(-10),
            }),
          });

          if (workerRes.ok && workerRes.body) {
            const reader = workerRes.body.getReader();
            const decoder = new TextDecoder();

            const forwardStream = new ReadableStream({
              async start(controller) {
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value, { stream: true });
                    for (const line of text.split("\n")) {
                      if (!line.startsWith("data:")) continue;
                      const jsonStr = line.replace(/^data:\s*/, "").trim();
                      if (!jsonStr) continue;

                      try {
                        const eventObj = JSON.parse(jsonStr);
                        if (eventObj.type === "RUN_ERROR") {
                          const errorMsg = eventObj.message || "Agent execution error occurred.";
                          const clientEvent = {
                            event: "TEXT_MESSAGE_CONTENT",
                            data: { delta: `\n\n⚠️ **Notice**: ${errorMsg}` },
                          };
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify(clientEvent)}\n\n`));
                          continue;
                        }

                        let delta = "";
                        if (eventObj.type === "TEXT_MESSAGE_CONTENT") {
                          delta = eventObj.data?.delta || eventObj.data?.content || eventObj.data?.text || eventObj.content || eventObj.text || "";
                        } else if (eventObj.type === "TEXT_DELTA") {
                          delta = eventObj.delta || eventObj.text || "";
                        } else if (typeof eventObj.data === "string") {
                          delta = eventObj.data;
                        }

                        if (delta) {
                          const clientEvent = {
                            event: "TEXT_MESSAGE_CONTENT",
                            data: { delta },
                          };
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify(clientEvent)}\n\n`));
                        }
                      } catch {
                        controller.enqueue(encoder.encode(`${line}\n\n`));
                      }
                    }
                  }
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                  controller.close();
                } catch (err: any) {
                  controller.error(err);
                }
              },
            });

            return new Response(forwardStream, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
              },
            });
          }
        }
      } catch (workerErr) {
        console.warn("Worker stream failed, executing via agent run API...", workerErr);
      }
    }

    // 3. Direct agent execution on Zaby Agentic OS (for Astrobot and backend agents)
    const runRes = await fetch(`${apiOrigin}/api/v1/provisioning/agentic-os/agents/${targetAgentId}/runs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-zaby-api-key": apiKey,
      },
      body: JSON.stringify({
        deploymentId,
        input: {
          message,
          persona,
          history: messages.slice(-10),
        },
      }),
    });

    if (!runRes.ok) {
      const errBody = await runRes.text();
      throw new Error(`Agent run request failed (${runRes.status}): ${errBody}`);
    }

    const runResult = await runRes.json();
    const finalOutput = runResult.finalOutput || runResult.output || "Agent completed run with no output.";

    // Stream the real agent response with natural typing rhythm
    const responseStream = new ReadableStream({
      async start(controller) {
        const words = finalOutput.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? " " : "");
          const sseEvent = {
            event: "TEXT_MESSAGE_CONTENT",
            data: { delta: chunk },
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseEvent)}\n\n`));
          await new Promise((resolve) => setTimeout(resolve, 18));
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event: "TEXT_MESSAGE_END", data: {} })}\n\n`)
        );
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Zaby Chat API Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to communicate with Zaby Agent" },
      { status: error?.status || 500 }
    );
  }
}
