# Deployment

```shell
 export JIRA_HOST=przemys-aw-papla.atlassian.net
 export JIRA_USERNAME=przemekpapla@gmail.com
 export JIRA_API_TOKEN=ATATT3xFfGF03KpOIhMUy2O31aEfahik4v11akRKqrb5-M2RwdeCFGTIHU7yXZ2Gxp9sSwPPLNKppuQ_1noN8d2pKwYUjTzz0Ovo4q1SiL0WGWpN0wOcagNk7j6a4b3QJEoUK-w1JaiAKoGr45oYsLkB_5IDPdYdiQ-Y1ZWrW_ebHLFW_pk2brw=98DA9826
docker run --rm --name epic-jira-test -it -p 3003:3000 \
 -e JIRA_HOST=$JIRA_HOST \
 -e JIRA_USERNAME=$JIRA_USERNAME \
 -e JIRA_API_TOKEN=$JIRA_API_TOKEN \
 ghcr.io/porok12/epic-jira:0.3.3
```
