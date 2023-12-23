import React from 'react'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'

import { userPrefs } from '~/cookies.server'
import Button from '@mui/material/Button'

export const meta: MetaFunction = () => {
  return [
    { title: 'EpicJira' },
    { name: 'description', content: 'Welcome to EpicJira!' },
  ]
}

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  return json({ cookie })
}

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const bodyParams = await request.formData()
  if (bodyParams.get('bannerVisibility') === 'hidden') {
    cookie.showBanner = false
  }
  return redirect('/', {
    headers: {
      'Set-Cookie': await userPrefs.serialize(cookie),
    },
  })
}

export default function Index() {
  const { cookie } = useLoaderData<typeof loader>()
  const {} = useActionData<typeof action>() ?? {}

  return (
    <Box flexGrow={1}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Divider />

      <Box mt={2} mx={2}>
        <Card>
          <CardContent>
            <Box component={Form} method="post">
              <input
                type="hidden"
                name="bannerVisibility"
                value="hidden"
              />
              <Button type="submit">Send</Button>
            </Box>

            <Typography variant="body1">
              {JSON.stringify(cookie, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
