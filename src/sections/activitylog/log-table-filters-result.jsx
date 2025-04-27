import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LogTableFiltersResult({ filters, onFilters, onResetFilters, results, sx }) {
  const handleRemoveName = () => {
    onFilters('name', '');
  };

  const handleRemoveAction = (value) => {
    const newValue = filters.action.filter((item) => item !== value);
    onFilters('action', newValue);
  };

  const handleRemoveDateRange = () => {
    onFilters('dateRange', [null, null]);
  };

  return (
    <Stack spacing={1.5} sx={{ pb: 3, ...sx }}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.name && (
          <Block label="Search:">
            <Chip size="small" label={filters.name} onDelete={handleRemoveName} />
          </Block>
        )}

        {!!filters.action.length && (
          <Block label="Action Types:">
            {filters.action.map((item) => (
              <Chip
                key={item}
                label={item
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                size="small"
                onDelete={() => handleRemoveAction(item)}
              />
            ))}
          </Block>
        )}

        {filters.dateRange[0] && filters.dateRange[1] && (
          <Block label="Date:">
            <Chip
              size="small"
              label={`${format(filters.dateRange[0], 'dd/MM/yyyy')} - ${format(
                filters.dateRange[1],
                'dd/MM/yyyy'
              )}`}
              onDelete={handleRemoveDateRange}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

LogTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
