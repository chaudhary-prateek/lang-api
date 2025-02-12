pipeline {
    agent any

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

        stage('Deploy Docker Container') {
            steps {
                script {
                    echo 'Stopping and Removing Existing Container (if any)...'
                    sh 'docker stop lang-api || true'
                    sh 'docker rm lang-api || true'
                    
                    echo 'Running New Docker Container...'
                    sh 'docker run -d --name lang-api -p 5000:5000 lang-api'
                }
                echo 'Deployment Successful'
            }
        }
    }
}
