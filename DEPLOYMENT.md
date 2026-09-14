# Deployment Architecture

## Docker Image Build/Push Workflow

- **Local development with Docker Compose**: Build the API and client images directly from the source in each service folder, then start MongoDB, the Express API, and the React client with one Compose command.

- **Local Kubernetes testing with Kind**: Build a local API image such as `express-api:local`, load it into Kind, and deploy the Kubernetes manifests without pushing to a registry.

- **Remote deployment**: If deploying to a cloud environment, tag the images with a registry name, push them to Docker Hub, and then reference those image tags in the deployment files.

Typical build/publish flow:

1. Build the API image from `./api`.

2. Build the client image from `./client`.

3. Run or test locally with Docker Compose.

4. If deploying remotely, tag the images with a registry repository name.

5. Push the tagged images to the registry.

6. Update deployment manifests to use the pushed image tags.

You can stay fully local by using Docker Compose or by building the Kind image locally and loading it into the cluster.

## Chosen Deployment Target

My project currently deploys a local image for simplicity for the reviewer and to be cost effective. But the target would be to use EC2 with Docker Compose. Its better for a very small project like mine. The benefit is that Docker Compose is easy to setup and run locally. Also you only have to pay for EC2 compute on AWS. EKS is nice because AWS handles the the control plane and scaling/update needs but your going to pay for it.

## How Would I Handle Env Secrets In Production?

The best practice would be to use local .env files during development and then using a secrets manager and then fetching secrets during runtime. Making sure to never commit secrets to a repository. Also for added security, setting role permissions for what can be accessed.

## Scaling Strategy

I would need to scale horizontally depending on how many users are trying to use my app at once. Scaling that way would add more pod replicas which would help with traffic spikes. The beauty would be that once the spike is gone you can always scale back down the amount of active pods there are. I would scale vertically if my app needed more resources to function, such as more CPU or memory. I don't foresee this happening for my app. Its very basic and doesn't change a lot of data quickly in the database.

## Cost Considerations

I kept everything local for this project to make sure that no costs are incurred from using AWS resources. The beauty of my chosen deployment target is just having to pay for EC2 utilization helping to minimize cost.
