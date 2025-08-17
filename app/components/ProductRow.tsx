import { notFound } from "next/navigation";
import { prisma } from "../lib/db";
import Link from "next/link";
import LoadingProductCard, { ProductCard } from "./ProductCard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRowProps {
  category: "newest" | "template" | "uikits" | "icons";
}

async function getData({ category }: ProductRowProps) {
  switch (category) {
    case "icons": {
      const data = await prisma.product.findMany({
        where: { category: "icon" }, // database value
        select: {
          price: true,
          name: true,
          smallDescription: true,
          id: true,
          images: true,
        },
        take: 3,
      });
      return { data, title: "Icons", link: "/products/icon" };
    }
    case "newest": {
      const data = await prisma.product.findMany({
        select: {
          price: true,
          name: true,
          smallDescription: true,
          id: true,
          images: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });
      return { data, title: "Newest Products", link: "/products/all" };
    }
    case "template": {
      const data = await prisma.product.findMany({
        where: { category: "template" },
        select: {
          id: true,
          name: true,
          price: true,
          smallDescription: true,
          images: true,
        },
        take: 3,
      });
      return { title: "Templates", data, link: "/products/template" };
    }
    case "uikits": {
      const data = await prisma.product.findMany({
        where: { category: "uikit" }, // database value
        select: {
          id: true,
          name: true,
          price: true,
          smallDescription: true,
          images: true,
        },
        take: 3,
      });
      return { title: "Ui Kits", data, link: "/products/uikit" };
    }
    default: {
      return notFound();
    }
  }
}

export function ProductRow({ category }: ProductRowProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoadRows category={category} />
    </Suspense>
  );
}

export async function LoadRows({ category }: ProductRowProps) {
  const data = await getData({ category });

  return (
    <section className="mt-12">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-extrabold tracking-tighter">{data.title}</h2>
        <Link
          href={data.link}
          className="text-sm hidden font-medium text-blue-600 hover:text-blue-600/90 md:block"
        >
          All Products <span>&rarr;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 mt-4 gap-10">
        {data.data.map((product: any) => (
          <ProductCard
            key={product.id}
            images={product.images}
            id={product.id}
            name={product.name}
            price={product.price}
            smallDescription={product.smallDescription}
          />
        ))}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div>
      <Skeleton className="h-9 w-56" />
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-10 lg:grid-cols-3">
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
      </div>
    </div>
  );
}
