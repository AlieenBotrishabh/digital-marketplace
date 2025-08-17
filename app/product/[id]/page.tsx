import { ProductDescription } from "@/app/components/ProductDescription";
import { prisma } from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";
import { Key } from "react";

async function getData(id : string)
{
    const data = await prisma.product.findUnique({
        where : {
            id : id
        },
        select : {
            category : true,
            description : true,
            smallDescription : true,
            name : true,
            images : true,
            price : true,
            createdAt : true,
            User : {
                select : {
                    profileImage : true,
                    firstName : true
                }
            }
        }
    })

    return data;
}

export default async function ProductPage({params} : {params : {id : string}})
{

    const { id } = await params;
    const data = await getData(id);

    return (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 lg:grid lg:grid-cols-7 lg:gap-x-8">
  <Carousel className="w-[600px] lg:col-span-4">
    <CarouselContent>
      {data?.images.map((items: string, index: Key | null | undefined) => (
        <CarouselItem key={index}>
          <div className="w-[600px] h-[338px] rounded-lg bg-gray-100 overflow-hidden relative">
            <Image
              src={items as string}
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
    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{data?.name}</h1>
    <p className="mt-6 text-gray-500">{data.smallDescription}</p>
    <Button size="lg" className="bg-blue-600 text-white w-full mt-10">
        Buy for ${data?.price}
    </Button>

    <div className="w-full border-t border-gray-200 mt-10 pt-10">
        <div className="grid grid-cols-2 w-full gap-y-3">
            <h3 className="text-sm font-medium text-gray-500 col-span-1">Released:</h3>
            <h3 className="text-sm font-medium col-span-1">{new Intl.DateTimeFormat("en-US", {
                dateStyle : "long"
            }).format(data?.createdAt)}</h3>

            <h3 className="text-sm font-medium text-gray-500 col-span-1">Category:</h3>

            <h3 className="text-sm font-medium col-span-1">{data?.category}</h3>
        </div>
    </div>

    <div className="border-t border-gray-200 mt-10"></div>
  </div>

  <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">
    <ProductDescription content={data?.description as JSONContent} />
  </div>
</section>




    )
}