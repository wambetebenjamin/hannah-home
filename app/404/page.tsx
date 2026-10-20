import { ErrorScreen } from "@/components/error-screen";
export const metadata = { title: "Page not found", robots: { index: false, follow: false } };
export default function Page() { return <ErrorScreen/>; }
