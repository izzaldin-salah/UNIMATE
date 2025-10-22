import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { GraduationCap, Home, BookOpen, User, LogOut, BarChart3, Info } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userData: any;
}

export function Navbar({ currentPage, onNavigate, onLogout, userData }: NavbarProps) {
  const initials = userData.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl">UniMate</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              icon={<Home className="w-4 h-4" />}
              label="Home"
              isActive={currentPage === 'home'}
              onClick={() => onNavigate('home')}
            />
            <NavLink
              icon={<Info className="w-4 h-4" />}
              label="About"
              isActive={currentPage === 'learn-more'}
              onClick={() => onNavigate('learn-more')}
            />
            <NavLink
              icon={<BookOpen className="w-4 h-4" />}
              label="Courses"
              isActive={currentPage === 'courses'}
              onClick={() => onNavigate('courses')}
            />
            <NavLink
              icon={<BarChart3 className="w-4 h-4" />}
              label="Dashboard"
              isActive={currentPage === 'dashboard'}
              onClick={() => onNavigate('dashboard')}
            />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={userData.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{userData.name}</span>
                  <span className="text-xs text-muted-foreground">{userData.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavLink({ icon, label, isActive, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
