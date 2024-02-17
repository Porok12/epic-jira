import * as React from 'react'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Autocomplete } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useRootLoaderData } from '~/root'
import { useNavigation, useNavigate, useLocation } from '@remix-run/react'
import { useParams } from '@remix-run/react'
import Stack from '@mui/material/Stack'

interface Props {
  openDrawer: () => void
}

export default function AppBar(props: Props) {
  const { openDrawer } = props

  const { dashboards } = useRootLoaderData()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const params = useParams()
  const location = useLocation()

  const refresh = () => {
    navigate(location.pathname)
  }

  const handleChange = (event: React.SyntheticEvent, value: string | null) => {
    if (value) {
      const sanitizedValue = encodeURIComponent(value);
      navigate(`/dashboard/${sanitizedValue}`, {})
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar
        position="fixed"
        color="default"
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={openDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome to EpicJira
            {/*{JSON.stringify(navigation)}*/}
          </Typography>
          <Box
            sx={{
              display: location.pathname.startsWith('/dashboard')
                ? 'block'
                : 'none',
            }}
          >
            <Autocomplete
              disabled={navigation.state !== 'idle'}
              disablePortal
              options={dashboards}
              sx={{ width: 300 }}
              size="small"
              renderInput={params => (
                <TextField {...params} label="Dashboards" />
              )}
              onChange={handleChange}
              defaultValue={params['id']}
            />
          </Box>
          <Box
            ml={2}
            sx={{
              display: location.pathname.startsWith('/dashboard')
                ? 'block'
                : 'none',
            }}
          >
            <IconButton
              disabled={navigation.state !== 'idle'}
              onClick={refresh}
              color="inherit"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  )
}
