import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  GitHub,
  Twitter,
  YouTube
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../hooks/useTheme';

const Footer: React.FC = () => {
  const { mode } = useCustomTheme();
  const theme = useTheme();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/Edge1Options/DawnPickCFD',
      icon: <GitHub />,
      color: mode === 'dark' ? '#ffffff' : '#000000'
    },
    {
      name: 'X/Twitter',
      url: 'https://x.com/Edge1Options',
      icon: <Twitter />,
      color: '#1DA1F2'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Edge1Options',
      icon: <YouTube />,
      color: '#FF0000'
    }
  ];

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${mode === 'dark' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        mt: 'auto',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        {/* Slogan Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 3
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00d4ff, #ff6b35)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              lineHeight: 1.3,
              mb: 1
            }}
          >
            DawnPickCFD: Ignite Your Portfolio After Market Closes.
          </Typography>
        </Box>

        <Divider 
          sx={{ 
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            mb: 3
          }} 
        />

        {/* Social Links Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
          {socialLinks.map((social) => (
            <IconButton
              key={social.name}
              onClick={() => handleSocialClick(social.url)}
              sx={{
                color: social.color,
                '&:hover': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s ease-in-out'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              aria-label={social.name}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>

        {/* Copyright Section */}
        <Box
          sx={{
            textAlign: 'center'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.875rem'
            }}
          >
            © {new Date().getFullYear()} Edge1Options. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;