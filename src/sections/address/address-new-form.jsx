import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useMutationCreateShippings,
  useFetchProvinces,
  useFetchCity,
  useFetchDistricts,
  useFetchVillage,
} from 'src/utils/shippings';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from '@mui/material';

export default function AddressNewForm({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [villageId, setVillageId] = useState(''); // ⬅️ tambahkan ini

  const { data: provinces = [] } = useFetchProvinces();
  const { data: cities = [] } = useFetchCity(provinceId);
  const { data: districts = [] } = useFetchDistricts(cityId);
  const { data: villages = [] } = useFetchVillage(districtId);

  const NewAddressSchema = Yup.object().shape({
    recipient_name: Yup.string().required('Nama penerima wajib diisi'),
    phone_number: Yup.string().required('Nomor HP wajib diisi'),
    address: Yup.string().required('Alamat wajib diisi'),
    postal_code: Yup.string().required('Kode Pos wajib diisi'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues: {
      recipient_name: '',
      phone_number: '',
      address: '',
      postal_code: '',
    },
  });

  const { mutateAsync: createShipping } = useMutationCreateShippings({
    onSuccess: () => {
      enqueueSnackbar('Alamat berhasil ditambahkan!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.shippings'] });
      reset();
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || error?.message || 'Terjadi kesalahan', {
        variant: 'error',
      });
    },
  });

  const onSubmit = async (data) => {
    try {
      await createShipping({
        recipient_name: data.recipient_name,
        phone_number: data.phone_number,
        address: data.address,
        postal_code: data.postal_code,
        province_id: provinceId,
        city_id: cityId,
        district_id: districtId,
        village_id: villageId,
        notes: data.notes || '', // kalau kamu mau ada catatan
      });

      reset();
      onClose();
    } catch (error) {
      enqueueSnackbar('Gagal menambahkan alamat', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Tambah Alamat Baru</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Nama Penerima"
              {...register('recipient_name')}
              error={!!errors.recipient_name}
              helperText={errors.recipient_name?.message}
            />

            <TextField
              label="Nomor HP"
              {...register('phone_number')}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />

            <TextField
              label="Alamat"
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <TextField
              label="Kode Pos"
              {...register('postal_code')}
              error={!!errors.postal_code}
              helperText={errors.postal_code?.message}
            />

            {/* Province Select */}
            <TextField
              select
              label="Provinsi"
              value={provinceId}
              onChange={(e) => {
                setProvinceId(e.target.value);
                setCityId('');
                setDistrictId('');
                setVillageId('');
              }}
            >
              {provinces.map((province) => (
                <MenuItem key={province.id} value={province.id}>
                  {province.name}
                </MenuItem>
              ))}
            </TextField>

            {/* City Select */}
            <TextField
              select
              label="Kota/Kabupaten"
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value);
                setDistrictId('');
                setVillageId('');
              }}
              disabled={!provinceId}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>

            {/* District Select */}
            <TextField
              select
              label="Kecamatan"
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                setVillageId('');
              }}
              disabled={!cityId}
            >
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Village Select */}
            <TextField
              select
              label="Kelurahan/Desa"
              value={villageId}
              onChange={(e) => setVillageId(e.target.value)}
              disabled={!districtId}
            >
              {villages.map((village) => (
                <MenuItem key={village.id} value={village.id}>
                  {village.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Catatan"
              {...register('notes')}
              multiline
              rows={4}
              error={!!errors.notes}
              helperText={errors.notes?.message}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Simpan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
