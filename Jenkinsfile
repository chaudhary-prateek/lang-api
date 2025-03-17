pipeline {
    agent any

    triggers {
        githubPush()  // ✅ Webhook trigger
    }

    environment {
        PROJECT_ID = 'my-project-7805-451310'
        SERVICE_ACCOUNT_NAME = 'extra'
        SERVICE_ACCOUNT_EMAIL = "extra-929@my-project-7805-451310.iam.gserviceaccount.com"
        JSON_KEY_PATH = 'jenkins-sa-key.json'
        REGION = 'asia-south2'
        REPO_NAME = 'lang-api'
        IMAGE_NAME = 'lang-api-final'
    }

    stages {
        stage('Authenticate with GCP') {
            environment {
                GOOGLE_APPLICATION_CREDENTIALS = credentials('415dbcbf-ebd3-4adf-8847-c2a633339f5c')
            }
            steps {
                script {
                    sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'

                }
            }
        }
        stage('Switch to New Service Account') {
            steps {
                withCredentials([file(credentialsId: '96074944e4f29bfa51e4b7a48ed0539a93a20d35', variable: 'NEW_GOOGLE_CREDENTIALS')]) {
                    script {
                        sh """
                        gcloud auth activate-service-account --key-file="$NEW_GOOGLE_CREDENTIALS"
                        gcloud auth list
                        """
                    }
                }
            }
        }
/*
        stage('Check and Create Service Account') {
            steps {
                script {
                    def accountExists = sh(
                        script: """
                            gcloud iam service-accounts list --filter="email=${SERVICE_ACCOUNT_EMAIL}" --format="value(email)" || echo ""
                        """,
                        returnStdout: true
                    ).trim()
        
                    if (accountExists) {
                        echo "✅ Service account already exists: ${SERVICE_ACCOUNT_EMAIL}"
                    } else {
                        echo "🚀 Creating service account: ${SERVICE_ACCOUNT_NAME}"
                        sh """
                            gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
                                --display-name "Jenkins Service Account"
                        """
                    }
                }
            }
        }

        stage('Assign Roles') {
            steps {
                script {
                    def roles = ['roles/artifactregistry.admin', 'roles/run.admin', 'roles/iam.serviceAccountTokenCreator', 'roles/run.admin', 'roles/iam.serviceAccountUser', 'roles/iam.serviceAccountKeyAdmin', 'roles/storage.admin', 'roles/owner' ]
                    
                    for (role in roles) {
                        sh """
                        gcloud projects add-iam-policy-binding $PROJECT_ID \
                            --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
                            --role="$role"
                        """
                    }
                }
            }
        }

        stage('Generate JSON Key') {
            steps {
                script {
                    def existingKeys = sh(script: """
                        gcloud iam service-accounts keys list --iam-account=$SERVICE_ACCOUNT_EMAIL --format="value(name)"
                    """, returnStdout: true).trim()
        
                    if (existingKeys) {
                        echo "✅ Existing key found. Skipping key generation."
                    } else {
                        echo "🔑 No key found. Generating a new key..."
                        sh """
                        gcloud iam service-accounts keys create $WORKSPACE/$JSON_KEY_PATH \
                            --iam-account=$SERVICE_ACCOUNT_EMAIL
                        """
                    }
                }
            }
        }

        stage('Archive Key File') {
            steps {
                archiveArtifacts artifacts: JSON_KEY_PATH, fingerprint: true
            }
        }
*/


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
                    sh "docker build -t ${IMAGE_NAME} ."
                }
                echo '✅ Docker Build Success'
            }
        }
        stage('Switch to New Service Account') {
            steps {
                withCredentials([file(credentialsId: '96074944e4f29bfa51e4b7a48ed0539a93a20d35', variable: 'NEW_GOOGLE_CREDENTIALS')]) {
                    script {
                        sh """
                        gcloud auth activate-service-account --key-file="$NEW_GOOGLE_CREDENTIALS"
                        gcloud auth list
                        """
                    }
                }
            }
        }
        stage('Authenticate with GCP for Docker') {
            steps {
                script {
                    sh """
                    gcloud auth configure-docker $REGION-docker.pkg.dev --quiet
                    """
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
                        sh """
                        gcloud artifacts repositories create $REPO_NAME \
                            --repository-format=docker \
                            --location=$REGION \
                            --description="Artifact repository for lang-api"
                        """
                    }
                }
            }
        }
        
        stage('Tag Docker Image') {
            steps {
                script {
                    sh """
                    docker tag ${IMAGE_NAME}:latest $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Push to Artifact Repository') {
            steps {
                script {
                    echo '📤 Pushing Docker Image to Artifact Repository'
                    sh """
                    docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/${IMAGE_NAME}
                    """
                }
                echo '✅ Image pushed Successfully'
            }
        }
    
        stage('Deploy to Cloud Run') {
            steps {
                script {
                    sh """
                    gcloud run deploy ${IMAGE_NAME} \
                      --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/${IMAGE_NAME}:latest \
                      --region=$REGION \
                      --platform=managed \
                      --allow-unauthenticated \
                      --port=5000
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs for errors."
        }
    }
}



















































/*
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
/*
        stage('Run Tests') {
            steps {
                script {
                    echo '🔍 Running Tests...'
                    sh '''
                    docker run --rm $IMAGE_NAME npm test || exit 1
                    '''
                }
                echo '✅ Tests Passed Successfully'
            }
        }
*/
/*
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
}*/
