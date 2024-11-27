import React, { useContext, useState } from "react";
import AppMenuitem from "./AppMenuItem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";

const AppMenu = () => {
    const [rangeValues, setRangeValues] = useState([0, 10000]);

    const model = [
        {
            label: "Filter",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: route("dashboard"),
                },
                {
                    label: "Button",
                    icon: "pi pi-fw pi-id-card",
                    to: route("dashboard"),
                },
                {
                    label: "Phones",
                    icon: "pi pi-fw pi-phone",
                    to: route("dashboard"),
                },
                {
                    label: "Laptops",
                    icon: "pi pi-tablet",
                    to: route("dashboard"),
                },
                {
                    label: "PC",
                    icon: "pi pi-fw pi-server",
                    to: route("dashboard"),
                },
                {
                    label: "Other",
                    icon: "pi pi-fw pi-folder",
                    to: route("dashboard"),
                },
            ],
        },
    ];

    return (
        <MenuProvider>
            <div className="ml-12 text-center border-2 border-indigo-200 z-0 rounded h-max">
                <ul className="layout-menu sm:w-48 md:w-72 bg-gray-200 rounded h-max">
                    {model.map((item, i) => {
                        return !item?.seperator ? (
                            <AppMenuitem
                                item={item}
                                root={true}
                                index={i}
                                key={item.label}
                            />
                        ) : (
                            <li className="menu-separator"></li>
                        );
                    })}
                    <div className="border-2">
                        <li className="mt-12">
                            <Slider
                                className="mr-4 ml-4 bg-white"
                                value={rangeValues}
                                onChange={(e) => setRangeValues(e.value)}
                                min={0}
                                max={10000}
                                animate="true"
                                range
                            />
                            <div className="flex flex-row justify-between px-4 mt-2">
                                <span>{rangeValues[0]}€</span>
                                <span>{rangeValues[1]}€</span>
                            </div>
                        </li>
                    </div>
                    <Button
                        label="Apply filters"
                        type="button"
                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mb-4 mt-4 text-semibold py-2 px-2 border border-indigo-700 rounded"
                    />
                </ul>
            </div>
        </MenuProvider>
    );
};

export default AppMenu;
