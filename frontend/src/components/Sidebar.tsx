
import {
  Assessment,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Dashboard
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
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: isCollapsed ? 0 : 1 }}>
    {/* Logo Icon – scales perfectly in both modes */}
    <Box
      component="img"
      src="/logo.svg" 
      alt="Vulnsight AI"
      sx={{
        width: isCollapsed ? 36 : 42,
        height: isCollapsed ? 36 : 42,
        borderRadius: 1.5,
        p: 0.5,
        bgcolor: isCollapsed ? 'transparent' : 'primary.dark',
        opacity: isCollapsed ? 0.9 : 1,
        transition: 'all 0.2s ease',
      }}
    />

    {/* Text – only visible when expanded */}
    {!isCollapsed && (
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 800,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, #06b6d4)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          letterSpacing: '-0.5px',
        }}
      >
        Vulnsight AI
      </Typography>
    )}
  </Box>

  {/* Collapse Button */}
  <IconButton
    onClick={onToggle}
    size="small"
    sx={{
      backgroundColor: theme.palette.action.hover,
      '&:hover': { backgroundColor: theme.palette.action.selected },
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