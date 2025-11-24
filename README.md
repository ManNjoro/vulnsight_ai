# Vulnsight AI

## AI-Powered Vulnerability Exploit Prediction System

Vulnsight AI is a machine-learning system that predicts which software vulnerabilities (CVEs) are likely to be exploited in the real world.
This helps security teams prioritize patching and reduce real-world security risks.

## Overview

Organizations receive thousands of vulnerability alerts, but only a small fraction are actually exploited by attackers.
Traditional metrics (e.g., CVSS) do not predict exploitation risk.

Vulnsight AI uses machine learning — trained on real vulnerability intelligence data such as EPSS and CISA KEV — to estimate the likelihood that a vulnerability will be exploited.

## Why This Matters

- Many vulnerabilities are never exploited; patching all of them wastes time and resources.

- Attackers often exploit CVEs within days or hours of publication.

- Security teams need a way to focus on what actually matters.

This tool ranks vulnerabilities by predicted exploitation risk so that high-impact CVEs are patched first.

## Features

- Predicts real-world exploitation likelihood (0/1 classification).

- Accepts CSV exports from scanners like Nessus, Qualys, OpenVAS, and Tenable.

- Automatic preprocessing and feature extraction.

- Generates risk scores and predictions.

- Includes feature importance insights (optional SHAP).

- React dashboard for viewing ranked vulnerabilities.

## Dataset

The training data is created by merging:

- NVD (National Vulnerability Database)

- CISA Known Exploited Vulnerabilities (KEV)

- EPSS (Exploit Prediction Scoring System)

## Model

**Algorithm:** XGBoost Classifier

**Goal:** Predict real-world exploitation of vulnerabilities.

**Key metrics:**

- ROC-AUC: 0.968

- Recall (exploited class): 0.83

- Precision (exploited class): expectedly low due to heavy class imbalance

- Excellent ranking performance for top high-risk CVEs

Random Forest was also tested; XGBoost performed slightly better.

## How It Works

1. User uploads a CSV file of vulnerabilities.

2. Backend validates and preprocesses the data (encodes categories, extracts features, aligns schema).

3. XGBoost model predicts exploitation probability.

4. Backend returns prediction results as JSON.

5. Frontend displays a ranked list of vulnerabilities with risk levels.

## Installation
### Clone
```bash
git clone https://github.com/ManNjoro/vulnsight_ai.git
cd backend
```
### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### Frontend Setup
```bash
cd frontend
npm install
npm run dev

```