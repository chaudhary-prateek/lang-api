pipeline {
  agent any

  environment {
    PROJECT_ID = 'mystical-melody-463806-k9'
    REGION = 'asia-south2'
    SERVICE_NAME = 'lang-api'
    ARTIFACT_REPO = 'asia-south2-docker.pkg.dev/mystical-melody-463806-k9/lang-api'
    IMAGE_NAME = "${SERVICE_NAME}"
  }

  parameters {
    gitParameter(
      name: 'BRANCH',
      type: 'PT_BRANCH',
      defaultValue: 'main',
      description: 'Select the Git branch to use',
      branchFilter: 'origin/(.*)',
      useRepository: 'https://github.com/chaudhary-prateek/lang-api.git',
      sortMode: 'DESCENDING',
      selectedValue: 'NONE',
    )

    gitParameter(
      name: 'TAG',
      type: 'PT_TAG',
      tagFilter: '',
      defaultValue: 'NONE',
      selectedValue: 'NONE',
      description: 'Select a tag'
    )
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: "${params.BRANCH}", url: 'https://github.com/chaudhary-prateek/lang-api.git'
      }
    }

    stage('Auth to GCP (Secret Access)') {
      steps {
        withCredentials([file(credentialsId: 'gcp-secret-access-key', variable: 'SECRET_FILE')]) {
          sh '''
            gcloud auth activate-service-account --key-file=$SECRET_FILE
            gcloud config set project $PROJECT_ID
          '''
        }
      }
    }

    stage('Fetch & Convert Secrets') {
      steps {
        script {
          def branchName = "${params.BRANCH}".toLowerCase()

          sh """
            gcloud secrets versions access latest --secret="common" > common.env || touch common.env
            gcloud secrets versions access latest --secret="${SERVICE_NAME}" > ${SERVICE_NAME}.env || touch ${SERVICE_NAME}.env

            cat common.env ${SERVICE_NAME}.env > .env
            rm common.env ${SERVICE_NAME}.env

            echo "=== .env (for Docker build) ==="
            cat .env
          """

          // Write the shell script to convert .env to env.yaml
          writeFile file: 'convert_env.sh', text: '''#!/bin/bash
writeFile file: 'convert_env.sh', text: '''#!/bin/bash
echo "" > env.yaml
while IFS= read -r line || [ -n "$line" ]; do
  if [[ -z "$line" || "$line" =~ ^# ]]; then
    continue
  fi
  key="${line%%=*}"
  value="${line#*=}"
  value="${value//\"/\\\"}"
  echo "$key: \\"$value\\"" >> env.yaml
done < .env
'''

          sh 'chmod +x convert_env.sh && ./convert_env.sh'
          sh 'echo "=== env.yaml (for Cloud Run) ===" && cat env.yaml'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          def tag = "${params.TAG}"
          sh "docker build -t ${IMAGE_NAME}:${tag} ."
        }
      }
    }

    stage('Auth to GCP (Deploy Access)') {
      steps {
        withCredentials([file(credentialsId: 'gcp-deploy-access-key', variable: 'DEPLOY_FILE')]) {
          sh '''
            gcloud auth activate-service-account --key-file=$DEPLOY_FILE
            gcloud config set project $PROJECT_ID
            gcloud auth configure-docker $REGION-docker.pkg.dev --quiet
          '''
        }
      }
    }

    stage('Tag & Push to Artifact Registry') {
      steps {
        script {
          def tag = "${params.TAG}"
          def fullImage = "${ARTIFACT_REPO}/${IMAGE_NAME}:${tag}"
          sh """
            docker tag ${IMAGE_NAME}:${tag} ${fullImage}
            docker push ${fullImage}
          """
        }
      }
    }

    stage('Deploy to Cloud Run') {
      steps {
        script {
          def tag = "${params.TAG}"
          def fullImage = "${ARTIFACT_REPO}/${IMAGE_NAME}:${tag}"
          sh """
            gcloud run deploy ${SERVICE_NAME} \
              --image=${fullImage} \
              --region=${REGION} \
              --platform=managed \
              --allow-unauthenticated \
              --env-vars-file=env.yaml
          """
        }
      }
    }
  }
}































/*pipeline {
    agent any
    parameters {
        choice(
            name: 'BRANCH',
            choices: ['main', 'develop', 'feature-1'],
            description: 'Select the branch to deploy'
        )
    }
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

/*
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
                withCredentials([file(credentialsId: 'fe9fc55e-81fc-4271-a54d-2d42123f9951', variable: 'NEW_GOOGLE_CREDENTIALS')]) {
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
*/
















































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

















