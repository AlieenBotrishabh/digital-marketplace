import { ProductCard } from "@/app/components/ProductCard";
import { prisma } from "@/app/lib/db";
import { notFound } from "next/navigation";

async function getData(category : string)
{
    let input;

    switch(category)
    {
        case "template" : {
            input = "template";
            break;
        }
        case "uikit" : {
            input = "uikit";
            break;
        }
        case "icon" : {
            input = "icon";
            break;
        }
        case "all" : {
            input = undefined;
        }
        default : {
            return notFound();
        }
    }

    const data = prisma.product.findMany({
        where : {
            category : input,
        },
        select : {
            id : true,
            images : true,
            smallDescription : true,
            name : true,
            price : true,
        }
    })

    return data;
}

export default async function CategoryPage({params} : {params : {category : string}})
{
    const { category } = params;
  const products = await getData(category);
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
                {products.map((product) => (
                    <ProductCard key={product.id} images={product.images} price={product.price} name={product.name} id={product.id} smallDescription={product.smallDescription} />
                ))}
            </div>
        </section>
    )
}