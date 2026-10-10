// Comprehensive Career Blueprint Curricula for CareerMitra
export const careerClusters = [
  {
    id: "ai-data",
    name: "AI & Data Science",
    icon: "🌌",
    color: "#8b5cf6", // Purple
    glow: "rgba(139, 92, 246, 0.4)",
    description: "Machine Learning, LLMs, Computer Vision, Big Data & Neural Systems"
  },
  {
    id: "fullstack",
    name: "Full-Stack & Systems",
    icon: "⚡",
    color: "#3b82f6", // Blue
    glow: "rgba(59, 130, 246, 0.4)",
    description: "Modern Web, Distributed Microservices, High-Performance Systems & Mobile"
  },
  {
    id: "cloud-devops",
    name: "Cloud & Platform Eng",
    icon: "☁️",
    color: "#06b6d4", // Cyan
    glow: "rgba(6, 182, 212, 0.4)",
    description: "Kubernetes, Cloud Infrastructure, CI/CD Automations & Site Reliability"
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity & Trust",
    icon: "🛡️",
    color: "#ef4444", // Crimson Red
    glow: "rgba(239, 68, 68, 0.4)",
    description: "Penetration Testing, Cryptography, SecOps, Zero Trust & Cloud Defense"
  },
  {
    id: "product-design",
    name: "Product & UX Strategy",
    icon: "🎨",
    color: "#ec4899", // Pink
    glow: "rgba(236, 72, 153, 0.4)",
    description: "Design Systems, User Research, Product Architecture & Growth Metrics"
  },
  {
    id: "fintech-web3",
    name: "FinTech & Web3",
    icon: "💎",
    color: "#10b981", // Emerald Green
    glow: "rgba(16, 185, 129, 0.4)",
    description: "Algorithmic Systems, Smart Contracts, Quantitative Finance & Defi"
  }
];

export const defaultCareers = [
  {
    id: "ai-engineer",
    title: "AI & Machine Learning Engineer",
    cluster: "ai-data",
    clusterName: "AI & Data Science",
    icon: "🧠",
    tagline: "Build neural architectures, fine-tune LLMs, and deploy production ML systems.",
    salaryRange: "$130k - $210k / yr",
    growthRate: "+38% (High Demand)",
    demand: "Extremely High",
    difficulty: "Advanced",
    avgMonths: 7,
    radarStats: {
      math: 88,
      coding: 90,
      systems: 78,
      mlCore: 95,
      cloud: 80,
      product: 65
    },
    skillsTree: [
      {
        phaseId: 1,
        phaseTitle: "Phase 1: Mathematical Foundations & Python Core",
        phaseDesc: "Build rigorous grounding in linear algebra, probability, and high-performance Python.",
        skills: [
          {
            id: "py-scientific",
            title: "Scientific Python & Vectorization (NumPy, Pandas)",
            level: "Foundational",
            estHours: 28,
            tags: ["Python", "NumPy", "Pandas", "Data Wrangling"],
            description: "Master multi-dimensional array manipulation, broadcasting, vectorization, and data frame transformation at scale.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "Official NumPy Vectorization Guide", url: "https://numpy.org/doc/stable/user/basics.indexing.html" },
              { type: "course", title: "Python for Data Analysis by Wes McKinney", url: "https://wesmckinney.com/book/" },
              { type: "lab", title: "Kaggle Python & Pandas Micro-Course", url: "https://www.kaggle.com/learn" }
            ],
            project: {
              title: "Vectorized Market Volatility & Algorithmic Signal Engine",
              brief: "Build a pure NumPy financial time-series pipeline calculating rolling EMA, volatility surfaces, and risk ratios without loops.",
              deliverables: ["Vectorized computation benchmarking vs vanilla Python", "Handling missing irregular tick data", "Visualizing risk profiles with Matplotlib"]
            },
            quiz: [
              {
                question: "What is the primary performance benefit of NumPy array vectorization?",
                options: ["It runs in the Python bytecode interpreter", "It leverages C-level contiguous memory and SIMD instructions", "It compiles to GPU CUDA code automatically", "It consumes more dynamic heap memory"],
                correctIndex: 1,
                explanation: "NumPy vectorization executes compiled C/Fortran loops over contiguous memory blocks using SIMD CPU vector extensions, bypassing Python interpreter overhead."
              },
              {
                question: "Which operation creates a view rather than a full copy in NumPy?",
                options: ["array.copy()", "Fancy indexing with boolean masks", "Simple slice indexing like array[1:5]", "array.flatten()"],
                correctIndex: 2,
                explanation: "Basic slicing in NumPy returns a memory view of the original buffer, whereas advanced/boolean indexing produces a brand new copy."
              },
              {
                question: "What Pandas function is most efficient for merging two datasets on time-series proximity?",
                options: ["pd.concat()", "pd.merge_asof()", "pd.pivot_table()", "pd.DataFrame.join()"],
                correctIndex: 1,
                explanation: "pd.merge_asof matches rows based on nearest or backward/forward keys, ideal for aligning high-frequency asynchronous market ticks."
              }
            ]
          },
          {
            id: "math-foundations",
            title: "Linear Algebra & Multivariable Calculus for ML",
            level: "Foundational",
            estHours: 32,
            tags: ["Math", "Linear Algebra", "Calculus", "Optimization"],
            description: "Deep dive into matrix decomposition (SVD, Eigendecomposition), partial derivatives, Jacobians, and gradient descent optimization.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "Essence of Linear Algebra by 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_or" },
              { type: "course", title: "Mathematics for Machine Learning (Imperial College)", url: "https://mml-book.com" },
              { type: "lab", title: "Interactive Matrix Transformations", url: "https://immersivemath.com/ila/index.html" }
            ],
            project: {
              title: "From-Scratch Gradient Descent & Matrix Factorization",
              brief: "Implement Adam and RMSProp gradient descent optimizers and low-rank matrix decomposition from scratch.",
              deliverables: ["Symbolic vs numerical gradient verification", "Eigenvalue convergence visualization", "Zero ML-library dependencies"]
            },
            quiz: [
              {
                question: "In Singular Value Decomposition (SVD) of matrix A = U Σ V^T, what do the diagonal elements of Σ represent?",
                options: ["Eigenvectors of A", "Singular values representing variance magnitude along orthogonal principal axes", "Inverted scale factors", "Matrix rank determinants"],
                correctIndex: 1,
                explanation: "The diagonal entries of Σ are singular values, ordered in descending scale, quantifying the variance accounted for by each component."
              },
              {
                question: "Why does the Adam optimizer generally converge faster than standard Stochastic Gradient Descent (SGD)?",
                options: ["It removes the learning rate parameter", "It computes the exact second derivative Hessian", "It computes adaptive learning rates using first and second moment estimations", "It runs synchronously across threads"],
                correctIndex: 2,
                explanation: "Adam keeps exponentially decaying averages of past gradients (momentum) and past squared gradients (uncentered variance), providing adaptive per-parameter learning rates."
              },
              {
                question: "What is the Jacobian matrix?",
                options: ["A matrix of all first-order partial derivatives of a vector-valued function", "The determinant of a quadratic form", "The inverse of the Hessian matrix", "A matrix of second-order cross derivatives"],
                correctIndex: 0,
                explanation: "The Jacobian represents all first-order partial derivatives of a vector-valued function with respect to input vectors."
              }
            ]
          }
        ]
      },
      {
        phaseId: 2,
        phaseTitle: "Phase 2: Deep Learning & Neural Architectures",
        phaseDesc: "Construct convolutional networks, sequence models, and modern Transformer attention mechanisms.",
        skills: [
          {
            id: "pytorch-deep-learning",
            title: "PyTorch & Custom Neural Networks",
            level: "Intermediate",
            estHours: 35,
            tags: ["PyTorch", "Backpropagation", "Autograd", "CNNs"],
            description: "Build custom torch.nn.Module architectures, understand computational graphs, Autograd internals, and train GPU-accelerated networks.",
            prerequisites: ["py-scientific", "math-foundations"],
            resources: [
              { type: "docs", title: "Official PyTorch Tutorials & Recipes", url: "https://pytorch.org/tutorials/" },
              { type: "course", title: "Deep Learning Specialization (Andrew Ng)", url: "https://www.coursera.org/specializations/deep-learning" },
              { type: "lab", title: "Google Colab Free GPU Environment", url: "https://colab.research.google.com" }
            ],
            project: {
              title: "Multi-Modal ResNet & Vision Classifier with Grad-CAM",
              brief: "Train a custom ResNet architecture with learning rate scheduling, mixed precision (AMP), and visual Grad-CAM saliency maps.",
              deliverables: ["Custom Dataset and DataLoader with augmentation", "Automatic Mixed Precision (torch.cuda.amp)", "Validation F1 score >= 92%"]
            },
            quiz: [
              {
                question: "What does torch.no_grad() do during inference?",
                options: ["Deletes trained weights to save RAM", "Disables the autograd gradient computation engine, saving GPU memory and speed", "Converts model to INT8 quantization", "Freezes only the bias tensors"],
                correctIndex: 1,
                explanation: "torch.no_grad() disables gradient tracking across the computational graph, preventing allocation of memory for backward pass graphs."
              },
              {
                question: "Why is Batch Normalization beneficial during deep network training?",
                options: ["It removes the need for activation functions", "It stabilizes layer inputs by normalizing mean and variance, reducing internal covariate shift", "It automatically selects optimal hyperparameter sweeps", "It eliminates dropout layers"],
                correctIndex: 1,
                explanation: "Batch Normalization mitigates vanishing/exploding gradients and stabilizes hidden layer activations by normalizing mini-batch distributions."
              },
              {
                question: "What is the key role of the torch.optim.lr_scheduler.CosineAnnealingLR scheduler?",
                options: ["It resets weights to zero periodically", "It smoothly decays the learning rate following a cosine curve towards a minimum value", "It doubles learning rate when loss plateaus", "It runs stochastic weight averaging only"],
                correctIndex: 1,
                explanation: "Cosine Annealing smoothly reduces the learning rate following a cosine curve, helping the optimizer escape shallow sub-optimal local minima."
              }
            ]
          },
          {
            id: "transformers-attention",
            title: "Transformer Architecture & Self-Attention Mechanics",
            level: "Intermediate",
            estHours: 40,
            tags: ["Transformers", "Attention", "BERT", "GPT", "NLP"],
            description: "Implement multi-head scaled dot-product attention, positional encodings, encoder-decoder pipelines, and tokenizers from ground up.",
            prerequisites: ["pytorch-deep-learning"],
            resources: [
              { type: "docs", title: "The Illustrated Transformer by Jay Alammar", url: "https://jalammar.github.io/illustrated-transformer/" },
              { type: "course", title: "Hugging Face NLP Course (Open Source)", url: "https://huggingface.co/learn/nlp-course" },
              { type: "lab", title: "Building GPT from Scratch (Andrej Karpathy)", url: "https://github.com/karpathy/nanoGPT" }
            ],
            project: {
              title: "Mini-GPT: Generative Decoder Transformer",
              brief: "Construct a 10M parameter autoregressive decoder transformer with causal self-attention, trained on Shakespeare or code snippets.",
              deliverables: ["Custom MultiHeadAttention module", "RoPE (Rotary Position Embeddings) or sinusoidal embeddings", "Top-k and Top-p nucleus sampling generator"]
            },
            quiz: [
              {
                question: "In scaled dot-product attention Attention(Q, K, V) = softmax((QK^T) / sqrt(d_k)) V, why do we divide by sqrt(d_k)?",
                options: ["To ensure the output dimension matches V", "To prevent large dot product magnitudes from pushing softmax into extremely small gradient regions", "To normalize token length", "To invert the key matrix"],
                correctIndex: 1,
                explanation: "For large d_k, dot products grow large in magnitude, causing the softmax function to have tiny gradients (vanishing gradient problem). Scaling prevents this."
              },
              {
                question: "What makes causal/masked self-attention critical for autoregressive language models like GPT?",
                options: ["It speeds up tokenization", "It masks future tokens with -inf before softmax to prevent the model from looking ahead", "It forces bidirectional contextualization", "It compresses embedding dimensions"],
                correctIndex: 1,
                explanation: "Causal masking prevents current positions from attending to future tokens, ensuring strict next-token prediction."
              },
              {
                question: "What is the primary advantage of FlashAttention over vanilla self-attention?",
                options: ["It removes the need for Key tensors", "It restructures attention computation into GPU SRAM tiles to avoid expensive HBM memory reads/writes", "It approximates attention using linear projection", "It eliminates positional encoding"],
                correctIndex: 1,
                explanation: "FlashAttention organizes computation to fit into fast on-chip GPU SRAM, reducing memory read/write overhead by O(N) factor."
              }
            ]
          }
        ]
      },
      {
        phaseId: 3,
        phaseTitle: "Phase 3: Fine-Tuning, LLMs & Retrieval Augmented Generation (RAG)",
        phaseDesc: "Master LoRA/QLoRA parameter-efficient fine-tuning, vector embeddings, and enterprise hybrid RAG pipelines.",
        skills: [
          {
            id: "lora-qlora-finetuning",
            title: "Parameter-Efficient Fine-Tuning (PEFT, LoRA & QLoRA)",
            level: "Advanced",
            estHours: 35,
            tags: ["LoRA", "QLoRA", "PEFT", "Quantization", "vLLM"],
            description: "Fine-tune open-weight models (Llama 3, Mistral) using low-rank adaptors, 4-bit NormalFloat quantization, and evaluate catastrophic forgetting.",
            prerequisites: ["transformers-attention"],
            resources: [
              { type: "docs", title: "Hugging Face PEFT Library Docs", url: "https://huggingface.co/docs/peft" },
              { type: "course", title: "Fine-Tuning Large Language Models (DeepLearning.AI)", url: "https://www.deeplearning.ai" },
              { type: "lab", title: "Unsloth Fast Fine-Tuning Notebooks", url: "https://github.com/unslothai/unsloth" }
            ],
            project: {
              title: "Domain-Specialized Code Intelligence LLM via QLoRA",
              brief: "Fine-tune Llama 3 8B on custom API documentation using QLoRA; deploy with vLLM OpenAI-compatible inference server.",
              deliverables: ["Rank r=16, alpha=32 target module tuning", "Evaluation using perplexity and benchmark pass@1", "vLLM high-throughput deployment"]
            },
            quiz: [
              {
                question: "How does LoRA (Low-Rank Adaptation) drastically reduce GPU memory during fine-tuning?",
                options: ["It converts all 32-bit floats to 1-bit integers", "It freezes the original pretrained weights W and trains small low-rank decomposed matrices A and B where ΔW = B x A", "It discards attention heads", "It prunes 90% of model layers"],
                correctIndex: 1,
                explanation: "LoRA freezes original weights W (d x k) and injects trainable rank decomposition matrices A (r x k) and B (d x r) where r << min(d, k), reducing trainable parameters by 99%."
              },
              {
                question: "What is NF4 in QLoRA?",
                options: ["NormalFloat 4-bit, an information-theoretically optimal quantile quantization for normally distributed weights", "Near Field 4-channel communication protocol", "Neural Filter layer 4", "New Foundation 4-layer architecture"],
                correctIndex: 0,
                explanation: "NF4 builds on Quantile Quantization to ensure each 4-bit bin has an equal number of values from an assumed normal distribution, minimizing quantization error."
              },
              {
                question: "What is 'catastrophic forgetting' in model fine-tuning?",
                options: ["GPU hardware cache memory crash", "When a model loses its generalized reasoning and prior knowledge while learning a specialized domain", "Failure of gradient accumulation", "Loss of tokenizer vocabulary"],
                correctIndex: 1,
                explanation: "Catastrophic forgetting occurs when new weight updates overwrite neural activations critical for broader generalized tasks."
              }
            ]
          },
          {
            id: "advanced-rag-vector",
            title: "Advanced RAG & Vector Search Engines",
            level: "Advanced",
            estHours: 32,
            tags: ["RAG", "Embeddings", "ChromaDB", "Milvus", "Hybrid Search", "Reranking"],
            description: "Architect production retrieval pipelines with semantic chunking, dense + sparse BM25 hybrid search, and cross-encoder re-ranking.",
            prerequisites: ["transformers-attention"],
            resources: [
              { type: "docs", title: "Pinecone / ChromaDB Vector Indexing Guide", url: "https://docs.trychroma.com" },
              { type: "course", title: "Building Production-Ready RAG (LlamaIndex)", url: "https://docs.llamaindex.ai" },
              { type: "lab", title: "Cohere Rerank API & Cross-Encoders", url: "https://cohere.com/rerank" }
            ],
            project: {
              title: "Enterprise Multi-Document Cognitive Knowledge Agent",
              brief: "Build an end-to-end RAG system with document citation verification, Cohere/BGE cross-encoder reranking, and hallucination guardrails.",
              deliverables: ["Hierarchical recursive chunking strategy", "Reciprocal Rank Fusion (RRF) combining dense & BM25", "Hallucination guardrail evaluation pipeline"]
            },
            quiz: [
              {
                question: "What is the primary benefit of Hybrid Search (Dense + Sparse BM25)?",
                options: ["It doubles the vector dimension", "Dense search captures semantic meaning, while sparse BM25 captures exact keywords like part numbers, error codes, and acronyms", "It removes the need for vector databases", "It reduces latency by 90%"],
                correctIndex: 1,
                explanation: "Dense vectors capture contextual semantics but frequently fail on rare exact tokens (serial codes, acronyms), which sparse keyword search (BM25) excels at."
              },
              {
                question: "Why use a Cross-Encoder for reranking instead of Bi-Encoder embeddings?",
                options: ["Cross-encoders are 100x faster", "Cross-encoders process query and candidate document together via full self-attention, capturing deep cross-interaction", "Cross-encoders pre-compute vectors offline", "Bi-encoders cannot handle text longer than 10 words"],
                correctIndex: 1,
                explanation: "A cross-encoder processes (query, doc) simultaneously through transformer layers, yielding much higher relevance scoring than cosine distance of independent bi-encoder vectors."
              },
              {
                question: "What does Reciprocal Rank Fusion (RRF) calculate?",
                options: ["GPU cooling fan rotation speed", "A combined score based on ranks across multiple retriever lists: RRF = sum(1 / (k + rank_i))", "The Euclidean distance between embeddings", "The loss of the cross-entropy objective"],
                correctIndex: 1,
                explanation: "RRF merges ranked results from distinct retrieval systems without requiring score normalization by summing inverted ranks."
              }
            ]
          }
        ]
      },
      {
        phaseId: 4,
        phaseTitle: "Phase 4: Production MLOps, Serving & Distributed Scale",
        phaseDesc: "Deploy scalable inference microservices with Triton, Docker, Ray, monitoring, and automated drift detection.",
        skills: [
          {
            id: "mlops-serving-scale",
            title: "High-Throughput ML Serving (Triton, vLLM, Docker)",
            level: "Production Master",
            estHours: 36,
            tags: ["MLOps", "vLLM", "Docker", "Triton", "FastAPI", "Prometheus"],
            description: "Deploy models with continuous batching, PagedAttention, TensorRT-LLM, model registry, Prometheus metrics, and drift monitoring.",
            prerequisites: ["lora-qlora-finetuning", "advanced-rag-vector"],
            resources: [
              { type: "docs", title: "NVIDIA Triton Inference Server Documentation", url: "https://docs.nvidia.com/deeplearning/triton-inference-server" },
              { type: "course", title: "Full Stack Deep Learning Course", url: "https://fullstackdeeplearning.com" },
              { type: "lab", title: "vLLM Distributed Serving Benchmarks", url: "https://docs.vllm.ai" }
            ],
            project: {
              title: "Distributed Low-Latency LLM Serving Cluster",
              brief: "Architect an autoscaling cluster running vLLM with streaming server-sent events (SSE), Prometheus token latency metrics, and Canary deployment.",
              deliverables: ["Dockerized microservice with health checks", "Token-per-second and TTFT (time-to-first-token) telemetry", "Stress testing with Locust / k6 achieving 500+ QPS"]
            },
            quiz: [
              {
                question: "What is PagedAttention pioneered by vLLM?",
                options: ["A web pagination tool for training data", "An algorithm that manages KV cache memory using virtual memory paging concepts, eliminating KV cache fragmentation", "A method to split prompts into book pages", "A CUDA compiler flag"],
                correctIndex: 1,
                explanation: "PagedAttention allocates non-contiguous physical memory blocks for the KV cache like OS virtual memory, reducing memory waste from 70% to near 4%."
              },
              {
                question: "What is Concept Drift in production machine learning systems?",
                options: ["When code is migrated to a new Python version", "When the statistical properties of the target variable and real-world relationship to features shift over time", "When the server clock drifts", "When model file weights get corrupted"],
                correctIndex: 1,
                explanation: "Concept drift occurs when the underlying statistical relationship between input features and target labels changes in the real world."
              },
              {
                question: "What does Time To First Token (TTFT) measure in LLM serving?",
                options: ["Total training duration", "The latency elapsed from sending prompt until the first generated response token is streamed back to client", "Tokenization disk I/O time", "Network packet round-trip time"],
                correctIndex: 1,
                explanation: "TTFT measures the prompt processing and prefill phase latency before output streaming starts, directly impacting perceived user responsiveness."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "fullstack-architect",
    title: "Full-Stack Web Architect",
    cluster: "fullstack",
    clusterName: "Full-Stack & Systems",
    icon: "⚡",
    tagline: "Engineer high-scale reactive applications, micro-frontends, robust APIs, and distributed data systems.",
    salaryRange: "$120k - $190k / yr",
    growthRate: "+26% (Steady High)",
    demand: "High",
    difficulty: "Intermediate to Advanced",
    avgMonths: 6,
    radarStats: {
      math: 60,
      coding: 95,
      systems: 92,
      mlCore: 50,
      cloud: 85,
      product: 88
    },
    skillsTree: [
      {
        phaseId: 1,
        phaseTitle: "Phase 1: Modern TypeScript, DOM & State Systems",
        phaseDesc: "Advanced TypeScript types, modern DOM performance, and reactive state stores.",
        skills: [
          {
            id: "ts-deep-dive",
            title: "Advanced TypeScript & Type-Level Programming",
            level: "Foundational",
            estHours: 25,
            tags: ["TypeScript", "Generics", "Type Systems", "AST"],
            description: "Master conditional types, template literal types, mapped types, infer keyword, and building type-safe APIs.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "TypeScript Official Handbook", url: "https://www.typescriptlang.org/docs/" },
              { type: "course", title: "Total TypeScript by Matt Pocock", url: "https://www.totaltypescript.com" },
              { type: "lab", title: "Type Hero Challenges", url: "https://typehero.dev" }
            ],
            project: {
              title: "Zero-Dependency Type-Safe Schema Validator & ORM Query Builder",
              brief: "Construct a Zod-like schema inference engine and SQL query builder with compile-time type validation.",
              deliverables: ["Recursive type inferencing", "Runtime validation with custom issue formatting", "100% test coverage"]
            },
            quiz: [
              {
                question: "What does the `infer` keyword in TypeScript conditional types do?",
                options: ["Forces compiler to convert any to unknown", "Introduces a variable to be deduced from another type during pattern matching", "Bypasses strict null checks", "Imports types dynamically"],
                correctIndex: 1,
                explanation: "The `infer` keyword allows declaring a type variable within a conditional type extends clause to extract parts of composite types."
              },
              {
                question: "What is the key difference between `unknown` and `any` in TypeScript?",
                options: ["`unknown` is type-safe and requires narrowing before operations, while `any` disables all type-checking", "`any` is faster to compile", "`unknown` cannot hold objects", "`unknown` only accepts strings"],
                correctIndex: 0,
                explanation: "`unknown` forces developers to perform type guards/assertions before accessing properties, keeping type safety intact."
              },
              {
                question: "What is a Discriminated Union?",
                options: ["A union of types that each share a common literal property used by TypeScript to narrow down the specific type", "A union of number and string", "A type that throws compile errors on duplicates", "An enum with unique IDs"],
                correctIndex: 0,
                explanation: "A discriminated union features a common discriminant property (e.g. `type: 'success' | 'error'`) enabling safe switch/if narrowing."
              }
            ]
          },
          {
            id: "react-internals",
            title: "React Architecture, Concurrent Features & SSR",
            level: "Intermediate",
            estHours: 30,
            tags: ["React", "Virtual DOM", "Fiber", "Hooks", "SSR"],
            description: "Understand React Fiber reconciler, concurrent transitions, useSyncExternalStore, streaming SSR, and suspense architecture.",
            prerequisites: ["ts-deep-dive"],
            resources: [
              { type: "docs", title: "React Official Documentation", url: "https://react.dev" },
              { type: "course", title: "Epic React by Kent C. Dodds", url: "https://epicreact.dev" },
              { type: "lab", title: "Build Your Own React (Didact)", url: "https://pomb.us/build-your-own-react/" }
            ],
            project: {
              title: "Mini-React Virtual DOM & Fiber Reconciler",
              brief: "Implement a micro-React engine with createElement, fiber tree work loop, requestIdleCallback scheduling, and hooks.",
              deliverables: ["Fiber linked list traversal", "Diffing algorithm with key reconciliation", "Functional component state hook"]
            },
            quiz: [
              {
                question: "What was the fundamental goal of the React Fiber architecture rewrite?",
                options: ["To replace JavaScript with WebAssembly", "To allow incremental rendering and the ability to pause, abort, or prioritize work across frames", "To eliminate the need for JSX", "To force class components"],
                correctIndex: 1,
                explanation: "Fiber restructured reconciliation into cooperative units of work so heavy rendering can be paused to avoid blocking the main UI thread."
              },
              {
                question: "Why should external store subscriptions use `useSyncExternalStore` instead of `useEffect`?",
                options: ["To avoid React batching", "To prevent visual 'tearing' where components render with inconsistent store snapshots during concurrent rendering", "It runs synchronously on the server", "It saves CSS memory"],
                correctIndex: 1,
                explanation: "`useSyncExternalStore` guarantees consistent, non-torn reads across all components during concurrent interruptions."
              },
              {
                question: "What is the purpose of `useDeferredValue`?",
                options: ["It defers network fetches to background workers", "It defers updating a non-urgent part of the UI to keep high-priority input responsive", "It delays component unmounting", "It replaces setTimeout"],
                correctIndex: 1,
                explanation: "`useDeferredValue` allows urgent updates (like typing in a text field) to render immediately while deferring slow downstream UI updates."
              }
            ]
          }
        ]
      },
      {
        phaseId: 2,
        phaseTitle: "Phase 2: Scalable Backend Services & Database Design",
        phaseDesc: "Distributed Node/Go backends, PostgreSQL index tuning, ACID transactions, and Redis caching.",
        skills: [
          {
            id: "distributed-node-apis",
            title: "Node.js Event Loop, Async Architecture & REST/GraphQL",
            level: "Intermediate",
            estHours: 30,
            tags: ["Node.js", "Libuv", "Event Loop", "Streams", "GraphQL"],
            description: "Deep dive into libuv event loop phases, worker threads, backpressure handling in Node streams, and high-performance microservices.",
            prerequisites: ["ts-deep-dive"],
            resources: [
              { type: "docs", title: "Node.js Event Loop & Timers Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" },
              { type: "course", title: "Node.js Design Patterns (Mario Casciaro)", url: "https://www.nodejsdesignpatterns.com" },
              { type: "lab", title: "Event Loop Visualizer", url: "https://vault.thecodebarbarian.com/event-loop-visualizer" }
            ],
            project: {
              title: "High-Throughput Streaming File Transformer & ETL Service",
              brief: "Construct a streaming microservice that processes multi-gigabyte CSVs, applies transformations with worker threads, and uploads to S3.",
              deliverables: ["Pipeline stream with backpressure controls", "Worker thread CPU offloading", "Zero memory overflow on 5GB files"]
            },
            quiz: [
              {
                question: "In what phase of the Node.js event loop does process.nextTick() callbacks execute?",
                options: ["In the Poll phase", "Immediately after the current operation finishes, before the event loop advances to any other phase", "In the Close callbacks phase", "Inside worker threads only"],
                correctIndex: 1,
                explanation: "`process.nextTick()` is technically not part of the libuv event loop phases; its queue is drained immediately after current synchronous code finishes."
              },
              {
                question: "What occurs when a readable stream emits faster than a writable stream can consume without backpressure handling?",
                options: ["Data is dropped silently", "Internal buffer grows unboundedly leading to out-of-memory crashes", "The network port closes", "Node spawns auto threads"],
                correctIndex: 1,
                explanation: "Without backpressure, buffering data in memory when consumer is slow causes process RSS memory explosion and eventual crash."
              },
              {
                question: "Which libuv phase executes setTimeout callbacks?",
                options: ["Timers phase", "Check phase", "Poll phase", "Pending I/O phase"],
                correctIndex: 0,
                explanation: "The Timers phase inspects min-heaps of scheduled timers and executes expired timer callbacks."
              }
            ]
          },
          {
            id: "sql-postgres-architecture",
            title: "PostgreSQL, Relational Modeling & Index Optimization",
            level: "Intermediate",
            estHours: 28,
            tags: ["PostgreSQL", "SQL", "B-Tree", "Transactions", "Isolation"],
            description: "Master EXPLAIN ANALYZE, B-Tree vs GIN indexes, transaction isolation levels (Read Committed, Repeatable Read, Serializable), and connection pooling.",
            prerequisites: ["distributed-node-apis"],
            resources: [
              { type: "docs", title: "Use The Index, Luke (SQL Indexing Guide)", url: "https://use-the-index-luke.com" },
              { type: "course", title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net" },
              { type: "lab", title: "PostgreSQL Exercises Interactive", url: "https://pgexercises.com" }
            ],
            project: {
              title: "FinTech Ledger with ACID Guarantees & Concurrency Tests",
              brief: "Build a double-entry financial ledger service with strict balance invariant checks under high-concurrency race conditions.",
              deliverables: ["Row-level locking (`SELECT FOR UPDATE`)", "Optimistic concurrency versioning", "Load test proving zero balance anomalies"]
            },
            quiz: [
              {
                question: "What is the difference between a clustered and non-clustered index in SQL databases?",
                options: ["Clustered indexes are on remote servers", "A clustered index determines the physical storage order of rows in the table; only one can exist per table", "Non-clustered indexes cannot have duplicate keys", "Clustered indexes only work with UUIDs"],
                correctIndex: 1,
                explanation: "The clustered index defines the physical order of table data on disk, which is why a table can have only one clustered index."
              },
              {
                question: "What database anomaly does 'Repeatable Read' isolation prevent that 'Read Committed' allows?",
                options: ["Dirty reads", "Non-repeatable reads (where reading the same row twice in one transaction yields different values)", "Deadlocks", "Syntax errors"],
                correctIndex: 1,
                explanation: "Under Read Committed, another committed transaction can change row values between your reads. Repeatable Read ensures you read a consistent snapshot."
              },
              {
                question: "When should you use a GIN (Generalized Inverted Index) in PostgreSQL?",
                options: ["For primary keys", "For indexing composite values like JSONB, full-text search, and array containment queries", "For auto-incrementing integers", "For small tables (<100 rows)"],
                correctIndex: 1,
                explanation: "GIN indexes excel at mapping individual elements (words in full-text, keys/values in JSONB, items in arrays) to matching rows."
              }
            ]
          }
        ]
      },
      {
        phaseId: 3,
        phaseTitle: "Phase 3: System Design, Caching & Message Queues",
        phaseDesc: "Architect resilient systems with Redis caching patterns, Kafka/RabbitMQ events, and microservices.",
        skills: [
          {
            id: "system-design-microservices",
            title: "Microservices Architecture & Event-Driven Systems",
            level: "Advanced",
            estHours: 35,
            tags: ["System Design", "Kafka", "Redis", "Event-Driven", "Idempotency"],
            description: "Design distributed architectures: Saga pattern, CQRS, event sourcing, idempotent consumers, Redis caching strategies (Cache-Aside, Write-Through).",
            prerequisites: ["sql-postgres-architecture"],
            resources: [
              { type: "docs", title: "System Design Primer by Donne Martin", url: "https://github.com/donnemartin/system-design-primer" },
              { type: "course", title: "Microservices Patterns by Chris Richardson", url: "https://microservices.io" },
              { type: "lab", title: "ByteByteGo System Design Visuals", url: "https://bytebytego.com" }
            ],
            project: {
              title: "Distributed Ticket Reservation System (High-Concurrency)",
              brief: "Architect a flash-sale ticketing engine handling 50k RPS with Redis distributed locks (Redlock), RabbitMQ queues, and fallback queues.",
              deliverables: ["Idempotent payment webhook consumer", "Redis distributed lock with lease expiration", "Graceful degradation under failure"]
            },
            quiz: [
              {
                question: "What is the primary benefit of the Saga Pattern over 2-Phase Commit (2PC) in distributed microservices?",
                options: ["It eliminates the need for compensation transactions", "It provides eventual consistency across independent service databases without locking resources over long-running distributed transactions", "It forces synchronous HTTP communication", "It guarantees immediate linearizability"],
                correctIndex: 1,
                explanation: "2PC holds locks across network boundaries and creates single points of failure. Sagas coordinate local transactions with compensating actions, improving availability."
              },
              {
                question: "What is the 'Cache Stampede' (or thundering herd) problem?",
                options: ["When cache memory is completely full", "When an expired high-traffic cache key triggers thousands of simultaneous requests to hammer the backend database at once", "When Redis master node fails over", "When network bandwidth is throttled"],
                correctIndex: 1,
                explanation: "When a popular key expires, simultaneous concurrent requests all miss cache and concurrently compute the expensive database query."
              },
              {
                question: "How do you achieve idempotency in message consumer processing?",
                options: ["By setting infinite timeouts", "By using a unique deduplication message key stored in a persistent store or unique database constraint", "By disabling retries", "By restarting the broker"],
                correctIndex: 1,
                explanation: "Checking a unique message/transaction ID before execution and recording processed IDs prevents duplicate execution upon retries."
              }
            ]
          }
        ]
      },
      {
        phaseId: 4,
        phaseTitle: "Phase 4: Production Observability, CI/CD & Security",
        phaseDesc: "Deploy containerized apps with Docker, Kubernetes, zero-downtime blue/green deploys, and OpenTelemetry.",
        skills: [
          {
            id: "fullstack-production-deploy",
            title: "Production Infrastructure, Docker, CI/CD & Observability",
            level: "Production Master",
            estHours: 30,
            tags: ["Docker", "Kubernetes", "CI/CD", "OpenTelemetry", "Security"],
            description: "Multi-stage Docker builds, Kubernetes pods & ingress, GitHub Actions pipelines, OpenTelemetry distributed tracing, and OWASP security hardening.",
            prerequisites: ["system-design-microservices"],
            resources: [
              { type: "docs", title: "OWASP Top Ten Web Application Security", url: "https://owasp.org/www-project-top-ten/" },
              { type: "course", title: "Kubernetes The Hard Way by Kelsey Hightower", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way" },
              { type: "lab", title: "Play with Docker Interactive Sandbox", url: "https://labs.play-with-docker.com" }
            ],
            project: {
              title: "Zero-Downtime Multi-Region Production Deployment Pipeline",
              brief: "Set up automated GitHub Actions workflow building hardened Docker images, running security scans (Trivy), and deploying to Kubernetes with OpenTelemetry.",
              deliverables: ["Multi-stage Dockerfile (<50MB image size)", "Distributed trace propagation with OpenTelemetry & Jaeger", "Zero-downtime rolling update configuration"]
            },
            quiz: [
              {
                question: "Why should production containers NOT run as the root user?",
                options: ["To prevent compilation warnings", "To reduce attack surface: if an attacker achieves container escape, they won't gain root privileges on the host system", "Root containers use double the memory", "Docker forbids root in version 20+"],
                correctIndex: 1,
                explanation: "Running as non-root mitigates the catastrophic impact of container breakouts and privilege escalation exploits."
              },
              {
                question: "What is the difference between a Kubernetes Liveness Probe and Readiness Probe?",
                options: ["They are identical", "Liveness restarts the container if it fails; Readiness stops traffic routing to the container until it's healthy", "Readiness probe terminates the pod", "Liveness only checks CPU usage"],
                correctIndex: 1,
                explanation: "Liveness probe catches deadlocks and restarts pods. Readiness probe determines if the pod is initialized and ready to accept network traffic."
              },
              {
                question: "What is Cross-Site Request Forgery (CSRF) and its primary defense?",
                options: ["Stealing cookies via JavaScript; defended by Content-Security-Policy", "Tricking an authenticated user's browser into sending unauthorized commands; defended by SameSite cookies and anti-CSRF tokens", "Injecting SQL statements; defended by ORMs", "Flooding bandwidth; defended by Cloudflare"],
                correctIndex: 1,
                explanation: "CSRF exploits ambient credentials (cookies). SameSite=Lax/Strict cookie attributes and cryptographically signed anti-CSRF tokens prevent it."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "cloud-platform-engineer",
    title: "Cloud & Platform Engineer",
    cluster: "cloud-devops",
    clusterName: "Cloud & Platform Eng",
    icon: "☁️",
    tagline: "Architect immutable cloud infrastructure, manage Kubernetes clusters, and automate enterprise CI/CD.",
    salaryRange: "$125k - $200k / yr",
    growthRate: "+32% (Very High)",
    demand: "Very High",
    difficulty: "Advanced",
    avgMonths: 7,
    radarStats: {
      math: 55,
      coding: 80,
      systems: 96,
      mlCore: 45,
      cloud: 98,
      product: 70
    },
    skillsTree: [
      {
        phaseId: 1,
        phaseTitle: "Phase 1: Linux Internals, Networking & Bash Automation",
        phaseDesc: "Deep Linux OS kernel concepts, cgroups, namespaces, eBPF, and TCP/IP network troubleshooting.",
        skills: [
          {
            id: "linux-networking-core",
            title: "Linux Kernel Internals, Namespaces & Networking",
            level: "Foundational",
            estHours: 30,
            tags: ["Linux", "Bash", "Namespaces", "cgroups", "TCP/IP"],
            description: "Understand cgroups v2, network namespaces, iptables, DNS resolution path, systemd services, and performance tuning with sysctl.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "Linux Journey (Free Interactive Tutorial)", url: "https://linuxjourney.com" },
              { type: "course", title: "Brendan Gregg Systems Performance", url: "https://www.brendangregg.com/sysperf.html" },
              { type: "lab", title: "OverTheWire Bandit Security/Linux Wargames", url: "https://overthewire.org/wargames/bandit/" }
            ],
            project: {
              title: "Build a Container Runtime from Scratch in Bash/Go",
              brief: "Create an isolated container runtime using Linux unshare, clone, chroot, and cgroups to constrain CPU and memory.",
              deliverables: ["Process PID isolation via unshare", "Memory restriction to 100MB with cgroups", "Virtual Ethernet veth pair network isolation"]
            },
            quiz: [
              {
                question: "Which Linux kernel feature provides process resource limiting (CPU, RAM, I/O)?",
                options: ["Linux Namespaces", "Control Groups (cgroups)", "SELinux policies", "Systemd timers"],
                correctIndex: 1,
                explanation: "cgroups regulate and allocate hardware resources like CPU, memory, and disk I/O, while namespaces provide isolation of views (PID, mount, net)."
              },
              {
                question: "What Linux command is used to inspect active socket connections and TCP states?",
                options: ["ls -la", "ss -tulpn", "ps aux", "df -h"],
                correctIndex: 1,
                explanation: "`ss` (socket statistics) dumps socket details and is the modern faster replacement for `netstat`."
              },
              {
                question: "What does MTU stand for in networking, and what is the standard Ethernet value?",
                options: ["Maximum Transmission Unit, typically 1500 bytes", "Minimum Time Unit, 1000 ms", "Multi Thread Unit, 64 bytes", "Memory Transfer Utility, 4096 bytes"],
                correctIndex: 0,
                explanation: "Maximum Transmission Unit is the largest packet or frame size (usually 1500 bytes for Ethernet) that can be sent in a single network transaction without fragmentation."
              }
            ]
          }
        ]
      },
      {
        phaseId: 2,
        phaseTitle: "Phase 2: Infrastructure as Code (Terraform) & Cloud Architecture",
        phaseDesc: "Terraform modules, state management, AWS/GCP architecture, and security policies.",
        skills: [
          {
            id: "terraform-cloud-iac",
            title: "Terraform, OpenTofu & Immutable Infrastructure",
            level: "Intermediate",
            estHours: 32,
            tags: ["Terraform", "AWS", "GCP", "IaC", "State Locking"],
            description: "Build reusable Terraform modules, remote state locking with DynamoDB/S3, drift detection, and multi-environment architecture.",
            prerequisites: ["linux-networking-core"],
            resources: [
              { type: "docs", title: "HashiCorp Terraform Documentation", url: "https://developer.hashicorp.com/terraform/docs" },
              { type: "course", title: "Terraform Up & Running (Yevgeniy Brikman)", url: "https://www.terraformupandrunning.com" },
              { type: "lab", title: "LocalStack: Local Cloud Emulator", url: "https://localstack.cloud" }
            ],
            project: {
              title: "Enterprise Multi-Region AWS VPC with Auto-Healing ASG",
              brief: "Write Terraform modules defining redundant multi-AZ VPCs, private subnets, NAT gateways, and auto-scaling EC2 instances with zero hardcoded credentials.",
              deliverables: ["State locking with S3 and DynamoDB", "Validation with tfsec and checkov", "Dynamic environment workspaces"]
            },
            quiz: [
              {
                question: "Why is remote state locking critical in team environments using Terraform?",
                options: ["It encrypts the disk partition", "It prevents simultaneous applies from corrupting the state file", "It automatically commits code to GitHub", "It bypasses AWS API rate limits"],
                correctIndex: 1,
                explanation: "State locking prevents concurrent operations on the same state file, protecting against race conditions that cause resource drift or corruption."
              },
              {
                question: "What is the difference between `terraform plan` and `terraform apply`?",
                options: ["They perform the exact same action", "`plan` creates an execution preview without making changes, while `apply` executes the planned changes against the cloud provider", "`plan` deletes unused resources", "`apply` only validates syntax"],
                correctIndex: 1,
                explanation: "`terraform plan` determines what actions are necessary to achieve the desired state without modifying real infrastructure."
              },
              {
                question: "What is Terraform Drift?",
                options: ["Network packet loss", "When real-world cloud infrastructure changes out-of-band without being recorded in the Terraform state or configuration", "Code formatting differences", "DNS propagation delay"],
                correctIndex: 1,
                explanation: "Drift happens when manual changes (e.g. AWS console edits) cause the real cloud state to diverge from the code repository."
              }
            ]
          }
        ]
      },
      {
        phaseId: 3,
        phaseTitle: "Phase 3: Kubernetes Administration & GitOps",
        phaseDesc: "Production K8s orchestration, Helm charts, ArgoCD, service meshes, and custom operators.",
        skills: [
          {
            id: "kubernetes-gitops",
            title: "Kubernetes Orchestration & ArgoCD GitOps",
            level: "Advanced",
            estHours: 42,
            tags: ["Kubernetes", "ArgoCD", "Helm", "Istio", "Ingress"],
            description: "Deploy and manage stateful sets, daemon sets, ingress controllers, custom resource definitions (CRDs), and automated GitOps sync with ArgoCD.",
            prerequisites: ["terraform-cloud-iac"],
            resources: [
              { type: "docs", title: "Kubernetes Official Docs & Tasks", url: "https://kubernetes.io/docs/home/" },
              { type: "course", title: "Certified Kubernetes Administrator (CKA) Guide", url: "https://www.cncf.io/certification/cka/" },
              { type: "lab", title: "Killercoda Interactive Kubernetes Scenarios", url: "https://killercoda.com" }
            ],
            project: {
              title: "Production GitOps Delivery Pipeline with Canary Releases",
              brief: "Set up a local k3d/minikube cluster managed by ArgoCD that performs progressive canary deployments with Argo Rollouts and Prometheus metrics.",
              deliverables: ["Helm chart packaging", "ArgoCD Application CRD configuration", "Automated rollback on elevated HTTP 5xx error rate"]
            },
            quiz: [
              {
                question: "What is the fundamental philosophy of GitOps?",
                options: ["Writing all scripts in Git syntax", "Using Git repositories as the single source of truth for declarative infrastructure and applications, with automated reconciliation", "Hosting Kubernetes master nodes on GitHub", "Committing compiled binary files to Git"],
                correctIndex: 1,
                explanation: "In GitOps, declarative configuration stored in Git defines the desired state, and agents like ArgoCD automatically synchronize clusters to match Git."
              },
              {
                question: "What is an Ingress Controller in Kubernetes?",
                options: ["A firewall hardware device", "An application (e.g. NGINX, Traefik) that watches Ingress resources and configures load-balancing reverse proxy rules for incoming HTTP/S traffic", "A master node scheduler", "A DNS server plugin"],
                correctIndex: 1,
                explanation: "The ingress controller translates Kubernetes Ingress resources into reverse proxy routing rules and TLS termination."
              },
              {
                question: "Why use a StatefulSet instead of a Deployment for databases in Kubernetes?",
                options: ["Deployments do not support containers", "StatefulSets provide stable, persistent network identifiers, ordered graceful deployment/scaling, and dedicated PersistentVolumeClaims per pod", "StatefulSets do not consume memory", "Deployments cannot mount disks"],
                correctIndex: 1,
                explanation: "StatefulSets guarantee unique ordinal pod names (db-0, db-1) and bind dedicated volume storage that survives pod reschedule."
              }
            ]
          }
        ]
      },
      {
        phaseId: 4,
        phaseTitle: "Phase 4: Site Reliability Engineering (SRE) & Chaos Testing",
        phaseDesc: "SLOs/SLIs, error budgets, Grafana dashboards, alert routing, and chaos engineering.",
        skills: [
          {
            id: "sre-chaos-observability",
            title: "SRE Practices, Prometheus, Grafana & Chaos Engineering",
            level: "Production Master",
            estHours: 35,
            tags: ["SRE", "SLO/SLI", "Prometheus", "Grafana", "Chaos Mesh"],
            description: "Define Service Level Objectives (SLOs) and error budgets, PromQL alerting rules, Grafana visualizations, and inject chaos faults.",
            prerequisites: ["kubernetes-gitops"],
            resources: [
              { type: "docs", title: "Google Site Reliability Engineering Books (Free)", url: "https://sre.google/books/" },
              { type: "course", title: "Prometheus Monitoring & Alerting Guide", url: "https://prometheus.io/docs/introduction/overview/" },
              { type: "lab", title: "Chaos Mesh: Chaos Engineering Platform", url: "https://chaos-mesh.org" }
            ],
            project: {
              title: "Enterprise Observability & Automated Chaos Injection Suite",
              brief: "Configure a complete Prometheus + Grafana stack monitoring Kubernetes cluster health, define burn-rate alerting for a 99.9% SLO, and run Chaos Mesh network latency tests.",
              deliverables: ["PromQL multi-window burn rate alert rule", "Custom Grafana dashboard with Golden Signals (Latency, Traffic, Errors, Saturation)", "Chaos testing report documenting system resilience"]
            },
            quiz: [
              {
                question: "What are Google's Four Golden Signals in Site Reliability Engineering?",
                options: ["Speed, Security, Scale, Storage", "Latency, Traffic, Errors, and Saturation", "CPU, RAM, Disk, and Network", "Uptime, Downtime, Backup, and Recovery"],
                correctIndex: 1,
                explanation: "The Four Golden Signals are Latency (how long it takes), Traffic (demand/RPS), Errors (rate of failing requests), and Saturation (fullness of subsystem resources)."
              },
              {
                question: "What is an 'Error Budget'?",
                options: ["Money allocated to fixing bugs", "The allowable amount of unreliability (100% minus the SLO target) that a service can tolerate before feature releases are halted to prioritize stability", "The penalty paid to cloud providers", "Unused server capacity"],
                correctIndex: 1,
                explanation: "An error budget quantifies acceptable downtime/errors. For a 99.9% SLO, the error budget is 0.1%, balancing innovation pace with operational reliability."
              },
              {
                question: "What is the purpose of Chaos Engineering?",
                options: ["To randomly delete database records in production", "To proactively experiment and inject controlled faults into systems to uncover weaknesses before they trigger real-world catastrophic outages", "To test uncompiled code", "To confuse attackers"],
                correctIndex: 1,
                explanation: "Chaos engineering tests system resilience by injecting realistic network partitions, packet loss, and node crashes in controlled environments."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "cybersecurity-specialist",
    title: "Cybersecurity & Ethical Hacker",
    cluster: "cybersecurity",
    clusterName: "Cybersecurity & Trust",
    icon: "🛡️",
    tagline: "Uncover zero-day vulnerabilities, audit cryptographic protocols, and defend cloud perimeters.",
    salaryRange: "$120k - $215k / yr",
    growthRate: "+35% (Critical Shortage)",
    demand: "Extremely High",
    difficulty: "Advanced",
    avgMonths: 7,
    radarStats: {
      math: 75,
      coding: 82,
      systems: 95,
      mlCore: 55,
      cloud: 88,
      product: 60
    },
    skillsTree: [
      {
        phaseId: 1,
        phaseTitle: "Phase 1: Security Fundamentals & Offensive Tooling",
        phaseDesc: "Network reconnaissance, Wireshark packet capture, Burp Suite, and Python exploit scripts.",
        skills: [
          {
            id: "recon-offensive-basics",
            title: "Network Reconnaissance, Wireshark & Burp Suite",
            level: "Foundational",
            estHours: 28,
            tags: ["Networking", "Wireshark", "Nmap", "Burp Suite", "Recon"],
            description: "Master OSI model security flaws, packet dissection with Wireshark, active port scanning with Nmap, and HTTP proxy manipulation with Burp Suite.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "Nmap Network Scanning Guide by Gordon Lyon", url: "https://nmap.org/book/" },
              { type: "course", title: "PortSwigger Web Security Academy (Free High Quality)", url: "https://portswigger.net/web-security" },
              { type: "lab", title: "TryHackMe Pre-Security & Offensive Pathway", url: "https://tryhackme.com" }
            ],
            project: {
              title: "Automated Attack Surface Recon & Vulnerability Scanner",
              brief: "Build a Python recon tool automating subdomain enumeration, DNS resolution, banner grabbing, and open port profiling with report output.",
              deliverables: ["Asynchronous DNS discovery", "Banner grabbing and service fingerprinting", "JSON vulnerability telemetry report"]
            },
            quiz: [
              {
                question: "What is an Nmap SYN Stealth Scan (-sS)?",
                options: ["A scan that completes the 3-way TCP handshake and logs in", "A scan that sends SYN packets and records SYN-ACK or RST responses without completing the full handshake, minimizing logging", "A scan that uses UDP only", "A scan that changes MAC address"],
                correctIndex: 1,
                explanation: "SYN stealth scanning sends a SYN packet, receives SYN/ACK indicating an open port, then immediately sends RST so the connection is never fully established."
              },
              {
                question: "What does Burp Suite Repeater do?",
                options: ["It reboots web servers", "It allows modifying individual captured HTTP requests and resending them repeatedly to analyze server responses", "It records mouse clicks", "It generates passwords"],
                correctIndex: 1,
                explanation: "Burp Repeater allows security engineers to manually edit headers, parameters, and bodies and observe nuances in backend responses."
              },
              {
                question: "In Wireshark, what filter shows all DNS queries and responses?",
                options: ["ip.addr == 8.8.8.8", "dns", "http.request", "tcp.port == 443"],
                correctIndex: 1,
                explanation: "Typing `dns` into the display filter expression isolates all DNS protocol frames."
              }
            ]
          }
        ]
      },
      {
        phaseId: 2,
        phaseTitle: "Phase 2: Web Application Security & OWASP Top 10",
        phaseDesc: "SQL Injection, SSRF, Cross-Site Scripting (XSS), IDOR, and authentication bypasses.",
        skills: [
          {
            id: "owasp-web-penetration",
            title: "Web App Penetration Testing (OWASP Top 10)",
            level: "Intermediate",
            estHours: 35,
            tags: ["OWASP", "XSS", "SQLi", "SSRF", "IDOR", "JWT"],
            description: "Deep exploitation and mitigation of Server-Side Request Forgery (SSRF), SQL Injection (Union, Blind), Stored/DOM XSS, and broken access controls.",
            prerequisites: ["recon-offensive-basics"],
            resources: [
              { type: "docs", title: "OWASP Testing Guide (WSTG)", url: "https://owasp.org/www-project-web-security-testing-guide/" },
              { type: "course", title: "Hack The Box Academy", url: "https://academy.hackthebox.com" },
              { type: "lab", title: "OWASP Juice Shop Vulnerable Application", url: "https://owasp.org/www-project-juice-shop/" }
            ],
            project: {
              title: "Comprehensive Web Application Penetration Test Report",
              brief: "Audit a deliberately vulnerable multi-tier application (Juice Shop or Damn Vulnerable Web App), extract flags, and write an executive remediation audit report.",
              deliverables: ["Proof-of-concept exploits for SSRF and SQLi", "CVSS v3.1 severity score ratings", "Actionable mitigation code patches"]
            },
            quiz: [
              {
                question: "What makes Server-Side Request Forgery (SSRF) particularly dangerous in cloud environments (e.g. AWS EC2)?",
                options: ["It slows down client browsers", "It can allow attackers to query internal cloud metadata endpoints (e.g. 169.254.169.254) to steal IAM credentials", "It deletes domain names", "It changes CSS fonts"],
                correctIndex: 1,
                explanation: "SSRF forces the server to make requests to internal network services. In AWS, querying IMDSv1 can expose temporary IAM credentials."
              },
              {
                question: "What is the definitive defense against SQL Injection?",
                options: ["Blacklisting the word OR and UNION", "Parameterized queries / prepared statements which separate query code from user data", "URL encoding", "Using Base64"],
                correctIndex: 1,
                explanation: "Prepared statements treat user input strictly as literal values rather than executable SQL syntax, completely neutralising injection."
              },
              {
                question: "What is an Insecure Direct Object Reference (IDOR)?",
                options: ["A programming language memory leak", "When an application exposes an internal object key/ID directly to users without verifying authorization privileges", "A broken CSS image link", "A duplicate pointer"],
                correctIndex: 1,
                explanation: "IDOR occurs when an endpoint accepts user-supplied identifiers (e.g. `/api/invoices/1234`) without verifying if the caller owns or is authorized to view that record."
              }
            ]
          }
        ]
      },
      {
        phaseId: 3,
        phaseTitle: "Phase 3: Cryptography, Identity & Zero Trust Architecture",
        phaseDesc: "PKI certificates, AES-GCM, TLS 1.3 handshakes, OAuth2/OIDC, and Zero Trust security.",
        skills: [
          {
            id: "cryptography-zero-trust",
            title: "Applied Cryptography, PKI & Zero Trust Security",
            level: "Advanced",
            estHours: 35,
            tags: ["Cryptography", "TLS 1.3", "Zero Trust", "OAuth2", "PKI"],
            description: "Master symmetric/asymmetric algorithms (AES-GCM, RSA, ECC/Ed25519), Diffie-Hellman key exchanges, Certificate Authorities, and Zero Trust micro-segmentation.",
            prerequisites: ["owasp-web-penetration"],
            resources: [
              { type: "docs", title: "Crypto101 by Laurens Van Houtven", url: "https://www.crypto101.io" },
              { type: "course", title: "Stanford Cryptography I (Dan Boneh)", url: "https://www.coursera.org/learn/crypto" },
              { type: "lab", title: "Cryptopals Crypto Challenges", url: "https://cryptopals.com" }
            ],
            project: {
              title: "End-to-End Encrypted Messaging Protocol with Forward Secrecy",
              brief: "Implement a cryptographic ratchet protocol (inspired by Signal) featuring X3DH key agreement, Double Ratchet, and message authentication codes.",
              deliverables: ["Forward secrecy and post-compromise security", "HMAC message integrity verification", "Zero plaintext leak validation"]
            },
            quiz: [
              {
                question: "What security property does 'Perfect Forward Secrecy' (PFS) provide in TLS?",
                options: ["Passwords are saved permanently", "Compromise of a server's long-term private key in the future does not compromise past recorded session keys", "Fast certificate renewal", "Guaranteed 100% uptime"],
                correctIndex: 1,
                explanation: "With PFS (using ephemeral Diffie-Hellman key exchange), each session negotiates a unique temporary key. If the master key is leaked later, historical traffic cannot be decrypted."
              },
              {
                question: "Why should AES-GCM (Galois/Counter Mode) be favored over AES-CBC or AES-ECB?",
                options: ["It requires shorter keys", "It provides Authenticated Encryption with Associated Data (AEAD), guaranteeing both confidentiality and tamper-proof integrity", "It doesn't use math", "It only encrypts strings"],
                correctIndex: 1,
                explanation: "AES-GCM is an AEAD mode that provides simultaneous cryptographic confidentiality and message integrity tag verification, preventing padding oracle attacks."
              },
              {
                question: "What is the core tenet of Zero Trust Architecture?",
                options: ["Block all users forever", "'Never Trust, Always Verify': all actors and requests, internal or external, must be continuously authenticated, authorized, and validated", "Trust anyone inside the corporate VPN", "Disable all firewalls"],
                correctIndex: 1,
                explanation: "Zero Trust abandons the perimeter model, treating all requests inside or outside the network as potentially hostile and requiring continuous validation."
              }
            ]
          }
        ]
      },
      {
        phaseId: 4,
        phaseTitle: "Phase 4: Cloud Security & Incident Response (Blue Team)",
        phaseDesc: "SIEM analytics, threat hunting with Splunk, cloud IAM guardrails, and digital forensics.",
        skills: [
          {
            id: "cloud-sec-incident-response",
            title: "Cloud Threat Hunting, SIEM & Incident Response",
            level: "Production Master",
            estHours: 35,
            tags: ["SIEM", "Splunk", "AWS GuardDuty", "Forensics", "MITRE ATT&CK"],
            description: "Map attacker behaviors to the MITRE ATT&CK framework, construct SIEM detection rules in Splunk/Elastic, investigate memory dumps, and contain cloud breaches.",
            prerequisites: ["cryptography-zero-trust"],
            resources: [
              { type: "docs", title: "MITRE ATT&CK Enterprise Matrix", url: "https://attack.mitre.org" },
              { type: "course", title: "SANS Cyber Incident Response Handbook", url: "https://www.sans.org" },
              { type: "lab", title: "CyberDefenders Blue Team CTF Challenges", url: "https://cyberdefenders.org" }
            ],
            project: {
              title: "Automated Cloud Breach Triage & Quarantine Playbook",
              brief: "Develop an automated incident response pipeline that ingests AWS GuardDuty alerts, quarantines compromised EC2 instances into forensic security groups, and snapshots memory for Volatility analysis.",
              deliverables: ["Automated containment workflow", "Volatility memory analysis extract report", "Post-mortem breach timeline document"]
            },
            quiz: [
              {
                question: "What is the MITRE ATT&CK framework?",
                options: ["A software firewall", "A globally accessible curated knowledge base of adversary tactics, techniques, and procedures based on real-world observations", "A military communications satellite", "A programming language"],
                correctIndex: 1,
                explanation: "MITRE ATT&CK provides a structured taxonomy of threat actor behaviors across each stage of a cyber attack lifecycle."
              },
              {
                question: "In digital memory forensics using Volatility, what does inspecting process trees (pstree) reveal?",
                options: ["CPU temperature logs", "Parent-child relationships of running processes to spot anomaly behaviors like cmd.exe or PowerShell spawned by Microsoft Word", "Unsaved browser bookmarks", "Hard drive sector health"],
                correctIndex: 1,
                explanation: "Process hierarchy reveals suspicious execution flows (e.g. an office macro or web server spawning an interactive reverse shell)."
              },
              {
                question: "What is an Indicator of Compromise (IoC)?",
                options: ["A software release note", "Artifacts observed on a network or in an operating system that indicate with high confidence that an intrusion has occurred (e.g. malicious hashes, C2 IP addresses)", "An SSL certificate expiration date", "A compiler error"],
                correctIndex: 1,
                explanation: "IoCs are forensic traces (file hashes, known command-and-control IP addresses, registry keys) signaling malicious activity."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "product-ai-strategist",
    title: "AI Product Manager & Strategist",
    cluster: "product-design",
    clusterName: "Product & UX Strategy",
    icon: "🎨",
    tagline: "Define AI product vision, conduct user research, align engineering teams, and drive product-led growth.",
    salaryRange: "$130k - $210k / yr",
    growthRate: "+29% (Surging)",
    demand: "Very High",
    difficulty: "Intermediate",
    avgMonths: 5,
    radarStats: {
      math: 60,
      coding: 55,
      systems: 75,
      mlCore: 78,
      cloud: 60,
      product: 98
    },
    skillsTree: [
      {
        phaseId: 1,
        phaseTitle: "Phase 1: Product Strategy, Discovery & Opportunity Sizing",
        phaseDesc: "Customer discovery, TAM/SAM/SOM sizing, problem framing, and product requirements documentation (PRDs).",
        skills: [
          {
            id: "product-discovery-prd",
            title: "Customer Discovery, PRD Crafting & Value Proposition",
            level: "Foundational",
            estHours: 25,
            tags: ["PRD", "User Research", "JTBD", "Product Discovery"],
            description: "Conduct ethnographic customer interviews, formulate Jobs-To-Be-Done (JTBD) frameworks, write comprehensive PRDs, and map user journey funnels.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "Lenny's Newsletter Product Management Guides", url: "https://www.lennysnewsletter.com" },
              { type: "course", title: "Inspired by Marty Cagan (Silicon Valley Product Group)", url: "https://www.svpg.com/books/inspired/" },
              { type: "lab", title: "Miro Product Journey Mapping Templates", url: "https://miro.com/templates/user-journey-map/" }
            ],
            project: {
              title: "End-to-End PRD & Discovery Dossier for an AI Copilot",
              brief: "Formulate a complete product discovery package for an AI workflow tool, including user personas, JTBD statements, competitive teardowns, and functional PRD specifications.",
              deliverables: ["User interview synthesis with 5 JTBD insights", "Detailed PRD with user stories & edge case specifications", "Wireframe prototypes and acceptance criteria"]
            },
            quiz: [
              {
                question: "What is the core premise of Clayton Christensen's 'Jobs-To-Be-Done' (JTBD) framework?",
                options: ["People buy products because of low prices only", "Customers do not simply buy products; they 'hire' them to make progress in a specific circumstance", "Job descriptions for hiring employees", "Agile scrum sprint velocity planning"],
                correctIndex: 1,
                explanation: "JTBD shifts focus from demographics to the functional, emotional, and social transformation a customer is trying to achieve."
              },
              {
                question: "What is the primary risk of jumping straight to building solutions without customer discovery?",
                options: ["Higher cloud hosting costs", "Building a feature or product that functions technically well but solves no real customer problem that anyone is willing to pay for", "Slower Git pull requests", "Deprecating APIs"],
                correctIndex: 1,
                explanation: "Building the wrong thing efficiently is the #1 cause of startup failure; discovery validates problem-solution fit before capital expenditure."
              },
              {
                question: "What makes a PRD actionable for engineering teams?",
                options: ["Writing 100 pages of legal contracts", "Clearly articulating the customer problem, desired outcomes, success metrics, constraints, user flows, and acceptance criteria while leaving technical implementation to engineers", "Dictating variable names and CSS colors", "Setting arbitrary unrealistic deadlines"],
                correctIndex: 1,
                explanation: "An effective PRD establishes clarity on what problem needs solving and why, leaving the technical 'how' to engineering expertise."
              }
            ]
          }
        ]
      },
      {
        phaseId: 2,
        phaseTitle: "Phase 2: AI Capabilities, Feasibility & UX Patterns",
        phaseDesc: "LLM capabilities & constraints, hallucination management, human-in-the-loop UX, and cost modeling.",
        skills: [
          {
            id: "ai-ux-cost-economics",
            title: "AI Product UX Patterns, Guardrails & Token Economics",
            level: "Intermediate",
            estHours: 30,
            tags: ["AI UX", "Token Economics", "Guardrails", "LLM Evals", "Human-in-the-Loop"],
            description: "Design intuitive interfaces for generative AI, design streaming feedback, calculate unit token economics (cost per active user), and build evaluation rubrics.",
            prerequisites: ["product-discovery-prd"],
            resources: [
              { type: "docs", title: "Google People + AI Guidebook (PAIR)", url: "https://pair.withgoogle.com/guidebook/" },
              { type: "course", title: "AI Product Management by Duke University", url: "https://www.coursera.org/specializations/ai-product-management-duke" },
              { type: "lab", title: "OpenAI Tokenizer & Cost Calculator", url: "https://platform.openai.com/tokenizer" }
            ],
            project: {
              title: "AI Unit Economics Model & Evaluation Benchmark Suite",
              brief: "Build an interactive financial model calculating GPU inference and API token costs across user cohorts, plus an LLM evaluation harness with automated grading rubrics.",
              deliverables: ["Token cost sensitivity model (margin impact)", "PAIR-compliant conversational UI wireframe with error handling", "Eval test suite testing hallucination rates across 50 prompts"]
            },
            quiz: [
              {
                question: "Why is 'Human-in-the-Loop' (HITL) UX critical for high-stakes generative AI products?",
                options: ["It removes the need for AI models", "Because AI models are probabilistic and will occasionally hallucinate; HITL empowers humans to review, verify, and approve critical actions", "It doubles token throughput", "It makes models faster to train"],
                correctIndex: 1,
                explanation: "High-stakes domains (legal, medical, financial) require human oversight to prevent irreversible consequences caused by stochastic hallucination."
              },
              {
                question: "How does latency impact user satisfaction in generative AI chat/completion tools?",
                options: ["Users prefer waiting several minutes", "Perceived speed is dominated by Time to First Token (TTFT); streaming text chunk-by-chunk keeps cognitive engagement high", "Latency has zero correlation with retention", "Users cannot perceive delays under 10 seconds"],
                correctIndex: 1,
                explanation: "Streaming responses token-by-token gives users instant feedback and keeps attention engaged while remaining computation completes in background."
              },
              {
                question: "What is an LLM Evaluation Rubric / Benchmark in AI product management?",
                options: ["A list of marketing bullet points", "A standardized dataset of test prompts with explicit grading criteria (e.g. accuracy, tone, compliance, latency) used to measure model regressions across prompt updates", "A server uptime monitor", "A bug tracking Kanban board"],
                correctIndex: 1,
                explanation: "Evals provide quantitative regression testing to verify whether prompt tweaks, model swaps, or fine-tuning improved or degraded real user outputs."
              }
            ]
          }
        ]
      },
      {
        phaseId: 3,
        phaseTitle: "Phase 3: Product Analytics, A/B Testing & Growth",
        phaseDesc: "North Star metrics, funnels, cohort retention, statistical significance in A/B testing, and PLG.",
        skills: [
          {
            id: "growth-experimentation-analytics",
            title: "Product Analytics, A/B Testing & Product-Led Growth (PLG)",
            level: "Advanced",
            estHours: 30,
            tags: ["A/B Testing", "Mixpanel", "Retention Cohorts", "PLG", "Statistics"],
            description: "Master user retention cohorts, calculating p-values and sample sizes for experiments, optimizing activation loops, and viral coefficient calculations.",
            prerequisites: ["ai-ux-cost-economics"],
            resources: [
              { type: "docs", title: "Reforge Growth & Experimentation Series", url: "https://www.reforge.com" },
              { type: "course", title: "A/B Testing by Google on Udacity", url: "https://www.udacity.com/course/ab-testing--ud257" },
              { type: "lab", title: "Evan Miller A/B Test Sample Size Calculator", url: "https://www.evanmiller.org/ab-testing/sample-size.html" }
            ],
            project: {
              title: "Product Growth Engine & Experimentation Specification",
              brief: "Formulate an onboarding activation experiment hypothesis, calculate statistical sample sizes, build retention cohort models, and design viral referral mechanics.",
              deliverables: ["A/B test design document with primary & guardrail metrics", "Cohort retention curves analysis", "PLG activation loop diagram"]
            },
            quiz: [
              {
                question: "What is a 'Guardrail Metric' in A/B experimentation?",
                options: ["A metric that measures how fast buttons animate", "A business metric (e.g. cancellation rate, page load speed, customer support tickets) monitored to ensure optimization of the primary metric doesn't inadvertently harm overall health", "A traffic light on the office wall", "The font size of the survey"],
                correctIndex: 1,
                explanation: "Guardrail metrics protect against unintended side-effects (e.g. increasing clicks on an aggressive popup while severely harming long-term user retention)."
              },
              {
                question: "What does statistical significance (e.g. p < 0.05) indicate in an A/B test?",
                options: ["The feature will definitely generate $1M in revenue", "There is less than a 5% probability that the observed difference between variant and control occurred purely by random chance", "100% of users loved the change", "The experiment ran for exactly 5 days"],
                correctIndex: 1,
                explanation: "A p-value under 0.05 indicates strong evidence against the null hypothesis, meaning the outcome is unlikely due to random variation alone."
              },
              {
                question: "What is an 'Aha! Moment' in user onboarding?",
                options: ["When a user creates an account", "The pivotal moment where a user first experiences the core value proposition of the product, dramatically increasing retention probability", "When a user submits a bug report", "When the subscription invoice is paid"],
                correctIndex: 1,
                explanation: "The Aha! moment (e.g. Slack reaching 2,000 sent messages in a team) is the inflection point where product utility clicks in the user's mind."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "fintech-blockchain-engineer",
    title: "FinTech & Quantitative Systems Developer",
    cluster: "fintech-web3",
    clusterName: "FinTech & Web3",
    icon: "💎",
    tagline: "Build ultra-low latency order routing systems, algorithmic trading pipelines, and smart contracts.",
    salaryRange: "$140k - $240k / yr",
    growthRate: "+31% (High Demand)",
    demand: "Very High",
    difficulty: "Advanced",
    avgMonths: 7,
    radarStats: {
      math: 92,
      coding: 94,
      systems: 95,
      mlCore: 70,
      cloud: 80,
      product: 62
    },
    skillsTree: [
      {
        phaseId: 1,
        phaseTitle: "Phase 1: Financial Market Microstructure & Algorithmic Foundations",
        phaseDesc: "Order book dynamics, limit orders, market makers, FIX protocol, and statistical arbitrage.",
        skills: [
          {
            id: "orderbook-market-mechanics",
            title: "Limit Order Book (LOB) Architecture & Matching Engines",
            level: "Foundational",
            estHours: 32,
            tags: ["Order Book", "Matching Engine", "LOB", "C++ / Rust", "Low Latency"],
            description: "Understand bid-ask spread mechanics, price-time priority (FIFO), limit order book data structures, and deterministic matching engine design.",
            prerequisites: [],
            resources: [
              { type: "docs", title: "Trading and Exchanges by Larry Harris", url: "https://global.oup.com" },
              { type: "course", title: "Market Microstructure in Practice (Lehalle & Mounjid)", url: "https://www.worldscientific.com" },
              { type: "lab", title: "QuantConnect Free Algorithmic Backtesting Lab", url: "https://www.quantconnect.com" }
            ],
            project: {
              title: "High-Performance In-Memory Limit Order Matching Engine",
              brief: "Implement a zero-allocation order matching engine in Rust or TypeScript with price-time priority, supporting limit orders, market orders, and cancel requests.",
              deliverables: ["Order insertion in O(1) via hash map + intrusive double-linked list", "Deterministic order execution reporting", "Throughput exceeding 50,000 orders/sec"]
            },
            quiz: [
              {
                question: "In a continuous double auction Limit Order Book, what does Price-Time Priority (FIFO) dictate?",
                options: ["Orders with the highest fees are filled first", "Orders at the best price are matched first; among orders at the same price, the order placed earliest in time is filled first", "Random matching algorithm", "Market orders are executed after limit orders"],
                correctIndex: 1,
                explanation: "Price-time priority rewards price improvement first (highest bid, lowest ask), followed by queue seniority for matching price levels."
              },
              {
                question: "What is Slippage in trade execution?",
                options: ["Exchange software crash", "The difference between the expected price of a trade and the actual execution price due to market movement or liquidity consumption across order book depth", "Broker commission charges", "Server latency jitter"],
                correctIndex: 1,
                explanation: "When a large order consumes available liquidity at top of book, subsequent shares fill at worse prices further down the book depth."
              },
              {
                question: "What data structure is optimal for price levels in a high-speed Limit Order Book?",
                options: ["An unsorted array", "A self-balancing binary search tree (or B-Tree) for price levels, where each price level points to a doubly linked list of FIFO orders", "A single hash table without ordering", "A stack"],
                correctIndex: 1,
                explanation: "A sorted tree permits fast O(log N) lookup and deletion of price levels, while the FIFO linked list enables O(1) appending and cancellation of orders."
              }
            ]
          }
        ]
      },
      {
        phaseId: 2,
        phaseTitle: "Phase 2: Smart Contracts, EVM & DeFi Protocols",
        phaseDesc: "Solidity security patterns, re-entrancy attack prevention, Automated Market Makers (AMMs), and flash loans.",
        skills: [
          {
            id: "solidity-defi-security",
            title: "Solidity Smart Contracts, EVM Internals & AMMs",
            level: "Intermediate",
            estHours: 38,
            tags: ["Solidity", "EVM", "Uniswap", "DeFi", "Reentrancy"],
            description: "Write production smart contracts, understand EVM storage layout & gas optimization, implement Constant Product Market Makers (x * y = k), and prevent exploits.",
            prerequisites: ["orderbook-market-mechanics"],
            resources: [
              { type: "docs", title: "Ethereum Yellow Paper & Solidity Documentation", url: "https://docs.soliditylang.org" },
              { type: "course", title: "Uniswap v2 & v3 Core Architecture Whitepapers", url: "https://uniswap.org/whitepaper.pdf" },
              { type: "lab", title: "Damn Vulnerable DeFi Security Challenges", url: "https://www.damnvulnerabledefi.xyz" }
            ],
            project: {
              title: "Constant Product AMM & Flash Loan Arbitrage Contract",
              brief: "Develop an automated market maker (AMM) decentralized exchange contract with liquidity pool minting, dynamic swap fees, and reentrancy guard defenses.",
              deliverables: ["Full mathematical constant product invariant x * y = k test suite", "Slither static analysis clean audit", "Hardhat/Foundry comprehensive test suite"]
            },
            quiz: [
              {
                question: "What is a Reentrancy Attack in smart contracts, and how is it prevented?",
                options: ["Attacking internet routers; prevented by VPN", "An external contract calls back into the victim contract before the first execution updates balances; prevented by the Checks-Effects-Interactions pattern or nonReentrant mutex", "Mining invalid blocks; prevented by proof of work", "Stealing private keys; prevented by 2FA"],
                correctIndex: 1,
                explanation: "Reentrancy occurs when an external call is made before state changes are recorded. Updating internal state before external calls prevents recursive draining."
              },
              {
                question: "In Uniswap v2 style Constant Product AMMs, what is the formula governing token swaps?",
                options: ["x + y = k", "x * y = k (the product of reserve quantities of token X and token Y remains constant before fees)", "x / y = k", "x^2 + y^2 = k"],
                correctIndex: 1,
                explanation: "The invariant x * y = k ensures that as token X reserves increase from a deposit, token Y reserves must decrease proportionally to preserve the constant product."
              },
              {
                question: "What is a Flash Loan?",
                options: ["A payday loan with 20% interest", "An uncollateralized loan that must be borrowed and completely repaid within the exact same atomic blockchain transaction", "A wire transfer via SWIFT", "A loan backed by physical gold"],
                correctIndex: 1,
                explanation: "Flash loans allow borrowing millions with zero collateral, provided the full principal plus fee is returned before the transaction completes; otherwise the entire transaction reverts."
              }
            ]
          }
        ]
      }
    ]
  }
];
