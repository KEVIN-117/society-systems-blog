import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export default function ArticlesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="flex-grow min-h-screen bg-[#060609] pt-20">
                {children}
            </main>
            <Footer />
        </>
    );
}
