
import {
  Assessment,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Dashboard,
  Security
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import React from "react";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 72;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const theme = useTheme();

  const menuItems = [
    { path: "/", icon: <Dashboard />, label: "Dashboard" },
    { path: "/upload", icon: <CloudUpload />, label: "Upload File" },
    { path: "/results", icon: <Assessment />, label: "Prediction Results" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      <DrawerHeader>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              VulnSight AI
            </Typography>
          </Box>
        )}
        <IconButton 
          onClick={onToggle}
          size="small"
          sx={{
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
            }
          }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {({ isActive }) => (
              <Tooltip 
                title={isCollapsed ? item.label : ''} 
                placement="right"
                arrow
              >
                <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: isCollapsed ? 'center' : 'initial',
                      px: 2.5,
                      borderRadius: 2,
                      backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      border: isActive ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 'auto' : 3,
                        justifyContent: 'center',
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: isCollapsed ? 0 : 1,
                        transition: 'opacity 0.2s',
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;