import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../lib/db";
import { ProductCard } from "../components/ProductCard";
import { Key } from "react";

async function getData(userId: string) {
  const data = await prisma.product.findMany({
    where: {
      // Assuming one-to-many relation: product has userId field
      userId: userId,
    },
    select: {
      name: true,
      images: true,
      price: true,
      smallDescription: true,
      id: true,
    },
  });

  return data;
}

export default async function MyProductsRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = await getData(user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <h1 className="text-2xl font-bold">My Products</h1>
      {data.length === 0 ? (
        <p>You have no products yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:grid-cols-2 mt-4">
          {data.map(
            (item: {
              id: Key;
              images: string[];
              name: string;
              price: number;
              smallDescription: string;
            }) => (
              <ProductCard
                key={item.id}
                images={item.images}
                name={item.name}
                price={item.price}
                smallDescription={item.smallDescription}
                id={item.id as string} // pass actual product id
              />
            )
          )}
        </div>
      )}
    </section>
  );
}
