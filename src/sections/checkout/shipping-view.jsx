import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useMutationCreateShippings,
  useMutationUpdateShippings,
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
  Button,
  Typography,
  Card,
  CardContent,
  Autocomplete,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function ShippingView({ currentData }) {
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

  const isEditMode = !!currentData?.id;

  const NewAddressSchema = Yup.object().shape({
    recipient_name: Yup.string().required('Nama penerima wajib diisi'),
    phone_number: Yup.string().required('Nomor HP wajib diisi'),
    address: Yup.string().required('Alamat wajib diisi'),
    postal_code: Yup.string().required('Kode Pos wajib diisi'),
    notes: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
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

  // Initialize form with currentData values when in edit mode
  useEffect(() => {
    if (currentData) {
      setValue('recipient_name', currentData.recipient_name || '');
      setValue('phone_number', currentData.phone_number || '');
      setValue('address', currentData.address || '');
      setValue('postal_code', currentData.postal_code || '');
      setValue('notes', currentData.notes || '');

      // Set location IDs
      setProvinceId(currentData.province_id || '');
      setCityId(currentData.city_id || '');
      setDistrictId(currentData.district_id || '');
      setVillageId(currentData.village_id || '');
    }
  }, [currentData, setValue]);

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

  const { mutateAsync: updateShipping } = useMutationUpdateShippings({
    onSuccess: () => {
      enqueueSnackbar('Alamat berhasil diperbarui!', { variant: 'success' });
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
    const shippingData = {
      recipient_name: data.recipient_name,
      phone_number: data.phone_number,
      address: data.address,
      postal_code: data.postal_code,
      province_id: provinceId,
      city_id: cityId,
      district_id: districtId,
      village_id: villageId,
      notes: data.notes || '',
    };

    try {
      if (isEditMode) {
        // Update existing shipping address
        await updateShipping({
          id: currentData.id,
          data: shippingData,
        });
      } else {
        // Create new shipping address
        await createShipping(shippingData);
      }
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  // Find option objects for initial values in edit mode
  const findProvinceOption = () => {
    return provinceId ? provinces.find((p) => p.id === provinceId) || null : null;
  };

  const findCityOption = () => {
    return cityId ? cities.find((c) => c.id === cityId) || null : null;
  };

  const findDistrictOption = () => {
    return districtId ? districts.find((d) => d.id === districtId) || null : null;
  };

  const findVillageOption = () => {
    return villageId ? villages.find((v) => v.id === villageId) || null : null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Edit Alamat' : 'Tambah Alamat Baru'}
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

            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={provinces}
                  getOptionLabel={(option) => option.name || ''}
                  value={findProvinceOption()}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    setProvinceId(newValue?.id || '');
                    setCityId('');
                    setDistrictId('');
                    setVillageId('');
                  }}
                  renderInput={(params) => <TextField {...params} label="Provinsi" />}
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={cities}
                  getOptionLabel={(option) => option.name || ''}
                  value={findCityOption()}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    setCityId(newValue?.id || '');
                    setDistrictId('');
                    setVillageId('');
                  }}
                  renderInput={(params) => <TextField {...params} label="Kota" />}
                  disabled={!provinceId}
                />
              )}
            />

            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={districts}
                  getOptionLabel={(option) => option.name || ''}
                  value={findDistrictOption()}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    setDistrictId(newValue?.id || '');
                    setVillageId('');
                  }}
                  renderInput={(params) => <TextField {...params} label="Kecamatan" />}
                  disabled={!cityId}
                />
              )}
            />

            <Controller
              name="village"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={villages}
                  getOptionLabel={(option) => option.name || ''}
                  value={findVillageOption()}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    setVillageId(newValue?.id || '');
                  }}
                  renderInput={(params) => <TextField {...params} label="Kelurahan" />}
                  disabled={!districtId}
                />
              )}
            />

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
              {isSubmitting
                ? isEditMode
                  ? 'Memperbarui...'
                  : 'Menyimpan...'
                : isEditMode
                ? 'Perbarui Alamat'
                : 'Simpan Alamat'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
