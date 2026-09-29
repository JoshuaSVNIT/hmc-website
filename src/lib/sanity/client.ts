import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always fetch live data without CDN cache delays
});

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
