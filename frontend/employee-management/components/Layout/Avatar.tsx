interface AvatarProps {
    name?: string;
    title?: string;
  }
  
  export default function Avatar({ name = "Admin User", title = "Administrator" }: AvatarProps) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#225199] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm sm:text-lg">{name.charAt(0)}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{name}</span>
          <span className="text-xs text-gray-500">{title}</span>
        </div>
      </div>
    );
  }