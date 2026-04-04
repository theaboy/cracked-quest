import { Course } from "../store/useCourseStore";

export const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@studyquest.app",
  username: "DemoStudent",
};

const NOTES_T1 = `## Linear Regression

**Goal:** Model a continuous output $y$ from input features $\\mathbf{x}$ by fitting a linear hyperplane that minimises prediction error.

---

### Loss Function — Residual Sum of Squares

$$RSS(\\mathbf{w}) = \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|^2 = \\sum_i (y_i - \\mathbf{w}^\\top \\mathbf{x}_i)^2$$

Taking the gradient and setting to zero gives the **Normal Equations**:

$$\\mathbf{X}^\\top \\mathbf{X}\\mathbf{w} = \\mathbf{X}^\\top \\mathbf{y}$$

---

### Closed-Form Solution (OLS)

$$\\mathbf{w}^* = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}$$

Valid only when $\\mathbf{X}^\\top \\mathbf{X}$ **is invertible** (i.e. $\\mathbf{X}$ has full column rank — no multicollinearity).

---

### Ridge Regression (L2 Regularisation)

Adds a penalty term $\\lambda\\|\\mathbf{w}\\|^2$ to the loss:

$$\\mathbf{w}^*_{\\text{ridge}} = (\\mathbf{X}^\\top \\mathbf{X} + \\lambda \\mathbf{I})^{-1} \\mathbf{X}^\\top \\mathbf{y}$$

- $\\lambda > 0$ shrinks weights toward zero
- $(\\mathbf{X}^\\top \\mathbf{X} + \\lambda \\mathbf{I})$ **is always invertible** — solves the rank deficiency problem
- Introduces bias but reduces variance

---

### Bias–Variance Tradeoff

$$\\text{Expected Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$$

| Model | Bias | Variance |
|-------|------|----------|
| Too simple (underfit) | High | Low |
| Too complex (overfit) | Low | High |
| Regularised | Medium | Medium |

---

### Key Assumptions

- **Linearity** in parameters (not necessarily in features)
- **Homoscedasticity** — residuals have constant variance
- **Independence** of observations
- **No perfect multicollinearity** among features

---

### Goodness of Fit — R²

$$R^2 = 1 - \\frac{RSS}{TSS} \\quad \\text{where} \\quad TSS = \\sum_i (y_i - \\bar{y})^2$$

- $R^2 = 1$ → perfect fit
- $R^2 = 0$ → model no better than predicting the mean
- $R^2 < 0$ → model worse than the mean (possible with ridge/lasso)

---

### Exam Tips 🎯

- **Derive the normal equations** from $\\partial RSS / \\partial \\mathbf{w} = 0$ — examiners love this
- Gradient descent converges to the same solution as OLS for convex MSE loss
- Ridge regression is the go-to when $\\mathbf{X}^\\top \\mathbf{X}$ is near-singular
- Know when to use L1 (Lasso, sparse solutions) vs L2 (Ridge, smooth shrinkage)`;

const NOTES_T2 = `## Logistic Regression

**Goal:** Binary classification — model the probability $P(y=1 \\mid \\mathbf{x})$ using a linear decision boundary passed through a sigmoid.

---

### The Sigmoid Function

$$\\sigma(z) = \\frac{1}{1 + e^{-z}} \\quad \\text{where} \\quad z = \\mathbf{w}^\\top \\mathbf{x} + b$$

- Output is always in $(0, 1)$ → interpretable as probability
- $\\sigma(0) = 0.5$ → decision boundary at $\\mathbf{w}^\\top \\mathbf{x} = 0$

---

### Loss Function — Binary Cross-Entropy

$$\\mathcal{L}(\\mathbf{w}) = -\\sum_i \\left[ y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i) \\right]$$

- Convex → single global minimum
- **No closed-form solution** → must use gradient descent

---

### Gradient Descent Update

$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{w}} = \\mathbf{X}^\\top (\\hat{\\mathbf{y}} - \\mathbf{y})$$

$$\\mathbf{w} \\leftarrow \\mathbf{w} - \\alpha \\cdot \\mathbf{X}^\\top(\\hat{\\mathbf{y}} - \\mathbf{y})$$

where $\\alpha$ is the learning rate and $\\hat{\\mathbf{y}} = \\sigma(\\mathbf{X}\\mathbf{w})$.

---

### Decision Boundary

Predict class 1 if $P(y=1|\\mathbf{x}) \\geq 0.5$, equivalently if:

$$\\mathbf{w}^\\top \\mathbf{x} + b \\geq 0$$

The boundary is **linear in feature space**.

---

### Multiclass — Softmax

For $K$ classes, generalise sigmoid to softmax:

$$P(y=k \\mid \\mathbf{x}) = \\frac{e^{\\mathbf{w}_k^\\top \\mathbf{x}}}{\\sum_j e^{\\mathbf{w}_j^\\top \\mathbf{x}}}$$

Loss becomes **categorical cross-entropy**.

---

### Exam Tips 🎯

- Logistic regression is a **linear classifier** — its boundary is a hyperplane
- Cross-entropy loss is derived from maximum likelihood estimation (MLE)
- Regularisation: add $\\lambda\\|\\mathbf{w}\\|^2$ (L2) or $\\lambda\\|\\mathbf{w}\\|_1$ (L1) to prevent overfitting
- Compare to Linear Discriminant Analysis (LDA): LDA makes Gaussian class-conditional assumptions`;

const NOTES_T3 = `## Decision Trees

**Goal:** Partition feature space into axis-aligned regions using a hierarchy of binary splits, assigning a prediction to each leaf.

---

### Splitting Criterion

At each node, choose the feature *j* and threshold *t* that maximise **information gain**:

\`\`\`
IG(S, j, t) = H(S) - [ |S_L|/|S| · H(S_L) + |S_R|/|S| · H(S_R) ]
\`\`\`

**Entropy (classification):**
\`\`\`
H(S) = -Σₖ pₖ log₂(pₖ)
\`\`\`

**Gini Impurity (alternative):**
\`\`\`
Gini(S) = 1 - Σₖ pₖ²
\`\`\`

**Variance reduction (regression):**
\`\`\`
IG = Var(S) - [ |S_L|/|S| · Var(S_L) + |S_R|/|S| · Var(S_R) ]
\`\`\`

---

### Tree Growth Algorithm (CART)

1. Start with all training data at root
2. For each node: search all features and all thresholds for the best split
3. Recurse on left and right subsets
4. Stop when: max depth reached, node is pure, or min samples threshold hit

---

### Overfitting & Pruning

Full trees memorise training data → high variance.

**Pre-pruning:** Stop early (max depth, min samples per leaf)

**Post-pruning (reduced error pruning):**
- Grow full tree, then remove subtrees that don't improve validation accuracy

---

### Ensemble Methods

| Method | Strategy | Bias | Variance |
|--------|----------|------|----------|
| Bagging (Random Forest) | Average many trees trained on bootstrap samples | Same | ↓ |
| Boosting (AdaBoost, XGBoost) | Sequence of weak learners, each correcting the last | ↓ | Same |

**Random Forest** additionally randomly subsets features at each split → decorrelates trees.

---

### Feature Importance

Feature importance = total information gain attributed to splits on that feature across all trees.

---

### Exam Tips 🎯

- Know entropy vs. Gini — both measure impurity, Gini is faster to compute
- Decision trees have **high variance** — always explain why ensembles help
- Random Forest vs. Gradient Boosting: RF parallelisable, GB often higher accuracy
- ID3 uses entropy; CART uses Gini (classification) or MSE (regression)`;

const NOTES_T4 = `## Neural Networks

**Goal:** Learn hierarchical representations of data through compositions of parameterised linear transformations and non-linear activations.

---

### Forward Pass

For layer l with weight matrix **W⁽ˡ⁾** and bias **b⁽ˡ⁾**:

\`\`\`
z⁽ˡ⁾ = W⁽ˡ⁾ a⁽ˡ⁻¹⁾ + b⁽ˡ⁾
a⁽ˡ⁾ = σ( z⁽ˡ⁾ )
\`\`\`

- **a⁽⁰⁾ = x** (input)
- **a⁽ᴸ⁾ = ŷ** (output)

---

### Activation Functions

| Function | Formula | Use case |
|----------|---------|----------|
| Sigmoid | σ(z) = 1/(1+e^{-z}) | Binary output |
| Tanh | tanh(z) = (e^z - e^{-z})/(e^z + e^{-z}) | Hidden layers (zero-centred) |
| **ReLU** | max(0, z) | Most common hidden layer |
| Leaky ReLU | max(αz, z), α≈0.01 | Fixes dying ReLU |
| Softmax | e^{zₖ}/Σe^{zⱼ} | Multiclass output |

---

### Backpropagation

Uses the **chain rule** to compute ∂L/∂W for every layer:

\`\`\`
δ⁽ᴸ⁾ = ∂L/∂z⁽ᴸ⁾                         (output layer error)

δ⁽ˡ⁾ = ( W⁽ˡ⁺¹⁾ᵀ δ⁽ˡ⁺¹⁾ ) ⊙ σ'(z⁽ˡ⁾)   (backpropagate)

∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁾ (a⁽ˡ⁻¹⁾)ᵀ
∂L/∂b⁽ˡ⁾ = δ⁽ˡ⁾
\`\`\`

---

### Optimisers

**SGD with Momentum:**
\`\`\`
v ← βv + (1-β) ∇L
w ← w - α v
\`\`\`

**Adam (Adaptive Moment Estimation):**
\`\`\`
m ← β₁m + (1-β₁)∇L        (1st moment)
v ← β₂v + (1-β₂)(∇L)²     (2nd moment)
w ← w - α · m̂ / (√v̂ + ε)
\`\`\`
Default: α=0.001, β₁=0.9, β₂=0.999

---

### Key Pitfalls & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Vanishing gradients | Sigmoid/tanh saturate | Use ReLU; batch norm |
| Exploding gradients | Deep nets, bad init | Gradient clipping; Xavier/He init |
| Overfitting | Too many params | Dropout (p=0.5), weight decay (L2) |
| Dying ReLU | Negative pre-activations → zero grad | Leaky ReLU; careful learning rate |

---

### Weight Initialisation

**Xavier (Glorot):** for tanh/sigmoid
\`\`\`
W ~ Uniform( -√(6/(nᵢₙ+nₒᵤₜ)), +√(6/(nᵢₙ+nₒᵤₜ)) )
\`\`\`

**He init:** for ReLU
\`\`\`
W ~ N(0, 2/nᵢₙ)
\`\`\`

---

### Exam Tips 🎯

- **Derive backprop** for a 2-layer network from scratch — this comes up every year
- Know why ReLU solves vanishing gradients but can "die"
- Adam is the default optimiser — know what m̂ and v̂ correct for (bias in early steps)
- Batch normalisation normalises z⁽ˡ⁾ before activation → smoother loss landscape`;

const NOTES_T7 = `## Vectors & Vector Spaces

**Goal:** Establish the algebraic and geometric foundations that underpin all of linear algebra.

---

### Vector Space Axioms

A set V over field F is a **vector space** if it is closed under addition and scalar multiplication, with:

\`\`\`
u + v = v + u                    (commutativity)
(u + v) + w = u + (v + w)        (associativity)
∃ 0 ∈ V : v + 0 = v              (zero vector)
∀ v ∈ V, ∃ -v : v + (-v) = 0    (additive inverse)
1·v = v                           (scalar identity)
a(bv) = (ab)v                    (scalar compatibility)
\`\`\`

---

### Span, Linear Independence, Basis

**Span:** span{v₁,...,vₖ} = all linear combinations a₁v₁ + ... + aₖvₖ

**Linear Independence:**
\`\`\`
a₁v₁ + ... + aₖvₖ = 0  ⟹  a₁ = ... = aₖ = 0
\`\`\`

**Basis:** A linearly independent set that spans V. All bases of V have the same cardinality → **dimension** of V.

---

### Dot Product & Norms

\`\`\`
u · v = Σᵢ uᵢvᵢ = ||u|| ||v|| cos θ

||v||₂ = √(v · v)    (Euclidean norm)
||v||₁ = Σ|vᵢ|       (Manhattan norm)
\`\`\`

**Orthogonality:** u ⊥ v ⟺ u · v = 0

---

### Projection

Orthogonal projection of **u** onto **v**:

\`\`\`
proj_v(u) = (u·v / ||v||²) v
\`\`\`

---

### Gram-Schmidt Orthogonalisation

Given basis {v₁,...,vₙ}, produce orthonormal basis {e₁,...,eₙ}:

\`\`\`
u₁ = v₁
uₖ = vₖ - Σⱼ<ₖ (vₖ·uⱼ/||uⱼ||²) uⱼ
eₖ = uₖ / ||uₖ||
\`\`\`

---

### Exam Tips 🎯

- Verify vector space membership by checking **closure** under + and scalar ×
- Proving linear independence: set up the linear combination = 0 and solve
- Gram-Schmidt appears in QR decomposition — know both`;

const NOTES_T8 = `## Matrix Operations

**Goal:** Master the algebra of matrices as linear maps between vector spaces.

---

### Matrix Multiplication

\`\`\`
(AB)ᵢⱼ = Σₖ Aᵢₖ Bₖⱼ
\`\`\`

- Not commutative in general: AB ≠ BA
- Associative: (AB)C = A(BC)
- Distributive: A(B+C) = AB + AC

---

### Special Matrices

| Name | Property |
|------|----------|
| Identity I | AI = IA = A |
| Diagonal D | Dᵢⱼ = 0 for i≠j |
| Symmetric | A = Aᵀ |
| Orthogonal | QᵀQ = QQᵀ = I → Q⁻¹ = Qᵀ |
| Positive Definite | xᵀAx > 0 for all x ≠ 0 |

---

### Transpose Properties

\`\`\`
(AB)ᵀ = BᵀAᵀ
(A⁻¹)ᵀ = (Aᵀ)⁻¹
\`\`\`

---

### Determinant

\`\`\`
det(AB) = det(A) det(B)
det(A⁻¹) = 1/det(A)
det(Aᵀ) = det(A)
\`\`\`

A is **invertible** ⟺ det(A) ≠ 0 ⟺ A has full rank.

---

### Inverse

For 2×2:
\`\`\`
A = [[a,b],[c,d]]  →  A⁻¹ = (1/det A) [[d,-b],[-c,a]]
\`\`\`

For n×n: use Gaussian elimination (row reduction) or LU decomposition.

---

### LU Decomposition

\`\`\`
A = LU
\`\`\`

where L is lower triangular (1s on diagonal) and U is upper triangular.
Used for efficient solving of Ax = b → Ly = b, Ux = y.

---

### Rank & Null Space

\`\`\`
rank(A) + nullity(A) = n    (Rank-Nullity Theorem)
\`\`\`

- **rank(A):** dimension of column space (= row space)
- **null space:** {x : Ax = 0}

---

### Exam Tips 🎯

- Know rank-nullity cold — used everywhere in ML (e.g. why XᵀX may be singular)
- Orthogonal matrices preserve norms: ||Qx|| = ||x||
- LU decomposition is O(n³) — same as Gaussian elimination`;

const NOTES_T9 = `## Eigenvalues & Eigenvectors

**Goal:** Understand the spectral decomposition of matrices and why it matters for ML and data analysis.

---

### Definition

A non-zero vector **v** is an **eigenvector** of A with **eigenvalue** λ if:

\`\`\`
Av = λv
\`\`\`

Geometrically: A only scales **v**, does not rotate it.

---

### Characteristic Equation

\`\`\`
det(A - λI) = 0
\`\`\`

This gives a degree-n polynomial in λ. Its roots are the eigenvalues.

---

### Eigendecomposition (Diagonalisation)

If A has n linearly independent eigenvectors:

\`\`\`
A = V Λ V⁻¹
\`\`\`

where **V** = matrix of eigenvectors (columns), **Λ** = diagonal matrix of eigenvalues.

Then:
\`\`\`
Aᵏ = V Λᵏ V⁻¹
\`\`\`

---

### Symmetric Matrices — Spectral Theorem

If A = Aᵀ:
- All eigenvalues are **real**
- Eigenvectors for distinct eigenvalues are **orthogonal**
- A = QΛQᵀ (Q orthogonal)

This is why covariance matrices (symmetric PSD) are so well-behaved.

---

### Positive Semidefinite (PSD)

A symmetric A is **PSD** iff all eigenvalues λᵢ ≥ 0, equivalently:

\`\`\`
xᵀAx ≥ 0  for all x
\`\`\`

**XᵀX is always PSD** — crucial for OLS and kernel methods.

---

### Power Iteration

Finds the dominant eigenvector iteratively:

\`\`\`
v_{t+1} = A v_t / ||A v_t||
\`\`\`

Converges to the eigenvector for the largest |λ|.

---

### Connection to PCA

PCA finds directions of maximum variance = **eigenvectors of the covariance matrix** Σ = XᵀX/(n-1), sorted by decreasing eigenvalue.

\`\`\`
Σ vₖ = λₖ vₖ     (λ₁ ≥ λ₂ ≥ ... ≥ λₙ)
\`\`\`

Projection onto top-k eigenvectors gives the best rank-k approximation.

---

### Exam Tips 🎯

- Know how to find eigenvalues (characteristic polynomial) for 2×2 and 3×3
- The trace = Σλᵢ and det = Πλᵢ — useful shortcuts
- Symmetric + all eigenvalues > 0 ⟹ positive definite (invertible)
- PCA = eigendecomposition of covariance matrix = special case of SVD`;

export const DEMO_COURSES: Course[] = [
  {
    id: "course-comp551",
    name: "Machine Learning",
    code: "COMP 551",
    color: "#6C5CE7",
    topics: [
      { id: "t1", name: "Linear Regression", status: "mastered", masteryScore: 92, notes: NOTES_T1 },
      { id: "t2", name: "Logistic Regression", status: "mastered", masteryScore: 85, notes: NOTES_T2 },
      { id: "t3", name: "Decision Trees", status: "mastered", masteryScore: 78, notes: NOTES_T3 },
      { id: "t4", name: "Neural Networks", status: "in_progress", masteryScore: 35, notes: NOTES_T4 },
      { id: "t5", name: "CNNs", status: "locked", masteryScore: 0 },
      { id: "t6", name: "Transformers", status: "locked", masteryScore: 0 },
    ],
    exams: [
      {
        id: "e1",
        name: "Midterm",
        examDate: new Date(Date.now() + 8 * 86400000).toISOString().split("T")[0],
        topicIds: ["t1", "t2", "t3", "t4"],
        defeated: false,
      },
      {
        id: "e2",
        name: "Final",
        examDate: new Date(Date.now() + 35 * 86400000).toISOString().split("T")[0],
        topicIds: ["t1", "t2", "t3", "t4", "t5", "t6"],
        defeated: false,
      },
    ],
  },
  {
    id: "course-math223",
    name: "Linear Algebra",
    code: "MATH 223",
    color: "#00B894",
    topics: [
      { id: "t7", name: "Vectors & Spaces", status: "mastered", masteryScore: 90, notes: NOTES_T7 },
      { id: "t8", name: "Matrix Operations", status: "mastered", masteryScore: 82, notes: NOTES_T8 },
      { id: "t9", name: "Eigenvalues", status: "in_progress", masteryScore: 40, notes: NOTES_T9 },
      { id: "t10", name: "SVD", status: "locked", masteryScore: 0 },
    ],
    exams: [
      {
        id: "e3",
        name: "Midterm",
        examDate: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0],
        topicIds: ["t7", "t8", "t9"],
        defeated: false,
      },
    ],
  },
];

export const DEMO_LEADERBOARD = [
  { username: "AlexChen", xp: 1420, tier: "Scholar" },
  { username: "SarahM", xp: 1380, tier: "Grinder" },
  { username: "DemoStudent", xp: 1240, tier: "Grinder" },
  { username: "JakeW", xp: 1100, tier: "Grinder" },
  { username: "EmmaL", xp: 890, tier: "Grinder" },
  { username: "LiamT", xp: 820, tier: "Grinder" },
  { username: "MayaR", xp: 740, tier: "Grinder" },
  { username: "NoahK", xp: 610, tier: "Grinder" },
  { username: "OliviaP", xp: 530, tier: "Grinder" },
  { username: "EthanB", xp: 450, tier: "Student" },
  { username: "SophieW", xp: 380, tier: "Student" },
  { username: "DanielF", xp: 290, tier: "Student" },
];
