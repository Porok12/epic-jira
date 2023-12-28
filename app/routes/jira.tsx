import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Box, Typography } from '@mui/material'
import { jiraClient } from '~/jira.server'

export interface Data {
  expand:     string;
  startAt:    number;
  maxResults: number;
  total:      number;
  issues:     Issue[];
}

export interface Issue {
  expand: string;
  id:     string;
  self:   string;
  key:    string;
  fields: IssueFields;
}

export interface IssueFields {
  statuscategorychangedate:      string;
  issuetype:                     Issuetype;
  timespent:                     null;
  project:                       Project;
  fixVersions:                   any[];
  aggregatetimespent:            null;
  resolution:                    null;
  resolutiondate:                null;
  workratio:                     number;
  lastViewed:                    null | string;
  watches:                       Watches;
  created:                       string;
  priority:                      Priority;
  labels:                        any[];
  timeestimate:                  null;
  aggregatetimeoriginalestimate: null;
  versions:                      any[];
  issuelinks:                    any[];
  assignee:                      Creator | null;
  updated:                       string;
  status:                        Status;
  components:                    any[];
  timeoriginalestimate:          null;
  description:                   null | string;
  security:                      null;
  aggregatetimeestimate:         null;
  summary:                       string;
  creator:                       Creator;
  subtasks:                      any[];
  reporter:                      Creator;
  aggregateprogress:             Progress;
  environment:                   null;
  duedate:                       null;
  progress:                      Progress;
  votes:                         Votes;
  parent?:                       Parent;
}

export interface Progress {
  progress: number;
  total:    number;
}

export interface Creator {
  self:         string;
  accountId:    string;
  emailAddress: string;
  displayName:  string;
  active:       boolean;
  timeZone:     string;
  accountType:  string;
}

export interface Issuetype {
  self:           string;
  id:             string;
  description:    string;
  iconUrl:        string;
  name:           string;
  subtask:        boolean;
  avatarId:       number;
  entityId:       string;
  hierarchyLevel: number;
}

export interface Parent {
  id:     string;
  key:    string;
  self:   string;
  fields: ParentFields;
}

export interface ParentFields {
  summary:   string;
  status:    Status;
  priority:  Priority;
  issuetype: Issuetype;
}

export interface Priority {
  self:    string;
  iconUrl: string;
  name:    string;
  id:      string;
}

export interface Status {
  self:           string;
  description:    string;
  iconUrl:        string;
  name:           string;
  id:             string;
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  self:      string;
  id:        number;
  key:       string;
  colorName: string;
  name:      string;
}

export interface Project {
  self:           string;
  id:             string;
  key:            string;
  name:           string;
  projectTypeKey: string;
  simplified:     boolean;
}

export interface Votes {
  self:     string;
  votes:    number;
  hasVoted: boolean;
}

export interface Watches {
  self:       string;
  watchCount: number;
  isWatching: boolean;
}

export const loader = async ({}: LoaderFunctionArgs) => {
  try {
    const data = (await jiraClient.searchJira('order by created DESC', {maxResults: 120})) as Data

    console.log('Total issues', data.total)

    return json({ data })
  } catch (e) {
    console.error(e)

    return json({ data: null })
  }
}

export default function Config() {
  const { data } = useLoaderData<typeof loader>()

  if (data === null) {
    return null
  }

  return (
    <Box>
      <Typography variant="body1" whiteSpace="pre-wrap">
        {JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2)}
      </Typography>
    </Box>
  )
}
