import { open } from 'node:fs/promises'
export { readFile, open } from 'node:fs/promises'

export interface NumberComponent {
  title: string
  query: string
  type: 'number'
  filter: string
}

export interface DoughnutComponent {
  title: string
  query: string
  type: 'doughnut'
  datasets: {
    name: string
    filter: string
  }[]
}

export interface LineComponent {
  title: string
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
  query: string
  type: 'bar'
  datasets: {
    name: string
    filter: string
  }[]
}

export interface TimeComponent {
  title: string
  query: string
  type: 'time'
  accumulative: true
  datasets: {
    name: string
    filter: string
  }[]
}

export type Component =
  NumberComponent |
  DoughnutComponent |
  LineComponent |
  BarComponent |
  TimeComponent

export interface Dashboard {
  name: string
  components: Component[]
}

export interface Config {
  dashboards: Dashboard[]
}

export const readConfig = async (): Promise<Config> => {
  // .countries[] | select(.name=="USA")
  // .countries | map(. | select(.name=="USA"))
  // .countries | map(. | select(.labels | contains(["dupa"])).name)
  // | select(.fields.labels | contains(["dupa"])
  // "resolutiondate": "2023-12-24T09:35:21.389+0000",
  // "resolution": {
  //           "id": "10000",
  //           "description": "Work has been completed on this issue.",
  //           "name": "Done"
  //         },
  // "created": "2023-12-23T20:41:46.225+0000",
  // "updated": "2023-12-24T09:03:41.496+0000",
  //         "status": {
  //           "name": "To Do",
  //           "id": "10000",
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
