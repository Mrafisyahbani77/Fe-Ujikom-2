import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ProductShopDetailsView } from 'src/sections/product/view';
import { useFetchProductById } from 'src/utils/product';

// ----------------------------------------------------------------------

export default function ProductShopDetailsPage() {
  const params = useParams();
  const { id } = params;

  // Gunakan hook dengan parameter ID
  const { data: response, isLoading } = useFetchProductById(id);
  const product = response; // Sesuaikan dengan struktur data yang Anda berikan
  // console.log(product)

  // URL absolut untuk gambar (gunakan gambar pertama dari array images)
  const mainImageUrl = product?.images?.[0]?.image_url;

  // Jika URL image dimulai dengan http://localhost, ganti dengan URL produksi
  const absoluteImageUrl = mainImageUrl
    ? mainImageUrl.replace('http://localhost:3000', 'https://barangin.vercel.app')
    : '';

  const productUrl = `https://barangin.vercel.app/product/${id}`;

  // Tentukan deskripsi (bersihkan dari tag HTML jika ada)
  const stripHtmlTags = (html) => html?.replace(/<[^>]*>/g, '') || '';
  const description = stripHtmlTags(product?.description);

  return (
    <>
      <Helmet>
        {/* Dynamic meta tags based on product data */}
        <title>{product ? `${product.name} | Barangin` : 'Product Details | Barangin'}</title>

        {product && (
          <>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:title" content={product.name} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImageUrl} />
            <meta property="og:url" content={productUrl} />
            <meta property="og:type" content="product" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Barangin" />
            <meta property="product:price:amount" content={product.price} />
            <meta property="product:price:currency" content="IDR" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={product.name} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImageUrl} />

            {/* Cache control untuk memastikan konten selalu fresh */}
            <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta http-equiv="Pragma" content="no-cache" />
            <meta http-equiv="Expires" content="0" />
          </>
        )}
      </Helmet>

      {/* JSON-LD untuk data terstruktur */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: product.images.map((img) =>
                img.image_url.replace('http://localhost:3000', 'https://barangin.vercel.app')
              ),
              description: description,
              sku: product.sku,
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'IDR',
                availability:
                  product.stock?.quantity > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.review?.average_rating || '0',
                reviewCount: product.review?.total_review || 0,
              },
            }),
          }}
        />
      )}

      <ProductShopDetailsView id={`${id}`} />
    </>
  );
}
