import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import {
  type ChartOptions,
  type ChartData,
  registerables,
} from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  ArcElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js'
import { Doughnut, Line, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'


import { userPrefs } from '~/cookies.server'
import { readConfig } from '~/config.server'
import { jiraClient } from '~/jira.server'
import { jq } from '~/jq.server'
import type { Data } from '~/routes/jira'


import 'chartjs-adapter-moment'

// ChartJS.register(...registerables)
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  ChartDataLabels,
)

ChartJS.defaults.color = "rgba(255, 255, 255, 0.8)";
ChartJS.defaults.font.size = 18;

export const meta: MetaFunction = () => {
  return [
    { title: 'EpicJira' },
    { name: 'description', content: 'Welcome to EpicJira!' },
  ]
}

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}

  const config = await readConfig()

  const accumulateCustom = (array: any[]) => array.map((sum => value => ({ ...value, value: sum += value.value }))(0))
  console.log(accumulateCustom([{ value: 1 }, { value: 2 }, { value: 3 }]))

  const diagrams = []
  for (const dashboard of config.dashboards) {
    for (const component of dashboard.components) {
      const issues = await jiraClient.searchJira(component.query, {maxResults: 120}) as Data
      if (component.type === 'number') {
        const value = await jq(component.filter, issues, { input: 'json' }) as string
        diagrams.push({ value, type: component.type, title: component.title })
      } else if (component.type === 'doughnut') {
        let datasets = []
        for (const { name, filter } of component.datasets) {
          const value = await jq(filter, issues, { input: 'json', output: 'string' }) as object
          datasets.push({ value, name })
        }
        diagrams.push({ datasets, type: component.type, title: component.title })
      } else if (component.type === 'line') {
        let datasets = []
        for (const { name, filter } of component.datasets) {
          let value = await jq(filter, issues, { input: 'json', output: 'json' }) as object
          if (component.accumulative) {
            value = accumulateCustom(value as any)
          }
          datasets.push({ value, name })
        }
        diagrams.push({ datasets, type: component.type, title: component.title })
      } else if (component.type === 'bar') {
        let datasets = []
        for (const { name, filter } of component.datasets) {
          const value = await jq(filter, issues, { input: 'json', output: 'string' }) as object
          datasets.push({ value: value, name })
        }
        diagrams.push({ datasets, type: component.type, title: component.title })
      } else if (component.type === 'time') {
        let datasets = []
        for (const { name, filter } of component.datasets) {
          let value = await jq(filter, issues, { input: 'json', output: 'json' }) as object
          if (component.accumulative) {
            value = accumulateCustom(value as any)
          }
          datasets.push({ value, name })
        }
        diagrams.push({
          datasets,
          xAxis: component.xAxis,
          yAxis: component.yAxis,
          type: component.type,
          title: component.title,
        })
      }
    }
  }

  return json({ diagrams, cookie })
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
  // const { } = useRootLoaderData()
  const { cookie, diagrams } = useLoaderData<typeof loader>()
  const {} = useActionData<typeof action>() ?? {}

  // const options: ChartOptions<'doughnut'> = {}
  // const data: ChartData<'doughnut'> = {
  //   labels: [
  //     'Red',
  //     'Blue',
  //     'Yellow',
  //   ],
  //   datasets: [{
  //     label: 'My First Dataset',
  //     data: [300, 50, 100],
  //     hoverOffset: 4,
  //   }],
  // }

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

            <Typography variant="body1" whiteSpace="pre-wrap">
              {JSON.stringify(cookie, null, 2)}
            </Typography>
          </CardContent>
        </Card>
        {diagrams.map(diagram => {
          let component
          if (diagram.type === 'number') {
            component = (
              <Typography variant="h1">
                {diagram.value}
              </Typography>
            )
          } else if (diagram.type === 'doughnut') {
            component = (
              <div style={{ height: 400 }}>
                <Doughnut
                  data={{
                    labels: diagram.datasets.map(ds => ds.name),
                    datasets: [
                      {
                        borderWidth: 0,
                        data: diagram.datasets.map(ds => ds.value)
                      },
                    ],
                  }}
                  options={{
                    parsing: {
                      key: 'value',
                    },
                    plugins: {
                      datalabels: {
                        formatter: (value, ctx) => {
                          const datapoints = ctx.chart.data.datasets[0].data
                          console.log(datapoints)
                          const total = datapoints.reduce((total: any, datapoint: any) => total + Number.parseInt(datapoint), 0)
                          const percentage = (value / total) * 100
                          return percentage.toFixed(2) + '%'
                        },
                        labels: {
                          value: {},
                        },
                      },
                    },
                  }}
                />
              </div>
            )
          } else if (diagram.type === 'bar') {
            component = (
              <div style={{ height: 400 }}>
                <Bar
                  data={{
                    labels: diagram.datasets.map(ds => ds.name),
                    datasets: [
                      { data: diagram.datasets.map(ds => ds.value) },
                    ],
                  }}
                  options={{
                    parsing: {
                      key: 'value',
                    },
                  }}
                />
              </div>
            )
          } else if (diagram.type === 'line') {
            component = (
              <div style={{ height: 400 }}>
                <Line
                  data={{
                    datasets: diagram.datasets.map(ds => ({ data: ds.value })),
                  }}
                  options={{
                    parsing: {
                      xAxisKey: 'created',
                      yAxisKey: 'value',

                    },
                    plugins: {
                      datalabels: {
                        labels: {
                          value: null
                        }
                      }
                    }
                  }}
                />
              </div>
            )
          } else if (diagram.type === 'time') {
            component = (
              <div style={{ height: 400 }}>
                <Line
                  data={{
                    datasets: diagram.datasets.map(ds => ({ data: ds.value })),
                  }}
                  options={{
                    parsing: {
                      xAxisKey: 'created',
                      yAxisKey: 'value',
                    },
                    scales: {
                      x: {
                        type: 'time',
                        time: {
                          unit: 'week'
                        },
                        ...diagram.xAxis,
                      },
                      y: {
                        ...diagram.yAxis,
                      }
                    },
                    plugins: {
                      datalabels: {
                        labels: {
                          value: null
                        }
                      }
                    }
                  }}
                />
              </div>
            )
          } else {
            component = JSON.stringify(diagram)
          }
          return (
            <Card key={diagram.title} sx={{ mt: 2 }}>
              <CardHeader title={diagram.title} />
              <CardContent>
                {component}
              </CardContent>
            </Card>
          )
        })}

      </Box>
    </Box>
  )
}
