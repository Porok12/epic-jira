# Deployment

```shell
 export JIRA_HOST=przemys-aw-papla.atlassian.net
 export JIRA_USERNAME=przemekpapla@gmail.com
 export JIRA_API_TOKEN=<your-jira-token>
docker run --rm --name epic-jira-test -it -p 3003:3000 \
 -e JIRA_HOST=$JIRA_HOST \
 -e JIRA_USERNAME=$JIRA_USERNAME \
 -e JIRA_API_TOKEN=$JIRA_API_TOKEN \
 ghcr.io/porok12/epic-jira:0.2.0
```
