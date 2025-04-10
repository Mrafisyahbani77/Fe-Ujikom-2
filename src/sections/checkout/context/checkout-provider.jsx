import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';
import { CheckoutContext, useCheckoutContext } from './checkout-context';
import {
  useMutationCreate,
  useMutationDelete,
  useFetchCart,
  useMutationUpdate,
} from 'src/utils/cart';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from 'src/auth/hooks';
import { useMutationApplyDiscount } from 'src/utils/discount';
import { useMutationCreateOrder } from 'src/utils/order';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'checkout_activeStep';

const initialState = {
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
};

export function CheckoutProvider({ children }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const users = user?.data;
  console.log(users);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: cartData } = useFetchCart(users?.id);

  const mutationAddToCart = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil ditambahkan ke keranjang', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const mutationUpdateCart = useMutationUpdate({
    onSuccess: () => {
      enqueueSnackbar('Keranjang berhasil diperbarui', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] }); // refresh cart
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Terjadi kesalahan saat update';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const mutationDeleteCart = useMutationDelete({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil dihapus dari keranjang', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const { mutateAsync: ApplyDiscount } = useMutationApplyDiscount({
    onSuccess: () => {
      // enqueueSnackbar('Diskon berhasil diterapkan', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const { mutateAsync: Order } = useMutationCreateOrder({
    onSuccess: () => {
      // enqueueSnackbar('Order berhasil dibuat', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] });
      queryClient.invalidateQueries({ queryKey: ['all.order'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const [state, setState] = useState(initialState);
  const [activeStep, setActiveStep] = useState(
    () => Number(localStorage.getItem(STORAGE_KEY)) || 0
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeStep);
  }, [activeStep]);

  const onGetCart = useCallback(() => {
    if (!Array.isArray(cartData)) return;

    const items = cartData.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subTotal = items.reduce(
      (total, item) => total + item.quantity * parseFloat(item.product_price || 0),
      0
    );

    setState((prevState) => {
      const newState = {
        ...prevState,
        items,
        subTotal,
        totalItems,
        billing: activeStep === 1 ? null : prevState.billing,
        discount: prevState.items.length ? prevState.discount : 0,
        shipping: prevState.items.length ? prevState.shipping : 0,
        total: subTotal - prevState.discount + prevState.shipping,
      };

      return JSON.stringify(prevState) === JSON.stringify(newState) ? prevState : newState;
    });
  }, [cartData, activeStep]);

  const prevCartData = useRef(null);

  useEffect(() => {
    if (cartData && cartData !== prevCartData.current) {
      prevCartData.current = cartData;
      onGetCart();
    }
  }, [cartData, onGetCart]);

  const onAddToCart = useCallback(
    (newItem) => {
      setState((prevState) => {
        const existingItem = prevState.items.find((item) => item.id === newItem.id);
        let updatedItems;

        if (existingItem) {
          updatedItems = prevState.items.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
          );
        } else {
          updatedItems = [...prevState.items, newItem];
        }

        const subTotal = updatedItems.reduce(
          (total, item) => total + item.quantity * parseFloat(item.product_price),
          0
        );

        return {
          ...prevState,
          items: updatedItems,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          subTotal,
          total: subTotal - prevState.discount + prevState.shipping,
        };
      });

      mutationAddToCart.mutate({
        users_id: user?.id,
        products_id: newItem.id,
        color: newItem.colors || '',
        size: newItem.size || '', // Pastikan tidak undefined
        quantity: newItem.quantity,
      });
    },
    [mutationAddToCart, user?.id]
  );

  const onDeleteCart = useCallback(
    (itemId) => {
      mutationDeleteCart.mutate(itemId);
    },
    [mutationDeleteCart]
  );

  const onBackStep = useCallback(() => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  }, []);

  const onNextStep = useCallback(() => {
    setActiveStep((prevStep) => prevStep + 1);
  }, []);

  const onGotoStep = useCallback((step) => {
    setActiveStep(step);
  }, []);

  const onIncreaseQuantity = useCallback(
    (itemId) => {
      setState((prevState) => {
        const newItems = prevState.items.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );

        // Cari item yang diupdate
        const updatedItem = newItems.find((item) => item.id === itemId);

        // 🔥 Call API buat update ke backend
        if (updatedItem) {
          mutationUpdateCart.mutate({
            cart_id: updatedItem.id, // cart_id sesuai item
            quantity: updatedItem.quantity, // quantity baru
          });
        }

        return {
          ...prevState,
          items: newItems,
        };
      });
    },
    [mutationUpdateCart]
  );

  const onDecreaseQuantity = useCallback(
    (itemId) => {
      setState((prevState) => {
        const newItems = prevState.items.map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
        );

        const updatedItem = newItems.find((item) => item.id === itemId);

        if (updatedItem) {
          mutationUpdateCart.mutate({
            cart_id: updatedItem.id,
            quantity: updatedItem.quantity,
          });
        }

        return {
          ...prevState,
          items: newItems,
        };
      });
    },
    [mutationUpdateCart]
  );

  const onCreateBilling = useCallback(
    (address) => {
      setState((prevState) => ({ ...prevState, billing: address }));
      onNextStep();
    },
    [onNextStep]
  );

  const onApplyDiscount = useCallback(
    async (discount) => {
      try {
        const result = await ApplyDiscount({ code: discount.code });
        const discountData = result?.discount;

        if (!discountData) {
          enqueueSnackbar('Diskon tidak ditemukan', { variant: 'error' });
          return;
        }

        const { discount_type, discount_value, max_discount_amount, min_order_amount } =
          discountData;
        const subTotal = state.subTotal || 0;

        // Cek minimal belanja
        if (min_order_amount && subTotal < parseFloat(min_order_amount)) {
          enqueueSnackbar(`Minimal belanja Rp${parseFloat(min_order_amount).toLocaleString()}`, {
            variant: 'error',
          });
          return;
        }

        let calculatedDiscount = 0;

        if (discount_type === 'percentage') {
          calculatedDiscount = (parseFloat(discount_value) / 100) * subTotal;
        } else if (discount_type === 'fixed') {
          calculatedDiscount = parseFloat(discount_value);
        }

        // Batas maksimum diskon
        if (max_discount_amount) {
          const maxDiscount = parseFloat(max_discount_amount);
          if (calculatedDiscount > maxDiscount) {
            calculatedDiscount = maxDiscount;
            enqueueSnackbar(`Diskon maksimal hanya Rp${maxDiscount.toLocaleString()}`, {
              variant: 'error',
            });
          }
        }

        // Update state
        setState((prevState) => ({
          ...prevState,
          discount: {
            ...discountData,
            discount_amount: calculatedDiscount,
          },
          total: prevState.subTotal - calculatedDiscount,
        }));

        enqueueSnackbar('Diskon berhasil diterapkan', { variant: 'success' });
      } catch (error) {
        console.error('Failed to apply discount:', error);
        // enqueueSnackbar('Diskon tidak ditemukan', { variant: 'error' });
      }
    },
    [ApplyDiscount, state.subTotal, enqueueSnackbar]
  );

  const [orderData, setOrderData] = useState(null);

  const onCreateOrder = useCallback(async () => {
    try {
      const discount = state.discount; // dari state kamu yang udah apply diskon
      let payload = {};

      if (discount) {
        if (discount.id) {
          payload.discount_id = discount.id;
        } else if (discount.code) {
          payload.discount_code = discount.code;
        }
      }

      const response = await Order(payload);
      setOrderData(response.order);

      // Setelah sukses
      enqueueSnackbar('Order berhasil dibuat', { variant: 'success' });

      // Kalau mau redirect atau reset state cart di sini juga bisa
      // navigate('/orders'); atau
      // resetStateCart();
      // checkout.completed();
      onNextStep();
    } catch (error) {
      console.error('Gagal membuat order:', error);
      // Error sudah otomatis ditangani di onError useMutation
    }
  }, [Order, state.discount, enqueueSnackbar]);

  const onApplyShipping = useCallback((shipping) => {
    setState((prevState) => ({ ...prevState, shipping }));
  }, []);

  const completed = activeStep === PRODUCT_CHECKOUT_STEPS.length;

  const onReset = useCallback(() => {
    if (completed) {
      setState(initialState);
      setActiveStep(0);
      localStorage.removeItem(STORAGE_KEY);
      router.replace('/');
    }
  }, [completed, router]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      activeStep,
      completed,
      onAddToCart,
      onDeleteCart,
      onIncreaseQuantity,
      onDecreaseQuantity,
      onCreateBilling,
      onApplyDiscount,
      onCreateOrder,
      onApplyShipping,
      onBackStep,
      onNextStep,
      onGotoStep,
      onReset,
      orderData,
    }),
    [state, activeStep, completed]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
