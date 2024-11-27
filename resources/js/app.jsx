import "./bootstrap";
import "../css/app.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "../css/layout.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { LayoutProvider } from "@/Layouts/layout/context/layoutcontext.jsx";
import { PrimeReactProvider } from "primereact/api";
import AuthProvider from "./Provider/authProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider>
                        <PrimeReactProvider>
                            <LayoutProvider>
                                <App {...props} />
                            </LayoutProvider>
                        </PrimeReactProvider>
                    </AuthProvider>
                </PersistGate>
            </Provider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
