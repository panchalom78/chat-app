import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    MessageSquare,
    User,
} from "lucide-react";
import { Link } from "react-router";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const { isSigningIn, signup } = useAuthStore();

    const validateForm: () => string | boolean = () => {
        if (!formData.fullName.trim())
            return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email))
            return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6)
            return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const success = validateForm();
        if (success) signup(formData);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="flex justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">
                                Create Account
                            </h1>
                            <p className="text-base-content/60">
                                Get started with your free account
                            </p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className="input input-borderd w-full pl-10"
                                    placeholder="Fullname"
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className="input input-borderd w-full pl-10"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-borderd w-full pl-10"
                                    placeholder=""
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        });
                                    }}
                                />
                                <button
                                    className="absolute right-0 inset-y-0 pr-3 flex items-center cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                    }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="text-center">
                            <span>Already have an account? </span>
                            <Link to="/login" className="link link-primary">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
        </div>
    );
};

export default SignUpPage;
