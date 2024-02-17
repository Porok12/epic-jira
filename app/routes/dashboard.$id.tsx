import React from 'react'
import { useParams } from 'react-router'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material'
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
  CoreChartOptions,
  ChartOptions,
  ChartType,
} from 'chart.js'
import { Doughnut, Line, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
// import ChartTrendline from 'chartjs-plugin-trendline'
import 'chartjs-adapter-moment'

import { DiagramType } from '~/src/types'
import { accumulateCustom } from '~/src/utils'
import { readConfig } from '~/config.server'
import { jiraClient } from '~/jira.server'
import type { Data } from '~/routes/jira'
import { jq } from '~/jq.server'

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
  // ChartTrendline,
)

ChartJS.defaults.color = 'rgba(255, 255, 255, 0.8)'
ChartJS.defaults.font.size = 18

interface AbstractDiagram<T extends DiagramType> {
  type: T
  title: string // Diagram name
  width?: number // Diagram width
}

export interface NumberDiagram extends AbstractDiagram<DiagramType.Number> {
  value: string
}

export interface DoughnutDiagram extends AbstractDiagram<DiagramType.Doughnut> {
  datasets: { name: string, value: any }[]
}

export interface LineDiagram extends AbstractDiagram<DiagramType.Line> {
  datasets: { name: string, data: any }[]
}

export interface BarDiagram extends AbstractDiagram<DiagramType.Bar> {
  labels: string[]
  datasets: { name: string, data: any }[]
}

export interface TimeDiagram extends AbstractDiagram<DiagramType.Time> {
  xAxis: object
  yAxis: object
  datasets: { name: string, data: any }[]
}

export interface ListDiagram extends AbstractDiagram<DiagramType.List> {
  values: { name: string, link: string, fields: any }[]
}

export type Diagram =
  | NumberDiagram
  | DoughnutDiagram
  | LineDiagram
  | BarDiagram
  | TimeDiagram
  | ListDiagram

const doughnutOptions: ChartOptions<'doughnut'> = {
  parsing: {
    key: 'value',
    // xAxisKey: 'key',
    // yAxisKey: 'value',
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
        tickColor: 'rgba(255, 255, 255, 0.1)',
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
        tickColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        const datapoints = ctx.chart.data.datasets[0].data
        const total = datapoints.reduce(
          (total: any, datapoint: any) =>
            total + Number.parseInt(datapoint),
          0,
        )
        const percentage = (value / total) * 100
        return percentage.toFixed(2) + '%'
      },
      labels: {
        value: {},
      },
    },
  } as any, // FIX: proper type
}

const lineOptions: ChartOptions<'line'> = {
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
        tickColor: 'rgba(255, 255, 255, 0.1)',
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
        tickColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: {
    datalabels: {
      labels: {
        value: null,
      },
    },
  } as any, // FIX: proper type
}

const timeOptions = (xAxis: object, yAxis: object): ChartOptions<'line'> => ({
  parsing: {
    xAxisKey: 'time',
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
        tickColor: 'rgba(255, 255, 255, 0.1)',
      },
      ...xAxis,
    },
    y: {
      ticks: {
        font: {
          size: 14,
        },
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        tickColor: 'rgba(255, 255, 255, 0.1)',
      },
      ...yAxis,
    },
  },
  plugins: {
    datalabels: {
      labels: {
        value: null,
      },
    },
  } as any, // FIX: proper type
})


export const loader = async ({
                               request,
                               params,
                               context,
                             }: LoaderFunctionArgs) => {
  const config = await readConfig()

  const diagrams: Diagram[] = []
  const dashboard = config.dashboards.find(db => db.name === params['id'])
  if (!dashboard) {
    return json({ diagrams })
  }

  for (const component of dashboard.components) {
    let datasets = []

    // Obtain tickets
    const issues = (await jiraClient.searchJira(component.query, {
      maxResults: component.limit || 50,
    })) as Data

    // Parse component type
    switch (component.type) {
      case DiagramType.Number:

        const value = (await jq(component.filter, issues, { input: 'json' })) as string
        diagrams.push({
          value,
          type: component.type,
          title: component.title,
          width: component.width,
        })

        break
      case DiagramType.Doughnut:

        for (const { name, filter } of component.datasets) {
          const value = (await jq(filter, issues, {
            input: 'json',
            output: 'string',
          })) as string

          datasets.push({ value, name })
        }
        diagrams.push({
          datasets,
          type: component.type,
          title: component.title,
          width: component.width,
        })

        break
      case DiagramType.Line:

        for (const { name, filter } of component.datasets) {
          let data = (await jq(filter, issues, {
            input: 'json',
            output: 'json',
          })) as any[]


          if (!Array.isArray(data)) {
            data = [data]
          }

          if (component.accumulative) {
            data = accumulateCustom(data)
          }

          datasets.push({ data, name })
        }
        diagrams.push({
          datasets,
          type: component.type,
          title: component.title,
          width: component.width,
        })

        break
      case DiagramType.Bar:

        for (const { name, filter } of component.datasets) {
          let data = (await jq(filter, issues, {
            input: 'json',
            output: 'json',
          })) as any[]

          if (!Array.isArray(data)) {
            data = [data]
          }

          data = data.map(value => {
            if (!isNaN(value)) {
              value = Number.parseInt(value)
            }
            return value
          })

          if (Array.isArray(data)) {
            data = data.map(value => {
              if (!isNaN(value)) {
                value = Number.parseInt(value)
              }
              return value
            })
          }

          datasets.push({ data, name })
        }
        diagrams.push({
          datasets,
          labels: component.labels,
          type: component.type,
          title: component.title,
          width: component.width,
        })

        break
      case DiagramType.Time:

        for (const { name, filter } of component.datasets) {
          let data = (await jq(filter, issues, {
            input: 'json',
            output: 'json',
          })) as any[]

          if (!Array.isArray(data)) {
            data = [data]
          }

          if (component.accumulative) {
            data = accumulateCustom(data)
          }

          datasets.push({ data, name })
        }
        diagrams.push({
          datasets,
          width: component.width,
          xAxis: component.xAxis,
          yAxis: component.yAxis,
          type: component.type,
          title: component.title,
        })

        break
      case DiagramType.List:

        let data = (await jq(component.filter, issues, {
          input: 'json',
          output: 'json',
        })) as any[]

        if (!Array.isArray(data)) {
          data = [data]
        }

        data = data.map(value => {
          let link = process.env.JIRA_HOST + '/browse/' + value.key
          if (!link.startsWith('http')) {
            link = 'https://' + link
          }
          return ({ ...value, link })
        })

        diagrams.push({
          values: data,
          width: component.width,
          type: component.type,
          title: component.title,
        })

        break
    }
  }

  return json({ diagrams })
}

export default function Dashboard() {
  const params = useParams()
  const { diagrams } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  if (navigation.state !== 'idle') {
    return (
      <Box
        display="flex"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress sx={{ mt: 32 }} size={64} />
      </Box>
    )
  }

  return (
    <>
      {/*{JSON.stringify(dashboard || {})}*/}
      <Box flexGrow={1}>
        <Typography variant="h4" component="h1" gutterBottom>
          {params['id'] || 'Dashboard'}
        </Typography>

        <Divider />

        <Grid container spacing={2} mt={2}>
          {diagrams.map((diagram: Diagram, index: number) => {
            let component
            if (diagram.type === DiagramType.Number) {
              component = (
                <Typography variant="h1" textAlign="center" mt={4} mb={8}>
                  {diagram.value}
                </Typography>
              )
            } else if (diagram.type === DiagramType.Doughnut) {
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
                  options={doughnutOptions}
                />
              )
            } else if (diagram.type === DiagramType.Bar) {
              component = (
                <Bar
                  data={{
                    labels: diagram.labels,
                    datasets: diagram.datasets.map(ds => ({
                      data: ds.data,
                      label: ds.name,
                    })),
                  }}
                  options={{}}
                />
              )
            } else if (diagram.type === DiagramType.Line) {
              component = (
                <Line
                  data={{
                    datasets: diagram.datasets.map(ds => ({
                      data: ds.data,
                      label: ds.name,
                    })),
                  }}
                  options={lineOptions}
                />
              )
            } else if (diagram.type === DiagramType.Time) {
              component = (
                <Line
                  data={{
                    datasets: diagram.datasets.map(ds => ({
                      data: ds.data,
                      label: ds.name,
                      // trendlineLinear: {
                      //   lineStyle: "dotted",
                      //   width: 2,
                      // },
                    })),
                  }}
                  options={timeOptions(diagram.xAxis, diagram.yAxis)}
                />
              )
            } else if (diagram.type === DiagramType.List) {
              component = (
                <List dense={false}>
                  {diagram.values.map((value) =>
                    <ListItem
                      secondaryAction={
                        <IconButton component={'a'} target="blank" href={value.link} edge="end">
                          <OpenInNewIcon />
                        </IconButton>
                      }>
                      <ListItemText primary={value.fields.summary} />
                    </ListItem>,
                  )}
                </List>
              )
            } else {
              component = JSON.stringify(diagram)
            }
            return (
              <Grid key={index} item xs={diagram?.width || 6}>
                <Card>
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
