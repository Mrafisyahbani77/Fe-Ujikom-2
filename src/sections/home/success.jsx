import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);

      sessionStorage.setItem('showLoginSuccess', 'true');

      window.location.replace('/');
    } else {
      navigate('/error?reason=missing_tokens');
    }
  }, [navigate]);

  return (
    <Box>
      <LoadingScreen />
    </Box>
  );
}
