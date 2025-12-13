import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
}

const variantClasses = {
	primary:
		"bg-gold text-background hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed",
	secondary:
		"bg-card border border-border text-foreground hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2",
	lg: "px-6 py-3",
};

export function Button({
	variant = "primary",
	size = "md",
	className = "",
	type = "button",
	children,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={`font-medium rounded-lg transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
