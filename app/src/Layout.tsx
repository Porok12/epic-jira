import * as React from 'react'
import { Box, Container } from '@mui/material'

import AppBar from '~/src/components/AppBar'


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBar />
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          {children}
        </Box>
      </Container>
    </>
  )
}
