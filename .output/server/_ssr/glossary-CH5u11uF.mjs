//#region node_modules/.nitro/vite/services/ssr/assets/glossary-CH5u11uF.js
var EXTRA_GLOSSARY = [];
/**
* AI Glossary — plain-English definitions of the terms founders and builders
* actually run into. Static data, no network calls. Definitions are written
* to be understood in one read; where a term is fuzzy in the industry we say
* so instead of pretending it is precise.
*/
var GLOSSARY_CATEGORIES = [
	"Foundations",
	"Models",
	"SaaS & Startup",
	"No-Code",
	"Design & UI",
	"Data & Analytics",
	"Training",
	"Prompting",
	"Agents",
	"RAG & Memory",
	"Safety & Ethics",
	"Shipping"
];
var ALL_GLOSSARY = [...[
	{
		term: "Artificial Intelligence (AI)",
		category: "Foundations",
		def: "Umbrella term for software that performs tasks we associate with human intelligence — perception, language, planning, prediction."
	},
	{
		term: "Machine Learning (ML)",
		category: "Foundations",
		def: "A subset of AI where programs learn patterns from data instead of being hand-coded with explicit rules."
	},
	{
		term: "Deep Learning",
		category: "Foundations",
		def: "ML using many-layered neural networks; the technique behind modern image, speech and language models."
	},
	{
		term: "Neural Network",
		category: "Foundations",
		def: "A stack of simple mathematical units ('neurons') whose connection weights are tuned during training to map inputs to outputs."
	},
	{
		term: "Parameter",
		category: "Foundations",
		def: "A learned number inside a model. '7B model' means seven billion parameters; more is not automatically better."
	},
	{
		term: "Weight",
		category: "Foundations",
		def: "A parameter that scales how strongly one signal influences another; training adjusts millions to billions of them."
	},
	{
		term: "Bias (parameter)",
		category: "Foundations",
		def: "An extra learned constant added to a neuron's output before activation, letting it fire even with zero input."
	},
	{
		term: "Token",
		category: "Foundations",
		def: "The chunk of text a language model reads and writes — roughly ¾ of a word in English. Pricing and context limits are quoted in tokens."
	},
	{
		term: "Tokenizer",
		category: "Foundations",
		def: "The component that splits text into tokens using a fixed vocabulary; explains why models sometimes miscount letters or characters."
	},
	{
		term: "Context Window",
		category: "Foundations",
		def: "How much text a model can consider at once, measured in tokens. Everything — system prompt, documents, history — shares this budget."
	},
	{
		term: "Embedding",
		category: "Foundations",
		def: "A list of numbers representing meaning so that similar texts land close together; the backbone of search and recommendations."
	},
	{
		term: "Vector",
		category: "Foundations",
		def: "The array of numbers behind an embedding. 'Vector database' just means a store that can find nearest vectors fast."
	},
	{
		term: "Cosine Similarity",
		category: "Foundations",
		def: "A 0-to-1 style score of how aligned two vectors are; the standard way to rank embedding matches."
	},
	{
		term: "Latent Space",
		category: "Foundations",
		def: "The internal coordinate space where a model represents concepts. Nearby points mean similar meanings."
	},
	{
		term: "Inference",
		category: "Foundations",
		def: "Running a trained model to get an output. Training happens once; inference happens on every request and drives your API bill."
	},
	{
		term: "Multimodal",
		category: "Foundations",
		def: "A model that handles more than one data type — text plus images, audio or video — in the same system."
	},
	{
		term: "Foundation Model",
		category: "Foundations",
		def: "A large general-purpose model trained on broad data that gets adapted to many downstream tasks."
	},
	{
		term: "Scaling Law",
		category: "Foundations",
		def: "The observed pattern that model quality improves predictably as you grow parameters, data and compute together."
	},
	{
		term: "Emergent Ability",
		category: "Foundations",
		def: "A capability that appears only at scale and was absent in smaller versions of similar models."
	},
	{
		term: "Benchmark",
		category: "Foundations",
		def: "A standardized test set for comparing models. Scores leak into training data over time, so treat them as one signal, not proof."
	},
	{
		term: "AGI",
		category: "Foundations",
		def: "'Artificial general intelligence' — hypothetical AI matching humans across most cognitive work. A marketing magnet and a research aspiration, not a product today."
	},
	{
		term: "Hallucination",
		category: "Foundations",
		def: "When a model states something false with full confidence, because it generates plausible text rather than verified facts."
	},
	{
		term: "LLM",
		category: "Models",
		def: "Large Language Model — a transformer trained to predict the next token over huge text corpora. The engine behind chatbots and copilots."
	},
	{
		term: "Transformer",
		category: "Models",
		def: "The neural architecture behind nearly all modern LLMs, built around attention instead of recurrence."
	},
	{
		term: "Attention",
		category: "Models",
		def: "The mechanism letting a model weigh every earlier token when producing the next one — how long-range dependencies get handled."
	},
	{
		term: "Self-Attention",
		category: "Models",
		def: "Attention where a sequence relates its own positions to each other, capturing which words matter to which."
	},
	{
		term: "GPT",
		category: "Models",
		def: "'Generative Pre-trained Transformer', OpenAI's LLM family name; also used generically for the architecture style."
	},
	{
		term: "Claude",
		category: "Models",
		def: "Anthropic's family of LLMs, known for long-context reasoning, careful instruction-following and strong writing."
	},
	{
		term: "Gemini",
		category: "Models",
		def: "Google DeepMind's multimodal model family spanning text, image, audio and video inputs."
	},
	{
		term: "Llama",
		category: "Models",
		def: "Meta's open-weight LLM family; the base for many self-hosted and fine-tuned deployments."
	},
	{
		term: "Mistral",
		category: "Models",
		def: "European lab producing efficient open-weight models famous for strong quality-per-parameter."
	},
	{
		term: "Diffusion Model",
		category: "Models",
		def: "Image/video generator that learns by reversing gradual noising; the tech inside Stable Diffusion, Midjourney-style tools and video generators."
	},
	{
		term: "GAN",
		category: "Models",
		def: "Generative Adversarial Network — a generator and a discriminator trained against each other; dominated image generation before diffusion."
	},
	{
		term: "Mixture of Experts (MoE)",
		category: "Models",
		def: "Architecture where only some 'expert' sub-networks activate per token, giving big-model capacity at lower compute."
	},
	{
		term: "Small Language Model (SLM)",
		category: "Models",
		def: "Compact LLMs (roughly under 10B parameters) that run cheaply or on-device with surprisingly usable quality."
	},
	{
		term: "Open Weights",
		category: "Models",
		def: "Model files you can download and run yourself. License still governs commercial use — check it before shipping."
	},
	{
		term: "Whisper",
		category: "Models",
		def: "Open-source speech-to-text model from OpenAI, widely used for transcription pipelines."
	},
	{
		term: "Vision-Language Model (VLM)",
		category: "Models",
		def: "A model that reads images and text together, enabling screenshot understanding, OCR-ish extraction and visual QA."
	},
	{
		term: "Embedding Model",
		category: "Models",
		def: "A model whose whole job is turning text into vectors for search, clustering and dedupe."
	},
	{
		term: "Base Model vs Instruct Model",
		category: "Models",
		def: "A base model completes text; an instruct/chat model is tuned to follow instructions. Building on raw base models needs few-shot tricks."
	},
	{
		term: "Context Distillation",
		category: "Models",
		def: "Training technique where a student model internalizes knowledge a teacher expresses in prompts, shrinking runtime context."
	},
	{
		term: "Quantization",
		category: "Models",
		def: "Storing model numbers in fewer bits (8-bit, 4-bit) so they fit smaller hardware, trading some accuracy."
	},
	{
		term: "Pre-training",
		category: "Training",
		def: "The expensive first phase: learning language by predicting next tokens across trillions of words."
	},
	{
		term: "Fine-tuning",
		category: "Training",
		def: "Continuing to train a pre-trained model on your narrower dataset to shift its style, format or domain skill."
	},
	{
		term: "LoRA",
		category: "Training",
		def: "Low-Rank Adaptation — fine-tunes small adapter matrices instead of all weights, making tuning possible on one GPU."
	},
	{
		term: "QLoRA",
		category: "Training",
		def: "LoRA over a quantized frozen base model; fine-tune big models on modest hardware."
	},
	{
		term: "RLHF",
		category: "Training",
		def: "Reinforcement Learning from Human Feedback — aligns model behavior using human preference rankings between candidate answers."
	},
	{
		term: "RLAIF",
		category: "Training",
		def: "Like RLHF but the preferences come from AI judges instead of paid human raters."
	},
	{
		term: "Constitutional AI",
		category: "Training",
		def: "Anthropic's approach: critique and revise model outputs against a written set of principles rather than raw human labels."
	},
	{
		term: "Instruction Tuning",
		category: "Training",
		def: "Fine-tuning on prompt→response pairs so the model follows instructions instead of merely continuing text."
	},
	{
		term: "Distillation",
		category: "Training",
		def: "Training a small model to imitate a large one's outputs, cutting cost and latency for production."
	},
	{
		term: "Curriculum Learning",
		category: "Training",
		def: "Ordering training examples easy → hard to improve learning stability."
	},
	{
		term: "Overfitting",
		category: "Training",
		def: "Memorizing the training set so well that new inputs perform worse; classic symptom: perfect eval, bad demo."
	},
	{
		term: "Underfitting",
		category: "Training",
		def: "The opposite — model too weak or trained too little to capture the pattern at all."
	},
	{
		term: "Loss Function",
		category: "Training",
		def: "The number measuring how wrong predictions are; training is gradient descent pushing this down."
	},
	{
		term: "Backpropagation",
		category: "Training",
		def: "The algorithm computing how each weight contributed to the error, letting training update them sensibly."
	},
	{
		term: "Learning Rate",
		category: "Training",
		def: "Step size for weight updates. Too high diverges, too low crawls; schedules decay it during training."
	},
	{
		term: "Batch Size",
		category: "Training",
		def: "How many examples are processed per update step; interacts with learning rate and memory limits."
	},
	{
		term: "Epoch",
		category: "Training",
		def: "One full pass over the training dataset. Fine-tuning often uses 1–3 epochs; more invites memorization."
	},
	{
		term: "Data Augmentation",
		category: "Training",
		def: "Synthesizing extra training variety (paraphrases, crops, noise) to reduce overfitting."
	},
	{
		term: "Label Noise",
		category: "Training",
		def: "Errors in training labels; models happily learn mistakes, so dataset hygiene beats fancy tricks."
	},
	{
		term: "Catastrophic Forgetting",
		category: "Training",
		def: "When fine-tuning erases skills the model previously had; mitigate with mixed data or adapters."
	},
	{
		term: "Prompt",
		category: "Prompting",
		def: "Everything you send to the model — instructions, context, examples. Quality in, quality out."
	},
	{
		term: "System Prompt",
		category: "Prompting",
		def: "Hidden instructions defining role, rules and format for the whole conversation; set before user messages."
	},
	{
		term: "Zero-shot",
		category: "Prompting",
		def: "Asking without any examples — relies purely on instructions."
	},
	{
		term: "Few-shot",
		category: "Prompting",
		def: "Including a handful of worked examples in the prompt so the model imitates the pattern."
	},
	{
		term: "Chain-of-Thought (CoT)",
		category: "Prompting",
		def: "Asking the model to reason step-by-step before answering; reliably improves math, logic and multi-step tasks."
	},
	{
		term: "Role Prompting",
		category: "Prompting",
		def: "Assigning a persona ('You are a senior contract lawyer…') to steer vocabulary, depth and priorities."
	},
	{
		term: "Output Formatting",
		category: "Prompting",
		def: "Explicitly pinning structure — markdown tables, numbered sections, JSON schemas — so results parse downstream."
	},
	{
		term: "Structured Output / JSON Mode",
		category: "Prompting",
		def: "API feature forcing responses to valid JSON against your schema; essential when code consumes the reply."
	},
	{
		term: "Prompt Template",
		category: "Prompting",
		def: "A reusable prompt skeleton with {{placeholders}} your app fills at runtime."
	},
	{
		term: "Prompt Injection",
		category: "Prompting",
		def: "Attack where untrusted text (a web page, an email) contains hidden instructions that hijack the model. Treat all external text as hostile."
	},
	{
		term: "Jailbreak",
		category: "Prompting",
		def: "Deliberate prompting to bypass a model's safety rules; why guardrails must be layered, never single-prompt."
	},
	{
		term: "Temperature",
		category: "Prompting",
		def: "Sampling dial: low (0–0.3) for deterministic factual tasks, high (0.7–1) for brainstorming and creative variety."
	},
	{
		term: "Top-p (nucleus sampling)",
		category: "Prompting",
		def: "Alternative randomness control: sample only from the smallest set of tokens covering probability mass p."
	},
	{
		term: "Max Tokens",
		category: "Prompting",
		def: "Hard cap on response length. Set it deliberately — it bounds both cost and rambling."
	},
	{
		term: "Stop Sequence",
		category: "Prompting",
		def: "A string that ends generation early, useful when the model would otherwise continue past your needed output."
	},
	{
		term: "Negative Prompt",
		category: "Prompting",
		def: "In image generation, things to exclude ('no text, no watermark') alongside the positive description."
	},
	{
		term: "Seed",
		category: "Prompting",
		def: "Randomness anchor that makes generations reproducible; fix it while iterating on a prompt."
	},
	{
		term: "Prompt Chaining",
		category: "Prompting",
		def: "Splitting a complex job into sequential prompts, each validating one step — more reliable than one mega-prompt."
	},
	{
		term: "Meta-Prompting",
		category: "Prompting",
		def: "Using a model to write or improve prompts for another model — the 'Improve Prompt' pattern."
	},
	{
		term: "Context Rot",
		category: "Prompting",
		def: "Quality drift in very long conversations; fix with summaries or fresh sessions rather than hoping."
	},
	{
		term: "AI Agent",
		category: "Agents",
		def: "An LLM wrapped in a loop: think → act via tools → observe results → repeat until the goal is met."
	},
	{
		term: "Tool Use / Function Calling",
		category: "Agents",
		def: "Letting the model call your functions (search, calendar, DB query) by emitting structured arguments your code executes."
	},
	{
		term: "ReAct",
		category: "Agents",
		def: "Reason + Act pattern: the model interleaves reasoning traces with tool calls instead of answering blindly."
	},
	{
		term: "Planning",
		category: "Agents",
		def: "Having the agent decompose a goal into steps first; dramatically improves long multi-tool tasks."
	},
	{
		term: "Reflection",
		category: "Agents",
		def: "Agent critiques its own draft and retries — a cheap quality boost when a verifier is unavailable."
	},
	{
		term: "Multi-Agent System",
		category: "Agents",
		def: "Several specialized agents collaborating (researcher, writer, critic). Powerful but harder to debug than one good loop."
	},
	{
		term: "Orchestration",
		category: "Agents",
		def: "The framework layer routing tasks between models, tools and humans — LangChain, custom queues, workflow engines."
	},
	{
		term: "Autonomy Level",
		category: "Agents",
		def: "How much the agent decides without approval. Ship levels: suggest → act-with-confirm → fully autonomous."
	},
	{
		term: "Human-in-the-Loop",
		category: "Agents",
		def: "Design where a person approves consequential actions; still best practice for anything irreversible."
	},
	{
		term: "MCP (Model Context Protocol)",
		category: "Agents",
		def: "Open standard for connecting AI apps to external tools and data sources through one protocol instead of bespoke integrations."
	},
	{
		term: "Computer Use",
		category: "Agents",
		def: "Agents operating real UIs — clicking, typing, scrolling screenshots — for software without APIs."
	},
	{
		term: "Guardrail",
		category: "Agents",
		def: "Code-level checks around a model (input filters, output validators, spend caps) that hold regardless of what the model says."
	},
	{
		term: "Task Decomposition",
		category: "Agents",
		def: "Breaking a job into subtasks an LLM can complete reliably; the difference between demos and dependable products."
	},
	{
		term: "Retry Policy",
		category: "Agents",
		def: "Your plan for failed calls: exponential backoff, fallback models, and a maximum attempt count."
	},
	{
		term: "Idempotency",
		category: "Agents",
		def: "Designing actions so accidental double-execution is safe — vital once agents can trigger real side effects."
	},
	{
		term: "RAG",
		category: "RAG & Memory",
		def: "Retrieval-Augmented Generation: fetch relevant documents at question time and let the model answer grounded in them."
	},
	{
		term: "Vector Database",
		category: "RAG & Memory",
		def: "Storage optimized for similarity search over embeddings — pgvector, Pinecone, Qdrant, Chroma and friends."
	},
	{
		term: "Chunking",
		category: "RAG & Memory",
		def: "Splitting documents into retrievable passages. Chunk size and overlap quietly decide whether RAG works at all."
	},
	{
		term: "Hybrid Search",
		category: "RAG & Memory",
		def: "Combining keyword (BM25) and vector search; catches exact terms embeddings blur away."
	},
	{
		term: "Re-ranking",
		category: "RAG & Memory",
		def: "A second-pass model reorders retrieved chunks by true relevance, sharpening precision before generation."
	},
	{
		term: "Semantic Search",
		category: "RAG & Memory",
		def: "Search by meaning rather than keywords — 'refund policy' matching 'money-back guarantee'."
	},
	{
		term: "Grounding",
		category: "RAG & Memory",
		def: "Tying answers to cited sources so users can verify claims; the main defense against hallucination in products."
	},
	{
		term: "Citation",
		category: "RAG & Memory",
		def: "Pointers from generated claims back to source passages; build them into retrieval UX from day one."
	},
	{
		term: "Short-term Memory",
		category: "RAG & Memory",
		def: "Recent turns kept in the context window; simplest form of conversational continuity."
	},
	{
		term: "Long-term Memory",
		category: "RAG & Memory",
		def: "Persistent facts stored outside the window (profile notes, preferences) and re-injected when relevant."
	},
	{
		term: "Summarization Buffer",
		category: "RAG & Memory",
		def: "Compressing older conversation into a running summary so long chats keep working within token budgets."
	},
	{
		term: "Knowledge Base",
		category: "RAG & Memory",
		def: "Your curated corpus (docs, FAQs, tickets) that retrieval draws from; freshness matters more than size."
	},
	{
		term: "Metadata Filtering",
		category: "RAG & Memory",
		def: "Restricting vector search by attributes (tenant, date, doc type) — mandatory for multi-user systems."
	},
	{
		term: "Alignment",
		category: "Safety & Ethics",
		def: "Making models pursue intended goals and refuse harmful ones — the field RLHF and Constitutional AI belong to."
	},
	{
		term: "Content Moderation",
		category: "Safety & Ethics",
		def: "Classifying user and model content against policy; use provider moderation endpoints plus your own rules."
	},
	{
		term: "PII",
		category: "Safety & Ethics",
		def: "Personally Identifiable Information. Redact before sending third-party APIs and know where it is stored."
	},
	{
		term: "Data Retention",
		category: "Safety & Ethics",
		def: "How long providers keep your prompts. Zero-retention options exist for sensitive workloads — ask before you ship."
	},
	{
		term: "Model Card",
		category: "Safety & Ethics",
		def: "Standardized documentation of a model's training data, limits and intended use; read it before trusting benchmarks."
	},
	{
		term: "Bias (societal)",
		category: "Safety & Ethics",
		def: "Systematic skew in outputs reflecting patterns in training data — accents, genders, regions. Test with diverse probes."
	},
	{
		term: "Red Teaming",
		category: "Safety & Ethics",
		def: "Adversarially attacking your own AI feature before strangers do; document what broke and what now blocks it."
	},
	{
		term: "Watermarking",
		category: "Safety & Ethics",
		def: "Embedding detectable signals in AI-generated media to label provenance; partial but improving."
	},
	{
		term: "Explainability",
		category: "Safety & Ethics",
		def: "Understanding why a model produced an output. Post-hoc explanations help debugging but aren't proof."
	},
	{
		term: "EU AI Act",
		category: "Safety & Ethics",
		def: "EU regulation classifying AI systems by risk tier with obligations for transparency and documentation; affects EU-facing products."
	},
	{
		term: "Consent & Provenance",
		category: "Safety & Ethics",
		def: "Knowing you had the right to train on or feed data to a model, and being able to say where outputs came from."
	},
	{
		term: "Sycophancy",
		category: "Safety & Ethics",
		def: "Models agreeing with users to please them — a known failure mode that corrupts feedback loops and reviews."
	},
	{
		term: "Rate Limit",
		category: "Shipping",
		def: "Provider cap on requests per minute/day. Design for 429s with queuing and backoff before launch day finds out for you."
	},
	{
		term: "Latency",
		category: "Shipping",
		def: "Time to first token plus stream speed. Perceived speed depends on streaming UX as much as raw model speed."
	},
	{
		term: "Streaming (SSE)",
		category: "Shipping",
		def: "Sending tokens as they generate so users watch text appear; the single biggest perceived-quality upgrade."
	},
	{
		term: "Cost per Token",
		category: "Shipping",
		def: "What input/output tokens cost. Cache aggressively, compress prompts, and route easy jobs to cheaper models."
	},
	{
		term: "Model Routing",
		category: "Shipping",
		def: "Sending simple requests to small models and hard ones to frontier models automatically — cuts bills without visible quality loss."
	},
	{
		term: "Fallback Model",
		category: "Shipping",
		def: "Backup model used when the primary errors or rate-limits, keeping the product alive through provider incidents."
	},
	{
		term: "Semantic Cache",
		category: "Shipping",
		def: "Reusing earlier answers for semantically identical questions; big savings, mind staleness and personalization."
	},
	{
		term: "Eval",
		category: "Shipping",
		def: "Automated test of model output quality — golden sets, rubric scoring, LLM-as-judge. Your regression suite for prompts."
	},
	{
		term: "LLM-as-Judge",
		category: "Shipping",
		def: "Using a strong model to score outputs against criteria; scalable review that still needs spot-checking by humans."
	},
	{
		term: "Golden Dataset",
		category: "Shipping",
		def: "Hand-checked input/output pairs representing correct behavior; the reference every prompt or model change is tested against."
	},
	{
		term: "Observability",
		category: "Shipping",
		def: "Logging prompts, completions, latencies and costs per request so failures are diagnosable after the fact."
	},
	{
		term: "Prompt Versioning",
		category: "Shipping",
		def: "Treating prompts as versioned artifacts with tests and changelogs, not strings scattered through code."
	},
	{
		term: "Canary Release",
		category: "Shipping",
		def: "Rolling a new prompt or model to a small traffic slice first, comparing evals before full rollout."
	},
	{
		term: "Vendor Lock-in",
		category: "Shipping",
		def: "Dependency on one provider's quirks and pricing. Mitigate behind an interface and keep a second provider warm."
	},
	{
		term: "On-device AI",
		category: "Shipping",
		def: "Running quantized models locally for privacy, offline use and zero marginal cost — great for small, well-scoped tasks."
	},
	{
		term: "BYOK",
		category: "Shipping",
		def: "'Bring Your Own Key' — users supply their own API keys so your costs stay near zero while they pay their provider directly."
	}
], ...EXTRA_GLOSSARY];
var GLOSSARY_TOTAL = ALL_GLOSSARY.length;
//#endregion
export { GLOSSARY_CATEGORIES as n, GLOSSARY_TOTAL as r, ALL_GLOSSARY as t };
