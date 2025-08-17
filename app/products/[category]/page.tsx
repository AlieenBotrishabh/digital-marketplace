// app/products/[category]/page.tsx
import { ProductCard } from "@/app/components/ProductCard";
import { prisma } from "@/app/lib/db";
import { notFound } from "next/navigation";

async function getData(category: string) {
  let input;

  switch (category) {
    case "template": {
      input = "template";
      break;
    }
    case "uikit": {
      input = "uikit";
      break;
    }
    case "icon": {
      input = "icon";
      break;
    }
    case "all": {
      input = undefined;
      break;
    }
    default: {
      return notFound();
    }
  }

  const data = await prisma.product.findMany({
    where: {
      category: input,
    },
    select: {
      id: true,
      images: true,
      smallDescription: true,
      name: true,
      price: true,
    },
  });

  return data;
}

// Next.js 15 requires params to be typed as Promise, even though you access it synchronously
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // In Next.js 15, you can still access params synchronously due to backward compatibility
  // TypeScript requires Promise type, but Next.js handles the resolution internally
  const resolvedParams = await params;
  const { category } = resolvedParams;
  
  const products = await getData(category);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            images={product.images}
            price={product.price}
            name={product.name}
            smallDescription={product.smallDescription}
            id={product.id}
          />
        ))}
      </div>
    </section>
  );
}

// app/product/[id]/page.tsx
import { ProductDescription } from "@/app/components/ProductDescription";
import { prisma } from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";

async function getData(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      category: true,
      description: true,
      smallDescription: true,
      name: true,
      images: true,
      price: true,
      createdAt: true,
      User: {
        select: {
          profileImage: true,
          firstName: true
        }
      }
    }
  });
}

// Next.js 15 requires params to be typed as Promise
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params to get the actual values
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const data = await getData(id);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 lg:grid lg:grid-cols-7 lg:gap-x-8">
      <Carousel className="w-[600px] lg:col-span-4">
        <CarouselContent>
          {data.images?.map((url: string, index: number) => (
            <CarouselItem key={index}>
              <div className="w-[600px] h-[338px] rounded-lg bg-gray-100 overflow-hidden relative">
                <Image
                  src={url}
                  alt="Product image"
                  fill
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>
      
      <div className="lg:col-span-3 lg:flex lg:items-center lg:flex-col">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {data.name}
        </h1>
        <p className="mt-6 text-gray-500">{data.smallDescription}</p>
        
        <Button size="lg" className="bg-blue-600 text-white w-full mt-10">
          Buy for ${data.price}
        </Button>
        
        <div className="w-full border-t border-gray-200 mt-10 pt-10">
          <div className="grid grid-cols-2 w-full gap-y-3">
            <h3 className="text-sm font-medium text-gray-500 col-span-1">Released:</h3>
            <h3 className="text-sm font-medium col-span-1">
              {data.createdAt ? new Intl.DateTimeFormat("en-US", { 
                dateStyle: "long" 
              }).format(data.createdAt) : ""}
            </h3>
            
            <h3 className="text-sm font-medium text-gray-500 col-span-1">Category:</h3>
            <h3 className="text-sm font-medium col-span-1">{data.category}</h3>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10"></div>
      </div>
      
      <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">
        <ProductDescription content={data.description as JSONContent} />
      </div>
    </section>
  );
}

// If you have a download page: app/product/[id]/download/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getData(productId: string, userId: string) {
  // This assumes you have the Purchase model from the Razorpay integration
  // If you don't have it yet, you can comment this out for now
  /*
  const purchase = await prisma.purchase.findFirst({
    where: {
      productId: productId,
      userId: userId
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          productFile: true,
          images: true,
          price: true
        }
      },
      order: true
    }
  });
  return purchase;
  */
  
  // For now, just return the product data
  return await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      productFile: true,
      images: true,
      price: true
    }
  });
}

interface DownloadPageProps {
  params: Promise<{ id: string }>;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  const product = await getData(id, user.id);

  if (!product) {
    redirect(`/product/${id}`);
  }

  return (
    <section className="max-w-2xl mx-auto px-4 md:px-8 py-12">
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Access Granted!
          </CardTitle>
          <CardDescription className="text-green-700">
            You can now download your product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          </div>

          <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
            <a
              href={product.productFile}
              download
              className="flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Product
            </a>
          </Button>

          <div className="text-center space-y-2">
            <Button variant="outline" asChild>
              <Link href="/my-products">View My Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}