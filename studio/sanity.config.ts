import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Sherlock Holmes Studio",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "qox1gvkg",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
