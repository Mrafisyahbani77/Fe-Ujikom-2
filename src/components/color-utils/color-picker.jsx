import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
//
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const ColorPicker = forwardRef(
  ({ colors, selected, onSelectColor, limit = 'auto', sx, ...other }, ref) => {
    const singleSelect = typeof selected === 'string' || typeof selected === 'object';

    const stringifyColor = (color) =>
      typeof color === 'string' ? color : JSON.stringify(color, Object.keys(color).sort());

    const handleSelect = useCallback(
      (color) => {
        const colorStr = stringifyColor(color);
        if (singleSelect) {
          if (colorStr !== stringifyColor(selected)) {
            onSelectColor(color);
          }
        } else {
          const newSelected = selected.some((s) => stringifyColor(s) === colorStr)
            ? selected.filter((value) => stringifyColor(value) !== colorStr)
            : [...selected, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect]
    );

    return (
      <Stack
        ref={ref}
        direction="row"
        display="inline-flex"
        sx={{
          flexWrap: 'wrap',
          ...(limit !== 'auto' && {
            width: limit * 36,
            justifyContent: 'flex-end',
          }),
          ...sx,
        }}
        {...other}
      >
        {colors?.map((color) => {
          const hasSelected =
            selected &&
            (singleSelect
              ? stringifyColor(selected) === stringifyColor(color)
              : selected.some((s) => stringifyColor(s) === stringifyColor(color)));

          return (
            <ButtonBase
              key={stringifyColor(color)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
              }}
              onClick={() => {
                handleSelect(color);
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: typeof color === 'string' ? color : color.hex || stringifyColor(color),
                  borderRadius: '50%',
                  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                  ...(hasSelected && {
                    transform: 'scale(1.3)',
                    boxShadow: `4px 4px 8px 0 ${alpha(color, 0.48)}`,
                    outline: `solid 2px ${alpha(color, 0.08)}`,
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }),
                }}
              >
                <Iconify
                  width={hasSelected ? 12 : 0}
                  icon="eva:checkmark-fill"
                  sx={{
                    color: (theme) => theme.palette.getContrastText(color),
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }}
                />
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>
    );
  }
);

ColorPicker.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])).isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelectColor: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  sx: PropTypes.object,
};

export default ColorPicker;
