'use client';
import { Typography, Grid, Card, CardContent, Chip, Box } from '@mui/material';

export default function Curriculum() {
  const skills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Material UI'];

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Curriculum Vitae
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Full Stack Web Developer
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Core Skills
      </Typography>
      <Grid container spacing={2}>
        {skills.map((skill) => (
          /* REMOVED: The 'item' prop is no longer needed here */
          <Grid key={skill}>
            <Chip label={skill} color="primary" variant="outlined" />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent Projects
      </Typography>
      <Grid container spacing={3}>
        {/* UPDATED: Replaced 'item xs={12} md={6}' with 'size={{ xs: 12, md: 6 }}' */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Legal Advisory Platform</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                A comprehensive web application managing client cases and documentation. Built with React and Node.js.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more project cards here following the new size pattern */}
      </Grid>
    </Box>
  );
}