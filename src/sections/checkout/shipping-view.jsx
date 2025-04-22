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
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function ShippingView({ currentData }) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();

  // State terpisah untuk ID lokasi (bukan dalam form values)
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [villageId, setVillageId] = useState('');

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
    getValues,
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

  // Ambil data dengan React Query
  const { data: provinces = [], isLoading: isLoadingProvinces } = useFetchProvinces();
  const { data: cities = [], isLoading: isLoadingCities } = useFetchCity(provinceId);
  const { data: districts = [], isLoading: isLoadingDistricts } = useFetchDistricts(cityId);
  const { data: villages = [], isLoading: isLoadingVillages } = useFetchVillage(districtId);

  // Initialize form with currentData values when in edit mode
  useEffect(() => {
    if (currentData) {
      setValue('recipient_name', currentData.recipient_name || '');
      setValue('phone_number', currentData.phone_number || '');
      setValue('address', currentData.address || '');
      setValue('postal_code', currentData.postal_code || '');
      setValue('notes', currentData.notes || '');

      // Set state ID untuk lokasi
      if (currentData.province_id) {
        setProvinceId(currentData.province_id);
      }
      if (currentData.city_id) {
        setCityId(currentData.city_id);
      }
      if (currentData.district_id) {
        setDistrictId(currentData.district_id);
      }
      if (currentData.village_id) {
        setVillageId(currentData.village_id);
      }
    }
  }, [currentData, setValue]);

  // Mencari objek lokasi berdasarkan ID
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

  // Handle mutations untuk create/update
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

  // Prefetch data ketika ID berubah
  useEffect(() => {
    if (provinceId) {
      queryClient.prefetchQuery({
        queryKey: ['city.id', provinceId],
      });
    }
  }, [provinceId, queryClient]);

  useEffect(() => {
    if (cityId) {
      queryClient.prefetchQuery({
        queryKey: ['districts.id', cityId],
      });
    }
  }, [cityId, queryClient]);

  useEffect(() => {
    if (districtId) {
      queryClient.prefetchQuery({
        queryKey: ['village.id', districtId],
      });
    }
  }, [districtId, queryClient]);

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

            {/* Provinsi */}
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={isLoadingProvinces}
              loadingText="Memuat data provinsi..."
              value={findProvinceOption()}
              onChange={(event, newValue) => {
                setProvinceId(newValue?.id || '');
                // Reset dependent values
                setCityId('');
                setDistrictId('');
                setVillageId('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Provinsi"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingProvinces ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Kota */}
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={isLoadingCities}
              loadingText="Memuat data kota..."
              disabled={!provinceId}
              value={findCityOption()}
              onChange={(event, newValue) => {
                setCityId(newValue?.id || '');
                // Reset dependent values
                setDistrictId('');
                setVillageId('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kota"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingCities ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Kecamatan */}
            <Autocomplete
              options={districts}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={isLoadingDistricts}
              loadingText="Memuat data kecamatan..."
              disabled={!cityId}
              value={findDistrictOption()}
              onChange={(event, newValue) => {
                setDistrictId(newValue?.id || '');
                // Reset dependent values
                setVillageId('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kecamatan"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingDistricts ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Kelurahan */}
            <Autocomplete
              options={villages}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={isLoadingVillages}
              loadingText="Memuat data kelurahan..."
              disabled={!districtId}
              value={findVillageOption()}
              onChange={(event, newValue) => {
                setVillageId(newValue?.id || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kelurahan"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingVillages ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
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
