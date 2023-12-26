import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { open } from '~/config.server'
import React from 'react'

export async function loader() {
  const CONFIG_PATH = process.env.CONFIG_PATH || 'config.json'
  try {
    const configFile = await open(CONFIG_PATH)
    const configBuffer = await configFile.readFile()
    return json({ config: configBuffer.toString() })
  } catch (e) {
    console.error(e)
    return json({ config: '{ dashboards: [] }' })
  }
}

export default function Config() {
  const { config } = useLoaderData<typeof loader>()
  return (
    <Box flexGrow={1}>
      <Typography variant="h4" component="h1" gutterBottom>
        Config
      </Typography>

      <Divider />

      <Box mt={2} mx={2}>
        <Card>
          <CardContent>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {JSON.stringify(JSON.parse(config), null, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
