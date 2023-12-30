# Deployment

```shell
 export JIRA_HOST=<your-jira-server>
 export JIRA_USERNAME=<your-username>
 export JIRA_API_TOKEN=<your-jira-token>
docker run --rm --name epic-jira-test -it -p 3003:3000 \
 -e JIRA_HOST=$JIRA_HOST \
 -e JIRA_USERNAME=$JIRA_USERNAME \
 -e JIRA_API_TOKEN=$JIRA_API_TOKEN \
 ghcr.io/porok12/epic-jira:latest
```
