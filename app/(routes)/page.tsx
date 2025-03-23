'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import WebsiteLoader from "@/components/Loader";
import OverviewComponent from "./dashboard/page";


export default function Overview() {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <WebsiteLoader />;

    let content;
    if (pathname === "/dashboard") {
        content = <OverviewComponent />;
    }
    else {
        content = <div className="text-center text-red-500">Page Not Found</div>;
    }

    return content;
}
