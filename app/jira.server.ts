import JiraApi from 'jira-client'

export const jiraClient = new JiraApi({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '2',
  strictSSL: true,
})

export default JiraApi
