pipeline {
    agent any
    triggers {
        githubPush()  // ✅ Webhook trigger
    }

    /*environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('31874dac-86f0-4af4-8c82-59ed1d28b92b')  // ✅ GCP service account key
    }*/

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
                    sh 'docker build -t lang-api-final .'  // ✅ Use sudo if necessary
                }
                echo '✅ Docker Build Success'
            }
        }
        stage('Creating IAM user')
        steps {
            script {
                echo '🚀 Creating IAM user...'
                sh 'gcloud iam service-accounts create jenkins-sa --description="Jenkins Service Account" --display-name="Jenkins Service Account for lang-api"'
                sh 'gcloud projects add-iam-policy-binding my-project-7805-451310 --member=serviceAccount:my-service-account@my-project-7805-451310.iam.gserviceaccount.com" --role="roles/run.admin"
        }

        stage('Authenticate with GCP') {
            steps {
                script {
                    sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                    sh 'gcloud auth configure-docker asia-south2-docker.pkg.dev'
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh 'docker tag lang-api-final:latest asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api-final'
            }
        }

        stage('Push to Artifact Repository') {
            steps {
                script {
                    echo '📤 Pushing Docker Image to Artifact Repository'
                    sh 'docker push asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api-final' 
                }
                echo '✅ Image pushed Successfully'
            }
        }
    
        stage('Deploy to Cloud Run') {
            steps {
                script {
                    sh '''
                    gcloud run deploy lang-api-final2 \
                      --image=asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api-final:latest \
                      --region=asia-south2 \
                      --platform=managed \
                      --allow-unauthenticated \
                      --port=5000
                    '''
                }
            }
        }
    }
}
