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
import { useNavigation, useNavigate } from "@remix-run/react";
import { useParams } from 'react-router'

interface Props {
  // dashboards: string[]
}

export default function AppBar(props: Props) {
  // const {dashboards} = props
  const { dashboards } = useRootLoaderData()
  const navigate = useNavigate()
  const params = useParams()

  const refresh = () => {
    console.log('todo')
  }

  const handleChange = (event: React.SyntheticEvent, value: string | null) => {
    console.log(value);
    if (value) {
      navigate(`/dashboard/${value}`, {});
    }
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
          <Box m={2}>
            <Autocomplete
              disablePortal
              options={dashboards}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="Dashboards" />}
              onChange={handleChange}
              defaultValue={params['id']}
            />
            {/*<Select*/}
            {/*  value={10}*/}
            {/*  label="Dashboard"*/}
            {/*  size="small"*/}
            {/*  variant="standard"*/}
            {/*>*/}
            {/*  <MenuItem value={10}>Ten</MenuItem>*/}
            {/*  <MenuItem value={20}>Twenty</MenuItem>*/}
            {/*  <MenuItem value={30}>Thirty</MenuItem>*/}
            {/*</Select>*/}
          </Box>
          <IconButton onClick={refresh} color="inherit">
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
    </Box>
  )
}
