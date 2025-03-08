import * as React from 'react';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Popover,
  Box,
  FormGroup,
  FormControl,
  Divider,
  Typography,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

export interface Filter {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterComponentProps {
  label: string;
  filters: { [key: string]: boolean };
  incidentCountsByCategory: Record<string, number>;
  onApply: (selectedFilters: { [key: string]: boolean }) => void;
  initialState: { [key: string]: boolean };
}

function VizFilterByCategory({
  label,
  filters,
  onApply,
  initialState,
  incidentCountsByCategory,
}: FilterComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterComponentProps['filters']>(filters);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFilters({
      ...selectedFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleReset = () => {
    setSelectedFilters(initialState);
  };

  const handleApply = () => {
    onApply(selectedFilters);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setSelectedFilters(filters);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const filteredKeyValues = Object.keys(filters).filter((k) => filters[k]);
  const showSelectedText = filteredKeyValues.length > 0;

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="outlined"
        sx={{ mb: 1, textTransform: 'none' }}
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {label}
      </Button>

      {showSelectedText && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          <b>Selected Types:</b> {filteredKeyValues.join(', ')}
        </Typography>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box>
          <Box sx={{ px: 2, py: 1 }}>
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                {Object.keys(filters).map((filterKey) => (
                  <FormControlLabel
                    key={filterKey}
                    control={<Checkbox checked={selectedFilters[filterKey]} onChange={handleToggle} name={filterKey} />}
                    label={`${filterKey} (${incidentCountsByCategory?.[filterKey] ?? 0})`}
                    disabled={(incidentCountsByCategory?.[filterKey] ?? 0) <= 0}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>

          <Divider />

          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleReset}>
              Reset to All
            </Button>
            <Button size="small" onClick={handleApply} variant="contained" color="secondary">
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
}

export default VizFilterByCategory;
