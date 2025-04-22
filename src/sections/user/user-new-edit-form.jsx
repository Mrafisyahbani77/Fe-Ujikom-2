import PropTypes from 'prop-types';
import { useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Avatar, Chip, Paper } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
export default function UserProfileView({ User }) {
  const currentUser = User?.user;

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // User account status
  const isActive = currentUser?.is_active === 1;
  const isBanned = currentUser?.is_banned === 1;

  const getStatusLabel = () => {
    if (isBanned) return 'Banned';
    if (isActive) return 'Active';
    return 'Inactive';
  };

  const getStatusColor = () => {
    if (isBanned) return 'error';
    if (isActive) return 'success';
    return 'warning';
  };

  return (
    <Grid container spacing={3}>
      {/* Left Column - User Avatar and Basic Info */}
      <Grid xs={12} md={4}>
        <Card
          sx={{
            pt: 8,
            pb: 5,
            px: 3,
            position: 'relative',
            height: '100%',
            backgroundImage: 'linear-gradient(to bottom, #f5f7ff, #ffffff)',
          }}
        >
          {/* Status Badge */}
          <Chip
            label={getStatusLabel()}
            color={getStatusColor()}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              fontWeight: 'bold',
            }}
          />

          {/* User Avatar */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt={currentUser?.username || ''}
              src={currentUser?.profile_photo || ''}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
              }}
            />

            <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              {currentUser?.username || '-'}
            </Typography>

            <Chip
              label={currentUser?.role || '-'}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />

            {/* Login Information */}
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 2,
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="eva:clock-fill" color="text.secondary" width={18} height={18} />
                  <Typography variant="body2" color="text.secondary">
                    Last Login
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ pl: 3 }}>
                  {formatDate(currentUser?.last_login)}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="eva:calendar-fill" color="text.secondary" width={18} height={18} />
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ pl: 3 }}>
                  {formatDate(currentUser?.created_at)}
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Card>
      </Grid>

      {/* Right Column - User Details */}
      <Grid xs={12} md={8}>
        <Card sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
          {/* Header */}
          <Box
            sx={{
              p: 3,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="eva:person-fill" width={24} height={24} />
              <Typography variant="h6">User Profile Information</Typography>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid xs={12}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Iconify icon="eva:info-fill" color="primary.main" width={22} height={22} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      width: '100%',
                    }}
                  >
                    Contact Information
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Iconify icon="eva:email-fill" color="primary.main" width={22} height={22} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1">{currentUser?.email || '-'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Iconify icon="eva:phone-fill" color="primary.main" width={22} height={22} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">{currentUser?.phone_number || '-'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* Personal Information */}
              <Grid xs={12}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 2 }}>
                  <Iconify icon="eva:people-fill" color="primary.main" width={22} height={22} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      width: '100%',
                    }}
                  >
                    Personal Information
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Iconify
                        icon="eva:person-done-fill"
                        color="primary.main"
                        width={22}
                        height={22}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Gender
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {currentUser?.gender || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Iconify
                        icon="eva:briefcase-fill"
                        color="primary.main"
                        width={22}
                        height={22}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Role
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {currentUser?.role || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* Account Status */}
              <Grid xs={12}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 2 }}>
                  <Iconify icon="eva:shield-fill" color="primary.main" width={22} height={22} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      width: '100%',
                    }}
                  >
                    Account Status
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Iconify
                            icon={
                              isActive ? 'eva:checkmark-circle-2-fill' : 'eva:alert-circle-fill'
                            }
                            color={getStatusColor()}
                            width={18}
                            height={18}
                          />
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            Account Status
                          </Typography>
                        </Stack>
                        <Chip label={getStatusLabel()} color={getStatusColor()} size="small" />
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify
                            icon="eva:globe-fill"
                            color="text.secondary"
                            width={18}
                            height={18}
                          />
                          <Typography variant="body2" sx={{ mr: 1}}>
                            Account Provider
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight="bold">
                          {currentUser?.provider || 'Local Account'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Updated Section */}
              <Grid xs={12}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 2 }}>
                  <Iconify icon="eva:activity-fill" color="primary.main" width={22} height={22} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      width: '100%',
                    }}
                  >
                    Account Activity
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify icon="eva:edit-2-fill" color="info.main" width={20} height={20} />
                      <Typography variant="body2">Last Updated</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(currentUser?.updated_at)}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify icon="eva:keypad-fill" color="info.main" width={20} height={20} />
                      <Typography variant="body2">User ID</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="medium">
                      #{currentUser?.id || '-'}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

UserProfileView.propTypes = {
  User: PropTypes.object,
};
