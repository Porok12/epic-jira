import React from 'react'
import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { jiraClient } from '~/jira.server'
import TextField from '@mui/material/TextField'
import { Form } from '@remix-run/react'

export interface Data {
  expand: string
  startAt: number
  maxResults: number
  total: number
  issues: Issue[]
}

export interface Issue {
  expand: string
  id: string
  self: string
  key: string
  fields: IssueFields
}

export interface IssueFields {
  statuscategorychangedate: string
  issuetype: Issuetype
  timespent: null
  project: Project
  fixVersions: any[]
  aggregatetimespent: null
  resolution: null
  resolutiondate: null
  workratio: number
  lastViewed: null | string
  watches: Watches
  created: string
  priority: Priority
  labels: any[]
  timeestimate: null
  aggregatetimeoriginalestimate: null
  versions: any[]
  issuelinks: any[]
  assignee: Creator | null
  updated: string
  status: Status
  components: any[]
  timeoriginalestimate: null
  description: null | string
  security: null
  aggregatetimeestimate: null
  summary: string
  creator: Creator
  subtasks: any[]
  reporter: Creator
  aggregateprogress: Progress
  environment: null
  duedate: null
  progress: Progress
  votes: Votes
  parent?: Parent
}

export interface Progress {
  progress: number
  total: number
}

export interface Creator {
  self: string
  accountId: string
  emailAddress: string
  displayName: string
  active: boolean
  timeZone: string
  accountType: string
}

export interface Issuetype {
  self: string
  id: string
  description: string
  iconUrl: string
  name: string
  subtask: boolean
  avatarId: number
  entityId: string
  hierarchyLevel: number
}

export interface Parent {
  id: string
  key: string
  self: string
  fields: ParentFields
}

export interface ParentFields {
  summary: string
  status: Status
  priority: Priority
  issuetype: Issuetype
}

export interface Priority {
  self: string
  iconUrl: string
  name: string
  id: string
}

export interface Status {
  self: string
  description: string
  iconUrl: string
  name: string
  id: string
  statusCategory: StatusCategory
}

export interface StatusCategory {
  self: string
  id: number
  key: string
  colorName: string
  name: string
}

export interface Project {
  self: string
  id: string
  key: string
  name: string
  projectTypeKey: string
  simplified: boolean
}

export interface Votes {
  self: string
  votes: number
  hasVoted: boolean
}

export interface Watches {
  self: string
  watchCount: number
  isWatching: boolean
}

// export const loader = async ({}: LoaderFunctionArgs) => {
//   try {
//     const data = (await jiraClient.searchJira('order by created DESC')) as Data
//
//     console.log('Total issues', data.total)
//
//     return json({ data })
//   } catch (e) {
//     console.error(e)
//
//     return json({ data: null })
//   }
// }

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    const jql = body.get('jql') as string
    const data = (await jiraClient.searchJira(jql)) as Data

    console.log('Total issues: ', data.total)

    return json({ data })
  } catch (e) {
    console.warn(e)
    return json({ data: null })
  }

  return json({ data: null })
  // return redirect('/', {})
}

export default function Config() {
  // const { data } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const fetcher = useFetcher<typeof action>()
  const isPending = fetcher.state !== 'idle'

  return (
    <Box mt={2} sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Box
            component={fetcher.Form}
            method="post"
            display="flex"
            gap={2}
            mb={2}
          >
            <TextField
              name="jql"
              label="jql"
              defaultValue="order by created DESC"
              fullWidth
            />
            <LoadingButton
              type="submit"
              variant="outlined"
              loading={isPending}
              sx={{ minWidth: '100px' }}
            >
              Query
            </LoadingButton>
          </Box>
          <Typography
            variant="body1"
            whiteSpace="pre-wrap"
            fontFamily="monospace"
          >
            {JSON.stringify(
              JSON.parse(JSON.stringify(fetcher.data?.data || {})),
              null,
              2,
            )}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
