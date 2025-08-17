// app/actions.ts
"use server";

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { z } from 'zod';
import { prisma } from "./lib/db";

export type State = {
    status: 'error' | "success" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
}

// Define the category enum to match your Prisma schema
const CategoryTypes = z.enum(["template", "uikit", "icon"]);

const productSchema = z.object({
    name: z.string().min(3, { message: 'The name has to be minimum of length 3' }),
    category: CategoryTypes, // Use the enum instead of generic string
    price: z.number().min(1, { message: 'The price has to be bigger than 0' }),
    smallDescription: z.string().min(10, { message: 'Please summarize your text in 10 characters minimum' }),
    description: z.string().min(10, { message: 'Description is required' }),
    images: z.array(z.string()).min(1, { message: "At least one image is required" }),
    productFile: z.string().min(1, { message: "Please upload your product file" })
})

const userSettingSchema = z.object({
    firstName: z.string().min(3, { message: "Minimum length of 3 required" }).or(z.literal("")).optional(),
    lastName: z.string().min(3, { message: "Minimum length of 3 required" }).or(z.literal("")).optional()
})

export async function SellProduct(preState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        throw new Error('Something went wrong');
    }

    // Debug logs
    console.log("Form data received:");
    console.log("name:", formData.get('name'));
    console.log("category:", formData.get('category'));
    console.log("price:", formData.get('price'));
    console.log("smallDescription:", formData.get('smallDescription'));
    console.log("description:", formData.get('description'));
    console.log("images:", formData.get('images'));
    console.log("productFile:", formData.get('productFile'));

    const validateFields = productSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'), // This will now be validated as enum
        price: Number(formData.get('price')),
        smallDescription: formData.get('smallDescription'),
        description: formData.get('description'),
        images: JSON.parse(formData.get('images') as string || '[]'),
        productFile: formData.get('productFile')
    })

    if (!validateFields.success) {
        console.log("Validation errors:", validateFields.error.flatten().fieldErrors);
        
        const state: State = {
            status: 'error',
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Oops, there are errors in your inputs'
        }

        return state;
    }

    await prisma.product.create({
        data: {
            name: validateFields.data.name,
            category: validateFields.data.category, // Now properly typed as CategoryTypes
            smallDescription: validateFields.data.smallDescription,
            price: validateFields.data.price,
            images: validateFields.data.images,
            productFile: validateFields.data.productFile,
            description: JSON.parse(validateFields.data.description),
            // For many-to-many User relation, you use "connect"
            User: {
                connect: { id: user.id }
            }
        }
    });

    const state: State = {
        status: "success",
        message: "Your Product has been created!"
    }

    return state;
}

export async function UpdateUserSettings(preState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        throw new Error("Something went wrong");
    }

    const validateFields = userSettingSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
    })

    if (!validateFields.success) {
        const state: State = {
            status: 'error',
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Oops, I think so there is an error in your inputs'
        }

        return state;
    }

    const data = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            firstName: validateFields.data.firstName,
            lastName: validateFields.data.lastName
        }
    })

    const state: State = {
        status: 'success',
        message: 'Your settings have been updated'
    }

    return state;
}