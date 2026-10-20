import { ErrorScreen } from "@/components/error-screen";
export const metadata = { title: "Something went wrong", robots: { index: false, follow: false } };
export default function Page() { return <ErrorScreen status={500}/>; }
