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

    console.log('Access Token from URL:', accessToken);
    console.log('Refresh Token from URL:', refreshToken);

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    //   sessionStorage.setItem('refreshToken', refreshToken);

      console.log('Stored Access Token:', localStorage.getItem('accessToken'));
      console.log('Stored Refresh Token:', localStorage.getItem('refreshToken'));

      localStorage.setItem('showLoginSuccess', 'true');

      window.location.href = '/';
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
