export default function Footer() {
  return (
    <footer className="bg-white shadow-md text-sm text-gray-500 py-2 px-6 mt-auto border-t">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Monitoring System. All rights reserved.</p>
        <p className="text-xs">Built by Geocircle Indonesia</p>
      </div>
    </footer>
  );
}
