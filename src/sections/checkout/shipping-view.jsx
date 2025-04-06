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
  Container,
  TextField,
  Stack,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function ShippingView() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [villageId, setVillageId] = useState('');

  const { data: provinces = [] } = useFetchProvinces();
  const { data: cities = [] } = useFetchCity(provinceId);
  const { data: districts = [] } = useFetchDistricts(cityId);
  const { data: villages = [] } = useFetchVillage(districtId);

  const NewAddressSchema = Yup.object().shape({
    recipient_name: Yup.string().required('Nama penerima wajib diisi'),
    phone_number: Yup.string().required('Nomor HP wajib diisi'),
    address: Yup.string().required('Alamat wajib diisi'),
    postal_code: Yup.string().required('Kode Pos wajib diisi'),
    notes: Yup.string(), // Tambahkan notes
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
      notes: '',
    },
  });

  const { mutateAsync: createShipping } = useMutationCreateShippings({
    onSuccess: () => {
      enqueueSnackbar('Alamat berhasil ditambahkan!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.shippings'] });
      reset();
      router.push(paths.product.checkout);
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <CustomBreadcrumbs
        heading="Buat alamat baru"
        links={[
          { name: 'Pilih alamat ', href: paths.product.checkout },
          { name: 'Buat alamat baru' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tambah Alamat Baru
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Nama Penerima"
                {...register('recipient_name')}
                error={!!errors.recipient_name}
                helperText={errors.recipient_name?.message}
                fullWidth
              />

              <TextField
                label="Nomor HP"
                {...register('phone_number')}
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
                fullWidth
              />

              <TextField
                select
                label="Provinsi"
                value={provinceId}
                onChange={(e) => setProvinceId(e.target.value)}
                fullWidth
              >
                {provinces.map((prov) => (
                  <MenuItem key={prov.id} value={prov.id}>
                    {prov.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Kota/Kabupaten"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                fullWidth
                disabled={!provinceId}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Kecamatan"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                fullWidth
                disabled={!cityId}
              >
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Kelurahan"
                value={villageId}
                onChange={(e) => setVillageId(e.target.value)}
                fullWidth
                disabled={!districtId}
              >
                {villages.map((village) => (
                  <MenuItem key={village.id} value={village.id}>
                    {village.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Alamat"
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                fullWidth
                multiline
                rows={3}
              />

              <TextField
                label="Kode Pos"
                {...register('postal_code')}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
                fullWidth
              />

              <TextField
                label="Catatan"
                {...register('notes')}
                error={!!errors.notes}
                helperText={errors.notes?.message}
                fullWidth
                multiline
                rows={3}
              />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Alamat'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
