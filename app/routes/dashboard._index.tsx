import { json, LoaderFunctionArgs } from '@remix-run/node'
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from '@remix-run/react'
import React, { useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

import { readConfig } from '~/config.server'

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const config = await readConfig()
  return json({ dashboards: config.dashboards })
}

export default function Index() {
  const { dashboards } = useLoaderData<typeof loader>()
  const location = useLocation()
  const navigate = useNavigate()
  const navigation = useNavigation()

  useEffect(() => {
    if (dashboards.length > 0) {
      navigate(`/dashboard/${dashboards[0].name}`)
    }
  }, [])

  //https://remix.run/docs/en/main/discussion/pending-ui

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
      <Typography variant="h2" mt={4}>
        Create your first dashboard!
      </Typography>
    </>
  )
}
