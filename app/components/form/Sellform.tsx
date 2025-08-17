'use client';

import { SellProduct, type State } from "@/app/actions";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { JSONContent } from "@tiptap/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import SelectCategory from "../SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../Editor";
import { UploadDropzone } from "@uploadthing/react";
import { Submitbutton } from "../SubmitButton";
import type { OurFileRouter } from "@/app/api/uploadthing/core"; // Import your file router type

// Define proper types for upload responses
interface UploadFileResponse {
  url: string;
  key: string;
  name: string;
  size: number;
}

export default function Sellform() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useActionState(SellProduct, initalState);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, setProductFile] = useState<null | string>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>Sell your product with ease</CardTitle>
        <CardDescription>
          Please describe your product here in detail so that it can be sold
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        {/* Name */}
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="product-name">Name</Label>
          <Input
            id="product-name"
            name="name"
            type="text"
            placeholder="Name of your Product"
            required
            minLength={3}
          />
          {state?.errors?.["name"]?.[0] && (
            <p className="text-red-500">{state.errors["name"][0]}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-y-2">
          <Label>Category</Label>
          <SelectCategory />
          {state?.errors?.["category"]?.[0] && (
            <p className="text-red-500">{state.errors["category"][0]}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="product-price">Price</Label>
          <Input
            id="product-price"
            placeholder="29$"
            type="number"
            name="price"
            required
            min={1}
          />
          {state?.errors?.["price"]?.[0] && (
            <p className="text-red-500">{state.errors["price"][0]}</p>
          )}
        </div>

        {/* Small summary */}
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="small-summary">Small Summary</Label>
          <Textarea
            id="small-summary"
            name="smallDescription"
            placeholder="Please describe your product shortly right here..."
            required
            minLength={10}
          />
          {state?.errors?.["smallDescription"]?.[0] && (
            <p className="text-red-500">
              {state.errors["smallDescription"][0]}
            </p>
          )}
        </div>

        {/* Rich Description */}
        <div className="flex flex-col gap-y-2">
          <input
            type="hidden"
            name="description"
            value={JSON.stringify(json)}
          />
          <Label>Description</Label>
          <TipTapEditor json={json} setJson={setJson} />
          {state?.errors?.["description"]?.[0] && (
            <p className="text-red-500">{state.errors["description"][0]}</p>
          )}
        </div>

        {/* Product Images Upload */}
        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          <Label>Product Images</Label>
          <UploadDropzone<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res: UploadFileResponse[]) => {
              setImages(res.map((item) => item.url));
              toast.success("Your images have been uploaded");
            }}
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["images"]?.[0] && (
            <p className="text-red-500">{state.errors["images"][0]}</p>
          )}
        </div>

        {/* Product File Upload */}
        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="productFile" value={productFile ?? ""} />
          <Label>Product File</Label>
          <UploadDropzone<OurFileRouter, "productFileUpload">
            endpoint="productFileUpload"
            onClientUploadComplete={(res: UploadFileResponse[]) => {
              if (res && res.length > 0) {
                const fileUrl = res[0].url;
                setProductFile(fileUrl);
                toast.success("Your Product file has been uploaded!");
              } else {
                toast.error("Upload failed, no file URL received.");
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload error: ${error.message}`);
            }}
          />
          {state?.errors?.["productFile"]?.[0] && (
            <p className="text-red-500">{state.errors["productFile"][0]}</p>
          )}
          {productFile && (
            <p className="text-sm text-green-600">
              File uploaded successfully!
              <a
                href={productFile}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline text-blue-600"
              >
                Preview
              </a>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-5 mb-14">
        <Submitbutton title="Create your Product" />
      </CardFooter>
    </form>
  );
}