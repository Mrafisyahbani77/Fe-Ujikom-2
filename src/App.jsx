// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// sections
import { CheckoutProvider } from 'src/sections/checkout/context';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context/jwt';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import LocalizationProvider from './layouts/localization-provider';

// ----------------------------------------------------------------------

export default function App() {
  // const charAt = `

  // ░░░    ░░░
  // ▒▒▒▒  ▒▒▒▒
  // ▒▒ ▒▒▒▒ ▒▒
  // ▓▓  ▓▓  ▓▓
  // ██      ██

  // `;

  // console.info(`%c${charAt}`, 'color: #5BE49B');

  useScrollToTop();

  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          suspense: true,
        },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocalizationProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light',
              themeDirection: 'ltr',
              themeContrast: 'default',
              themeLayout: 'vertical',
              themeColorPresets: 'default',
              themeStretch: false,
            }}
          >
            <ThemeProvider>
              <MotionLazy>
                <SnackbarProvider>
                  <CheckoutProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    <AuthConsumer>
                      <Router />
                    </AuthConsumer>
                  </CheckoutProvider>
                </SnackbarProvider>
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
