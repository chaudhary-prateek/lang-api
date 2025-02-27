pipeline {
    agent any
    triggers {
        githubPush()  // ✅ Webhook trigger
    }

    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('052b1bf8-2b2c-402e-8f35-a9df3f741d9c')  // ✅ Use stored GCP service account credentials
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/chaudhary-prateek/lang-api.git'
                echo 'Repository cloned successfully'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh 'docker build -t lang-api .'
                }
                echo 'Docker Build Success'
            }
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
                sh 'docker tag lang-api:latest asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api'
            }
        }

        stage('Push to Artifact Repository') {
            steps {
                script {
                    echo 'Pushing Docker Image to Artifact Repository'
                    sh 'docker push asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api' 
                }
                echo 'Image pushed Successfully'
            }
        }
    

        
        stage('Pull Docker Image') {
            steps {
                script {
                    echo 'Pull Docker Image from DockerHub'
                    sh 'docker pull asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api:latest'

                }
                echo 'Image pulled Successfully'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    /*echo 'Stopping and Removing Existing Container (if any)...'
                    sh 'docker stop lang-api || true'
                    sh 'docker rm lang-api || true'
                    */
                    echo 'Running New Docker Container...'
                    sh 'docker pull asia-south2-docker.pkg.dev/my-project-7805-451310/lang-api/lang-api:latest'
                }
                echo 'Deployment Successfull'
            }
        }
        
    }
}
