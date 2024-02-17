import { open } from 'node:fs/promises'
export { readFile, open } from 'node:fs/promises'

import { DiagramType } from '~/src/types'

// export enum ComponentType {
//   Number = 'number',
//   Doughnut = 'doughnut',
//   Line = 'line',
//   Bar = 'bar',
//   Time = 'time',
//   List = 'list',
// }

interface AbstractComponent<T extends DiagramType> {
  type: T
  title: string // Diagram name
  width?: number // Diagram width
  query: string
  limit?: number // Result limit
}

export interface NumberComponent extends AbstractComponent<DiagramType.Number> {
  filter: string
}

export interface DoughnutComponent extends AbstractComponent<DiagramType.Doughnut> {
  datasets: {
    name: string
    filter: string
  }[]
}

export interface LineComponent extends AbstractComponent<DiagramType.Line> {
  accumulative?: boolean
  datasets: {
    name: string
    filter: string
  }[]
}

export interface BarComponent extends AbstractComponent<DiagramType.Bar> {
  labels: string[]
  datasets: {
    name: string
    filter: string
  }[]
}

export interface TimeComponent extends AbstractComponent<DiagramType.Time> {
  xAxis: object
  yAxis: object
  accumulative?: boolean
  datasets: {
    name: string
    filter: string
  }[]
}

export interface ListComponent extends AbstractComponent<DiagramType.List> {
  filter: string
  values: any[]
}

export type Component =
  | NumberComponent
  | DoughnutComponent
  | LineComponent
  | BarComponent
  | TimeComponent
  | ListComponent

export interface Dashboard {
  name: string
  components: Component[]
}

export interface Config {
  dashboards: Dashboard[]
}

export const readConfig = async (): Promise<Config> => {
  const CONFIG_PATH = process.env.CONFIG_PATH || 'config.json'
  try {
    const configFile = await open(CONFIG_PATH)
    const configBuffer = await configFile!.readFile()
    return JSON.parse(configBuffer.toString())
  } catch (e) {
    console.error(e)
    return { dashboards: [] }
  }
}
