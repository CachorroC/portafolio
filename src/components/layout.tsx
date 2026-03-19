'use client';
import { AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box, } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Layout( {
  children
}: { children: ReactNode } ) {
  return (
    <Box
      sx={{
        display      : 'flex',
        flexDirection: 'column',
        minHeight    : '100dvh',
        // FIX 1: Force the entire wrapper to use your theme's background.
        // If the box stretches, it won't reveal a white HTML body underneath.
        bgcolor      : 'background.default',
      }}
    >
      {/* FIX 2: Change to "fixed". This locks it to the viewport perfectly. */}
      <AppBar
        position="fixed"
        color="default"
        elevation={2}
        sx={{
          backdropFilter      : 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom        : '1px solid',
          borderColor         : 'divider',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{
            flexGrow  : 1,
            fontWeight: 'bold'
          }}
          >
            My Portfolio
          </Typography>
          <ThemeToggle />
          <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/curriculum">CV</Button>
          <Button color="inherit" component={Link} href="/blog">Blog</Button>
          <Button color="inherit" component={Link} href="/herbs">Herbs</Button>
        </Toolbar>
      </AppBar>

      {/* FIX 3: The Spacer.
          Because the AppBar is fixed, it takes up zero space in the layout.
          This empty Toolbar renders at the exact same height as the AppBar,
          pushing your main content down so it doesn't hide behind the blur. */}
      <Toolbar />

      <Container
        component="main"
        maxWidth={false}
        sx={{
          flexGrow     : 1,
          display      : 'flex',
          flexDirection: 'column',
          width        : '100%',
          mt           : 4,
          pb           : 4,
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py         : 3,
          px         : 2,
          mt         : 'auto',
          // Make sure the footer color respects dark mode too
          borderTop  : '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2026 My Portfolio
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}