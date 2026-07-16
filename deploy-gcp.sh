#!/bin/bash
#
# Growers' Collective - GCP Cloud Run Production Deployment Script
#
set -euo pipefail

# 1. Configurable Variables (Modify these for your setup)
PROJECT_ID="coop-harvest"
REGION="europe-west1" # Dublin/Ireland region is europe-west1
REPO_NAME="growers-collective"
# Load MONGO_URI from backend/.env if it exists and MONGO_URI is not already set
if [ -z "${MONGO_URI:-}" ] && [ -f "backend/.env" ]; then
    MONGO_URI=$(grep -E "^MONGO_URI=" backend/.env | cut -d'=' -f2- | tr -d '"' | tr -d "'")
fi

if [ -z "${MONGO_URI:-}" ]; then
    echo "Error: MONGO_URI is not set." >&2
    echo "Please set the MONGO_URI environment variable or define it in backend/.env before running this script." >&2
    echo "Example:" >&2
    echo "  export MONGO_URI=\"mongodb+srv://<username>:<password>@<cluster>.mongodb.net/coop-harvest?retryWrites=true&w=majority\"" >&2
    exit 1
fi

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
                       artifactregistry.googleapis.com || echo "Warning: Could not verify or enable APIs automatically. Proceeding assuming they are already enabled in your Google Cloud Console."

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

wait_for_build() {
    local build_id="$1"
    echo "Waiting for build $build_id to complete..."
    while true; do
        local status
        status=$(gcloud builds describe "$build_id" --format="value(status)" 2>/dev/null || echo "PENDING")
        echo "Build status: $status"
        if [ "$status" = "SUCCESS" ]; then
            echo "Build succeeded!"
            break
        elif [ "$status" = "FAILURE" ] || [ "$status" = "INTERNAL_ERROR" ] || [ "$status" = "TIMEOUT" ] || [ "$status" = "CANCELLED" ]; then
            echo "Error: Build failed with status: $status" >&2
            exit 1
        fi
        sleep 10
    done
}

# 2. Deploy Backend
echo "Building backend container image using Cloud Build..."
BACKEND_BUILD_ID=$(gcloud builds submit --tag "$BACKEND_IMAGE" --async --format="value(id)" ./backend)
wait_for_build "$BACKEND_BUILD_ID"

echo "Deploying backend service to Google Cloud Run..."
gcloud run deploy growers-collective-backend \
    --image "$BACKEND_IMAGE" \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars="MONGO_URI=$MONGO_URI" \
    --port=8080

# Retrieve backend URL
BACKEND_URL=$(gcloud run services describe growers-collective-backend --region="$REGION" --format="value(status.url)")
echo "✓ Backend successfully deployed to: $BACKEND_URL"

# 3. Deploy Frontend
echo "Building frontend container image (linking to backend: $BACKEND_URL) using Cloud Build..."
echo "VITE_API_URL=$BACKEND_URL" > ./frontend/.env
FRONTEND_BUILD_ID=$(gcloud builds submit --tag "$FRONTEND_IMAGE" --async --format="value(id)" ./frontend)
wait_for_build "$FRONTEND_BUILD_ID"
rm -f ./frontend/.env

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

