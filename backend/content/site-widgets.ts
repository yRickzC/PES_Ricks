import { createWidgetRegistry } from "./widgets.ts";

// Registre aqui os widgets do site. Build, CLI, cliente e renderizador usam este registro.
// Mantenha este módulo seguro para navegador: sem filesystem, tokens ou imports de node/.
export const siteWidgets = createWidgetRegistry({});
