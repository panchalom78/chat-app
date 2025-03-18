import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    return (
        <header className="bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-lg font-bold">Chatty</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/settings"
                            className="btn btn-sm gap-2 text-base-300"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </Link>
                        {authUser && (
                            <>
                                <Link
                                    to="/profile"
                                    className="btn btn-sm gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    className="flex items-center gap-1.5"
                                    onClick={logout}
                                >
                                    <LogOut className="size-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
