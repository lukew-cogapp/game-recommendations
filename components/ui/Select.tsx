import type { SelectHTMLAttributes } from "react";

export const selectClassName =
	"w-full flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-gold cursor-pointer";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
}

export function Select({ label, children, className, ...props }: SelectProps) {
	return (
		<select
			aria-label={label}
			className={className || selectClassName}
			{...props}
		>
			{children}
		</select>
	);
}
