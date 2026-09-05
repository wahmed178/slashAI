import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas.server-6O_xPNy0.js
/** Server-only helpers for the Build Ideas AI features. */
var MODEL = "anthropic/claude-sonnet-4.5";
var ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
async function askOpenRouter(system, user) {
	const key = processModule.env["OPENROUTER_API_KEY"];
	if (!key) throw new Error("AI is not configured on the server yet.");
	const res = await fetch(ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json",
			"HTTP-Referer": "https://slashai.lovable.app",
			"X-Title": "SlashAI Build Ideas"
		},
		body: JSON.stringify({
			model: MODEL,
			max_tokens: 3e3,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (res.status === 429) throw new Error("AI is rate limited right now. Try again in a minute.");
	if (res.status === 402) throw new Error("The AI account is out of credit.");
	if (!res.ok) throw new Error(`AI request failed (${res.status}).`);
	const text = (await res.json()).choices?.[0]?.message?.content?.trim();
	if (!text) throw new Error("The AI returned an empty response.");
	return text;
}
var SPEC_SYSTEM = "You are a senior product architect. Produce a concise but complete product specification in GitHub-flavoured markdown. Use exactly these H2 sections in this order: Product Overview, Target Users & Roles, Core Features, Required Pages/Screens, Main User Flows, Database Entities, Auth Requirements, Payment Requirements, Recommended Integrations, MVP Scope. Then a final H2 section named 'Lovable Prompt' containing one fenced code block holding a single paste-ready prompt (second person, imperative, self-contained, no markdown headings inside) that instructs an AI app builder to build the MVP. Be specific and avoid filler.";
var VALIDATE_SYSTEM = "You are a pragmatic startup analyst. Reply with ONLY minified JSON matching this shape: {\"problemClarity\":{\"score\":number,\"notes\":string},\"targetCustomer\":{\"customer\":string,\"notes\":string},\"competition\":{\"level\":\"Low\"|\"Medium\"|\"High\",\"notes\":string},\"monetization\":{\"score\":number,\"notes\":string},\"buildDifficulty\":{\"score\":number,\"notes\":string},\"acquisitionDifficulty\":{\"score\":number,\"notes\":string},\"differentiation\":[string,string,string],\"overallScore\":number,\"recommendation\":\"Build\"|\"Improve First\"|\"Avoid\",\"reason\":string}. Scores are 1-10 integers. No markdown, no code fences.";
function specPrompt(payload) {
	return [
		`Product: ${payload.title}`,
		`Pitch: ${payload.short}`,
		`Problem: ${payload.problem}`,
		`Target users: ${payload.targetUsers}`,
		`Solution: ${payload.solution}`,
		`Key features: ${payload.keyFeatures.join("; ")}`,
		`MVP features: ${payload.mvpFeatures.join("; ")}`,
		`Suggested stack: ${payload.techStack.join(", ")}`,
		`Business model: ${payload.businessModel}`,
		`Build type: ${payload.buildType}`
	].join("\n");
}
//#endregion
export { specPrompt as i, VALIDATE_SYSTEM as n, askOpenRouter as r, SPEC_SYSTEM as t };
