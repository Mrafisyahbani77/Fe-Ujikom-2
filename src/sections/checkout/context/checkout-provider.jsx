import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';
import { CheckoutContext } from './checkout-context';
import { useMutationCreate, useMutationDelete, useFetchCart } from 'src/utils/cart';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from 'src/auth/hooks';

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
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: cartData } = useFetchCart(user?.id);

  const mutationAddToCart = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil ditambahkan ke keranjang', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
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
        color: newItem.colors.join(','),
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

  const onIncreaseQuantity = useCallback((itemId) => {
    setState((prevState) => ({
      ...prevState,
      items: prevState.items.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  }, []);

  const onDecreaseQuantity = useCallback((itemId) => {
    setState((prevState) => ({
      ...prevState,
      items: prevState.items.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      ),
    }));
  }, []);

  const onCreateBilling = useCallback(
    (address) => {
      setState((prevState) => ({ ...prevState, billing: address }));
      onNextStep();
    },
    [onNextStep]
  );

  const onApplyDiscount = useCallback((discount) => {
    setState((prevState) => ({ ...prevState, discount }));
  }, []);

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
      onApplyShipping,
      onBackStep,
      onNextStep,
      onGotoStep,
      onReset,
    }),
    [state, activeStep, completed]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
