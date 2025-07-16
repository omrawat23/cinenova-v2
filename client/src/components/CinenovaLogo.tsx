import { Film } from 'lucide-react';

const CinenovaLogo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      {/* Animated Icon Container */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-blue-500 rounded-lg rotate-45 transform group-hover:rotate-90 transition-transform duration-500" />
        <Film
          className="relative w-5 h-5 text-white left-1.5 top-1.5 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Text Logo */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent group-hover:to-blue-400 transition-colors duration-500">
          CINENOVA
        </h1>
        <div className="h-0.5 w-0 group-hover:w-full bg-blue-500 transition-all duration-500" />
      </div>
    </div>
  );
};

export default CinenovaLogo;