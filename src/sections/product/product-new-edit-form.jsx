import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { useMutationCreate, useMutationUpdate } from 'src/utils/product';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchCategory } from 'src/utils/category';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const { data, productsLoading, productsEmpty } = useFetchCategory();

  // State untuk menyimpan kategori yang sudah dipilih
  const [selectedCategory, setSelectedCategory] = useState([]);
  // State untuk menyimpan subkategori yang sudah dipilih
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const CATEGORY_OPTIONS =
    data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  // Mendapatkan opsi-opsi untuk gender (diubah format dari PRODUCT_GENDER_OPTIONS)
  const GENDER_OPTIONS = PRODUCT_GENDER_OPTIONS.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    files: Yup.array().min(1, 'File is required'),
    price: Yup.number()
      .transform((value, originalValue) => {
        if (typeof originalValue === 'string') {
          const cleaned = originalValue.replace(/,/g, '');
          return Number(cleaned);
        }
        return value;
      })
      .typeError('Price must be a number')
      .required('Price is required'),
    stock: Yup.number().min(0, 'Stock should not be negative'),
    description: Yup.string().required('Description is required'),
    categories_id: Yup.array()
      .min(1, 'Kategori wajib diisi')
      .max(1, 'Pilih hanya satu kategori')
      .required('Kategori wajib diisi'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      files: [
        ...(currentProduct?.images?.map((img) => ({
          preview: img.image_url,
          type: 'image',
        })) || []),
        ...(currentProduct?.videos?.map((vid) => ({
          preview: vid.video_url,
          type: 'video',
        })) || []),
      ],
      price: currentProduct?.price || 0,
      stock: currentProduct?.stock?.quantity || 0,
      // Kategori sebagai array dengan satu nilai saja
      categories_id: currentProduct?.categories?.id ? [currentProduct.categories.id] : [],
      // Subkategori dan gender sebagai array
      // subcategories_id: currentProduct?.subcategories?.id ? [currentProduct.subcategories.id] : [],
      // gender_categories_id: currentProduct?.gender_categories?.id
      //   ? [currentProduct.gender_categories.id]
      //   : [],
      color: currentProduct?.color || [],
      size: currentProduct?.size || [],
      status: currentProduct?.status || 'publish',
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const status = watch('status');
  const currentCategories = watch('categories_id') || [];
  const currentSubcategories = watch('subcategories_id') || [];

  // Ensure we're working with arrays
  const safeCurrentCategories = Array.isArray(currentCategories) ? currentCategories : [];
  const safeCurrentSubcategories = Array.isArray(currentSubcategories) ? currentSubcategories : [];

  // Filter kategori untuk opsi subkategori
  const filteredSubcategoryOptions = useMemo(() => {
    return CATEGORY_OPTIONS.filter((option) => {
      // Safely check if value exists in array
      return !safeCurrentCategories.some((id) => id === option.value);
    });
  }, [CATEGORY_OPTIONS, safeCurrentCategories]);

  // Filter kategori untuk opsi kategori utama
  const filteredCategoryOptions = useMemo(() => {
    return CATEGORY_OPTIONS.filter((option) => {
      // Safely check if value exists in array
      return !safeCurrentSubcategories.some((id) => id === option.value);
    });
  }, [CATEGORY_OPTIONS, safeCurrentSubcategories]);

  // Effect untuk memperbarui selectedCategory ketika nilai kategori berubah
  useEffect(() => {
    setSelectedCategory(safeCurrentCategories);
  }, [safeCurrentCategories]);

  // Effect untuk memperbarui selectedSubcategories ketika nilai subkategori berubah
  useEffect(() => {
    setSelectedSubcategories(safeCurrentSubcategories);
  }, [safeCurrentSubcategories]);

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
      if (currentProduct?.categories?.id) {
        setSelectedCategory([currentProduct.categories.id]);
      }
      if (currentProduct?.subcategories?.id) {
        setSelectedSubcategories([currentProduct.subcategories.id]);
      }
    }
  }, [currentProduct, defaultValues, reset]);

  // Create mutation hook
  const createMutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil dibuat!', { variant: 'success' });
      router.push(paths.dashboard.product.root);
      queryClient.invalidateQueries({ queryKey: ['fetch.products'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  // Update mutation hook
  const updateMutation = useMutationUpdate({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil di perbarui!', { variant: 'success' });
      router.push(paths.dashboard.product.root);
      queryClient.invalidateQueries({ queryKey: ['fetch.products'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());

      // Kategori - ambil nilai pertama dari array
      if (data.categories_id && data.categories_id.length) {
        formData.append('categories_id', data.categories_id[0].toString());
      }

      // Subkategori multi value - kirim sebagai JSON string
      // if (data.subcategories_id && data.subcategories_id.length) {
      //   formData.append('subcategories_id', data.subcategories_id[0].toString());
      // }

      // if (data.gender_categories_id && data.gender_categories_id.length) {
      //   formData.append('gender_categories_id', data.gender_categories_id[0].toString());
      // }

      // Gender multi value - kirim sebagai JSON string
      // if (data.gender_categories_id && data.gender_categories_id.length) {
      //   formData.append('gender_categories_id', JSON.stringify(data.gender_categories_id));
      // }

      if (data.size && data.size.length) {
        formData.append('size', JSON.stringify(data.size));
      }
      if (data.color && data.color.length) {
        formData.append('color', JSON.stringify(data.color));
      }

      formData.append('status', status);

      if (data.files && data.files.length) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      if (currentProduct?.id) {
        await updateMutation.mutateAsync({ id: currentProduct.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  function formatNumber(value) {
    if (!value) return value;
    const onlyNumbers = value.toString().replace(/[^\d]/g, '');
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.files || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('files', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.files]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.files?.filter((file) => file !== inputFile);
      setValue('files', filtered);
    },
    [setValue, values.files]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('files', []);
  }, [setValue]);

  // Custom handler untuk kategori untuk memastikan hanya satu yang dipilih
  const handleCategoryChange = (event) => {
    try {
      // Get value directly from event target if available
      let newValues = event?.target?.value;

      // If not in expected format, try to safely handle
      if (!Array.isArray(newValues)) {
        // If we got a direct value (like from an onChange event), convert to array
        newValues = [newValues];
      }

      // Ensure we have an array
      newValues = Array.isArray(newValues) ? newValues : [];

      // If array is empty, clear the field
      if (newValues.length === 0) {
        setValue('categories_id', []);
        return;
      }

      // If more than one item, take only the latest one
      if (newValues.length > 1) {
        // Get the latest selection
        const lastValue = newValues[newValues.length - 1];
        setValue('categories_id', [lastValue]);
        return;
      }

      // Check if selected value is already in subcategories
      const valueAlreadyInSubcategories = safeCurrentSubcategories.some(
        (id) => String(id) === String(newValues[0])
      );

      if (valueAlreadyInSubcategories) {
        // Don't allow selection if already in subcategories
        setValue('categories_id', safeCurrentCategories);
        return;
      }

      // Set the value
      setValue('categories_id', newValues);
    } catch (error) {
      console.error('Error in handleCategoryChange:', error);
      // Fallback to just setting the value directly
      setValue('categories_id', safeCurrentCategories);
    }
  };

  // Custom handler untuk subkategori
  const handleSubcategoryChange = (event) => {
    try {
      // Get value directly from event target if available
      let newValues = event?.target?.value;

      // If not in expected format, use fallback
      if (!Array.isArray(newValues)) {
        newValues = [];
      }

      // Filter out any values that are already in categories
      const filteredValues = newValues.filter((value) => {
        return !safeCurrentCategories.some((catId) => String(catId) === String(value));
      });

      setValue('subcategories_id', filteredValues);
    } catch (error) {
      console.error('Error in handleSubcategoryChange:', error);
      // Fallback to just setting the current value
      setValue('subcategories_id', safeCurrentSubcategories);
    }
  };

  const renderForm = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nama Produk" />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Deskripsi</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Gambar Produk</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="files"
                maxSize={3145728}
                accept="image/*, video/*"
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="stock"
                label="Stok"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              {/* Kategori sebagai RHFMultiSelect tapi dengan batasan satu pilihan */}
              <RHFMultiSelect
                checkbox
                name="categories_id"
                label="Kategori (pilih satu)"
                options={filteredCategoryOptions}
                onChange={handleCategoryChange}
              />

              {/* Subkategori sebagai multi select */}
              {/* <RHFMultiSelect
                checkbox
                name="subcategories_id"
                label="Subkategori"
                options={filteredSubcategoryOptions}
                onChange={handleSubcategoryChange}
              /> */}

              <RHFMultiSelect
                checkbox
                name="color"
                label="Warna"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              />

              <RHFMultiSelect checkbox name="size" label="Ukuran" options={PRODUCT_SIZE_OPTIONS} />

              {/* Gender sebagai multi select */}
              {/* <RHFMultiSelect
                checkbox
                name="gender_categories_id"
                label="Gender"
                options={GENDER_OPTIONS}
              /> */}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />
          </Stack>

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Harga"
              onChange={(e) => {
                const formattedValue = formatNumber(e.target.value);
                setValue('price', formattedValue);
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
            />
          </Stack>
        </Card>
      </Grid>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={status === 'publish'}
              onChange={(event) => {
                setValue('status', event.target.checked ? 'publish' : 'private');
              }}
            />
          }
          label={status === 'publish' ? 'Publish' : 'Private'}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid
        container
        spacing={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '100vh',
        }}
      >
        {renderForm}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
