export default function Footer(){
    return (
        <footer className="w-full bg-black text-white py-6">
            <div className="max-w6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} Gruppe04
                </p>

                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-400">Impressum</a>
                    <a href="#" className="hover:text-gray-400">Datenschutz</a>
                </div>
            </div>
        </footer>

    );
}