#!/usr/bin/env python3
"""
Jupyter Notebook Generator for Article Classification
======================================================
Generates a complete .ipynb notebook with the full ML pipeline:
EDA → Preprocessing → Training → Evaluation → Inference → Export

Uses only Python standard library (json, uuid, os).

Usage:
    cd ai/scripts
    python build_notebook.py
"""

import json
import os
import uuid


def make_cell(cell_type, source_text):
    """Create a notebook cell from a multi-line string."""
    lines = source_text.rstrip("\n").split("\n")
    source = [line + "\n" for line in lines[:-1]] + [lines[-1]]

    cell = {
        "cell_type": cell_type,
        "id": uuid.uuid4().hex[:8],
        "metadata": {},
        "source": source
    }
    if cell_type == "code":
        cell["execution_count"] = None
        cell["outputs"] = []
    return cell


def md(text):
    return make_cell("markdown", text)


def code(text):
    return make_cell("code", text)


# =========================================================================
# Define all notebook cells
# =========================================================================
cells = []

# --- 1. Title & Overview ---
cells.append(md("""\
# 🧠 Article Content Moderation with BERT

**Multi-label classification** model for automated blog article moderation.

This notebook implements a complete ML pipeline to classify blog articles into 5 categories:

| Label | Description |
|-------|-------------|
| `sexual` | Sexually explicit or adult content |
| `violent` | Violent, graphic, or weapon-related content |
| `spam` | Promotional, clickbait, or scam content |
| `hate_discrimination` | Hate speech, discrimination, or supremacist content |
| `acceptable` | Appropriate content for the blog |

**Model**: `bert-base-multilingual-cased` (supports Spanish & English)  
**Architecture**: `BertForSequenceClassification` with `multi_label_classification`  
**Loss**: `BCEWithLogitsLoss` (Binary Cross-Entropy)

---

### 📑 Table of Contents
1. [Environment Setup](#1-environment-setup)
2. [Configuration](#2-configuration)
3. [Data Loading](#3-data-loading)
4. [Exploratory Data Analysis](#4-eda)
5. [Preprocessing](#5-preprocessing)
6. [Model Architecture](#6-model)
7. [Training](#7-training)
8. [Evaluation](#8-evaluation)
9. [Inference](#9-inference)
10. [Model Export](#10-export)\
"""))

# --- 2. Environment Setup ---
cells.append(md("""\
## 📦 1. Environment Setup <a id="1-environment-setup"></a>

### Prerequisites

Make sure you have a Python virtual environment activated. Then install the required dependencies:

```bash
# Create and activate virtual environment (if not done already)
python -m venv .venv

# Windows
.venv\\Scripts\\activate

# Linux/macOS  
source .venv/bin/activate
```

### Install Dependencies

```bash
# Core ML libraries
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
# Use this for CPU-only:
# pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Transformers and NLP
pip install transformers datasets tokenizers

# Data science
pip install pandas numpy scikit-learn

# Visualization
pip install matplotlib seaborn

# Jupyter
pip install jupyter ipykernel

# Register kernel (optional)
python -m ipykernel install --user --name=article-classifier --display-name="Article Classifier"
```

### Verify Installation

Run the cell below to verify all dependencies are correctly installed.\
"""))

cells.append(code("""\
import sys
print(f"Python: {sys.version}")

import torch
print(f"PyTorch: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA device: {torch.cuda.get_device_name(0)}")

import transformers
print(f"Transformers: {transformers.__version__}")

import pandas as pd
print(f"Pandas: {pd.__version__}")

import sklearn
print(f"Scikit-learn: {sklearn.__version__}")

import matplotlib
print(f"Matplotlib: {matplotlib.__version__}")

import seaborn as sns
print(f"Seaborn: {sns.__version__}")

print("\\n✅ All dependencies installed correctly!")\
"""))

# --- 3. Imports ---
cells.append(md("""\
### Imports\
"""))

cells.append(code("""\
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, f1_score,
    precision_score, recall_score,
    multilabel_confusion_matrix
)

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    get_linear_schedule_with_warmup
)

import warnings
warnings.filterwarnings('ignore')

# Plotting style
plt.style.use('seaborn-v0_8-darkgrid')
plt.rcParams['figure.dpi'] = 100
plt.rcParams['font.size'] = 11

print("✅ All imports loaded successfully!")\
"""))

# --- 4. Configuration ---
cells.append(md("""\
## ⚙️ 2. Configuration <a id="2-configuration"></a>\
"""))

cells.append(code("""\
# === Paths ===
DATA_PATH = "data/dataset_blog_articles.csv"
MODEL_SAVE_DIR = "models/article_classifier"

# === Model ===
MODEL_NAME = "bert-base-multilingual-cased"
MAX_LENGTH = 512  # Max tokens for BERT

# === Training Hyperparameters ===
BATCH_SIZE = 8
LEARNING_RATE = 2e-5
NUM_EPOCHS = 5
WEIGHT_DECAY = 0.01
WARMUP_RATIO = 0.1
MAX_GRAD_NORM = 1.0

# === Classification ===
THRESHOLD = 0.5  # Configurable decision threshold
LABEL_COLUMNS = ["sexual", "violent", "spam", "hate_discrimination", "acceptable"]
NUM_LABELS = len(LABEL_COLUMNS)

# === Device ===
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️  Device: {device}")
if device.type == "cuda":
    print(f"   GPU: {torch.cuda.get_device_name(0)}")
    print(f"   Memory: {torch.cuda.get_device_properties(0).total_mem / 1e9:.1f} GB")

# === Random Seed ===
SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)

print(f"\\n📋 Configuration:")
print(f"   Model: {MODEL_NAME}")
print(f"   Max tokens: {MAX_LENGTH}")
print(f"   Batch size: {BATCH_SIZE}")
print(f"   Learning rate: {LEARNING_RATE}")
print(f"   Epochs: {NUM_EPOCHS}")
print(f"   Threshold: {THRESHOLD}")
print(f"   Labels: {LABEL_COLUMNS}")\
"""))

# --- 5. Data Loading ---
cells.append(md("""\
## 📁 3. Data Loading <a id="3-data-loading"></a>\
"""))

cells.append(code("""\
df = pd.read_csv(DATA_PATH)
print(f"📊 Dataset loaded: {df.shape[0]} articles, {df.shape[1]} columns")
print(f"\\n--- Column Types ---")
print(df.dtypes)
print(f"\\n--- Missing Values ---")
print(df.isnull().sum())
print(f"\\n--- First 5 Rows ---")
df.head()\
"""))

# --- 6. EDA ---
cells.append(md("""\
## 📊 4. Exploratory Data Analysis (EDA) <a id="4-eda"></a>

Let's explore the dataset to understand the distribution of labels, text lengths, and co-occurrence patterns.\
"""))

# EDA: Label distribution
cells.append(code("""\
# --- Label Distribution ---
fig, axes = plt.subplots(1, 2, figsize=(15, 5))

label_counts = df[LABEL_COLUMNS].sum().sort_values(ascending=False)
colors = ['#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#3498db']

# Bar chart
bars = axes[0].bar(label_counts.index, label_counts.values, color=colors, edgecolor='white', linewidth=1.5)
axes[0].set_title('Label Distribution (Count)', fontsize=14, fontweight='bold', pad=15)
axes[0].set_ylabel('Number of Articles', fontsize=12)
axes[0].tick_params(axis='x', rotation=30)
for bar, count in zip(bars, label_counts.values):
    axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3,
                 str(count), ha='center', va='bottom', fontweight='bold', fontsize=11)

# Pie chart
axes[1].pie(label_counts.values, labels=label_counts.index, colors=colors,
            autopct='%1.1f%%', startangle=90, textprops={'fontsize': 11},
            wedgeprops={'edgecolor': 'white', 'linewidth': 1.5})
axes[1].set_title('Label Proportions', fontsize=14, fontweight='bold', pad=15)

plt.tight_layout()
plt.show()

print(f"\\n📋 Label Summary:")
for label in LABEL_COLUMNS:
    count = df[label].sum()
    pct = count / len(df) * 100
    print(f"   {label:>20s}: {count:4d} articles ({pct:5.1f}%)")\
"""))

# EDA: Text lengths
cells.append(code("""\
# --- Text Length Analysis ---
df['content_chars'] = df['content'].str.len()
df['content_words'] = df['content'].str.split().str.len()
df['title_words'] = df['title'].str.split().str.len()

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

axes[0].hist(df['content_chars'], bins=40, color='#3498db', alpha=0.8, edgecolor='white')
axes[0].set_title('Content Length (Characters)', fontsize=13, fontweight='bold')
axes[0].set_xlabel('Characters')
axes[0].set_ylabel('Frequency')
axes[0].axvline(df['content_chars'].mean(), color='#e74c3c', linestyle='--', label=f"Mean: {df['content_chars'].mean():.0f}")
axes[0].legend()

axes[1].hist(df['content_words'], bins=40, color='#2ecc71', alpha=0.8, edgecolor='white')
axes[1].set_title('Content Length (Words)', fontsize=13, fontweight='bold')
axes[1].set_xlabel('Words')
axes[1].set_ylabel('Frequency')
axes[1].axvline(df['content_words'].mean(), color='#e74c3c', linestyle='--', label=f"Mean: {df['content_words'].mean():.0f}")
axes[1].legend()

axes[2].hist(df['title_words'], bins=20, color='#9b59b6', alpha=0.8, edgecolor='white')
axes[2].set_title('Title Length (Words)', fontsize=13, fontweight='bold')
axes[2].set_xlabel('Words')
axes[2].set_ylabel('Frequency')
axes[2].axvline(df['title_words'].mean(), color='#e74c3c', linestyle='--', label=f"Mean: {df['title_words'].mean():.0f}")
axes[2].legend()

plt.tight_layout()
plt.show()

print(f"\\n📏 Text Length Statistics:")
print(f"   Content chars  — Mean: {df['content_chars'].mean():.0f}, Median: {df['content_chars'].median():.0f}, Max: {df['content_chars'].max()}")
print(f"   Content words  — Mean: {df['content_words'].mean():.0f}, Median: {df['content_words'].median():.0f}, Max: {df['content_words'].max()}")
print(f"   Title words    — Mean: {df['title_words'].mean():.0f}, Median: {df['title_words'].median():.0f}, Max: {df['title_words'].max()}")\
"""))

# EDA: Co-occurrence
cells.append(code("""\
# --- Label Co-occurrence Matrix ---
co_occurrence = df[LABEL_COLUMNS].T.dot(df[LABEL_COLUMNS])

plt.figure(figsize=(8, 6))
sns.heatmap(
    co_occurrence, annot=True, fmt='d', cmap='YlOrRd',
    xticklabels=LABEL_COLUMNS, yticklabels=LABEL_COLUMNS,
    linewidths=0.5, linecolor='white',
    cbar_kws={'label': 'Count'}
)
plt.title('Label Co-occurrence Matrix', fontsize=14, fontweight='bold', pad=15)
plt.tight_layout()
plt.show()

# Multi-label statistics
num_labels_per_article = df[LABEL_COLUMNS].sum(axis=1)
print(f"\\n🏷️  Labels per Article:")
print(f"   Mean: {num_labels_per_article.mean():.2f}")
print(f"   Single-label: {(num_labels_per_article == 1).sum()} articles")
print(f"   Multi-label:  {(num_labels_per_article > 1).sum()} articles")\
"""))

# EDA: Category distribution
cells.append(code("""\
# --- Blog Category & Author Distribution ---
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Category distribution
cat_counts = df['category'].value_counts().head(10)
axes[0].barh(cat_counts.index[::-1], cat_counts.values[::-1], color='#3498db', edgecolor='white')
axes[0].set_title('Top 10 Blog Categories', fontsize=13, fontweight='bold')
axes[0].set_xlabel('Number of Articles')

# Author distribution
author_counts = df['author'].value_counts().head(10)
axes[1].barh(author_counts.index[::-1], author_counts.values[::-1], color='#2ecc71', edgecolor='white')
axes[1].set_title('Top 10 Authors', fontsize=13, fontweight='bold')
axes[1].set_xlabel('Number of Articles')

plt.tight_layout()
plt.show()\
"""))

# EDA: Text length by label
cells.append(code("""\
# --- Content Length by Label ---
fig, ax = plt.subplots(figsize=(12, 5))

label_data = []
for label in LABEL_COLUMNS:
    lengths = df.loc[df[label] == 1, 'content_words'].values
    label_data.append(lengths)

bp = ax.boxplot(label_data, labels=LABEL_COLUMNS, patch_artist=True,
                boxprops=dict(linewidth=1.5),
                medianprops=dict(color='black', linewidth=2))

colors_box = ['#e74c3c', '#f39c12', '#9b59b6', '#e67e22', '#2ecc71']
for patch, color in zip(bp['boxes'], colors_box):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

ax.set_title('Content Word Count Distribution by Label', fontsize=14, fontweight='bold', pad=15)
ax.set_ylabel('Word Count')
ax.tick_params(axis='x', rotation=15)
plt.tight_layout()
plt.show()\
"""))

# --- 7. Preprocessing ---
cells.append(md("""\
## 🔧 5. Preprocessing <a id="5-preprocessing"></a>

We'll concatenate the article metadata with the content using special tokens to help BERT understand the structure:

```
[TITLE] title [DESC] description [AUTHOR] author [CAT] category [CONTENT] content
```

This approach preserves the semantic meaning of each field while allowing BERT to process the full context.\
"""))

# Preprocessing: Text concatenation
cells.append(code("""\
def prepare_text(row):
    \"\"\"Concatenate article metadata and content for model input.
    
    Uses special markers to delineate different fields:
    [TITLE] [DESC] [AUTHOR] [CAT] [CONTENT]
    \"\"\"
    parts = [
        f"[TITLE] {row['title']}",
        f"[DESC] {row['description']}",
        f"[AUTHOR] {row['author']}",
        f"[CAT] {row['category']}",
        f"[CONTENT] {row['content']}"
    ]
    return " ".join(parts)

df['input_text'] = df.apply(prepare_text, axis=1)

print("📝 Sample input text (first 500 chars):")
print("-" * 80)
print(df['input_text'].iloc[0][:500])
print("-" * 80)
print(f"\\nTotal input text length stats:")
print(f"  Mean chars: {df['input_text'].str.len().mean():.0f}")
print(f"  Max chars:  {df['input_text'].str.len().max()}")\
"""))

# Preprocessing: Tokenization check
cells.append(code("""\
# --- Initialize Tokenizer ---
print(f"Loading tokenizer: {MODEL_NAME}...")
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
print(f"✅ Tokenizer loaded. Vocab size: {tokenizer.vocab_size:,}")

# Check token lengths to understand truncation impact
print(f"\\n🔢 Analyzing token lengths (this may take a moment)...")
token_lengths = df['input_text'].apply(
    lambda x: len(tokenizer.encode(x, truncation=False))
)

print(f"\\n📊 Token Length Statistics:")
print(f"   Mean:   {token_lengths.mean():.0f} tokens")
print(f"   Median: {token_lengths.median():.0f} tokens")
print(f"   Max:    {token_lengths.max()} tokens")
print(f"   Min:    {token_lengths.min()} tokens")
print(f"   Std:    {token_lengths.std():.0f} tokens")
print(f"\\n   Articles exceeding {MAX_LENGTH} tokens: {(token_lengths > MAX_LENGTH).sum()} "
      f"({(token_lengths > MAX_LENGTH).mean()*100:.1f}%)")
print(f"   ⚠️  These articles will be truncated to {MAX_LENGTH} tokens.")

# Distribution plot
plt.figure(figsize=(10, 4))
plt.hist(token_lengths, bins=50, color='#3498db', alpha=0.8, edgecolor='white')
plt.axvline(MAX_LENGTH, color='#e74c3c', linestyle='--', linewidth=2, label=f'Max Length ({MAX_LENGTH})')
plt.title('Token Length Distribution', fontsize=14, fontweight='bold')
plt.xlabel('Number of Tokens')
plt.ylabel('Frequency')
plt.legend()
plt.tight_layout()
plt.show()\
"""))

# Preprocessing: Train/Val/Test split
cells.append(code("""\
# --- Train / Validation / Test Split ---
# 70% train, 15% validation, 15% test
# Stratify by 'acceptable' to maintain class balance

X = df['input_text'].values
y = df[LABEL_COLUMNS].values

# First split: train (70%) vs temp (30%)
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, random_state=SEED, stratify=df['acceptable']
)

# Second split: val (15%) vs test (15%)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, random_state=SEED
)

print(f"📊 Dataset Splits:")
print(f"   Train:      {len(X_train):4d} articles ({len(X_train)/len(X)*100:.1f}%)")
print(f"   Validation: {len(X_val):4d} articles ({len(X_val)/len(X)*100:.1f}%)")
print(f"   Test:       {len(X_test):4d} articles ({len(X_test)/len(X)*100:.1f}%)")
print(f"   Total:      {len(X):4d} articles")

# Verify label distribution in splits
print(f"\\n📋 Label distribution per split:")
for name, labels in [("Train", y_train), ("Val", y_val), ("Test", y_test)]:
    dist = labels.sum(axis=0)
    print(f"   {name}: {dict(zip(LABEL_COLUMNS, dist.astype(int)))}")\
"""))

# Preprocessing: Dataset class
cells.append(code("""\
# --- PyTorch Dataset ---
class ArticleDataset(Dataset):
    \"\"\"Custom PyTorch Dataset for article classification.\"\"\"
    
    def __init__(self, texts, labels, tokenizer, max_length):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        encoding = self.tokenizer(
            self.texts[idx],
            truncation=True,
            max_length=self.max_length,
            padding='max_length',
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'labels': torch.tensor(self.labels[idx], dtype=torch.float32)
        }

# Create datasets
train_dataset = ArticleDataset(X_train, y_train, tokenizer, MAX_LENGTH)
val_dataset = ArticleDataset(X_val, y_val, tokenizer, MAX_LENGTH)
test_dataset = ArticleDataset(X_test, y_test, tokenizer, MAX_LENGTH)

# Create dataloaders
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

# Verify a batch
sample_batch = next(iter(train_loader))
print(f"✅ DataLoaders created:")
print(f"   Train batches: {len(train_loader)}")
print(f"   Val batches:   {len(val_loader)}")
print(f"   Test batches:  {len(test_loader)}")
print(f"\\n   Sample batch shapes:")
print(f"   input_ids:      {sample_batch['input_ids'].shape}")
print(f"   attention_mask:  {sample_batch['attention_mask'].shape}")
print(f"   labels:          {sample_batch['labels'].shape}")\
"""))

# --- 8. Model Architecture ---
cells.append(md("""\
## 🏗️ 6. Model Architecture <a id="6-model"></a>

We use `BertForSequenceClassification` from HuggingFace with:
- **Base model**: `bert-base-multilingual-cased` (supports 104 languages)
- **Classification head**: Linear layer with 5 outputs (one per label)
- **Problem type**: `multi_label_classification` (uses `BCEWithLogitsLoss` internally)\
"""))

cells.append(code("""\
# --- Load Pre-trained BERT Model ---
print(f"Loading model: {MODEL_NAME}...")
print(f"  num_labels={NUM_LABELS}, problem_type='multi_label_classification'")

model = BertForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_LABELS,
    problem_type="multi_label_classification"
)
model.to(device)

# Model summary
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

print(f"\\n✅ Model loaded and moved to {device}")
print(f"\\n📊 Model Parameters:")
print(f"   Total:     {total_params:>12,}")
print(f"   Trainable: {trainable_params:>12,}")
print(f"   Frozen:    {total_params - trainable_params:>12,}")
print(f"\\n🏗️  Architecture:")
print(f"   Encoder: BERT ({MODEL_NAME})")
print(f"   Hidden size: 768")
print(f"   Attention heads: 12")
print(f"   Layers: 12")
print(f"   Classifier: Linear(768 → {NUM_LABELS})")
print(f"   Loss: BCEWithLogitsLoss (built-in)")\
"""))

# --- 9. Training ---
cells.append(md("""\
## 🚀 7. Training <a id="7-training"></a>

Training configuration:
- **Optimizer**: AdamW with weight decay
- **Scheduler**: Linear warmup + linear decay
- **Gradient clipping**: Max norm = 1.0
- **Metrics**: Macro F1 score tracked per epoch\
"""))

cells.append(code("""\
# --- Training Setup ---
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=WEIGHT_DECAY
)

total_steps = len(train_loader) * NUM_EPOCHS
warmup_steps = int(WARMUP_RATIO * total_steps)

scheduler = get_linear_schedule_with_warmup(
    optimizer,
    num_warmup_steps=warmup_steps,
    num_training_steps=total_steps
)

print(f"🔧 Training Setup:")
print(f"   Optimizer: AdamW (lr={LEARNING_RATE}, wd={WEIGHT_DECAY})")
print(f"   Total steps: {total_steps}")
print(f"   Warmup steps: {warmup_steps}")
print(f"   Gradient clipping: {MAX_GRAD_NORM}")\
"""))

cells.append(code("""\
# --- Helper Functions ---
def compute_metrics(preds, labels, threshold=THRESHOLD):
    \"\"\"Compute classification metrics from logits and labels.\"\"\"
    probs = torch.sigmoid(preds)
    preds_binary = (probs >= threshold).int().cpu().numpy()
    labels_np = labels.int().cpu().numpy()
    
    macro_f1 = f1_score(labels_np, preds_binary, average='macro', zero_division=0)
    micro_f1 = f1_score(labels_np, preds_binary, average='micro', zero_division=0)
    per_class_f1 = f1_score(labels_np, preds_binary, average=None, zero_division=0)
    
    return {
        'macro_f1': macro_f1,
        'micro_f1': micro_f1,
        'per_class_f1': dict(zip(LABEL_COLUMNS, per_class_f1))
    }


def evaluate_model(model, data_loader, device):
    \"\"\"Evaluate model on a data loader. Returns loss and metrics.\"\"\"
    model.eval()
    total_loss = 0
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for batch in data_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )
            
            total_loss += outputs.loss.item()
            all_preds.append(outputs.logits)
            all_labels.append(labels)
    
    all_preds = torch.cat(all_preds)
    all_labels = torch.cat(all_labels)
    avg_loss = total_loss / len(data_loader)
    metrics = compute_metrics(all_preds, all_labels)
    
    return avg_loss, metrics, all_preds, all_labels

print("✅ Helper functions defined.")\
"""))

# Training loop
cells.append(code("""\
# === Training Loop ===
history = {
    'train_loss': [], 'val_loss': [],
    'train_macro_f1': [], 'val_macro_f1': [],
    'train_micro_f1': [], 'val_micro_f1': [],
    'learning_rates': []
}

best_val_f1 = 0.0
best_epoch = 0

print("=" * 80)
print(f"{'TRAINING STARTED':^80}")
print("=" * 80)
print(f"{'Epoch':<8} {'Train Loss':<12} {'Val Loss':<12} {'Train F1':<12} {'Val F1':<12} {'LR':<12}")
print("-" * 80)

for epoch in range(NUM_EPOCHS):
    # --- Training Phase ---
    model.train()
    train_losses = []
    train_preds_all = []
    train_labels_all = []
    
    for batch_idx, batch in enumerate(train_loader):
        optimizer.zero_grad()
        
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels'].to(device)
        
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels
        )
        
        loss = outputs.loss
        loss.backward()
        
        # Gradient clipping
        torch.nn.utils.clip_grad_norm_(model.parameters(), MAX_GRAD_NORM)
        
        optimizer.step()
        scheduler.step()
        
        train_losses.append(loss.item())
        train_preds_all.append(outputs.logits.detach())
        train_labels_all.append(labels.detach())
    
    # Compute training metrics
    train_preds_all = torch.cat(train_preds_all)
    train_labels_all = torch.cat(train_labels_all)
    train_metrics = compute_metrics(train_preds_all, train_labels_all)
    avg_train_loss = np.mean(train_losses)
    
    # --- Validation Phase ---
    avg_val_loss, val_metrics, _, _ = evaluate_model(model, val_loader, device)
    
    # Current learning rate
    current_lr = scheduler.get_last_lr()[0]
    
    # Save history
    history['train_loss'].append(avg_train_loss)
    history['val_loss'].append(avg_val_loss)
    history['train_macro_f1'].append(train_metrics['macro_f1'])
    history['val_macro_f1'].append(val_metrics['macro_f1'])
    history['train_micro_f1'].append(train_metrics['micro_f1'])
    history['val_micro_f1'].append(val_metrics['micro_f1'])
    history['learning_rates'].append(current_lr)
    
    # Track best model
    if val_metrics['macro_f1'] > best_val_f1:
        best_val_f1 = val_metrics['macro_f1']
        best_epoch = epoch + 1
        # Save best model
        os.makedirs(MODEL_SAVE_DIR, exist_ok=True)
        model.save_pretrained(os.path.join(MODEL_SAVE_DIR, "best"))
        tokenizer.save_pretrained(os.path.join(MODEL_SAVE_DIR, "best"))
    
    print(f"{epoch+1:<8} {avg_train_loss:<12.4f} {avg_val_loss:<12.4f} "
          f"{train_metrics['macro_f1']:<12.4f} {val_metrics['macro_f1']:<12.4f} "
          f"{current_lr:<12.2e}")

print("-" * 80)
print(f"\\n🏆 Best model at epoch {best_epoch} with Val Macro F1: {best_val_f1:.4f}")
print(f"   Saved to: {MODEL_SAVE_DIR}/best/")\
"""))

# Training curves
cells.append(code("""\
# --- Plot Training Curves ---
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
epochs_range = range(1, NUM_EPOCHS + 1)

# Loss curves
axes[0].plot(epochs_range, history['train_loss'], 'o-', color='#3498db', linewidth=2, markersize=6, label='Train Loss')
axes[0].plot(epochs_range, history['val_loss'], 's-', color='#e74c3c', linewidth=2, markersize=6, label='Val Loss')
axes[0].set_title('Loss Curves', fontsize=14, fontweight='bold')
axes[0].set_xlabel('Epoch')
axes[0].set_ylabel('Loss')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# F1 curves
axes[1].plot(epochs_range, history['train_macro_f1'], 'o-', color='#3498db', linewidth=2, markersize=6, label='Train Macro F1')
axes[1].plot(epochs_range, history['val_macro_f1'], 's-', color='#e74c3c', linewidth=2, markersize=6, label='Val Macro F1')
axes[1].plot(epochs_range, history['train_micro_f1'], 'o--', color='#3498db', linewidth=1.5, markersize=4, alpha=0.5, label='Train Micro F1')
axes[1].plot(epochs_range, history['val_micro_f1'], 's--', color='#e74c3c', linewidth=1.5, markersize=4, alpha=0.5, label='Val Micro F1')
axes[1].set_title('F1 Score Curves', fontsize=14, fontweight='bold')
axes[1].set_xlabel('Epoch')
axes[1].set_ylabel('F1 Score')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

# Learning rate
axes[2].plot(epochs_range, history['learning_rates'], 'o-', color='#2ecc71', linewidth=2, markersize=6)
axes[2].set_title('Learning Rate Schedule', fontsize=14, fontweight='bold')
axes[2].set_xlabel('Epoch')
axes[2].set_ylabel('Learning Rate')
axes[2].ticklabel_format(style='scientific', axis='y', scilimits=(0,0))
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()\
"""))

# --- 10. Evaluation ---
cells.append(md("""\
## 📈 8. Evaluation <a id="8-evaluation"></a>

Evaluate the best model on the held-out test set.\
"""))

cells.append(code("""\
# --- Load Best Model & Evaluate on Test Set ---
print("Loading best model for evaluation...")
best_model = BertForSequenceClassification.from_pretrained(
    os.path.join(MODEL_SAVE_DIR, "best")
)
best_model.to(device)

test_loss, test_metrics, test_preds, test_labels = evaluate_model(
    best_model, test_loader, device
)

print(f"\\n{'='*60}")
print(f"{'TEST SET RESULTS':^60}")
print(f"{'='*60}")
print(f"\\n  Test Loss:      {test_loss:.4f}")
print(f"  Macro F1:       {test_metrics['macro_f1']:.4f}")
print(f"  Micro F1:       {test_metrics['micro_f1']:.4f}")
print(f"\\n  Per-class F1 scores:")
for label, f1 in test_metrics['per_class_f1'].items():
    bar = '█' * int(f1 * 30)
    print(f"    {label:>20s}: {f1:.4f} |{bar}|")\
"""))

cells.append(code("""\
# --- Detailed Classification Report ---
test_probs = torch.sigmoid(test_preds)
test_preds_binary = (test_probs >= THRESHOLD).int().cpu().numpy()
test_labels_np = test_labels.int().cpu().numpy()

print("📋 Detailed Classification Report (per label):")
print("=" * 70)
report = classification_report(
    test_labels_np, test_preds_binary,
    target_names=LABEL_COLUMNS,
    zero_division=0
)
print(report)\
"""))

cells.append(code("""\
# --- Per-class F1 Bar Chart ---
per_class_f1 = f1_score(test_labels_np, test_preds_binary, average=None, zero_division=0)
per_class_precision = precision_score(test_labels_np, test_preds_binary, average=None, zero_division=0)
per_class_recall = recall_score(test_labels_np, test_preds_binary, average=None, zero_division=0)

fig, ax = plt.subplots(figsize=(12, 6))

x = np.arange(len(LABEL_COLUMNS))
width = 0.25

bars1 = ax.bar(x - width, per_class_precision, width, label='Precision', color='#3498db', alpha=0.8)
bars2 = ax.bar(x, per_class_recall, width, label='Recall', color='#2ecc71', alpha=0.8)
bars3 = ax.bar(x + width, per_class_f1, width, label='F1 Score', color='#e74c3c', alpha=0.8)

ax.set_xlabel('Label', fontsize=12)
ax.set_ylabel('Score', fontsize=12)
ax.set_title('Precision / Recall / F1 Score per Label', fontsize=14, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(LABEL_COLUMNS, rotation=15)
ax.legend()
ax.set_ylim(0, 1.1)
ax.grid(axis='y', alpha=0.3)

# Add value labels
for bars in [bars1, bars2, bars3]:
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}', xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9)

plt.tight_layout()
plt.show()\
"""))

cells.append(code("""\
# --- Multi-label Confusion Matrices ---
mcm = multilabel_confusion_matrix(test_labels_np, test_preds_binary)

fig, axes = plt.subplots(1, NUM_LABELS, figsize=(20, 4))

for i, (label, cm) in enumerate(zip(LABEL_COLUMNS, mcm)):
    sns.heatmap(
        cm, annot=True, fmt='d', cmap='Blues',
        xticklabels=['Neg', 'Pos'], yticklabels=['Neg', 'Pos'],
        ax=axes[i], cbar=False
    )
    axes[i].set_title(f'{label}', fontsize=12, fontweight='bold')
    axes[i].set_ylabel('True' if i == 0 else '')
    axes[i].set_xlabel('Predicted')

plt.suptitle('Confusion Matrices per Label', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()\
"""))

# --- 11. Inference ---
cells.append(md("""\
## 🔮 9. Inference <a id="9-inference"></a>

The inference function takes an article's metadata and content, processes it through the model, and returns probabilities for each label with a configurable threshold.

**Decision Logic:**
- If **any** negative label exceeds the threshold → Send to **human review**
- If **only** `acceptable` exceeds the threshold → **Auto-publish**\
"""))

cells.append(code("""\
def predict_article(title, description, content, author, category,
                    model=best_model, tokenizer=tokenizer,
                    threshold=THRESHOLD, device=device):
    \"\"\"
    Predict content moderation labels for a single article.
    
    Args:
        title: Article title
        description: Article description/summary
        content: Article main content
        author: Author name
        category: Blog category
        model: Trained BERT model
        tokenizer: BERT tokenizer
        threshold: Classification threshold (default 0.5)
        device: torch device
    
    Returns:
        dict with probabilities and predicted labels
    \"\"\"
    # Prepare input text
    input_text = (
        f"[TITLE] {title} "
        f"[DESC] {description} "
        f"[AUTHOR] {author} "
        f"[CAT] {category} "
        f"[CONTENT] {content}"
    )
    
    # Tokenize
    encoding = tokenizer(
        input_text,
        truncation=True,
        max_length=MAX_LENGTH,
        padding='max_length',
        return_tensors='pt'
    )
    
    # Predict
    model.eval()
    with torch.no_grad():
        input_ids = encoding['input_ids'].to(device)
        attention_mask = encoding['attention_mask'].to(device)
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        probs = torch.sigmoid(outputs.logits).cpu().numpy()[0]
    
    # Build results
    predictions = {}
    active_labels = []
    for label, prob in zip(LABEL_COLUMNS, probs):
        is_active = prob >= threshold
        predictions[label] = {
            'probability': float(prob),
            'active': bool(is_active)
        }
        if is_active:
            active_labels.append(label)
    
    # Determine action
    negative_labels = [l for l in active_labels if l != 'acceptable']
    if negative_labels:
        action = "🚫 SEND TO HUMAN REVIEW"
        reason = f"Flagged: {', '.join(negative_labels)}"
    elif 'acceptable' in active_labels:
        action = "✅ AUTO-PUBLISH"
        reason = "Content is acceptable"
    else:
        action = "⚠️ UNCERTAIN - MANUAL REVIEW"
        reason = "No label exceeded threshold"
    
    return {
        'predictions': predictions,
        'active_labels': active_labels,
        'action': action,
        'reason': reason
    }


def display_prediction(result, title=""):
    \"\"\"Pretty-print prediction results.\"\"\"
    print(f"\\n{'='*60}")
    if title:
        print(f"📄 {title[:57]}")
        print(f"{'='*60}")
    
    print(f"\\n  {'Label':<22} {'Probability':>12} {'Status':>10}")
    print(f"  {'-'*44}")
    for label, info in result['predictions'].items():
        status = "✅ YES" if info['active'] else "❌ No"
        bar = '▓' * int(info['probability'] * 20)
        bar += '░' * (20 - int(info['probability'] * 20))
        print(f"  {label:<22} {info['probability']:>8.4f}    {status}  {bar}")
    
    print(f"\\n  🎯 Action: {result['action']}")
    print(f"  📝 Reason: {result['reason']}")

print("✅ Inference functions defined.")\
"""))

# Example predictions
cells.append(code("""\
# === Example Predictions ===

# 1. Acceptable tech article
result_1 = predict_article(
    title="Introducción a Docker: Containerización para Desarrolladores",
    description="Aprende los conceptos fundamentales de Docker y cómo usar contenedores en tus proyectos.",
    content="Docker es una plataforma de containerización que permite empaquetar aplicaciones y sus dependencias "
            "en contenedores ligeros y portables. Con Docker, los desarrolladores pueden asegurar que su aplicación "
            "funciona de la misma manera en desarrollo, staging y producción. Los contenedores comparten el kernel "
            "del sistema operativo host, lo que los hace mucho más eficientes que las máquinas virtuales tradicionales. "
            "Para comenzar, instala Docker Desktop y crea tu primer Dockerfile.",
    author="Carlos Mendoza",
    category="DevOps"
)
display_prediction(result_1, "Introducción a Docker: Containerización para Desarrolladores")

# 2. Spam article
result_2 = predict_article(
    title="¡¡¡GANA $10,000 AHORA SIN HACER NADA!!!",
    description="OFERTA LIMITADA - DINERO GRATIS - CLICK AQUÍ AHORA!!!",
    content="¡¡¡ACTÚA AHORA!!! Gana $10,000 dólares diarios sin mover un dedo. Solo necesitas registrarte "
            "en nuestro sitio web y comenzar a recibir pagos inmediatos. 100% GARANTIZADO O TE DEVOLVEMOS "
            "TU DINERO. No esperes más, esta oferta es POR TIEMPO LIMITADO. COMPRA AHORA!!!",
    author="Anonymous",
    category="General"
)
display_prediction(result_2, "¡¡¡GANA $10,000 AHORA SIN HACER NADA!!!")

# 3. Hate speech article
result_3 = predict_article(
    title="Why Certain Groups Should Not Have Equal Rights",
    description="An argument for excluding marginalized communities from the workplace.",
    content="People from certain racial backgrounds are inherently less capable in technology fields. "
            "Diversity hiring is destroying the quality of our industry. Only certain demographics "
            "have the intellectual capacity for engineering. Companies should stop forced inclusion "
            "programs that prioritize inferior groups over merit and traditional values.",
    author="Guest Author",
    category="General"
)
display_prediction(result_3, "Why Certain Groups Should Not Have Equal Rights")\
"""))

# --- 12. Threshold Analysis ---
cells.append(md("""\
### Threshold Sensitivity Analysis

The decision threshold significantly affects precision/recall tradeoff. Let's analyze different thresholds:\
"""))

cells.append(code("""\
# --- Threshold Analysis ---
thresholds = np.arange(0.1, 0.91, 0.05)
threshold_results = []

for t in thresholds:
    preds_at_t = (test_probs >= t).int().cpu().numpy()
    macro_f1 = f1_score(test_labels_np, preds_at_t, average='macro', zero_division=0)
    micro_f1 = f1_score(test_labels_np, preds_at_t, average='micro', zero_division=0)
    precision = precision_score(test_labels_np, preds_at_t, average='macro', zero_division=0)
    recall = recall_score(test_labels_np, preds_at_t, average='macro', zero_division=0)
    threshold_results.append({
        'threshold': t, 'macro_f1': macro_f1, 'micro_f1': micro_f1,
        'precision': precision, 'recall': recall
    })

tr_df = pd.DataFrame(threshold_results)

fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(tr_df['threshold'], tr_df['macro_f1'], 'o-', linewidth=2, markersize=5, label='Macro F1', color='#e74c3c')
ax.plot(tr_df['threshold'], tr_df['micro_f1'], 's-', linewidth=2, markersize=5, label='Micro F1', color='#3498db')
ax.plot(tr_df['threshold'], tr_df['precision'], '^--', linewidth=1.5, markersize=4, label='Precision', color='#2ecc71', alpha=0.7)
ax.plot(tr_df['threshold'], tr_df['recall'], 'v--', linewidth=1.5, markersize=4, label='Recall', color='#f39c12', alpha=0.7)

# Mark current threshold
ax.axvline(THRESHOLD, color='gray', linestyle=':', linewidth=2, alpha=0.5, label=f'Current ({THRESHOLD})')

# Mark best threshold
best_idx = tr_df['macro_f1'].idxmax()
best_t = tr_df.loc[best_idx, 'threshold']
best_f1 = tr_df.loc[best_idx, 'macro_f1']
ax.scatter([best_t], [best_f1], s=200, color='#e74c3c', zorder=5, edgecolors='black', linewidth=2)
ax.annotate(f'Best: t={best_t:.2f}, F1={best_f1:.3f}',
            xy=(best_t, best_f1), xytext=(best_t + 0.08, best_f1 - 0.05),
            fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='black'))

ax.set_xlabel('Threshold', fontsize=12)
ax.set_ylabel('Score', fontsize=12)
ax.set_title('Threshold Sensitivity Analysis', fontsize=14, fontweight='bold', pad=15)
ax.legend(loc='best')
ax.grid(True, alpha=0.3)
ax.set_xlim(0.05, 0.95)
ax.set_ylim(0, 1.05)

plt.tight_layout()
plt.show()

print(f"\\n🎯 Optimal threshold: {best_t:.2f} (Macro F1 = {best_f1:.4f})")\
"""))

# --- 13. Export Phase 1: Save PyTorch Model ---
cells.append(md("""\
## 💾 10. Model Export <a id="10-export"></a>

Export pipeline with 4 phases:

1. **Phase 1** — Save the final PyTorch model and training history
2. **Phase 2** — Convert PyTorch → ONNX (via `optimum`)
3. **Phase 3** — Convert ONNX → TensorFlow SavedModel (via `onnx2tf`)
4. **Phase 4** — Convert TensorFlow → TensorFlow.js (via `tensorflowjs_converter`)

> ⚠️ **Why not `TFBertForSequenceClassification`?**  
> Starting with `transformers` v5, HuggingFace removed native TensorFlow model classes.
> The recommended path is now: **PyTorch → ONNX → TF SavedModel → TF.js**

### Additional Dependencies for Export

```bash
# Phase 2: ONNX export
pip install optimum[exporters] onnx onnxruntime

# Phase 3: ONNX → TF SavedModel
pip install onnx2tf tensorflow

# Phase 4: TF → TF.js
pip install tensorflowjs
```\
"""))

cells.append(code("""\
# === Phase 1: Save Final PyTorch Model ===
final_save_path = os.path.join(MODEL_SAVE_DIR, "final")
os.makedirs(final_save_path, exist_ok=True)

model.save_pretrained(final_save_path)
tokenizer.save_pretrained(final_save_path)

print(f"✅ Phase 1 Complete — PyTorch model saved")
print(f"   Best model:  {os.path.join(MODEL_SAVE_DIR, 'best')}/")
print(f"   Final model: {final_save_path}/")
print(f"\\n📁 Model files:")
for f in os.listdir(final_save_path):
    size = os.path.getsize(os.path.join(final_save_path, f))
    print(f"   {f:40s} ({size/1e6:.1f} MB)" if size > 1e6 else f"   {f:40s} ({size/1e3:.1f} KB)")

# Save training history
import json as json_lib
history_path = os.path.join(MODEL_SAVE_DIR, "training_history.json")
with open(history_path, "w") as hf:
    json_lib.dump(history, hf, indent=2)
print(f"\\n📊 Training history saved to: {history_path}")\
"""))

# --- 13b. Export Phase 2: PyTorch → ONNX ---
cells.append(md("""\
### Phase 2: PyTorch → ONNX

We use the `optimum` library from HuggingFace to export the PyTorch model to ONNX format.
This is the **officially recommended** export path since `transformers` v5 dropped native
TensorFlow model support.

ONNX (Open Neural Network Exchange) is an interoperable format that serves as a bridge
between PyTorch and TensorFlow/TF.js.\
"""))

cells.append(code("""\
# === Phase 2: Convert PyTorch → ONNX ===
from optimum.exporters.onnx import main_export

PT_MODEL_PATH = os.path.join(MODEL_SAVE_DIR, "best")
ONNX_MODEL_DIR = os.path.join(MODEL_SAVE_DIR, "onnx_model")
os.makedirs(ONNX_MODEL_DIR, exist_ok=True)

print(f"🚀 Exporting PyTorch model to ONNX...")
print(f"   Source: {PT_MODEL_PATH}")
print(f"   Output: {ONNX_MODEL_DIR}")

# Export using optimum (handles all BERT-specific graph tracing)
main_export(
    model_name_or_path=PT_MODEL_PATH,
    output=ONNX_MODEL_DIR,
    task="text-classification",
)

print(f"\\n✅ Phase 2 Complete — ONNX model exported")
print(f"\\n📁 ONNX model files:")
for f in sorted(os.listdir(ONNX_MODEL_DIR)):
    fpath = os.path.join(ONNX_MODEL_DIR, f)
    if os.path.isfile(fpath):
        size = os.path.getsize(fpath)
        print(f"   {f:40s} ({size/1e6:.1f} MB)" if size > 1e6 else f"   {f:40s} ({size/1e3:.1f} KB)")\
"""))

# --- 13c. Verify ONNX model ---
cells.append(md("""\
### Verify ONNX Model

Compare ONNX Runtime predictions with the original PyTorch model to ensure
the conversion didn't introduce errors.\
"""))

cells.append(code("""\
# === Verify ONNX Model ===
import onnxruntime as ort
import numpy as np

print("🔍 Verifying ONNX model produces consistent predictions...")

# Create ONNX Runtime session
onnx_model_path = os.path.join(ONNX_MODEL_DIR, "model.onnx")
ort_session = ort.InferenceSession(onnx_model_path)

# Tokenize a sample article
sample_text = (
    "[TITLE] Introducción a Docker [DESC] Guía de containerización "
    "[AUTHOR] Carlos [CAT] DevOps [CONTENT] Docker es una plataforma "
    "de containerización que permite empaquetar aplicaciones."
)
sample_encoding = tokenizer(
    sample_text,
    truncation=True,
    max_length=MAX_LENGTH,
    padding="max_length",
    return_tensors="np"  # NumPy for ONNX Runtime
)

# ONNX Runtime prediction
ort_inputs = {
    "input_ids": sample_encoding["input_ids"],
    "attention_mask": sample_encoding["attention_mask"],
}
# Add token_type_ids if the model expects it
if "token_type_ids" in [inp.name for inp in ort_session.get_inputs()]:
    ort_inputs["token_type_ids"] = sample_encoding.get(
        "token_type_ids", np.zeros_like(sample_encoding["input_ids"])
    )

ort_outputs = ort_session.run(None, ort_inputs)
onnx_logits = ort_outputs[0][0]

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

onnx_probs = sigmoid(onnx_logits)

# PyTorch prediction (for comparison)
pt_encoding = tokenizer(
    sample_text,
    truncation=True,
    max_length=MAX_LENGTH,
    padding="max_length",
    return_tensors="pt"
)
best_model.eval()
with torch.no_grad():
    pt_outputs = best_model(
        input_ids=pt_encoding['input_ids'].to(device),
        attention_mask=pt_encoding['attention_mask'].to(device)
    )
    pt_probs = torch.sigmoid(pt_outputs.logits).cpu().numpy()[0]

print(f"\\n{'Label':<22} {'PyTorch':>10} {'ONNX':>10} {'Diff':>10}")
print("-" * 55)
for label, pt_p, ox_p in zip(LABEL_COLUMNS, pt_probs, onnx_probs):
    diff = abs(pt_p - ox_p)
    status = "✅" if diff < 0.001 else "⚠️"
    print(f"{label:<22} {pt_p:>10.6f} {ox_p:>10.6f} {diff:>10.8f} {status}")

max_diff = float(max(abs(pt_probs - onnx_probs)))
print(f"\\nMax absolute difference: {max_diff:.10f}")
if max_diff < 0.001:
    print("✅ ONNX model is consistent with PyTorch (diff < 0.001)")
else:
    print("⚠️  Some difference detected — may be due to floating point precision")\
"""))

# --- 13d. Export Phase 3: ONNX → TF SavedModel ---
cells.append(md("""\
### Phase 3: ONNX → TensorFlow SavedModel

Convert the ONNX model to a TensorFlow SavedModel using `onnx2tf`.
This tool handles the operator mapping between ONNX and TensorFlow graphs.\
"""))

cells.append(code("""\
# === Phase 3: Convert ONNX → TensorFlow SavedModel ===
import subprocess

TF_MODEL_DIR = os.path.join(MODEL_SAVE_DIR, "tf_saved_model")
onnx_model_path = os.path.join(ONNX_MODEL_DIR, "model.onnx")

print(f"🚀 Converting ONNX → TensorFlow SavedModel...")
print(f"   Input:  {onnx_model_path}")
print(f"   Output: {TF_MODEL_DIR}")

try:
    result = subprocess.run(
        [
            "onnx2tf",
            "-i", onnx_model_path,
            "-o", TF_MODEL_DIR,
            "-osd",  # Output SavedModel format
        ],
        capture_output=True,
        text=True,
        timeout=600
    )

    if result.returncode == 0:
        print(f"\\n✅ Phase 3 Complete — TF SavedModel saved to '{TF_MODEL_DIR}/'")
    else:
        print(f"\\n❌ Conversion failed (return code {result.returncode})")
        if result.stderr:
            print(f"   stderr: {result.stderr[:800]}")
        if result.stdout:
            print(f"   stdout: {result.stdout[:800]}")
        print("\\n💡 Troubleshooting:")
        print("   1. pip install -U onnx2tf tensorflow")
        print("   2. Check ONNX opset compatibility")

except FileNotFoundError:
    print("\\n❌ onnx2tf not found! Install with: pip install onnx2tf")

except subprocess.TimeoutExpired:
    print("\\n⏰ Conversion timed out (>10 minutes)")
    print(f"   Try manually: onnx2tf -i {onnx_model_path} -o {TF_MODEL_DIR} -osd")

# List output
if os.path.exists(TF_MODEL_DIR):
    print(f"\\n📁 TF SavedModel contents:")
    for root, dirs, files in os.walk(TF_MODEL_DIR):
        level = root.replace(TF_MODEL_DIR, '').count(os.sep)
        indent = '   ' + '  ' * level
        print(f"{indent}{os.path.basename(root)}/")
        for f in files[:10]:  # limit output
            fpath = os.path.join(root, f)
            size = os.path.getsize(fpath)
            print(f"{indent}  {f} ({size/1e6:.1f} MB)" if size > 1e6 else f"{indent}  {f} ({size/1e3:.1f} KB)")\
"""))

# --- 13e. Export Phase 4: TF SavedModel → TF.js ---
cells.append(md("""\
### Phase 4: TensorFlow SavedModel → TensorFlow.js

Convert the TF SavedModel to TensorFlow.js format for browser deployment.
The output will be a `model.json` file + binary weight shards that can be loaded
with `tf.loadGraphModel()` in the browser.\
"""))

cells.append(code("""\
# === Phase 4: Convert TF SavedModel → TensorFlow.js ===
import subprocess

TFJS_MODEL_DIR = os.path.join(MODEL_SAVE_DIR, "tfjs_model")
os.makedirs(TFJS_MODEL_DIR, exist_ok=True)

print(f"🚀 Converting TF SavedModel → TensorFlow.js...")
print(f"   Input:  {TF_MODEL_DIR}")
print(f"   Output: {TFJS_MODEL_DIR}")

try:
    result = subprocess.run(
        [
            "tensorflowjs_converter",
            "--input_format=tf_saved_model",
            "--output_format=tfjs_graph_model",
            "--saved_model_tags=serve",
            "--weight_shard_size_bytes=4194304",  # 4MB shards
            TF_MODEL_DIR,
            TFJS_MODEL_DIR
        ],
        capture_output=True,
        text=True,
        timeout=300
    )

    if result.returncode == 0:
        print(f"\\n✅ Phase 4 Complete — TF.js model saved to '{TFJS_MODEL_DIR}/'")
    else:
        print(f"\\n❌ Conversion failed (return code {result.returncode})")
        if result.stderr:
            print(f"   Error: {result.stderr[:500]}")
        print("\\n💡 Troubleshooting:")
        print("   1. pip install -U tensorflowjs")
        print("   2. Verify TF SavedModel exists and has 'serve' tag")
        print("   3. Try: tensorflowjs_converter --input_format=tf_saved_model "
              f"{TF_MODEL_DIR} {TFJS_MODEL_DIR}")

except FileNotFoundError:
    print("\\n❌ tensorflowjs_converter not found!")
    print("   Install: pip install tensorflowjs")

except subprocess.TimeoutExpired:
    print("\\n⏰ Conversion timed out (>5 minutes)")
    print(f"   Try manually: tensorflowjs_converter --input_format=tf_saved_model "
          f"{TF_MODEL_DIR} {TFJS_MODEL_DIR}")

# List output files
if os.path.exists(TFJS_MODEL_DIR) and os.listdir(TFJS_MODEL_DIR):
    print(f"\\n📁 TensorFlow.js model files:")
    total_size = 0
    for f in sorted(os.listdir(TFJS_MODEL_DIR)):
        fpath = os.path.join(TFJS_MODEL_DIR, f)
        if os.path.isfile(fpath):
            size = os.path.getsize(fpath)
            total_size += size
            print(f"   {f:40s} ({size/1e6:.1f} MB)" if size > 1e6 else f"   {f:40s} ({size/1e3:.1f} KB)")
    print(f"   {'─' * 40}")
    print(f"   {'TOTAL':40s} ({total_size/1e6:.1f} MB)")\
"""))

# --- 13f. Copy tokenizer for TFJS deployment ---
cells.append(code("""\
# === Copy Tokenizer Files for TF.js Deployment ===
# The TF.js model needs the tokenizer files alongside it for browser inference
import shutil

PT_MODEL_PATH = os.path.join(MODEL_SAVE_DIR, "best")
TFJS_TOKENIZER_DIR = os.path.join(TFJS_MODEL_DIR, "tokenizer")
os.makedirs(TFJS_TOKENIZER_DIR, exist_ok=True)

tokenizer_files = ["vocab.txt", "tokenizer_config.json", "special_tokens_map.json"]
copied = []
for fname in tokenizer_files:
    src = os.path.join(PT_MODEL_PATH, fname)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(TFJS_TOKENIZER_DIR, fname))
        copied.append(fname)

print(f"✅ Tokenizer files copied to '{TFJS_TOKENIZER_DIR}/':")
for fname in copied:
    print(f"   {fname}")

print(f"\\n📋 Deployment checklist:")
print(f"   ✅ TF.js model:    {TFJS_MODEL_DIR}/model.json")
print(f"   ✅ Weight shards:  {TFJS_MODEL_DIR}/*.bin")
print(f"   ✅ Tokenizer:      {TFJS_TOKENIZER_DIR}/vocab.txt")
print(f"\\n🌐 Load in browser with:")
print(f'   const model = await tf.loadGraphModel("path/to/model.json");')\
"""))

# --- 13g. Export summary ---
cells.append(md("""\
### 📋 Export Summary

| Phase | Format | Location | Size |
|-------|--------|----------|------|
| 1 | PyTorch (best) | `models/article_classifier/best/` | ~700 MB |
| 1 | PyTorch (final) | `models/article_classifier/final/` | ~700 MB |
| 2 | ONNX | `models/article_classifier/onnx_model/` | ~700 MB |
| 3 | TF SavedModel | `models/article_classifier/tf_saved_model/` | ~700 MB |
| 4 | **TensorFlow.js** | `models/article_classifier/tfjs_model/` | **~350 MB** |

> **Conversion pipeline**: `PyTorch → ONNX → TF SavedModel → TF.js`
>
> **For production deployment**, the TF.js model can be further optimized:
> - **Quantization**: Use `--quantize_uint8` flag in `tensorflowjs_converter` to reduce size by ~4x
> - **Pruning**: Remove unused layers if only classification head is needed
> - **DistilBERT**: Consider using `distilbert-base-multilingual-cased` for a ~40% smaller model\
"""))

# --- 14. Next Steps ---
cells.append(md("""\
## 🚀 Next Steps

### Short Term
1. **Increase dataset size** — Use a larger, human-curated dataset for production training
2. **Fine-tune threshold** — Use the threshold analysis above to pick the optimal value
3. **Integrate with Strapi** — Add a pre-publish hook that calls the TF.js model for moderation
4. **Optimize model size** — Try quantization or DistilBERT for faster browser inference

### Medium Term
5. **Active learning** — Flag uncertain predictions for human review to improve the dataset
6. **Hyperparameter tuning** — Experiment with learning rate, batch size, and epochs
7. **Data augmentation** — Use back-translation and synonym replacement for minority classes

### Long Term
8. **Multimodal classification** — Add CLIP/ViT embeddings for article cover images
9. **Streaming inference** — Implement real-time classification as users type
10. **Model monitoring** — Track prediction drift and retrain periodically

---

*Generated with ❤️ for the Society Systems Blog*\
"""))

# =========================================================================
# Assemble and write notebook
# =========================================================================

def main():
    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {"name": "ipython", "version": 3},
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbformat_minor": 2,
                "pygments_lexer": "ipython3",
                "version": "3.11.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 5
    }

    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "article_classifier.ipynb"
    )

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(notebook, f, indent=1, ensure_ascii=False)

    print(f"✅ Notebook generated: {output_path}")
    print(f"   Total cells: {len(cells)}")
    print(f"   Markdown cells: {sum(1 for c in cells if c['cell_type'] == 'markdown')}")
    print(f"   Code cells: {sum(1 for c in cells if c['cell_type'] == 'code')}")


if __name__ == "__main__":
    main()
