import { open } from 'node:fs/promises'
import { a } from 'vite-node/types-63205a44'
export { readFile, open } from 'node:fs/promises'

export interface NumberComponent {
  title: string
  width?: number
  limit?: number
  query: string
  type: 'number'
  filter: string
}

export interface DoughnutComponent {
  title: string
  width?: number
  limit?: number
  query: string
  type: 'doughnut'
  datasets: {
    name: string
    filter: string
  }[]
}

export interface LineComponent {
  title: string
  width?: number
  limit?: number
  query: string
  type: 'line'
  accumulative: true
  datasets: {
    name: string
    filter: string
  }[]
}

export interface BarComponent {
  title: string
  width?: number
  limit?: number
  query: string
  type: 'bar'
  datasets: {
    name: string
    filter: string
  }[]
}

export interface TimeComponent {
  title: string
  width?: number
  limit?: number
  query: string
  type: 'time'
  accumulative: true
  xAxis: object
  yAxis: object
  datasets: {
    name: string
    filter: string
  }[]
}

export interface ListComponent {
  title: string
  width?: number
  limit?: number
  query: string
  type: 'list'
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
