import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh'
import * as React from 'react'

export default function AppBar() {
  const refresh = () => {
    // TODO
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position="static" color="default">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome to EpicJira
          </Typography>
          <IconButton onClick={refresh} color="inherit">
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
    </Box>
  )
}
