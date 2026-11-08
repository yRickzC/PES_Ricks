/// <reference types="astro/client" />

// Experimental declarative WebMCP attributes are not yet included in Astro's HTML types.
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    toolname?: string;
    tooldescription?: string;
  }
  interface TextareaHTMLAttributes {
    toolparamdescription?: string;
  }
}
