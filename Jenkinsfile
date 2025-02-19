pipeline {
    agent any
    triggers {
        githubPush()  // ✅ Webhook trigger
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
                    sh 'docker build --pull --no-cache -t prateekchaudhary7805/lang-api:latest .'
                }
                echo 'Docker Build Success'
            }
        }
        stage('Push Docker Image to dockerhub') {
            steps {
                script {
                    echo 'Pushing Docker Image to DockerHub'
                    sh 'docker push prateekchaudhary7805/lang-api'
                }
                echo 'Image pushed Successfully'
            }
        }
        stage('Pull Docker Image') {
            steps {
                script {
                    echo 'Pull Docker Image from DockerHub'
                    sh 'docker pull prateekchaudhary7805/lang-api'
                }
                echo 'Image pulled Successfully'
            }
        }
        
        stage('Deploy Docker Container') {
            steps {
                script {
                    echo 'Stopping and Removing Existing Container (if any)...'
                    sh 'docker stop lang-api || true'
                    sh 'docker rm lang-api || true'
                    
                    echo 'Running New Docker Container...'
                    sh 'docker run -d --name lang-api -p 5000:5000 prateekchaudhary7805/lang-api:latest'
                }
                echo 'Deployment Successful'
            }
        }
    }
}
