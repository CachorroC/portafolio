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
        minHeight    : '100vh',
      }}
    >
      <AppBar
        position="static"
        color="primary"
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
            }}
          >
            My Portfolio
          </Typography>
          <ThemeToggle />
          <Button
            color="inherit"
            component={Link}
            href="/"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/curriculum"
          >
            CV
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/blog"
          >
            Blog
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/herbs"
          >
            herbs
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        component="main"

      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py             : 3,
          px             : 2,
          mt             : 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            © 2026 My Portfolio
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
