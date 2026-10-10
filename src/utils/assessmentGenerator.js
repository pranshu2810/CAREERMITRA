/**
 * CareerMitra AI Assessment Engine
 * Generates 30 domain-calibrated MCQ questions for:
 * 1) Phase-specific milestone assessments
 * 2) Comprehensive Final Career Readiness evaluation
 */

const DOMAIN_QUESTION_POOLS = {
  swe: [
    {
      q: 'What is the average time complexity of searching in a Hash Map with a good hash function?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      ans: 0,
      topic: 'Data Structures',
      diff: 'Foundational',
      hint: 'Under uniform distribution of hash keys, direct bucket indexing avoids traversal.',
      exp: 'Hash Maps achieve O(1) average time complexity through direct bucket indexing computed by the hash function.',
    },
    {
      q: 'In database indexing, why are B+ Trees preferred over Binary Search Trees for disk storage?',
      options: ['B+ Trees require zero memory', 'Higher branching factor drastically minimizes disk I/O operations', 'B+ trees do not support range queries', 'B+ trees only store keys in internal nodes and never on disk'],
      ans: 1,
      topic: 'Database Systems',
      diff: 'Intermediate',
      hint: 'Disk reads occur in blocks; broad fan-out keeps the tree height shallow.',
      exp: 'B+ Trees have a high branching factor (fan-out), keeping tree height small (typically 3-4 levels) and minimizing costly disk I/O block reads.',
    },
    {
      q: 'Which ACID property guarantees that concurrent transactions yield the same result as sequential execution?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      ans: 2,
      topic: 'Databases & Concurrency',
      diff: 'Foundational',
      hint: 'This property isolates transactions from one another.',
      exp: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially.',
    },
    {
      q: 'What is the primary trade-off of using Optimistic Concurrency Control (OCC) over Pessimistic Locking?',
      options: ['OCC causes permanent deadlocks', 'OCC performs better under low write conflict, but suffers retries under high contention', 'Pessimistic locking never acquires locks', 'OCC requires distributed leader election for every read'],
      ans: 1,
      topic: 'System Design',
      diff: 'Advanced',
      hint: 'Think about what happens when multiple writers update the exact same record simultaneously with OCC version numbers.',
      exp: 'Optimistic Concurrency Control avoids lock overhead during read operations, but high write contention causes frequent validation aborts and retry overhead.',
    },
    {
      q: 'In the CAP Theorem, which two properties does a standard distributed database prioritize during a network partition?',
      options: ['Consistency & Availability (CA)', 'Consistency & Partition Tolerance (CP) or Availability & Partition Tolerance (AP)', 'Linearizability & Durability', 'Atomicity & Security'],
      ans: 1,
      topic: 'Distributed Systems',
      diff: 'Intermediate',
      hint: 'When a network split (P) is inevitable, a system must decide between strict correctness or accepting stale reads/writes.',
      exp: 'When a network partition (P) occurs, a distributed system must choose between serving consistent data across surviving nodes (CP) or remaining available by serving potentially stale writes (AP).',
    },
    {
      q: 'Which HTTP status code is most appropriate when a client sends a syntactically valid payload that fails semantic validation rules?',
      options: ['400 Bad Request', '422 Unprocessable Entity', '500 Internal Error', '403 Forbidden'],
      ans: 1,
      topic: 'REST API Design',
      diff: 'Intermediate',
      hint: 'RFC 4918 specifies this for well-formed JSON payloads that fail business logic validation.',
      exp: 'HTTP 422 Unprocessable Entity signifies that the server understands the content type and syntax, but was unable to process the contained instructions due to semantic validation failures.',
    },
    {
      q: 'What problem does the Raft consensus algorithm solve in distributed systems?',
      options: ['Garbage collection latency', 'Agreement on a shared replicated log across unreliable cluster nodes', 'Client-side CSS rendering bugs', 'Lossless image compression'],
      ans: 1,
      topic: 'Distributed Systems',
      diff: 'Advanced',
      hint: 'Consider how Kubernetes etcd maintains consistency across a cluster.',
      exp: 'Raft provides distributed consensus, ensuring multiple server nodes agree on a series of state machine transitions (replicated log) despite node failures and message delays.',
    },
    {
      q: 'What is a primary symptom of a memory leak in a garbage-collected language like JavaScript or Java?',
      options: ['CPU utilization drops to 0%', 'Application heap memory steadily climbs without reclaiming, eventually triggering OutOfMemory errors', 'All network sockets close immediately', 'Code syntax becomes unreadable'],
      ans: 1,
      topic: 'Memory Management',
      diff: 'Foundational',
      hint: 'Unreferenced roots prevent the garbage collector from sweeping discarded objects.',
      exp: 'Memory leaks occur when unintended object references prevent the garbage collector from freeing allocated memory, leading to continuous heap growth and OutOfMemory crashes.',
    },
    {
      q: 'What is the main advantage of consistent hashing when designing a distributed cache?',
      options: ['Zero hashing computation overhead', 'Minimizes cache key relocations to K/N keys when adding or removing a cache node', 'Ensures all keys are written to node 0', 'Completely replaces all network communication'],
      ans: 1,
      topic: 'System Design',
      diff: 'Advanced',
      hint: 'In normal mod-N hashing, changing N remaps almost 100% of keys. What does consistent hashing do?',
      exp: 'Consistent hashing maps both keys and nodes to a circular hash ring, meaning adding or removing a node only requires remapping K/N keys (where K is total keys and N is nodes).',
    },
    {
      q: 'What does the "Circuit Breaker" pattern prevent in microservices architecture?',
      options: ['Database schema migrations', 'Cascading failures where one degraded downstream service exhausts thread pools across the entire fleet', 'HTTP header compression', 'Git merge conflicts'],
      ans: 1,
      topic: 'Microservices Architecture',
      diff: 'Advanced',
      hint: 'Think about electrical circuit breakers tripping when a surge occurs to prevent burning down the house.',
      exp: 'The Circuit Breaker pattern wraps protected function calls, detecting failures and short-circuiting calls immediately to prevent cascading thread pool exhaustion and allow upstream recovery.',
    },
  ],

  'data-scientist': [
    {
      q: 'What is the primary consequence of high multicollinearity among independent features in Linear Regression?',
      options: ['Model accuracy automatically drops to zero', 'Coefficient estimates become unstable and standard errors inflate', 'The dataset cannot be split into train and test', 'Gradient descent executes in zero iterations'],
      ans: 1,
      topic: 'Statistics & Regression',
      diff: 'Intermediate',
      hint: 'When two predictors provide identical information, isolating their individual effects becomes volatile.',
      exp: 'Multicollinearity inflates the variance of coefficient estimates, making it difficult to discern the individual impact of correlated predictors even though overall R-squared remains high.',
    },
    {
      q: 'In binary classification with severe class imbalance (99% negative, 1% positive), which metric is LEAST informative?',
      options: ['Precision-Recall AUC (PR-AUC)', 'Raw Accuracy', 'F1-Score', 'Matthews Correlation Coefficient (MCC)'],
      ans: 1,
      topic: 'Model Evaluation',
      diff: 'Foundational',
      hint: 'A dumb model that always predicts negative achieves 99% on this metric.',
      exp: 'Raw accuracy is misleading under heavy class imbalance because a model that trivially predicts the majority class for all samples achieves 99% accuracy while having zero recall on the minority class.',
    },
    {
      q: 'How does Random Forest reduce model variance compared to a single Decision Tree?',
      options: ['By pruning the tree to depth 1', 'By bagging (bootstrap aggregating) and random feature subspace selection across an ensemble', 'By converting trees into neural networks', 'By removing all continuous variables'],
      ans: 1,
      topic: 'Machine Learning',
      diff: 'Intermediate',
      hint: 'Ensembling de-correlated trees reduces the variance of the averaged prediction.',
      exp: 'Random Forests train multiple deep trees on bootstrap samples with random feature subsets; averaging their predictions lowers ensemble variance without increasing bias.',
    },
    {
      q: 'What do SHAP (SHapley Additive exPlanations) values represent in model interpretability?',
      options: ['The computational training time in seconds', 'The fair marginal contribution of each feature to the difference between actual prediction and expected baseline', 'The learning rate step size in backpropagation', 'The percentage of null values in the dataset'],
      ans: 1,
      topic: 'Explainable AI (XAI)',
      diff: 'Advanced',
      hint: 'Rooted in cooperative game theory (Lloyd Shapley).',
      exp: 'SHAP values allocate fair payouts (attributions) to each feature based on cooperative game theory, quantifying how much each feature shifts a prediction from the average base value.',
    },
    {
      q: 'What is the purpose of the Transformer model\'s Multi-Head Self-Attention mechanism?',
      options: ['To compress text into a single integer', 'To allow the model to simultaneously attend to information from different representation subspaces at different positions', 'To force sequential left-to-right RNN word processing', 'To remove punctuation marks automatically'],
      ans: 1,
      topic: 'Deep Learning & NLP',
      diff: 'Advanced',
      hint: 'Multiple heads project Query, Key, and Value vectors into different dimensions simultaneously.',
      exp: 'Multi-Head Attention expands the model\'s ability to focus on multiple positions and relational nuances (e.g. syntax, semantics, coreference) across multiple representation projection subspaces.',
    },
    {
      q: 'Which dimensionality reduction technique seeks to maximize variance along orthogonal axes in feature space?',
      options: ['Principal Component Analysis (PCA)', 'K-Means Clustering', 'Logistic Regression', 'One-Hot Encoding'],
      ans: 0,
      topic: 'Unsupervised Learning',
      diff: 'Foundational',
      hint: 'Calculates eigenvectors and eigenvalues of the covariance matrix.',
      exp: 'PCA identifies orthogonal principal component vectors that maximize the variance of the projected data while minimizing reconstruction loss.',
    },
    {
      q: 'What does a p-value less than alpha (e.g. 0.05) indicate in a standard hypothesis test?',
      options: ['The null hypothesis is 100% false with absolute certainty', 'The observed data is sufficiently unlikely under the null hypothesis, warranting rejection of the null', 'The sample size was too small', 'The alternative hypothesis has an effect size of zero'],
      ans: 1,
      topic: 'Inferential Statistics',
      diff: 'Foundational',
      hint: 'p-value measures the probability of seeing data as or more extreme assuming H0 is true.',
      exp: 'A p-value below alpha indicates that the probability of observing data at least as extreme as the sample data under the assumption that the null hypothesis is true is low enough to reject the null hypothesis.',
    },
    {
      q: 'What is the vanishing gradient problem primarily caused by in deep traditional networks?',
      options: ['Using ReLU activations everywhere', 'Repeated multiplication of small derivatives (e.g., Sigmoid/Tanh) during backpropagation through many layers', 'Excessive training data', 'Setting learning rate too high'],
      ans: 1,
      topic: 'Deep Learning',
      diff: 'Intermediate',
      hint: 'Sigmoid derivatives peak at 0.25; chaining them across 20 layers drives gradients near zero.',
      exp: 'Backpropagating through many layers with activations whose derivatives are less than 1 (such as Sigmoid or Tanh) causes the chain-rule gradient products to shrink exponentially, stalling early-layer weights.',
    },
  ],
};

/**
 * Procedural Domain Question Generator
 * Generates 30 high-yield questions for any career and phase.
 */
export function generatePhaseAssessment(career, phaseIdx, phaseData) {
  const careerId = career?.id || 'swe';
  const careerTitle = career?.title || 'Engineering Specialist';
  const phaseTitle = phaseData?.phase || phaseData?.title || `Phase ${Number(phaseIdx) + 1}`;
  const domainSkills = career?.skills || ['Fundamentals', 'Systems', 'Architecture', 'Deployment'];
  const pool = DOMAIN_QUESTION_POOLS[careerId] || DOMAIN_QUESTION_POOLS['swe'];

  const questions = [];

  // Generate 30 well-balanced questions
  for (let i = 0; i < 30; i++) {
    const baseTemplate = pool[i % pool.length];
    const skillFocus = domainSkills[i % domainSkills.length];
    const difficultyTier = i < 10 ? 'Foundational' : (i < 22 ? 'Intermediate' : 'Advanced');

    if (i < pool.length) {
      questions.push({
        id: `q-${phaseIdx}-${i + 1}`,
        question: baseTemplate.q,
        options: [...baseTemplate.options],
        correctIndex: baseTemplate.ans,
        explanation: baseTemplate.exp,
        topic: baseTemplate.topic,
        difficulty: baseTemplate.diff || difficultyTier,
        hint: baseTemplate.hint,
      });
    } else {
      // Procedurally generate authentic domain scenario questions
      const generatedQ = createProceduralQuestion(careerTitle, phaseTitle, skillFocus, i, difficultyTier);
      questions.push(generatedQ);
    }
  }

  return {
    assessmentId: `assess-${careerId}-p${phaseIdx}-${Date.now()}`,
    careerId,
    phaseIndex: phaseIdx,
    phaseTitle,
    careerTitle,
    totalQuestions: 30,
    passingScore: 21, // 70%
    timeLimitMinutes: 25,
    xpReward: 150,
    questions,
  };
}

/**
 * Procedural Major Final Career Readiness Assessment Generator
 * Generates 30 comprehensive, scenario-driven interview & architecture questions.
 */
export function generateReadinessAssessment(career) {
  const careerId = career?.id || 'swe';
  const careerTitle = career?.title || 'Senior Software Engineer';
  const domainSkills = career?.skills || ['Systems', 'Architecture', 'Security', 'Scalability'];
  const pool = DOMAIN_QUESTION_POOLS[careerId] || DOMAIN_QUESTION_POOLS['swe'];

  const questions = [];

  for (let i = 0; i < 30; i++) {
    const skill = domainSkills[i % domainSkills.length];
    const difficultyTier = i < 8 ? 'Intermediate' : (i < 24 ? 'Advanced' : 'Staff / Principal');

    if (i < 6 && pool[i]) {
      questions.push({
        id: `cr-q-${i + 1}`,
        question: `[Real-World Scenario] ${pool[i].q}`,
        options: pool[i].options,
        correctIndex: pool[i].ans,
        explanation: pool[i].exp,
        topic: `Production ${pool[i].topic}`,
        difficulty: difficultyTier,
        hint: pool[i].hint,
      });
    } else {
      questions.push(createReadinessScenarioQuestion(careerTitle, skill, i + 1, difficultyTier));
    }
  }

  return {
    assessmentId: `readiness-${careerId}-${Date.now()}`,
    careerId,
    careerTitle,
    isMajorReadinessExam: true,
    totalQuestions: 30,
    passingScore: 21, // 70%
    timeLimitMinutes: 35,
    xpReward: 300,
    questions,
  };
}

function createProceduralQuestion(careerTitle, phaseTitle, skill, idx, difficulty) {
  const templates = [
    {
      q: `When implementing ${skill} in a production ${careerTitle} environment, what is the recommended industry best practice?`,
      options: [
        `Ensure strict separation of concerns, automated unit testing, and input boundary validation.`,
        `Bypass validation and error handling to reduce runtime execution overhead.`,
        `Hardcode environment secrets directly inside the source code repository.`,
        `Never log execution telemetry or performance metrics to save disk space.`,
      ],
      ans: 0,
      hint: `Think about long-term maintainability, security, and automated verification.`,
      exp: `Production systems require modular separation of concerns, comprehensive automated testing, and defensive input validation to maintain high reliability.`,
    },
    {
      q: `In the context of ${phaseTitle}, which approach delivers the optimal balance between performance and maintainability for ${skill}?`,
      options: [
        `Prematurely micro-optimize assembly loops before benchmarking real bottlenecks.`,
        `Profile application performance with real workloads and apply algorithmic optimizations where hotspots are verified.`,
        `Allocate unbounded memory structures without considering garbage collection or memory limits.`,
        `Avoid code modularity to keep all execution routines inside a single 10,000 line script.`,
      ],
      ans: 1,
      hint: `Donald Knuth famously noted that premature optimization is the root of all evil.`,
      exp: `Empirical profiling under realistic workloads highlights true bottlenecks, enabling targeted optimization without compromising codebase clarity.`,
    },
    {
      q: `What is the primary risk of neglecting automated regression testing during ${skill} updates?`,
      options: [
        `Automated test suites increase hardware power consumption.`,
        `Unforeseen regressions and breaking changes can propagate to downstream production clients undetected.`,
        `Source code formatting tools will refuse to run.`,
        `Git commit history is erased automatically.`,
      ],
      ans: 1,
      hint: `Regression testing ensures that new changes do not silently break previously functional behavior.`,
      exp: `Without comprehensive regression tests, refactoring or updating core logic can introduce subtle regressions that escape into production environments.`,
    },
    {
      q: `Which metric is most crucial for evaluating the health and reliability of a ${skill} pipeline in production?`,
      options: [
        `Number of comments written per file.`,
        `Mean Time to Detect (MTTD), Mean Time to Recovery (MTTR), and error rates under peak load.`,
        `Alphabetical ordering of variable identifiers.`,
        `Frequency of desktop monitor power cycles.`,
      ],
      ans: 1,
      hint: `SRE and DevOps standards focus heavily on detection, resolution speed, and error budgets.`,
      exp: `MTTD, MTTR, and system error rates quantify how quickly engineering teams detect, diagnose, and resolve production degradation.`,
    },
  ];

  const t = templates[idx % templates.length];
  return {
    id: `pq-${idx + 1}`,
    question: t.q,
    options: t.options,
    correctIndex: t.ans,
    explanation: t.exp,
    topic: skill,
    difficulty,
    hint: t.hint,
  };
}

function createReadinessScenarioQuestion(careerTitle, skill, idx, difficulty) {
  const scenarios = [
    {
      q: `[High-Scale Incident] A production service handling ${skill} experiences a 500% spike in P99 latency while CPU remains under 30%. What is the most probable root cause?`,
      options: [
        `Database connection pool exhaustion or blocking I/O thread starvation.`,
        `The CPU clock rate was throttled to zero.`,
        `The HTML title tag was too long.`,
        `Compiler optimizations removed all function definitions.`,
      ],
      ans: 0,
      hint: `Low CPU with high latency strongly suggests threads are blocked waiting for external resources (I/O, database locks, or connection pools).`,
      exp: `When latency spikes while CPU is low, threads are typically idle and blocked waiting on external I/O, such as exhausted database connection pools or distributed lock contention.`,
    },
    {
      q: `[System Architecture] You are designing a mission-critical ${careerTitle} service with 99.99% availability SLA. Which disaster recovery strategy should you recommend?`,
      options: [
        `Single-region deployment with daily manual backups copied to a USB drive.`,
        `Multi-region active-active deployment with automated DNS failover and health probes.`,
        `Disable database transactions to improve write speed.`,
        `Store all customer data purely in volatile RAM without disk persistence.`,
      ],
      ans: 1,
      hint: `99.99% availability permits less than 5 minutes of downtime per month, requiring automated multi-region failover.`,
      exp: `To satisfy a 99.99% availability SLA, systems must deploy across multiple availability zones and regions with automated health checks and DNS failover routing.`,
    },
    {
      q: `[Security & Compliance] A security audit reveals that your ${careerTitle} application accepts unvalidated user input directly in query construction. What attack vector is most severe?`,
      options: [
        `CSS specificity collision.`,
        `Injection attacks (SQL/NoSQL/Command injection) allowing unauthorized data exfiltration or arbitrary execution.`,
        `Browser favicon rendering delay.`,
        `Git branch merge conflict.`,
      ],
      ans: 1,
      hint: `Concatenating unsanitized strings directly into database queries violates OWASP Top 10 guidelines.`,
      exp: `Unsanitized user input in query construction opens the application to critical injection vulnerabilities (CWE-89), potentially allowing total database compromise.`,
    },
    {
      q: `[Engineering Leadership] During a critical release of a new ${skill} module, how should your team mitigate risk for millions of active users?`,
      options: [
        `Deploy the release to 100% of global traffic simultaneously on Friday at 5:00 PM.`,
        `Implement a Canary release or Feature Flag rollout (1% -> 5% -> 25% -> 100%) paired with automated rollback on error spikes.`,
        `Turn off all telemetry and error logging during the rollout window.`,
        `Delete all staging environments to save infrastructure budget.`,
      ],
      ans: 1,
      hint: `Progressive delivery allows catching anomalies on a tiny fraction of users before full propagation.`,
      exp: `Canary releases with automated metric guards minimize blast radius by routing a small fraction of traffic to the new version before promoting it globally.`,
    },
  ];

  const s = scenarios[idx % scenarios.length];
  return {
    id: `cr-scen-${idx}`,
    question: s.q,
    options: s.options,
    correctIndex: s.ans,
    explanation: s.exp,
    topic: `${skill} Architecture`,
    difficulty,
    hint: s.hint,
  };
}
