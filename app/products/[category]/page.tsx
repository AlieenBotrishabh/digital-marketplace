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