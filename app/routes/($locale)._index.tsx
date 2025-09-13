import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [
    {title: 'TrimChic - Premium Natural Skincare for Women'},
    {name: 'description', content: 'Discover TrimChic\'s luxurious natural skincare collection. Premium ingredients, proven results, and eco-conscious beauty for the modern woman.'},
    {name: 'keywords', content: 'natural skincare, women skincare, premium beauty, organic skincare, anti-aging, skincare routine'},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <TrustIndicators />
      <FeaturedCollection collection={data.featuredCollection} />
      <BenefitsSection />
      <RecommendedProducts products={data.recommendedProducts} />
      <SocialProofSection />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50">
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-8 h-full">
            {[...Array(64)].map((_, i) => (
              <div
                key={i}
                className="border border-pink-200/20 bg-gradient-to-br from-pink-100/10 to-orange-100/10"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: 'pulse 4s ease-in-out infinite alternate'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Geometric Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-300/20 to-orange-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-300/15 to-amber-300/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-amber-300/20 to-pink-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>

        {/* Angular Shapes */}
        <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-pink-400/30 to-transparent transform rotate-45 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/30 to-transparent transform rotate-12 animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Split Layout */}
      <div className="relative z-10 h-full flex items-center py-16">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Left Side - Ultra Thin Typography */}
            <div className="text-left space-y-6 animate-fade-in">
              <div className="space-y-5">
                <div className="inline-flex items-center glass px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700 tracking-wider">DERMATOLOGIST APPROVED</span>
                </div>

                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] leading-[0.8] text-gray-900"
                  style={{
                    fontFamily: 'Brush Script MT, Lucida Handwriting, Lucida Calligraphy, cursive',
                    fontWeight: 400,
                    fontStyle: 'italic'
                  }}
                >
                  <span className="block mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500">
                    Glow Like
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500">
                    Never Before
                  </span>
                </h1>

                <div className="w-24 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500"></div>

                <p className="text-base sm:text-lg md:text-xl text-gray-700 font-light max-w-lg leading-relaxed">
                  Revolutionary skincare that transforms your skin in
                  <span className="font-medium text-orange-600"> 7 days</span>.
                  <br className="hidden sm:block" />
                  <span className="block mt-1">Science meets nature.</span>
                </p>
              </div>

              {/* Stats - Compact layout */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200/30">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-thin text-pink-600 mb-1 leading-none">99%</div>
                  <div className="text-xs uppercase font-light text-gray-600 tracking-wider">Satisfaction</div>
                </div>
                <div className="text-center relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200/30"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200/30"></div>
                  <div className="text-2xl md:text-3xl font-thin text-orange-600 mb-1 leading-none">7</div>
                  <div className="text-xs uppercase font-light text-gray-600 tracking-wider">Days Results</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-thin text-amber-600 mb-1 leading-none">100K+</div>
                  <div className="text-xs uppercase font-light text-gray-600 tracking-wider">Users</div>
                </div>
              </div>

              {/* CTAs - Compact layout */}
              <div className="space-y-4">
                <Link
                  to="/collections"
                  className="block w-full md:w-auto md:inline-block bg-gradient-to-r from-pink-600 to-orange-600 text-white text-base md:text-lg font-light py-4 md:py-5 px-8 md:px-10 rounded-none hover:from-pink-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl tracking-widest"
                >
                  START YOUR TRANSFORMATION
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping worldwide</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Elegant Image Treatment */}
            <div className="relative lg:pl-8">
              <div className="relative">
                {/* Main Image with Elegant Frame */}
                <div className="relative glass-strong p-4 md:p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/images/alexandru-zdrobau--djRG1vB1pw-unsplash.jpg"
                    alt="Radiant woman with perfect skin"
                    className="w-full h-72 md:h-80 object-cover rounded-xl shadow-2xl"
                  />
                </div>

                {/* Elegant Floating Elements Around Image */}
                <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 glass-subtle w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-100 to-orange-100 animate-float-slow">
                  <svg className="w-4 h-4 md:w-6 md:h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>

                <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 glass px-3 py-2 md:px-4 md:py-3 rounded-xl bg-white/90 shadow-xl animate-float-medium">
                  <div className="text-lg md:text-xl font-thin text-orange-600">+127%</div>
                  <div className="text-xs font-light text-gray-600">HYDRATION</div>
                </div>

                <div className="absolute top-1/2 -left-6 md:-left-8 glass px-2 py-1 md:px-3 md:py-2 rounded-lg bg-white/90 shadow-xl animate-float-fast">
                  <div className="text-sm md:text-base font-thin text-pink-600">COLLAGEN</div>
                  <div className="text-xs font-light text-gray-600">BOOSTED</div>
                </div>

                {/* Additional floating elements for richness */}
                <div className="hidden md:block absolute top-1/4 -right-6 glass-subtle w-10 h-10 rounded-full flex items-center justify-center animate-float-medium opacity-70">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function TrustIndicators() {
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 gradient-overlay-bronze opacity-30"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Trusted by 50,000+ Women Worldwide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="trust-badge">
            <div className="w-12 h-12 mb-3 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">100% Natural</h3>
            <p className="text-sm text-gray-600">Pure botanical extracts</p>
          </div>

          <div className="trust-badge">
            <div className="w-12 h-12 mb-3 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Science-Backed</h3>
            <p className="text-sm text-gray-600">Clinically proven results</p>
          </div>

          <div className="trust-badge">
            <div className="w-12 h-12 mb-3 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Award-Winning</h3>
            <p className="text-sm text-gray-600">Beauty industry recognition</p>
          </div>

          <div className="trust-badge">
            <div className="w-12 h-12 mb-3 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 gradient-overlay-mint opacity-20"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="/images/lesly-juarez-1AhGNGKuhR0-unsplash.jpg"
              alt="Woman applying skincare"
              className="w-full h-96 object-cover rounded-2xl glass"
            />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Transform Your Skin in 30 Days
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Hydration Boost</h3>
                  <p className="text-gray-600">Deep moisturizing formula that locks in hydration for 24+ hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Anti-Aging</h3>
                  <p className="text-gray-600">Reduces fine lines and wrinkles with natural retinol alternatives</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Radiant Glow</h3>
                  <p className="text-gray-600">Vitamin C and botanical extracts for luminous, healthy-looking skin</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/collections" className="cta-primary inline-block px-8 py-4">
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0">
        <img
          src="/images/ian-dooley-y_CSTKJ0bEs-unsplash.jpg"
          alt="Happy customers"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-overlay-pink"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card text-center">
            <div className="flex justify-center mb-4">
              {'★'.repeat(5).split('').map((star, i) => (
                <span key={i} className="text-yellow-400 text-xl">{star}</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              &ldquo;My skin has never looked better! The natural ingredients make such a difference.&rdquo;
            </p>
            <div className="font-semibold text-gray-800">Sarah M.</div>
            <div className="text-sm text-gray-600">Verified Customer</div>
          </div>

          <div className="glass-card text-center">
            <div className="flex justify-center mb-4">
              {'★'.repeat(5).split('').map((star, i) => (
                <span key={i} className="text-yellow-400 text-xl">{star}</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              &ldquo;Finally found a skincare routine that works for my sensitive skin. Love TrimChic!&rdquo;
            </p>
            <div className="font-semibold text-gray-800">Emily R.</div>
            <div className="text-sm text-gray-600">Verified Customer</div>
          </div>

          <div className="glass-card text-center">
            <div className="flex justify-center mb-4">
              {'★'.repeat(5).split('').map((star, i) => (
                <span key={i} className="text-yellow-400 text-xl">{star}</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              &ldquo;The anti-aging serum is incredible. I see results after just 2 weeks!&rdquo;
            </p>
            <div className="font-semibold text-gray-800">Jessica L.</div>
            <div className="text-sm text-gray-600">Verified Customer</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 gradient-overlay-bronze opacity-40"></div>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="glass-strong p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Get 20% Off Your First Order
          </h2>
          <p className="text-gray-700 mb-6">
            Join our community and receive exclusive skincare tips, early access to new products, and special offers.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg glass border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-500"
            />
            <button type="submit" className="cta-primary px-6 py-3 whitespace-nowrap">
              Get Discount
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-4">
            No spam, unsubscribe anytime. Your privacy is protected.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 gradient-overlay-peach opacity-20"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium skincare essentials
          </p>
        </div>

        <Link
          className="block glass-card group hover:transform hover:scale-105 transition-all duration-300"
          to={`/collections/${collection.handle}`}
        >
          {image && (
            <div className="relative overflow-hidden rounded-xl mb-6">
              <Image
                data={image}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{collection.title}</h3>
            <div className="cta-primary inline-block px-8 py-3">
              Explore Collection
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 gradient-overlay-mint opacity-20"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Recommended Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hand-picked products loved by our customers
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 loading-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 loading-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 loading-shimmer"></div>
              </div>
            ))}
          </div>
        }>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {response
                  ? response.products.nodes.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>

        <div className="text-center mt-12">
          <Link to="/collections" className="cta-secondary inline-block px-8 py-4">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
