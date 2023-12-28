import React from 'react'
import { useParams } from 'react-router'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { readConfig } from '~/config.server'
import { Form, useLoaderData } from '@remix-run/react'
import { jiraClient } from '~/jira.server'
import type { Data } from '~/routes/jira'
import { jq } from '~/jq.server'
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material'
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

import 'chartjs-adapter-moment'

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

ChartJS.defaults.color = 'rgba(255, 255, 255, 0.8)'
ChartJS.defaults.font.size = 18

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const config = await readConfig()

  console.log(params)

  const dashboard = config.dashboards.find(db => db.name === params['id'])
  if (!dashboard) {
    return json({ diagrams: [] })
  }
  // return json({ dashboard })

  const accumulateCustom = (array: any[]) => array.map((sum => value => ({ ...value, value: sum += value.value }))(0))

  const diagrams = []
  for (const component of dashboard.components) {
    const issues = await jiraClient.searchJira(component.query, { maxResults: 120 }) as Data
    if (component.type === 'number') {
      const value = await jq(component.filter, issues, { input: 'json' }) as string
      diagrams.push({ value, type: component.type, title: component.title, width: component.width })
    } else if (component.type === 'doughnut') {
      let datasets = []
      for (const { name, filter } of component.datasets) {
        const value = await jq(filter, issues, { input: 'json', output: 'string' }) as object
        datasets.push({ value, name })
      }
      diagrams.push({ datasets, type: component.type, title: component.title, width: component.width })
    } else if (component.type === 'line') {
      let datasets = []
      for (const { name, filter } of component.datasets) {
        let value = await jq(filter, issues, { input: 'json', output: 'json' }) as object
        if (component.accumulative) {
          value = accumulateCustom(value as any)
        }
        datasets.push({ value, name })
      }
      diagrams.push({ datasets, type: component.type, title: component.title, width: component.width })
    } else if (component.type === 'bar') {
      let datasets = []
      for (const { name, filter } of component.datasets) {
        const value = await jq(filter, issues, { input: 'json', output: 'string' }) as string
        datasets.push({ value: value /*Number.parseInt(value)*/, name })
      }
      diagrams.push({ datasets, type: component.type, title: component.title, width: component.width })
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
        width: component.width,
        xAxis: component.xAxis,
        yAxis: component.yAxis,
        type: component.type,
        title: component.title,
      })
    }
  }

  return json({ diagrams })
}

export default function Dashboard() {
  const params = useParams()
  const { /*dashboard*/ diagrams } = useLoaderData<typeof loader>()

  return (
    <>
      {/*{JSON.stringify(dashboard || {})}*/}
      <Box flexGrow={1}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Divider />

        <Grid container spacing={2} mt={2} xs={12}>
          {diagrams.map(diagram => {
            let component
            if (diagram.type === 'number') {
              component = (
                <Typography variant="h1" textAlign="center" mt={4} mb={8}>
                  {diagram.value}
                </Typography>
              )
            } else if (diagram.type === 'doughnut') {
              component = (
                <Doughnut
                  data={{
                    labels: diagram.datasets.map(ds => ds.name),
                    datasets: [
                      {
                        borderWidth: 0,
                        data: diagram.datasets.map(ds => ds.value),
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
              )
            } else if (diagram.type === 'bar') {
              component = (
                <Bar
                  data={{
                    labels: ['data'],
                    datasets: diagram.datasets.map(ds => ({ data: ds.value, label: ds.name }))
                  }}
                  options={{}}
                />
              )
            } else if (diagram.type === 'line') {
              component = (
                <Line
                  data={{
                    datasets: diagram.datasets.map(ds => ({ data: ds.value, label: ds.name })),
                  }}
                  options={{
                    parsing: {
                      xAxisKey: 'key',
                      yAxisKey: 'value',
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 14,
                          },
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                          tickColor: 'rgba(255, 255, 255, 0.1)'
                        },
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 14,
                          },
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                          tickColor: 'rgba(255, 255, 255, 0.1)'
                        },
                      },
                    },
                    plugins: {
                      datalabels: {
                        labels: {
                          value: null,
                        },
                      },
                    },
                  }}
                />
              )
            } else if (diagram.type === 'time') {
              component = (
                <Line
                  data={{
                    datasets: diagram.datasets.map(ds => ({ data: ds.value, label: ds.name })),
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
                          unit: 'week',
                        },
                        ticks: {
                          font: {
                            size: 14,
                          },
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                          tickColor: 'rgba(255, 255, 255, 0.1)'
                        },
                        ...diagram.xAxis,
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 14,
                          },
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                          tickColor: 'rgba(255, 255, 255, 0.1)'
                        },
                        ...diagram.yAxis,
                      },

                    },
                    plugins: {
                      datalabels: {
                        labels: {
                          value: null,
                        },
                      },
                    },
                  }}
                />
              )
            } else {
              component = JSON.stringify(diagram)
            }
            return (
              <Grid item xs={diagram?.width || 6}>
                <Card key={diagram.title} sx={{ /*height: '100%'*/ }}>
                  <CardHeader title={diagram.title} />
                  <CardContent sx={{ minHeight: '200px', maxHeight: '600px' }}>
                    {component}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </>
  )
}
