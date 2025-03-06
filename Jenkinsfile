pipeline {
    agent any

    triggers {
        githubPush()  // ✅ Webhook trigger
    }

    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('55bdfdab-b0ed-459d-a204-18645b2619a7')  // ✅ GCP service account key
        PROJECT_ID = 'my-project-7805-451310'  // ✅ Replace with your GCP project ID
        REGION = 'asia-south2'
        REPO_NAME = 'lang-api'
        IMAGE_NAME = 'lang-api-final'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/chaudhary-prateek/lang-api.git'
                echo '✅ Repository cloned successfully'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo '🚀 Building Docker Image...'
                    sh 'docker build -t $IMAGE_NAME .'  // ✅ Use sudo if necessary
                }
                echo '✅ Docker Build Success'
            }
        }

        stage('Authenticate with GCP') {
            steps {
                script {
                    sh '''
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud auth configure-docker $REGION-docker.pkg.dev
                    '''
                }
            }
        }

        stage('Creating Artifact Repository') {
            steps {
                script {
                    echo '🚀 Checking if Artifact Repository exists...'
                    def repo_exists = sh(
                        script: "gcloud artifacts repositories list --location=$REGION --format='value(name)' | grep -w $REPO_NAME || true", 
                        returnStdout: true
                    ).trim()

                    if (repo_exists) {
                        echo "✅ Repository '$REPO_NAME' already exists. Skipping creation."
                    } else {
                        echo "🚀 Creating Artifact Repository..."
                        sh '''
                        gcloud artifacts repositories create $REPO_NAME \
                            --repository-format=docker \
                            --location=$REGION \
                            --description="Artifact repository for lang-api"
                        '''
                    }
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh 'docker tag $IMAGE_NAME:latest $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME'
            }
        }

        stage('Push to Artifact Repository') {
            steps {
                script {
                    echo '📤 Pushing Docker Image to Artifact Repository'
                    sh 'docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME' 
                }
                echo '✅ Image pushed Successfully'
            }
        }
    
        stage('Deploy to Cloud Run') {
            steps {
                script {
                    sh '''
                    gcloud run deploy $IMAGE_NAME \
                      --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest \
                      --region=$REGION \
                      --platform=managed \
                      --allow-unauthenticated \
                      --port=5000
                    '''
                }
            }
        }
    }
}
