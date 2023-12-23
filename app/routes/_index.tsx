import React from 'react'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'


ChartJS.register(ArcElement, Tooltip, Legend)

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

  const options: ChartOptions<'doughnut'> = {}

  const data: ChartData<'doughnut'> = {
    labels: [
      'Red',
      'Blue',
      'Yellow',
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
      ],
      hoverOffset: 4,
    }],
  }

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
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ height: 400 }}>
              <Doughnut data={data} options={options} />
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
