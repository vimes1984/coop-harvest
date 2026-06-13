#!/bin/bash
#
# Growers' Collective - GCP Cloud Run Production Deployment Script
#
set -euo pipefail

# 1. Configurable Variables (Modify these for your setup)
PROJECT_ID="YOUR_GCP_PROJECT_ID"
REGION="europe-west1" # Dublin/Ireland region is europe-west1
REPO_NAME="growers-collective"
MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"

echo "====================================================="
echo "   Growers' Collective GCP Cloud Run Deployer        "
echo "====================================================="

# Check gcloud is installed
if ! command -v gcloud &>/dev/null; then
    echo "Error: gcloud CLI is not installed or not in PATH." >&2
    echo "Please run this script from a terminal with Google Cloud SDK installed." >&2
    exit 1
fi

# Ensure project is set
gcloud config set project "$PROJECT_ID"

# Enable required Google APIs
echo "Enabling Google APIs (Cloud Run, Cloud Build, Artifact Registry)..."
gcloud services enable run.googleapis.com \
                       cloudbuild.googleapis.com \
                       artifactregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" &>/dev/null; then
    echo "Creating Artifact Registry repository '$REPO_NAME'..."
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="Docker repository for Growers Collective"
fi

BACKEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest"
FRONTEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest"

# 2. Deploy Backend
echo "Building backend container image using Cloud Build..."
gcloud builds submit --tag "$BACKEND_IMAGE" ./backend

echo "Deploying backend service to Google Cloud Run..."
gcloud run deploy growers-collective-backend \
    --image "$BACKEND_IMAGE" \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars="PORT=8080,MONGO_URI=$MONGO_URI" \
    --port=8080

# Retrieve backend URL
BACKEND_URL=$(gcloud run services describe growers-collective-backend --region="$REGION" --format="value(status.url)")
echo "✓ Backend successfully deployed to: $BACKEND_URL"

# 3. Deploy Frontend
echo "Building frontend container image (linking to backend: $BACKEND_URL) using Cloud Build..."
gcloud builds submit --tag "$FRONTEND_IMAGE" \
    --build-arg="VITE_API_URL=$BACKEND_URL" \
    ./frontend

echo "Deploying frontend service to Google Cloud Run..."
gcloud run deploy growers-collective-frontend \
    --image "$FRONTEND_IMAGE" \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --port=80

FRONTEND_URL=$(gcloud run services describe growers-collective-frontend --region="$REGION" --format="value(status.url)")
echo "====================================================="
echo "   Deployment Complete!                              "
echo "====================================================="
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL:  $BACKEND_URL"
echo "====================================================="
