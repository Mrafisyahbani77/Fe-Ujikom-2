import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';
import {
  useFetchProvinces,
  useFetchCity,
  useFetchDistricts,
  useFetchVillage,
} from 'src/utils/shippings';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function AddressNewForm({ open, onClose, onCreate }) {
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');

  const { data: provinces = [] } = useFetchProvinces();
  const { data: cities = [] } = useFetchCity(provinceId);
  const { data: districts = [] } = useFetchDistricts(cityId);
  const { data: villages = [] } = useFetchVillage(districtId);

  const NewAddressSchema = Yup.object().shape({
    recipient_name: Yup.string().required('Nama penerima wajib diisi'),
    phone_number: Yup.string().required('Nomor HP wajib diisi'),
    address: Yup.string().required('Alamat wajib diisi'),
    province: Yup.string().required('Provinsi wajib diisi'),
    city: Yup.string().required('Kota wajib diisi'),
    district: Yup.string().required('Kecamatan wajib diisi'),
    postal_code: Yup.string().required('Kode Pos wajib diisi'),
    notes: Yup.string(),
  });

  const defaultValues = {
    recipient_name: '',
    phone_number: '',
    address: '',
    province: '',
    city: '',
    district: '',
    postal_code: '',
    notes: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;

  const values = watch();

  const handleProvinceChange = (option) => {
    setProvinceId(option?.id || '');
    setValue('province', option?.name || '');
    setValue('city', '');
    setValue('district', '');
  };

  const handleCityChange = (option) => {
    setCityId(option?.id || '');
    setValue('city', option?.name || '');
    setValue('district', '');
  };

  const handleDistrictChange = (option) => {
    setDistrictId(option?.id || '');
    setValue('district', option?.name || '');
  };

  const onSubmit = async (data) => {
    onCreate(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tambah Alamat Baru</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <RHFTextField name="recipient_name" label="Nama Penerima" />
            <RHFTextField name="phone_number" label="Nomor HP" />
            <RHFTextField name="address" label="Alamat" multiline rows={3} />

            {/* Province */}
            <RHFAutocomplete
              name="province"
              label="Provinsi"
              options={provinces}
              getOptionLabel={(option) => option.name || ''}
              onChange={(e, value) => handleProvinceChange(value)}
            />

            {/* City */}
            <RHFAutocomplete
              name="city"
              label="Kota/Kabupaten"
              options={cities}
              getOptionLabel={(option) => option.name || ''}
              onChange={(e, value) => handleCityChange(value)}
              disabled={!provinceId}
            />

            {/* District */}
            <RHFAutocomplete
              name="district"
              label="Kecamatan"
              options={districts}
              getOptionLabel={(option) => option.name || ''}
              onChange={(e, value) => handleDistrictChange(value)}
              disabled={!cityId}
            />

            {/* Village */}
            <RHFAutocomplete
              name="village"
              label="Kelurahan/Desa"
              options={villages}
              getOptionLabel={(option) => option.name || ''}
              disabled={!districtId}
            />

            <RHFTextField name="postal_code" label="Kode Pos" />
            <RHFTextField name="notes" label="Catatan" multiline rows={2} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <LoadingButton type="submit" variant="contained">
            Simpan
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
};
