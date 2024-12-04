---
author: Jose Sanchez
title: Deploying AWS Lambda Functions with Pulumi and Go
description: Lambda Functions with Pulumi and Go
pubDatetime: 2024-11-22T08:22:00Z
modDatetime: 2024-11-22T08:22:47.00Z
slug: lambda-pulumi
featured: true
draft: false
tags:
  - programming
  - go
  - Docker
  - DevOps
---

## Table of contents


## Introduction

> AWS Lambda revolutionizes serverless application development by enabling code execution without managing servers. 

Recently, AWS deprecated the `go1.x` runtime, favoring the `provided.al2` runtime. This shift means Go applications must use a custom bootstrap binary.

To deploy Lambda functions efficiently, **Pulumi** offers a robust infrastructure-as-code (IaaC) solution. In this post, I’ll demonstrate how to deploy a simple Lambda function using Pulumi and Go.

---

## Why Pulumi for Lambda Deployment?

Pulumi provides:
- **Full Programming Power**: Define infrastructure using languages like Go, Python, or TypeScript.
- **Seamless AWS Integration**: Manage AWS Lambda, S3, IAM, and more with ease.
- **Multi-Cloud Support**: Extend functionality to hybrid or multi-cloud architectures if needed.

---

## Step-by-Step Example: Deploying a Hello World Lambda Function

Let’s deploy a simple Lambda function that returns a static "Hello, World!" response.

---

### 1. Install Pulumi and Configure AWS

**Install Pulumi**:

```bash
curl -fsSL https://get.pulumi.com | sh
pulumi login
```

**Initialize Pulumi for AWS**:

```bash
pulumi new aws-go
```

During initialization:
- Set the project name and description.
- Choose your desired AWS region.

Pulumi generates essential files like `Pulumi.yaml` and `main.go`. We’ll modify `main.go` to implement our Lambda function.

---

### 2. Create the Go Lambda Function

1. **Write the Lambda Handler**:

Create a directory for the Lambda function and add the Go code:

```bash
mkdir hello-world
cd hello-world
touch main.go
```

Edit `main.go`:

```go
package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context) (string, error) {
	return "Hello, World!", nil
}

func main() {
	lambda.Start(handler)
}
```

2. **Build the Lambda Binary**:

Pulumi requires a zip file containing the Lambda binary. We’ll handle this in our deployment script.

---

### 3. Define the Pulumi Deployment Script

Replace the contents of `main.go` in the project root with the following code:

```go
package main

import (
	"archive/zip"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func buildLambda(rootFolder string) error {
	// Compile the Lambda binary
	cmd := exec.Command("go", "build", "-o", fmt.Sprintf("%s/bootstrap", rootFolder), "-ldflags", "-s -w")
	cmd.Dir = fmt.Sprintf("%s/hello-world", rootFolder)
	cmd.Env = append(os.Environ(), "GOOS=linux", "GOARCH=amd64", "CGO_ENABLED=0")

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("build failed: %s, output: %s", err, output)
	}

	// Create the ZIP file
	zipFile, err := os.Create(fmt.Sprintf("%s/function.zip", rootFolder))
	if err != nil {
		return fmt.Errorf("failed to create ZIP file: %v", err)
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	bootstrapBytes, err := os.ReadFile(fmt.Sprintf("%s/bootstrap", rootFolder))
	if err != nil {
		return fmt.Errorf("failed to read bootstrap: %v", err)
	}

	bootstrapFile, err := zipWriter.Create("bootstrap")
	if err != nil {
		return fmt.Errorf("failed to add bootstrap to ZIP: %v", err)
	}

	if _, err := bootstrapFile.Write(bootstrapBytes); err != nil {
		return fmt.Errorf("failed to write bootstrap to ZIP: %v", err)
	}

	return nil
}

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create IAM role
		role, err := iam.NewRole(ctx, "lambdaRole", &iam.RoleArgs{
			AssumeRolePolicy: pulumi.String(`{
				"Version": "2012-10-17",
				"Statement": [{
					"Action": "sts:AssumeRole",
					"Principal": {"Service": "lambda.amazonaws.com"},
					"Effect": "Allow"
				}]
			}`),
		})
		if err != nil {
			return err
		}

		// Attach AWS-managed Lambda execution policy
		_, err = iam.NewRolePolicyAttachment(ctx, "lambdaManagedPolicy", &iam.RolePolicyAttachmentArgs{
			Role:      role.Name,
			PolicyArn: pulumi.String("arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"),
		})
		if err != nil {
			return err
		}

		// Create S3 bucket for Lambda artifacts
		bucket, err := s3.NewBucket(ctx, "lambdaBucket", &s3.BucketArgs{
			Bucket: pulumi.String(fmt.Sprintf("lambda-bucket-%s", ctx.Project())),
		})
		if err != nil {
			return err
		}

		// Build and upload Lambda function ZIP
		rootFolder := "."
		if err := buildLambda(rootFolder); err != nil {
			return err
		}

		lambdaZip, err := s3.NewBucketObject(ctx, "lambdaZip", &s3.BucketObjectArgs{
			Bucket: bucket.ID(),
			Key:    pulumi.String("function.zip"),
			Source: pulumi.NewFileAsset(filepath.Join(rootFolder, "function.zip")),
		})
		if err != nil {
			return err
		}

		// Deploy Lambda function
		function, err := lambda.NewFunction(ctx, "helloWorldFunction", &lambda.FunctionArgs{
			Runtime:  pulumi.String("provided.al2"),
			Handler:  pulumi.String("bootstrap"),
			Role:     role.Arn,
			S3Bucket: bucket.ID(),
			S3Key:    lambdaZip.Key,
		})
		if err != nil {
			return err
		}

		// Export outputs
		ctx.Export("functionName", function.Name)
		return nil
	})
}
```

---

### 4. Deploy the Lambda Function

Run the following commands to deploy your Lambda function:

```bash
pulumi up
```

---

### 5. Test the Lambda Function

**Invoke with AWS CLI**:

```bash
aws lambda invoke --function-name $(pulumi stack output functionName) response.txt
```

**Invoke with HTTP** (if Lambda URL is enabled):

```bash
curl -XPOST https://$(pulumi stack output functionName).lambda-url.us-east-1.amazonaws.com/ -d '{"message": "hello"}'
```

---

## Conclusion

Pulumi simplifies the deployment of AWS Lambda functions, combining infrastructure management with a developer-friendly experience. This example showcased the complete journey—from writing a Go Lambda function to deploying it using Pulumi. 

Start using Pulumi today to manage your serverless applications with ease and efficiency!