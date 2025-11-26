import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import type { SelectProps } from "../types/types";

export default function Select({ options, label, helperText, value, onChange }: SelectProps) {
    const selected =
    options.find((c) => c.value === value) || null;
  return (
    <Autocomplete
      disablePortal
      options={options}
      value={selected}
      onChange={(_, val) => {onChange(val?.value ?? "")}}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      filterSelectedOptions
      //   sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          size="small"
        />
      )}
    />
  );
}