import * as React from 'react'
import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SubjectIcon from '@mui/icons-material/Subject'
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import { Link } from '@remix-run/react'

import AppBar from '~/src/components/AppBar'
import Toolbar from '@mui/material/Toolbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  return (
    <>
      <CssBaseline />
      <AppBar openDrawer={handleDrawerOpen} />

      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClick={handleDrawerClose}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <Toolbar />
          <List>
            {['Dashboard'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton component={Link} to={'/dashboard'}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
            {['Jira'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton component={Link} to={'/jira'}>
                  <ListItemIcon>
                    <ContentPasteSearchIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
            {['Config'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton component={Link} to={'/config'}>
                  <ListItemIcon>
                    <SubjectIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <Container maxWidth="lg">
        <Toolbar />
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          {children}
        </Box>
      </Container>
    </>
  )
}
