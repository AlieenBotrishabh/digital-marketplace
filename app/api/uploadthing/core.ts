// 2. Fixed UploadThing Core Configuration
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      return { uploadedBy: metadata.userId };
    }),

  // Fixed productFileUpload configuration
  productFileUpload: f({ 
    // Allow multiple file types, not just zip
    "application/zip": { maxFileCount: 1, maxFileSize: "16MB" },
    "application/pdf": { maxFileCount: 1, maxFileSize: "16MB" },
    "application/msword": { maxFileCount: 1, maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileCount: 1, maxFileSize: "16MB" },
    "text/plain": { maxFileCount: 1, maxFileSize: "16MB" },
    // Add other file types as needed
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product file upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file name", file.name);
      console.log("file size", file.size);

      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;