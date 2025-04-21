import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
// components
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function CheckoutBillingInfo({ billing, onBackStep }) {
  const navigate = useNavigate();

  const handleEditAddress = () => {
    if (billing?.id) {
      navigate(`/shipping/${billing.id}`);
    } else {
      // If no ID is available, fall back to the regular onBackStep
      onBackStep();
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Alamat"
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={handleEditAddress}
          >
            Edit
          </Button>
        }
      />
      <Stack spacing={1} sx={{ p: 3 }}>
        <Box sx={{ typography: 'subtitle2' }}>
          {`${billing?.recipient_name || ''} `}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            {/* ({billing?.addressType}) */}
          </Box>
        </Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{billing?.address || ''}</Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
          {billing?.phone_number || ''}
        </Box>
      </Stack>
    </Card>
  );
}

CheckoutBillingInfo.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};
  